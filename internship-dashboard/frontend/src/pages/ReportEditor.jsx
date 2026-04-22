import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import ReactMarkdown from 'react-markdown'
import {
  Save,
  Eye,
  Code,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react'

const TEMPLATE = `## What I accomplished this week

- Completed feature X implementation
- Fixed bug in authentication flow
- Reviewed pull requests from teammates

## Challenges faced

Describe blockers, delays or issues here...

## What I plan to do next week

- Start feature Y
- Write tests
- Complete review session

## Questions for my mentor

Add any questions here...
`

const TOOLBAR_ITEMS = [
  { label: '# H1', insert: '# Heading 1\n' },
  { label: '## H2', insert: '## Heading 2\n' },
  { label: 'Bold', insert: '**bold text**' },
  { label: 'Italic', insert: '*italic text*' },
  { label: '- List', insert: '\n- Item 1\n- Item 2\n- Item 3\n' },
  { label: '1. List', insert: '\n1. First\n2. Second\n3. Third\n' },
  { label: '```Code', insert: '\n```\ncode here\n```\n' },
  { label: '> Quote', insert: '\n> Blockquote text\n' },
  { label: '---', insert: '\n---\n' },
]

export default function ReportEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const textareaRef = useRef(null)
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    content: TEMPLATE,
    week_number: 1,
  })

  const [mode, setMode] = useState('split')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (isEdit) {
      reportsAPI
        .getOne(id)
        .then((r) => {
          setForm({
            title: r.data.title,
            content: r.data.content,
            week_number: r.data.week_number,
          })
          setLoading(false)
        })
        .catch(() => navigate('/reports'))
    }
  }, [id, isEdit, navigate])

  const insertText = (text) => {
    const ta = textareaRef.current
    if (!ta) return

    const start = ta.selectionStart
    const end = ta.selectionEnd

    const newContent =
      form.content.slice(0, start) +
      text +
      form.content.slice(end)

    setForm((f) => ({
      ...f,
      content: newContent,
    }))

    setTimeout(() => {
      ta.selectionStart = start + text.length
      ta.selectionEnd = start + text.length
      ta.focus()
    }, 0)
  }

  const handleContentChange = (e) => {
    const content = e.target.value

    setForm((f) => ({
      ...f,
      content,
    }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert('Please enter a report title.')
      return
    }

    if (!form.content.trim()) {
      alert('Report content cannot be empty.')
      return
    }

    setSaving(true)

    try {
      if (isEdit) {
        await reportsAPI.update(id, form)
      } else {
        await reportsAPI.create(form)
      }

      navigate('/reports')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save report')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const wordCount = form.content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-6 md:p-8 mb-6 shadow-[0_20px_60px_rgba(79,70,229,0.35)]">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {isEdit ? 'Edit Report' : 'Create Weekly Report'}
            </h1>

            <p className="text-indigo-100 mt-3 text-sm md:text-base max-w-2xl">
              Write your weekly achievements, blockers, goals and mentor questions in a premium markdown editor.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <p className="text-xs uppercase tracking-wider text-indigo-100">
                Word Count
              </p>
              <h3 className="text-2xl font-bold mt-1">{wordCount}</h3>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <p className="text-xs uppercase tracking-wider text-indigo-100">
                Week Number
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {form.week_number}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={() => navigate('/reports')}
          className="px-4 py-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 text-slate-700 dark:text-gray-300"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="flex bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-2xl p-1.5 gap-1 shadow-lg">
          {[
            { id: 'editor', label: 'Edit' },
            { id: 'split', label: 'Split' },
            { id: 'preview', label: 'Preview' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === m.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-gray-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowHelp((h) => !h)}
          className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
        >
          <HelpCircle size={18} />
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? 'Saving...' : isEdit ? 'Update Report' : 'Submit Report'}
        </button>
      </div>

      {showHelp && (
        <div className="rounded-[30px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-5 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TOOLBAR_ITEMS.map((item) => (
              <div
                key={item.label}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-xs font-mono text-slate-600 dark:text-gray-300"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-[30px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-2">
              Report Title
            </label>

            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  title: e.target.value,
                }))
              }
              className="input"
              placeholder="Enter report title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Week Number
            </label>

            <input
              type="number"
              min="1"
              max="52"
              value={form.week_number}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  week_number: parseInt(e.target.value) || 1,
                }))
              }
              className="input"
            />
          </div>
        </div>
      </div>

      {mode !== 'preview' && (
        <div className="flex flex-wrap gap-2 mb-4">
          {TOOLBAR_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => insertText(item.insert)}
              className="px-3 py-2 text-xs bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200 dark:border-gray-700 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 font-mono text-slate-600 dark:text-gray-300"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div
        className={`grid gap-5 ${
          mode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {mode !== 'preview' && (
          <div className="rounded-[30px] overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="px-4 py-3 bg-slate-50/80 dark:bg-gray-800/60 border-b border-slate-200 dark:border-gray-700 text-xs font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-2">
              <Code size={14} />
              Markdown Editor
            </div>

            <textarea
              ref={textareaRef}
              value={form.content}
              onChange={handleContentChange}
              className="w-full p-5 font-mono text-sm bg-transparent text-slate-800 dark:text-gray-100 resize-none focus:outline-none leading-7 min-h-[520px]"
              placeholder="Write your weekly report in Markdown..."
              spellCheck={false}
            />
          </div>
        )}

        {mode !== 'editor' && (
          <div className="rounded-[30px] overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="px-4 py-3 bg-slate-50/80 dark:bg-gray-800/60 border-b border-slate-200 dark:border-gray-700 text-xs font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-2">
              <Eye size={14} />
              Live Preview
            </div>

            <div className="p-5 min-h-[520px] prose max-w-none dark:prose-invert">
              <ReactMarkdown>{form.content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}