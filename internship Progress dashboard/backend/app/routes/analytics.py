from fastapi import APIRouter, Depends
from app.models.task import Task, TaskStatus
from app.models.report import Report
from app.models.user import User, UserRole
from app.utils.auth import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/")
async def get_analytics(current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.MENTOR:
        return await mentor_analytics(current_user)
    else:
        return await student_analytics(current_user)


async def mentor_analytics(mentor: User):
    students = await User.find(User.mentor_id == str(mentor.id)).to_list()
    student_ids = [str(s.id) for s in students]

    all_tasks = await Task.find(Task.created_by == str(mentor.id)).to_list()

    completed = len([t for t in all_tasks if t.status == TaskStatus.COMPLETED])
    in_progress = len([t for t in all_tasks if t.status == TaskStatus.IN_PROGRESS])
    todo = len([t for t in all_tasks if t.status == TaskStatus.TODO])
    total = len(all_tasks)

    # Weekly activity for last 7 weeks
    weekly_data = []
    now = datetime.utcnow()
    for i in range(6, -1, -1):
        week_start = now - timedelta(weeks=i + 1)
        week_end = now - timedelta(weeks=i)
        tasks_created = [t for t in all_tasks if week_start <= t.created_at <= week_end]
        tasks_completed = [
            t for t in all_tasks
            if t.status == TaskStatus.COMPLETED and week_start <= t.updated_at <= week_end
        ]
        weekly_data.append({
            "week": f"W{7 - i}",
            "tasks_created": len(tasks_created),
            "tasks_completed": len(tasks_completed),
        })

    # Per-student progress
    student_progress = []
    for student in students:
        s_tasks = [t for t in all_tasks if t.assigned_to == str(student.id)]
        s_completed = len([t for t in s_tasks if t.status == TaskStatus.COMPLETED])
        student_progress.append({
            "name": student.name,
            "total": len(s_tasks),
            "completed": s_completed,
            "rate": round((s_completed / len(s_tasks) * 100) if s_tasks else 0, 1),
        })

    return {
        "role": "mentor",
        "total_students": len(students),
        "total_tasks": total,
        "task_status": {"completed": completed, "in_progress": in_progress, "todo": todo},
        "completion_rate": round((completed / total * 100) if total else 0, 1),
        "weekly_activity": weekly_data,
        "student_progress": student_progress,
    }


async def student_analytics(student: User):
    tasks = await Task.find(Task.assigned_to == str(student.id)).to_list()
    reports = await Report.find(Report.student_id == str(student.id)).to_list()

    completed = len([t for t in tasks if t.status == TaskStatus.COMPLETED])
    in_progress = len([t for t in tasks if t.status == TaskStatus.IN_PROGRESS])
    todo = len([t for t in tasks if t.status == TaskStatus.TODO])
    total = len(tasks)

    # Weekly activity
    weekly_data = []
    now = datetime.utcnow()
    for i in range(6, -1, -1):
        week_start = now - timedelta(weeks=i + 1)
        week_end = now - timedelta(weeks=i)
        tasks_done = [
            t for t in tasks
            if t.status == TaskStatus.COMPLETED and week_start <= t.updated_at <= week_end
        ]
        week_reports = [r for r in reports if week_start <= r.created_at <= week_end]
        weekly_data.append({
            "week": f"W{7 - i}",
            "tasks_completed": len(tasks_done),
            "reports_submitted": len(week_reports),
        })

    # Priority breakdown
    high = len([t for t in tasks if t.priority == "high"])
    medium = len([t for t in tasks if t.priority == "medium"])
    low = len([t for t in tasks if t.priority == "low"])

    return {
        "role": "student",
        "total_tasks": total,
        "total_reports": len(reports),
        "task_status": {"completed": completed, "in_progress": in_progress, "todo": todo},
        "completion_rate": round((completed / total * 100) if total else 0, 1),
        "weekly_activity": weekly_data,
        "priority_breakdown": {"high": high, "medium": medium, "low": low},
        "feedback_received": sum(len(r.comments) for r in reports),
    }
