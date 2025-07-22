"use client"

import { Scale, ExternalLink, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { getRelatedLaws, DOCUMENT_TYPE_NAMES } from "@/lib/laws/lawMapping"

interface LawReferenceSectionProps {
  documentType: string
  title?: string
  className?: string
  showTitle?: boolean
  variant?: 'full' | 'compact' | 'badge'
}

export function LawReferenceSection({ 
  documentType, 
  title,
  className = "",
  showTitle = true,
  variant = 'full'
}: LawReferenceSectionProps) {
  const relatedLaws = getRelatedLaws(documentType)
  
  if (relatedLaws.length === 0) {
    return null
  }

  const documentName = title || DOCUMENT_TYPE_NAMES[documentType] || "문서"

  // Badge 형태 (간단한 표시)
  if (variant === 'badge') {
    const primaryLaw = relatedLaws.find(law => law.relevance === 'primary')
    if (!primaryLaw) return null

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-notion-sm text-xs ${className}`}>
        <Scale className="w-3 h-3" />
        <span>{primaryLaw.lawName} {primaryLaw.articleNumber} 준거</span>
      </div>
    )
  }

  // Compact 형태 (한줄 표시)
  if (variant === 'compact') {
    const mandatoryLaws = relatedLaws.filter(law => law.complianceType === 'mandatory')
    
    return (
      <div className={`flex items-center gap-2 p-3 bg-blue-50 rounded-notion-md border-l-4 border-blue-400 ${className}`}>
        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm text-blue-800">
            이 {documentName}는 <strong>{mandatoryLaws.map(law => `${law.lawName} ${law.articleNumber}`).join(', ')}</strong>에 근거합니다
          </span>
        </div>
      </div>
    )
  }

  // Full 형태 (상세 표시)
  return (
    <div className={`bg-blue-50 rounded-notion-lg p-6 border border-blue-200 ${className}`}>
      {showTitle && (
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-notion-md">
            <Scale className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">법적 근거</h3>
            <p className="text-sm text-blue-700">이 {documentName}와 관련된 법령</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {relatedLaws.map((law, index) => (
          <div key={index} className="bg-white rounded-notion-md p-4 border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    law.relevance === 'primary' 
                      ? 'bg-red-100 text-red-800' 
                      : law.relevance === 'secondary'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {law.relevance === 'primary' ? '주요' : 
                     law.relevance === 'secondary' ? '관련' : '참고'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    law.complianceType === 'mandatory'
                      ? 'bg-orange-100 text-orange-800'
                      : law.complianceType === 'recommended'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {law.complianceType === 'mandatory' ? '필수' :
                     law.complianceType === 'recommended' ? '권장' : '가이드'}
                  </span>
                  {law.complianceType === 'mandatory' && (
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                
                <h4 className="font-medium text-blue-900 mb-1">
                  {law.lawName} {law.articleNumber}
                </h4>
                <h5 className="text-sm font-medium text-blue-800 mb-2">
                  {law.articleTitle}
                </h5>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {law.description}
                </p>
              </div>
              
              <a
                href={`/${law.lawId.replace('-', '-')}#${law.articleId}`}
                className="ml-4 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-notion-sm transition-colors"
                title="조문 전문 보기"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 안내 */}
      <div className="mt-4 p-3 bg-blue-100 rounded-notion-md">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">준수 확인 사항</div>
            <ul className="space-y-1 text-xs">
              {relatedLaws
                .filter(law => law.complianceType === 'mandatory')
                .map((law, index) => (
                <li key={index}>
                  • {law.lawName} {law.articleNumber} 요구사항 충족 확인
                </li>
              ))}
              <li>• 관련 법령 변경사항 정기 확인</li>
              <li>• 증빙 문서 및 기록 적절한 보관</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 관련 기능 링크 */}
      <div className="mt-4 pt-3 border-t border-blue-200">
        <div className="flex flex-wrap gap-2">
          {relatedLaws.map((law, index) => (
            <a
              key={index}
              href={`/${law.lawId.replace('-', '-')}#${law.articleId}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-notion-sm text-sm hover:bg-blue-700 transition-colors"
            >
              <Scale className="w-3 h-3" />
              {law.articleNumber} 조문보기
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}