from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.models.user import User, UserRole
from app.utils.auth import get_current_user
from beanie import PydanticObjectId

router = APIRouter(prefix="/users", tags=["Users"])


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    avatar: Optional[str] = None


# ✅ Mentor ke assigned students
@router.get("/students")
async def get_my_students(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Access denied")

    students = await User.find(
        User.role == UserRole.STUDENT,
        User.mentor_id == str(current_user.id),
    ).to_list()

    return [
        {
            "id": str(s.id),
            "name": s.name,
            "email": s.email,
            "skills": s.skills,
            "bio": s.bio
        }
        for s in students
    ]


# ✅ Sab students (assign/unassign ke liye)
@router.get("/all-students")
async def get_all_students(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Access denied")

    students = await User.find(User.role == UserRole.STUDENT).to_list()

    return [
        {
            "id": str(s.id),
            "name": s.name,
            "email": s.email,
            "mentor_id": s.mentor_id
        }
        for s in students
    ]


# ✅ 🔥 ASSIGN + UNASSIGN (TOGGLE)
@router.put("/assign-toggle/{student_id}")
async def assign_toggle(student_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        student = await User.get(PydanticObjectId(student_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Student not found")

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 🔁 Toggle Logic
    if student.mentor_id:
        student.mentor_id = None
        msg = "Student Unassigned"
    else:
        student.mentor_id = str(current_user.id)
        msg = "Student Assigned"

    await student.save()

    return {"message": msg}


# ❌ (optional) purana assign hata sakte ho
# @router.put("/assign/{student_id}")  <-- remove kar do


# ✅ Profile update
@router.put("/profile")
async def update_profile(data: ProfileUpdate, current_user: User = Depends(get_current_user)):
    if data.name:
        current_user.name = data.name
    if data.bio is not None:
        current_user.bio = data.bio
    if data.skills is not None:
        current_user.skills = data.skills
    if data.avatar is not None:
        current_user.avatar = data.avatar

    await current_user.save()

    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "bio": current_user.bio,
        "skills": current_user.skills,
        "avatar": current_user.avatar,
        "created_at": current_user.created_at.isoformat(),
    }