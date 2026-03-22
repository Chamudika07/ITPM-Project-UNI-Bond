from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.notice_notification import Notice, Notification
from app.schemas.notice_notification import NoticeCreate, NoticeResponse, NotificationResponse
from app.models.user import User
from app.utils.autho import get_current_user

router = APIRouter(prefix="", tags=["Notices & Notifications"])

# Notices
@router.post("/notices", response_model=NoticeResponse)
def create_notice(notice: NoticeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.value not in ["admin", "lecturer", "company"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to create notices")
        
    db_notice = Notice(
        title=notice.title,
        content=notice.content,
        author_id=current_user.id,
        type=notice.type,
        is_pinned=notice.is_pinned
    )
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    return db_notice

@router.get("/notices", response_model=List[NoticeResponse])
def get_all_notices(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notices = db.query(Notice).order_by(Notice.is_pinned.desc(), Notice.created_at.desc()).all()
    return notices

# Notifications
@router.get("/notifications", response_model=List[NotificationResponse])
def get_user_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    return notifications

@router.put("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
