import { z } from 'zod'

export const createUserSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('admin'),
    fullName: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(4),
  }),
  z.object({
    role: z.literal('student'),
    fullName: z.string().min(1),
    studentId: z.string().min(1),
    pin: z.string().min(4),
  }),
])

export const updateUserSchema = z.object({
  fullName: z.string().min(1).optional(),
  username: z.string().min(1).optional(),
  studentId: z.string().min(1).optional(),
  password: z.string().min(4).optional(),
  pin: z.string().min(4).optional(),
})

export const userIdParamSchema = z.object({
  id: z.string().min(1),
})
