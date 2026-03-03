from pydantic import BaseModel , EmailStr
from typing import Optional

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class Token(BaseModel):
    access_token: str
    token_type: str
    
#this is to store the data we encoded in the token
class TokenData(BaseModel):
    id: Optional[int] = None
    
