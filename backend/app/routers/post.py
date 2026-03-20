from fastapi import APIRouter , Depends , status , HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.post import Post
from app.schemas.post import PostCreate , PostResponse , PostMediaBase
from app.models.post_media import PostMedia
from app.models.user import User
from app.utils.autho import get_current_user


router = APIRouter(prefix = "/posts",
                   tags=["Posts"])


#-- Create Post --#
@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db)
                , current_user: User = Depends(get_current_user)):

    db_post = Post(
        content=post.content,
        user_id=current_user.id
    )

    db.add(db_post)
    db.commit()
    db.refresh(db_post)

    # Add media if exists
    for media_item in post.media:
        db_media = PostMedia(
            post_id=db_post.id,
            media_url=media_item.media_url,
            media_type=media_item.media_type
        )
        db.add(db_media)

    db.commit()
    db.refresh(db_post)

    return db_post

#-- Get All Post --#
@router.get("/", response_model=list[PostResponse])
def get_all_posts(db: Session = Depends(get_db) , skip: int = 0 , limit: int = 10 
                  , current_user : User = Depends(get_current_user)):
    
    # Get all posts in db
    posts = db.query(Post)\
        .order_by(Post.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

    return posts

#-- Get Post by ID --#
@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: str, db: Session = Depends(get_db) 
             , current_user : User = Depends(get_current_user)):
    # Get post by ID
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND
                            , detail=f"Post not found with id {post_id}")

    return post

#-- Get Post by User ID --#
@router.get("/user/{user_id}", response_model=list[PostResponse])
def get_posts_by_user( user_id: str , db: Session = Depends(get_db)
                      ,current_user : User = Depends(get_current_user)):
    
    posts = db.query(Post)\
        .filter(Post.user_id == user_id)\
        .order_by(Post.created_at.desc())\
        .all()

    return posts

#-- Update Post --#
@router.put("/{post_id}", response_model=PostResponse)
def update_post( post_id: str , post_data: PostCreate , db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    
    # Get post by ID
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND 
                            , detail = f"Post not found with id {post_id}")

    if post.user_id != current_user.id:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN 
                            , detail="Not authorized")

    # Update content
    post.content = post_data.content

    # Delete old media
    db.query(PostMedia).filter(PostMedia.post_id == post.id).delete()

    # Add new media
    for media_item in post_data.media:
        new_media = PostMedia(
            post_id=post.id,
            media_url=media_item.media_url,
            media_type=media_item.media_type
        )
        db.add(new_media)

    db.commit()
    db.refresh(post)

    return post

#-- Delete Post --#
@router.delete("/{post_id}")
def delete_post( post_id: str , db: Session = Depends(get_db) , current_user: User = Depends(get_current_user)):
    #Get post by ID
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND
                            , detail=f"Post not found with id {post_id}")

    if post.user_id != current_user.id:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN 
                            , detail="Not authorized")

    db.delete(post)
    db.commit()

    return {"message": "Post deleted successfully"}



