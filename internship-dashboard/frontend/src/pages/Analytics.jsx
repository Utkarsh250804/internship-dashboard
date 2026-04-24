import { useState, useEffect } from 'react'
import { analyticsAPI } from '../services/api'
import {
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  FileText,
  Users,
} from 'lucide-react'

/* 🔥 Premium Stat Card */
function StatCard({ label, value, icon: Icon, iconBg }) {
  return (
    <div className="group relative rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-700">

      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <h2 className="text-3xl font-bold text-white mt-2">{value}</h2>
        </div>

        <div className={`p-4 rounded-2xl ${iconBg} shadow-lg`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition"></div>
    </div>
  )
}

/* 🔥 Ring Chart */
function CompletionRing({ rate }) {
  return (
    <div className="relative flex justify-center">
      <PieChart width={180} height={180}>
        <Pie
          data={[{ value: rate }, { value: 100 - rate }]}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
        >
          <Cell fill="#6366f1" />
          <Cell fill="#1f2937" />
        </Pie>
      </PieChart>

      <div className="absolute text-center top-[50%] translate-y-[-50%]">
        <h2 className="text-3xl font-bold text-white">{rate}%</h2>
        <p className="text-gray-400 text-sm">Completed</p>
      </div>
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsAPI.get().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const isMentor = data.role === 'mentor'

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">

      {/* 🔥 Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl mb-8">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-200 mt-2">
          {isMentor
            ? "Monitor student performance in real-time."
            : "Track your internship progress."}
        </p>

        <div className="flex gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-200">Completion</p>
            <h2 className="text-2xl font-bold">{data.completion_rate}%</h2>
          </div>

          <div>
            <p className="text-sm text-gray-200">Total Tasks</p>
            <h2 className="text-2xl font-bold">{data.total_tasks}</h2>
          </div>
        </div>
      </div>

      {/* 🔥 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          label="Total Tasks"
          value={data.total_tasks}
          icon={Target}
          iconBg="bg-indigo-600"
        />

        <StatCard
          label="Completed"
          value={data.task_status.completed}
          icon={CheckCircle}
          iconBg="bg-green-500"
        />

        <StatCard
          label="In Progress"
          value={data.task_status.in_progress}
          icon={Clock}
          iconBg="bg-blue-500"
        />

        {isMentor ? (
          <StatCard
            label="Students"
            value={data.total_students}
            icon={Users}
            iconBg="bg-purple-500"
          />
        ) : (
          <StatCard
            label="Reports"
            value={data.total_reports}
            icon={FileText}
            iconBg="bg-pink-500"
          />
        )}
      </div>

      {/* 🔥 Chart Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Completion Ring */}
        <div className="bg-gray-900 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center">
          <h3 className="mb-4 text-lg text-gray-300">Completion Rate</h3>
          <CompletionRing rate={data.completion_rate} />
        </div>

        {/* Status Breakdown */}
        <div className="bg-gray-900 p-6 rounded-3xl shadow-xl">
          <h3 className="mb-4 text-lg text-gray-300">Task Status</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Completed</span>
              <span>{data.task_status.completed}</span>
            </div>

            <div className="flex justify-between">
              <span>In Progress</span>
              <span>{data.task_status.in_progress}</span>
            </div>

            <div className="flex justify-between">
              <span>To Do</span>
              <span>{data.task_status.todo}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}