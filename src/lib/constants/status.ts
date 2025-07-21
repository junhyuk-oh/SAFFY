/**
 * 상태 관련 공통 상수 정의
 */

import { Status } from '@/lib/types'

export interface StatusConfig {
  label: string
  color: string
  bg: string
}

export const STATUS_CONFIG: Record<Status, StatusConfig> = {
  draft: {
    label: "초안",
    color: "text-text-secondary",
    bg: "bg-background-hover"
  },
  pending: {
    label: "검토 중",
    color: "text-warning-text",
    bg: "bg-warning-bg"
  },
  'in-progress': {
    label: "진행 중",
    color: "text-primary-text",
    bg: "bg-primary-bg"
  },
  completed: {
    label: "완료",
    color: "text-success-text",
    bg: "bg-success-bg"
  },
  approved: {
    label: "승인됨",
    color: "text-success-text",
    bg: "bg-success-bg"
  },
  rejected: {
    label: "반려",
    color: "text-error-text",
    bg: "bg-error-bg"
  },
  archived: {
    label: "보관됨",
    color: "text-text-tertiary",
    bg: "bg-background-secondary"
  },
  overdue: {
    label: "기한 초과",
    color: "text-error-text",
    bg: "bg-error-bg"
  }
}

// 우선순위 색상
export const PRIORITY_COLORS = {
  high: 'bg-red-500 hover:bg-red-600 text-white',
  medium: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  low: 'bg-green-500 hover:bg-green-600 text-white',
  critical: 'bg-red-700 hover:bg-red-800 text-white'
}

// 위험도 색상
export const RISK_LEVEL_COLORS = {
  critical: 'text-red-600 bg-red-50',
  high: 'text-orange-600 bg-orange-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50'
}