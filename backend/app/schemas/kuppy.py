from pydantic import BaseModel
from typing import List
from datetime import datetime

class KuppySessionBase(BaseModel):
    title: str
    description: str | None = None
    datetime_schedule: datetime
    points_earned: int = 0

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
