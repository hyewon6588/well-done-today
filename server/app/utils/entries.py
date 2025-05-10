from app.db.mongodb import entries_collection
from datetime import datetime

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
