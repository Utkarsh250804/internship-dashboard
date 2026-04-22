import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await authAPI.login(form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 grid lg:grid-cols-2 w-full max-w-6xl rounded-[40px] overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 shadow-xl">
              <GraduationCap size={34} />
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Welcome to <br />
              InternHub
            </h1>

            <p className="mt-6 text-lg text-indigo-100 max-w-md leading-relaxed">
              Manage internships, students, reports and tasks with a premium modern dashboard experience.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 className="font-semibold">Premium Dashboard</h3>
                  <p className="text-sm text-indigo-100">
                    Analytics, reports and smart task tracking
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ArrowRight size={22} />
                </div>
                <div>
                  <h3 className="font-semibold">Track Everything</h3>
                  <p className="text-sm text-indigo-100">
                    Stay updated with student progress and tasks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-[0_10px_30px_rgba(99,102,241,0.4)] mb-5">
                <GraduationCap size={30} className="text-white" />
              </div>

              <h2 className="text-4xl font-bold text-slate-800 dark:text-white">
                Welcome Back
              </h2>

              <p className="text-slate-500 dark:text-gray-400 mt-3">
                Sign in to continue to your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input h-14"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input h-14 pr-12"
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-gray-400">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}