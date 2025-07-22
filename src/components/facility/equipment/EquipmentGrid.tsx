"use client"

import { useState, useMemo } from "react"
import { Equipment, FacilitySearchParams, Priority, FacilityArea } from "@/lib/types/facility"
import { EquipmentCard } from "./EquipmentCard"
import { Badge } from "@/components/ui/display"
import { Button } from "@/components/ui/button"
import { EQUIPMENT_STATUS } from "@/lib/constants/status"

// ?�비 그리?�용 ?�렬 ?�드 ?�??
type EquipmentSortField = 'name' | 'installDate' | 'lastMaintenanceDate' | 'nextMaintenanceDate' | 'criticality'

// ?�비 검???�라미터 (FacilitySearchParams�??�장)
interface EquipmentSearchParams extends Omit<FacilitySearchParams, 'sortBy'> {
  sortBy?: EquipmentSortField
}

interface EquipmentGridProps {
  equipment: Equipment[]
  loading?: boolean
  searchParams?: EquipmentSearchParams
  onSearch?: (params: EquipmentSearchParams) => void
  onAddEquipment?: () => void
  viewMode?: 'grid' | 'list' | 'map'
  onViewModeChange?: (mode: 'grid' | 'list' | 'map') => void
  onMaintenanceRequest?: (id: string) => void
  onStatusChange?: (id: string, status: Equipment['status']) => void
}

const statusOptions = [
  { value: 'all', label: '?�체 ?�태' },
  { value: 'operational', label: '?�상' },
  { value: 'maintenance', label: '?�비�? },
  { value: 'repair', label: '?�리�? },
  { value: 'out_of_service', label: '가?�중지' },
  { value: 'decommissioned', label: '?�기' }
]

const criticalityOptions = [
  { value: 'all', label: '?�체 중요?? },
  { value: 'critical', label: '긴급' },
  { value: 'high', label: '?�음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '??��' }
]

const typeOptions = [
  { value: 'all', label: '?�체 ?�형' },
  { value: 'Pump', label: '?�프' },
  { value: 'Valve', label: '밸브' },
  { value: 'Motor', label: '모터' },
  { value: 'Sensor', label: '?�서' },
  { value: 'Tank', label: '?�크' },
  { value: 'Compressor', label: '?�축�? },
  { value: 'Heat Exchanger', label: '?�교?�기' },
  { value: 'Filter', label: '?�터' },
  { value: 'Conveyor', label: '컨베?�어' },
  { value: 'Reactor', label: '반응�? },
  { value: 'Boiler', label: '보일?? },
  { value: 'Fan', label: '?? },
  { value: 'Transformer', label: '변?�기' },
  { value: 'Generator', label: '발전�? },
  { value: 'Chiller', label: '?�각�? }
]

const locationOptions = [
  { value: 'all', label: '?�체 ?�치' },
  { value: 'Production Floor', label: '?�산�? },
  { value: 'Lab Building', label: '?�험?? },
  { value: 'Warehouse', label: '창고' },
  { value: 'Utility Room', label: '?�틸리티�? },
  { value: 'Chemical Storage', label: '?�학물질 ?�?�소' },
  { value: 'Electrical Room', label: '?�기?? },
  { value: 'HVAC Room', label: 'HVAC?? },
  { value: 'Server Room', label: '?�버?? }
]

export function EquipmentGrid({
  equipment,
  loading = false,
  searchParams = {},
  onSearch,
  onAddEquipment,
  viewMode = 'grid',
  onViewModeChange,
  onMaintenanceRequest,
  onStatusChange
}: EquipmentGridProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<EquipmentSortField>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showMaintenanceDue, setShowMaintenanceDue] = useState(false)

  // ?�터�?�??�렬???�비 목록
  const filteredAndSortedEquipment = useMemo(() => {
    // equipment가 undefined?�거??배열???�닌 경우 �?배열 반환
    if (!equipment || !Array.isArray(equipment)) {
      return []
    }

    let filtered = [...equipment] // ?�본 배열???�정?��? ?�기 ?�해 복사

    // 검??쿼리 ?�터�?
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(eq => 
        eq.name.toLowerCase().includes(query) ||
        eq.code.toLowerCase().includes(query) ||
        eq.type.toLowerCase().includes(query) ||
        eq.manufacturer.toLowerCase().includes(query) ||
        eq.model.toLowerCase().includes(query) ||
        eq.location.toLowerCase().includes(query) ||
        eq.serialNumber.toLowerCase().includes(query)
      )
    }

    // ?�태 ?�터�?
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(eq => eq.status === selectedStatus)
    }

    // 중요???�터�?
    if (selectedCriticality !== 'all') {
      filtered = filtered.filter(eq => eq.criticality === selectedCriticality)
    }

    // ?�형 ?�터�?
    if (selectedType !== 'all') {
      filtered = filtered.filter(eq => eq.type === selectedType)
    }

    // ?�치 ?�터�?
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(eq => eq.location === selectedLocation)
    }

    // ?�비 ?�정 ?�터�?
    if (showMaintenanceDue) {
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
      filtered = filtered.filter(eq => {
        if (!eq.nextMaintenanceDate) return false
        const nextMaintenance = new Date(eq.nextMaintenanceDate)
        return nextMaintenance <= thirtyDaysFromNow
      })
    }

    // ?�렬
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'installDate':
          aValue = new Date(a.installDate).getTime()
          bValue = new Date(b.installDate).getTime()
          break
        case 'lastMaintenanceDate':
          aValue = a.lastMaintenanceDate ? new Date(a.lastMaintenanceDate).getTime() : 0
          bValue = b.lastMaintenanceDate ? new Date(b.lastMaintenanceDate).getTime() : 0
          break
        case 'nextMaintenanceDate':
          aValue = a.nextMaintenanceDate ? new Date(a.nextMaintenanceDate).getTime() : Infinity
          bValue = b.nextMaintenanceDate ? new Date(b.nextMaintenanceDate).getTime() : Infinity
          break
        case 'criticality':
          const criticalityOrder: Record<Equipment['criticality'], number> = { 
            critical: 4, 
            high: 3, 
            medium: 2, 
            low: 1 
          }
          aValue = criticalityOrder[a.criticality]
          bValue = criticalityOrder[b.criticality]
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [equipment, searchQuery, selectedStatus, selectedCriticality, selectedType, selectedLocation, showMaintenanceDue, sortBy, sortOrder])

  // ?�계 계산
  const stats = useMemo(() => {
    // equipment가 undefined?�거??배열???�닌 경우 기본�?반환
    if (!equipment || !Array.isArray(equipment)) {
      return {
        total: 0,
        byStatus: {},
        maintenanceDue: 0,
        maintenanceOverdue: 0,
        warrantyExpiring: 0,
        critical: 0,
        operational: 0,
        nonOperational: 0
      }
    }

    const total = equipment.length
    const byStatus = equipment.reduce((acc, eq) => {
      acc[eq.status] = (acc[eq.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // ?�비 ?�정 (30???�내)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    const maintenanceDue = equipment.filter(eq => {
      if (!eq.nextMaintenanceDate) return false
      const nextMaintenance = new Date(eq.nextMaintenanceDate)
      return nextMaintenance <= thirtyDaysFromNow
    }).length

    // ?�비 지??
    const maintenanceOverdue = equipment.filter(eq => {
      if (!eq.nextMaintenanceDate) return false
      const nextMaintenance = new Date(eq.nextMaintenanceDate)
      return nextMaintenance < now
    }).length

    // 보증 만료 ?�정 (30???�내)
    const warrantyExpiring = equipment.filter(eq => {
      if (!eq.warrantyExpiry) return false
      const warrantyExpiry = new Date(eq.warrantyExpiry)
      return warrantyExpiry <= thirtyDaysFromNow && warrantyExpiry > now
    }).length

    // 긴급 ?�비
    const critical = equipment.filter(eq => eq.criticality === 'critical').length

    return {
      total,
      byStatus,
      maintenanceDue,
      maintenanceOverdue,
      warrantyExpiring,
      critical,
      operational: byStatus.operational || 0,
      nonOperational: total - (byStatus.operational || 0)
    }
  }, [equipment])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({
        query: searchQuery,
        status: selectedStatus !== 'all' ? [selectedStatus] : undefined,
        priority: selectedCriticality !== 'all' ? [selectedCriticality as Priority] : undefined,
        type: selectedType !== 'all' ? [selectedType] : undefined,
        location: selectedLocation !== 'all' ? [selectedLocation as FacilityArea] : undefined,
        sortBy,
        sortOrder
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-background-hover rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-background-hover rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-background-hover rounded-notion-md animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ?�더 �??�계 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">?�비 관�?/h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>?�체 {stats.total}?�</span>
            <span>??/span>
            <span className="text-success-text">?�상 {stats.operational}?�</span>
            <span>??/span>
            <span className="text-error-text">비�???{stats.nonOperational}?�</span>
            <span>??/span>
            <span className="text-warning-text">?�비?�정 {stats.maintenanceDue}?�</span>
            <span>??/span>
            <span className="text-red-600">긴급 {stats.critical}?�</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange?.(
              viewMode === 'grid' ? 'list' : 
              viewMode === 'list' ? 'map' : 'grid'
            )}
          >
            {viewMode === 'grid' ? '?�� 목록' : 
             viewMode === 'list' ? '?���?지?? : '??그리??}
          </Button>
          <Button onClick={onAddEquipment}>
            <span className="mr-2">??/span>
            ?�비 ?�록
          </Button>
        </div>
      </div>

      {/* 검??�??�터 */}
      <div className="bg-background-secondary rounded-notion-md p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="?�비�? 코드, 모델, ?�조?? ?�리?�넘�?검??.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
            />
          </div>
          <Button type="submit" size="sm">
            ?�� 검??
          </Button>
        </form>

        <div className="flex flex-wrap gap-3">
          {/* ?�태 ?�터 */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* 중요???�터 */}
          <select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            {criticalityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* ?�형 ?�터 */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* ?�치 ?�터 */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* ?�렬 */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field as EquipmentSortField)
              setSortOrder(order as 'asc' | 'desc')
            }}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            <option value="name-asc">?�름??(A-Z)</option>
            <option value="name-desc">?�름??(Z-A)</option>
            <option value="criticality-desc">중요???��???/option>
            <option value="criticality-asc">중요???????/option>
            <option value="nextMaintenanceDate-asc">?�비??빠른??/option>
            <option value="nextMaintenanceDate-desc">?�비???????/option>
            <option value="installDate-desc">?�치??최신??/option>
            <option value="installDate-asc">?�치???�래?�순</option>
          </select>

          {/* ?�비 ?�정 ?��? */}
          <label className="flex items-center space-x-2 px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showMaintenanceDue}
              onChange={(e) => setShowMaintenanceDue(e.target.checked)}
              className="rounded border-border"
            />
            <span>?�비 ?�정�?/span>
          </label>
        </div>
      </div>

      {/* 빠른 ?�계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-success-text">{stats.operational}</div>
          <div className="text-sm text-text-secondary">?�상</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.nonOperational}</div>
          <div className="text-sm text-text-secondary">비�???/div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-warning-text">{stats.maintenanceDue}</div>
          <div className="text-sm text-text-secondary">?�비?�정</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.maintenanceOverdue}</div>
          <div className="text-sm text-text-secondary">?�비지??/div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-warning-text">{stats.warrantyExpiring}</div>
          <div className="text-sm text-text-secondary">보증만료</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-text-secondary">긴급</div>
        </div>
      </div>

      {/* ?�비 목록 */}
      {filteredAndSortedEquipment.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">?�️</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchQuery || selectedStatus !== 'all' || selectedCriticality !== 'all' || selectedType !== 'all' || selectedLocation !== 'all' || showMaintenanceDue
              ? '검??결과가 ?�습?�다'
              : '?�록???�비가 ?�습?�다'
            }
          </h3>
          <p className="text-text-secondary mb-4">
            {searchQuery || selectedStatus !== 'all' || selectedCriticality !== 'all' || selectedType !== 'all' || selectedLocation !== 'all' || showMaintenanceDue
              ? '?�른 조건?�로 검?�해보세??
              : '?�로???�비�??�록?�보?�요'
            }
          </p>
          {onAddEquipment && (
            <Button onClick={onAddEquipment}>
              <span className="mr-2">??/span>
              ?�비 ?�록
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {filteredAndSortedEquipment.length}개의 ?�비가 ?�습?�다
              {showMaintenanceDue && ' (?�비 ?�정)'}
            </p>
            <div className="text-xs text-text-tertiary">
              마�?�??�데?�트: {new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedEquipment.map((eq) => (
                <EquipmentCard
                  key={eq.id}
                  equipment={eq}
                  onStatusChange={onStatusChange}
                  onMaintenanceRequest={onMaintenanceRequest}
                />
              ))}
            </div>
          ) : viewMode === 'list' ? (
            <div className="bg-background-secondary rounded-notion-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-background-hover">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?�비</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?�형</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?�치</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?�태</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">중요??/th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?�음 ?�비</th>
                    <th className="text-center p-4 text-sm font-semibold text-text-primary">?�업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedEquipment.map((eq, index) => (
                    <tr key={eq.id} className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-background-secondary'}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{equipmentTypeIcons[eq.type] || '?�️'}</span>
                          <div>
                            <div className="font-medium text-text-primary">{eq.name}</div>
                            <div className="text-sm text-text-secondary">#{eq.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-text-primary">{eq.type}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-text-primary">{eq.location}</div>
                        {eq.subLocation && (
                          <div className="text-xs text-text-secondary">{eq.subLocation}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={eq.status === 'operational' ? 'success' :
                                 eq.status === 'repair' || eq.status === 'out_of_service' ? 'destructive' :
                                 eq.status === 'maintenance' ? 'warning' : 'secondary'}
                        >
                          {EQUIPMENT_STATUS[eq.status]?.label || eq.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={eq.criticality === 'critical' ? 'destructive' : 
                                 eq.criticality === 'high' ? 'warning' : 'secondary'}
                        >
                          {criticalityConfig[eq.criticality]?.label || eq.criticality}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {eq.nextMaintenanceDate ? (
                          <div className="text-sm text-text-primary">
                            {new Date(eq.nextMaintenanceDate).toLocaleDateString('ko-KR')}
                          </div>
                        ) : (
                          <span className="text-sm text-text-secondary">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onMaintenanceRequest?.(eq.id)}
                            className="text-xs"
                          >
                            ?�비?�청
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Map view placeholder
            <div className="bg-background-secondary rounded-notion-md p-12 text-center">
              <div className="text-4xl mb-4">?���?/div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">지??�?/h3>
              <p className="text-text-secondary">
                ?�비 ?�치�?지?�에???�인?????�는 기능??�??�공???�정?�니??
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}


// 중요???�정
const criticalityConfig = {
  low: { label: "??��" },
  medium: { label: "보통" },
  high: { label: "?�음" },
  critical: { label: "긴급" }
}

// ?�비 ?�형 ?�이�?
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