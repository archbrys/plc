import { StatusCodes } from 'http-status-codes'
import type { Request, Response } from 'express'

import { createApiResponse } from '../utils/apiResponse.js'
import { QuestionSetRepository } from '../repositories/questionSetRepository.js'
import { SubmissionRepository } from '../repositories/submissionRepository.js'
import { ResultService } from '../services/resultService.js'
import { prisma } from '../config/prisma.js'

const resultService = new ResultService(
  new QuestionSetRepository(prisma),
  new SubmissionRepository(prisma),
)

export const resultController = {
  submit: async (req: Request, res: Response) => {
    const sessionUser = req.session.user
    const data = await resultService.submit(req.body.questionSetId, sessionUser!.id, req.body.answers)
    res.status(StatusCodes.CREATED).json(createApiResponse(true, 'Answers submitted.', data))
  },

  listAll: async (_req: Request, res: Response) => {
    const data = await resultService.listAll()
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Results retrieved.', data))
  },

  listMine: async (req: Request, res: Response) => {
    const sessionUser = req.session.user
    const data = await resultService.listByStudent(sessionUser!.id)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Student results retrieved.', data))
  },
}
