"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface DocumentTemplate {
  id: string
  title: string
  type: string
  description: string
  icon: string
  category: string
  estimatedTime: string
  complexity: "easy" | "medium" | "hard"
  isPopular?: boolean
  tags?: string[]
}

interface DocumentFavoritesProps {
  onTemplateSelect?: (templateId: string) => void
  className?: string
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: "risk-assessment",
    title: "작업위험성평가서",
    type: "위험성평가",
    description: "특정 작업에 대한 위험 요소를 분석하고 대책을 수립하는 문서",
    icon: "🔍",
    category: "안전관리",
    estimatedTime: "15-30분",
    complexity: "medium",
    isPopular: true,
    tags: ["위험성평가", "안전", "필수"]
  },
  {
    id: "experiment-plan",
    title: "실험계획서",
    type: "실험계획서",
    description: "화학실험 전 안전계획과 절차를 명시하는 문서",
    icon: "📝",
    category: "실험관리",
    estimatedTime: "20-40분",
    complexity: "medium",
    isPopular: true,
    tags: ["실험", "계획서", "화학"]
  },
  {
    id: "daily-checklist",
    title: "일일안전점검표",
    type: "점검일지",
    description: "매일 수행하는 기본 안전점검 항목들을 체크하는 문서",
    icon: "✅",
    category: "점검관리",
    estimatedTime: "5-10분",
    complexity: "easy",
    isPopular: true,
    tags: ["일일점검", "안전", "체크리스트"]
  },
  {
    id: "education-log",
    title: "안전교육일지",
    type: "교육일지",
    description: "안전교육 실시 내용과 참석자 정보를 기록하는 문서",
    icon: "🎓",
    category: "교육관리",
    estimatedTime: "10-20분",
    complexity: "easy",
    tags: ["교육", "안전", "일지"]
  },
  {
    id: "accident-report",
    title: "사고보고서",
    type: "사고보고서",
    description: "안전사고 발생 시 상황과 원인, 대책을 보고하는 문서",
    icon: "🚨",
    category: "사고관리",
    estimatedTime: "30-60분",
    complexity: "hard",
    tags: ["사고", "보고서", "긴급"]
  },
  {
    id: "chemical-usage",
    title: "화학물질 사용기록",
    type: "사용기록",
    description: "화학물질 사용량과 보관 상태를 기록하는 문서",
    icon: "🧪",
    category: "화학관리",
    estimatedTime: "10-15분",
    complexity: "easy",
    tags: ["화학물질", "사용기록", "관리"]
  },
  {
    id: "quarterly-report",
    title: "분기별 안전보고서",
    type: "분기보고서",
    description: "분기별 안전관리 현황과 개선사항을 종합하는 문서",
    icon: "📊",
    category: "정기보고",
    estimatedTime: "60-120분",
    complexity: "hard",
    tags: ["분기보고", "종합", "관리"]
  },
  {
    id: "monthly-inspection",
    title: "월간안전점검표",
    type: "점검일지",
    description: "월 단위로 수행하는 정기 안전점검 문서",
    icon: "🔍",
    category: "점검관리",
    estimatedTime: "30-45분",
    complexity: "medium",
    tags: ["월간점검", "정기점검", "안전"]
  }
]

const complexityConfig = {
  easy: {
    label: "쉬움",
    color: "text-success-text",
    bgColor: "bg-success-bg"
  },
  medium: {
    label: "보통",
    color: "text-warning-text",
    bgColor: "bg-warning-bg"
  },
  hard: {
    label: "어려움",
    color: "text-error-text",
    bgColor: "bg-error-bg"
  }
}

export function DocumentFavorites({
  onTemplateSelect,
  className = ""
}: DocumentFavoritesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const router = useRouter()

  const categories = Array.from(new Set(documentTemplates.map(t => t.category)))
  const popularTemplates = documentTemplates.filter(t => t.isPopular)
  
  const filteredTemplates = selectedCategory 
    ? documentTemplates.filter(t => t.category === selectedCategory)
    : documentTemplates

  const handleTemplateClick = (template: DocumentTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template.id)
    } else {
      // 기본 동작: 새 문서 생성 페이지로 이동
      router.push(`/documents/create?template=${template.id}`)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, template: DocumentTemplate) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleTemplateClick(template)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 인기 템플릿 섹션 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-text-primary">인기 템플릿</h3>
          <span className="text-sm text-text-secondary">자주 사용되는 문서</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTemplates.map((template) => (
            <TemplateCard
              key={`popular-${template.id}`}
              template={template}
              isHovered={hoveredTemplate === template.id}
              onHover={setHoveredTemplate}
              onClick={handleTemplateClick}
              onKeyDown={handleKeyDown}
              showPopularBadge
            />
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">카테고리별 템플릿</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-notion-sm text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-background-hover text-text-secondary hover:bg-background-tertiary'
            }`}
          >
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-notion-sm text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background-hover text-text-secondary hover:bg-background-tertiary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isHovered={hoveredTemplate === template.id}
            onHover={setHoveredTemplate}
            onClick={handleTemplateClick}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-text-secondary">선택한 카테고리에 템플릿이 없습니다.</p>
        </div>
      )}
    </div>
  )
}

interface TemplateCardProps {
  template: DocumentTemplate
  isHovered: boolean
  onHover: (id: string | null) => void
  onClick: (template: DocumentTemplate) => void
  onKeyDown: (event: React.KeyboardEvent, template: DocumentTemplate) => void
  showPopularBadge?: boolean
}

function TemplateCard({
  template,
  isHovered,
  onHover,
  onClick,
  onKeyDown,
  showPopularBadge = false
}: TemplateCardProps) {
  const complexityInfo = complexityConfig[template.complexity]

  return (
    <div
      className={`
        relative bg-background-secondary rounded-notion-md p-4 border border-border cursor-pointer
        transition-all duration-200 hover:border-border-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
        ${isHovered ? 'transform -translate-y-1 shadow-lg' : 'shadow-sm hover:shadow-md'}
      `}
      onClick={() => onClick(template)}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={(e) => onKeyDown(e, template)}
      tabIndex={0}
      role="button"
      aria-label={`${template.title} 템플릿 선택`}
    >
      {/* 인기 뱃지 */}
      {showPopularBadge && template.isPopular && (
        <div className="absolute top-2 right-2 bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-notion-sm font-medium">
          인기
        </div>
      )}

      {/* 템플릿 아이콘 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{template.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-text-primary line-clamp-1">
            {template.title}
          </h4>
          <span className="text-xs text-text-secondary">{template.type}</span>
        </div>
      </div>

      {/* 설명 */}
      <p className="text-sm text-text-secondary line-clamp-2 mb-3">
        {template.description}
      </p>

      {/* 메타데이터 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">소요시간</span>
          <span className="text-text-secondary">{template.estimatedTime}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">난이도</span>
          <span className={`px-2 py-0.5 rounded-md ${complexityInfo.bgColor} ${complexityInfo.color}`}>
            {complexityInfo.label}
          </span>
        </div>
      </div>

      {/* 태그 */}
      {template.tags && template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {template.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-background-hover text-text-secondary text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-background-hover text-text-tertiary text-xs rounded-md">
              +{template.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* 호버 시 액션 힌트 */}
      {isHovered && (
        <div className="absolute inset-0 bg-primary bg-opacity-5 rounded-notion-md flex items-center justify-center">
          <div className="bg-background rounded-notion-sm px-3 py-1.5 shadow-md border border-border">
            <span className="text-sm font-medium text-text-primary">클릭하여 생성</span>
          </div>
        </div>
      )}
    </div>
  )
}