import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types/quiz'

interface RoleGuardProps {
  allowedRole: UserRole
}

export function RoleGuard({ allowedRole }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) {
    const loginPath = allowedRole === 'admin' ? '/admin/login' : '/student/login'
    return <Navigate to={loginPath} replace />
  }

  if (user.role !== allowedRole) {
    const fallback = user.role === 'admin' ? '/admin/dashboard' : '/student/plc'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
