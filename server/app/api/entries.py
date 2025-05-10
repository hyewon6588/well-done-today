from fastapi import APIRouter, Depends, HTTPException
from app.models.entry import EntryCreate
from app.utils.auth import get_current_user
from app.utils.entries import save_entry

router = APIRouter(prefix="/entries")

@router.post("")
async def create_entry(data: EntryCreate, user=Depends(get_current_user)):
    saved = await save_entry(user_id=str(user["_id"]), items=data.items)
    if not saved:
        raise HTTPException(status_code=400, detail="Entry for today already exists")
    return {"message": "Entry saved", "id": saved}
