from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class TaskItem(Base): 
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True) # comma separated
    salary_or_reward = Column(String(255), nullable=True)
    deadline = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("User")
    applicants = relationship("TaskApplicant", back_populates="task", cascade="all, delete-orphan")

class TaskApplicant(Base):
    __tablename__ = "task_applicants"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    email = Column(String(255), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    cover_letter = Column(Text, nullable=True)
    submission_url = Column(String(500), nullable=True)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    company_rating = Column(Integer, nullable=True)
    company_feedback = Column(Text, nullable=True)
    rated_at = Column(DateTime(timezone=True), nullable=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    task = relationship("TaskItem", back_populates="applicants")
    user = relationship("User")
