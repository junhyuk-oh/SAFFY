"use client"

import { useState } from "react"

interface DocumentStatus {
  status: "draft" | "pending" | "completed" | "overdue"
  label: string
  count: number
  color: string
  bgColor: string
  borderColor: string
  icon: string
  description: string
}

interface DocumentStatusCardsProps {
  onStatusSelect?: (status: string | null) => void
  selectedStatus?: string | null
  statusCounts?: Record<string, number>
}

const defaultStatusData: DocumentStatus[] = [
  {
    status: "draft",
    label: "초안",
    count: 0,
    color: "text-text-secondary",
    bgColor: "bg-background-hover",
    borderColor: "border-gray-300",
    icon: "📝",
    description: "작성 중인 문서"
  },
  {
    status: "pending",
    label: "검토 중",
    count: 0,
    color: "text-warning-text",
    bgColor: "bg-warning-bg",
    borderColor: "border-warning",
    icon: "🔍",
    description: "승인 대기 중인 문서"
  },
  {
    status: "completed",
    label: "완료",
    count: 0,
    color: "text-success-text",
    bgColor: "bg-success-bg",
    borderColor: "border-success",
    icon: "✅",
    description: "승인 완료된 문서"
  },
  {
    status: "overdue",
    label: "기한 초과",
    count: 0,
    color: "text-error-text",
    bgColor: "bg-error-bg",
    borderColor: "border-error",
    icon: "⚠️",
    description: "기한이 지난 문서"
  }
]

export function DocumentStatusCards({
  onStatusSelect,
  selectedStatus,
  statusCounts = {}
}: DocumentStatusCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const statusData = defaultStatusData.map(status => ({
    ...status,
    count: statusCounts[status.status] || 0
  }))

  const handleCardClick = (status: string) => {
    if (onStatusSelect) {
      // 이미 선택된 상태를 다시 클릭하면 선택 해제
      const newStatus = selectedStatus === status ? null : status
      onStatusSelect(newStatus)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, status: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick(status)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusData.map((statusItem) => {
        const isSelected = selectedStatus === statusItem.status
        const isHovered = hoveredCard === statusItem.status
        
        return (
          <div
            key={statusItem.status}
            className={`
              relative p-4 rounded-notion-md border-2 cursor-pointer transition-all duration-200
              ${isSelected 
                ? `${statusItem.borderColor} ${statusItem.bgColor} ring-2 ring-opacity-50 ring-offset-2` 
                : 'border-border hover:border-border-hover'
              }
              ${isHovered ? 'transform -translate-y-1 shadow-lg' : 'shadow-sm'}
              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
            `}
            onClick={() => handleCardClick(statusItem.status)}
            onMouseEnter={() => setHoveredCard(statusItem.status)}
            onMouseLeave={() => setHoveredCard(null)}
            onKeyDown={(e) => handleKeyDown(e, statusItem.status)}
            tabIndex={0}
            role="button"
            aria-label={`${statusItem.label} 상태 필터 ${isSelected ? '선택됨' : ''}`}
          >
            {/* 선택된 상태 표시기 */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className={`w-2 h-2 rounded-full ${statusItem.color.replace('text-', 'bg-')}`} />
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{statusItem.icon}</span>
              <span className={`
                text-2xl font-bold transition-colors
                ${isSelected ? statusItem.color : 'text-text-primary'}
              `}>
                {statusItem.count}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className={`
                font-semibold transition-colors
                ${isSelected ? statusItem.color : 'text-text-primary'}
              `}>
                {statusItem.label}
              </h3>
              <p className="text-sm text-text-secondary">
                {statusItem.description}
              </p>
            </div>

            {/* 호버 시 액션 힌트 */}
            {isHovered && !isSelected && (
              <div className="absolute bottom-2 right-2 text-xs text-text-tertiary">
                클릭하여 필터링
              </div>
            )}

            {/* 선택된 상태일 때 액션 힌트 */}
            {isSelected && (
              <div className="absolute bottom-2 right-2 text-xs text-text-tertiary">
                다시 클릭하여 해제
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// 전체 상태 요약 카드 컴포넌트
interface DocumentStatusSummaryProps {
  totalCount: number
  statusCounts: Record<string, number>
  className?: string
}

export function DocumentStatusSummary({
  totalCount,
  statusCounts,
  className = ""
}: DocumentStatusSummaryProps) {
  return (
    <div className={`bg-background-secondary rounded-notion-md p-6 border border-border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">문서 현황</h3>
        <span className="text-2xl font-bold text-primary">{totalCount}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {defaultStatusData.map((status) => {
          const count = statusCounts[status.status] || 0
          const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
          
          return (
            <div key={status.status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{status.icon}</span>
                <span className="text-sm text-text-secondary">{status.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-text-primary">{count}</span>
                <span className="text-xs text-text-tertiary ml-1">({percentage}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}