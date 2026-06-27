import type { QuestionSet, QuestionSetStatus } from '../types/quiz'
import { createId } from '../utils/id'
import { validateQuestionSetForPublish } from '../utils/validation'
import { initializeMockData } from './mockData'
import { getQuestionSets, setQuestionSets } from './storage'

initializeMockData()

export const questionSetService = {
  async listAll(): Promise<QuestionSet[]> {
    // Backend integration point:
    // Replace local storage reads with GET /api/question-sets.
    return getQuestionSets().sort((a, b) => a.title.localeCompare(b.title))
  },

  async listPublished(): Promise<QuestionSet[]> {
    // Backend integration point:
    // Replace local storage reads with GET /api/question-sets?status=published.
    return getQuestionSets().filter((set) => set.status === 'published')
  },

  async getById(id: string): Promise<QuestionSet | null> {
    const questionSet = getQuestionSets().find((set) => set.id === id)
    return questionSet ?? null
  },

  async upsert(questionSet: QuestionSet): Promise<{ ok: boolean; errors?: string[]; data?: QuestionSet }> {
    const all = getQuestionSets()
    const hasExisting = all.some((set) => set.id === questionSet.id)

    if (questionSet.status === 'published') {
      const validation = validateQuestionSetForPublish(questionSet)
      if (!validation.valid) {
        return { ok: false, errors: validation.errors }
      }
    }

    const normalized: QuestionSet = {
      ...questionSet,
      id: hasExisting ? questionSet.id : createId('set'),
      questions: questionSet.questions
        .map((question, index) => {
          const questionId = question.id || createId('q')
          return {
            ...question,
            id: questionId,
            questionSetId: hasExisting ? questionSet.id : '',
            orderNumber: index + 1,
            choices: question.choices.map((choice, choiceIndex) => ({
              ...choice,
              id: choice.id || createId('c'),
              questionId,
              orderNumber: choiceIndex + 1,
            })),
          }
        })
        .map((question) => ({ ...question, questionSetId: hasExisting ? questionSet.id : '' })),
    }

    normalized.questions = normalized.questions.map((question) => ({
      ...question,
      questionSetId: normalized.id,
    }))

    const next = hasExisting
      ? all.map((set) => (set.id === normalized.id ? normalized : set))
      : [...all, normalized]

    setQuestionSets(next)
    return { ok: true, data: normalized }
  },

  async setStatus(id: string, status: QuestionSetStatus): Promise<{ ok: boolean; errors?: string[] }> {
    const all = getQuestionSets()
    const target = all.find((set) => set.id === id)

    if (!target) {
      return { ok: false, errors: ['Question set not found.'] }
    }

    const updated: QuestionSet = { ...target, status }

    if (status === 'published') {
      const validation = validateQuestionSetForPublish(updated)
      if (!validation.valid) {
        return { ok: false, errors: validation.errors }
      }
    }

    setQuestionSets(all.map((set) => (set.id === id ? updated : set)))
    return { ok: true }
  },

  async archive(id: string): Promise<void> {
    const all = getQuestionSets()
    const next = all.map((set) => (set.id === id ? { ...set, status: 'archived' as const } : set))
    setQuestionSets(next)
  },

  async remove(id: string): Promise<void> {
    const all = getQuestionSets()
    setQuestionSets(all.filter((set) => set.id !== id))
  },
}
