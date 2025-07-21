/**
 * 공통 타입 정의 파일
 * 프로젝트 전반에서 사용되는 기본 타입들을 정의합니다.
 */

// 기본 타임스탬프 인터페이스
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

// 서명 정보 인터페이스
export interface Signature {
  signature?: string;
  signedAt?: string;
}

// 첨부파일 인터페이스
export interface Attachment {
  name: string;
  url: string;
  type: string;
  size?: number;
}

// 상태 타입
export type Status = 'draft' | 'pending' | 'in-progress' | 'completed' | 'approved' | 'rejected' | 'archived' | 'overdue';

// 우선순위 타입
export type Priority = 'critical' | 'high' | 'medium' | 'low';

// 위험 수준 타입
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

// 안전 상태 타입
export type SafetyStatus = 'safe' | 'warning' | 'danger';

// 기간 타입
export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';

// 분기 타입
export type Quarter = 1 | 2 | 3 | 4;

// 사용자 정보 인터페이스
export interface User {
  id: string;
  name: string;
  email?: string;
  department?: string;
  position?: string;
  role?: string;
}

// 부서 정보 인터페이스
export interface Department {
  id: string;
  name: string;
  code?: string;
  managerId?: string;
  parentId?: string;
}

// 페이지네이션 인터페이스
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 정렬 옵션 인터페이스
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// 필터 옵션 인터페이스
export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  department?: string;
  status?: Status;
  type?: string;
  [key: string]: string | number | boolean | Status | undefined;
}

// API 응답 타입은 api.ts에서 import하여 사용

// API 에러 타입은 api.ts에서 import하여 사용

// 리스트 응답 구조
export interface ListResponse<T> {
  items: T[];
  pagination: Pagination;
  filters?: FilterOptions;
  sort?: SortOptions;
}

// 날짜 범위 인터페이스
export interface DateRange {
  start: string;
  end: string;
}

// 통계 데이터 인터페이스
export interface Statistics {
  label: string;
  value: number;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
}

// 차트 데이터 포인트
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  meta?: Record<string, unknown>;
}

// 알림 타입
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// 알림 인터페이스
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// 액션 타입 (Redux나 상태 관리용)
export interface Action<T = unknown> {
  type: string;
  payload?: T;
  error?: boolean;
  meta?: Record<string, unknown>;
}

// 폼 필드 에러
export interface FieldError {
  field: string;
  message: string;
  code?: string;
}

// 폼 유효성 검사 결과
export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

// 검색 쿼리 인터페이스
export interface SearchQuery {
  query: string;
  fields?: string[];
  filters?: FilterOptions;
  sort?: SortOptions;
  pagination?: {
    page: number;
    limit: number;
  };
}

// 벌크 작업 결과
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

// 내보내기 옵션
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  fields?: string[];
  filters?: FilterOptions;
  includeHeaders?: boolean;
}

// 감사 로그 인터페이스
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

// 권한 인터페이스
export interface Permission {
  resource: string;
  actions: string[];
}

// 역할 인터페이스
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

// 문서 메타데이터 인터페이스
export interface DocumentMetadata {
  author: string;
  department: string;
  version: string;
  tags?: string[];
  attachments?: Attachment[];
}