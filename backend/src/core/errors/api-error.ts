export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly details?: unknown

  constructor(status: number, message: string, options?: { code?: string; details?: unknown }) {
    super(message)
    this.status = status
    this.code = options?.code
    this.details = options?.details
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}
