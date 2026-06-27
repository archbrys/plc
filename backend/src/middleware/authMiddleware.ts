import { StatusCodes } from 'http-status-codes'
import type { NextFunction, Request, Response } from 'express'

import { createApiResponse } from '../utils/apiResponse.js'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.user) {
    res.status(StatusCodes.UNAUTHORIZED).json(
      createApiResponse(false, 'Unauthorized. Please log in.', null),
    )
    return
  }

  next()
}
