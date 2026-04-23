# 🎓 InternHub — Remote Internship Progress Dashboard

A full-stack internship management platform built with **FastAPI + React + MongoDB**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 JWT Auth | Signup/Login with Student & Mentor roles |
| 📊 Dashboard | Role-specific overview with stats and recent activity |
| 📋 Kanban Board | Drag-and-drop task management (dnd-kit) |
| 📝 Markdown Reports | Live split-editor with preview |
| 💬 Feedback System | Threaded comments on reports |
| 📈 Analytics | Charts for task completion & weekly activity |
| 🔔 Notifications | Real-time badge for new tasks & feedback |
| 🌙 Dark Mode | Full dark/light toggle |
| 🔍 Search & Filter | Search tasks by title, tag; filter by priority |
| 👤 Profile Page | Edit profile, skills, mentor assigns students |

---

## 🗂️ Project Structure

```
internship-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + routers
│   │   ├── config.py            # Settings (pydantic-settings)
│   │   ├── database.py          # Beanie + Motor init
│   │   ├── models/
│   │   │   ├── user.py          # User (Student/Mentor roles)
│   │   │   ├── task.py          # Task (status, priority, tags)
│   │   │   ├── report.py        # Report + embedded Comments
│   │   │   └── notification.py  # Notification
│   │   ├── routes/
│   │   │   ├── auth.py          # /api/auth/register, login, me
│   │   │   ├── tasks.py         # /api/tasks/ CRUD
│   │   │   ├── reports.py       # /api/reports/ + comments
│   │   │   ├── analytics.py     # /api/analytics/
│   │   │   ├── notifications.py # /api/notifications/
│   │   │   └── users.py         # /api/users/ profile, assign
│   │   └── utils/
│   │       └── auth.py          # JWT + bcrypt helpers
│   ├── seed.py                  # Demo data seeder
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Routes + dark mode
│   │   ├── main.jsx
│   │   ├── index.css            # Tailwind + custom classes
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state + token management
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + all API calls
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx       # Dark mode, notifications bell
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Dashboard.jsx
│   │       ├── KanbanBoard.jsx  # dnd-kit drag-and-drop
│   │       ├── Reports.jsx      # List + detail + comments
│   │       ├── ReportEditor.jsx # Markdown editor (split/preview)
│   │       ├── Analytics.jsx    # Recharts visualizations
│   │       └── Profile.jsx      # Edit profile + assign students
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start (Local, No Docker)

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.10+
- **MongoDB** running on `localhost:27017`

  Install MongoDB: https://www.mongodb.com/try/download/community  
  Or run with Docker: `docker run -d -p 27017:27017 mongo:7`

---

### Step 1 — Backend

```bash
cd internship-dashboard/backend

# 1. Copy env
cp .env.example .env
# Edit .env if needed (change SECRET_KEY for production)

# 2. Create virtual environment
python -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate
# Activate (Windows)
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the API server
uvicorn app.main:app --reload --port 8000
```

Backend running at: **http://localhost:8000**  
Swagger docs at: **http://localhost:8000/api/docs**

---



---

### Step 2 — Frontend

```bash
cd internship-dashboard/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend running at: **http://localhost:5173**

---

## 🐳 Quick Start (Docker Compose)

```bash
cd internship-dashboard

# Build and start all services (MongoDB + Backend + Frontend)
docker-compose up --build

# Run seed in a new terminal
docker-compose exec backend python seed.py
```

| Service  | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/api/docs |
| MongoDB | localhost:27017 |

To stop: `docker-compose down`  
To reset data: `docker-compose down -v`

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Get JWT token |
| GET | `/api/auth/me` | ✅ | Current user |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks/` | ✅ | List tasks (filtered by role) |
| POST | `/api/tasks/` | ✅ Mentor | Create task |
| PUT | `/api/tasks/{id}` | ✅ | Update task |
| DELETE | `/api/tasks/{id}` | ✅ Mentor | Delete task |

Query params for GET: `?status=todo&search=keyword`

### Reports
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reports/` | ✅ | List reports |
| POST | `/api/reports/` | ✅ Student | Submit report |
| GET | `/api/reports/{id}` | ✅ | Get report |
| PUT | `/api/reports/{id}` | ✅ Student | Edit report |
| DELETE | `/api/reports/{id}` | ✅ Student | Delete report |
| POST | `/api/reports/{id}/comments` | ✅ | Add comment |
| DELETE | `/api/reports/{id}/comments/{cid}` | ✅ | Delete comment |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics/` | ✅ | Role-based analytics |

### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications/` | ✅ | List notifications |
| GET | `/api/notifications/unread-count` | ✅ | Unread count |
| PUT | `/api/notifications/{id}/read` | ✅ | Mark read |
| PUT | `/api/notifications/read-all` | ✅ | Mark all read |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/students` | ✅ Mentor | My students |
| GET | `/api/users/all-students` | ✅ Mentor | All students |
| PUT | `/api/users/assign/{id}` | ✅ Mentor | Assign student |
| PUT | `/api/users/profile` | ✅ | Update profile |

---

## 🗄️ Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "$2b$12$...(hashed)",
  "role": "student | mentor",
  "bio": "Optional bio",
  "skills": ["React", "Python"],
  "mentor_id": "ObjectId | null",
  "created_at": "ISODate"
}
```

### Tasks Collection
```json
{
  "_id": "ObjectId",
  "title": "Build Kanban UI",
  "description": "Optional details",
  "status": "todo | in_progress | completed",
  "priority": "low | medium | high",
  "assigned_to": "student ObjectId (string)",
  "created_by": "mentor ObjectId (string)",
  "due_date": "ISODate | null",
  "tags": ["frontend", "ui"],
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### Reports Collection
```json
{
  "_id": "ObjectId",
  "title": "Week 3 Progress Report",
  "content": "## Markdown content...",
  "student_id": "ObjectId (string)",
  "week_number": 3,
  "comments": [
    {
      "id": "uuid",
      "user_id": "ObjectId (string)",
      "user_name": "Dr. Smith",
      "content": "Great work!",
      "created_at": "ISODate"
    }
  ],
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### Notifications Collection
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (string)",
  "title": "New Task Assigned",
  "message": "You have been assigned: 'Build Kanban UI'",
  "type": "task_assigned | feedback_received | report_submitted",
  "read": false,
  "created_at": "ISODate"
}
```

---

## 🔧 Environment Variables

```env
# backend/.env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=internship_dashboard
SECRET_KEY=your-super-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

## 🎨 UI Pages

| Page | Route | Access |
|---|---|---|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | Both |
| Kanban Board | `/kanban` | Both |
| Reports | `/reports` | Both |
| Report Editor | `/reports/new` | Student |
| Analytics | `/analytics` | Both |
| Profile | `/profile` | Both |

---

## 🛠️ Tech Stack

**Backend**
- FastAPI 0.104 — async Python web framework
- Beanie — async MongoDB ODM (built on Motor)
- Motor — async MongoDB driver
- python-jose — JWT tokens
- passlib[bcrypt] — password hashing
- Pydantic v2 — data validation

**Frontend**
- React 18 + Vite
- Tailwind CSS 3.4
- @dnd-kit — drag-and-drop
- react-markdown — Markdown renderer
- Recharts — analytics charts
- Axios — HTTP client
- lucide-react — icons
- react-router-dom v6

**Infrastructure**
- MongoDB 7
- Docker + Docker Compose
- Nginx (production frontend)
