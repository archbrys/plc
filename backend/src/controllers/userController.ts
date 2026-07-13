import { StatusCodes } from 'http-status-codes'
import type { Request, Response } from 'express'

import { createApiResponse } from '../utils/apiResponse.js'
import { UserService } from '../services/userService.js'
import { UserRepository } from '../repositories/userRepository.js'
import { prisma } from '../config/prisma.js'

const userService = new UserService(new UserRepository(prisma))

export const userController = {
  list: async (_req: Request, res: Response) => {
    const data = await userService.list()
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Users retrieved.', data))
  },

  create: async (req: Request, res: Response) => {
    const data = await userService.create(req.body)
    res.status(StatusCodes.CREATED).json(createApiResponse(true, 'User created.', data))
  },

  update: async (req: Request, res: Response) => {
    const data = await userService.update(String(req.params.id), req.body)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'User updated.', data))
  },

  remove: async (req: Request, res: Response) => {
    await userService.remove(String(req.params.id))
    res.status(StatusCodes.OK).json(createApiResponse(true, 'User deleted.', null))
  },
}
