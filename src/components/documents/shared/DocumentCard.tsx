"use client"

import Link from "next/link"
import { useState, memo } from "react"
import { BaseDocument } from "@/lib/types"
import { formatDateTime } from "@/lib/utils/date"

interface DocumentCardProps extends BaseDocument {
  description?: string // 추가 필드
  isFavorite?: boolean
  onFavoriteToggle?: (id: string) => void
}

const statusConfig = {
  draft: {
    label: "초안",
    color: "text-text-secondary",
    bg: "bg-background-hover",
    borderColor: "border-l-gray-400"
  },
  pending: {
    label: "검토 중",
    color: "text-warning-text",
    bg: "bg-warning-bg",
    borderColor: "border-l-warning"
  },
  "in-progress": {
    label: "진행 중",
    color: "text-primary",
    bg: "bg-blue-50",
    borderColor: "border-l-primary"
  },
  completed: {
    label: "완료",
    color: "text-success-text",
    bg: "bg-success-bg",
    borderColor: "border-l-success"
  },
  approved: {
    label: "승인",
    color: "text-success-text",
    bg: "bg-success-bg",
    borderColor: "border-l-success"
  },
  rejected: {
    label: "거부",
    color: "text-error-text",
    bg: "bg-error-bg",
    borderColor: "border-l-error"
  },
  archived: {
    label: "보관",
    color: "text-text-tertiary",
    bg: "bg-gray-100",
    borderColor: "border-l-gray-300"
  },
  overdue: {
    label: "기한 초과",
    color: "text-error-text",
    bg: "bg-error-bg",
    borderColor: "border-l-error"
  }
}

const typeIcons: Record<string, string> = {
  "위험성평가": "⚠️",
  "작업위험성평가": "🔍",
  "실험계획서": "📝",
  "교육일지": "🎓",
  "점검일지": "✅",
  "사고보고서": "🚨",
  "분기보고서": "📊"
}

export const DocumentCard = memo(function DocumentCard({
  id,
  title,
  type,
  status,
  createdAt,
  updatedAt,
  author,
  description,
  metadata,
  isFavorite = false,
  onFavoriteToggle
}: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const statusInfo = statusConfig[status]
  const documentIcon = typeIcons[type] || "📄"
  

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (action === 'favorite' && onFavoriteToggle) {
      onFavoriteToggle(id)
      return
    }
    
    // TODO: 실제 액션 구현
    console.log(`${action} action for document ${id}`)
  }

  return (
    <Link href={`/documents/${id}`}>
      <div 
        className={`bg-background-secondary rounded-notion-md p-5 border border-border border-l-4 ${statusInfo.borderColor} transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-border-hover cursor-pointer relative`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 즐겨찾기 버튼 */}
        <button
          onClick={(e) => handleAction(e, 'favorite')}
          className="absolute top-4 right-4 p-1.5 hover:bg-background-hover rounded-notion-sm transition-all duration-200 z-10"
          title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
          <svg 
            className={`w-5 h-5 transition-colors ${isFavorite ? 'text-warning fill-warning' : 'text-text-tertiary'}`} 
            fill={isFavorite ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>

        <div className="flex items-start justify-between mb-3 pr-12">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{documentIcon}</span>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-text-secondary">{type}</span>
                <span className="text-xs text-text-tertiary">•</span>
                <span className="text-xs text-text-secondary">{author}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {description && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span>생성: {formatDateTime(createdAt, { includeTime: false })}</span>
            {updatedAt && updatedAt !== createdAt && (
              <>
                <span>•</span>
                <span>수정: {formatDateTime(updatedAt, { includeTime: false })}</span>
              </>
            )}
          </div>
          
          {/* Quick Actions */}
          {isHovered && (
            <div className="flex items-center gap-1 absolute top-3 right-12 bg-background rounded-notion-sm shadow-md border border-border p-1">
              <button
                onClick={(e) => handleAction(e, 'edit')}
                className="p-1.5 hover:bg-background-hover rounded-notion-sm transition-colors"
                title="편집"
              >
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => handleAction(e, 'download')}
                className="p-1.5 hover:bg-background-hover rounded-notion-sm transition-colors"
                title="다운로드"
              >
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button
                onClick={(e) => handleAction(e, 'share')}
                className="p-1.5 hover:bg-background-hover rounded-notion-sm transition-colors"
                title="공유"
              >
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              <button
                onClick={(e) => handleAction(e, 'duplicate')}
                className="p-1.5 hover:bg-background-hover rounded-notion-sm transition-colors"
                title="복사"
              >
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={(e) => handleAction(e, 'delete')}
                className="p-1.5 hover:bg-error-bg rounded-notion-sm transition-colors group"
                title="삭제"
              >
                <svg className="w-4 h-4 text-text-secondary group-hover:text-error-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {metadata?.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {metadata.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-background-hover text-text-secondary text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
})