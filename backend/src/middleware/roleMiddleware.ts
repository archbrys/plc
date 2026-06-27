import { StatusCodes } from 'http-status-codes'
import type { NextFunction, Request, Response } from 'express'

import { createApiResponse } from '../utils/apiResponse.js'
import type { UserRole } from '../types/domain.js'

export function roleMiddleware(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.session.user?.role
    if (!role || !roles.includes(role)) {
      res.status(StatusCodes.FORBIDDEN).json(
        createApiResponse(false, 'Forbidden. Insufficient permissions.', null),
      )
      return
    }

    next()
  }
}
