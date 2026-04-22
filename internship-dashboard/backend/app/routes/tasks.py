from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.task import Task, TaskStatus, TaskPriority
from app.models.user import User, UserRole
from app.models.notification import Notification
from app.utils.auth import get_current_user
from beanie import PydanticObjectId

router = APIRouter(prefix="/tasks", tags=["Tasks"])


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    assigned_to: str
    due_date: Optional[datetime] = None
    tags: List[str] = []


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None


def task_to_dict(task: Task) -> dict:
    return {
        "id": str(task.id),
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "assigned_to": task.assigned_to,
        "created_by": task.created_by,
        "due_date": task.due_date.isoformat() if task.due_date else None,
        "tags": task.tags,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
    }


@router.get("/")
async def get_tasks(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == UserRole.MENTOR:
        tasks = await Task.find(Task.created_by == str(current_user.id)).to_list()
    else:
        tasks = await Task.find(Task.assigned_to == str(current_user.id)).to_list()

    if status:
        tasks = [t for t in tasks if t.status == status]
    if search:
        search_lower = search.lower()
        tasks = [
            t for t in tasks
            if search_lower in t.title.lower()
            or (t.description and search_lower in t.description.lower())
            or any(search_lower in tag.lower() for tag in t.tags)
        ]

    return [task_to_dict(t) for t in tasks]


@router.post("/")
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Only mentors can create tasks")

    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        assigned_to=task_data.assigned_to,
        created_by=str(current_user.id),
        due_date=task_data.due_date,
        tags=task_data.tags,
    )
    await task.insert()

    # Notify the student
    notif = Notification(
        user_id=task_data.assigned_to,
        title="New Task Assigned",
        message=f'You have been assigned a new task: "{task_data.title}"',
        type="task_assigned",
    )
    await notif.insert()

    return task_to_dict(task)


@router.put("/{task_id}")
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
):
    try:
        task = await Task.get(PydanticObjectId(task_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Task not found")

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if current_user.role == UserRole.STUDENT:
        # Students can only update status of their tasks
        if task.assigned_to != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
        if task_data.status is not None:
            task.status = task_data.status
    else:
        # Mentors can update everything on their tasks
        if task.created_by != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        if task_data.status is not None:
            task.status = task_data.status
        if task_data.priority is not None:
            task.priority = task_data.priority
        if task_data.due_date is not None:
            task.due_date = task_data.due_date
        if task_data.tags is not None:
            task.tags = task_data.tags

    task.updated_at = datetime.utcnow()
    await task.save()
    return task_to_dict(task)


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Only mentors can delete tasks")

    try:
        task = await Task.get(PydanticObjectId(task_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Task not found")

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")

    await task.delete()
    return {"message": "Task deleted successfully"}
