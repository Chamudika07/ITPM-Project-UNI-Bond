from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ImagePredictionCandidate(BaseModel):
    """Single model candidate kept for debugging and UI transparency."""

    label: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class ImageModerationResponse(BaseModel):
    """Successful moderation response for an uploaded image."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "filename": "notes-photo.jpg",
                "content_type": "image/jpeg",
                "predicted_label": "laptop",
                "confidence": 0.87,
                "confidence_percentage": "87.00%",
                "confidence_level": "high",
                "moderation_status": "allowed",
                "is_allowed": True,
                "explanation": "This image looks relevant to study activity because the model mainly detected a laptop or computer-like setup.",
                "top_predictions": [
                    {"label": "laptop", "confidence": 0.87},
                    {"label": "desktop computer", "confidence": 0.08},
                ],
            }
        }
    )

    filename: str
    content_type: str
    predicted_label: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    confidence_percentage: str
    confidence_level: Literal["low", "medium", "high"]
    moderation_status: Literal["allowed", "review", "rejected"]
    is_allowed: bool
    explanation: str
    top_predictions: list[ImagePredictionCandidate]


class ImageModerationErrorResponse(BaseModel):
    """Reusable error schema for image moderation failures."""

    detail: str


class AIModelComponentHealth(BaseModel):
    """Readiness payload for a single AI module."""

    model_name: str
    model_loaded: bool
    inference_backend: str
    detail: str | None = None


class AIServiceHealthResponse(BaseModel):
    """Combined health response for UniBond AI services."""

    status: Literal["ok"]
    service: str
    text_ai: AIModelComponentHealth
    image_ai: AIModelComponentHealth
