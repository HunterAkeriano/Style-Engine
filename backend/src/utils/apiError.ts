import type { Response } from 'express'

export interface ApiErrorPayload {
  status: number
  message: string
  code?: string
  details?: unknown
}

export interface ApiErrorOptions {
  code?: string
  details?: unknown
}

export function sendApiError(res: Response, status: number, message: string, options?: ApiErrorOptions) {
  const payload: ApiErrorPayload = { status, message }
  if (options?.code) payload.code = options.code
  if (options?.details !== undefined) payload.details = options.details
  return res.status(status).json({ error: payload })
}
