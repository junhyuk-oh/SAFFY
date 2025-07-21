/**
 * 타입 정의 통합 export
 * 프로젝트 전반에서 사용되는 모든 타입을 중앙에서 관리합니다.
 */

// 공통 타입
export * from './common';
export { DocumentMetadata } from './common';

// 문서 관련 타입 (중복 export 제외)
export {
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
  DocumentNotificationSettings,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPE_CATEGORY_MAP
} from './document';

// API 관련 타입 (중복 export 제외)
export * from './api';

// 에러 관련 타입
export * from './error';

// 기존 타입 파일들 (점진적 마이그레이션을 위해 유지)
export {
  DocumentFormData,
  DailyCheckListData,
  DailyCheckListData as DailyCheckList,
  WeeklyCheckListData,
  WeeklyCheckListData as WeeklyCheckList,
  MonthlyRiskAssessmentData,
  QuarterlySafetyReportData,
  AnnualSafetyPlanData,
  AnnualSafetyPlanData as AnnualSafetyPlan,
  DocumentListItem,
  ChemicalUsageData,
  ExperimentLogData,
  ExperimentLogData as ExperimentLog,
  SafetyInspectionData,
  DocumentType,
  DailyCheckItem,
  ChemicalUsage,
  WeeklyCheckSummary,
  ChemicalUsageReport,
  ChemicalInventory,
  ChemicalUsageTrend
} from './documents';
export * from './ai-documents';
export * from './education';
export * from './schedule';

// 타입 가드 유틸리티
export const isError = (value: any): value is Error => {
  return value instanceof Error;
};

export const isApiError = (value: any): value is import('./api').ApiError => {
  return value && typeof value === 'object' && 'code' in value && 'message' in value;
};

export const isBaseDocument = (value: any): value is import('./document').BaseDocument => {
  return value && typeof value === 'object' && 'id' in value && 'type' in value && 'metadata' in value;
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

// 상수 re-export (이미 위에서 export됨)
export { ApiStatusCode, ApiErrorCode, RealtimeEventType } from './api';
export { ErrorSeverity, ErrorCategory, ERROR_MESSAGES, HTTP_STATUS_TO_ERROR_CODE } from './error';