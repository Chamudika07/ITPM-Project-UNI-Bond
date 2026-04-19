from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from app.db.database import get_db
from app.models.task import TaskItem, TaskApplicant
from app.schemas.task import (
    TaskApplicationStatusUpdate,
    TaskApplyRequest,
    TaskCreate,
    TaskRatingCreate,
    TaskResponse,
    TaskSubmissionCreate,
    TaskUpdate,
)
from app.models.user import User
from app.utils.autho import get_current_user

router = APIRouter(prefix="/tasks", tags=["Company Tasks"])

def parse_task_metadata(raw_requirements: str | None) -> dict:
    if not raw_requirements:
        return {}

    try:
        parsed = json.loads(raw_requirements)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    skills = [item.strip() for item in raw_requirements.split(",") if item.strip()]
    return {"skills": skills}


def serialize_task_metadata(task: TaskCreate | TaskUpdate, existing: dict | None = None) -> str:
    metadata = dict(existing or {})
    payload = task.model_dump(exclude_unset=True)
    metadata.update(
        {
            "category": payload.get("category", metadata.get("category", "General")),
            "project_type": payload.get("project_type", metadata.get("project_type", "Individual")),
            "skills": payload.get("skills", metadata.get("skills", [])),
            "technologies": payload.get("technologies", metadata.get("technologies", [])),
            "experience_level": payload.get("experience_level", metadata.get("experience_level", "Intermediate")),
            "students_needed": payload.get("students_needed", metadata.get("students_needed", 1)),
            "duration": payload.get("duration", metadata.get("duration", "")),
            "start_date": payload.get("start_date", metadata.get("start_date", "")),
            "certificate": payload.get("certificate", metadata.get("certificate", False)),
            "internship_opportunity": payload.get("internship_opportunity", metadata.get("internship_opportunity", False)),
            "tags": payload.get("tags", metadata.get("tags", [])),
            "contact_email": payload.get("contact_email", metadata.get("contact_email", "")),
            "status": payload.get("status", metadata.get("status", "open")),
        }
    )
    return json.dumps(metadata)


def build_company_name(company: User | None) -> str:
    if not company:
        return "Unknown Company"
    full_name = f"{company.first_name} {company.last_name}".strip()
    return full_name or company.email


def build_task_response(task: TaskItem) -> TaskResponse:
    metadata = parse_task_metadata(task.requirements)
    applicants = []
    for applicant in task.applicants:
        applicant_user = applicant.user
        applicants.append(
            {
                "id": applicant.id,
                "user_id": applicant.user_id,
                "student_name": f"{applicant_user.first_name} {applicant_user.last_name}".strip() if applicant_user else "Student",
                "email": applicant.email or (applicant_user.email if applicant_user else ""),
                "status": applicant.status or "pending",
                "portfolio_url": applicant.portfolio_url,
                "cover_letter": applicant.cover_letter,
                "submission_url": applicant.submission_url,
                "submitted_at": applicant.submitted_at,
                "company_rating": applicant.company_rating,
                "company_feedback": applicant.company_feedback,
                "rated_at": applicant.rated_at,
                "applied_at": applicant.applied_at,
            }
        )

    return TaskResponse(
        id=task.id,
        company_id=task.company_id,
        company_name=build_company_name(task.company),
        title=task.title,
        description=task.description or "",
        category=metadata.get("category", "General"),
        project_type=metadata.get("project_type", "Individual"),
        skills=metadata.get("skills", []),
        technologies=metadata.get("technologies", []),
        experience_level=metadata.get("experience_level", "Intermediate"),
        students_needed=metadata.get("students_needed", 1),
        duration=metadata.get("duration", ""),
        start_date=metadata.get("start_date", ""),
        deadline=task.deadline or "",
        stipend=task.salary_or_reward or "",
        certificate=metadata.get("certificate", False),
        internship_opportunity=metadata.get("internship_opportunity", False),
        tags=metadata.get("tags", []),
        contact_email=metadata.get("contact_email", ""),
        status=metadata.get("status", "open"),
        created_at=task.created_at,
        applicants=applicants,
    )


def get_task_or_404(task_id: int, db: Session) -> TaskItem:
    task = db.query(TaskItem).filter(TaskItem.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


def get_task_applicant_or_404(task_id: int, applicant_id: int, db: Session) -> TaskApplicant:
    applicant = (
        db.query(TaskApplicant)
        .filter(TaskApplicant.id == applicant_id, TaskApplicant.task_id == task_id)
        .first()
    )
    if not applicant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return applicant


@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.value != "company" and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only companies can create tasks")

    db_task = TaskItem(
        company_id=current_user.id,
        title=task.title,
        description=task.description,
        requirements=serialize_task_metadata(task),
        salary_or_reward=task.stipend,
        deadline=task.deadline
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return build_task_response(db_task)

@router.get("/", response_model=List[TaskResponse])
def get_all_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = db.query(TaskItem).order_by(TaskItem.created_at.desc()).all()
    return [build_task_response(task) for task in tasks]

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task_or_404(task_id, db)
    return build_task_response(task)

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_task = get_task_or_404(task_id, db)

    if current_user.role.value not in {"company", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only companies can update tasks")
    if current_user.role.value != "admin" and db_task.company_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this task")

    payload = task_update.model_dump(exclude_unset=True)
    if "title" in payload:
        db_task.title = payload["title"]
    if "description" in payload:
        db_task.description = payload["description"]
    if "deadline" in payload:
        db_task.deadline = payload["deadline"]
    if "stipend" in payload:
        db_task.salary_or_reward = payload["stipend"]

    db_task.requirements = serialize_task_metadata(task_update, parse_task_metadata(db_task.requirements))
    db.commit()
    db.refresh(db_task)
    return build_task_response(db_task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_task = get_task_or_404(task_id, db)

    if current_user.role.value not in {"company", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only companies can delete tasks")
    if current_user.role.value != "admin" and db_task.company_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this task")

    db.delete(db_task)
    db.commit()
    return None


@router.post("/{task_id}/apply", response_model=TaskResponse)
def apply_task(
    task_id: int,
    application: TaskApplyRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can apply for tasks")

    task = get_task_or_404(task_id, db)

    existing_applicant = db.query(TaskApplicant).filter(TaskApplicant.task_id == task_id, TaskApplicant.user_id == current_user.id).first()
    if existing_applicant:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already applied")

    applicant = TaskApplicant(task_id=task_id, user_id=current_user.id)
    applicant.email = application.email if application else current_user.email
    applicant.portfolio_url = application.portfolio_url if application else None
    applicant.cover_letter = application.cover_letter if application else None
    db.add(applicant)
    db.commit()
    db.refresh(task)
    return build_task_response(task)


@router.delete("/{task_id}/apply", response_model=TaskResponse)
def withdraw_task_application(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.value != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can withdraw applications")

    task = get_task_or_404(task_id, db)
    existing_applicant = db.query(TaskApplicant).filter(TaskApplicant.task_id == task_id, TaskApplicant.user_id == current_user.id).first()
    if not existing_applicant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    db.delete(existing_applicant)
    db.commit()
    db.refresh(task)
    return build_task_response(task)


@router.patch("/{task_id}/applications/{applicant_id}", response_model=TaskResponse)
def update_task_application(
    task_id: int,
    applicant_id: int,
    payload: TaskApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_task_or_404(task_id, db)

    if current_user.role.value not in {"company", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only companies can review applications")
    if current_user.role.value != "admin" and task.company_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to review this application")

    applicant = get_task_applicant_or_404(task_id, applicant_id, db)
    applicant.status = payload.status
    db.commit()
    db.refresh(task)
    return build_task_response(task)


@router.post("/{task_id}/applications/{applicant_id}/submit", response_model=TaskResponse)
def submit_task_work(
    task_id: int,
    applicant_id: int,
    payload: TaskSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_task_or_404(task_id, db)
    applicant = get_task_applicant_or_404(task_id, applicant_id, db)

    if current_user.role.value != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can submit work")
    if applicant.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to submit for this task")
    if applicant.status != "accepted":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This task must be accepted before submission")

    applicant.submission_url = payload.submission_url
    applicant.submitted_at = datetime.now(timezone.utc)
    applicant.status = "submitted"
    db.commit()
    db.refresh(task)
    return build_task_response(task)


@router.post("/{task_id}/applications/{applicant_id}/rate", response_model=TaskResponse)
def rate_task_applicant(
    task_id: int,
    applicant_id: int,
    payload: TaskRatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_task_or_404(task_id, db)

    if current_user.role.value not in {"company", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only companies can rate students")
    if current_user.role.value != "admin" and task.company_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to rate this student")

    applicant = get_task_applicant_or_404(task_id, applicant_id, db)
    if not applicant.submission_url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The student must submit work before receiving a rating")

    applicant.company_rating = payload.rating
    applicant.company_feedback = payload.feedback
    applicant.rated_at = datetime.now(timezone.utc)
    applicant.status = "completed"
    db.commit()
    db.refresh(task)
    return build_task_response(task)
