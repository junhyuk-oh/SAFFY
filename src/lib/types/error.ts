/**
 * 에러 타입 정의
 * 애플리케이션 전반의 에러 처리를 위한 타입들을 정의합니다.
 */

import { ApiErrorCode, ApiStatusCode } from './api';

// 에러 심각도
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 에러 카테고리
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  DATABASE = 'database',
  NETWORK = 'network',
  SYSTEM = 'system',
  EXTERNAL_SERVICE = 'external_service',
  USER_INPUT = 'user_input',
  UNKNOWN = 'unknown'
}

// 기본 에러 인터페이스
export interface BaseError extends Error {
  code: string;
  timestamp: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: ErrorContext;
  isRetryable?: boolean;
  suggestion?: string;
}

// 에러 컨텍스트
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

// 애플리케이션 에러 클래스
export class AppError extends Error implements BaseError {
  code: string;
  timestamp: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: ErrorContext;
  isRetryable: boolean;
  suggestion?: string;
  
  constructor(params: {
    message: string;
    code: string;
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    context?: ErrorContext;
    isRetryable?: boolean;
    suggestion?: string;
  }) {
    super(params.message);
    this.name = 'AppError';
    this.code = params.code;
    this.timestamp = new Date().toISOString();
    this.severity = params.severity || ErrorSeverity.MEDIUM;
    this.category = params.category || ErrorCategory.UNKNOWN;
    this.context = params.context;
    this.isRetryable = params.isRetryable || false;
    this.suggestion = params.suggestion;
    
    // 스택 트레이스 유지
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// 유효성 검사 에러
export class ValidationError extends AppError {
  fields: ValidationErrorField[];
  
  constructor(message: string, fields: ValidationErrorField[]) {
    super({
      message,
      code: 'VALIDATION_ERROR',
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      isRetryable: false
    });
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

// 유효성 검사 에러 필드
export interface ValidationErrorField {
  field: string;
  value?: any;
  message: string;
  code?: string;
  constraint?: string;
  suggestion?: string;
}

// 인증 에러
export class AuthenticationError extends AppError {
  constructor(message: string, code: ApiErrorCode = ApiErrorCode.AUTH_INVALID) {
    super({
      message,
      code,
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      isRetryable: false,
      suggestion: '로그인 정보를 확인하고 다시 시도해주세요.'
    });
    this.name = 'AuthenticationError';
  }
}

// 권한 에러
export class AuthorizationError extends AppError {
  requiredPermissions?: string[];
  
  constructor(message: string, requiredPermissions?: string[]) {
    super({
      message,
      code: ApiErrorCode.PERMISSION_DENIED,
      category: ErrorCategory.AUTHORIZATION,
      severity: ErrorSeverity.MEDIUM,
      isRetryable: false,
      suggestion: '필요한 권한이 있는지 확인해주세요.'
    });
    this.name = 'AuthorizationError';
    this.requiredPermissions = requiredPermissions;
  }
}

// 비즈니스 로직 에러
export class BusinessLogicError extends AppError {
  constructor(message: string, code: string, suggestion?: string) {
    super({
      message,
      code,
      category: ErrorCategory.BUSINESS_LOGIC,
      severity: ErrorSeverity.MEDIUM,
      isRetryable: false,
      suggestion
    });
    this.name = 'BusinessLogicError';
  }
}

// 리소스 에러
export class ResourceError extends AppError {
  resourceType?: string;
  resourceId?: string;
  
  constructor(params: {
    message: string;
    code: ApiErrorCode;
    resourceType?: string;
    resourceId?: string;
    suggestion?: string;
  }) {
    super({
      message: params.message,
      code: params.code,
      category: ErrorCategory.BUSINESS_LOGIC,
      severity: ErrorSeverity.MEDIUM,
      isRetryable: false,
      suggestion: params.suggestion,
      context: {
        resource: params.resourceType,
        metadata: { resourceId: params.resourceId }
      }
    });
    this.name = 'ResourceError';
    this.resourceType = params.resourceType;
    this.resourceId = params.resourceId;
  }
}

// 데이터베이스 에러
export class DatabaseError extends AppError {
  query?: string;
  
  constructor(message: string, query?: string) {
    super({
      message,
      code: ApiErrorCode.DATABASE_ERROR,
      category: ErrorCategory.DATABASE,
      severity: ErrorSeverity.HIGH,
      isRetryable: true,
      suggestion: '잠시 후 다시 시도해주세요.'
    });
    this.name = 'DatabaseError';
    this.query = query;
  }
}

// 네트워크 에러
export class NetworkError extends AppError {
  url?: string;
  statusCode?: number;
  
  constructor(message: string, url?: string, statusCode?: number) {
    super({
      message,
      code: 'NETWORK_ERROR',
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      isRetryable: true,
      suggestion: '네트워크 연결을 확인하고 다시 시도해주세요.'
    });
    this.name = 'NetworkError';
    this.url = url;
    this.statusCode = statusCode;
  }
}

// 외부 서비스 에러
export class ExternalServiceError extends AppError {
  service: string;
  originalError?: any;
  
  constructor(service: string, message: string, originalError?: any) {
    super({
      message,
      code: ApiErrorCode.DEPENDENCY_ERROR,
      category: ErrorCategory.EXTERNAL_SERVICE,
      severity: ErrorSeverity.HIGH,
      isRetryable: true,
      context: {
        metadata: { service, originalError }
      }
    });
    this.name = 'ExternalServiceError';
    this.service = service;
    this.originalError = originalError;
  }
}

// 에러 로깅 인터페이스
export interface ErrorLog {
  id: string;
  error: BaseError;
  environment: {
    nodeVersion?: string;
    platform?: string;
    userAgent?: string;
    ip?: string;
  };
  additionalInfo?: Record<string, any>;
  createdAt: string;
}

// 에러 보고서 인터페이스
export interface ErrorReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    total: number;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
    byCode: Record<string, number>;
  };
  topErrors: Array<{
    code: string;
    count: number;
    message: string;
    lastOccurred: string;
  }>;
  trends: Array<{
    date: string;
    count: number;
    categories: Record<ErrorCategory, number>;
  }>;
}

// 에러 핸들러 타입
export type ErrorHandler<T extends Error = Error> = (error: T) => void | Promise<void>;

// 에러 변환기 타입
export type ErrorTransformer<T extends Error = Error, R = any> = (error: T) => R;

// 에러 복구 전략
export interface ErrorRecoveryStrategy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier?: number;
  shouldRetry: (error: BaseError, attempt: number) => boolean;
  onRetry?: (error: BaseError, attempt: number) => void | Promise<void>;
  onMaxRetriesExceeded?: (error: BaseError) => void | Promise<void>;
}

// HTTP 상태 코드와 에러 코드 매핑
export const HTTP_STATUS_TO_ERROR_CODE: Record<number, ApiErrorCode> = {
  [ApiStatusCode.BAD_REQUEST]: ApiErrorCode.VALIDATION_ERROR,
  [ApiStatusCode.UNAUTHORIZED]: ApiErrorCode.AUTH_REQUIRED,
  [ApiStatusCode.FORBIDDEN]: ApiErrorCode.PERMISSION_DENIED,
  [ApiStatusCode.NOT_FOUND]: ApiErrorCode.RESOURCE_NOT_FOUND,
  [ApiStatusCode.CONFLICT]: ApiErrorCode.RESOURCE_CONFLICT,
  [ApiStatusCode.UNPROCESSABLE_ENTITY]: ApiErrorCode.VALIDATION_ERROR,
  [ApiStatusCode.TOO_MANY_REQUESTS]: ApiErrorCode.RATE_LIMIT_EXCEEDED,
  [ApiStatusCode.INTERNAL_SERVER_ERROR]: ApiErrorCode.INTERNAL_ERROR,
  [ApiStatusCode.SERVICE_UNAVAILABLE]: ApiErrorCode.SERVICE_UNAVAILABLE
};

// 에러 메시지 템플릿
export const ERROR_MESSAGES = {
  // 인증/권한
  AUTH_REQUIRED: '인증이 필요합니다.',
  AUTH_INVALID: '인증 정보가 올바르지 않습니다.',
  AUTH_EXPIRED: '인증이 만료되었습니다.',
  PERMISSION_DENIED: '권한이 없습니다.',
  
  // 유효성 검사
  VALIDATION_ERROR: '입력값이 올바르지 않습니다.',
  INVALID_FORMAT: '형식이 올바르지 않습니다.',
  MISSING_FIELD: '필수 항목이 누락되었습니다.',
  INVALID_TYPE: '데이터 타입이 올바르지 않습니다.',
  
  // 리소스
  RESOURCE_NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  RESOURCE_ALREADY_EXISTS: '이미 존재하는 리소스입니다.',
  RESOURCE_CONFLICT: '리소스 충돌이 발생했습니다.',
  RESOURCE_LOCKED: '리소스가 잠겨있습니다.',
  
  // 시스템
  INTERNAL_ERROR: '서버 내부 오류가 발생했습니다.',
  SERVICE_UNAVAILABLE: '서비스를 일시적으로 사용할 수 없습니다.',
  DATABASE_ERROR: '데이터베이스 오류가 발생했습니다.',
  
  // 기타
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.'
} as const;