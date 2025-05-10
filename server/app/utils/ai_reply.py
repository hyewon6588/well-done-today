import time
import os
from typing import List
from openai import OpenAI
from bson import ObjectId
from app.db.mongodb import db

entries_collection = db["entries"]

def format_reflection_prompt(items: List[str]) -> str:
    bullet_list = "\n".join(f"- {item}" for item in items)
    return f"""
        The user wrote a short list of three things they did well today.

        Your job is to write a kind, short, emotionally encouraging reply.

        The reply should sound like a warm message in a friendly email—like from a mentor or supporter.

        Keep it under 3 sentences.

        Here is the user's list:

        {bullet_list}

        Now write your reply:
        """.strip()

def generate_ai_reply(entry_id: str, items: List[str]):
    time.sleep(300)  # 5 minutes delay

    prompt = format_reflection_prompt(items)
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{ "role": "user", "content": prompt }]
        )
        reply = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[AI Error] {e}")
        reply = "AI was unable to generate a reply this time."

    entries_collection.update_one(
        { "_id": ObjectId(entry_id) },
        { "$set": { "ai_reply": reply } }
    )
