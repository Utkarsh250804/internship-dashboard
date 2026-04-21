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
            "id": str(student.id),
            "name": student.name,
            "email": student.email,
            "skills": student.skills or [],
            "bio": student.bio or "",
            "avatar": student.avatar or "",
        }
        for student in students
    ]


@router.get("/all-students")
async def get_all_students(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Access denied")

    students = await User.find(User.role == UserRole.STUDENT).to_list()

    return [
        {
            "id": str(student.id),
            "name": student.name,
            "email": student.email,
            "mentor_id": student.mentor_id,
            "skills": student.skills or [],
        }
        for student in students
    ]


@router.put("/assign/{student_id}")
async def assign_student(
    student_id: str,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        student = await User.get(PydanticObjectId(student_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Student not found")

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if student.role != UserRole.STUDENT:
        raise HTTPException(status_code=400, detail="Selected user is not a student")

    student.mentor_id = str(current_user.id)
    await student.save()

    return {"message": "Student assigned successfully"}


@router.put("/profile")
async def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user)
):
    try:
        if data.name is not None:
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
            "role": str(current_user.role),
            "bio": current_user.bio or "",
            "skills": current_user.skills or [],
            "avatar": current_user.avatar or "",
            "mentor_id": current_user.mentor_id,
            "created_at": current_user.created_at.isoformat(),
        }

    except Exception as e:
        print("Profile Update Error:", e)
        raise HTTPException(status_code=500, detail=str(e))