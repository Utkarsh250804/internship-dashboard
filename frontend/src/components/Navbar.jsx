import { Bell, Moon, Sun, Menu, LogOut, X } from 'lucide-react'
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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Poll unread count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await notificationsAPI.getCount()
        setUnread(res.data.count)
      } catch {}
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30_000)
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
      } catch {}
      setNotifsLoading(false)
    }
  }

  const markAllRead = async () => {
    await notificationsAPI.markAllRead()
    setUnread(0)
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 h-14 flex items-center justify-between z-10 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu size={20} />
        </button>
        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg md:hidden">
          InternHub
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={openNotifs}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 card z-50 shadow-xl overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
                <span className="font-semibold text-sm">Notifications</span>
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
                    className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifsLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                  </div>
                ) : notifs.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-8">
                    <Bell size={28} className="mx-auto mb-2 opacity-30" />
                    No notifications yet
                  </div>
                ) : (
                  notifs.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b dark:border-gray-700 last:border-0 ${
                        !n.read
                          ? 'bg-indigo-50 dark:bg-indigo-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex gap-2.5">
                        <span className="text-base flex-shrink-0 mt-0.5">
                          {TYPE_ICONS[n.type] || '🔔'}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium leading-snug">{n.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                            {n.message}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        {!n.read && (
                          <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                        )}
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
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1.5 rounded-lg ml-1"
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden md:block max-w-[120px] truncate">
            {user?.name}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors ml-1"
          title="Logout"
        >
          <LogOut size={17} />
        </button>
      </div>
    </nav>
  )
}
