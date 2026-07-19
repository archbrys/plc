import { StatusCodes } from 'http-status-codes'
import type { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

import { createApiResponse } from '../utils/apiResponse.js'
import { HttpError } from '../utils/httpError.js'
import { logger } from '../utils/logger.js'

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join(' ')
    res.status(StatusCodes.BAD_REQUEST).json(createApiResponse(false, message, null))
    return
  }

  if (error instanceof MulterError) {
    res.status(StatusCodes.BAD_REQUEST).json(createApiResponse(false, error.message, null))
    return
  }

  if (
    error instanceof Error &&
    (error.message.includes('Only PNG, JPEG, WEBP, or GIF') || error.message.includes('Only MP4, WEBM, or PDF'))
  ) {
    res.status(StatusCodes.BAD_REQUEST).json(createApiResponse(false, error.message, null))
    return
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json(createApiResponse(false, error.message, null))
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
    res
      .status(StatusCodes.CONFLICT)
      .json(createApiResponse(false, 'This record is still referenced by another record and cannot be deleted.', null))
    return
  }

  const code = (error as NodeJS.ErrnoException)?.code
  if (code === 'ENOSPC' || code === 'SQLITE_FULL') {
    logger.error('Disk full while handling request', error)
    res
      .status(StatusCodes.INSUFFICIENT_STORAGE)
      .json(createApiResponse(false, 'Server storage is full. Free up space on the device and try again.', null))
    return
  }

  logger.error('Unhandled error', { code, message: (error as Error)?.message, error })
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(createApiResponse(false, 'Internal server error.', null))
}
