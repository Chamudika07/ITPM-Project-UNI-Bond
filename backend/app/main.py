from fastapi import FastAPI
from app.routers import user , login , post
app = FastAPI(title="Uni Bond ")

@app.get("/")
def root():
    return {"message": "University Student Management System"}


app.include_router(user.router)
app.include_router(login.router)
app.include_router(post.router)
