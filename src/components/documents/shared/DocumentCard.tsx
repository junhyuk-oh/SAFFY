"use client"

import Link from "next/link"
import { useState } from "react"

interface DocumentCardProps {
  id: string
  title: string
  type: string
  status: "draft" | "pending" | "completed" | "overdue"
  createdDate: string
  author: string
  description?: string
  lastModified?: string
  tags?: string[]
  icon?: string
}

const statusConfig = {
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
  completed: {
    label: "완료",
    color: "text-success-text",
    bg: "bg-success-bg"
  },
  overdue: {
    label: "기한 초과",
    color: "text-error-text",
    bg: "bg-error-bg"
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

export function DocumentCard({
  id,
  title,
  type,
  status,
  createdDate,
  author,
  description,
  lastModified,
  tags,
  icon
}: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const statusInfo = statusConfig[status]
  const documentIcon = icon || typeIcons[type] || "📄"

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: 실제 액션 구현
    console.log(`${action} action for document ${id}`)
  }

  return (
    <Link href={`/documents/${id}`}>
      <div 
        className="bg-background-secondary rounded-notion-md p-5 border border-border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-border-hover cursor-pointer relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between mb-3">
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
            <span>생성: {createdDate}</span>
            {lastModified && (
              <>
                <span>•</span>
                <span>수정: {lastModified}</span>
              </>
            )}
          </div>
          
          {/* Quick Actions */}
          {isHovered && (
            <div className="flex items-center gap-1 absolute top-3 right-3 bg-background rounded-notion-sm shadow-md border border-border p-1">
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

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag, index) => (
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
}