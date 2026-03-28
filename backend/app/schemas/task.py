from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: str = ""
    category: str = "General"
    project_type: Literal["Group", "Individual"] = "Individual"
    skills: List[str] = []
    technologies: List[str] = []
    experience_level: str = "Intermediate"
    students_needed: int = 1
    duration: str = ""
    start_date: str = ""
    deadline: str = ""
    stipend: str = ""
    certificate: bool = False
    internship_opportunity: bool = False
    tags: List[str] = []
    contact_email: str = ""
    status: Literal["open", "in_progress", "completed"] = "open"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    project_type: Literal["Group", "Individual"] | None = None
    skills: List[str] | None = None
    technologies: List[str] | None = None
    experience_level: str | None = None
    students_needed: int | None = None
    duration: str | None = None
    start_date: str | None = None
    deadline: str | None = None
    stipend: str | None = None
    certificate: bool | None = None
    internship_opportunity: bool | None = None
    tags: List[str] | None = None
    contact_email: str | None = None
    status: Literal["open", "in_progress", "completed"] | None = None

class TaskApplicantResponse(BaseModel):
    id: int
    user_id: int
    student_name: str
    email: str
    status: Literal["pending", "accepted", "rejected"] = "pending"
    portfolio_url: str | None = None
    cover_letter: str | None = None
    applied_at: datetime

    class Config:
        from_attributes = True

class TaskResponse(TaskBase):
    id: int
    company_id: int
    company_name: str
    created_at: datetime
    applicants: List[TaskApplicantResponse] = []

    class Config:
        from_attributes = True

class TaskApplyRequest(BaseModel):
    portfolio_url: str | None = None
    cover_letter: str | None = None
    email: str | None = None
