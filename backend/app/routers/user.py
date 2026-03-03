from fastapi import APIRouter, Depends, HTTPException , status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.utils.security import hash_password
from app.utils.autho import get_current_user
from typing import List

router = APIRouter(prefix="/users", 
                   tags=["Users"])


#-- Create a new user --#
@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    # Check username
    existing_username = db.query(User).filter(User.username == user.username).first()
    if existing_username:
        raise HTTPException( status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    # Check email
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    new_user = User(**user.dict())

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

#-- Get all users --#
@router.get ("/" , response_model=List[UserResponse])
def get_all_ussers(db: Session = Depends(get_db) , current_user: int = Depends(get_current_user)):
    users = db.query(User).all()
    return users        


#-- Get user by ID --#
@router.get("/{user_id}" , response_model=UserResponse)
def get_user(user_id : str , db : Session = Depends(get_db) 
            , current_user: int = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

#-- User update --#
@router.put("/{user_id}" , response_model = UserResponse)
def update_user(user_id : str , user_update : UserCreate , db : Session = Depends(get_db)
                , current_user : int = Depends(get_current_user)):
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "User not found")
    
    updated_user = user_update.dict(exclude_unset=True)
    user.update(updated_user)
    db.commit()
    db.refresh(user)
    return user

#-- User delete --#
@router.delete("/{user_id}" , status_code = status.HTTP_204_NO_CONTENT)
def delete_user(user_id : str , db : Session = Depends(get_db) 
                , current_user : int = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND , detail = "User not found")
    
    db.delete(user)
    db.commit()
    return None
          
        

#-- Get user by username --#
@router.get("/username/{username}" , response_model=UserResponse)
def get_user_by_username(username : str , db : Session = Depends(get_db)
                        , current_user : int = Depends(get_current_user)):
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "User not found")
        
    return user 