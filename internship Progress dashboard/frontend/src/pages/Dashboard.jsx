import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { tasksAPI, usersAPI } from '../services/api'
import {
  CheckCircle,
  Clock,
  ListTodo,
  Users,
  TrendingUp,
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</h2>
      </div>
      <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  )
}

function Avatar({ name, className = '' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${className}`}>
      {initials}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [t] = await Promise.all([tasksAPI.getAll()])
      setTasks(t.data || [])
      if (user?.role === 'mentor') {
        const s = await usersAPI.getAllStudents()
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

  const handleToggle = async (id) => {
    await usersAPI.assignToggle(id)
    loadData()
  }

  const todo = tasks.filter((t) => t.status === 'todo').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Hero */}
      <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-indigo-500 mb-1">Welcome back</p>
          <h1 className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">{user?.name}</h1>
          <p className="text-sm text-indigo-400 mt-0.5">Your internship dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'mentor' && (
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-medium">
              Mentor
            </span>
          )}
          <Avatar name={user?.name} className="bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {user?.role === 'mentor' && (
          <StatCard label="Students" value={students.length} icon={Users}
            iconBg="bg-purple-100 dark:bg-purple-900" iconColor="text-purple-600 dark:text-purple-300" />
        )}
        <StatCard label="Todo" value={todo} icon={ListTodo}
          iconBg="bg-gray-100 dark:bg-gray-800" iconColor="text-gray-500 dark:text-gray-300" />
        <StatCard label="In Progress" value={inProgress} icon={Clock}
          iconBg="bg-blue-100 dark:bg-blue-900" iconColor="text-blue-600 dark:text-blue-300" />
        <StatCard label="Completed" value={completed} icon={CheckCircle}
          iconBg="bg-green-100 dark:bg-green-900" iconColor="text-green-600 dark:text-green-300" />
        <StatCard label="Success Rate" value={`${completionRate}%`} icon={TrendingUp}
          iconBg="bg-indigo-100 dark:bg-indigo-900" iconColor="text-indigo-600 dark:text-indigo-300" />
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Overall task progress</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{completed} / {tasks.length} tasks</p>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* Students */}
      {user?.role === 'mentor' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">Student Management</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {students.length} students
            </span>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {students.map((student) => (
              <div key={student.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <Avatar name={student.name} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{student.name}</p>
                  <p className="text-xs text-gray-400 truncate">{student.email}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium hidden sm:inline ${
                  student.mentor_id
                    ? 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                }`}>
                  {student.mentor_id ? 'Assigned' : 'Unassigned'}
                </span>
                <button
                  onClick={() => handleToggle(student.id)}
                  className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                    student.mentor_id
                      ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950 dark:text-red-400'
                      : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950 dark:text-green-400'
                  }`}
                >
                  {student.mentor_id ? 'Unassign' : 'Assign'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}