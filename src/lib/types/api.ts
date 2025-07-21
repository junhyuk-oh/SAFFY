/**
 * API 관련 타입 정의
 * API 요청/응답 표준화 및 에러 처리를 위한 타입들을 정의합니다.
 */

import { Pagination, SortOptions, FilterOptions } from './common';

// HTTP 메서드
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API 상태 코드
export enum ApiStatusCode {
  // 성공
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  
  // 리다이렉션
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,
  
  // 클라이언트 에러
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  
  // 서버 에러
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

// API 에러 코드
export enum ApiErrorCode {
  // 인증/권한
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // 유효성 검사
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_FORMAT = 'INVALID_FORMAT',
  MISSING_FIELD = 'MISSING_FIELD',
  INVALID_TYPE = 'INVALID_TYPE',
  
  // 리소스
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_LOCKED = 'RESOURCE_LOCKED',
  
  // 비즈니스 로직
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // 시스템
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // 기타
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 기본 API 응답 구조
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  metadata?: ApiMetadata;
}

// API 에러 구조
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: ApiErrorDetail[];
  timestamp: string;
  path?: string;
  method?: HttpMethod;
  requestId?: string;
}

// API 에러 상세
export interface ApiErrorDetail {
  field?: string;
  value?: unknown;
  issue: string;
  suggestion?: string;
}

// API 메타데이터
export interface ApiMetadata {
  timestamp: string;
  requestId: string;
  version: string;
  duration?: number; // 요청 처리 시간 (ms)
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: string; // ISO 8601
  };
}

// 페이지네이션 응답
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  pagination: Pagination;
  sort?: SortOptions;
  filters?: FilterOptions;
}

// 배치 작업 요청
export interface BatchRequest<T> {
  operations: Array<{
    id: string;
    method: HttpMethod;
    path: string;
    body?: T;
  }>;
}

// 배치 작업 응답
export interface BatchResponse {
  results: Array<{
    id: string;
    status: ApiStatusCode;
    response?: unknown;
    error?: ApiError;
  }>;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

// 파일 업로드 요청
export interface FileUploadRequest {
  file: File;
  metadata?: {
    name?: string;
    description?: string;
    tags?: string[];
    permissions?: {
      public?: boolean;
      allowedUsers?: string[];
      allowedRoles?: string[];
    };
  };
}

// 파일 업로드 응답
export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  metadata?: Record<string, unknown>;
  uploadedAt: string;
}

// API 요청 옵션
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: {
    enabled: boolean;
    ttl?: number; // seconds
    key?: string;
  };
  transform?: {
    request?: (data: unknown) => unknown;
    response?: (data: unknown) => unknown;
  };
}

// API 엔드포인트 정의
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  description?: string;
  auth?: boolean;
  permissions?: string[];
  rateLimit?: {
    requests: number;
    window: number; // seconds
  };
  cache?: {
    ttl: number;
    vary?: string[];
  };
}

// API 상태 응답
export interface ApiHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  services: Array<{
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime?: number;
    error?: string;
  }>;
}

// 웹소켓 메시지 타입
export interface WebSocketMessage<T = unknown> {
  id: string;
  type: string;
  payload: T;
  timestamp: string;
  channel?: string;
}

// 실시간 이벤트 타입
export enum RealtimeEventType {
  // 문서 관련
  DOCUMENT_CREATED = 'document.created',
  DOCUMENT_UPDATED = 'document.updated',
  DOCUMENT_DELETED = 'document.deleted',
  DOCUMENT_APPROVED = 'document.approved',
  DOCUMENT_REJECTED = 'document.rejected',
  
  // 사용자 관련
  USER_ONLINE = 'user.online',
  USER_OFFLINE = 'user.offline',
  USER_TYPING = 'user.typing',
  
  // 시스템 관련
  SYSTEM_MAINTENANCE = 'system.maintenance',
  SYSTEM_UPDATE = 'system.update',
  SYSTEM_ALERT = 'system.alert'
}

// API 클라이언트 설정
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  auth?: {
    type: 'bearer' | 'basic' | 'apikey';
    credentials: string;
  };
  retry?: {
    attempts: number;
    delay: number;
    backoff?: 'linear' | 'exponential';
  };
  interceptors?: {
    request?: (config: Record<string, unknown>) => Record<string, unknown>;
    response?: (response: Record<string, unknown>) => Record<string, unknown>;
    error?: (error: Error | Record<string, unknown>) => Error | Record<string, unknown>;
  };
}

// API 응답 변환 유틸리티 타입
export type ApiResponseTransformer<T, R> = (response: ApiResponse<T>) => R;

// API 에러 핸들러 타입
export type ApiErrorHandler = (error: ApiError) => void | Promise<void>;

// API 미들웨어 타입
export interface ApiMiddleware {
  pre?: (request: Record<string, unknown>) => Record<string, unknown> | Promise<Record<string, unknown>>;
  post?: (response: Record<string, unknown>) => Record<string, unknown> | Promise<Record<string, unknown>>;
  error?: (error: Error | Record<string, unknown>) => Error | Record<string, unknown> | Promise<Error | Record<string, unknown>>;
}