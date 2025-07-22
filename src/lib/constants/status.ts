/**
 * 상태 설정 상수
 * 프로젝트 전체에서 사용되는 상태별 스타일 설정
 */

import { 
  Clock, Send, CheckCircle, XCircle, AlertCircle, 
  Shield, Settings, Activity, Zap, Calendar,
  AlertTriangle, Info
} from 'lucide-react'

// 상태 설정 타입
export interface StatusConfig {
  label: string
  color: string
  bg: string
  borderColor?: string
  icon?: React.ComponentType<any> | string
}

// 공통 색상 테마
export const STATUS_COLORS = {
  success: {
    color: 'text-success-text',
    bg: 'bg-success-bg',
    borderColor: 'border-l-success'
  },
  warning: {
    color: 'text-warning-text',
    bg: 'bg-warning-bg',
    borderColor: 'border-l-warning'
  },
  error: {
    color: 'text-error-text',
    bg: 'bg-error-bg',
    borderColor: 'border-l-error'
  },
  primary: {
    color: 'text-primary',
    bg: 'bg-blue-50',
    borderColor: 'border-l-primary'
  },
  secondary: {
    color: 'text-text-secondary',
    bg: 'bg-background-hover',
    borderColor: 'border-l-gray-400'
  },
  tertiary: {
    color: 'text-text-tertiary',
    bg: 'bg-gray-100',
    borderColor: 'border-l-gray-300'
  }
} as const

// 문서 상태
export const DOCUMENT_STATUS: Record<string, StatusConfig> = {
  draft: {
    label: '초안',
    ...STATUS_COLORS.secondary,
    icon: Clock
  },
  pending: {
    label: '검토 중',
    ...STATUS_COLORS.warning,
    icon: Clock
  },
  'in-progress': {
    label: '진행 중',
    ...STATUS_COLORS.primary,
    icon: Settings
  },
  completed: {
    label: '완료',
    ...STATUS_COLORS.success,
    icon: CheckCircle
  },
  approved: {
    label: '승인됨',
    ...STATUS_COLORS.success,
    icon: CheckCircle
  },
  rejected: {
    label: '거부됨',
    ...STATUS_COLORS.error,
    icon: XCircle
  },
  archived: {
    label: '보관',
    ...STATUS_COLORS.tertiary,
    icon: '📁'
  },
  overdue: {
    label: '기한 초과',
    ...STATUS_COLORS.error,
    icon: AlertTriangle
  }
}

// 장비 상태
export const EQUIPMENT_STATUS: Record<string, StatusConfig> = {
  operational: {
    label: '정상',
    ...STATUS_COLORS.success,
    icon: '✅'
  },
  maintenance: {
    label: '정비중',
    ...STATUS_COLORS.warning,
    icon: '🔧'
  },
  repair: {
    label: '수리중',
    ...STATUS_COLORS.error,
    icon: '🚨'
  },
  out_of_service: {
    label: '가동중지',
    ...STATUS_COLORS.secondary,
    icon: '⛔'
  },
  decommissioned: {
    label: '폐기',
    ...STATUS_COLORS.tertiary,
    icon: '🗑️'
  }
}

// 정비 작업 상태
export const MAINTENANCE_STATUS: Record<string, StatusConfig> = {
  scheduled: {
    label: '예정됨',
    ...STATUS_COLORS.primary,
    icon: '📅'
  },
  in_progress: {
    label: '진행중',
    ...STATUS_COLORS.warning,
    icon: '⚡'
  },
  completed: {
    label: '완료',
    ...STATUS_COLORS.success,
    icon: '✅'
  },
  overdue: {
    label: '지연',
    ...STATUS_COLORS.error,
    icon: '⏰'
  },
  cancelled: {
    label: '취소',
    ...STATUS_COLORS.secondary,
    icon: '❌'
  }
}

// 작업 허가 상태
export const PERMIT_STATUS: Record<string, StatusConfig> = {
  draft: {
    label: '초안',
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    icon: Clock
  },
  submitted: {
    label: '제출됨',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: Send
  },
  under_review: {
    label: '검토중',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    icon: Clock
  },
  approved: {
    label: '승인됨',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: CheckCircle
  },
  rejected: {
    label: '거부됨',
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: XCircle
  },
  expired: {
    label: '만료됨',
    ...STATUS_COLORS.tertiary,
    icon: '⏳'
  },
  active: {
    label: '활성',
    ...STATUS_COLORS.success,
    icon: '🟢'
  },
  completed: {
    label: '완료',
    ...STATUS_COLORS.primary,
    icon: CheckCircle
  }
}

// 알림 상태
export const ALERT_STATUS: Record<string, StatusConfig> = {
  active: {
    label: '활성',
    ...STATUS_COLORS.error
  },
  acknowledged: {
    label: '확인됨',
    ...STATUS_COLORS.warning
  },
  resolved: {
    label: '해결됨',
    ...STATUS_COLORS.success
  },
  false_positive: {
    label: '오탐지',
    ...STATUS_COLORS.secondary
  },
  escalated: {
    label: '상급보고',
    color: 'text-error-text',
    bg: 'bg-red-100'
  }
}

// 승인 프로세스 상태
export const APPROVAL_STATUS: Record<string, StatusConfig> = {
  pending: {
    label: '대기중',
    ...STATUS_COLORS.secondary,
    icon: '⏳'
  },
  approved: {
    label: '승인됨',
    ...STATUS_COLORS.success,
    icon: '✅'
  },
  rejected: {
    label: '거부됨',
    ...STATUS_COLORS.error,
    icon: '❌'
  },
  info_requested: {
    label: '정보요청',
    ...STATUS_COLORS.warning,
    icon: '❓'
  }
}

// 우선순위
export const PRIORITY_CONFIG: Record<string, StatusConfig> = {
  low: {
    label: '낮음',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    icon: '🔵'
  },
  medium: {
    label: '보통',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    icon: '🟡'
  },
  high: {
    label: '높음',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    icon: '🟠'
  },
  critical: {
    label: '긴급',
    color: 'text-red-600',
    bg: 'bg-red-100',
    icon: '🔴'
  },
  emergency: {
    label: '비상',
    color: 'text-red-700',
    bg: 'bg-red-200',
    icon: '🚨'
  }
}

// 심각도 (알림용)
export const SEVERITY_CONFIG: Record<string, StatusConfig> = {
  low: {
    label: '낮음',
    color: 'text-green-700',
    bg: 'bg-green-100',
    borderColor: 'border-green-300'
  },
  medium: {
    label: '보통',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    borderColor: 'border-blue-300'
  },
  high: {
    label: '높음',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    borderColor: 'border-yellow-300'
  },
  critical: {
    label: '심각',
    color: 'text-orange-700',
    bg: 'bg-orange-100',
    borderColor: 'border-orange-300'
  },
  emergency: {
    label: '비상',
    color: 'text-red-700',
    bg: 'bg-red-100',
    borderColor: 'border-red-300'
  }
}

// 헬퍼 함수: 상태 설정 가져오기
export function getStatusConfig(
  type: 'document' | 'equipment' | 'maintenance' | 'permit' | 'alert' | 'approval' | 'priority' | 'severity',
  status: string
): StatusConfig | undefined {
  const configMap = {
    document: DOCUMENT_STATUS,
    equipment: EQUIPMENT_STATUS,
    maintenance: MAINTENANCE_STATUS,
    permit: PERMIT_STATUS,
    alert: ALERT_STATUS,
    approval: APPROVAL_STATUS,
    priority: PRIORITY_CONFIG,
    severity: SEVERITY_CONFIG
  }
  
  return configMap[type]?.[status]
}

// 기본 상태 설정
export const DEFAULT_STATUS_CONFIG: StatusConfig = {
  label: '알 수 없음',
  ...STATUS_COLORS.secondary
}