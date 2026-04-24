import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { usersAPI } from '../services/api'
import {
  Save,
  Plus,
  X,
  UserPlus,
  CheckCircle,
} from 'lucide-react'

function SkillTag({ skill, onRemove }) {
  return (
    <span className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-sm px-3 py-1 rounded-full border border-indigo-500/20">
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)}>
          <X size={12} />
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

  const [allStudents, setAllStudents] = useState([])
  const [myStudents, setMyStudents] = useState([])

  useEffect(() => {
    if (isMentor) {
      Promise.all([usersAPI.getAllStudents(), usersAPI.getStudents()])
        .then(([all, mine]) => {
          setAllStudents(all.data)
          setMyStudents(mine.data.map(s => s.id))
        })
    }
  }, [])

  const addSkill = () => {
    if (skillInput && !form.skills.includes(skillInput)) {
      setForm({ ...form, skills: [...form.skills, skillInput] })
      setSkillInput('')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await usersAPI.updateProfile(form)
    updateUser(res.data)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-6">

      {/* 🔥 Profile Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl mb-6">
        <div className="flex items-center gap-5">

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
            {user.name[0]}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
            <span className="text-xs bg-indigo-500/20 px-3 py-1 rounded-full mt-1 inline-block">
              {user.role}
            </span>
          </div>

        </div>
      </div>

      {/* 🔥 Edit Profile */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl mb-6">

        <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

        <div className="space-y-4">

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-indigo-500 outline-none"
            placeholder="Name"
          />

          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-indigo-500 outline-none"
            placeholder="Bio"
          />

          {/* Skills */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map(s => (
                <SkillTag key={s} skill={s} onRemove={() =>
                  setForm({
                    ...form,
                    skills: form.skills.filter(x => x !== s),
                  })
                } />
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700"
                placeholder="Add skill"
              />
              <button
                onClick={addSkill}
                className="bg-indigo-500 px-4 rounded-xl"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
          </button>

        </div>
      </div>

      {/* 🔥 Mentor Section */}
      {isMentor && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">

          <h3 className="text-xl font-semibold mb-4">Assign Students</h3>

          {allStudents.map(s => (
            <div key={s.id} className="flex justify-between items-center mb-2 bg-gray-900 p-3 rounded-xl">

              <span>{s.name}</span>

              <button className="bg-indigo-500 px-3 py-1 rounded-lg text-sm">
                <UserPlus size={14} />
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  )
}