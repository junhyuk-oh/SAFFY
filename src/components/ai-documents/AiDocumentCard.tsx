"use client"

import { DocumentType } from "@/lib/types"

interface AiDocumentCardProps {
  icon: string
  title: string
  description: string
  estimatedTime: string
  onClick?: () => void
  isSelected?: boolean
  documentType?: DocumentType
}

export function AiDocumentCard({
  icon,
  title,
  description,
  estimatedTime,
  onClick,
  isSelected = false
}: AiDocumentCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-5 rounded-xl border-2 transition-all duration-200
        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
        ${isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border-primary bg-bg-secondary hover:border-primary/50"
        }
      `}
      aria-pressed={isSelected}
      aria-label={`${title} - ${description}`}
    >
      <div className="flex items-start gap-4">
        {/* 아이콘 */}
        <div className={`
          text-3xl p-3 rounded-lg transition-colors
          ${isSelected ? "bg-primary/10" : "bg-bg-tertiary"}
        `}>
          {icon}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            {title}
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            {description}
          </p>
          
          {/* 추가 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-text-tertiary">
              <span className="flex items-center gap-1">
                <span className="opacity-60">⏱️</span>
                {estimatedTime}
              </span>
              <span className="flex items-center gap-1">
                <span className="opacity-60">🤖</span>
                AI 자동생성
              </span>
            </div>
            
            {isSelected && (
              <div className="bg-primary text-text-inverse text-xs px-3 py-1 rounded-full font-medium">
                선택됨
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}