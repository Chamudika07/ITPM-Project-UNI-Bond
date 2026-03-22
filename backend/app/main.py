from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import user, login, post, group, kuppy, classroom, task, notice_notification, admin
import os

app = FastAPI(title="Uni Bond")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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


@app.get("/")
def root():
    return {"message": "University Student Management System"}
