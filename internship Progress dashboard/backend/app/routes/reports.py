from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.report import Report, Comment
from app.models.user import User, UserRole
from app.models.notification import Notification
from app.utils.auth import get_current_user
from beanie import PydanticObjectId
import uuid

router = APIRouter(prefix="/reports", tags=["Reports"])


class ReportCreate(BaseModel):
    title: str
    content: str
    week_number: int


class CommentCreate(BaseModel):
    content: str


def report_to_dict(report: Report) -> dict:
    return {
        "id": str(report.id),
        "title": report.title,
        "content": report.content,
        "student_id": report.student_id,
        "week_number": report.week_number,
        "comments": [
            {
                "id": c.id,
                "user_id": c.user_id,
                "user_name": c.user_name,
                "content": c.content,
                "created_at": c.created_at.isoformat(),
            }
            for c in report.comments
        ],
        "created_at": report.created_at.isoformat(),
        "updated_at": report.updated_at.isoformat(),
    }


@router.get("/")
async def get_reports(current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.MENTOR:
        # Get reports from students assigned to this mentor
        students = await User.find(
            User.mentor_id == str(current_user.id)
        ).to_list()
        student_ids = [str(s.id) for s in students]
        if not student_ids:
            return []
        reports = await Report.find({"student_id": {"$in": student_ids}}).to_list()
    else:
        reports = await Report.find(
            Report.student_id == str(current_user.id)
        ).to_list()

    return [report_to_dict(r) for r in reports]


@router.get("/{report_id}")
async def get_report(report_id: str, current_user: User = Depends(get_current_user)):
    try:
        report = await Report.get(PydanticObjectId(report_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Report not found")

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # Check access
    if current_user.role == UserRole.STUDENT and report.student_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")

    return report_to_dict(report)


@router.post("/")
async def create_report(
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can submit reports")

    report = Report(
        title=report_data.title,
        content=report_data.content,
        student_id=str(current_user.id),
        week_number=report_data.week_number,
    )
    await report.insert()

    # Notify mentor if assigned
    if current_user.mentor_id:
        notif = Notification(
            user_id=current_user.mentor_id,
            title="New Report Submitted",
            message=f'{current_user.name} submitted a report: "{report_data.title}"',
            type="report_submitted",
        )
        await notif.insert()

    return report_to_dict(report)


@router.put("/{report_id}")
async def update_report(
    report_id: str,
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user),
):
    try:
        report = await Report.get(PydanticObjectId(report_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Report not found")

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if report.student_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")

    report.title = report_data.title
    report.content = report_data.content
    report.week_number = report_data.week_number
    report.updated_at = datetime.utcnow()
    await report.save()
    return report_to_dict(report)


@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
):
    try:
        report = await Report.get(PydanticObjectId(report_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Report not found")

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if report.student_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")

    await report.delete()
    return {"message": "Report deleted"}


@router.post("/{report_id}/comments")
async def add_comment(
    report_id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
):
    try:
        report = await Report.get(PydanticObjectId(report_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Report not found")

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    comment = Comment(
        id=str(uuid.uuid4()),
        user_id=str(current_user.id),
        user_name=current_user.name,
        content=comment_data.content,
        created_at=datetime.utcnow(),
    )
    report.comments.append(comment)
    report.updated_at = datetime.utcnow()
    await report.save()

    # Notify student if mentor commented
    if current_user.role == UserRole.MENTOR and report.student_id != str(current_user.id):
        notif = Notification(
            user_id=report.student_id,
            title="New Feedback Received",
            message=f'{current_user.name} commented on your report: "{report.title}"',
            type="feedback_received",
        )
        await notif.insert()

    return report_to_dict(report)


@router.delete("/{report_id}/comments/{comment_id}")
async def delete_comment(
    report_id: str,
    comment_id: str,
    current_user: User = Depends(get_current_user),
):
    try:
        report = await Report.get(PydanticObjectId(report_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Report not found")

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    original_len = len(report.comments)
    report.comments = [
        c for c in report.comments
        if not (c.id == comment_id and c.user_id == str(current_user.id))
    ]

    if len(report.comments) == original_len:
        raise HTTPException(status_code=404, detail="Comment not found or not authorized")

    report.updated_at = datetime.utcnow()
    await report.save()
    return report_to_dict(report)
