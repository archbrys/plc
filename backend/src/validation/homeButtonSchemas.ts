import { z } from 'zod'

const chapterTargetSchema = z.object({
  label: z.string().min(1),
  orderNumber: z.number().int().min(1).optional(),
  targetType: z.literal('CHAPTER'),
  chapterId: z.number().int(),
  isActive: z.boolean().optional(),
  requiredQuestionSetIds: z.array(z.string()).optional(),
})

const routeTargetSchema = z.object({
  label: z.string().min(1),
  orderNumber: z.number().int().min(1).optional(),
  targetType: z.literal('ROUTE'),
  route: z.string().regex(/^\//, 'Route must start with "/"'),
  isActive: z.boolean().optional(),
  requiredQuestionSetIds: z.array(z.string()).optional(),
})

export const upsertHomeButtonSchema = z.discriminatedUnion('targetType', [chapterTargetSchema, routeTargetSchema])

export const homeButtonIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid home button ID'),
})
