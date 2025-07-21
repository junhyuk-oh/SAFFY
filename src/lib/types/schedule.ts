// 일정 관리 시스템 타입 정의

// 일정 상태 열거형
export enum ScheduleStatus {
  DRAFT = 'draft',          // 초안
  SCHEDULED = 'scheduled',  // 예정됨
  IN_PROGRESS = 'in_progress', // 진행중
  COMPLETED = 'completed',  // 완료됨
  CANCELLED = 'cancelled',  // 취소됨
  OVERDUE = 'overdue'      // 지연됨
}

// 일정 우선순위 열거형
export enum SchedulePriority {
  CRITICAL = 'critical',    // 매우 중요
  HIGH = 'high',           // 높음
  MEDIUM = 'medium',       // 보통
  LOW = 'low'              // 낮음
}

// 반복 주기 열거형
export enum RecurrenceFrequency {
  DAILY = 'daily',         // 매일
  WEEKLY = 'weekly',       // 매주
  MONTHLY = 'monthly',     // 매월
  QUARTERLY = 'quarterly', // 분기별
  ANNUALLY = 'annually',   // 매년
  CUSTOM = 'custom'        // 사용자 정의
}

// 일정 카테고리 인터페이스
export interface ScheduleCategory {
  id: string;
  name: string;
  code: string;            // 'safety-inspection', 'education', 'document-submission' 등
  description: string;
  color: string;           // HEX 색상 코드
  icon: string;            // 아이콘 이름
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 반복 패턴 인터페이스
export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number;        // 반복 간격 (예: 2주마다인 경우 2)
  daysOfWeek?: number[];   // 0-6 (일요일-토요일)
  dayOfMonth?: number;     // 1-31
  weekOfMonth?: number;    // 1-5 (몇째 주)
  monthsOfYear?: number[]; // 1-12
  endDate?: string;        // 반복 종료일
  occurrences?: number;    // 반복 횟수
  exceptions?: string[];   // 제외할 날짜들
}

// 일정 알림 인터페이스
export interface ScheduleNotification {
  id: string;
  scheduleId: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  timeBefore: number;      // 일정 시작 전 알림 시간 (분 단위)
  recipients: string[];    // 수신자 ID 목록
  message?: string;        // 사용자 정의 메시지
  isActive: boolean;
  createdAt: string;
}

// 기본 일정 인터페이스
export interface Schedule {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  type: 'safety-inspection' | 'education' | 'document-submission' | 'equipment-maintenance' | 'meeting' | 'audit' | 'other';
  status: ScheduleStatus;
  priority: SchedulePriority;
  
  // 일정 시간 정보
  startDate: string;
  endDate: string;
  allDay: boolean;
  timezone: string;
  
  // 반복 설정
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  parentScheduleId?: string; // 반복 일정의 경우 원본 일정 ID
  
  // 담당자 및 참여자
  organizerId: string;     // 주최자/담당자
  participants: {
    userId: string;
    role: 'required' | 'optional' | 'observer';
    responseStatus: 'pending' | 'accepted' | 'declined' | 'tentative';
    responseDate?: string;
  }[];
  
  // 위치 정보
  location?: {
    name: string;
    address?: string;
    room?: string;
    onlineUrl?: string;    // 온라인 회의 URL
  };
  
  // 첨부 파일
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
  }[];
  
  // 태그 및 메타데이터
  tags: string[];
  customFields?: Record<string, unknown>;
  
  // 추적 정보
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  completedBy?: string;
  completedAt?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// 안전점검 일정 (특화 타입)
export interface SafetyInspectionSchedule extends Schedule {
  type: 'safety-inspection';
  inspectionDetails: {
    inspectionType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'special';
    checklistId: string;    // 사용할 체크리스트 ID
    previousInspectionId?: string;
    areas: string[];        // 점검 구역
    equipment: string[];    // 점검 장비
    hazardCategories: string[]; // 위험 카테고리
    
    // 점검 결과 (완료 후)
    result?: {
      score: number;
      grade: 'A' | 'B' | 'C' | 'D' | 'F';
      findings: {
        id: string;
        severity: 'critical' | 'major' | 'minor';
        description: string;
        location: string;
        photos?: string[];
        immediateAction?: string;
        correctiveAction?: string;
        deadline?: string;
        responsible?: string;
      }[];
      recommendations: string[];
      nextInspectionDate: string;
    };
  };
}

// 교육 일정 (특화 타입)
export interface EducationSchedule extends Schedule {
  type: 'education';
  educationDetails: {
    trainingId: string;     // 교육 프로그램 ID
    educationType: 'legal-requirement' | 'skill-development' | 'safety-culture' | 'emergency-response';
    method: 'online' | 'offline' | 'blended';
    instructor: {
      id: string;
      name: string;
      organization: string;
      qualification?: string;
    };
    
    // 교육 요구사항
    requirements: {
      minParticipants: number;
      maxParticipants: number;
      prerequisites?: string[];
      materials?: string[];
      duration: number;     // 분 단위
    };
    
    // 등록 정보
    registration: {
      openDate: string;
      closeDate: string;
      registeredCount: number;
      waitlistCount: number;
      attendanceRequired: boolean;
    };
    
    // 평가 정보
    assessment?: {
      type: 'quiz' | 'practical' | 'attendance-only';
      passingScore?: number;
      maxAttempts?: number;
      certificateValidity?: number; // 개월 단위
    };
    
    // 완료 정보
    completion?: {
      attendees: {
        userId: string;
        attended: boolean;
        score?: number;
        passed?: boolean;
        certificateNumber?: string;
      }[];
      feedback: {
        satisfaction: number;
        understanding: number;
        usefulness: number;
        comments: string[];
      };
    };
  };
}

// 문서 제출 일정 (특화 타입)
export interface DocumentSubmissionSchedule extends Schedule {
  type: 'document-submission';
  documentDetails: {
    documentType: string;   // 문서 유형 코드
    templateId?: string;    // 사용할 템플릿 ID
    regulatoryRequirement?: {
      law: string;          // 관련 법령
      article: string;      // 조항
      penalty?: string;     // 미제출시 벌칙
    };
    
    // 제출 요구사항
    requirements: {
      format: string[];     // 허용 파일 형식
      maxSize: number;      // 최대 파일 크기 (MB)
      requiredSections: string[];
      approvers: {
        userId: string;
        role: string;
        order: number;
      }[];
    };
    
    // 제출 정보
    submission?: {
      submittedBy: string;
      submittedAt: string;
      files: {
        id: string;
        name: string;
        url: string;
        size: number;
        version: number;
      }[];
      status: 'pending-review' | 'approved' | 'rejected' | 'revision-required';
      reviews: {
        reviewerId: string;
        reviewedAt: string;
        status: 'approved' | 'rejected' | 'revision-required';
        comments: string;
      }[];
      finalApprovalDate?: string;
    };
  };
}

// 장비 유지보수 일정 (특화 타입)
export interface EquipmentMaintenanceSchedule extends Schedule {
  type: 'equipment-maintenance';
  maintenanceDetails: {
    equipmentId: string;
    equipmentName: string;
    maintenanceType: 'preventive' | 'corrective' | 'inspection' | 'calibration';
    
    // 유지보수 정보
    specifications: {
      procedure: string[];
      parts?: {
        name: string;
        quantity: number;
        cost: number;
      }[];
      estimatedDuration: number; // 분 단위
      requiredTools: string[];
      safetyPrecautions: string[];
    };
    
    // 이력 정보
    history: {
      lastMaintenanceDate?: string;
      nextScheduledDate: string;
      totalOperatingHours?: number;
      cycleCount?: number;
    };
    
    // 완료 정보
    completion?: {
      technician: string;
      startTime: string;
      endTime: string;
      actualDuration: number;
      findings: string[];
      partsReplaced: {
        name: string;
        serialNumber?: string;
        cost: number;
      }[];
      nextMaintenanceDate: string;
      operationalStatus: 'operational' | 'limited' | 'non-operational';
    };
  };
}

// 일정 필터 옵션
export interface ScheduleFilter {
  categories?: string[];
  types?: string[];
  statuses?: ScheduleStatus[];
  priorities?: SchedulePriority[];
  participants?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  searchText?: string;
}

// 일정 통계
export interface ScheduleStatistics {
  totalCount: number;
  byStatus: Record<ScheduleStatus, number>;
  byPriority: Record<SchedulePriority, number>;
  byType: Record<string, number>;
  completionRate: number;
  overdueCount: number;
  upcomingCount: number;
  
  // 주간/월간 통계
  weeklyStats: {
    week: string;
    scheduled: number;
    completed: number;
    cancelled: number;
  }[];
  
  monthlyStats: {
    month: string;
    scheduled: number;
    completed: number;
    completionRate: number;
  }[];
}

// 일정 대시보드 데이터
export interface ScheduleDashboard {
  statistics: ScheduleStatistics;
  upcomingSchedules: Schedule[];
  overdueSchedules: Schedule[];
  todaySchedules: Schedule[];
  
  // 중요 알림
  criticalAlerts: {
    scheduleId: string;
    title: string;
    type: string;
    message: string;
    dueDate: string;
  }[];
  
  // 팀별 일정 현황
  teamSchedules: {
    teamId: string;
    teamName: string;
    totalSchedules: number;
    completedSchedules: number;
    overdueSchedules: number;
  }[];
}

// 일정 이력
export interface ScheduleHistory {
  id: string;
  scheduleId: string;
  action: 'created' | 'updated' | 'status_changed' | 'rescheduled' | 'cancelled' | 'completed';
  changes: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  performedBy: string;
  performedAt: string;
  reason?: string;
  notes?: string;
}

// 일정 충돌 정보
export interface ScheduleConflict {
  scheduleId: string;
  conflictingSchedules: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    type: string;
    participants: string[];
  }[];
  conflictType: 'time' | 'resource' | 'participant';
  severity: 'high' | 'medium' | 'low';
  suggestion?: string;
}

// 일정 템플릿
export interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  type: string;
  
  // 템플릿 내용
  defaultValues: {
    title: string;
    description: string;
    priority: SchedulePriority;
    duration: number;       // 분 단위
    notifications: Omit<ScheduleNotification, 'id' | 'scheduleId' | 'createdAt'>[];
    customFields?: Record<string, unknown>;
  };
  
  // 사용 조건
  applicableFor: {
    departments?: string[];
    roles?: string[];
    conditions?: string[];
  };
  
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}