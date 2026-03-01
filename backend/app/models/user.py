from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum
from app.db.base import Base



class UserRole(str, enum.Enum):
    student = "student"
    instructor = "instructor"
    company_admin = "company_admin"


class AccessStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    pending = "pending"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    description = Column(String, nullable=True)
    education_status = Column(String(100), nullable=True)
    access_status = Column(Enum(AccessStatus), default=AccessStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
