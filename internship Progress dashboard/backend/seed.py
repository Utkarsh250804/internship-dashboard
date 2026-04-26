#!/usr/bin/env python3
"""
Seed script — creates demo users, tasks, and reports.
Run AFTER the backend is started:
    python seed.py
"""
import asyncio
import sys
from datetime import datetime, timedelta
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

sys.path.insert(0, ".")
from app.config import settings
from app.models.user import User, UserRole
from app.models.task import Task, TaskStatus, TaskPriority
from app.models.report import Report, Comment
from app.models.notification import Notification
from app.utils.auth import get_password_hash
import uuid


async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[User, Task, Report, Notification],
    )

    # ── Wipe existing demo data ──────────────────────────────────
    for email in ["mentor@demo.com", "student1@demo.com", "student2@demo.com"]:
        u = await User.find_one(User.email == email)
        if u:
            await Task.find(Task.created_by == str(u.id)).delete()
            await Task.find(Task.assigned_to == str(u.id)).delete()
            await Report.find(Report.student_id == str(u.id)).delete()
            await Notification.find(Notification.user_id == str(u.id)).delete()
            await u.delete()
    print("🧹 Cleared old demo data")

    # ── Mentor ───────────────────────────────────────────────────
    mentor = User(
        name="Dr. Sarah Mitchell",
        email="mentor@demo.com",
        password=get_password_hash("password123"),
        role=UserRole.MENTOR,
        bio="Senior Software Engineer with 10+ years in full-stack development. Passionate about mentoring the next generation of developers.",
        skills=["React", "FastAPI", "MongoDB", "System Design", "Python"],
    )
    await mentor.insert()
    print(f"✅ Mentor created: {mentor.email}")

    # ── Students ─────────────────────────────────────────────────
    student1 = User(
        name="Alice Johnson",
        email="student1@demo.com",
        password=get_password_hash("password123"),
        role=UserRole.STUDENT,
        mentor_id=str(mentor.id),
        bio="CS final-year student passionate about web development and open source.",
        skills=["JavaScript", "React", "Python", "Git"],
    )
    await student1.insert()

    student2 = User(
        name="Bob Chen",
        email="student2@demo.com",
        password=get_password_hash("password123"),
        role=UserRole.STUDENT,
        mentor_id=str(mentor.id),
        bio="Backend enthusiast, loves databases and API design.",
        skills=["Python", "FastAPI", "PostgreSQL", "Docker"],
    )
    await student2.insert()
    print(f"✅ Students created: {student1.email}, {student2.email}")

    mid = str(mentor.id)
    s1id = str(student1.id)
    s2id = str(student2.id)
    now = datetime.utcnow()

    # ── Tasks for Alice ──────────────────────────────────────────
    tasks_alice = [
        Task(title="Set up project repository", description="Create GitHub repo, add README, configure .gitignore and branch protection rules.", status=TaskStatus.COMPLETED, priority=TaskPriority.HIGH, assigned_to=s1id, created_by=mid, due_date=now - timedelta(days=14), tags=["setup", "git"], created_at=now - timedelta(days=20), updated_at=now - timedelta(days=15)),
        Task(title="Implement user authentication", description="Build JWT-based login/register endpoints with bcrypt password hashing.", status=TaskStatus.COMPLETED, priority=TaskPriority.HIGH, assigned_to=s1id, created_by=mid, due_date=now - timedelta(days=7), tags=["auth", "backend"], created_at=now - timedelta(days=14), updated_at=now - timedelta(days=6)),
        Task(title="Design Kanban board UI", description="Create drag-and-drop Kanban board using dnd-kit. Columns: To Do, In Progress, Done.", status=TaskStatus.IN_PROGRESS, priority=TaskPriority.MEDIUM, assigned_to=s1id, created_by=mid, due_date=now + timedelta(days=3), tags=["frontend", "ui"], created_at=now - timedelta(days=7), updated_at=now - timedelta(days=1)),
        Task(title="Write unit tests for auth module", description="Achieve >80% test coverage using pytest. Include edge cases.", status=TaskStatus.TODO, priority=TaskPriority.MEDIUM, assigned_to=s1id, created_by=mid, due_date=now + timedelta(days=7), tags=["testing", "backend"]),
        Task(title="Integrate analytics dashboard", description="Connect Recharts components to backend analytics endpoint and display charts.", status=TaskStatus.TODO, priority=TaskPriority.LOW, assigned_to=s1id, created_by=mid, due_date=now + timedelta(days=14), tags=["analytics", "frontend"]),
    ]
    for t in tasks_alice:
        await t.insert()

    # ── Tasks for Bob ────────────────────────────────────────────
    tasks_bob = [
        Task(title="Design MongoDB schema", description="Define collections and relationships for User, Task, Report, and Notification models.", status=TaskStatus.COMPLETED, priority=TaskPriority.HIGH, assigned_to=s2id, created_by=mid, due_date=now - timedelta(days=10), tags=["database", "design"], created_at=now - timedelta(days=18), updated_at=now - timedelta(days=9)),
        Task(title="Build REST API endpoints", description="Implement CRUD operations for tasks and reports with proper error handling.", status=TaskStatus.IN_PROGRESS, priority=TaskPriority.HIGH, assigned_to=s2id, created_by=mid, due_date=now + timedelta(days=2), tags=["api", "backend"]),
        Task(title="Add Docker support", description="Create Dockerfile and docker-compose.yml for the full stack application.", status=TaskStatus.TODO, priority=TaskPriority.MEDIUM, assigned_to=s2id, created_by=mid, due_date=now + timedelta(days=10), tags=["devops", "docker"]),
    ]
    for t in tasks_bob:
        await t.insert()
    print(f"✅ {len(tasks_alice) + len(tasks_bob)} tasks created")

    # ── Weekly Reports ───────────────────────────────────────────
    report1 = Report(
        title="Week 1 — Project Kickoff & Setup",
        content="""## What I accomplished this week

- Set up the development environment (Node.js, Python, MongoDB)
- Initialized the Git repository with proper branch structure
- Completed the project onboarding documents
- Had my first 1-on-1 with Dr. Mitchell to align on goals

## Challenges faced

Getting the development environment configured on my machine took longer than expected due to version conflicts between Node.js packages. Resolved by using `nvm` to switch to Node 20.

## What I plan to do next week

- Start implementing the backend authentication system
- Research JWT best practices for refresh token handling
- Set up the FastAPI project structure

## Questions for my mentor

- Should we use access + refresh tokens, or is a single long-lived token sufficient for this project?
- What's the preferred way to handle CORS in FastAPI?
""",
        student_id=s1id,
        week_number=1,
        created_at=now - timedelta(days=14),
        updated_at=now - timedelta(days=14),
        comments=[
            Comment(
                id=str(uuid.uuid4()),
                user_id=mid,
                user_name="Dr. Sarah Mitchell",
                content="Great start, Alice! For this project, a single access token with a 24h expiry is fine. For production apps you'd always want refresh tokens though — good instinct to ask. FastAPI's CORSMiddleware handles CORS cleanly; I'll share an example in our next call.",
                created_at=now - timedelta(days=13),
            )
        ],
    )
    await report1.insert()

    report2 = Report(
        title="Week 2 — Authentication System Complete",
        content="""## What I accomplished this week

- Implemented JWT-based authentication (register + login endpoints)
- Added bcrypt password hashing with passlib
- Created the User model with Beanie ODM
- Tested all auth endpoints manually with Postman

## Challenges faced

Understanding how Beanie (async MongoDB ODM) handles relationships was tricky at first. I ended up storing mentor_id as a string reference rather than a DBRef, which simplified queries significantly.

## What I plan to do next week

- Start the Kanban board frontend component
- Implement task CRUD endpoints on the backend
- Write a brief technical spec for the drag-and-drop interaction

## Questions for my mentor

- For the Kanban drag-and-drop, should I optimistically update the UI or wait for the backend response?
""",
        student_id=s1id,
        week_number=2,
        created_at=now - timedelta(days=7),
        updated_at=now - timedelta(days=6),
        comments=[
            Comment(
                id=str(uuid.uuid4()),
                user_id=mid,
                user_name="Dr. Sarah Mitchell",
                content="Excellent progress! Optimistic updates are the right call for drag-and-drop — it makes the UI feel snappy. Just make sure to roll back if the API call fails. Your Beanie approach is solid; I like that you thought about query simplicity.",
                created_at=now - timedelta(days=6),
            ),
            Comment(
                id=str(uuid.uuid4()),
                user_id=s1id,
                user_name="Alice Johnson",
                content="Thanks! I've already implemented the optimistic rollback pattern — it works great. Will include a demo in next week's report.",
                created_at=now - timedelta(days=5),
            ),
        ],
    )
    await report2.insert()

    report3 = Report(
        title="Week 1 — Database Design & Project Setup",
        content="""## What I accomplished this week

- Designed the full MongoDB schema for the application
- Set up FastAPI project with proper folder structure
- Implemented Beanie ODM models for User, Task, Report, and Notification
- Created the database connection module with async Motor driver

## Challenges faced

Getting async MongoDB operations working correctly in FastAPI took some research. The key insight was using `@app.on_event("startup")` to initialize Beanie before handling any requests.

## What I plan to do next week

- Implement all REST API endpoints for tasks and reports
- Add proper error handling and input validation with Pydantic
- Begin testing with Postman collections

## Questions for my mentor

- Is it better to embed comments inside the Report document, or store them in a separate collection?
""",
        student_id=s2id,
        week_number=1,
        created_at=now - timedelta(days=14),
        updated_at=now - timedelta(days=13),
        comments=[
            Comment(
                id=str(uuid.uuid4()),
                user_id=mid,
                user_name="Dr. Sarah Mitchell",
                content="Great schema work, Bob! For comments, embedding inside Report is the right call here — comments are always accessed with their report, never independently. Embedding avoids an extra database round-trip. If comments could exceed hundreds per report, you'd reconsider, but for our use case embedding is perfect.",
                created_at=now - timedelta(days=12),
            )
        ],
    )
    await report3.insert()
    print(f"✅ 3 reports with comments created")

    # ── Notifications ────────────────────────────────────────────
    notifs = [
        Notification(user_id=s1id, title="New Task Assigned", message='You have been assigned: "Design Kanban board UI"', type="task_assigned", read=False, created_at=now - timedelta(days=7)),
        Notification(user_id=s1id, title="Feedback Received", message='Dr. Sarah Mitchell commented on "Week 2 — Authentication System Complete"', type="feedback_received", read=False, created_at=now - timedelta(days=6)),
        Notification(user_id=s1id, title="New Task Assigned", message='You have been assigned: "Write unit tests for auth module"', type="task_assigned", read=True, created_at=now - timedelta(days=3)),
        Notification(user_id=s2id, title="New Task Assigned", message='You have been assigned: "Build REST API endpoints"', type="task_assigned", read=False, created_at=now - timedelta(days=5)),
        Notification(user_id=mid, title="Report Submitted", message='Alice Johnson submitted: "Week 2 — Authentication System Complete"', type="report_submitted", read=True, created_at=now - timedelta(days=7)),
        Notification(user_id=mid, title="Report Submitted", message='Bob Chen submitted: "Week 1 — Database Design & Project Setup"', type="report_submitted", read=False, created_at=now - timedelta(days=14)),
    ]
    for n in notifs:
        await n.insert()
    print(f"✅ {len(notifs)} notifications created")

    print("\n" + "=" * 50)
    print("🎉 Seed complete! Demo accounts:")
    print("=" * 50)
    print("🎓 Mentor  → mentor@demo.com   / password123")
    print("👩‍💻 Student → student1@demo.com / password123  (Alice)")
    print("👨‍💻 Student → student2@demo.com / password123  (Bob)")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(seed())
