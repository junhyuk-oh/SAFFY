"use client"

import { useState } from "react"
import { FacilityAlert } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display"
import { Button } from "@/components/ui/button"
import { SEVERITY_CONFIG, ALERT_STATUS } from "@/lib/constants/status"
import { formatRelativeTime } from "@/lib/utils/date"

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


const categoryIcons: Record<string, string> = {
  safety: "?õ°Ô∏?,
  equipment: "?ôÔ∏è",
  environmental: "?å±",
  security: "?îí",
  operational: "?è≠",
  compliance: "?ìã"
}

const sourceIcons: Record<string, string> = {
  ai_system: "?§ñ",
  sensor: "?ì°",
  manual: "?ë§",
  inspection: "?îç",
  maintenance: "?îß",
  external: "?åê"
}

export function AlertItem({
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

  const severityInfo = SEVERITY_CONFIG[alert.severity]
  const statusInfo = ALERT_STATUS[alert.status]
  const categoryIcon = categoryIcons[alert.category] || "?ìã"
  const sourceIcon = sourceIcons[alert.source] || "?ìÑ"


  // Ï≤òÎ¶¨ ?úÍ∞Ñ Í≥ÑÏÇ∞
  const getProcessingTime = () => {
    if (!alert.resolvedDate) return null
    
    const detected = new Date(alert.detectedDate)
    const resolved = new Date(alert.resolvedDate)
    const diffTime = resolved.getTime() - detected.getTime()
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    
    if (diffMinutes < 60) return `${diffMinutes}Î∂?
    return `${diffHours}?úÍ∞Ñ ${diffMinutes % 60}Î∂?
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
            <span>??/span>
            <span>{formatRelativeTime(alert.detectedDate)}</span>
            {alert.equipmentName && (
              <>
                <span>??/span>
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
      {/* ?§Îçî */}
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
              <span>??/span>
              <span>{alert.location}</span>
              {alert.subLocation && (
                <>
                  <span>??/span>
                  <span>{alert.subLocation}</span>
                </>
              )}
              {alert.equipmentName && (
                <>
                  <span>??/span>
                  <span>?ôÔ∏è {alert.equipmentName}</span>
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

      {/* ?ºÏÑú ?∞Ïù¥??Î∞?AI Î∂ÑÏÑù */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {alert.sensorData && (
          <div className="p-3 bg-background rounded-notion-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">?ºÏÑú ?∞Ïù¥??/span>
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
                ?ÑÍ≥ÑÍ∞? {alert.sensorData.thresholdValue} {alert.sensorData.unit}
              </div>
            </div>
          </div>
        )}

        {alert.aiAnalysis && (
          <div className="p-3 bg-background rounded-notion-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">AI Î∂ÑÏÑù</span>
              <span className="text-xs text-text-secondary">?†Î¢∞?? {alert.aiAnalysis.confidence}%</span>
            </div>
            <p className="text-sm text-text-secondary">{alert.aiAnalysis.prediction}</p>
          </div>
        )}
      </div>

      {/* AI Í∂åÏû•?¨Ìï≠ */}
      {alert.aiAnalysis?.recommendations && alert.aiAnalysis.recommendations.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-text-primary mb-2">?§ñ AI Í∂åÏû•?¨Ìï≠</div>
          <div className="space-y-1">
            {alert.aiAnalysis.recommendations.map((recommendation, index) => (
              <div key={index} className="text-sm text-text-secondary bg-primary-light p-2 rounded-notion-sm">
                ??{recommendation}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ?ÅÌñ• ?âÍ? */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-2 bg-background rounded-notion-sm">
          <div className="text-xs text-text-secondary">?àÏ†Ñ ?ÑÌóò</div>
          <div className={`text-sm font-medium ${
            alert.impact.safetyRisk === 'critical' ? 'text-error-text' :
            alert.impact.safetyRisk === 'high' ? 'text-warning-text' : 'text-success-text'
          }`}>
            {alert.impact.safetyRisk}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded-notion-sm">
          <div className="text-xs text-text-secondary">?¥ÏòÅ ?ÅÌñ•</div>
          <div className={`text-sm font-medium ${
            alert.impact.operationalImpact === 'critical' ? 'text-error-text' :
            alert.impact.operationalImpact === 'high' ? 'text-warning-text' : 'text-success-text'
          }`}>
            {alert.impact.operationalImpact}
          </div>
        </div>
        {alert.impact.estimatedDowntime && (
          <div className="text-center p-2 bg-background rounded-notion-sm">
            <div className="text-xs text-text-secondary">?àÏÉÅ Ï§ëÎã®</div>
            <div className="text-sm font-medium text-text-primary">
              {alert.impact.estimatedDowntime}Î∂?
            </div>
          </div>
        )}
        {alert.impact.potentialCost && (
          <div className="text-center p-2 bg-background rounded-notion-sm">
            <div className="text-xs text-text-secondary">?àÏÉÅ ÎπÑÏö©</div>
            <div className="text-sm font-medium text-text-primary">
              ??alert.impact.potentialCost.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* ?ÅÌÉú ?ïÎ≥¥ */}
      <div className="flex items-center justify-between text-sm text-text-tertiary mb-4">
        <div className="flex items-center gap-4">
          <span>Î∞úÏÉù: {formatRelativeTime(alert.detectedDate)}</span>
          {alert.acknowledgedDate && alert.acknowledgedBy && (
            <span>?ïÏù∏: {alert.acknowledgedBy.name} ({formatRelativeTime(alert.acknowledgedDate)})</span>
          )}
          {processingTime && (
            <span>Ï≤òÎ¶¨?úÍ∞Ñ: {processingTime}</span>
          )}
        </div>
        {alert.assignedTo && (
          <span>?¥Îãπ: {alert.assignedTo.name}</span>
        )}
      </div>

      {/* ?°ÏÖò Î≤ÑÌäº */}
      {(canAcknowledge || canResolve || canEscalate) && alert.status === 'active' && (
        <div className="flex items-center gap-2">
          {canAcknowledge && alert.status === 'active' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowActions(showActions === false ? 'acknowledge' : false)}
            >
              ?ïÏù∏
            </Button>
          )}
          {canResolve && (
            <Button
              size="sm"
              onClick={() => setShowActions(showActions === false ? 'resolve' : false)}
              className="bg-success hover:bg-success/90"
            >
              ?¥Í≤∞
            </Button>
          )}
          {canEscalate && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleEscalate}
            >
              ?ÅÍ∏âÎ≥¥Í≥†
            </Button>
          )}
        </div>
      )}

      {/* ?°ÏÖò ??*/}
      {showActions && (
        <div className="mt-4 p-4 bg-background rounded-notion-md border border-border">
          {showActions === 'acknowledge' && (
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">?åÎ¶º ?ïÏù∏</h4>
              <textarea
                value={acknowledgeNotes}
                onChange={(e) => setAcknowledgeNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-20 resize-none text-sm"
                placeholder="?ïÏù∏ ?¥Ïö©?¥ÎÇò Ï°∞Ïπò Í≥ÑÌöç???ÖÎ†•?òÏÑ∏??(?†ÌÉù?¨Ìï≠)..."
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowActions(false)}
                >
                  Ï∑®ÏÜå
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcknowledge}
                >
                  ?ïÏù∏ ?ÑÎ£å
                </Button>
              </div>
            </div>
          )}

          {showActions === 'resolve' && (
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">?åÎ¶º ?¥Í≤∞</h4>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?¥Í≤∞ Î∞©Î≤ï <span className="text-error-text">*</span>
                </label>
                <textarea
                  value={resolutionData.resolution}
                  onChange={(e) => setResolutionData(prev => ({ ...prev, resolution: e.target.value }))}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-20 resize-none text-sm"
                  placeholder="Î¨∏Ï†ú ?¥Í≤∞ Î∞©Î≤ï???ÅÏÑ∏???§Î™Ö?òÏÑ∏??.."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?§Ìñâ??Ï°∞Ïπò
                </label>
                <div className="space-y-2">
                  {resolutionData.actionsTaken.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-success-bg rounded-notion-sm">
                      <span className="text-sm text-success-text">??{action}</span>
                      <button
                        type="button"
                        onClick={() => removeAction(index)}
                        className="text-error-text hover:text-error text-sm"
                      >
                        ??
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={resolutionData.newAction}
                      onChange={(e) => setResolutionData(prev => ({ ...prev, newAction: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none text-sm"
                      placeholder="?§Ìñâ??Ï°∞ÏπòÎ•?Ï∂îÍ??òÏÑ∏??.."
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
                      Ï∂îÍ?
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
                  Ï∑®ÏÜå
                </Button>
                <Button
                  size="sm"
                  onClick={handleResolve}
                  disabled={!resolutionData.resolution.trim()}
                  className="bg-success hover:bg-success/90"
                >
                  ?¥Í≤∞ ?ÑÎ£å
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Í∏¥Í∏â ?åÎ¶º ?úÏãú */}
      {alert.severity === 'emergency' && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
          ÎπÑÏÉÅ
        </div>
      )}

      {/* AI ?ùÏÑ± ?úÏãú */}
      {alert.source === 'ai_system' && (
        <div className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
          AI
        </div>
      )}
    </div>
  )
}