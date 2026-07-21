import { apiClient } from './apiClient'
import type { ChapterPage, ChapterPageType, ChapterPageConfig, Course, CourseChapter } from '../types/course'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface UpsertPagePayload {
  type: ChapterPageType
  orderNumber?: number
  config: ChapterPageConfig
}

export const courseApiService = {
  async getCourse(): Promise<Course> {
    const response = await apiClient.get<Course>(`${API_BASE_URL}/course`)
    return response.data
  },

  async getChapter(chapterId: number): Promise<CourseChapter> {
    const response = await apiClient.get<CourseChapter>(`${API_BASE_URL}/course/chapters/${chapterId}`)
    return response.data
  },

  async createChapter(title: string, group?: string | null): Promise<CourseChapter> {
    const response = await apiClient.post<CourseChapter>(`${API_BASE_URL}/course/chapters`, { title, group })
    return response.data
  },

  async updateChapter(
    chapterId: number,
    payload: { title?: string; orderNumber?: number; group?: string | null },
  ): Promise<CourseChapter> {
    const response = await apiClient.put<CourseChapter>(`${API_BASE_URL}/course/chapters/${chapterId}`, payload)
    return response.data
  },

  async deleteChapter(chapterId: number): Promise<void> {
    await apiClient.delete<null>(`${API_BASE_URL}/course/chapters/${chapterId}`)
  },

  async reorderChapters(orderedIds: number[]): Promise<void> {
    await apiClient.patch<null>(`${API_BASE_URL}/course/chapters/reorder`, { orderedIds })
  },

  async createPage(chapterId: number, payload: UpsertPagePayload): Promise<ChapterPage> {
    const response = await apiClient.post<ChapterPage>(`${API_BASE_URL}/course/chapters/${chapterId}/pages`, payload)
    return response.data
  },

  async updatePage(pageId: number, payload: UpsertPagePayload): Promise<ChapterPage> {
    const response = await apiClient.put<ChapterPage>(`${API_BASE_URL}/course/pages/${pageId}`, payload)
    return response.data
  },

  async deletePage(pageId: number): Promise<void> {
    await apiClient.delete<null>(`${API_BASE_URL}/course/pages/${pageId}`)
  },

  async reorderPages(chapterId: number, orderedIds: number[]): Promise<void> {
    await apiClient.patch<null>(`${API_BASE_URL}/course/chapters/${chapterId}/pages/reorder`, { orderedIds })
  },
}
