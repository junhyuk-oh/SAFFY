export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function isError(error: unknown): error is Error {
  return error instanceof Error
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return '알 수 없는 오류가 발생했습니다'
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error)
  
  if (isApiError(error)) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }
  
  const message = getErrorMessage(error)
  return Response.json(
    { error: message },
    { status: 500 }
  )
}