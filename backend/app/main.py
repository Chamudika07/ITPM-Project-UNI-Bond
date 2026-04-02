from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user , login , post

app = FastAPI(title="Uni Bond ")

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
    return {"message": "University Student Management System"}


app.include_router(user.router)
app.include_router(login.router)
app.include_router(post.router)
