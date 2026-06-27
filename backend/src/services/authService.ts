import bcrypt from 'bcrypt'
import { Role } from '@prisma/client'

import type { ApiUser, UserRole } from '../types/domain.js'
import { HttpError } from '../utils/httpError.js'
import { UserRepository } from '../repositories/userRepository.js'

function toRole(role: Role): UserRole {
  return role === Role.ADMIN ? 'admin' : 'student'
}

function toApiUser(user: {
  id: string
  role: Role
  fullName: string
  username: string | null
  studentId: string | null
}): ApiUser {
  const base: ApiUser = {
    id: user.id,
    role: toRole(user.role),
    displayName: user.fullName,
  }

  if (user.username) {
    base.username = user.username
  }

  if (user.studentId) {
    base.studentId = user.studentId
  }

  return base
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async loginAdmin(username: string, password: string): Promise<ApiUser> {
    const user = await this.userRepository.findByAdminUsername(username)
    if (!user || user.role !== Role.ADMIN) {
      throw new HttpError(401, 'Invalid admin credentials.')
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      throw new HttpError(401, 'Invalid admin credentials.')
    }

    return toApiUser(user)
  }

  async loginStudent(studentId: string, pin: string): Promise<ApiUser> {
    const user = await this.userRepository.findByStudentId(studentId)
    if (!user || user.role !== Role.STUDENT) {
      throw new HttpError(401, 'Invalid student credentials.')
    }

    const isValid = await bcrypt.compare(pin, user.passwordHash)
    if (!isValid) {
      throw new HttpError(401, 'Invalid student credentials.')
    }

    return toApiUser(user)
  }

  async getCurrentUser(userId: string): Promise<ApiUser> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new HttpError(401, 'Session is invalid.')
    }

    return toApiUser(user)
  }
}
