import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { usersAPI } from '../services/api'
import { Save, Plus, X, UserPlus, CheckCircle } from 'lucide-react'

function SkillTag({ skill, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="text-indigo-400 hover:text-red-500 transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </span>
  )
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const isMentor = user.role === 'mentor'

  const [form, setForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    skills: user.skills || [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Mentor student management
  const [allStudents, setAllStudents] = useState([])
  const [myStudents, setMyStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(isMentor)
  const [assigning, setAssigning] = useState(null)

  useEffect(() => {
    if (isMentor) {
      Promise.all([usersAPI.getAllStudents(), usersAPI.getStudents()])
        .then(([all, mine]) => {
          setAllStudents(all.data)
          setMyStudents(mine.data.map(s => s.id))
        })
        .finally(() => setStudentsLoading(false))
    }
  }, [isMentor])

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s] }))
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const res = await usersAPI.updateProfile(form)
      updateUser(res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSaveError(err.response?.data?.detail || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAssign = async (studentId) => {
    setAssigning(studentId)
    try {
      await usersAPI.assignStudent(studentId)
      setMyStudents(prev => [...prev, studentId])
    } catch {}
    setAssigning(null)
  }

  const unassigned = allStudents.filter(s => !myStudents.includes(s.id) && !s.mentor_id)

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Avatar + identity */}
      <div className="card p-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b dark:border-gray-700">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div className="text-xl font-bold">{user.name}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</div>
            <span className="inline-block mt-1 capitalize text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-medium">
              {user.role}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              className="input h-28 resize-none leading-relaxed"
              placeholder={isMentor
                ? 'Tell students about your expertise and mentoring style…'
                : 'Tell your mentor about yourself, your goals and interests…'
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {isMentor ? 'Areas of Expertise' : 'Skills & Technologies'}
            </label>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.skills.map(s => (
                  <SkillTag key={s} skill={s} onRemove={removeSkill} />
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                className="input flex-1"
                placeholder={isMentor ? 'e.g. React, System Design, Python…' : 'e.g. JavaScript, React, Node.js…'}
              />
              <button type="button" onClick={addSkill} className="btn-secondary flex items-center gap-1.5">
                <Plus size={15} /> Add
              </button>
            </div>
          </div>

          {saveError && (
            <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg text-sm">
              {saveError}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn-primary flex items-center gap-2 w-full justify-center ${saved ? '!bg-green-600 hover:!bg-green-700' : ''}`}
          >
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? 'Profile Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Account Details</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: 'Email', value: user.email },
            { label: 'Role', value: user.role, capitalize: true },
            { label: 'Member since', value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2 border-b dark:border-gray-700 last:border-0">
              <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
              <span className={`font-medium ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor: Assign students */}
      {isMentor && (
        <div className="card p-6">
          <h2 className="font-semibold mb-1">Assign Students</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Assign unassigned students to your mentorship. Students must first register with the student role.
          </p>

          {studentsLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : unassigned.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">
              <UserPlus size={32} className="mx-auto mb-2 opacity-25" />
              No unassigned students available.
            </div>
          ) : (
            <div className="space-y-2">
              {unassigned.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {s.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssign(s.id)}
                    disabled={assigning === s.id}
                    className="btn-primary text-sm flex items-center gap-1.5 py-1.5"
                  >
                    <UserPlus size={14} />
                    {assigning === s.id ? 'Assigning…' : 'Assign'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Already assigned */}
          {myStudents.length > 0 && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Your students ({myStudents.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {allStudents
                  .filter(s => myStudents.includes(s.id))
                  .map(s => (
                    <span key={s.id} className="flex items-center gap-1.5 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                      <CheckCircle size={11} /> {s.name}
                    </span>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
