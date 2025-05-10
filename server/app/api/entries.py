from fastapi import APIRouter, Depends, HTTPException,BackgroundTasks
from app.models.entry import EntryCreate
from app.db.mongodb import entries_collection
from app.utils.auth import get_current_user
from app.utils.entries import save_entry, get_today_entry
from app.utils.ai_reply import generate_ai_reply

router = APIRouter(prefix="/entries")

@router.post("")
async def create_entry(data: EntryCreate,background_tasks:BackgroundTasks, user=Depends(get_current_user)):
    saved = await save_entry(user_id=str(user["_id"]), items=data.items)
    if not saved:
        raise HTTPException(status_code=400, detail="Entry for today already exists")
    
    background_tasks.add_task(generate_ai_reply, saved,str(user["_id"]), data.items)
    return {"message": "Entry saved", "id": saved}

@router.get("")
async def get_entry_dates(user: dict = Depends(get_current_user)):
    entries = entries_collection.find(
        {"user_id": str(user["_id"])},
        {"_id": 0, "date": 1, "ai_reply": 1}
    ).sort("date", -1)

    result = []
    for entry in entries:
        result.append({
            "date": entry["date"],
            "has_ai_reply": entry.get("ai_reply") is not None
        })
    return result


@router.get("/today")
async def get_today(user=Depends(get_current_user)):
    entry = await get_today_entry(user_id=str(user["_id"]))
    return {"entry": entry}