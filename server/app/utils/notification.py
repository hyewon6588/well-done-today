from app.db.mongodb import notifications_collection
from bson import ObjectId
from datetime import datetime, timedelta

def mark_as_read(user_id: str, date: str):
    try:
        result=notifications_collection.update_one(
            {
                "user_id": user_id,
                "date":{"$regex": f"^{date}"}
            },
            {"$set": {"read": True}},
            upsert=False
        )
        return {"updated":result.modified_count}
    except Exception as e:
        print(f"[Notification Error] {e}")
        return {"error": str(e)}

def has_unread(user_id: str) -> bool:
    return notifications_collection.find_one({
        "user_id": user_id,
        "read": False
    }) is not None

def insert_unread_notification(user_id: str, date: str):
    # Insert only if it doesn't exist
    notifications_collection.update_one(
        {"user_id": user_id, "date": date},
        {"$setOnInsert": {"read": False}},
        upsert=True
    )