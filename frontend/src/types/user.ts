import type { UserRole } from './quiz'

export interface ManagedUser {
  id: string
  role: UserRole
  fullName: string
  username?: string
  studentId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  role: UserRole
  fullName: string
  username?: string
  password?: string
  studentId?: string
  pin?: string
}

export interface UpdateUserPayload {
  fullName?: string
  username?: string
  studentId?: string
  password?: string
  pin?: string
}
