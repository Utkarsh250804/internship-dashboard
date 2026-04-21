from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.user import User, UserRole
from app.utils.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.STUDENT


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = ""
    bio: Optional[str] = ""
    skills: List[str] = []
    mentor_id: Optional[str] = None
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


def user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=str(user.role),
        avatar=user.avatar or "",
        bio=user.bio or "",
        skills=user.skills or [],
        mentor_id=user.mentor_id,
        created_at=user.created_at,
    )


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    try:
        existing = await User.find_one(User.email == user_data.email)

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        user = User(
            name=user_data.name,
            email=user_data.email,
            password=get_password_hash(user_data.password),
            role=user_data.role,
            bio="",
            skills=[],
            avatar="",
            mentor_id=None,
        )

        await user.insert()

        token = create_access_token(
            data={
                "sub": str(user.id),
                "role": str(user.role),
            }
        )

        return Token(
            access_token=token,
            token_type="bearer",
            user=user_to_response(user),
        )

    except HTTPException:
        raise
    except Exception as e:
        print("Register Error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    try:
        user = await User.find_one(User.email == credentials.email)

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not verify_password(credentials.password, user.password):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        token = create_access_token(
            data={
                "sub": str(user.id),
                "role": str(user.role),
            }
        )

        return Token(
            access_token=token,
            token_type="bearer",
            user=user_to_response(user),
        )

    except HTTPException:
        raise
    except Exception as e:
        print("Login Error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return user_to_response(current_user)