from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.runtime import configure_runtime_environment

configure_runtime_environment()

import app.models  # noqa: F401
from app.db.base import Base
from app.db.database import engine
from app.routers import (
    admin,
    ai_image,
    ai_text,
    classroom,
    group,
    health,
    kuppy,
    login,
    moderation,
    notice_notification,
    post,
    search,
    task,
    user,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Uni Bond", lifespan=lifespan)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files (CVs, etc.)
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(user.router)
app.include_router(login.router)
app.include_router(post.router)
app.include_router(group.router)
app.include_router(kuppy.router)
app.include_router(classroom.router)
app.include_router(task.router)
app.include_router(notice_notification.router)
app.include_router(admin.router)
app.include_router(search.router)
app.include_router(ai_text.router)
app.include_router(ai_image.router)
app.include_router(moderation.router)
app.include_router(health.router)


@app.get("/")
def root():
    return {"message": "University Student Management System"}
