from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    student = "student"
    instructor = "instructor"
    company_admin = "company_admin"
    tech_lead = "tech_lead"


class AccessStatus(str, Enum):
    active = "active"
    suspended = "suspended"
    pending = "pending"


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    password: str
    role: UserRole
    description: str | None = None
    education_status: str | None = None


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    role: UserRole
    description: str | None
    education_status: str | None
    access_status: AccessStatus
    created_at: datetime

    class Config:
        from_attributes = True
