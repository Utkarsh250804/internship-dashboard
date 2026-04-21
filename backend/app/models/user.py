from beanie import Document
from pydantic import EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    MENTOR = "mentor"


class User(Document):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.STUDENT
    avatar: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = []
    mentor_id: Optional[str] = None  # for students: assigned mentor's ID
    created_at: datetime = datetime.utcnow()

    class Settings:
        collection = "users"
