from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from enum import Enum
from typing import Optional
import re


class UserRole(str, Enum):
    student = "student"
    lecturer = "lecturer"
    company = "company"
    tech_lead = "tech_lead"
    admin = "admin"


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
    description: Optional[str] = None
    education_status: Optional[str] = None
    # New fields
    city: str
    country: str
    school: Optional[str] = None   # Required for student / lecturer
    mobile: str

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        """Sri Lankan mobile: 10 digits starting with 0 (e.g. 0775078338)"""
        clean = v.strip()
        if not re.fullmatch(r"0\d{9}", clean):
            raise ValueError(
                "Mobile must be 10 digits and start with 0 (e.g. 0775078338)"
            )
        return clean


class UserResponse(BaseModel):
    id: int
    user_code: Optional[str]
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    role: UserRole
    description: Optional[str]
    education_status: Optional[str]
    city: Optional[str]
    country: Optional[str]
    school: Optional[str]
    mobile: Optional[str]
    cv_path: Optional[str]
    access_status: AccessStatus
    created_at: datetime

    class Config:
        from_attributes = True


class UserDiscoverResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: UserRole
    city: Optional[str]
    country: Optional[str]

    class Config:
        from_attributes = True


class FollowStatusResponse(BaseModel):
    is_following: bool


class UserSummaryResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: UserRole
    city: Optional[str]
    country: Optional[str]

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    id: int
    user_code: Optional[str]
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    role: UserRole
    description: Optional[str]
    education_status: Optional[str]
    city: Optional[str]
    country: Optional[str]
    school: Optional[str]
    mobile: Optional[str]
    cv_path: Optional[str]
    access_status: AccessStatus
    created_at: datetime
    followers_count: int
    following_count: int
    is_following: bool
    is_own_profile: bool


class UserStatusUpdate(BaseModel):
    access_status: AccessStatus
