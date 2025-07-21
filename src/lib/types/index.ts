/**
 * 타입 정의 통합 export
 * 프로젝트 전반에서 사용되는 모든 타입을 중앙에서 관리합니다.
 */

// 공통 타입
export type * from './common';
export type { DocumentMetadata } from './common';

// 문서 관련 타입 (중복 export 제외)
export type {
  UnifiedDocumentType,
  BaseDocument,
  DocumentSearchParams,
  CreateDocumentRequest,
  AiGenerationOptions,
  UpdateDocumentRequest,
  DocumentTemplate,
  DocumentVersion,
  DocumentStatistics,
  DocumentExportRequest,
  DocumentWorkflow,
  DocumentNotificationSettings
} from './document';

export { DOCUMENT_CATEGORIES, DOCUMENT_TYPE_CATEGORY_MAP } from './document';

// API 관련 타입 (common과 중복 제외)
export { 
  ApiErrorCode,
  ApiStatusCode,
  type PaginatedResponse,
  type ApiResponseTransformer,
  type ApiErrorHandler,
  type ApiErrorDetail,
  RealtimeEventType
} from './api';

// 에러 관련 타입
export * from './error';

// 기존 타입 파일들 (점진적 마이그레이션을 위해 유지)
export type {
  DocumentType,
  DailyCheckItem,
  DailyCheckList,
  ChemicalUsage,
  ExperimentLog,
  WeeklyCheckSummary,
  WeeklyCheckList,
  ChemicalUsageReport,
  ChemicalInventory,
  ChemicalUsageTrend,
  InspectionItem,
  SafetyInspection,
  EducationParticipant,
  EducationLog,
  HazardIdentification,
  RiskMatrix,
  RiskAssessmentItem,
  RiskAssessment,
  QuarterlySafetyMetrics,
  QuarterlyImprovement,
  QuarterlyReport,
  AnnualGoal,
  AnnualBudgetItem,
  AnnualEducationPlan,
  AnnualInspectionSchedule,
  AnnualSafetyPlan
} from './documents';

export type * from './ai-documents';
export type * from './education';
export type * from './schedule';

// 타입 가드 유틸리티
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

export const isApiError = (value: unknown): value is import('./api').ApiError => {
  return value !== null && typeof value === 'object' && 'code' in value && 'message' in value;
};

export const isBaseDocument = (value: unknown): value is import('./document').BaseDocument => {
  return value !== null && typeof value === 'object' && 'id' in value && 'type' in value && 'metadata' in value;
};

// 타입 변환 유틸리티
export const toApiResponse = <T>(data: T, success = true): import('./api').ApiResponse<T> => ({
  success,
  data,
  metadata: {
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID?.() || Math.random().toString(36).substring(7),
    version: '1.0.0'
  }
});

export const toApiError = (
  error: Error | import('./error').BaseError,
  statusCode?: import('./api').ApiStatusCode
): import('./api').ApiError => {
  if ('code' in error && 'severity' in error) {
    // BaseError 타입
    return {
      code: error.code as import('./api').ApiErrorCode,
      message: error.message,
      timestamp: error.timestamp,
      details: error.context ? [{ issue: JSON.stringify(error.context) }] : undefined
    };
  }
  
  // 일반 Error 타입
  return {
    code: 'UNKNOWN_ERROR' as import('./api').ApiErrorCode,
    message: error.message,
    timestamp: new Date().toISOString()
  };
};

