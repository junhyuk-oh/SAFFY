/**
 * 문서 관련 통합 타입 정의
 * 모든 문서 타입의 기본 구조와 공통 인터페이스를 정의합니다.
 */

import { 
  Timestamps, 
  Signature, 
  Attachment, 
  Status, 
  Priority, 
  RiskLevel, 
  SafetyStatus,
  PeriodType,
  Quarter
} from './common';

// 문서 타입 열거형 (통합)
export enum UnifiedDocumentType {
  // 일별 문서
  DAILY_CHECKLIST = 'daily-checklist',
  EXPERIMENT_LOG = 'experiment-log',
  
  // 주별 문서
  WEEKLY_CHECKLIST = 'weekly-checklist',
  CHEMICAL_USAGE_REPORT = 'chemical-usage-report',
  
  // 월별 문서
  SAFETY_INSPECTION = 'safety-inspection',
  EDUCATION_LOG = 'education-log',
  RISK_ASSESSMENT = 'risk-assessment',
  
  // 분기별 문서
  QUARTERLY_REPORT = 'quarterly-report',
  
  // 연간 문서
  ANNUAL_SAFETY_PLAN = 'annual-safety-plan',
  
  // AI 생성 전용 문서
  AI_SAFETY_ASSESSMENT = 'ai-safety-assessment',
  AI_REQUIREMENTS_SPEC = 'ai-requirements-spec',
  AI_IMPLEMENTATION_PLAN = 'ai-implementation-plan',
  AI_TEST_SCENARIOS = 'ai-test-scenarios',
  AI_TRAINING_PROGRAM = 'ai-training-program',
  AI_COMPLIANCE_CHECKLIST = 'ai-compliance-checklist',
  AI_ETHICAL_FRAMEWORK = 'ai-ethical-framework',
  AI_INCIDENT_RESPONSE = 'ai-incident-response',
  AI_MONITORING_DASHBOARD = 'ai-monitoring-dashboard',
  AI_RISK_MITIGATION = 'ai-risk-mitigation',
  
  // 추가 문서 타입
  JHA = 'jha', // 작업위험성평가
  CHEMICAL_INVENTORY = 'chemical-inventory',
  EMERGENCY_PLAN = 'emergency-plan',
  INCIDENT_REPORT = 'incident-report',
  MSDS_SUMMARY = 'msds-summary'
}

// 기본 문서 인터페이스
export interface BaseDocument extends Timestamps, Signature {
  id: string;
  type: UnifiedDocumentType;
  title: string;
  status: Status;
  author: string;
  authorId?: string;
  department: string;
  departmentId?: string;
  
  // 문서 메타데이터
  metadata: {
    version: number;
    isAiGenerated: boolean;
    templateId?: string;
    parentDocumentId?: string;
    tags?: string[];
    category?: string;
    period?: PeriodType;
    periodDate?: string; // YYYY-MM-DD 형식
  };
  
  // 문서 검토/승인 정보
  review?: {
    reviewerId?: string;
    reviewerName?: string;
    reviewedAt?: string;
    comments?: string;
  };
  
  approval?: {
    approverId?: string;
    approverName?: string;
    approvedAt?: string;
    comments?: string;
  };
  
  // 첨부파일
  attachments?: Attachment[];
  
  // 접근 권한
  permissions?: {
    view: string[]; // 역할 또는 사용자 ID
    edit: string[];
    approve: string[];
  };
}

// 문서 검색 인터페이스
export interface DocumentSearchParams {
  query?: string;
  type?: UnifiedDocumentType | UnifiedDocumentType[];
  status?: Status | Status[];
  department?: string | string[];
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  isAiGenerated?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// 문서 생성 요청 인터페이스
export interface CreateDocumentRequest {
  type: UnifiedDocumentType;
  title: string;
  department: string;
  templateId?: string;
  data: any; // 문서 타입별 특정 데이터
  isDraft?: boolean;
  aiOptions?: AiGenerationOptions;
}

// AI 문서 생성 옵션 (확장)
export interface AiGenerationOptions {
  model?: 'gpt-4' | 'gpt-3.5' | 'claude' | 'custom';
  language?: 'ko' | 'en' | 'multi';
  tone?: 'formal' | 'technical' | 'simple';
  length?: 'brief' | 'standard' | 'detailed';
  includeImages?: boolean;
  includeCharts?: boolean;
  autoTranslate?: boolean;
  customPrompt?: string;
  referenceDocuments?: string[]; // 참조 문서 ID
  complianceStandards?: string[]; // 준수 기준
}

// 문서 업데이트 요청 인터페이스
export interface UpdateDocumentRequest {
  id: string;
  updates: Partial<BaseDocument> & {
    data?: any; // 문서 타입별 특정 데이터
  };
  reason?: string; // 수정 사유
}

// 문서 템플릿 인터페이스
export interface DocumentTemplate {
  id: string;
  type: UnifiedDocumentType;
  name: string;
  description?: string;
  structure: {
    sections: Array<{
      id: string;
      title: string;
      type: 'text' | 'table' | 'checklist' | 'form' | 'custom';
      required: boolean;
      defaultValue?: any;
      validation?: any;
    }>;
  };
  sampleData?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 문서 버전 인터페이스
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  changedBy: string;
  changedAt: string;
  changeReason?: string;
}

// 문서 통계 인터페이스
export interface DocumentStatistics {
  totalCount: number;
  byType: Record<UnifiedDocumentType, number>;
  byStatus: Record<Status, number>;
  byDepartment: Record<string, number>;
  byPeriod: {
    daily: number;
    weekly: number;
    monthly: number;
    quarterly: number;
    annual: number;
  };
  aiGenerated: {
    count: number;
    percentage: number;
  };
  recentActivity: {
    created: number;
    updated: number;
    approved: number;
  };
}

// 문서 내보내기 인터페이스
export interface DocumentExportRequest {
  documentIds: string[];
  format: 'pdf' | 'excel' | 'word' | 'zip';
  options: {
    includeAttachments?: boolean;
    includeVersionHistory?: boolean;
    includeApprovalChain?: boolean;
    mergeDocuments?: boolean; // PDF의 경우
    password?: string; // 암호화 옵션
  };
}

// 문서 워크플로우 인터페이스
export interface DocumentWorkflow {
  id: string;
  documentType: UnifiedDocumentType;
  steps: Array<{
    order: number;
    name: string;
    type: 'review' | 'approval' | 'notification';
    assignees: string[]; // 사용자 또는 역할 ID
    conditions?: any; // 조건부 로직
    deadline?: number; // 일 단위
  }>;
  isActive: boolean;
}

// 문서 알림 설정
export interface DocumentNotificationSettings {
  onCreate?: boolean;
  onUpdate?: boolean;
  onApproval?: boolean;
  onRejection?: boolean;
  onDeadlineApproaching?: boolean;
  recipients?: string[];
  channels?: ('email' | 'sms' | 'push' | 'in-app')[];
}

// 문서 분류 카테고리
export const DOCUMENT_CATEGORIES = {
  SAFETY: '안전관리',
  COMPLIANCE: '법규준수',
  EDUCATION: '교육훈련',
  INSPECTION: '점검평가',
  REPORTING: '보고서',
  EMERGENCY: '비상대응',
  CHEMICAL: '화학물질',
  AI_GENERATED: 'AI 생성'
} as const;

// 문서 타입별 카테고리 매핑
export const DOCUMENT_TYPE_CATEGORY_MAP: Record<UnifiedDocumentType, keyof typeof DOCUMENT_CATEGORIES> = {
  [UnifiedDocumentType.DAILY_CHECKLIST]: 'INSPECTION',
  [UnifiedDocumentType.EXPERIMENT_LOG]: 'SAFETY',
  [UnifiedDocumentType.WEEKLY_CHECKLIST]: 'INSPECTION',
  [UnifiedDocumentType.CHEMICAL_USAGE_REPORT]: 'CHEMICAL',
  [UnifiedDocumentType.SAFETY_INSPECTION]: 'INSPECTION',
  [UnifiedDocumentType.EDUCATION_LOG]: 'EDUCATION',
  [UnifiedDocumentType.RISK_ASSESSMENT]: 'SAFETY',
  [UnifiedDocumentType.QUARTERLY_REPORT]: 'REPORTING',
  [UnifiedDocumentType.ANNUAL_SAFETY_PLAN]: 'REPORTING',
  [UnifiedDocumentType.AI_SAFETY_ASSESSMENT]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_REQUIREMENTS_SPEC]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_IMPLEMENTATION_PLAN]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_TEST_SCENARIOS]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_TRAINING_PROGRAM]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_COMPLIANCE_CHECKLIST]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_ETHICAL_FRAMEWORK]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_INCIDENT_RESPONSE]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_MONITORING_DASHBOARD]: 'AI_GENERATED',
  [UnifiedDocumentType.AI_RISK_MITIGATION]: 'AI_GENERATED',
  [UnifiedDocumentType.JHA]: 'SAFETY',
  [UnifiedDocumentType.CHEMICAL_INVENTORY]: 'CHEMICAL',
  [UnifiedDocumentType.EMERGENCY_PLAN]: 'EMERGENCY',
  [UnifiedDocumentType.INCIDENT_REPORT]: 'SAFETY',
  [UnifiedDocumentType.MSDS_SUMMARY]: 'CHEMICAL'
};