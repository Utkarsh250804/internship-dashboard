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

const TEMPLATE = `## Weekly Report

- What I did
- Challenges
- Next plan
`

const TOOLBAR_ITEMS = [
  { label: 'H1', insert: '# Heading\n' },
  { label: 'Bold', insert: '**bold**' },
  { label: 'List', insert: '\n- Item 1\n- Item 2\n' },
  { label: 'Code', insert: '\n```\ncode\n```\n' },
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

  useEffect(() => {
    if (isEdit) {
      reportsAPI.getOne(id).then((r) => {
        setForm(r.data)
        setLoading(false)
      })
    }
  }, [])

  const insertText = (text) => {
    const ta = textareaRef.current
    const start = ta.selectionStart
    const end = ta.selectionEnd

    setForm({
      ...form,
      content:
        form.content.slice(0, start) +
        text +
        form.content.slice(end),
    })
  }

  const handleSave = async () => {
    setSaving(true)
    if (isEdit) await reportsAPI.update(id, form)
    else await reportsAPI.create(form)
    navigate('/reports')
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-black">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-6">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/reports')}
          className="bg-gray-800 px-4 py-2 rounded-xl hover:scale-105 transition flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 rounded-xl hover:scale-105 transition flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Title */}
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Report title..."
        className="w-full mb-4 p-4 text-2xl font-bold bg-transparent border-b border-gray-700 focus:outline-none"
      />

      {/* Toolbar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => insertText(item.insert)}
            className="px-3 py-1 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mode Switch */}
      <div className="flex gap-2 mb-4">
        {['editor', 'split', 'preview'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-lg ${
              mode === m
                ? 'bg-indigo-500'
                : 'bg-gray-800'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Editor + Preview */}
      <div className={`grid gap-4 ${mode === 'split' ? 'md:grid-cols-2' : ''}`}>

        {mode !== 'preview' && (
          <textarea
            ref={textareaRef}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="bg-gray-900 p-4 rounded-xl min-h-[500px] focus:outline-none"
          />
        )}

        {mode !== 'editor' && (
          <div className="bg-gray-900 p-4 rounded-xl min-h-[500px] prose prose-invert max-w-none">
            <ReactMarkdown>{form.content}</ReactMarkdown>
          </div>
        )}

      </div>
    </div>
  )
}