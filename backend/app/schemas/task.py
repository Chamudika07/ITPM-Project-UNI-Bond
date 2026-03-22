from pydantic import BaseModel
from typing import List
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: str | None = None
    requirements: str | None = None
    salary_or_reward: str | None = None
    deadline: str | None = None

class TaskCreate(TaskBase):
    pass

class TaskApplicantResponse(BaseModel):
    user_id: int
    applied_at: datetime

    class Config:
        from_attributes = True

class TaskResponse(TaskBase):
    id: int
    company_id: int
    created_at: datetime
    applicants: List[TaskApplicantResponse] = []

    class Config:
        from_attributes = True

class TaskApplyResponse(BaseModel):
    message: str
