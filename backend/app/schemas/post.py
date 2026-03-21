from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


#-- Base model schemas for Post and PostMedia --#
#-- Request schemas --#
class PostMediaBase(BaseModel):
    media_url: str
    media_type: str


class PostCreate(BaseModel):
    content: Optional[str] = None
    media: Optional[List[PostMediaBase]] = []
    
    

#-- Response schemas --#        
class PostMediaResponse(PostMediaBase):
    id: str

    class Config:
        orm_mode = True


class PostResponse(BaseModel):
    id: str
    content: str | None
    created_at: datetime
    user_id: str
    media: List[PostMediaResponse] = []

    class Config:
        orm_mode = True

