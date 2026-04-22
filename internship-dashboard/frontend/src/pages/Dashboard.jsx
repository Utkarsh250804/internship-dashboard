import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { tasksAPI, reportsAPI, usersAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  Clock,
  ListTodo,
  Users,
  TrendingUp,
  Plus,
  ChevronRight,
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, colorClass, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[32px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)] hover:-translate-y-2 transition-all duration-500 p-6 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400">{label}</p>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
            {value ?? '—'}
          </h2>
        </div>

        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl ${colorClass}`}
        >
          <Icon size={26} />
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="w-[75%] h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
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
        const [t, r] = await Promise.all([
          tasksAPI.getAll(),
          reportsAPI.getAll(),
        ])

        setTasks(t.data || [])
        setReports(r.data || [])

        if (user?.role === 'mentor') {
          const s = await usersAPI.getStudents()
          setStudents(s.data || [])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user])

  const todo = tasks.filter((t) => t.status === 'todo').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const completed = tasks.filter((t) => t.status === 'completed').length

  const completionRate =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-8 md:p-10 shadow-[0_20px_60px_rgba(79,70,229,0.4)]">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>

            <p className="text-indigo-100 mt-4 text-base md:text-lg capitalize max-w-2xl">
              {user?.role} dashboard • Manage students, reports, tasks and analytics with a premium experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {user?.role === 'student' && (
              <button
                onClick={() => navigate('/reports/new')}
                className="px-6 py-4 rounded-2xl bg-white text-indigo-700 font-semibold shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={18} />
                New Report
              </button>
            )}

            <button
              onClick={() => navigate('/kanban')}
              className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              View Board
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {user?.role === 'mentor' && (
          <StatCard
            label="My Students"
            value={students.length}
            icon={Users}
            colorClass="bg-gradient-to-r from-purple-500 to-pink-500"
          />
        )}

        <StatCard
          label="To Do"
          value={todo}
          icon={ListTodo}
          colorClass="bg-gradient-to-r from-slate-500 to-slate-700"
          onClick={() => navigate('/kanban')}
        />

        <StatCard
          label="In Progress"
          value={inProgress}
          icon={Clock}
          colorClass="bg-gradient-to-r from-blue-500 to-cyan-500"
          onClick={() => navigate('/kanban')}
        />

        <StatCard
          label="Completed"
          value={completed}
          icon={CheckCircle}
          colorClass="bg-gradient-to-r from-green-500 to-emerald-500"
          onClick={() => navigate('/kanban')}
        />

        <StatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
          colorClass="bg-gradient-to-r from-indigo-500 to-purple-500"
          onClick={() => navigate('/analytics')}
        />
      </div>
    </div>
  )
}