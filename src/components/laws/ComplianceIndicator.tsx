"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertTriangle, Clock, XCircle, Scale, ExternalLink } from "lucide-react"
import { calculateOverallCompliance, checkDocumentCompliance, type OverallCompliance, type ComplianceStatus } from "@/lib/laws/complianceChecker"

interface ComplianceIndicatorProps {
  variant?: 'full' | 'card' | 'badge'
  documentType?: string
  className?: string
}

export function ComplianceIndicator({ 
  variant = 'card', 
  documentType,
  className = "" 
}: ComplianceIndicatorProps) {
  const [overallCompliance, setOverallCompliance] = useState<OverallCompliance | null>(null)
  const [documentCompliance, setDocumentCompliance] = useState<ComplianceStatus | null>(null)

  useEffect(() => {
    if (documentType) {
      setDocumentCompliance(checkDocumentCompliance(documentType))
    } else {
      setOverallCompliance(calculateOverallCompliance())
    }
  }, [documentType])

  // Badge 형태 (간단한 상태만)
  if (variant === 'badge') {
    const compliance = documentType ? documentCompliance : overallCompliance
    if (!compliance) return null

    const rate = documentType ? documentCompliance!.complianceRate : overallCompliance!.overallRate
    const status = documentType ? documentCompliance!.status : overallCompliance!.status

    const getStatusColor = () => {
      if (status === 'compliant' || status === 'excellent') return 'bg-green-100 text-green-800'
      if (status === 'partial' || status === 'good') return 'bg-yellow-100 text-yellow-800'
      if (status === 'warning') return 'bg-orange-100 text-orange-800'
      return 'bg-red-100 text-red-800'
    }

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-notion-sm text-xs ${getStatusColor()} ${className}`}>
        <Scale className="w-3 h-3" />
        <span>법률준수 {rate}%</span>
      </div>
    )
  }

  // Card 형태 (대시보드용)
  if (variant === 'card') {
    if (!overallCompliance) {
      return (
        <div className={`bg-background-secondary rounded-notion-lg p-6 ${className}`}>
          <div className="animate-pulse">
            <div className="h-4 bg-background-hover rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-background-hover rounded w-1/4"></div>
          </div>
        </div>
      )
    }

    const getStatusIcon = () => {
      switch (overallCompliance.status) {
        case 'excellent':
          return <CheckCircle className="w-8 h-8 text-green-600" />
        case 'good':
          return <CheckCircle className="w-8 h-8 text-blue-600" />
        case 'warning':
          return <AlertTriangle className="w-8 h-8 text-yellow-600" />
        case 'critical':
          return <XCircle className="w-8 h-8 text-red-600" />
        default:
          return <Clock className="w-8 h-8 text-gray-400" />
      }
    }

    const getStatusText = () => {
      switch (overallCompliance.status) {
        case 'excellent': return '우수'
        case 'good': return '양호'
        case 'warning': return '주의'
        case 'critical': return '위험'
        default: return '확인 필요'
      }
    }

    const getStatusColor = () => {
      switch (overallCompliance.status) {
        case 'excellent': return 'text-green-600'
        case 'good': return 'text-blue-600'
        case 'warning': return 'text-yellow-600'
        case 'critical': return 'text-red-600'
        default: return 'text-gray-400'
      }
    }

    return (
      <div className={`bg-background-secondary rounded-notion-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text-primary">법적 준수율</h3>
            <p className="text-sm text-text-secondary">전체 법령 준수 현황</p>
          </div>
          {getStatusIcon()}
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">
              {overallCompliance.overallRate}%
            </span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">준수 완료</span>
            <span className="font-medium text-green-600">
              {overallCompliance.compliantDocuments}개
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">부분 준수</span>
            <span className="font-medium text-yellow-600">
              {overallCompliance.partialCompliantDocuments}개
            </span>
          </div>
          {overallCompliance.nonCompliantDocuments > 0 && (
            <div className="flex justify-between">
              <span className="text-text-secondary">미준수</span>
              <span className="font-medium text-red-600">
                {overallCompliance.nonCompliantDocuments}개
              </span>
            </div>
          )}
        </div>

        {overallCompliance.criticalItems.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded-notion-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">긴급 조치 필요</span>
            </div>
            <ul className="text-xs text-red-700 space-y-1">
              {overallCompliance.criticalItems.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        )}

        {overallCompliance.upcomingDeadlines.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-notion-md">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">다가오는 마감일</span>
            </div>
            <div className="space-y-1">
              {overallCompliance.upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                <div key={index} className="flex justify-between text-xs text-yellow-700">
                  <span>{deadline.item}</span>
                  <span>D-{deadline.daysRemaining}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full 형태 (상세 페이지용)
  if (variant === 'full' && overallCompliance) {
    return (
      <div className={`bg-background-secondary rounded-notion-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">법률 준수 현황</h2>
            <p className="text-text-secondary">전체 문서별 법령 준수 상태</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-text-primary mb-1">
              {overallCompliance.overallRate}%
            </div>
            <div className="text-sm text-text-secondary">전체 준수율</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-notion-md">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">
              {overallCompliance.compliantDocuments}
            </div>
            <div className="text-sm text-green-700">완료</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-notion-md">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-800">
              {overallCompliance.partialCompliantDocuments}
            </div>
            <div className="text-sm text-yellow-700">부분 준수</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-notion-md">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-800">
              {overallCompliance.nonCompliantDocuments}
            </div>
            <div className="text-sm text-red-700">미준수</div>
          </div>
        </div>

        {overallCompliance.upcomingDeadlines.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-text-primary mb-3">다가오는 마감일</h3>
            <div className="space-y-2">
              {overallCompliance.upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-notion-md">
                  <div>
                    <div className="font-medium text-text-primary">{deadline.item}</div>
                    <div className="text-sm text-text-secondary">{deadline.dueDate}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                    deadline.daysRemaining <= 7 
                      ? 'bg-red-100 text-red-800'
                      : deadline.daysRemaining <= 14
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    D-{deadline.daysRemaining}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <a
            href="/laws/compliance"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-notion-sm hover:bg-primary-dark transition-colors"
          >
            <Scale className="w-4 h-4" />
            상세 컴플라이언스 보고서
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  return null
}