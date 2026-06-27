import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface AppShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  links?: Array<{ label: string; to: string }>
}

export function AppShell({ title, subtitle, children, links = [] }: AppShellProps) {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        <div className="header-actions">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="btn secondary">
              {link.label}
            </Link>
          ))}
          {user ? (
            <button className="btn" type="button" onClick={logout}>
              Logout
            </button>
          ) : null}
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
