from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings


async def init_db():
    from app.models.user import User
    from app.models.task import Task
    from app.models.report import Report
    from app.models.notification import Notification

    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[User, Task, Report, Notification],
    )
    print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
