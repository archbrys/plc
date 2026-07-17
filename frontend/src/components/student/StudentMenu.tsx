import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './StudentMenu.css'

export function StudentMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  if (!user) {
    return null
  }

  const handleResults = () => {
    setIsOpen(false)
    navigate('/student/result')
  }

  const handleLogout = () => {
    setIsOpen(false)
    logout()
  }

  return (
    <div className="student-menu" ref={menuRef}>
      <button
        type="button"
        className="student-menu-trigger btn-sm"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="student-menu-name">{user.displayName}</span>
        <span className={`student-menu-chevron ${isOpen ? 'open' : ''}`} aria-hidden="true">
          &#9662;
        </span>
      </button>

      {isOpen ? (
        <div className="student-menu-dropdown" role="menu">
          <button type="button" className="student-menu-item btn-sm" role="menuitem" onClick={handleResults}>
            My Results
          </button>
          <button type="button" className="student-menu-item btn-sm" role="menuitem" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}
