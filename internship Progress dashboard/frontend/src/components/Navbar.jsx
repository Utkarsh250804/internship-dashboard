import { Bell, Moon, Sun, Menu, LogOut, X, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { notificationsAPI } from '../services/api'
import { formatDistanceToNow } from 'date-fns'

const TYPE_ICONS = {
  task_assigned: '📋',
  feedback_received: '💬',
  report_submitted: '📝',
}

export default function Navbar({ darkMode, setDarkMode, setSidebarOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [unread, setUnread] = useState(0)
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [notifsLoading, setNotifsLoading] = useState(false)

  const notifRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await notificationsAPI.getCount()
        setUnread(res.data.count)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCount()

    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const openNotifs = async () => {
    const next = !showNotifs
    setShowNotifs(next)

    if (next && notifs.length === 0) {
      setNotifsLoading(true)

      try {
        const res = await notificationsAPI.getAll()
        setNotifs(res.data)
      } catch (error) {
        console.error(error)
      }

      setNotifsLoading(false)
    }
  }

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead()
      setUnread(0)
      setNotifs((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-4 z-20 mx-4 mb-6 rounded-[32px] bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/20 dark:border-gray-700/40 shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-6 py-4 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden w-12 h-12 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition-all duration-300"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:block">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            {new Date().toDateString()}
          </p>
        </div>

        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-xl md:hidden">
          InternHub
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 rounded-2xl px-4 py-3 min-w-[260px]">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent outline-none w-full text-sm text-slate-700 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all duration-300"
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={openNotifs}
            className="relative w-12 h-12 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <Bell size={20} />

            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-4 w-[420px] rounded-[28px] overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700 shadow-[0_20px_60px_rgba(0,0,0,0.25)] z-50">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50/80 dark:bg-gray-800/60">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Stay updated with recent activity
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}

                  <button
                    onClick={() => setShowNotifs(false)}
                    className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center justify-center"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifsLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notifs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Bell size={34} className="mb-3 opacity-40" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifs.map((n) => (
                    <div
                      key={n.id}
                      className={`group px-5 py-4 border-b border-slate-100 dark:border-gray-700 last:border-0 transition-all duration-300 ${
                        !n.read
                          ? 'bg-indigo-50/80 dark:bg-indigo-900/20'
                          : 'hover:bg-white/60 dark:hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                          {TYPE_ICONS[n.type] || '🔔'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-white leading-snug">
                              {n.title}
                            </h4>

                            {!n.read && (
                              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1 flex-shrink-0"></div>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                            {n.message}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-2">
                            {formatDistanceToNow(new Date(n.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-[0_10px_30px_rgba(99,102,241,0.5)]">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-800 dark:text-white max-w-[120px] truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  )
}