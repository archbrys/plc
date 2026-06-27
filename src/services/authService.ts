import type { AuthUser } from '../types/quiz'
import { initializeMockData } from './mockData'
import { getAdmins, getStudents } from './storage'

initializeMockData()

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
    // Backend integration point:
    // Replace this local lookup with a secure API call to your Express auth endpoint.
    const student = getStudents().find(
      (item) => item.studentId.toLowerCase() === studentId.toLowerCase() && item.pin === pin,
    )

    if (!student) {
      return null
    }

    const user: AuthUser = {
      id: student.id,
      role: 'student',
      displayName: student.fullName,
      studentId: student.studentId,
    }

    setCurrentUser(user)
    return user
  },

  async loginAdmin(username: string, password: string): Promise<AuthUser | null> {
    // Backend integration point:
    // Replace this local lookup with a secure API call to your Express auth endpoint.
    const admin = getAdmins().find(
      (item) => item.username.toLowerCase() === username.toLowerCase() && item.password === password,
    )

    if (!admin) {
      return null
    }

    const user: AuthUser = {
      id: admin.id,
      role: 'admin',
      displayName: admin.fullName,
      username: admin.username,
    }

    setCurrentUser(user)
    return user
  },

  logout(): void {
    // Backend integration point:
    // Add POST /api/auth/logout when server-managed sessions are implemented.
    setCurrentUser(null)
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
