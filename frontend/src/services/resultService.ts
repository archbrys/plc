import type { QuizResult, StudentAnswer } from '../types/quiz'
import { apiClient } from './apiClient'

export const resultService = {
  async submit(
    questionSetId: string,
    _studentId: string,
    answers: StudentAnswer[],
  ): Promise<{ ok: boolean; errors?: string[]; result?: QuizResult }> {
    try {
      const response = await apiClient.post<QuizResult>('/api/results/submit', {
        questionSetId,
        answers,
      })
      return { ok: true, result: response.data }
    } catch (error) {
      return {
        ok: false,
        errors: [error instanceof Error ? error.message : 'Unable to submit answers.'],
      }
    }
  },

  async listAll(): Promise<QuizResult[]> {
    const response = await apiClient.get<QuizResult[]>('/api/results')
    return response.data
  },

  async listByStudent(_studentId: string): Promise<QuizResult[]> {
    const response = await apiClient.get<QuizResult[]>('/api/results/me')
    return response.data
  },

  async getById(id: string): Promise<QuizResult | null> {
    const results = await this.listByStudent('')
    return results.find((result) => result.id === id) ?? null
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/api/results/${id}`)
  },
}
