"use client"

interface AiGenerationInfoProps {
  features?: string[]
  estimatedTime?: string
  title?: string
  className?: string
}

const defaultFeatures = [
  "위험요소 자동 식별",
  "법적 요구사항 자동 반영", 
  "안전조치 사항 자동 제안",
  "전문 용어 자동 적용"
]

export function AiGenerationInfo({
  features = defaultFeatures,
  estimatedTime = "3분",
  title = "AI가 자동으로 생성합니다",
  className = ""
}: AiGenerationInfoProps) {
  return (
    <div className={`
      bg-blue-50 border border-blue-200 rounded-lg p-4 
      ${className}
    `}>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" aria-hidden="true">🤖</span>
        <h4 className="font-semibold text-blue-700">
          {title}
        </h4>
      </div>

      {/* 기능 목록 */}
      <ul className="space-y-1.5 ml-1">
        {features.map((feature, index) => (
          <li 
            key={index}
            className="flex items-start gap-2 text-sm text-blue-600"
          >
            <span className="text-blue-400 mt-0.5" aria-hidden="true">•</span>
            <span>{feature}</span>
          </li>
        ))}
        
        {/* 예상 소요시간 */}
        {estimatedTime && (
          <li className="flex items-start gap-2 text-sm text-blue-600 pt-1">
            <span className="text-blue-400 mt-0.5" aria-hidden="true">•</span>
            <span className="font-medium">
              예상 소요시간: {estimatedTime}
            </span>
          </li>
        )}
      </ul>

      {/* 추가 안내 */}
      <div className="mt-3 pt-3 border-t border-blue-100">
        <p className="text-xs text-blue-500">
          AI가 생성한 문서는 검토 후 수정이 가능합니다
        </p>
      </div>
    </div>
  )
}