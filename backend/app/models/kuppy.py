from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class KuppySession(Base):
    __tablename__ = "kuppy_sessions"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    datetime_schedule = Column(DateTime(timezone=True), nullable=False)
    points_earned = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    host = relationship("User")
    participants = relationship("KuppyParticipant", back_populates="session", cascade="all, delete-orphan")


class KuppyParticipant(Base):
    __tablename__ = "kuppy_participants"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("kuppy_sessions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("KuppySession", back_populates="participants")
    user = relationship("User")
