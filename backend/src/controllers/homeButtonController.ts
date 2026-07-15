import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { homeButtonService } from '../services/homeButtonService.js'
import { createApiResponse } from '../utils/apiResponse.js'
import { HttpError } from '../utils/httpError.js'

function parseId(raw: unknown): number {
  const id = Number.parseInt(String(raw), 10)
  if (Number.isNaN(id)) {
    throw new HttpError(400, 'Invalid home button ID')
  }
  return id
}

export const homeButtonController = {
  list: async (req: Request, res: Response) => {
    const includeInactive = req.session.user?.role === 'admin'
    const data = await homeButtonService.listButtons(includeInactive)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Home buttons retrieved successfully.', data))
  },

  create: async (req: Request, res: Response) => {
    const data = await homeButtonService.createButton(req.body)
    res.status(StatusCodes.CREATED).json(createApiResponse(true, 'Home button created.', data))
  },

  update: async (req: Request, res: Response) => {
    const id = parseId(req.params.id)
    const data = await homeButtonService.updateButton(id, req.body)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Home button updated.', data))
  },

  remove: async (req: Request, res: Response) => {
    const id = parseId(req.params.id)
    await homeButtonService.deleteButton(id)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Home button deleted.', null))
  },

  reorder: async (req: Request, res: Response) => {
    await homeButtonService.reorderButtons(req.body.orderedIds)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Home buttons reordered.', null))
  },
}
