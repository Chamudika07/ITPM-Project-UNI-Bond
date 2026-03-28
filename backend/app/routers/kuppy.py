from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.kuppy import KuppySession, KuppyParticipant
from app.schemas.kuppy import KuppySessionCreate, KuppySessionResponse, KuppyJoinResponse
from app.models.user import User
from app.utils.autho import get_current_user

router = APIRouter(prefix="/kuppy", tags=["Kuppy Sessions"])

@router.post("/", response_model=KuppySessionResponse)
def create_session(session: KuppySessionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_session = KuppySession(
        host_id=current_user.id,
        title=session.title,
        description=session.description,
        datetime_schedule=session.datetime_schedule,
        points_earned=session.points_earned
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/", response_model=List[KuppySessionResponse])
def get_all_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sessions = db.query(KuppySession).order_by(KuppySession.datetime_schedule.asc()).all()
    return sessions

@router.get("/{session_id}", response_model=KuppySessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(KuppySession).filter(KuppySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session

@router.post("/{session_id}/join", response_model=KuppyJoinResponse)
def join_session(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(KuppySession).filter(KuppySession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        
    if session.host_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You are the host")
        
    existing = db.query(KuppyParticipant).filter(KuppyParticipant.session_id == session_id, KuppyParticipant.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already participating")
        
    participant = KuppyParticipant(session_id=session_id, user_id=current_user.id)
    db.add(participant)
    db.commit()
    return {"message": "Successfully joined the session"}

@router.delete("/{session_id}/leave")
def leave_session(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    participant = db.query(KuppyParticipant).filter(KuppyParticipant.session_id == session_id, KuppyParticipant.user_id == current_user.id).first()
    if not participant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="You are not participating in this session")
        
    db.delete(participant)
    db.commit()
    return {"message": "Successfully left the session"}
