import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AdminLoginPage() {
  const { user, loginAdmin } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (user?.role === 'student') {
    return <Navigate to="/student/question-sets" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

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

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <p className="muted">Manage question sets and results.</p>
        <p className="muted">Sample: admin / admin123</p>

        {error ? <p className="error-text">{error}</p> : null}

        <label className="field">
          <span>Username</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit" className="btn large" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
