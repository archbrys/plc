import type { QuestionSet, QuestionSetStatus } from '../types/quiz'
import { apiClient } from './apiClient'

export const questionSetService = {
  async listAll(): Promise<QuestionSet[]> {
    const response = await apiClient.get<QuestionSet[]>('/api/question-sets')
    return response.data
  },

  async listPublished(): Promise<QuestionSet[]> {
    const response = await apiClient.get<QuestionSet[]>('/api/question-sets/public')
    return response.data
  },

  async getById(id: string): Promise<QuestionSet | null> {
    try {
      const response = await apiClient.get<QuestionSet>(`/api/question-sets/${id}`)
      return response.data
    } catch {
      return null
    }
  },

  async upsert(questionSet: QuestionSet): Promise<{ ok: boolean; errors?: string[]; data?: QuestionSet }> {
    try {
      const payload = {
        id: questionSet.id || undefined,
        title: questionSet.title,
        description: questionSet.description,
        status: questionSet.status,
        questions: questionSet.questions
          .sort((a, b) => a.orderNumber - b.orderNumber)
          .map((question) => ({
            questionText: question.questionText,
            questionType: question.questionType,
            points: question.points,
            required: question.required,
            choices: question.choices
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map((choice) => ({
                choiceText: choice.choiceText,
                isCorrect: choice.isCorrect,
              })),
          })),
      }

      const response = questionSet.id
        ? await apiClient.put<QuestionSet>(`/api/question-sets/${questionSet.id}`, payload)
        : await apiClient.post<QuestionSet>('/api/question-sets', payload)

      return { ok: true, data: response.data }
    } catch (error) {
      return {
        ok: false,
        errors: [error instanceof Error ? error.message : 'Unable to save question set.'],
      }
    }
  },

  async setStatus(id: string, status: QuestionSetStatus): Promise<{ ok: boolean; errors?: string[] }> {
    try {
      await apiClient.patch<QuestionSet>(`/api/question-sets/${id}/status`, { status })
      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        errors: [error instanceof Error ? error.message : 'Unable to update status.'],
      }
    }
  },

  async archive(id: string): Promise<void> {
    await apiClient.patch<QuestionSet>(`/api/question-sets/${id}/status`, { status: 'archived' })
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<null>(`/api/question-sets/${id}`)
  },
}
