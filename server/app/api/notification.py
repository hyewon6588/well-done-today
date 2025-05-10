from fastapi import APIRouter, Depends, Body
from fastapi.responses import JSONResponse
from app.utils.notification import mark_as_read
from app.utils.notification import has_unread
from app.utils.auth import get_current_user

router = APIRouter(prefix="/notifications")

@router.post("/mark-read")
def mark_notification_read(user=Depends(get_current_user), date: str = Body(..., embed=True)):
    mark_as_read(str(user["_id"]), date)
    return {"message": "Marked as read"}

@router.get("/unread")
def get_unread_notification(user=Depends(get_current_user)):
    unread = has_unread(str(user["_id"]))
    return JSONResponse(content={"unread": unread})