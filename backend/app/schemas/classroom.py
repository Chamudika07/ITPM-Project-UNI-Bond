from pydantic import BaseModel
from typing import List
from datetime import datetime

class ClassroomBase(BaseModel):
    title: str
    description: str | None = None
    max_students: int = 50

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomStudentResponse(BaseModel):
    user_id: int
    joined_at: datetime

    class Config:
        from_attributes = True

class ClassroomResponse(ClassroomBase):
    id: int
    tech_lead_id: int
    rating: int
    total_ratings: int
    created_at: datetime
    enrolled_students: List[ClassroomStudentResponse] = []

    class Config:
        from_attributes = True

class ClassroomJoinResponse(BaseModel):
    message: str
