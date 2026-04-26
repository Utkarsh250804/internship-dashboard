import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Trello,
  FileText,
  BarChart2,
  User,
  X,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/kanban', icon: Trello, label: 'Kanban Board' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar({ open, setOpen }) {
  const { user } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-72
          bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
          border-r border-slate-200 dark:border-gray-800
          flex flex-col justify-between
          shadow-2xl
          transform transition-all duration-300
          md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <GraduationCap size={22} className="text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                  InternHub
                </h1>
                <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-item-active'
                    : 'sidebar-item'
                }
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-slate-200 dark:border-gray-800">
          <div className="card-glass p-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-slate-800 dark:text-white truncate">
                {user?.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 capitalize truncate">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}