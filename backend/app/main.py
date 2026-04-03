from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, login, post, opportunity

app = FastAPI(title="Uni Bond - University Student Management System")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "University Student Management System",
        "version": "1.0.0",
        "endpoints": {
            "users": "/users",
            "posts": "/posts",
            "opportunities": "/opportunities",
            "tasks": "/opportunities/tasks",
            "applications": "/opportunities/applications",
            "submissions": "/opportunities/submissions",
            "notifications": "/opportunities/notifications",
            "dashboard": "/opportunities/dashboard"
        }
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


app.include_router(user.router)
app.include_router(login.router)
app.include_router(post.router)
app.include_router(opportunity.router)
