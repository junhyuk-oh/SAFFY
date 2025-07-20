// AI 문서 생성 관련 타입 정의

// 문서 타입 열거형
export enum DocumentType {
  RISK_ASSESSMENT = "RISK_ASSESSMENT", // 위험성평가서
  JHA = "JHA", // 작업위험성평가
  QUARTERLY_REPORT = "QUARTERLY_REPORT", // 분기 보고서
  MONTHLY_REPORT = "MONTHLY_REPORT", // 월간 보고서
  EDUCATION_LOG = "EDUCATION_LOG", // 교육일지
  SAFETY_INSPECTION = "SAFETY_INSPECTION", // 안전점검표
  CHEMICAL_INVENTORY = "CHEMICAL_INVENTORY", // 화학물질 목록
  EMERGENCY_PLAN = "EMERGENCY_PLAN", // 비상대응계획
  INCIDENT_REPORT = "INCIDENT_REPORT", // 사고 보고서
  MSDS_SUMMARY = "MSDS_SUMMARY" // MSDS 요약서
}

// 공통 AI 생성 옵션
export interface AiGenerationOptions {
  includeImages?: boolean // AI 생성 이미지 포함 여부
  language?: "ko" | "en" // 언어 설정
  detailLevel?: "basic" | "standard" | "detailed" // 상세도
  autoSave?: boolean // 자동 저장 여부
  templateId?: string // 사용할 템플릿 ID
}

// 기본 문서 정보
export interface BaseDocument {
  id?: string
  type: DocumentType
  title: string
  createdAt?: Date
  updatedAt?: Date
  isAiGenerated?: boolean
  author?: string
  status?: "draft" | "pending" | "completed" | "approved"
}

// 위험성평가서 인터페이스
export interface RiskAssessmentDocument extends BaseDocument {
  type: DocumentType.RISK_ASSESSMENT
  labName: string
  experimentType: string
  chemicals: string[]
  equipment?: string[]
  hazards?: {
    id: string
    category: string
    description: string
    riskLevel: "low" | "medium" | "high" | "critical"
    controlMeasures: string[]
  }[]
  overview: string
  safetyPrecautions?: string[]
  emergencyProcedures?: string[]
}

// 작업위험성평가(JHA) 인터페이스
export interface JHADocument extends BaseDocument {
  type: DocumentType.JHA
  taskName: string
  taskLocation: string
  taskSteps: {
    id: string
    step: string
    hazards: string[]
    controls: string[]
    ppe: string[]
  }[]
  workers: string[]
  supervisor: string
  reviewDate: Date
}

// 분기 보고서 인터페이스
export interface QuarterlyReportDocument extends BaseDocument {
  type: DocumentType.QUARTERLY_REPORT
  quarter: 1 | 2 | 3 | 4
  year: number
  summary: string
  incidents: {
    count: number
    details: string[]
  }
  training: {
    conducted: number
    participants: number
    topics: string[]
  }
  inspections: {
    total: number
    findings: number
    resolved: number
  }
  improvements: string[]
  nextQuarterPlans: string[]
}

// 교육일지 인터페이스
export interface EducationLogDocument extends BaseDocument {
  type: DocumentType.EDUCATION_LOG
  trainingTitle: string
  trainingDate: Date
  duration: number // 시간 단위
  instructor: string
  participants: {
    name: string
    department: string
    attended: boolean
  }[]
  topics: string[]
  materials: string[]
  evaluationMethod: string
  results: string
}

// 화학물질 목록 인터페이스
export interface ChemicalInventoryDocument extends BaseDocument {
  type: DocumentType.CHEMICAL_INVENTORY
  labName: string
  lastUpdated: Date
  chemicals: {
    id: string
    name: string
    casNumber?: string
    quantity: number
    unit: string
    location: string
    hazardClass: string[]
    msdsAvailable: boolean
    expiryDate?: Date
  }[]
  responsiblePerson: string
  storageConditions: string[]
}

// 문서 카드 표시용 정보
export interface DocumentCardInfo {
  icon: string
  title: string
  description: string
  estimatedTime: string
  documentType: DocumentType
  requiredFields?: string[]
}

// 문서 타입별 카드 정보 매핑
export const DOCUMENT_CARD_INFO: Record<DocumentType, DocumentCardInfo> = {
  [DocumentType.RISK_ASSESSMENT]: {
    icon: "⚡",
    title: "위험성평가서",
    description: "실험실 안전 위험요소 평가",
    estimatedTime: "3분",
    documentType: DocumentType.RISK_ASSESSMENT,
    requiredFields: ["실험실명", "실험유형", "화학물질", "실험개요"]
  },
  [DocumentType.JHA]: {
    icon: "🔍",
    title: "작업위험성평가(JHA)",
    description: "작업 단계별 위험 분석",
    estimatedTime: "5분",
    documentType: DocumentType.JHA,
    requiredFields: ["작업명", "작업장소", "작업자", "감독자"]
  },
  [DocumentType.QUARTERLY_REPORT]: {
    icon: "📊",
    title: "분기 보고서",
    description: "분기별 안전관리 종합 보고",
    estimatedTime: "10분",
    documentType: DocumentType.QUARTERLY_REPORT,
    requiredFields: ["분기", "년도"]
  },
  [DocumentType.MONTHLY_REPORT]: {
    icon: "📅",
    title: "월간 보고서",
    description: "월별 안전활동 보고",
    estimatedTime: "7분",
    documentType: DocumentType.MONTHLY_REPORT,
    requiredFields: ["월", "년도"]
  },
  [DocumentType.EDUCATION_LOG]: {
    icon: "🎓",
    title: "교육일지",
    description: "안전교육 실시 기록",
    estimatedTime: "3분",
    documentType: DocumentType.EDUCATION_LOG,
    requiredFields: ["교육명", "교육일", "강사", "참석자"]
  },
  [DocumentType.SAFETY_INSPECTION]: {
    icon: "✅",
    title: "안전점검표",
    description: "정기 안전점검 체크리스트",
    estimatedTime: "5분",
    documentType: DocumentType.SAFETY_INSPECTION,
    requiredFields: ["점검구역", "점검일"]
  },
  [DocumentType.CHEMICAL_INVENTORY]: {
    icon: "🧪",
    title: "화학물질 목록",
    description: "실험실 화학물질 재고 관리",
    estimatedTime: "8분",
    documentType: DocumentType.CHEMICAL_INVENTORY,
    requiredFields: ["실험실명", "관리자"]
  },
  [DocumentType.EMERGENCY_PLAN]: {
    icon: "🚨",
    title: "비상대응계획",
    description: "사고 시 대응 절차서",
    estimatedTime: "12분",
    documentType: DocumentType.EMERGENCY_PLAN,
    requiredFields: ["실험실명", "비상연락망"]
  },
  [DocumentType.INCIDENT_REPORT]: {
    icon: "⚠️",
    title: "사고 보고서",
    description: "안전사고 발생 보고",
    estimatedTime: "5분",
    documentType: DocumentType.INCIDENT_REPORT,
    requiredFields: ["사고일시", "사고장소", "사고유형"]
  },
  [DocumentType.MSDS_SUMMARY]: {
    icon: "📋",
    title: "MSDS 요약서",
    description: "물질안전보건자료 요약",
    estimatedTime: "4분",
    documentType: DocumentType.MSDS_SUMMARY,
    requiredFields: ["화학물질명", "CAS번호"]
  }
}

// AI 생성 정보
export interface AiGenerationInfo {
  features: string[]
  estimatedTime: string
  accuracy?: string
  lastUpdated?: Date
}

// 기본 AI 생성 기능 목록
export const DEFAULT_AI_FEATURES = [
  "위험요소 자동 식별",
  "법적 요구사항 자동 반영",
  "안전조치 사항 자동 제안",
  "전문 용어 자동 적용",
  "보고서 형식 자동 구성"
]