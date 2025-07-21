"use client"

import { DocumentType } from "@/lib/types"

interface DocumentCardProps {
  icon: string
  title: string
  description: string
  estimatedTime: string
  onClick?: () => void
  isSelected?: boolean
  documentType?: DocumentType
}

export function DocumentCard({
  icon,
  title,
  description,
  estimatedTime,
  onClick,
  isSelected = false
}: DocumentCardProps) {
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
          <p className="text-sm text-text-secondary mb-2">
            {description}
          </p>
          
          {/* 예상 시간 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-tertiary">⏱️</span>
            <span className="text-sm text-text-tertiary">
              예상 소요시간: {estimatedTime}
            </span>
          </div>
        </div>

        {/* 선택 표시 */}
        {isSelected && (
          <div className="text-primary">
            <svg 
              className="w-6 h-6" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* 호버 시 추가 정보 */}
      <div className={`
        mt-3 pt-3 border-t transition-opacity duration-200
        ${isSelected ? "opacity-100 border-primary/20" : "opacity-0 border-transparent hover:opacity-100"}
      `}>
        <p className="text-xs text-text-tertiary">
          클릭하여 AI 문서 생성을 시작하세요
        </p>
      </div>
    </button>
  )
}