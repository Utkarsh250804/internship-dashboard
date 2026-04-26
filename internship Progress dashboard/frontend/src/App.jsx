import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import Reports from './pages/Reports'
import ReportEditor from './pages/ReportEditor'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import Layout from './components/Layout'

/* 🔥 Premium Loader */
function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-72 h-72 bg-indigo-500/20 blur-[120px]"></div>

      <div className="flex flex-col items-center gap-4 z-10">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-400 text-sm tracking-wide">
          Loading your workspace...
        </span>
      </div>
    </div>
  )
}

/* 🔒 Private Route */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />

  return user ? children : <Navigate to="/login" replace />
}

/* 🌐 Public Route */
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />

  return user ? <Navigate to="/dashboard" replace /> : children
}

/* 🔥 Routes */
function AppRoutes({ darkMode, setDarkMode }) {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout darkMode={darkMode} setDarkMode={setDarkMode} />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="kanban" element={<KanbanBoard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/new" element={<ReportEditor />} />
        <Route path="reports/:id/edit" element={<ReportEditor />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

/* 🚀 Main App */
export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
      </BrowserRouter>
    </AuthProvider>
  )
}