import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '../services/authService'
import type { AuthUser } from '../types/quiz'

interface AuthContextValue {
  user: AuthUser | null
  loginStudent: (studentId: string, pin: string) => Promise<boolean>
  loginAdmin: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const IDLE_TIMEOUT_MS = 10 * 60 * 1000

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser())
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    authService.me().then((sessionUser) => {
      if (sessionUser) {
        setUser(sessionUser)
      }
    })
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const logout = useCallback(() => {
    clearTimer()
    setUser(null)
    void authService.logout()
    sessionStorage.removeItem('quiz_last_result_id')
  }, [clearTimer])

  const resetIdleTimer = useCallback(() => {
    clearTimer()
    if (!user) {
      return
    }

    timerRef.current = window.setTimeout(() => {
      logout()
      window.alert('You were logged out due to inactivity.')
    }, IDLE_TIMEOUT_MS)
  }, [clearTimer, logout, user])

  useEffect(() => {
    if (!user) {
      clearTimer()
      return
    }

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
    ]

    const handler = () => {
      resetIdleTimer()
    }

    events.forEach((eventName) => {
      window.addEventListener(eventName, handler)
    })

    resetIdleTimer()

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handler)
      })
      clearTimer()
    }
  }, [clearTimer, resetIdleTimer, user])

  const loginStudent = useCallback(async (studentId: string, pin: string) => {
    const nextUser = await authService.loginStudent(studentId, pin)
    if (!nextUser) {
      return false
    }

    setUser(nextUser)
    return true
  }, [])

  const loginAdmin = useCallback(async (username: string, password: string) => {
    const nextUser = await authService.loginAdmin(username, password)
    if (!nextUser) {
      return false
    }

    setUser(nextUser)
    return true
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginStudent,
      loginAdmin,
      logout,
    }),
    [loginAdmin, loginStudent, logout, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider.')
  }

  return context
}
