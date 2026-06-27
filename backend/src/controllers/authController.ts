import { StatusCodes } from 'http-status-codes'
import type { Request, Response } from 'express'

import { createApiResponse } from '../utils/apiResponse.js'
import { AuthService } from '../services/authService.js'
import { UserRepository } from '../repositories/userRepository.js'
import { prisma } from '../config/prisma.js'

const authService = new AuthService(new UserRepository(prisma))

export const authController = {
  login: async (req: Request, res: Response) => {
    const payload = req.body as {
      role: 'admin' | 'student'
      username?: string
      studentId?: string
      password?: string
      pin?: string
    }

    const user =
      payload.role === 'admin'
        ? await authService.loginAdmin(payload.username ?? '', payload.password ?? '')
        : await authService.loginStudent(payload.studentId ?? '', payload.pin ?? '')

    req.session.user = { id: user.id, role: user.role }

    res.status(StatusCodes.OK).json(createApiResponse(true, 'Login successful.', user))
  },

  logout: async (req: Request, res: Response) => {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) reject(error)
        else resolve()
      })
    })

    res.status(StatusCodes.OK).json(createApiResponse(true, 'Logout successful.', null))
  },

  me: async (req: Request, res: Response) => {
    const sessionUser = req.session.user
    if (!sessionUser) {
      res.status(StatusCodes.UNAUTHORIZED).json(createApiResponse(false, 'Unauthorized.', null))
      return
    }

    const user = await authService.getCurrentUser(sessionUser.id)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Session active.', user))
  },
}
