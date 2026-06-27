import type { AuthUser } from '../types/quiz'
import { apiClient } from './apiClient'

const AUTH_SESSION_KEY = 'quiz_auth_user'

function setCurrentUser(user: AuthUser | null): void {
  if (user) {
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user))
    return
  }

  sessionStorage.removeItem(AUTH_SESSION_KEY)
}

export const authService = {
  async loginStudent(studentId: string, pin: string): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<AuthUser>('/api/auth/login', {
        role: 'student',
        studentId,
        pin,
      })
      setCurrentUser(response.data)
      return response.data
    } catch {
      return null
    }
  },

  async loginAdmin(username: string, password: string): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<AuthUser>('/api/auth/login', {
        role: 'admin',
        username,
        password,
      })
      setCurrentUser(response.data)
      return response.data
    } catch {
      return null
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<null>('/api/auth/logout')
    } catch {
      // Ignore server logout failures and clear local state anyway.
    }
    setCurrentUser(null)
  },

  async me(): Promise<AuthUser | null> {
    try {
      const response = await apiClient.get<AuthUser>('/api/auth/me')
      setCurrentUser(response.data)
      return response.data
    } catch {
      setCurrentUser(null)
      return null
    }
  },

  getCurrentUser(): AuthUser | null {
    try {
      const raw = sessionStorage.getItem(AUTH_SESSION_KEY)
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  },
}
