import { z } from 'zod'

const answerSchema = z.object({
  questionId: z.string().min(1),
  answerText: z.string().optional(),
  selectedChoiceId: z.string().optional(),
  selectedBoolean: z.boolean().optional(),
})

export const submitResultSchema = z.object({
  questionSetId: z.string().min(1),
  answers: z.array(answerSchema),
})
