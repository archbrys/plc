import bcrypt from 'bcrypt'
import { Role, type User } from '@prisma/client'

import type { UserDTO, UserRole } from '../types/domain.js'
import { HttpError } from '../utils/httpError.js'
import { UserRepository } from '../repositories/userRepository.js'

const SALT_ROUNDS = 10

function toRole(role: Role): UserRole {
  return role === Role.ADMIN ? 'admin' : 'student'
}

function toUserDTO(user: User): UserDTO {
  const dto: UserDTO = {
    id: user.id,
    role: toRole(user.role),
    fullName: user.fullName,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }

  if (user.username) dto.username = user.username
  if (user.studentId) dto.studentId = user.studentId

  return dto
}

export interface CreateUserInput {
  role: 'admin' | 'student'
  fullName: string
  username?: string
  password?: string
  studentId?: string
  pin?: string
}

export interface UpdateUserInput {
  fullName?: string
  username?: string
  studentId?: string
  password?: string
  pin?: string
}

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async list(): Promise<UserDTO[]> {
    const users = await this.repository.list()
    return users.map(toUserDTO)
  }

  async getById(id: string): Promise<UserDTO> {
    const user = await this.repository.findById(id)
    if (!user) throw new HttpError(404, 'User not found.')
    return toUserDTO(user)
  }

  async create(input: CreateUserInput): Promise<UserDTO> {
    if (input.role === 'admin') {
      if (!input.username || !input.password) {
        throw new HttpError(400, 'Username and password are required for an admin.')
      }

      const existing = await this.repository.findByAdminUsername(input.username)
      if (existing) throw new HttpError(409, 'Username is already in use.')

      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
      const created = await this.repository.create({
        role: Role.ADMIN,
        fullName: input.fullName,
        username: input.username,
        passwordHash,
      })

      return toUserDTO(created)
    }

    if (!input.studentId || !input.pin) {
      throw new HttpError(400, 'Student ID and PIN are required for a student.')
    }

    const existing = await this.repository.findByStudentId(input.studentId)
    if (existing) throw new HttpError(409, 'Student ID is already in use.')

    const passwordHash = await bcrypt.hash(input.pin, SALT_ROUNDS)
    const created = await this.repository.create({
      role: Role.STUDENT,
      fullName: input.fullName,
      studentId: input.studentId,
      passwordHash,
    })

    return toUserDTO(created)
  }

  async update(id: string, input: UpdateUserInput): Promise<UserDTO> {
    const existing = await this.repository.findById(id)
    if (!existing) throw new HttpError(404, 'User not found.')

    if (existing.role === Role.ADMIN && input.username && input.username !== existing.username) {
      const conflict = await this.repository.findByAdminUsername(input.username)
      if (conflict) throw new HttpError(409, 'Username is already in use.')
    }

    if (existing.role === Role.STUDENT && input.studentId && input.studentId !== existing.studentId) {
      const conflict = await this.repository.findByStudentId(input.studentId)
      if (conflict) throw new HttpError(409, 'Student ID is already in use.')
    }

    const secret = existing.role === Role.ADMIN ? input.password : input.pin
    const passwordHash = secret ? await bcrypt.hash(secret, SALT_ROUNDS) : undefined

    const updated = await this.repository.update(id, {
      fullName: input.fullName ?? existing.fullName,
      username: existing.role === Role.ADMIN ? input.username ?? existing.username : existing.username,
      studentId: existing.role === Role.STUDENT ? input.studentId ?? existing.studentId : existing.studentId,
      ...(passwordHash ? { passwordHash } : {}),
    })

    return toUserDTO(updated)
  }

  async remove(id: string): Promise<void> {
    const existing = await this.repository.findById(id)
    if (!existing) throw new HttpError(404, 'User not found.')

    await this.repository.delete(id)
  }
}
