export interface ApiErrorResponse {
  status?: number
  message?: string
  code?: string | number
  details?: unknown
}

export class ApiError extends Error {
  status?: number
  code?: string | number
  details?: unknown
  cause?: unknown

  constructor(
    message: string,
    opts?: { status?: number; code?: string | number; details?: unknown; cause?: unknown },
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = opts?.status
    this.code = opts?.code
    this.details = opts?.details
    this.cause = opts?.cause
  }

  toResponse(): ApiErrorResponse {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    }
  }
}
