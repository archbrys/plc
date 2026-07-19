import { apiClient } from './apiClient'
import type { HomeButton } from '../types/homeButton'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export type UpsertHomeButtonPayload =
  | {
      label: string
      orderNumber?: number
      targetType: 'CHAPTER'
      chapterId: number
      isActive?: boolean
      requiredQuestionSetIds?: string[]
    }
  | {
      label: string
      orderNumber?: number
      targetType: 'ROUTE'
      route: string
      isActive?: boolean
      requiredQuestionSetIds?: string[]
    }

export const homeButtonApiService = {
  async getHomeButtons(): Promise<HomeButton[]> {
    const response = await apiClient.get<HomeButton[]>(`${API_BASE_URL}/home-buttons`)
    return response.data
  },

  async createHomeButton(payload: UpsertHomeButtonPayload): Promise<HomeButton> {
    const response = await apiClient.post<HomeButton>(`${API_BASE_URL}/home-buttons`, payload)
    return response.data
  },

  async updateHomeButton(id: number, payload: UpsertHomeButtonPayload): Promise<HomeButton> {
    const response = await apiClient.put<HomeButton>(`${API_BASE_URL}/home-buttons/${id}`, payload)
    return response.data
  },

  async deleteHomeButton(id: number): Promise<void> {
    await apiClient.delete<null>(`${API_BASE_URL}/home-buttons/${id}`)
  },

  async reorderHomeButtons(orderedIds: number[]): Promise<void> {
    await apiClient.patch<null>(`${API_BASE_URL}/home-buttons/reorder`, { orderedIds })
  },
}
