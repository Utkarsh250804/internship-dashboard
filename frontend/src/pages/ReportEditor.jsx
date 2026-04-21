import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import ReactMarkdown from 'react-markdown'
import { Save, Eye, Code, ArrowLeft, HelpCircle } from 'lucide-react'

const TEMPLATE = `## What I accomplished this week

- Completed feature X implementation
- Fixed bug in the authentication flow
- Reviewed pull requests from team members

## Challenges faced

Describe any blockers, difficulties, or things that took longer than expected...

## What I plan to do next week

- Start working on feature Y
- Write unit tests for module Z
- Schedule code review session

## Questions for my mentor

Any questions or topics you'd like guidance on...
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
  const [mode, setMode] = useState('split') // 'editor' | 'split' | 'preview'
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [showHelp, setShowHelp] = useState(false)
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    if (isEdit) {
      reportsAPI.getOne(id)
        .then(r => {
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

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!isEdit) {
      const draft = localStorage.getItem('report_draft')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          if (parsed.title || parsed.content !== TEMPLATE) setForm(parsed)
        } catch {}
      }
    }
  }, [isEdit])

  const insertText = (text) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newContent = form.content.slice(0, start) + text + form.content.slice(end)
    setForm(f => ({ ...f, content: newContent }))
    setTimeout(() => {
      ta.selectionStart = start + text.length
      ta.selectionEnd = start + text.length
      ta.focus()
    }, 0)
  }

  const handleContentChange = (e) => {
    const content = e.target.value
    setForm(f => ({ ...f, content }))
    if (!isEdit) {
      localStorage.setItem('report_draft', JSON.stringify({ ...form, content }))
    }
  }

  const handleSave = async () => {
    if (!form.title.trim()) { alert('Please enter a report title.'); return }
    if (!form.content.trim()) { alert('Report content cannot be empty.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await reportsAPI.update(id, form)
      } else {
        await reportsAPI.create(form)
        localStorage.removeItem('report_draft')
      }
      setSavedAt(new Date())
      navigate('/reports')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save report')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="max-w-7xl">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={() => navigate('/reports')} className="btn-secondary flex items-center gap-1.5">
          <ArrowLeft size={15} /> Back
        </button>
        <h1 className="text-xl font-bold flex-1">
          {isEdit ? 'Edit Report' : 'New Weekly Report'}
        </h1>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
            {[
              { id: 'editor', label: 'Edit', icon: Code },
              { id: 'split', label: 'Split', icon: null },
              { id: 'preview', label: 'Preview', icon: Eye },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === m.id
                    ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowHelp(h => !h)}
            className="btn-secondary p-2"
            title="Markdown help"
          >
            <HelpCircle size={16} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={15} />
            {saving ? 'Saving…' : isEdit ? 'Update' : 'Submit Report'}
          </button>
        </div>
      </div>

      {/* Markdown help panel */}
      {showHelp && (
        <div className="card p-4 mb-4 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['# Heading 1', '## Heading 2'],
              ['**bold**', '*italic*'],
              ['- Bullet list', '1. Numbered list'],
              ['`inline code`', '```\ncode block\n```'],
              ['> Blockquote', '---  (divider)'],
              ['[link](url)', '![img](url)'],
            ].flat().map(ex => (
              <code key={ex} className="bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400">
                {ex}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Meta row */}
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1">Report Title <span className="text-red-500">*</span></label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="input"
              placeholder="e.g. Week 3 Progress Report – React Feature Development"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Week Number</label>
            <input
              type="number"
              min="1"
              max="52"
              value={form.week_number}
              onChange={e => setForm(f => ({ ...f, week_number: parseInt(e.target.value) || 1 }))}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {mode !== 'preview' && (
        <div className="flex flex-wrap gap-1 mb-2">
          {TOOLBAR_ITEMS.map(item => (
            <button
              key={item.label}
              type="button"
              onClick={() => insertText(item.insert)}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-mono transition-colors text-gray-600 dark:text-gray-400"
            >
              {item.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center pr-1">{wordCount} words</span>
        </div>
      )}

      {/* Editor / Split / Preview */}
      <div className={`grid gap-4 ${mode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor pane */}
        {mode !== 'preview' && (
          <div className="card overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <Code size={12} /> Markdown Editor
            </div>
            <textarea
              ref={textareaRef}
              value={form.content}
              onChange={handleContentChange}
              className="w-full p-4 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none leading-7 min-h-[480px]"
              placeholder="Write your weekly report in Markdown…"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview pane */}
        {mode !== 'editor' && (
          <div className="card overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <Eye size={12} /> Live Preview
            </div>
            <div className="p-5 min-h-[480px] overflow-y-auto">
              {form.content.trim() ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1 text-gray-800 dark:text-gray-200">{children}</h3>,
                      p: ({ children }) => <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      code: ({ inline, children }) => inline
                        ? <code className="bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                        : <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto my-3 leading-6"><code>{children}</code></pre>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-400 pl-4 italic text-gray-600 dark:text-gray-400 my-3 bg-indigo-50 dark:bg-indigo-900/20 py-2 rounded-r">{children}</blockquote>,
                      hr: () => <hr className="border-gray-200 dark:border-gray-700 my-4" />,
                      a: ({ href, children }) => <a href={href} className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                      strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                    }}
                  >
                    {form.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 dark:text-gray-600 text-sm">
                  Start typing to see the preview…
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
        <span>
          {isEdit
            ? 'Changes will be saved immediately when you click Update.'
            : 'Draft is auto-saved locally until you submit.'}
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={14} />
          {saving ? 'Saving…' : isEdit ? 'Update Report' : 'Submit Report'}
        </button>
      </div>
    </div>
  )
}
