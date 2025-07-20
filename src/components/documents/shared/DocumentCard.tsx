"use client"

import Link from "next/link"

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
  const statusInfo = statusConfig[status]
  const documentIcon = icon || typeIcons[type] || "📄"

  return (
    <Link href={`/documents/${id}`}>
      <div className="bg-background-secondary rounded-notion-md p-5 border border-border transition-all duration-200 hover:shadow-notion-md hover:-translate-y-0.5 hover:border-border-hover cursor-pointer">
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