import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { tasksAPI, reportsAPI, usersAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, Clock, ListTodo, FileText,
  Users, TrendingUp, Plus, ChevronRight,
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, colorClass, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card p-5 flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value ?? '—'}</div>
        <div className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{label}</div>
      </div>
    </div>
  )
}

function StatusDot({ status }) {
  const colors = {
    completed: 'bg-green-500',
    in_progress: 'bg-blue-500',
    todo: 'bg-gray-400',
  }
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[status] || 'bg-gray-400'}`} />
}

function PriorityBadge({ priority }) {
  const styles = {
    high: 'badge badge-high',
    medium: 'badge badge-medium',
    low: 'badge badge-low',
  }
  return <span className={styles[priority] || 'badge badge-low'}>{priority}</span>
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [reports, setReports] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [t, r] = await Promise.all([tasksAPI.getAll(), reportsAPI.getAll()])
        setTasks(t.data)
        setReports(r.data)
        if (user.role === 'mentor') {
          const s = await usersAPI.getStudents()
          setStudents(s.data)
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [user])

  const todo = tasks.filter((t) => t.status === 'todo').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  const recentTasks = [...tasks].slice(0, 6)
  const recentReports = [...reports].slice(0, 5)

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm capitalize">
            {user.role} dashboard
          </p>
        </div>
        <div className="flex gap-2">
          {user.role === 'student' && (
            <button
              onClick={() => navigate('/reports/new')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> New Report
            </button>
          )}
          <button
            onClick={() => navigate('/kanban')}
            className="btn-secondary flex items-center gap-2"
          >
            View Board <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {user.role === 'mentor' && (
          <StatCard
            label="My Students"
            value={students.length}
            icon={Users}
            colorClass="bg-purple-500"
          />
        )}
        <StatCard
          label="To Do"
          value={todo}
          icon={ListTodo}
          colorClass="bg-gray-500"
          onClick={() => navigate('/kanban')}
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          icon={Clock}
          colorClass="bg-blue-500"
          onClick={() => navigate('/kanban')}
        />
        <StatCard
          label="Completed"
          value={completed}
          icon={CheckCircle}
          colorClass="bg-green-500"
          onClick={() => navigate('/kanban')}
        />
        <StatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
          colorClass="bg-indigo-500"
          onClick={() => navigate('/analytics')}
        />
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="card p-5">
          <div className="flex justify-between items-center mb-2 text-sm font-medium">
            <span>Overall Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400" />{todo} to do</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />{inProgress} in progress</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />{completed} done</span>
          </div>
        </div>
      )}

      {/* Recent tasks & reports */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Tasks</h2>
            <button
              onClick={() => navigate('/kanban')}
              className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <ListTodo size={36} className="mx-auto mb-2 opacity-25" />
              <p className="text-sm">No tasks yet</p>
              {user.role === 'student' && (
                <p className="text-xs mt-1">Your mentor will assign tasks soon</p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate('/kanban')}
                >
                  <StatusDot status={task.status} />
                  <span className="text-sm flex-1 truncate">{task.title}</span>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reports */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Reports</h2>
            <button
              onClick={() => navigate('/reports')}
              className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          {recentReports.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FileText size={36} className="mx-auto mb-2 opacity-25" />
              <p className="text-sm">No reports submitted yet</p>
              {user.role === 'student' && (
                <button
                  onClick={() => navigate('/reports/new')}
                  className="btn-primary mt-3 text-sm py-1.5"
                >
                  Write first report
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentReports.map((r) => (
                <div
                  key={r.id}
                  className="px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate('/reports')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1">{r.title}</span>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">Week {r.week_number}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {r.comments.length} comment{r.comments.length !== 1 ? 's' : ''} •{' '}
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Students (mentor only) */}
      {user.role === 'mentor' && (
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">My Students</h2>
            <span className="text-sm text-gray-500">{students.length} assigned</span>
          </div>
          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users size={36} className="mx-auto mb-2 opacity-25" />
              <p className="text-sm">No students assigned yet</p>
              <p className="text-xs mt-1">Students need to register and be assigned to you</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {s.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
