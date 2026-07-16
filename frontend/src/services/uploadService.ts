import { apiClient } from './apiClient'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)
    const response = await apiClient.postForm<{ url: string }>(`${API_BASE_URL}/uploads/image`, formData)
    return response.data.url
  },

  async uploadMedia(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('media', file)
    const response = await apiClient.postForm<{ url: string }>(`${API_BASE_URL}/uploads/media`, formData)
    return response.data.url
  },
}
