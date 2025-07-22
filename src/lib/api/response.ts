/**
 * API 응답 헬퍼 함수
 * 일관된 API 응답 형식을 보장하기 위한 유틸리티
 */

import { NextResponse } from 'next/server';
import { ApiResponse, ApiError, PaginatedResponse } from '@/lib/types/utility-types';

/**
 * 성공 응답 생성
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message
    },
    { status }
  );
}

/**
 * 에러 응답 생성
 */
export function errorResponse(
  error: string | Error | ApiError,
  status: number = 500
): NextResponse<ApiResponse> {
  let apiError: ApiError;

  if (typeof error === 'string') {
    apiError = {
      code: 'ERROR',
      message: error,
      timestamp: new Date().toISOString()
    };
  } else if (error instanceof Error) {
    apiError = {
      code: error.name || 'ERROR',
      message: error.message,
      details: { stack: error.stack },
      timestamp: new Date().toISOString()
    };
  } else {
    apiError = {
      ...error,
      timestamp: error.timestamp || new Date().toISOString()
    };
  }

  return NextResponse.json(
    {
      success: false,
      error: apiError,
      message: apiError.message
    },
    { status }
  );
}

/**
 * 페이지네이션 응답 생성
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  message?: string
): NextResponse<ApiResponse<PaginatedResponse<T>>> {
  const totalPages = Math.ceil(total / pageSize);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return successResponse<PaginatedResponse<T>>(
    {
      items,
      total,
      page,
      pageSize,
      totalPages,
      hasNext,
      hasPrevious
    },
    message
  );
}

/**
 * 생성 성공 응답 (201)
 */
export function createdResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return successResponse(data, message || 'Successfully created', 201);
}

/**
 * 업데이트 성공 응답
 */
export function updatedResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return successResponse(data, message || 'Successfully updated');
}

/**
 * 삭제 성공 응답 (204)
 */
export function deletedResponse(message?: string): NextResponse<ApiResponse> {
  return successResponse(null, message || 'Successfully deleted', 204);
}

/**
 * 데이터 없음 응답 (404)
 */
export function notFoundResponse(resource: string = 'Resource'): NextResponse<ApiResponse> {
  return errorResponse(
    {
      code: 'NOT_FOUND',
      message: `${resource} not found`
    },
    404
  );
}

/**
 * 잘못된 요청 응답 (400)
 */
export function badRequestResponse(message: string, details?: any): NextResponse<ApiResponse> {
  return errorResponse(
    {
      code: 'BAD_REQUEST',
      message,
      details
    },
    400
  );
}

/**
 * 인증 필요 응답 (401)
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return errorResponse(
    {
      code: 'UNAUTHORIZED',
      message
    },
    401
  );
}

/**
 * 권한 없음 응답 (403)
 */
export function forbiddenResponse(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return errorResponse(
    {
      code: 'FORBIDDEN',
      message
    },
    403
  );
}

/**
 * 충돌 응답 (409)
 */
export function conflictResponse(message: string, details?: any): NextResponse<ApiResponse> {
  return errorResponse(
    {
      code: 'CONFLICT',
      message,
      details
    },
    409
  );
}

/**
 * 유효성 검증 실패 응답 (422)
 */
export function validationErrorResponse(
  errors: Record<string, string>
): NextResponse<ApiResponse> {
  return errorResponse(
    {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: { errors }
    },
    422
  );
}

/**
 * 메서드 허용 안함 응답 (405)
 */
export function methodNotAllowedResponse(
  allowedMethods: string[]
): NextResponse<ApiResponse> {
  return errorResponse(
    {
      code: 'METHOD_NOT_ALLOWED',
      message: `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`
    },
    405
  );
}

/**
 * 너무 많은 요청 응답 (429)
 */
export function tooManyRequestsResponse(
  retryAfter?: number
): NextResponse<ApiResponse> {
  const headers = retryAfter ? { 'Retry-After': retryAfter.toString() } : undefined;
  
  return new NextResponse(
    JSON.stringify({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests',
        timestamp: new Date().toISOString()
      }
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }
  );
}

/**
 * 서버 에러 응답 (500)
 */
export function serverErrorResponse(
  error?: Error | string
): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : error || 'Internal server error';
  return errorResponse(
    {
      code: 'INTERNAL_SERVER_ERROR',
      message
    },
    500
  );
}