from beanie import Document
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Comment(BaseModel):
    id: str
    user_id: str
    user_name: str
    content: str
    created_at: datetime = datetime.utcnow()


class Report(Document):
    title: str
    content: str  # markdown content
    student_id: str
    week_number: int
    comments: List[Comment] = []
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        collection = "reports"
