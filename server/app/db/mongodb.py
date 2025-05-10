from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["well_done_today"]
users_collection = db["users"]
entries_collection = db["entries"]
notifications_collection = db["notifications"]