from app.db.mongodb import entries_collection
from datetime import datetime
from bson import ObjectId

async def save_entry(user_id: str, items: list):
    today = datetime.utcnow().date().isoformat()
    existing = entries_collection.find_one({
        "user_id": user_id,
        "date": today
    })
    if existing:
        return None

    entry = {
        "user_id": user_id,
        "date": today,
        "items": items,
        "ai_reply": None,
        "created_at": datetime.utcnow().isoformat()
    }
    result = entries_collection.insert_one(entry)
    return str(result.inserted_id)

async def get_today_entry(user_id: str):
    today = datetime.utcnow().date().isoformat()
    entry = entries_collection.find_one({
        "user_id": user_id,
        "date": today
    })

    if entry:
        entry["_id"] = str(entry["_id"])  # serialize for JSON
        return entry
    return None