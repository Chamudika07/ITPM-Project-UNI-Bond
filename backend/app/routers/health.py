from fastapi import APIRouter

from app.core.config import settings
from app.schemas.ai_text import AIServiceHealthResponse
from app.services.text_moderation_service import get_inference_backend, is_model_loaded

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=AIServiceHealthResponse)
def health_check() -> AIServiceHealthResponse:
    """Basic health check for API and AI readiness."""
    return AIServiceHealthResponse(
        status="ok",
        service="UniBond API",
        model_name=settings.ai_text_model_name,
        model_loaded=is_model_loaded(),
        inference_backend=get_inference_backend(),
    )
