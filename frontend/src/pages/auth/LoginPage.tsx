import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

type LoginMode = 'student' | 'admin'

export function LoginPage() {
  const { user, loginStudent, loginAdmin } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<LoginMode>('student')
  const [studentId, setStudentId] = useState('')
  const [pin, setPin] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user?.role === 'student') {
    return <Navigate to="/student/question-sets" replace />
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  const switchMode = () => {
    setMode((prev) => (prev === 'student' ? 'admin' : 'student'))
    setError('')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (mode === 'student') {
      if (!studentId.trim() || !pin.trim()) {
        setError('Student ID and PIN are required.')
        return
      }

      setLoading(true)
      const success = await loginStudent(studentId, pin)
      setLoading(false)

      if (!success) {
        setError('Invalid student credentials.')
        return
      }

      navigate('/student/question-sets')
    } else {
      if (!username.trim() || !password.trim()) {
        setError('Username and password are required.')
        return
      }

      setLoading(true)
      const success = await loginAdmin(username, password)
      setLoading(false)

      if (!success) {
        setError('Invalid admin credentials.')
        return
      }

      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="auth-page">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: 'min(420px, 100%)' }}>
        <img
          src="/assets/logo-plc.png"
          alt="PLC Logo"
          style={{
            maxWidth: '300px',
            width: '100%',
            height: 'auto',
          }}
        />
        <form className="card auth-card" onSubmit={handleSubmit} style={{ width: '100%', margin: 0 }}>
        <h1>{mode === 'student' ? 'Student Login' : 'Admin Login'}</h1>

        {error && <p className="error-text">{error}</p>}

        {mode === 'student' ? (
          <>
            <label className="field">
              <span>Student ID</span>
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                autoFocus
              />
            </label>
            <label className="field">
              <span>PIN</span>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </label>
          </>
        ) : (
          <>
            <label className="field">
              <span>Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </>
        )}

        <button type="submit" className="btn large" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className="auth-switch">
          <button type="button" className="auth-switch-link" onClick={switchMode}>
            {mode === 'student' ? 'Login as Admin' : 'Login as Student'}
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}
