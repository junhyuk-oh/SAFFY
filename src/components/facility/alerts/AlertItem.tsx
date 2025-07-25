"use client"

import { useState, memo } from "react"
import { FacilityAlert } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"

interface AlertItemProps {
  alert: FacilityAlert
  onAcknowledge?: (id: string, notes?: string) => void
  onResolve?: (id: string, resolution: string, actionsTaken: string[]) => void
  onEscalate?: (id: string) => void
  canAcknowledge?: boolean
  canResolve?: boolean
  canEscalate?: boolean
  compact?: boolean
}

const severityConfig = {
  low: {
    label: "낮음",
    color: "text-success-text",
    bg: "bg-success-bg",
    borderColor: "border-l-success",
    icon: "ℹ️"
  },
  medium: {
    label: "보통",
    color: "text-primary",
    bg: "bg-blue-50",
    borderColor: "border-l-primary",
    icon: "⚠️"
  },
  high: {
    label: "높음",
    color: "text-warning-text",
    bg: "bg-warning-bg",
    borderColor: "border-l-warning",
    icon: "🚨"
  },
  critical: {
    label: "긴급",
    color: "text-error-text",
    bg: "bg-error-bg",
    borderColor: "border-l-error",
    icon: "🔴"
  },
  emergency: {
    label: "비상",
    color: "text-white",
    bg: "bg-red-600",
    borderColor: "border-l-red-600",
    icon: "🆘"
  }
}

const statusConfig = {
  active: {
    label: "활성",
    color: "text-error-text",
    bg: "bg-error-bg"
  },
  acknowledged: {
    label: "확인됨",
    color: "text-warning-text",
    bg: "bg-warning-bg"
  },
  resolved: {
    label: "해결됨",
    color: "text-success-text",
    bg: "bg-success-bg"
  },
  false_positive: {
    label: "오탐지",
    color: "text-text-secondary",
    bg: "bg-background-hover"
  },
  escalated: {
    label: "상급보고",
    color: "text-primary",
    bg: "bg-blue-50"
  }
}

const categoryIcons: Record<string, string> = {
  safety: "🛡️",
  equipment: "⚙️",
  environmental: "🌱",
  security: "🔒",
  operational: "🏭",
  compliance: "📋"
}

const sourceIcons: Record<string, string> = {
  ai_system: "🤖",
  sensor: "📡",
  manual: "👤",
  inspection: "🔍",
  maintenance: "🔧",
  external: "🌐"
}

export const AlertItem = memo(function AlertItem({
  alert,
  onAcknowledge,
  onResolve,
  onEscalate,
  canAcknowledge = false,
  canResolve = false,
  canEscalate = false,
  compact = false
}: AlertItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [acknowledgeNotes, setAcknowledgeNotes] = useState('')
  const [resolutionData, setResolutionData] = useState({
    resolution: '',
    actionsTaken: [] as string[],
    newAction: ''
  })

  const severityInfo = severityConfig[alert.severity]
  const statusInfo = statusConfig[alert.status]
  const categoryIcon = categoryIcons[alert.category] || "📋"
  const sourceIcon = sourceIcons[alert.source] || "📄"

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return '방금 전'
    if (diffMinutes < 60) return `${diffMinutes}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`
    
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 처리 시간 계산
  const getProcessingTime = () => {
    if (!alert.resolvedDate) return null
    
    const detected = new Date(alert.detectedDate)
    const resolved = new Date(alert.resolvedDate)
    const diffTime = resolved.getTime() - detected.getTime()
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    
    if (diffMinutes < 60) return `${diffMinutes}분`
    return `${diffHours}시간 ${diffMinutes % 60}분`
  }

  const handleAcknowledge = () => {
    if (onAcknowledge) {
      onAcknowledge(alert.id, acknowledgeNotes || undefined)
      setAcknowledgeNotes('')
      setShowActions(false)
    }
  }

  const handleResolve = () => {
    if (onResolve && resolutionData.resolution.trim()) {
      onResolve(alert.id, resolutionData.resolution, resolutionData.actionsTaken)
      setResolutionData({ resolution: '', actionsTaken: [], newAction: '' })
      setShowActions(false)
    }
  }

  const handleEscalate = () => {
    if (onEscalate) {
      onEscalate(alert.id)
      setShowActions(false)
    }
  }

  const addAction = () => {
    if (resolutionData.newAction.trim()) {
      setResolutionData(prev => ({
        ...prev,
        actionsTaken: [...prev.actionsTaken, prev.newAction.trim()],
        newAction: ''
      }))
    }
  }

  const removeAction = (index: number) => {
    setResolutionData(prev => ({
      ...prev,
      actionsTaken: prev.actionsTaken.filter((_, i) => i !== index)
    }))
  }

  const processingTime = getProcessingTime()

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 border-l-4 ${severityInfo.borderColor} bg-background-secondary rounded-r-notion-md hover:shadow-md transition-all duration-200`}>
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${severityInfo.bg}`}>
            <span className="text-lg">{severityInfo.icon}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{categoryIcon}</span>
            <h4 className="font-medium text-text-primary truncate">{alert.title}</h4>
            <Badge className={`${statusInfo.bg} ${statusInfo.color} text-xs`}>
              {statusInfo.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span>{alert.location}</span>
            <span>•</span>
            <span>{formatDate(alert.detectedDate)}</span>
            {alert.equipmentName && (
              <>
                <span>•</span>
                <span>{alert.equipmentName}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <Badge variant={alert.severity === 'emergency' || alert.severity === 'critical' ? 'destructive' : 'warning'}>
            {severityInfo.label}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-background-secondary rounded-notion-md p-5 border border-border border-l-4 ${severityInfo.borderColor} transition-all duration-200 hover:shadow-lg relative`}>
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${severityInfo.bg}`}>
            <span className="text-2xl">{severityInfo.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{categoryIcon}</span>
              <h3 className="text-base font-semibold text-text-primary">{alert.title}</h3>
              <Badge className={`${statusInfo.bg} ${statusInfo.color}`}>
                {statusInfo.label}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
              <span>{sourceIcon}</span>
              <span className="capitalize">{alert.source.replace('_', ' ')}</span>
              <span>•</span>
              <span>{alert.location}</span>
              {alert.subLocation && (
                <>
                  <span>•</span>
                  <span>{alert.subLocation}</span>
                </>
              )}
              {alert.equipmentName && (
                <>
                  <span>•</span>
                  <span>⚙️ {alert.equipmentName}</span>
                </>
              )}
            </div>
            
            <p className="text-sm text-text-secondary">{alert.message}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-3">
          <Badge 
            variant={alert.severity === 'emergency' || alert.severity === 'critical' ? 'destructive' : 
                   alert.severity === 'high' ? 'warning' : 'secondary'}
          >
            {severityInfo.label}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {alert.category}
          </Badge>
        </div>
      </div>

      {/* 센서 데이터 및 AI 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {alert.sensorData && (
          <div className="p-3 bg-background rounded-notion-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">센서 데이터</span>
              <span className="text-xs text-text-secondary">{alert.sensorData.sensorName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-lg font-bold ${
                alert.severity === 'critical' || alert.severity === 'emergency' ? 'text-error-text' :
                alert.severity === 'high' ? 'text-warning-text' : 'text-text-primary'
              }`}>
                {alert.sensorData.currentValue} {alert.sensorData.unit}
              </div>
              <div className="text-sm text-text-secondary">
                임계값: {alert.sensorData.thresholdValue} {alert.sensorData.unit}
              </div>
            </div>
          </div>
        )}

        {alert.aiAnalysis && (
          <div className="p-3 bg-background rounded-notion-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">AI 분석</span>
              <span className="text-xs text-text-secondary">신뢰도: {alert.aiAnalysis.confidence}%</span>
            </div>
            <p className="text-sm text-text-secondary">{alert.aiAnalysis.prediction}</p>
          </div>
        )}
      </div>

      {/* AI 권장사항 */}
      {alert.aiAnalysis?.recommendations && alert.aiAnalysis.recommendations.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-text-primary mb-2">🤖 AI 권장사항</div>
          <div className="space-y-1">
            {alert.aiAnalysis.recommendations.map((recommendation, index) => (
              <div key={index} className="text-sm text-text-secondary bg-primary-light p-2 rounded-notion-sm">
                • {recommendation}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 영향 평가 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-2 bg-background rounded-notion-sm">
          <div className="text-xs text-text-secondary">안전 위험</div>
          <div className={`text-sm font-medium ${
            alert.impact.safetyRisk === 'critical' ? 'text-error-text' :
            alert.impact.safetyRisk === 'high' ? 'text-warning-text' : 'text-success-text'
          }`}>
            {alert.impact.safetyRisk}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded-notion-sm">
          <div className="text-xs text-text-secondary">운영 영향</div>
          <div className={`text-sm font-medium ${
            alert.impact.operationalImpact === 'critical' ? 'text-error-text' :
            alert.impact.operationalImpact === 'high' ? 'text-warning-text' : 'text-success-text'
          }`}>
            {alert.impact.operationalImpact}
          </div>
        </div>
        {alert.impact.estimatedDowntime && (
          <div className="text-center p-2 bg-background rounded-notion-sm">
            <div className="text-xs text-text-secondary">예상 중단</div>
            <div className="text-sm font-medium text-text-primary">
              {alert.impact.estimatedDowntime}분
            </div>
          </div>
        )}
        {alert.impact.potentialCost && (
          <div className="text-center p-2 bg-background rounded-notion-sm">
            <div className="text-xs text-text-secondary">예상 비용</div>
            <div className="text-sm font-medium text-text-primary">
              ₩{alert.impact.potentialCost.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* 상태 정보 */}
      <div className="flex items-center justify-between text-sm text-text-tertiary mb-4">
        <div className="flex items-center gap-4">
          <span>발생: {formatDate(alert.detectedDate)}</span>
          {alert.acknowledgedDate && alert.acknowledgedBy && (
            <span>확인: {alert.acknowledgedBy.name} ({formatDate(alert.acknowledgedDate)})</span>
          )}
          {processingTime && (
            <span>처리시간: {processingTime}</span>
          )}
        </div>
        {alert.assignedTo && (
          <span>담당: {alert.assignedTo.name}</span>
        )}
      </div>

      {/* 액션 버튼 */}
      {(canAcknowledge || canResolve || canEscalate) && alert.status === 'active' && (
        <div className="flex items-center gap-2">
          {canAcknowledge && alert.status === 'active' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowActions(showActions === false ? 'acknowledge' : false)}
            >
              확인
            </Button>
          )}
          {canResolve && (
            <Button
              size="sm"
              onClick={() => setShowActions(showActions === false ? 'resolve' : false)}
              className="bg-success hover:bg-success/90"
            >
              해결
            </Button>
          )}
          {canEscalate && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleEscalate}
            >
              상급보고
            </Button>
          )}
        </div>
      )}

      {/* 액션 폼 */}
      {showActions && (
        <div className="mt-4 p-4 bg-background rounded-notion-md border border-border">
          {showActions === 'acknowledge' && (
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">알림 확인</h4>
              <textarea
                value={acknowledgeNotes}
                onChange={(e) => setAcknowledgeNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-20 resize-none text-sm"
                placeholder="확인 내용이나 조치 계획을 입력하세요 (선택사항)..."
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowActions(false)}
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcknowledge}
                >
                  확인 완료
                </Button>
              </div>
            </div>
          )}

          {showActions === 'resolve' && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">알림 해결</h4>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  해결 방법 <span className="text-error-text">*</span>
                </label>
                <textarea
                  value={resolutionData.resolution}
                  onChange={(e) => setResolutionData(prev => ({ ...prev, resolution: e.target.value }))}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-20 resize-none text-sm"
                  placeholder="문제 해결 방법을 상세히 설명하세요..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  실행한 조치
                </label>
                <div className="space-y-2">
                  {resolutionData.actionsTaken.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-success-bg rounded-notion-sm">
                      <span className="text-sm text-success-text">• {action}</span>
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="text-error-text hover:text-error text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={resolutionData.newAction}
                      onChange={(e) => setResolutionData(prev => ({ ...prev, newAction: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none text-sm"
                      placeholder="실행한 조치를 추가하세요..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addAction()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addAction}
                    >
                      추가
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowActions(false)}
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleResolve}
                  disabled={!resolutionData.resolution.trim()}
                  className="bg-success hover:bg-success/90"
                >
                  해결 완료
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 긴급 알림 표시 */}
      {alert.severity === 'emergency' && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
          비상
        </div>
      )}

      {/* AI 생성 표시 */}
      {alert.source === 'ai_system' && (
        <div className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
          AI
        </div>
      )}
    </div>
  )
})