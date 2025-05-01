from fastapi import FastAPI
from app.api import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "WellDoneToday backend is running"}
