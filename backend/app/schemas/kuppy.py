from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime

class KuppySessionBase(BaseModel):
    title: str
    description: str | None = None
    datetime_schedule: datetime
    points_earned: int = 0

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        clean = value.strip()
        if len(clean) < 5:
            raise ValueError("Topic must be at least 5 characters long")
        return clean

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str | None) -> str | None:
        if value is None:
            return value
        clean = value.strip()
        if len(clean) < 15:
            raise ValueError("Description must be at least 15 characters long")
        return clean

    @field_validator("datetime_schedule")
    @classmethod
    def validate_datetime_schedule(cls, value: datetime) -> datetime:
        now = datetime.now(value.tzinfo) if value.tzinfo else datetime.utcnow()
        if value <= now:
            raise ValueError("Session must be scheduled for a future date and time")
        return value

class KuppySessionCreate(KuppySessionBase):
    pass

class KuppyParticipantResponse(BaseModel):
    user_id: int
    joined_at: datetime

    class Config:
        from_attributes = True

class KuppySessionResponse(KuppySessionBase):
    id: int
    host_id: int
    created_at: datetime
    participants: List[KuppyParticipantResponse] = []

    class Config:
        from_attributes = True

class KuppyJoinResponse(BaseModel):
    message: str
