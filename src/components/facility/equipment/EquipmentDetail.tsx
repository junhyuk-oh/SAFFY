"use client"

import { useState } from "react"
import { Equipment } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display"
import { Button } from "@/components/ui/button"

interface EquipmentDetailProps {
  equipment: Equipment
  onEdit?: () => void
  onStatusChange?: (status: Equipment['status']) => void
  onMaintenanceRequest?: () => void
  onDelete?: () => void
  canEdit?: boolean
  canRequestMaintenance?: boolean
}

const statusConfig = {
  operational: {
    label: "?ïÏÉÅ",
    color: "text-success-text",
    bg: "bg-success-bg",
    icon: "??
  },
  maintenance: {
    label: "?ïÎπÑÏ§?,
    color: "text-warning-text",
    bg: "bg-warning-bg",
    icon: "?îß"
  },
  repair: {
    label: "?òÎ¶¨Ï§?,
    color: "text-error-text",
    bg: "bg-error-bg",
    icon: "?ö®"
  },
  out_of_service: {
    label: "Í∞Ä?ôÏ§ëÏßÄ",
    color: "text-text-tertiary",
    bg: "bg-gray-100",
    icon: "?î¥"
  },
  decommissioned: {
    label: "?êÍ∏∞",
    color: "text-text-tertiary",
    bg: "bg-gray-100",
    icon: "??
  }
}

const criticalityConfig = {
  low: {
    label: "??ùå",
    color: "text-success-text",
    bg: "bg-success-bg"
  },
  medium: {
    label: "Î≥¥ÌÜµ",
    color: "text-warning-text",
    bg: "bg-warning-bg"
  },
  high: {
    label: "?íÏùå",
    color: "text-error-text",
    bg: "bg-error-bg"
  },
  critical: {
    label: "Í∏¥Í∏â",
    color: "text-white",
    bg: "bg-red-600"
  }
}

const equipmentTypeIcons: Record<string, string> = {
  "Pump": "??,
  "Valve": "?îò",
  "Motor": "?îã",
  "Sensor": "?ì°",
  "Tank": "?è∫",
  "Compressor": "??",
  "Heat Exchanger": "?î•",
  "Filter": "?óÇÔ∏?,
  "Conveyor": "?°Ô∏è",
  "Reactor": "?óÔ∏è",
  "Boiler": "?î•",
  "Fan": "?å™Ô∏?,
  "Transformer": "??,
  "Generator": "?îå",
  "Chiller": "?ÑÔ∏è"
}

export function EquipmentDetail({
  equipment,
  onEdit,
  onStatusChange,
  onMaintenanceRequest,
  onDelete,
  canEdit = false,
  canRequestMaintenance = false
}: EquipmentDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'maintenance' | 'documents' | 'history'>('overview')
  const [maintenanceRequestNotes, setMaintenanceRequestNotes] = useState('')
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)

  const statusInfo = statusConfig[equipment.status]
  const criticalityInfo = criticalityConfig[equipment.criticality]
  const equipmentIcon = equipmentTypeIcons[equipment.type] || "?ôÔ∏è"

  // ?†Ïßú ?¨Îß∑???®Ïàò
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // ?¥ÏòÅ ?úÍ∞Ñ Í≥ÑÏÇ∞
  const getOperatingTime = () => {
    const installDate = new Date(equipment.installDate)
    const now = new Date()
    const diffTime = now.getTime() - installDate.getTime()
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    
    if (diffYears > 0) {
      return `${diffYears}??${diffMonths}Í∞úÏõî`
    } else {
      return `${diffMonths}Í∞úÏõî`
    }
  }

  // ?§Ïùå ?ïÎπÑÍπåÏ? ?®Ï? ?ºÏàò
  const getDaysUntilMaintenance = () => {
    if (!equipment.nextMaintenanceDate) return null
    
    const now = new Date()
    const nextMaintenance = new Date(equipment.nextMaintenanceDate)
    const diffTime = nextMaintenance.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}??Í≤ΩÍ≥º`, urgent: true, overdue: true }
    if (diffDays === 0) return { text: "?§Îäò", urgent: true, overdue: false }
    if (diffDays <= 7) return { text: `${diffDays}???®Ïùå`, urgent: true, overdue: false }
    return { text: `${diffDays}???®Ïùå`, urgent: false, overdue: false }
  }

  // Î≥¥Ï¶ùÍ∏∞Í∞Ñ ?ÅÌÉú
  const getWarrantyStatus = () => {
    if (!equipment.warrantyExpiry) return null
    
    const now = new Date()
    const warrantyExpiry = new Date(equipment.warrantyExpiry)
    const diffTime = warrantyExpiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: "ÎßåÎ£å", expired: true }
    if (diffDays <= 30) return { text: `${diffDays}???®Ïùå`, expiring: true }
    return { text: "?†Ìö®", valid: true }
  }

  const maintenanceInfo = getDaysUntilMaintenance()
  const warrantyInfo = getWarrantyStatus()
  const operatingTime = getOperatingTime()

  const handleMaintenanceRequest = () => {
    if (onMaintenanceRequest) {
      onMaintenanceRequest()
      setShowMaintenanceModal(false)
      setMaintenanceRequestNotes('')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Í∞úÏöî', icon: '?ìã' },
    { id: 'parameters', label: '?¥ÏòÅ ?åÎùºÎØ∏ÌÑ∞', icon: '?ìä' },
    { id: 'maintenance', label: '?ïÎπÑ ?¥Î†•', icon: '?îß' },
    { id: 'documents', label: 'Î¨∏ÏÑú', icon: '?ìÑ' },
    { id: 'history', label: 'Î≥ÄÍ≤??¥Î†•', icon: '?ìù' }
  ] as const

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ?§Îçî */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <span className="text-5xl">{equipmentIcon}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-2">{equipment.name}</h1>
              <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
                <span>#{equipment.code}</span>
                <span>??/span>
                <span>{equipment.type}</span>
                <span>??/span>
                <span>{equipment.location}</span>
                {equipment.subLocation && (
                  <>
                    <span>??/span>
                    <span>{equipment.subLocation}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${statusInfo.bg} ${statusInfo.color}`}>
                  <span className="mr-1">{statusInfo.icon}</span>
                  {statusInfo.label}
                </Badge>
                <Badge className={criticalityInfo.bg + ' ' + criticalityInfo.color}>
                  {criticalityInfo.label} Ï§ëÏöî??
                </Badge>
                {maintenanceInfo && (
                  <div className={`text-sm font-medium ${
                    maintenanceInfo.overdue ? 'text-error-text' : 
                    maintenanceInfo.urgent ? 'text-warning-text' : 'text-text-primary'
                  }`}>
                    ?ïÎπÑ: {maintenanceInfo.text}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-text-tertiary">
                <span>?úÏ°∞?? {equipment.manufacturer}</span>
                <span>??/span>
                <span>Î™®Îç∏: {equipment.model}</span>
                <span>??/span>
                <span>S/N: {equipment.serialNumber}</span>
                <span>??/span>
                <span>?¥ÏòÅ Í∏∞Í∞Ñ: {operatingTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canRequestMaintenance && equipment.status !== 'maintenance' && (
              <Button
                size="sm"
                onClick={() => setShowMaintenanceModal(true)}
                className="bg-warning hover:bg-warning/90"
              >
                <span className="mr-1">?îß</span>
                ?ïÎπÑ ?îÏ≤≠
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <span className="mr-1">?èÔ∏è</span>
                ?∏Ïßë
              </Button>
            )}
            {onStatusChange && (
              <select
                value={equipment.status}
                onChange={(e) => onStatusChange(e.target.value as Equipment['status'])}
                className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
              >
                <option value="operational">?ïÏÉÅ</option>
                <option value="maintenance">?ïÎπÑÏ§?/option>
                <option value="repair">?òÎ¶¨Ï§?/option>
                <option value="out_of_service">Í∞Ä?ôÏ§ëÏßÄ</option>
                <option value="decommissioned">?êÍ∏∞</option>
              </select>
            )}
          </div>
        </div>

        {/* Í∏∞Î≥∏ ?ïÎ≥¥ Í∑∏Î¶¨??*/}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">?§Ïπò??/div>
            <div className="font-medium text-text-primary mt-1">{formatDate(equipment.installDate)}</div>
          </div>
          <div>
            <div className="text-text-secondary">ÏµúÏ¢Ö ?ïÎπÑ</div>
            <div className="font-medium text-text-primary mt-1">{formatDate(equipment.lastMaintenanceDate)}</div>
          </div>
          <div>
            <div className="text-text-secondary">?§Ïùå ?ïÎπÑ</div>
            <div className={`font-medium mt-1 ${
              maintenanceInfo?.overdue ? 'text-error-text' : 
              maintenanceInfo?.urgent ? 'text-warning-text' : 'text-text-primary'
            }`}>
              {formatDate(equipment.nextMaintenanceDate)}
            </div>
          </div>
          <div>
            <div className="text-text-secondary">Î≥¥Ï¶ù ÎßåÎ£å</div>
            <div className={`font-medium mt-1 ${
              warrantyInfo?.expired ? 'text-error-text' : 
              warrantyInfo?.expiring ? 'text-warning-text' : 'text-success-text'
            }`}>
              {equipment.warrantyExpiry ? formatDate(equipment.warrantyExpiry) : '?ïÎ≥¥ ?ÜÏùå'}
            </div>
          </div>
        </div>
      </div>

      {/* ???§ÎπÑÍ≤åÏù¥??*/}
      <div className="bg-background-secondary rounded-notion-md">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Í∞úÏöî ??*/}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">Í∏∞Î≥∏ ?ïÎ≥¥</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?•ÎπÑ ÏΩîÎìú</span>
                      <span className="text-text-primary font-mono">{equipment.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?•ÎπÑ ?†Ìòï</span>
                      <span className="text-text-primary">{equipment.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?úÏ°∞??/span>
                      <span className="text-text-primary">{equipment.manufacturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Î™®Îç∏</span>
                      <span className="text-text-primary">{equipment.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?úÎ¶¨??Î≤àÌò∏</span>
                      <span className="text-text-primary font-mono">{equipment.serialNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">?ÑÏπò ?ïÎ≥¥</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Ï£??ÑÏπò</span>
                      <span className="text-text-primary">{equipment.location}</span>
                    </div>
                    {equipment.subLocation && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">?ÅÏÑ∏ ?ÑÏπò</span>
                        <span className="text-text-primary">{equipment.subLocation}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Ï§ëÏöî??/span>
                      <Badge className={criticalityInfo.bg + ' ' + criticalityInfo.color}>
                        {criticalityInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* ?¨Ïñë ?ïÎ≥¥ */}
              {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">Í∏∞Ïà† ?¨Ïñë</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(equipment.specifications).map(([key, value]) => (
                      <div key={key} className="p-4 bg-background rounded-notion-sm">
                        <div className="text-sm text-text-secondary capitalize">{key}</div>
                        <div className="text-text-primary font-medium mt-1">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {equipment.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">ÎπÑÍ≥†</h3>
                  <div className="p-4 bg-background rounded-notion-sm">
                    <p className="text-text-primary whitespace-pre-wrap">{equipment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ?¥ÏòÅ ?åÎùºÎØ∏ÌÑ∞ ??*/}
          {activeTab === 'parameters' && (
            <div className="space-y-6">
              {/* ?¥ÏòÅ ?åÎùºÎØ∏ÌÑ∞ */}
              {equipment.operatingParameters && Object.keys(equipment.operatingParameters).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">?¥ÏòÅ ?åÎùºÎØ∏ÌÑ∞</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(equipment.operatingParameters).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-4 bg-background rounded-notion-md border border-border">
                        <div className="text-sm text-text-secondary capitalize mb-2">{key}</div>
                        {typeof value === 'object' && value?.min !== undefined ? (
                          <div>
                            <div className="text-lg font-bold text-text-primary">
                              {value.min} ~ {value.max} {value.unit || ''}
                            </div>
                            <div className="text-xs text-text-tertiary mt-1">
                              ?ïÏÉÅ Î≤îÏúÑ
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-text-primary">
                            {String(value)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Í≤ΩÍ≥† ?ÑÍ≥ÑÍ∞?*/}
              {equipment.alertThresholds && Object.keys(equipment.alertThresholds).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">?åÎ¶º ?ÑÍ≥ÑÍ∞?/h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(equipment.alertThresholds).map(([key, thresholds]: [string, any]) => (
                      <div key={key} className="p-4 bg-background rounded-notion-md border border-border">
                        <div className="text-sm text-text-secondary capitalize mb-3">{key}</div>
                        <div className="space-y-2">
                          {thresholds.warning && (
                            <div className="flex justify-between items-center">
                              <span className="text-warning-text text-sm">?†Ô∏è Í≤ΩÍ≥†</span>
                              <span className="text-warning-text font-medium">{thresholds.warning}</span>
                            </div>
                          )}
                          {thresholds.critical && (
                            <div className="flex justify-between items-center">
                              <span className="text-error-text text-sm">?ö® ?ÑÌóò</span>
                              <span className="text-error-text font-medium">{thresholds.critical}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ?§ÏãúÍ∞??ÅÌÉú (?úÎ??àÏù¥?? */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">?§ÏãúÍ∞??ÅÌÉú</h3>
                <div className="p-4 bg-background rounded-notion-md text-center">
                  <div className="text-4xl mb-2">?ìä</div>
                  <p className="text-text-secondary">
                    ?§ÏãúÍ∞??ºÏÑú ?∞Ïù¥??Î™®Îãà?∞ÎßÅ Í∏∞Îä•??Í≥??úÍ≥µ???àÏ†ï?ÖÎãà??
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ?ïÎπÑ ?¥Î†• ??*/}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">?ïÎπÑ ?¥Î†•</h3>
                {canRequestMaintenance && (
                  <Button
                    size="sm"
                    onClick={() => setShowMaintenanceModal(true)}
                  >
                    ???ïÎπÑ ?îÏ≤≠
                  </Button>
                )}
              </div>

              {/* ?ïÎπÑ ?µÍ≥Ñ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-background rounded-notion-sm text-center">
                  <div className="text-lg font-bold text-primary">12</div>
                  <div className="text-sm text-text-secondary">Ï¥??ïÎπÑ ?üÏàò</div>
                </div>
                <div className="p-4 bg-background rounded-notion-sm text-center">
                  <div className="text-lg font-bold text-success-text">8</div>
                  <div className="text-sm text-text-secondary">?àÎ∞© ?ïÎπÑ</div>
                </div>
                <div className="p-4 bg-background rounded-notion-sm text-center">
                  <div className="text-lg font-bold text-warning-text">4</div>
                  <div className="text-sm text-text-secondary">Í∏¥Í∏â ?òÎ¶¨</div>
                </div>
                <div className="p-4 bg-background rounded-notion-sm text-center">
                  <div className="text-lg font-bold text-text-primary">98%</div>
                  <div className="text-sm text-text-secondary">Í∞Ä?ôÎ•†</div>
                </div>
              </div>

              {/* ?ïÎπÑ ?¥Î†• Î™©Î°ù (?àÏãú ?∞Ïù¥?? */}
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-4 bg-background rounded-notion-md border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                          <span className="text-success-text">?îß</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">
                            {index === 0 ? '?ïÍ∏∞ ?êÍ? Î∞??§Ïùº ÍµêÏ≤¥' :
                             index === 1 ? 'Î≤®Ìä∏ ÍµêÏ≤¥ ?ëÏóÖ' :
                             index === 2 ? 'ÏßÑÎèô ?ºÏÑú ÍµêÏ†ï' :
                             index === 3 ? '?âÍ∞Å?úÏä§??Ï≤?Üå' : '?ÑÍ∏∞ ?ëÏ†ê ?êÍ?'}
                          </h4>
                          <div className="text-sm text-text-secondary mt-1">
                            ?¥Îãπ?? ÍπÄ?ïÎπÑ ???åÏöî?úÍ∞Ñ: {2 + index}?úÍ∞Ñ
                          </div>
                          <div className="text-xs text-text-tertiary mt-1">
                            {new Date(Date.now() - (index + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                      </div>
                      <Badge variant={index === 1 || index === 4 ? 'warning' : 'success'}>
                        {index === 1 || index === 4 ? 'Í∏¥Í∏â' : '?àÎ∞©'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Î¨∏ÏÑú ??*/}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Í¥Ä??Î¨∏ÏÑú</h3>

              {/* Ï≤®Î??åÏùº */}
              {equipment.attachments && equipment.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipment.attachments.map((attachment, index) => (
                    <div key={index} className="p-4 bg-background rounded-notion-md border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                          <span className="text-primary">?ìÑ</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{attachment.fileName}</h4>
                          <div className="text-sm text-text-secondary mt-1">
                            ?¨Í∏∞: {Math.round(attachment.fileSize / 1024)}KB
                          </div>
                          <div className="text-xs text-text-tertiary mt-1">
                            ?ÖÎ°ú?? {formatDate(attachment.uploadedDate)}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          ?§Ïö¥Î°úÎìú
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">?ìÑ</div>
                  <p className="text-text-secondary">Ï≤®Î???Î¨∏ÏÑúÍ∞Ä ?ÜÏäµ?àÎã§</p>
                  {canEdit && (
                    <Button size="sm" className="mt-3">
                      Î¨∏ÏÑú ?ÖÎ°ú??
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Î≥ÄÍ≤??¥Î†• ??*/}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Î≥ÄÍ≤??¥Î†•</h3>
              
              <div className="space-y-4">
                {/* ?ùÏÑ± ?¥Î≤§??*/}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <span className="text-primary">??/span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">?•ÎπÑ ?±Î°ù</div>
                    <div className="text-sm text-text-secondary">
                      ?úÏä§??Í¥ÄÎ¶¨ÏûêÍ∞Ä ?•ÎπÑÎ•??úÏä§?úÏóê ?±Î°ù?àÏäµ?àÎã§
                    </div>
                    <div className="text-xs text-text-tertiary">{formatDate(equipment.createdAt)}</div>
                  </div>
                </div>

                {/* ?ÅÌÉú Î≥ÄÍ≤??¥Î≤§??(?àÏãú) */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-warning-bg rounded-full flex items-center justify-center">
                    <span className="text-warning-text">?îÑ</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">?ÅÌÉú Î≥ÄÍ≤?/div>
                    <div className="text-sm text-text-secondary">
                      ?ÅÌÉúÍ∞Ä "?ïÎπÑÏ§??êÏÑú "?ïÏÉÅ"?ºÎ°ú Î≥ÄÍ≤ΩÎêò?àÏäµ?àÎã§
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('ko-KR')}
                    </div>
                  </div>
                </div>

                {/* ?ïÎ≥¥ ?ÖÎç∞?¥Ìä∏ ?¥Î≤§??*/}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-background-hover rounded-full flex items-center justify-center">
                    <span className="text-text-secondary">?èÔ∏è</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">?ïÎ≥¥ ?ÖÎç∞?¥Ìä∏</div>
                    <div className="text-sm text-text-secondary">
                      ?¥ÏòÅ ?åÎùºÎØ∏ÌÑ∞Í∞Ä ?ÖÎç∞?¥Ìä∏?òÏóà?µÎãà??
                    </div>
                    <div className="text-xs text-text-tertiary">{formatDate(equipment.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ?ïÎπÑ ?îÏ≤≠ Î™®Îã¨ */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-notion-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">?ïÎπÑ ?îÏ≤≠</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?îÏ≤≠ ?¨Ïú†
                </label>
                <textarea
                  value={maintenanceRequestNotes}
                  onChange={(e) => setMaintenanceRequestNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                  placeholder="?ïÎπÑÍ∞Ä ?ÑÏöî???¥Ïú†Î•??ÖÎ†•?òÏÑ∏??.."
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline" 
                onClick={() => setShowMaintenanceModal(false)}
                className="flex-1"
              >
                Ï∑®ÏÜå
              </Button>
              <Button
                onClick={handleMaintenanceRequest}
                className="flex-1"
              >
                ?ïÎπÑ ?îÏ≤≠
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}