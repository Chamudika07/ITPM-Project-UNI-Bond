
from fastapi import APIRouter, Depends, HTTPException , status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.login import UserLogin , Token 
from app.utils.security import hash_password , verify_password
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from app.utils.autho import create_access_token

router = APIRouter(prefix="/users", 
                   tags=["Login"])

#-- Login Router --#
@router.post("/login", response_model=Token)
def login_user(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == user_credentials.username).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid Credentials")
    
    if not verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid password Credentials")
    
    # create a token
    access_token = create_access_token(data={"user_id": user.id})
    
    return {"access_token": access_token, "token_type": "bearer"}