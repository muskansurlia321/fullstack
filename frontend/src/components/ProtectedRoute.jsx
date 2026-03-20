import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Spinner } from './Spinner.jsx'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Spinner label="Checking session…" />
  if (!user) return <Navigate to="/login" replace />
  return children
}

