from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.exc import IntegrityError
from app.db.database import get_db
from app.models.user import User, UserRole, AccessStatus
from app.models.user_follow import UserFollow
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserStatusUpdate,
    UserDiscoverResponse,
    FollowStatusResponse,
    UserSummaryResponse,
    UserProfileResponse,
)
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


def get_user_or_404(user_id: str, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def get_follow_counts(user_id: int, db: Session) -> tuple[int, int]:
    try:
        followers_count = db.query(UserFollow).filter(UserFollow.following_id == user_id).count()
        following_count = db.query(UserFollow).filter(UserFollow.follower_id == user_id).count()
        return followers_count, following_count
    except ProgrammingError as exc:
        db.rollback()
        if "user_follows" in str(exc).lower():
            return 0, 0
        raise


def is_following_user(follower_id: int, following_id: int, db: Session) -> bool:
    try:
        return (
            db.query(UserFollow)
            .filter(
                UserFollow.follower_id == follower_id,
                UserFollow.following_id == following_id,
            )
            .first()
            is not None
        )
    except ProgrammingError as exc:
        db.rollback()
        if "user_follows" in str(exc).lower():
            return False
        raise


def build_user_profile_response(profile_user: User, current_user: User, db: Session) -> UserProfileResponse:
    followers_count, following_count = get_follow_counts(profile_user.id, db)
    return UserProfileResponse(
        id=profile_user.id,
        user_code=profile_user.user_code,
        first_name=profile_user.first_name,
        last_name=profile_user.last_name,
        username=profile_user.username,
        email=profile_user.email,
        role=profile_user.role,
        description=profile_user.description,
        education_status=profile_user.education_status,
        city=profile_user.city,
        country=profile_user.country,
        school=profile_user.school,
        mobile=profile_user.mobile,
        cv_path=profile_user.cv_path,
        access_status=profile_user.access_status,
        created_at=profile_user.created_at,
        followers_count=followers_count,
        following_count=following_count,
        is_following=is_following_user(current_user.id, profile_user.id, db) if profile_user.id != current_user.id else False,
        is_own_profile=profile_user.id == current_user.id,
    )


def raise_follow_feature_unavailable(db: Session, exc: ProgrammingError):
    db.rollback()
    if "user_follows" in str(exc).lower():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Follow system is not initialized yet. Run the latest database migration.",
        )
    raise exc


# --- Get Current User ---
@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


# --- Create a new user (Registration) ---
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    normalized_email = user.email.strip().lower()
    normalized_username = (user.username or normalized_email).strip().lower()
    normalized_mobile = user.mobile.strip()

    # Validate school for student / lecturer
    if user.role in (UserRole.student, UserRole.lecturer) and not user.school:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="School/University is required for students and lecturers."
    )

    # Check username
    if db.query(User).filter(User.username == normalized_username).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    # Check email
    if db.query(User).filter(User.email == normalized_email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists")

    # Check mobile uniqueness
    if normalized_mobile and db.query(User).filter(User.mobile == normalized_mobile).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mobile number already registered")

    # Auto-generate user code
    user_code = generate_user_code(user.role, db)

    has_active_admin = (
        db.query(User)
        .filter(User.role == UserRole.admin, User.access_status == AccessStatus.active)
        .first()
        is not None
    )

    # Bootstrap rule:
    # - students are auto-approved
    # - the first active admin is auto-approved so the system can be managed
    # - everyone else starts pending
    access_status = AccessStatus.pending
    if user.role == UserRole.student:
        access_status = AccessStatus.active
    elif user.role == UserRole.admin and not has_active_admin:
        access_status = AccessStatus.active

    hashed_pw = hash_password(user.password)

    new_user = User(
        user_code=user_code,
        first_name=user.first_name,
        last_name=user.last_name,
        username=normalized_username,
        email=normalized_email,
        password=hashed_pw,
        role=user.role,
        description=user.description,
        education_status=user.education_status,
        city=user.city,
        country=user.country,
        school=user.school,
        mobile=normalized_mobile,
        access_status=access_status,
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed because a unique field already exists. Please check email, mobile number, and username.",
        )
    return new_user


# --- Get all users ---
@router.get("/", response_model=List[UserResponse])
def get_all_users(
    role: UserRole | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(User)
    if role is not None:
        query = query.filter(User.role == role)
    return query.all()


# --- Discover users ---
@router.get("/discover", response_model=List[UserDiscoverResponse])
def discover_users(
    limit: int = Query(default=8, ge=1, le=25),
    roles: List[UserRole] | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(User)
        .filter(User.id != current_user.id)
        .filter(
            or_(
                User.access_status == AccessStatus.active,
                User.access_status.is_(None),
            )
        )
    )

    if roles:
        query = query.filter(User.role.in_(roles))

    return (
        query
        .order_by(User.created_at.desc(), User.id.desc())
        .limit(limit)
        .all()
    )


@router.get("/{user_id}/profile", response_model=UserProfileResponse)
def get_user_profile(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile_user = get_user_or_404(user_id, db)
    return build_user_profile_response(profile_user, current_user, db)


@router.get("/{user_id}/follow-status", response_model=FollowStatusResponse)
def get_user_follow_status(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile_user = get_user_or_404(user_id, db)
    if profile_user.id == current_user.id:
        return FollowStatusResponse(is_following=False)
    try:
        return FollowStatusResponse(
            is_following=is_following_user(current_user.id, profile_user.id, db)
        )
    except ProgrammingError as exc:
        raise_follow_feature_unavailable(db, exc)


@router.post("/{user_id}/follow", response_model=UserProfileResponse)
def follow_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile_user = get_user_or_404(user_id, db)

    if profile_user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot follow yourself")

    try:
        existing_follow = (
            db.query(UserFollow)
            .filter(
                UserFollow.follower_id == current_user.id,
                UserFollow.following_id == profile_user.id,
            )
            .first()
        )
    except ProgrammingError as exc:
        raise_follow_feature_unavailable(db, exc)
    if existing_follow:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You are already following this user")

    follow = UserFollow(follower_id=current_user.id, following_id=profile_user.id)
    try:
        db.add(follow)
        db.commit()
    except ProgrammingError as exc:
        raise_follow_feature_unavailable(db, exc)

    return build_user_profile_response(profile_user, current_user, db)


@router.delete("/{user_id}/follow", response_model=UserProfileResponse)
def unfollow_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile_user = get_user_or_404(user_id, db)

    if profile_user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot unfollow yourself")

    try:
        follow = (
            db.query(UserFollow)
            .filter(
                UserFollow.follower_id == current_user.id,
                UserFollow.following_id == profile_user.id,
            )
            .first()
        )
    except ProgrammingError as exc:
        raise_follow_feature_unavailable(db, exc)
    if not follow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow relationship not found")

    try:
        db.delete(follow)
        db.commit()
    except ProgrammingError as exc:
        raise_follow_feature_unavailable(db, exc)

    return build_user_profile_response(profile_user, current_user, db)


@router.get("/{user_id}/followers", response_model=List[UserSummaryResponse])
def get_user_followers(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_or_404(user_id, db)
    try:
        return (
            db.query(User)
            .join(UserFollow, User.id == UserFollow.follower_id)
            .filter(UserFollow.following_id == user_id)
            .order_by(UserFollow.created_at.desc(), User.id.desc())
            .all()
        )
    except ProgrammingError as exc:
        raise_follow_feature_unavailable(db, exc)


@router.get("/{user_id}/following", response_model=List[UserSummaryResponse])
def get_user_following(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_or_404(user_id, db)
    try:
        return (
            db.query(User)
            .join(UserFollow, User.id == UserFollow.following_id)
            .filter(UserFollow.follower_id == user_id)
            .order_by(UserFollow.created_at.desc(), User.id.desc())
            .all()
        )
    except ProgrammingError as exc:
        raise_follow_feature_unavailable(db, exc)


# --- Get user by ID ---
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db),
             current_user: User = Depends(get_current_user)):
    user = get_user_or_404(user_id, db)
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
