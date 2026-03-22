from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, UserRole, AccessStatus
from app.schemas.user import UserCreate, UserResponse, UserStatusUpdate
from app.utils.security import hash_password
from app.utils.autho import get_current_user
from typing import List
import os
import shutil
import uuid

router = APIRouter(prefix="/users", tags=["Users"])

UPLOAD_DIR = "uploads/cvs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Role code prefix & zero-pad helper ---
ROLE_PREFIX = {
    UserRole.student:   ("STD", 4),
    UserRole.lecturer:  ("LEC", 4),
    UserRole.company:   ("COM", 4),
    UserRole.tech_lead: ("TLE", 4),
    UserRole.admin:     ("AD",  2),
}


def generate_user_code(role: UserRole, db: Session) -> str:
    prefix, pad = ROLE_PREFIX[role]
    count = db.query(User).filter(User.role == role).count()
    num = count + 1
    return f"{prefix}{str(num).zfill(pad)}"


# --- Get Current User ---
@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


# --- Create a new user (Registration) ---
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    # Validate school for student / lecturer
    if user.role in (UserRole.student, UserRole.lecturer) and not user.school:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="School/University is required for students and lecturers."
        )

    # Check username
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    # Check email
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    # Check mobile uniqueness
    if user.mobile and db.query(User).filter(User.mobile == user.mobile).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mobile number already registered")

    # Auto-generate user code
    user_code = generate_user_code(user.role, db)

    # Students are auto-approved; all others start as pending
    access_status = (
        AccessStatus.active if user.role == UserRole.student else AccessStatus.pending
    )

    hashed_pw = hash_password(user.password)

    new_user = User(
        user_code=user_code,
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        email=user.email,
        password=hashed_pw,
        role=user.role,
        description=user.description,
        education_status=user.education_status,
        city=user.city,
        country=user.country,
        school=user.school,
        mobile=user.mobile,
        access_status=access_status,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# --- Get all users ---
@router.get("/", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(User).all()


# --- Get user by ID ---
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db),
             current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


# --- Update user ---
@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: str, user_update: UserCreate,
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    if str(current_user.id) != str(user_id) and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this user")

    user_q = db.query(User).filter(User.id == user_id)
    user_obj = user_q.first()
    if not user_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = user_update.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])

    user_q.update(update_data, synchronize_session=False)
    db.commit()
    db.refresh(user_obj)
    return user_obj


# --- Delete user ---
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    if str(current_user.id) != str(user_id) and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this user")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
    return None


# --- Get user by username ---
@router.get("/username/{username}", response_model=UserResponse)
def get_user_by_username(username: str, db: Session = Depends(get_db),
                         current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


# --- Upload CV ---
@router.post("/{user_id}/cv", response_model=UserResponse)
def upload_cv(user_id: str, file: UploadFile = File(...),
              db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    if str(current_user.id) != str(user_id) and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Validate file type
    allowed = {"application/pdf", "application/msword",
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Only PDF and Word documents are accepted.")

    ext = os.path.splitext(file.filename or "cv.pdf")[1] or ".pdf"
    filename = f"{user_id}_{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Remove old file if exists
    if user.cv_path and os.path.exists(user.cv_path):
        try:
            os.remove(user.cv_path)
        except OSError:
            pass

    user.cv_path = filepath
    db.commit()
    db.refresh(user)
    return user


# --- Download CV ---
@router.get("/{user_id}/cv/download")
def download_cv(user_id: str, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.cv_path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CV not found")
    if not os.path.exists(user.cv_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CV file missing on server")
    return FileResponse(user.cv_path, filename=f"{user.first_name}_{user.last_name}_CV{os.path.splitext(user.cv_path)[1]}")