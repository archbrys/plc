import type { CreateUserPayload, ManagedUser, UpdateUserPayload } from '../types/user'
import { apiClient } from './apiClient'

export const userService = {
  async listAll(): Promise<ManagedUser[]> {
    const response = await apiClient.get<ManagedUser[]>('/api/users')
    return response.data
  },

  async create(payload: CreateUserPayload): Promise<{ ok: boolean; errors?: string[]; data?: ManagedUser }> {
    try {
      const response = await apiClient.post<ManagedUser>('/api/users', payload)
      return { ok: true, data: response.data }
    } catch (error) {
      return {
        ok: false,
        errors: [error instanceof Error ? error.message : 'Unable to create user.'],
      }
    }
  },

  async update(
    id: string,
    payload: UpdateUserPayload,
  ): Promise<{ ok: boolean; errors?: string[]; data?: ManagedUser }> {
    try {
      const response = await apiClient.put<ManagedUser>(`/api/users/${id}`, payload)
      return { ok: true, data: response.data }
    } catch (error) {
      return {
        ok: false,
        errors: [error instanceof Error ? error.message : 'Unable to update user.'],
      }
    }
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<null>(`/api/users/${id}`)
  },
}
