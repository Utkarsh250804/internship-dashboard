import { useState, useEffect, useCallback } from 'react'
import {
  DndContext, DragOverlay, closestCenter,
  PointerSensor, useSensor, useSensors, useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { tasksAPI, usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Plus, Pencil, Trash2, X, GripVertical,
  Search, Calendar, Tag, User,
} from 'lucide-react'

/* ─── Constants ─────────────────────────────────────────────── */
const COLUMNS = [
  { id: 'todo',        label: 'To Do',       accent: 'border-gray-300 dark:border-gray-600',  bg: 'bg-gray-50 dark:bg-gray-800/50'   },
  { id: 'in_progress', label: 'In Progress',  accent: 'border-blue-300 dark:border-blue-700',  bg: 'bg-blue-50/50 dark:bg-blue-900/10' },
  { id: 'completed',   label: 'Completed',    accent: 'border-green-300 dark:border-green-700', bg: 'bg-green-50/50 dark:bg-green-900/10' },
]

const PRIORITY_BADGE = {
  high:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low:    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
}

/* ─── Droppable Column Wrapper ───────────────────────────────── */
function DroppableColumn({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] transition-colors rounded-lg ${isOver ? 'ring-2 ring-indigo-400' : ''}`}
    >
      {children}
    </div>
  )
}

/* ─── Single Task Card ───────────────────────────────────────── */
function TaskCard({ task, onEdit, onDelete, isMentor, studentName, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, disabled: overlay })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    touchAction: 'none',
  }

  const card = (
    <div className={`card p-3.5 mb-2 select-none ${overlay ? 'shadow-2xl rotate-1 opacity-95' : 'hover:shadow-md transition-shadow'}`}>
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        {!overlay && (
          <span
            {...attributes}
            {...listeners}
            className="text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={15} />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-snug">{task.title}</div>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_BADGE[task.priority]}`}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={11} />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
            {isMentor && studentName && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <User size={11} /> {studentName}
              </span>
            )}
          </div>
          {task.tags.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-0.5 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded"
                >
                  <Tag size={9} /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {isMentor && (
          <div className="flex flex-col gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  if (overlay) return card
  return <div ref={setNodeRef} style={style}>{card}</div>
}

/* ─── Task Modal ─────────────────────────────────────────────── */
function TaskModal({ task, students, onClose, onSave }) {
  const defaultForm = {
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: students[0]?.id || '',
    due_date: '',
    tags: [],
    status: 'todo',
  }
  const [form, setForm] = useState(task ? {
    ...task,
    due_date: task.due_date ? task.due_date.split('T')[0] : '',
  } : defaultForm)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.assigned_to) { setError('Please select a student'); return }
    setSaving(true)
    try {
      await onSave({ ...form, due_date: form.due_date || null })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-lg">{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg text-sm mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="input"
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input h-20 resize-none"
              placeholder="Optional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="input">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Assign To <span className="text-red-500">*</span></label>
              <select
                value={form.assigned_to}
                onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}
                className="input"
                required
              >
                <option value="">Select student…</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-1 rounded-full">
                  #{tag}
                  <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                className="input flex-1"
                placeholder="Add a tag and press Enter…"
              />
              <button type="button" onClick={addTag} className="btn-secondary px-4">Add</button>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving…' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── Main Board ─────────────────────────────────────────────── */
export default function KanbanBoard() {
  const { user } = useAuth()
  const isMentor = user.role === 'mentor'

  const [tasks, setTasks] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  useEffect(() => {
    const load = async () => {
      try {
        const tRes = await tasksAPI.getAll()
        setTasks(tRes.data)
        if (isMentor) {
          const sRes = await usersAPI.getStudents()
          setStudents(sRes.data)
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [isMentor])

  /* Derived data */
  const filtered = tasks.filter(t => {
    const matchSearch = !search
      || t.title.toLowerCase().includes(search.toLowerCase())
      || t.description?.toLowerCase().includes(search.toLowerCase())
      || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority
    return matchSearch && matchPriority
  })

  const colTasks = (status) => filtered.filter(t => t.status === status)
  const activeTask = tasks.find(t => t.id === activeId)
  const studentName = (id) => students.find(s => s.id === id)?.name

  /* DnD handlers */
  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragEnd = useCallback(async ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    const task = tasks.find(t => t.id === active.id)
    if (!task) return

    // Determine target column
    const colMatch = COLUMNS.find(c => c.id === over.id)
    const targetStatus = colMatch
      ? colMatch.id
      : COLUMNS.find(c => colTasks(c.id).some(t => t.id === over.id))?.id

    if (!targetStatus || task.status === targetStatus) return

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: targetStatus } : t))
    try {
      await tasksAPI.update(active.id, { status: targetStatus })
    } catch {
      setTasks(tasks) // Rollback
    }
  }, [tasks])

  /* CRUD */
  const handleSave = async (data) => {
    if (editTask) {
      const res = await tasksAPI.update(editTask.id, data)
      setTasks(prev => prev.map(t => t.id === editTask.id ? res.data : t))
    } else {
      const res = await tasksAPI.create(data)
      setTasks(prev => [...prev, res.data])
    }
    setShowModal(false)
    setEditTask(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return
    await tasksAPI.delete(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const openEdit = (task) => { setEditTask(task); setShowModal(true) }
  const openNew  = ()     => { setEditTask(null); setShowModal(true) }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Drag cards between columns to update status
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="input pl-9 w-48"
            />
          </div>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="input w-36"
          >
            <option value="all">All priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          {isMentor && (
            <button onClick={openNew} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> New Task
            </button>
          )}
        </div>
      </div>

      {isMentor && students.length === 0 && (
        <div className="card p-6 text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
          ⚠️ No students are assigned to you yet. Students must register, then you can assign them.
        </div>
      )}

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid md:grid-cols-3 gap-5">
          {COLUMNS.map(col => {
            const cards = colTasks(col.id)
            return (
              <div key={col.id} className={`rounded-xl border-2 ${col.accent} ${col.bg} p-4`}>
                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm tracking-wide">{col.label}</h3>
                  <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700">
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <DroppableColumn id={col.id}>
                  <SortableContext
                    items={cards.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {cards.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        isMentor={isMentor}
                        studentName={studentName(task.assigned_to)}
                      />
                    ))}
                  </SortableContext>
                  {cards.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-8 text-center text-gray-400 dark:text-gray-600 text-sm">
                      Drop cards here
                    </div>
                  )}
                </DroppableColumn>
              </div>
            )
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
          {activeTask && (
            <TaskCard
              task={activeTask}
              overlay
              isMentor={isMentor}
              studentName={studentName(activeTask.assigned_to)}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editTask}
          students={students}
          onClose={() => { setShowModal(false); setEditTask(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
