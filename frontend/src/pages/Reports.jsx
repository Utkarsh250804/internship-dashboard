import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ReactMarkdown from 'react-markdown'
import {
  Plus, MessageSquare, Pencil, Trash2,
  Calendar, FileText, Send, ChevronRight,
} from 'lucide-react'

function ReportListItem({ report, isSelected, onClick, onEdit, onDelete, isStudent }) {
  return (
    <div
      onClick={onClick}
      className={`card p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
        isSelected
          ? 'border-indigo-400 dark:border-indigo-600 shadow-md'
          : 'border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-snug truncate">{report.title}</div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={11} /> Week {report.week_number}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={11} /> {report.comments.length}
            </span>
            <span>{new Date(report.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        {isStudent && (
          <div className="flex gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onEdit(report.id)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(report.id)}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
        {report.content.replace(/#{1,6}\s|[*`_~[\]()]/g, '').slice(0, 120)}…
      </p>
      {isSelected && (
        <div className="flex justify-end mt-2">
          <ChevronRight size={14} className="text-indigo-500" />
        </div>
      )}
    </div>
  )
}

function CommentBubble({ comment, currentUserId, reportId, onDelete }) {
  const isOwn = comment.user_id === currentUserId
  return (
    <div className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {comment.user_name[0].toUpperCase()}
      </div>
      <div className={`max-w-[80%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-medium text-gray-600 dark:text-gray-300">{comment.user_name}</span>
          <span>{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isOwn
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
        }`}>
          {comment.content}
        </div>
        {isOwn && onDelete && (
          <button
            onClick={() => onDelete(reportId, comment.id)}
            className="text-xs text-red-400 hover:text-red-600 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default function Reports() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isStudent = user.role === 'student'

  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'comments'

  useEffect(() => {
    reportsAPI.getAll()
      .then(r => { setReports(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSelect = (r) => {
    setSelected(r)
    setActiveTab('preview')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report? This cannot be undone.')) return
    await reportsAPI.delete(id)
    setReports(prev => prev.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim() || !selected) return
    setSubmitting(true)
    try {
      const res = await reportsAPI.addComment(selected.id, { content: comment.trim() })
      setSelected(res.data)
      setReports(prev => prev.map(r => r.id === res.data.id ? res.data : r))
      setComment('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (reportId, commentId) => {
    const res = await reportsAPI.deleteComment(reportId, commentId)
    setSelected(res.data)
    setReports(prev => prev.map(r => r.id === res.data.id ? res.data : r))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Weekly Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {user.role === 'mentor'
              ? 'Review and comment on student progress reports'
              : 'Document your weekly progress in Markdown'}
          </p>
        </div>
        {isStudent && (
          <button
            onClick={() => navigate('/reports/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> New Report
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Report list */}
        <div className="md:col-span-2 space-y-3">
          {reports.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <FileText size={44} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">No reports yet</p>
              {isStudent && (
                <button onClick={() => navigate('/reports/new')} className="btn-primary mt-4">
                  Write your first report
                </button>
              )}
            </div>
          ) : (
            reports.map(r => (
              <ReportListItem
                key={r.id}
                report={r}
                isSelected={selected?.id === r.id}
                onClick={() => handleSelect(r)}
                onEdit={(id) => navigate(`/reports/${id}/edit`)}
                onDelete={handleDelete}
                isStudent={isStudent}
              />
            ))
          )}
        </div>

        {/* Detail pane */}
        <div className="md:col-span-3">
          {selected ? (
            <div className="card p-6">
              {/* Report header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold leading-tight">{selected.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Week {selected.week_number}</span>
                    <span>•</span>
                    <span>{new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                {isStudent && (
                  <button
                    onClick={() => navigate(`/reports/${selected.id}/edit`)}
                    className="btn-secondary flex items-center gap-1.5 text-sm flex-shrink-0"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex border-b dark:border-gray-700 mb-4">
                {[
                  { id: 'preview', label: 'Report' },
                  { id: 'comments', label: `Feedback (${selected.comments.length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Preview tab */}
              {activeTab === 'preview' && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1 text-gray-800 dark:text-gray-200">{children}</h3>,
                      p: ({ children }) => <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      code: ({ inline, children }) => inline
                        ? <code className="bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                        : <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto my-3"><code>{children}</code></pre>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-400 pl-4 italic text-gray-600 dark:text-gray-400 my-3">{children}</blockquote>,
                      a: ({ href, children }) => <a href={href} className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                    }}
                  >
                    {selected.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Comments tab */}
              {activeTab === 'comments' && (
                <div>
                  <div className="space-y-4 mb-4 max-h-72 overflow-y-auto pr-1">
                    {selected.comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No feedback yet</p>
                        {user.role === 'mentor' && (
                          <p className="text-xs mt-1">Be the first to leave feedback on this report.</p>
                        )}
                      </div>
                    ) : (
                      selected.comments.map(c => (
                        <CommentBubble
                          key={c.id}
                          comment={c}
                          currentUserId={user.id}
                          reportId={selected.id}
                          onDelete={isStudent ? null : handleDeleteComment}
                        />
                      ))
                    )}
                  </div>
                  <form onSubmit={handleComment} className="flex gap-2 border-t dark:border-gray-700 pt-4">
                    <input
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="input flex-1"
                      placeholder={user.role === 'mentor' ? 'Leave feedback for this student…' : 'Add a comment…'}
                      disabled={submitting}
                    />
                    <button
                      type="submit"
                      disabled={submitting || !comment.trim()}
                      className="btn-primary flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Send size={14} /> {submitting ? '…' : 'Post'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-14 text-center text-gray-400">
              <FileText size={52} className="mx-auto mb-3 opacity-15" />
              <p className="font-medium">Select a report to view</p>
              <p className="text-sm mt-1">Click any report in the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
