from sqlalchemy import Column, String, DateTime, Enum , Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base import Base



class UserRole(str, enum.Enum):
    student = "student"
    instructor = "instructor"
    company_admin = "company_admin"
    tech_lead = "tech_lead"


class AccessStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    pending = "pending"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
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
    
    #--relationship --#
    posts = relationship("Post", back_populates="user")

