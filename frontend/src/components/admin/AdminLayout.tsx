import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import './AdminLayout.css'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: '▦' },
  { label: 'Question Sets', to: '/admin/question-sets', icon: '≡' },
  { label: 'Course Content', to: '/admin/course-content', icon: '▤' },
  { label: 'Students', to: '/admin/students', icon: '☺' },
  { label: 'Results', to: '/admin/results', icon: '✓' },
]

interface AdminLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
}

export function AdminLayout({ title, subtitle, children, actions }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-brand-mark">PLC</span>
          <span className="admin-sidebar-brand-text">Admin</span>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={isActive ? 'admin-nav-link active' : 'admin-nav-link'}
              >
                <span className="admin-nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="admin-sidebar-footer">
          {user ? (
            <div className="admin-user">
              <div className="admin-user-avatar">{user.displayName?.[0]?.toUpperCase() ?? 'A'}</div>
              <div className="admin-user-meta">
                <span className="admin-user-name">{user.displayName}</span>
                <span className="admin-user-role">Administrator</span>
              </div>
            </div>
          ) : null}
          {user ? (
            <button className="btn-outline admin-logout" type="button" onClick={logout}>
              Logout
            </button>
          ) : null}
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-title">{title}</h1>
            {subtitle ? <p className="admin-subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="admin-topbar-actions">{actions}</div> : null}
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
