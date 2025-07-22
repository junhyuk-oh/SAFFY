"use client"

import Link from "next/link"
import { useState } from "react"
import { Equipment } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display"
import { EQUIPMENT_STATUS } from "@/lib/constants/status"
import { formatDateTime } from "@/lib/utils/date"

interface EquipmentCardProps {
  equipment: Equipment
  onStatusChange?: (id: string, status: Equipment['status']) => void
  onMaintenanceRequest?: (id: string) => void
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

export function EquipmentCard({
  equipment,
  onStatusChange,
  onMaintenanceRequest
}: EquipmentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const statusInfo = EQUIPMENT_STATUS[equipment.status]
  const criticalityInfo = criticalityConfig[equipment.criticality]
  const equipmentIcon = equipmentTypeIcons[equipment.type] || "?�️"


  // ?�음 ?�비까�? ?��? ?�수 계산
  const getDaysUntilMaintenance = () => {
    if (!equipment.nextMaintenanceDate) return null
    
    const now = new Date()
    const nextMaintenance = new Date(equipment.nextMaintenanceDate)
    const diffTime = nextMaintenance.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}??경과`, urgent: true, overdue: true }
    if (diffDays === 0) return { text: "?�늘", urgent: true, overdue: false }
    if (diffDays <= 7) return { text: `${diffDays}???�음`, urgent: true, overdue: false }
    if (diffDays <= 30) return { text: `${diffDays}???�음`, urgent: false, overdue: false }
    return { text: `${diffDays}???�음`, urgent: false, overdue: false }
  }

  // 보증기간 ?�인
  const getWarrantyStatus = () => {
    if (!equipment.warrantyExpiry) return null
    
    const now = new Date()
    const warrantyExpiry = new Date(equipment.warrantyExpiry)
    const diffTime = warrantyExpiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: "보증 만료", expired: true }
    if (diffDays <= 30) return { text: `보증 ${diffDays}???�음`, expiring: true }
    return { text: "보증 ?�효", valid: true }
  }

  const maintenanceInfo = getDaysUntilMaintenance()
  const warrantyInfo = getWarrantyStatus()

  // ?�영 ?�라미터 ?�태 ?�인
  const getParameterStatus = () => {
    const alerts = []
    if (equipment.alertThresholds && Object.keys(equipment.alertThresholds).length > 0) {
      // ?�제로는 ?�시�??�서 ?�이?��? 비교?�야 ??
      // ?�기?�는 ?�시�??��? 경고 ?�태�??��??�이??
      if (Math.random() > 0.8) alerts.push('?�도 주의')
      if (Math.random() > 0.9) alerts.push('?�력 경고')
      if (Math.random() > 0.95) alerts.push('진동 ?�상')
    }
    return alerts
  }

  const parameterAlerts = getParameterStatus()

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (action === 'maintenance' && onMaintenanceRequest) {
      onMaintenanceRequest(equipment.id)
    } else if (action === 'status_change' && onStatusChange) {
      // ?�제로는 ?�태 ?�택 모달?�나 ?�롭?�운??보여줘야 ??
      console.log(`Status change for equipment ${equipment.id}`)
    } else {
      console.log(`${action} action for equipment ${equipment.id}`)
    }
  }

  return (
    <Link href={`/facility/equipment/${equipment.id}`}>
      <div 
        className={`bg-background-secondary rounded-notion-md p-5 border border-border border-l-4 ${statusInfo.borderColor} transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-border-hover cursor-pointer relative`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ?�더 ?�역 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-3xl">{equipmentIcon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2 mb-1">
                {equipment.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
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
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span>{equipment.manufacturer}</span>
                <span>??/span>
                <span>모델: {equipment.model}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-3">
            <Badge 
              variant={equipment.criticality === 'critical' ? 'destructive' : 
                     equipment.criticality === 'high' ? 'warning' : 'secondary'}
              className="text-xs"
            >
              {criticalityInfo.label}
            </Badge>
            <Badge 
              variant={equipment.status === 'operational' ? 'success' :
                     equipment.status === 'repair' || equipment.status === 'out_of_service' ? 'destructive' :
                     equipment.status === 'maintenance' ? 'warning' : 'secondary'}
              className="text-xs"
            >
              <span className="mr-1">{statusInfo.icon}</span>
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* ?�림 �?경고 */}
        {parameterAlerts.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {parameterAlerts.map((alert, index) => (
              <span key={index} className="text-xs text-error-text bg-error-bg px-2 py-1 rounded-md">
                ?�️ {alert}
              </span>
            ))}
          </div>
        )}

        {/* ?�비 ?�보 */}
        {maintenanceInfo && (
          <div className="flex items-center justify-between mb-3 p-3 bg-background rounded-notion-sm">
            <div>
              <div className="text-sm font-medium text-text-primary">?�음 ?�비</div>
              <div className="text-xs text-text-secondary">
                {equipment.nextMaintenanceDate ? formatDateTime(equipment.nextMaintenanceDate, { includeTime: false }) : '-'}
              </div>
            </div>
            <div className={`text-sm font-medium text-right ${
              maintenanceInfo.overdue ? 'text-error-text' : 
              maintenanceInfo.urgent ? 'text-warning-text' : 'text-text-primary'
            }`}>
              {maintenanceInfo.text}
            </div>
          </div>
        )}

        {/* ?�영 ?�라미터 미리보기 */}
        {equipment.operatingParameters && Object.keys(equipment.operatingParameters).length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Object.entries(equipment.operatingParameters).slice(0, 4).map(([key, value]: [string, any]) => (
              <div key={key} className="text-center p-2 bg-background rounded-notion-sm">
                <div className="text-xs text-text-secondary capitalize">{key}</div>
                <div className="text-sm font-medium text-text-primary">
                  {typeof value === 'object' && value?.min !== undefined
                    ? `${value.min}-${value.max} ${value.unit || ''}`
                    : String(value)
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 보증 ?�보 */}
        {warrantyInfo && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-text-secondary">보증 ?�태</span>
            <span className={`text-xs font-medium ${
              warrantyInfo.expired ? 'text-error-text' :
              warrantyInfo.expiring ? 'text-warning-text' : 'text-success-text'
            }`}>
              {warrantyInfo.text}
            </span>
          </div>
        )}

        {/* ?�단 ?�보 */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span>?�치: {formatDateTime(equipment.installDate, { includeTime: false })}</span>
            <span>??/span>
            <span>S/N: {equipment.serialNumber.slice(-6)}</span>
          </div>
          
          {equipment.lastMaintenanceDate && (
            <span className="text-xs text-text-secondary">
              최종 ?�비: {equipment.lastMaintenanceDate ? formatDateTime(equipment.lastMaintenanceDate, { includeTime: false }) : '-'}
            </span>
          )}
        </div>

        {/* Quick Actions (?�버 ???�시) */}
        {isHovered && (
          <div className="absolute top-3 right-3 bg-background rounded-notion-sm shadow-md border border-border p-1 flex items-center gap-1">
            <button
              onClick={(e) => handleAction(e, 'view')}
              className="p-1.5 hover:bg-background-hover rounded-notion-sm transition-colors"
              title="?�세보기"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <button
              onClick={(e) => handleAction(e, 'maintenance')}
              className="p-1.5 hover:bg-warning-bg rounded-notion-sm transition-colors group"
              title="?�비 ?�청"
            >
              <svg className="w-4 h-4 text-text-secondary group-hover:text-warning-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            <button
              onClick={(e) => handleAction(e, 'edit')}
              className="p-1.5 hover:bg-background-hover rounded-notion-sm transition-colors"
              title="?�집"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={(e) => handleAction(e, 'status_change')}
              className="p-1.5 hover:bg-background-hover rounded-notion-sm transition-colors"
              title="?�태 변�?
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={(e) => handleAction(e, 'history')}
              className="p-1.5 hover:bg-background-hover rounded-notion-sm transition-colors"
              title="?�력 보기"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        )}

        {/* 긴급 ?�비 ?�시 */}
        {equipment.criticality === 'critical' && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            긴급
          </div>
        )}

        {/* ?�비 지??경고 */}
        {maintenanceInfo?.overdue && (
          <div className="absolute -top-2 -left-2 bg-error text-white text-xs px-2 py-1 rounded-full font-semibold">
            ?�비 지??
          </div>
        )}

        {/* ?�림 ?�이�?*/}
        {parameterAlerts.length > 0 && (
          <div className="absolute top-2 left-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
            {parameterAlerts.length}
          </div>
        )}
      </div>
    </Link>
  )
}