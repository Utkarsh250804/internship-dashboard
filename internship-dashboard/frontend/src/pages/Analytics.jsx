import { useState, useEffect } from 'react'
import { analyticsAPI } from '../services/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  FileText,
  Users,
  MessageSquare,
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, iconBg, suffix = '' }) {
  return (
    <div className="group relative overflow-hidden rounded-[30px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 p-6">
      <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-500"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400">{label}</p>
          <div className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white mt-2">
            {value}
            <span className="text-lg text-slate-400 ml-1">{suffix}</span>
          </div>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${iconBg}`}
        >
          <Icon size={22} className="text-white" />
        </div>
      </div>

      <div className="mt-5">
        <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="w-[70%] h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-slate-200 dark:border-gray-700 shadow-xl px-4 py-3 text-sm">
      <div className="font-semibold mb-2 text-slate-800 dark:text-white">
        {label}
      </div>

      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: p.fill || p.color }}
          />
          <span className="text-slate-500 dark:text-gray-400">
            {p.name}:
          </span>
          <span className="font-semibold text-slate-800 dark:text-white">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function CompletionRing({ rate }) {
  const ringData = [
    { value: rate },
    { value: 100 - rate },
  ]

  return (
    <div className="relative flex items-center justify-center">
      <PieChart width={160} height={160}>
        <Pie
          data={ringData}
          cx={80}
          cy={80}
          innerRadius={55}
          outerRadius={75}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill="#6366f1" />
          <Cell fill="#e5e7eb" />
        </Pie>
      </PieChart>

      <div className="absolute text-center">
        <div className="text-3xl font-bold text-slate-800 dark:text-white">
          {rate}%
        </div>
        <div className="text-xs text-slate-400">Completed</div>
      </div>
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    analyticsAPI
      .get()
      .then((r) => {
        setData(r.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load analytics data.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-[32px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 p-10 text-center text-slate-400">
        <TrendingUp size={44} className="mx-auto mb-3 opacity-20" />
        <p>{error || 'No data available.'}</p>
      </div>
    )
  }

  const isMentor = data.role === 'mentor'

  const statusPieData = [
    {
      name: 'To Do',
      value: data.task_status.todo,
      fill: '#94a3b8',
    },
    {
      name: 'In Progress',
      value: data.task_status.in_progress,
      fill: '#3b82f6',
    },
    {
      name: 'Completed',
      value: data.task_status.completed,
      fill: '#10b981',
    },
  ].filter((d) => d.value > 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-8 md:p-10 shadow-[0_20px_60px_rgba(79,70,229,0.4)]">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Analytics Dashboard
            </h1>

            <p className="text-indigo-100 mt-3 text-base md:text-lg max-w-2xl">
              {isMentor
                ? "Monitor your students' performance, progress and task completion in real time."
                : 'Track your internship performance, reports and completed tasks.'}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <p className="text-xs uppercase tracking-wider text-indigo-100">
                Completion Rate
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {data.completion_rate}%
              </h3>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <p className="text-xs uppercase tracking-wider text-indigo-100">
                Total Tasks
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {data.total_tasks}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Total Tasks"
          value={data.total_tasks}
          icon={Target}
          iconBg="bg-gradient-to-r from-indigo-500 to-purple-500"
        />

        <StatCard
          label="Completed"
          value={data.task_status.completed}
          icon={CheckCircle}
          iconBg="bg-gradient-to-r from-green-500 to-emerald-500"
        />

        <StatCard
          label="In Progress"
          value={data.task_status.in_progress}
          icon={Clock}
          iconBg="bg-gradient-to-r from-blue-500 to-cyan-500"
        />

        {isMentor ? (
          <StatCard
            label="Students"
            value={data.total_students}
            icon={Users}
            iconBg="bg-gradient-to-r from-purple-500 to-pink-500"
          />
        ) : (
          <StatCard
            label="Reports Submitted"
            value={data.total_reports}
            icon={FileText}
            iconBg="bg-gradient-to-r from-orange-500 to-pink-500"
          />
        )}
      </div>
    </div>
  )
}