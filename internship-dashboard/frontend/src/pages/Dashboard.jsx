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
      className={`group relative overflow-hidden rounded-[32px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow hover:-translate-y-2 transition-all p-6 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h2 className="text-3xl font-bold">{value ?? '—'}</h2>
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${colorClass}`}>
          <Icon size={24} />
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

  // 🔥 LOAD DATA
  const loadData = async () => {
    try {
      const [t, r] = await Promise.all([
        tasksAPI.getAll(),
        reportsAPI.getAll(),
      ])

      setTasks(t.data || [])
      setReports(r.data || [])

      if (user?.role === 'mentor') {
        const s = await usersAPI.getAllStudents() // 🔥 CHANGE
        setStudents(s.data || [])
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  // 🔥 TOGGLE FUNCTION
  const handleToggle = async (id) => {
    try {
      await usersAPI.assignToggle(id)
      loadData() // refresh
    } catch (err) {
      console.log(err)
    }
  }

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

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-8 rounded-3xl">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name}
        </h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {user?.role === 'mentor' && (
          <StatCard
            label="Students"
            value={students.length}
            icon={Users}
            colorClass="bg-purple-500"
          />
        )}

        <StatCard label="Todo" value={todo} icon={ListTodo} colorClass="bg-gray-500" />
        <StatCard label="Progress" value={inProgress} icon={Clock} colorClass="bg-blue-500" />
        <StatCard label="Done" value={completed} icon={CheckCircle} colorClass="bg-green-500" />
        <StatCard label="Rate" value={`${completionRate}%`} icon={TrendingUp} colorClass="bg-indigo-500" />
      </div>

      {/* 🔥 STUDENTS SECTION */}
      {user?.role === 'mentor' && (
        <div className="bg-white p-6 rounded-3xl shadow">
          <h2 className="text-xl font-bold mb-4">All Students</h2>

          {students.map((student) => (
            <div key={student.id} className="flex justify-between items-center border-b py-3">
              
              <div>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>

              <button
                onClick={() => handleToggle(student.id)}
                className={`px-4 py-2 rounded text-white ${
                  student.mentor_id ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {student.mentor_id ? "Unassign" : "Assign"}
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}