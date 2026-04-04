from __future__ import annotations

import json
from pathlib import Path

from fastapi import HTTPException, status
from pydantic import ValidationError

from app.schemas.search import SearchablePost


class SmartSearchRepository:
    """Loads MVP search posts from a local JSON file."""

    def __init__(self, posts_file_path: str) -> None:
        base_dir = Path(__file__).resolve().parents[2]
        raw_path = Path(posts_file_path)
        self.posts_file_path = raw_path if raw_path.is_absolute() else base_dir / raw_path

    def load_posts(self) -> list[SearchablePost]:
        if not self.posts_file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Sample search dataset was not found at '{self.posts_file_path}'.",
            )

        try:
            raw_posts = json.loads(self.posts_file_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Sample search dataset is invalid JSON: {exc}",
            ) from exc

        if not isinstance(raw_posts, list):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Sample search dataset must be a JSON array of posts.",
            )

        try:
            return [SearchablePost.model_validate(item) for item in raw_posts]
        except ValidationError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Sample search dataset contains invalid post data: {exc}",
            ) from exc
