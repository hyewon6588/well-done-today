from fastapi import APIRouter, HTTPException
from app.db.mongodb import users_collection
from app.utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth")

@router.post("/register")
def register_user(user: dict):
    if users_collection.find_one({"email": user["email"]}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user["password"] = hash_password(user["password"])
    users_collection.insert_one(user)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: dict):
    db_user = users_collection.find_one({"email": user["email"]})
    if not db_user or not verify_password(user["password"], db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(db_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}
