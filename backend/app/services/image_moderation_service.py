from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import torch
from fastapi import HTTPException, UploadFile, status
from torchvision.models import MobileNet_V3_Large_Weights, mobilenet_v3_large

from app.core.config import settings
from app.core.image_moderation import (
    REVIEW_KEYWORDS,
    STUDY_RELATED_KEYWORDS,
    UNRELATED_KEYWORDS,
)
from app.schemas.ai_image import ImageModerationResponse, ImagePredictionCandidate
from app.utils.image_moderation import load_image_from_bytes, read_and_validate_image_upload


@dataclass
class _ImageClassifierBundle:
    model: Any
    weights: MobileNet_V3_Large_Weights
    categories: list[str]


_classifier_bundle: _ImageClassifierBundle | None = None
_classifier_load_attempted = False
_classifier_load_error: str | None = None


def _get_image_classifier() -> _ImageClassifierBundle | None:
    """Load the pretrained MobileNet model lazily on first use."""
    global _classifier_bundle, _classifier_load_attempted, _classifier_load_error

    if _classifier_bundle is not None:
        return _classifier_bundle

    if _classifier_load_attempted:
        return None

    _classifier_load_attempted = True

    try:
        weights = MobileNet_V3_Large_Weights.DEFAULT
        model = mobilenet_v3_large(weights=weights)
        model.eval()
        _classifier_bundle = _ImageClassifierBundle(
            model=model,
            weights=weights,
            categories=list(weights.meta["categories"]),
        )
    except Exception as exc:  # pragma: no cover - depends on local runtime and model download
        _classifier_load_error = str(exc)
        return None

    return _classifier_bundle


def is_image_model_loaded() -> bool:
    return _classifier_bundle is not None


def get_image_inference_backend() -> str:
    return "torchvision_imagenet" if is_image_model_loaded() else "unavailable"


def get_image_model_error() -> str | None:
    return _classifier_load_error


def get_image_model_name() -> str:
    return settings.ai_image_model_name


async def moderate_image_upload(file: UploadFile) -> ImageModerationResponse:
    """Moderate an uploaded image for UniBond's Phase 2 MVP."""
    filename, content_type, file_bytes = await read_and_validate_image_upload(file)
    classifier_bundle = _get_image_classifier()

    if classifier_bundle is None:
        detail = _classifier_load_error or "The image moderation model is not available."
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Image moderation service unavailable. {detail}",
        )

    image = load_image_from_bytes(file_bytes)
    top_predictions = _predict_top_labels(image, classifier_bundle)
    top_prediction = top_predictions[0]
    moderation_status, explanation = _apply_business_rules(
        predicted_label=top_prediction.label,
        confidence=top_prediction.confidence,
        top_predictions=top_predictions,
    )

    return ImageModerationResponse(
        filename=filename,
        content_type=content_type,
        predicted_label=top_prediction.label,
        confidence=_format_confidence(top_prediction.confidence),
        confidence_percentage=_format_confidence_percentage(top_prediction.confidence),
        confidence_level=_get_confidence_level(top_prediction.confidence),
        moderation_status=moderation_status,
        is_allowed=moderation_status == "allowed",
        explanation=explanation,
        top_predictions=[
            ImagePredictionCandidate(
                label=prediction.label,
                confidence=_format_confidence(prediction.confidence),
            )
            for prediction in top_predictions
        ],
    )


def _predict_top_labels(
    image: Any,
    classifier_bundle: _ImageClassifierBundle,
) -> list[ImagePredictionCandidate]:
    preprocess = classifier_bundle.weights.transforms()
    input_tensor = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        logits = classifier_bundle.model(input_tensor)
        probabilities = torch.nn.functional.softmax(logits[0], dim=0)
        top_probabilities, top_indices = probabilities.topk(settings.ai_image_top_k)

    predictions: list[ImagePredictionCandidate] = []
    for probability, index in zip(top_probabilities.tolist(), top_indices.tolist()):
        predictions.append(
            ImagePredictionCandidate(
                label=_normalize_label(classifier_bundle.categories[index]),
                confidence=float(probability),
            )
        )

    return predictions


def _apply_business_rules(
    predicted_label: str,
    confidence: float,
    top_predictions: list[ImagePredictionCandidate],
) -> tuple[str, str]:
    normalized_labels = [
        _normalize_label(prediction.label) for prediction in top_predictions
    ]

    unrelated_match = _find_keyword_match(normalized_labels, UNRELATED_KEYWORDS)
    if unrelated_match:
        return (
            "review",
            f"This image looks more like unrelated content because the model strongly matched '{unrelated_match}'.",
        )

    study_match = _find_keyword_match(normalized_labels, STUDY_RELATED_KEYWORDS)
    if study_match:
        if confidence >= settings.ai_image_confidence_threshold:
            return (
                "allowed",
                f"This image looks relevant to study activity because the model mainly detected '{study_match}'.",
            )
        return (
            "review",
            f"This image may be study-related because the model detected '{study_match}', but the confidence is not strong enough to auto-allow it.",
        )

    review_match = _find_keyword_match(normalized_labels, REVIEW_KEYWORDS)
    if review_match:
        return (
            "review",
            f"This image may contain everyday or mixed-purpose content because the model matched '{review_match}', so review is safer.",
        )

    if confidence < settings.ai_image_confidence_threshold:
        return (
            "review",
            "The model was not confident enough to classify this image as clearly study-related, so it should be reviewed.",
        )

    if any(word in predicted_label for word in {"screen", "computer", "keyboard"}):
        return (
            "allowed",
            f"This image looks relevant to study or coursework because the model detected a computer-related object: '{predicted_label}'.",
        )

    return (
        "review",
        f"The model predicted '{predicted_label}', which is not enough by itself to confirm educational relevance.",
    )


def _find_keyword_match(labels: list[str], keywords: set[str]) -> str | None:
    for label in labels:
        for keyword in keywords:
            if keyword in label:
                return label
    return None


def _normalize_label(label: str) -> str:
    return label.replace("_", " ").strip().lower()


def _format_confidence(value: float) -> float:
    return round(float(value), 2)


def _format_confidence_percentage(value: float) -> str:
    return f"{float(value) * 100:.2f}%"


def _get_confidence_level(value: float) -> str:
    if value >= 0.75:
        return "high"
    if value >= 0.45:
        return "medium"
    return "low"
