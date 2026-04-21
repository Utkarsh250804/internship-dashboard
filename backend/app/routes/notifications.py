from fastapi import APIRouter, Depends
from app.models.notification import Notification
from app.models.user import User
from app.utils.auth import get_current_user
from beanie import PydanticObjectId

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def notif_to_dict(n: Notification) -> dict:
    return {
        "id": str(n.id),
        "title": n.title,
        "message": n.message,
        "type": n.type,
        "read": n.read,
        "created_at": n.created_at.isoformat(),
    }


@router.get("/")
async def get_notifications(current_user: User = Depends(get_current_user)):
    notifs = await Notification.find(
        Notification.user_id == str(current_user.id)
    ).sort(-Notification.created_at).limit(30).to_list()
    return [notif_to_dict(n) for n in notifs]


@router.get("/unread-count")
async def get_unread_count(current_user: User = Depends(get_current_user)):
    count = await Notification.find(
        Notification.user_id == str(current_user.id),
        Notification.read == False,
    ).count()
    return {"count": count}


@router.put("/{notif_id}/read")
async def mark_read(notif_id: str, current_user: User = Depends(get_current_user)):
    try:
        notif = await Notification.get(PydanticObjectId(notif_id))
        if notif and notif.user_id == str(current_user.id):
            notif.read = True
            await notif.save()
    except Exception:
        pass
    return {"message": "Marked as read"}


@router.put("/read-all")
async def mark_all_read(current_user: User = Depends(get_current_user)):
    notifs = await Notification.find(
        Notification.user_id == str(current_user.id),
        Notification.read == False,
    ).to_list()
    for n in notifs:
        n.read = True
        await n.save()
    return {"message": "All notifications marked as read"}
