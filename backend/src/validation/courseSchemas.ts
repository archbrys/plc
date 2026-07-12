import { z } from 'zod'

const slideshowConfigSchema = z.object({
  images: z.array(z.string().min(1)).min(1),
  autoAdvanceMs: z.number().int().positive(),
})

const narrationConfigSchema = z.object({
  character: z.string().min(1),
  text: z.string().min(1),
  backgroundImage: z.string().optional(),
})

const contentSectionConfigSchema = z.object({
  sectionNumber: z.number().int().positive(),
  sectionTitle: z.string().min(1),
  chapterTitle: z.string().min(1),
  contents: z.array(z.string().min(1)).min(1),
  sideImage: z.string().optional(),
})

const interactivePracticeConfigSchema = z.object({}).strict()

const quizConfigSchema = z.object({
  questionSetId: z.string().min(1),
})

export const upsertPageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('slideshow'), orderNumber: z.number().int().min(1).optional(), config: slideshowConfigSchema }),
  z.object({ type: z.literal('narration'), orderNumber: z.number().int().min(1).optional(), config: narrationConfigSchema }),
  z.object({ type: z.literal('content_section'), orderNumber: z.number().int().min(1).optional(), config: contentSectionConfigSchema }),
  z.object({ type: z.literal('interactive_practice'), orderNumber: z.number().int().min(1).optional(), config: interactivePracticeConfigSchema }),
  z.object({ type: z.literal('quiz'), orderNumber: z.number().int().min(1).optional(), config: quizConfigSchema }),
])

export const upsertChapterSchema = z.object({
  title: z.string().min(1),
  orderNumber: z.number().int().min(1).optional(),
})

export const chapterIdParamSchema = z.object({
  chapterId: z.string().regex(/^\d+$/, 'Invalid chapter ID'),
})

export const pageIdParamSchema = z.object({
  pageId: z.string().regex(/^\d+$/, 'Invalid page ID'),
})

export const reorderSchema = z.object({
  orderedIds: z.array(z.number().int()).min(1),
})
