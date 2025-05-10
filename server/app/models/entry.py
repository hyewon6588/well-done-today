from pydantic import BaseModel, Field
from typing import List
from datetime import date

class EntryCreate(BaseModel):
    items: List[str] = Field(..., min_items=3, max_items=3)

class EntryInDB(BaseModel):
    user_id: str
    date: date
    items: List[str]
    ai_reply: str | None = None
    created_at: str
