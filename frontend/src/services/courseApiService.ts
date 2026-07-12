import { apiClient } from './apiClient'
import type { Course, CourseChapter } from '../types/course'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const courseApiService = {
  async getCourse(): Promise<Course> {
    const response = await apiClient.get<Course>(`${API_BASE_URL}/course`)
    return response.data
  },

  async getChapter(chapterId: number): Promise<CourseChapter> {
    const response = await apiClient.get<CourseChapter>(`${API_BASE_URL}/course/chapters/${chapterId}`)
    return response.data
  },
}
