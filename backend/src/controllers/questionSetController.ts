import { StatusCodes } from 'http-status-codes'
import type { Request, Response } from 'express'

import { createApiResponse } from '../utils/apiResponse.js'
import { QuestionSetService } from '../services/questionSetService.js'
import { QuestionSetRepository } from '../repositories/questionSetRepository.js'
import { prisma } from '../config/prisma.js'

const questionSetService = new QuestionSetService(new QuestionSetRepository(prisma))

export const questionSetController = {
  listAll: async (_req: Request, res: Response) => {
    const data = await questionSetService.listAll()
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Question sets retrieved.', data))
  },

  listPublished: async (_req: Request, res: Response) => {
    const data = await questionSetService.listPublished()
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Published question sets retrieved.', data))
  },

  getById: async (req: Request, res: Response) => {
    const id = String(req.params.id)
    const data = await questionSetService.getById(id)

    if (req.session.user?.role === 'student' && data.status !== 'published') {
      res.status(StatusCodes.NOT_FOUND).json(createApiResponse(false, 'Question set not found.', null))
      return
    }

    res.status(StatusCodes.OK).json(createApiResponse(true, 'Question set retrieved.', data))
  },

  upsert: async (req: Request, res: Response) => {
    const payload = req.params.id ? { ...req.body, id: String(req.params.id) } : req.body
    const data = await questionSetService.upsert(payload)
    const status = payload.id ? StatusCodes.OK : StatusCodes.CREATED
    res.status(status).json(createApiResponse(true, 'Question set saved.', data))
  },

  setStatus: async (req: Request, res: Response) => {
    const data = await questionSetService.setStatus(String(req.params.id), req.body.status)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Question set status updated.', data))
  },

  remove: async (req: Request, res: Response) => {
    await questionSetService.remove(String(req.params.id))
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Question set deleted.', null))
  },
}
