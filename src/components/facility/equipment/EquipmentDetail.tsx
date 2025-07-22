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
    label: "?�상",
    color: "text-success-text",
    bg: "bg-success-bg",
    icon: "??
  },
  maintenance: {
    label: "?�비�?,
    color: "text-warning-text",
    bg: "bg-warning-bg",
    icon: "?��"
  },
  repair: {
    label: "?�리�?,
    color: "text-error-text",
    bg: "bg-error-bg",
    icon: "?��"
  },
  out_of_service: {
    label: "가?�중지",
    color: "text-text-tertiary",
    bg: "bg-gray-100",
    icon: "?��"
  },
  decommissioned: {
    label: "?�기",
    color: "text-text-tertiary",
    bg: "bg-gray-100",
    icon: "??
  }
}

const criticalityConfig = {
  low: {
    label: "??��",
    color: "text-success-text",
    bg: "bg-success-bg"
  },
  medium: {
    label: "보통",
    color: "text-warning-text",
    bg: "bg-warning-bg"
  },
  high: {
    label: "?�음",
    color: "text-error-text",
    bg: "bg-error-bg"
  },
  critical: {
    label: "긴급",
    color: "text-white",
    bg: "bg-red-600"
  }
}

const equipmentTypeIcons: Record<string, string> = {
  "Pump": "??,
  "Valve": "?��",
  "Motor": "?��",
  "Sensor": "?��",
  "Tank": "?��",
  "Compressor": "??",
  "Heat Exchanger": "?��",
  "Filter": "?���?,
  "Conveyor": "?�️",
  "Reactor": "?�️",
  "Boiler": "?��",
  "Fan": "?���?,
  "Transformer": "??,
  "Generator": "?��",
  "Chiller": "?�️"
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
  const equipmentIcon = equipmentTypeIcons[equipment.type] || "?�️"

  // ?�짜 ?�맷???�수
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

  // ?�영 ?�간 계산
  const getOperatingTime = () => {
    const installDate = new Date(equipment.installDate)
    const now = new Date()
    const diffTime = now.getTime() - installDate.getTime()
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    
    if (diffYears > 0) {
      return `${diffYears}??${diffMonths}개월`
    } else {
      return `${diffMonths}개월`
    }
  }

  // ?�음 ?�비까�? ?��? ?�수
  const getDaysUntilMaintenance = () => {
    if (!equipment.nextMaintenanceDate) return null
    
    const now = new Date()
    const nextMaintenance = new Date(equipment.nextMaintenanceDate)
    const diffTime = nextMaintenance.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}??경과`, urgent: true, overdue: true }
    if (diffDays === 0) return { text: "?�늘", urgent: true, overdue: false }
    if (diffDays <= 7) return { text: `${diffDays}???�음`, urgent: true, overdue: false }
    return { text: `${diffDays}???�음`, urgent: false, overdue: false }
  }

  // 보증기간 ?�태
  const getWarrantyStatus = () => {
    if (!equipment.warrantyExpiry) return null
    
    const now = new Date()
    const warrantyExpiry = new Date(equipment.warrantyExpiry)
    const diffTime = warrantyExpiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: "만료", expired: true }
    if (diffDays <= 30) return { text: `${diffDays}???�음`, expiring: true }
    return { text: "?�효", valid: true }
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
    { id: 'overview', label: '개요', icon: '?��' },
    { id: 'parameters', label: '?�영 ?�라미터', icon: '?��' },
    { id: 'maintenance', label: '?�비 ?�력', icon: '?��' },
    { id: 'documents', label: '문서', icon: '?��' },
    { id: 'history', label: '변�??�력', icon: '?��' }
  ] as const

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ?�더 */}
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
                  {criticalityInfo.label} 중요??
                </Badge>
                {maintenanceInfo && (
                  <div className={`text-sm font-medium ${
                    maintenanceInfo.overdue ? 'text-error-text' : 
                    maintenanceInfo.urgent ? 'text-warning-text' : 'text-text-primary'
                  }`}>
                    ?�비: {maintenanceInfo.text}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-text-tertiary">
                <span>?�조?? {equipment.manufacturer}</span>
                <span>??/span>
                <span>모델: {equipment.model}</span>
                <span>??/span>
                <span>S/N: {equipment.serialNumber}</span>
                <span>??/span>
                <span>?�영 기간: {operatingTime}</span>
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
                <span className="mr-1">?��</span>
                ?�비 ?�청
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <span className="mr-1">?�️</span>
                ?�집
              </Button>
            )}
            {onStatusChange && (
              <select
                value={equipment.status}
                onChange={(e) => onStatusChange(e.target.value as Equipment['status'])}
                className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
              >
                <option value="operational">?�상</option>
                <option value="maintenance">?�비�?/option>
                <option value="repair">?�리�?/option>
                <option value="out_of_service">가?�중지</option>
                <option value="decommissioned">?�기</option>
              </select>
            )}
          </div>
        </div>

        {/* 기본 ?�보 그리??*/}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">?�치??/div>
            <div className="font-medium text-text-primary mt-1">{formatDate(equipment.installDate)}</div>
          </div>
          <div>
            <div className="text-text-secondary">최종 ?�비</div>
            <div className="font-medium text-text-primary mt-1">{formatDate(equipment.lastMaintenanceDate)}</div>
          </div>
          <div>
            <div className="text-text-secondary">?�음 ?�비</div>
            <div className={`font-medium mt-1 ${
              maintenanceInfo?.overdue ? 'text-error-text' : 
              maintenanceInfo?.urgent ? 'text-warning-text' : 'text-text-primary'
            }`}>
              {formatDate(equipment.nextMaintenanceDate)}
            </div>
          </div>
          <div>
            <div className="text-text-secondary">보증 만료</div>
            <div className={`font-medium mt-1 ${
              warrantyInfo?.expired ? 'text-error-text' : 
              warrantyInfo?.expiring ? 'text-warning-text' : 'text-success-text'
            }`}>
              {equipment.warrantyExpiry ? formatDate(equipment.warrantyExpiry) : '?�보 ?�음'}
            </div>
          </div>
        </div>
      </div>

      {/* ???�비게이??*/}
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
          {/* 개요 ??*/}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">기본 ?�보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?�비 코드</span>
                      <span className="text-text-primary font-mono">{equipment.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?�비 ?�형</span>
                      <span className="text-text-primary">{equipment.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?�조??/span>
                      <span className="text-text-primary">{equipment.manufacturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">모델</span>
                      <span className="text-text-primary">{equipment.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?�리??번호</span>
                      <span className="text-text-primary font-mono">{equipment.serialNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">?�치 ?�보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">�??�치</span>
                      <span className="text-text-primary">{equipment.location}</span>
                    </div>
                    {equipment.subLocation && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">?�세 ?�치</span>
                        <span className="text-text-primary">{equipment.subLocation}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">중요??/span>
                      <Badge className={criticalityInfo.bg + ' ' + criticalityInfo.color}>
                        {criticalityInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* ?�양 ?�보 */}
              {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">기술 ?�양</h3>
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
                  <h3 className="text-lg font-semibold text-text-primary">비고</h3>
                  <div className="p-4 bg-background rounded-notion-sm">
                    <p className="text-text-primary whitespace-pre-wrap">{equipment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ?�영 ?�라미터 ??*/}
          {activeTab === 'parameters' && (
            <div className="space-y-6">
              {/* ?�영 ?�라미터 */}
              {equipment.operatingParameters && Object.keys(equipment.operatingParameters).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">?�영 ?�라미터</h3>
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
                              ?�상 범위
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

              {/* 경고 ?�계�?*/}
              {equipment.alertThresholds && Object.keys(equipment.alertThresholds).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">?�림 ?�계�?/h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(equipment.alertThresholds).map(([key, thresholds]: [string, any]) => (
                      <div key={key} className="p-4 bg-background rounded-notion-md border border-border">
                        <div className="text-sm text-text-secondary capitalize mb-3">{key}</div>
                        <div className="space-y-2">
                          {thresholds.warning && (
                            <div className="flex justify-between items-center">
                              <span className="text-warning-text text-sm">?�️ 경고</span>
                              <span className="text-warning-text font-medium">{thresholds.warning}</span>
                            </div>
                          )}
                          {thresholds.critical && (
                            <div className="flex justify-between items-center">
                              <span className="text-error-text text-sm">?�� ?�험</span>
                              <span className="text-error-text font-medium">{thresholds.critical}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ?�시�??�태 (?��??�이?? */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">?�시�??�태</h3>
                <div className="p-4 bg-background rounded-notion-md text-center">
                  <div className="text-4xl mb-2">?��</div>
                  <p className="text-text-secondary">
                    ?�시�??�서 ?�이??모니?�링 기능??�??�공???�정?�니??
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ?�비 ?�력 ??*/}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">?�비 ?�력</h3>
                {canRequestMaintenance && (
                  <Button
                    size="sm"
                    onClick={() => setShowMaintenanceModal(true)}
                  >
                    ???�비 ?�청
                  </Button>
                )}
              </div>

              {/* ?�비 ?�계 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-background rounded-notion-sm text-center">
                  <div className="text-lg font-bold text-primary">12</div>
                  <div className="text-sm text-text-secondary">�??�비 ?�수</div>
                </div>
                <div className="p-4 bg-background rounded-notion-sm text-center">
                  <div className="text-lg font-bold text-success-text">8</div>
                  <div className="text-sm text-text-secondary">?�방 ?�비</div>
                </div>
                <div className="p-4 bg-background rounded-notion-sm text-center">
                  <div className="text-lg font-bold text-warning-text">4</div>
                  <div className="text-sm text-text-secondary">긴급 ?�리</div>
                </div>
                <div className="p-4 bg-background rounded-notion-sm text-center">
                  <div className="text-lg font-bold text-text-primary">98%</div>
                  <div className="text-sm text-text-secondary">가?�률</div>
                </div>
              </div>

              {/* ?�비 ?�력 목록 (?�시 ?�이?? */}
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-4 bg-background rounded-notion-md border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                          <span className="text-success-text">?��</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">
                            {index === 0 ? '?�기 ?��? �??�일 교체' :
                             index === 1 ? '벨트 교체 ?�업' :
                             index === 2 ? '진동 ?�서 교정' :
                             index === 3 ? '?�각?�스??�?��' : '?�기 ?�점 ?��?'}
                          </h4>
                          <div className="text-sm text-text-secondary mt-1">
                            ?�당?? 김?�비 ???�요?�간: {2 + index}?�간
                          </div>
                          <div className="text-xs text-text-tertiary mt-1">
                            {new Date(Date.now() - (index + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                      </div>
                      <Badge variant={index === 1 || index === 4 ? 'warning' : 'success'}>
                        {index === 1 || index === 4 ? '긴급' : '?�방'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 문서 ??*/}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">관??문서</h3>

              {/* 첨�??�일 */}
              {equipment.attachments && equipment.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipment.attachments.map((attachment, index) => (
                    <div key={index} className="p-4 bg-background rounded-notion-md border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                          <span className="text-primary">?��</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{attachment.fileName}</h4>
                          <div className="text-sm text-text-secondary mt-1">
                            ?�기: {Math.round(attachment.fileSize / 1024)}KB
                          </div>
                          <div className="text-xs text-text-tertiary mt-1">
                            ?�로?? {formatDate(attachment.uploadedDate)}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          ?�운로드
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">?��</div>
                  <p className="text-text-secondary">첨�???문서가 ?�습?�다</p>
                  {canEdit && (
                    <Button size="sm" className="mt-3">
                      문서 ?�로??
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 변�??�력 ??*/}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">변�??�력</h3>
              
              <div className="space-y-4">
                {/* ?�성 ?�벤??*/}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <span className="text-primary">??/span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">?�비 ?�록</div>
                    <div className="text-sm text-text-secondary">
                      ?�스??관리자가 ?�비�??�스?�에 ?�록?�습?�다
                    </div>
                    <div className="text-xs text-text-tertiary">{formatDate(equipment.createdAt)}</div>
                  </div>
                </div>

                {/* ?�태 변�??�벤??(?�시) */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-warning-bg rounded-full flex items-center justify-center">
                    <span className="text-warning-text">?��</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">?�태 변�?/div>
                    <div className="text-sm text-text-secondary">
                      ?�태가 "?�비�??�서 "?�상"?�로 변경되?�습?�다
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('ko-KR')}
                    </div>
                  </div>
                </div>

                {/* ?�보 ?�데?�트 ?�벤??*/}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-background-hover rounded-full flex items-center justify-center">
                    <span className="text-text-secondary">?�️</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">?�보 ?�데?�트</div>
                    <div className="text-sm text-text-secondary">
                      ?�영 ?�라미터가 ?�데?�트?�었?�니??
                    </div>
                    <div className="text-xs text-text-tertiary">{formatDate(equipment.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ?�비 ?�청 모달 */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-notion-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">?�비 ?�청</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?�청 ?�유
                </label>
                <textarea
                  value={maintenanceRequestNotes}
                  onChange={(e) => setMaintenanceRequestNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                  placeholder="?�비가 ?�요???�유�??�력?�세??.."
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline" 
                onClick={() => setShowMaintenanceModal(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleMaintenanceRequest}
                className="flex-1"
              >
                ?�비 ?�청
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}