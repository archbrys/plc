import { z } from 'zod'

export const loginSchema = z
  .object({
    role: z.enum(['admin', 'student']),
    username: z.string().min(1).optional(),
    studentId: z.string().min(1).optional(),
    password: z.string().min(1).optional(),
    pin: z.string().min(1).optional(),
  })
  .superRefine((input, context) => {
    if (input.role === 'admin') {
      if (!input.username) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['username'], message: 'Username is required.' })
      }
      if (!input.password) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Password is required.' })
      }
    }

    if (input.role === 'student') {
      if (!input.studentId) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['studentId'], message: 'Student ID is required.' })
      }
      if (!input.pin) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['pin'], message: 'PIN is required.' })
      }
    }
  })
