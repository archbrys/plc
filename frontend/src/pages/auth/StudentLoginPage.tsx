import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function StudentLoginPage() {
  const { user, loginStudent } = useAuth()
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user?.role === 'student') {
    return <Navigate to="/student/question-sets" replace />
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

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
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Student Login</h1>
        <p className="muted">Use your Student ID and PIN.</p>
        <p className="muted">Sample: S1001 / 1234</p>

        {error ? <p className="error-text">{error}</p> : null}

        <label className="field">
          <span>Student ID</span>
          <input value={studentId} onChange={(event) => setStudentId(event.target.value)} />
        </label>

        <label className="field">
          <span>PIN / Password</span>
          <input
            type="password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
        </label>

        <button type="submit" className="btn large" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
