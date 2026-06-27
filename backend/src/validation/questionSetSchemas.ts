import { z } from 'zod'

const choiceSchema = z.object({
  choiceText: z.string().min(1),
  isCorrect: z.boolean(),
})

const questionSchema = z.object({
  questionText: z.string().min(1),
  questionType: z.enum(['multiple_choice', 'true_false', 'short_answer']),
  points: z.number().int().min(1),
  required: z.boolean(),
  choices: z.array(choiceSchema),
})

export const upsertQuestionSetSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().default(''),
  status: z.enum(['draft', 'published', 'archived']),
  questions: z.array(questionSchema),
})

export const questionSetIdParamSchema = z.object({
  id: z.string().min(1),
})

export const updateStatusSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']),
})
