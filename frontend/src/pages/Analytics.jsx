import { useState, useEffect } from 'react'
import { analyticsAPI } from '../services/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
  RadialBarChart, RadialBar,
} from 'recharts'
import { TrendingUp, Target, CheckCircle, Clock, FileText, Users, MessageSquare } from 'lucide-react'

/* ─── Reusable stat card ────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, iconBg, suffix = '' }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight">
        {value}<span className="text-lg text-gray-400 ml-0.5">{suffix}</span>
      </div>
    </div>
  )
}

/* ─── Custom tooltip ────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 shadow-lg text-sm">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-gray-500 dark:text-gray-400">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Completion ring ───────────────────────────────────────── */
function CompletionRing({ rate }) {
  const data = [{ value: rate }, { value: 100 - rate }]
  return (
    <div className="relative flex items-center justify-center">
      <PieChart width={140} height={140}>
        <Pie
          data={data}
          cx={65}
          cy={65}
          innerRadius={48}
          outerRadius={65}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill="#6366f1" />
          <Cell fill="transparent" />
        </Pie>
      </PieChart>
      <div className="absolute text-center">
        <div className="text-2xl font-bold">{rate}%</div>
        <div className="text-xs text-gray-400">done</div>
      </div>
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    analyticsAPI.get()
      .then(r => { setData(r.data); setLoading(false) })
      .catch(() => { setError('Failed to load analytics data.'); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="card p-10 text-center text-gray-400">
        <TrendingUp size={44} className="mx-auto mb-3 opacity-20" />
        <p>{error || 'No data available.'}</p>
      </div>
    )
  }

  const statusPieData = [
    { name: 'To Do',       value: data.task_status.todo,        fill: '#9ca3af' },
    { name: 'In Progress', value: data.task_status.in_progress, fill: '#3b82f6' },
    { name: 'Completed',   value: data.task_status.completed,   fill: '#10b981' },
  ].filter(d => d.value > 0)

  const isMentor = data.role === 'mentor'

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {isMentor ? "Overview of your students' progress" : 'Track your personal internship progress'}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={data.total_tasks} icon={Target} iconBg="bg-indigo-500" />
        <StatCard label="Completed" value={data.task_status.completed} icon={CheckCircle} iconBg="bg-green-500" />
        <StatCard label="In Progress" value={data.task_status.in_progress} icon={Clock} iconBg="bg-blue-500" />
        {isMentor
          ? <StatCard label="Students" value={data.total_students} icon={Users} iconBg="bg-purple-500" />
          : <StatCard label="Reports Submitted" value={data.total_reports} icon={FileText} iconBg="bg-indigo-500" />
        }
      </div>

      {/* Row 2: Ring + Status Pie + Activity chart */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Completion ring */}
        <div className="card p-5 flex flex-col items-center justify-center">
          <h2 className="font-semibold mb-4 self-start">Completion Rate</h2>
          <CompletionRing rate={data.completion_rate} />
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {data.task_status.completed} of {data.total_tasks} tasks completed
          </div>
        </div>

        {/* Status donut */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Task Status</h2>
          {statusPieData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No tasks yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {statusPieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 flex-wrap mt-2">
                {statusPieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                    <span className="text-gray-600 dark:text-gray-400">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Extra stat card */}
        {!isMentor ? (
          <div className="card p-5 flex flex-col gap-4">
            <h2 className="font-semibold">Quick Stats</h2>
            <div className="space-y-3">
              {[
                { label: 'Feedback Received', value: data.feedback_received, icon: MessageSquare, color: 'text-indigo-500' },
                { label: 'Reports Submitted', value: data.total_reports, icon: FileText, color: 'text-green-500' },
                { label: 'Tasks Assigned', value: data.total_tasks, icon: Target, color: 'text-blue-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                  <item.icon size={18} className={item.color} />
                  <span className="text-sm flex-1 text-gray-600 dark:text-gray-300">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-5 flex flex-col gap-4">
            <h2 className="font-semibold">Summary</h2>
            <div className="space-y-3">
              {[
                { label: 'Active Students', value: data.total_students, icon: Users, color: 'text-purple-500' },
                { label: 'Total Tasks Created', value: data.total_tasks, icon: Target, color: 'text-blue-500' },
                { label: 'Tasks Completed', value: data.task_status.completed, icon: CheckCircle, color: 'text-green-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                  <item.icon size={18} className={item.color} />
                  <span className="text-sm flex-1 text-gray-600 dark:text-gray-300">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Weekly Activity */}
      <div className="card p-5">
        <h2 className="font-semibold mb-5">Weekly Activity (Last 7 Weeks)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.weekly_activity} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:[&>line]:stroke-gray-700" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {isMentor ? (
              <>
                <Bar dataKey="tasks_created" name="Tasks Created" fill="#6366f1" radius={[5, 5, 0, 0]} maxBarSize={40} />
                <Bar dataKey="tasks_completed" name="Tasks Completed" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={40} />
              </>
            ) : (
              <>
                <Bar dataKey="tasks_completed" name="Tasks Completed" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={40} />
                <Bar dataKey="reports_submitted" name="Reports Submitted" fill="#6366f1" radius={[5, 5, 0, 0]} maxBarSize={40} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mentor: Student progress */}
      {isMentor && data.student_progress?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold mb-5">Student Task Completion</h2>
          <div className="space-y-4">
            {data.student_progress.map((s, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {s.name[0]}
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {s.completed}/{s.total} tasks
                    <span className={`ml-2 font-semibold ${s.rate >= 80 ? 'text-green-600' : s.rate >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                      ({s.rate}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      s.rate >= 80 ? 'bg-green-500' : s.rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${s.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student: Priority breakdown */}
      {!isMentor && data.priority_breakdown && (
        <div className="card p-5">
          <h2 className="font-semibold mb-5">Tasks by Priority</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'High', key: 'high', color: 'bg-red-500', light: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
              { label: 'Medium', key: 'medium', color: 'bg-yellow-500', light: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' },
              { label: 'Low', key: 'low', color: 'bg-gray-400', light: 'bg-gray-50 dark:bg-gray-700/50', text: 'text-gray-600 dark:text-gray-400' },
            ].map(p => (
              <div key={p.key} className={`p-5 rounded-xl ${p.light} text-center`}>
                <div className={`w-3 h-3 rounded-full ${p.color} mx-auto mb-2`} />
                <div className="text-3xl font-bold mb-1">{data.priority_breakdown[p.key]}</div>
                <div className={`text-sm font-medium ${p.text}`}>{p.label} Priority</div>
              </div>
            ))}
          </div>
          {/* Mini bar chart for priorities */}
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={[
                  { name: 'High', value: data.priority_breakdown.high, fill: '#ef4444' },
                  { name: 'Medium', value: data.priority_breakdown.medium, fill: '#f59e0b' },
                  { name: 'Low', value: data.priority_breakdown.low, fill: '#9ca3af' },
                ]}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Tasks" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {[
                    { fill: '#ef4444' },
                    { fill: '#f59e0b' },
                    { fill: '#9ca3af' },
                  ].map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
