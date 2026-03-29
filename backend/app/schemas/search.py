from datetime import datetime
from typing import Literal

from pydantic import BaseModel


SearchEntityType = Literal["user", "post", "group", "notice", "task"]


class SearchResultResponse(BaseModel):
    id: str
    type: SearchEntityType
    title: str
    description: str
    subtitle: str | None = None
    href: str
    avatar: str | None = None
    created_at: datetime | None = None
    is_study_related: bool = False


class SearchResponse(BaseModel):
    query: str
    total: int
    results: list[SearchResultResponse]
