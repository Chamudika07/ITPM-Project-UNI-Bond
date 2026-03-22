from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.task import TaskItem, TaskApplicant
from app.schemas.task import TaskCreate, TaskResponse, TaskApplyResponse
from app.models.user import User
from app.utils.autho import get_current_user

router = APIRouter(prefix="/tasks", tags=["Company Tasks"])

@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.value != "company" and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only companies can create tasks")
        
    db_task = TaskItem(
        company_id=current_user.id,
        title=task.title,
        description=task.description,
        requirements=task.requirements,
        salary_or_reward=task.salary_or_reward,
        deadline=task.deadline
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskResponse])
def get_all_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = db.query(TaskItem).order_by(TaskItem.created_at.desc()).all()
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(TaskItem).filter(TaskItem.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.post("/{task_id}/apply", response_model=TaskApplyResponse)
def apply_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.value != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can apply for tasks")
        
    task = db.query(TaskItem).filter(TaskItem.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    existing_applicant = db.query(TaskApplicant).filter(TaskApplicant.task_id == task_id, TaskApplicant.user_id == current_user.id).first()
    if existing_applicant:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already applied")
        
    applicant = TaskApplicant(task_id=task_id, user_id=current_user.id)
    db.add(applicant)
    db.commit()
    return {"message": "Successfully applied for the task"}
