from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File, Form
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.database import get_db
from app.models.post import Post
from app.schemas.post import PostCreate, PostResponse, PostMediaBase, PostInteractionToggleResponse, PostCommentCreate
from app.models.post_media import PostMedia
from app.models.interaction import PostLike, PostRepost, PostComment
from app.models.user import User
from app.utils.autho import get_current_user
from app.utils.file_upload import save_upload_file

router = APIRouter(prefix="/posts", tags=["Posts"])

def format_post(post: Post, current_user_id: int) -> PostResponse:
    post_dict = {
        "id": post.id,
        "content": post.content,
        "created_at": post.created_at,
        "user_id": post.user_id,
        "user": post.user,
        "media": post.media,
        "likes_count": len(post.likes),
        "reposts_count": len(post.reposts),
        "comments_count": len(post.comments),
        "is_liked_by_user": any(like.user_id == current_user_id for like in post.likes),
        "is_reposted_by_user": any(repost.user_id == current_user_id for repost in post.reposts),
        "comments": post.comments
    }
    return PostResponse(**post_dict)

#-- Create Post --#
@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_post = Post(content=post.content, user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Add media if exists
    for media_item in post.media:
        db_media = PostMedia(post_id=db_post.id, media_url=media_item.media_url, media_type=media_item.media_type)
        db.add(db_media)
        
    db.commit()
    db.refresh(db_post)
    return format_post(db_post, current_user.id)


#-- Create Post with File Upload (multipart/form-data) --#
@router.post("/upload", response_model=PostResponse)
async def create_post_with_upload(
    content: Optional[str] = Form(None),          # Post text (optional)
    file: Optional[UploadFile] = File(None),       # Image or video file (optional)
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new post with an optional real file upload.
    Accepts multipart/form-data so the browser can send a local file.
    """
    # Ensure at least content or a file is provided
    if not content and not file:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="A post must have text content, a file, or both."
        )

    # Create the post record first
    db_post = Post(content=content, user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)

    # If a file was uploaded, validate & save it, then create a PostMedia record
    if file and file.filename:
        media_url, media_type = await save_upload_file(file)
        db_media = PostMedia(
            post_id=db_post.id,
            media_url=media_url,
            media_type=media_type
        )
        db.add(db_media)
        db.commit()
        db.refresh(db_post)

    return format_post(db_post, current_user.id)


#-- Get All Post --#
@router.get("/", response_model=list[PostResponse])
def get_all_posts(db: Session = Depends(get_db), skip: int = 0, limit: int = 10, current_user: User = Depends(get_current_user)):
    posts = db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return [format_post(p, current_user.id) for p in posts]

#-- Get Post by ID --#
@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post not found with id {post_id}")
    return format_post(post, current_user.id)

#-- Get Post by User ID --#
@router.get("/user/{user_id}", response_model=list[PostResponse])
def get_posts_by_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reposted_ids = [r[0] for r in db.query(PostRepost.post_id).filter(PostRepost.user_id == user_id).all()]
    
    query = db.query(Post)
    if reposted_ids:
        query = query.filter(or_(Post.user_id == user_id, Post.id.in_(reposted_ids)))
    else:
        query = query.filter(Post.user_id == user_id)
        
    posts = query.order_by(Post.created_at.desc()).all()
    return [format_post(p, current_user.id) for p in posts]

#-- Update Post --#
@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, post_data: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post not found with id {post_id}")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    post.content = post_data.content
    db.query(PostMedia).filter(PostMedia.post_id == post.id).delete()
    
    for media_item in post_data.media:
        new_media = PostMedia(post_id=post.id, media_url=media_item.media_url, media_type=media_item.media_type)
        db.add(new_media)
        
    db.commit()
    db.refresh(post)
    return format_post(post, current_user.id)

#-- Delete Post --#
@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post not found with id {post_id}")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}

#-- Toggle Like --#
@router.post("/{post_id}/like", response_model=PostInteractionToggleResponse)
def toggle_like(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_like = db.query(PostLike).filter(PostLike.post_id == post_id, PostLike.user_id == current_user.id).first()
    if existing_like:
        db.delete(existing_like)
        db.commit()
        status_str = "unliked"
    else:
        new_like = PostLike(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        db.commit()
        status_str = "liked"
        
    count = db.query(PostLike).filter(PostLike.post_id == post_id).count()
    return PostInteractionToggleResponse(status=status_str, count=count)

#-- Toggle Repost --#
@router.post("/{post_id}/repost", response_model=PostInteractionToggleResponse)
def toggle_repost(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_repost = db.query(PostRepost).filter(PostRepost.post_id == post_id, PostRepost.user_id == current_user.id).first()
    if existing_repost:
        db.delete(existing_repost)
        db.commit()
        status_str = "unreposted"
    else:
        new_repost = PostRepost(post_id=post_id, user_id=current_user.id)
        db.add(new_repost)
        db.commit()
        status_str = "reposted"
        
    count = db.query(PostRepost).filter(PostRepost.post_id == post_id).count()
    return PostInteractionToggleResponse(status=status_str, count=count)

#-- Add Comment --#
@router.post("/{post_id}/comments", response_model=PostResponse)
def add_comment(post_id: int, comment: PostCommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    new_comment = PostComment(post_id=post_id, user_id=current_user.id, content=comment.content)
    db.add(new_comment)
    db.commit()
    db.refresh(post)
    return format_post(post, current_user.id)
