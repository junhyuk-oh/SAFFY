"use client"

import { useState, useMemo } from "react"
import { Equipment, FacilitySearchParams } from "@/lib/types/facility"
import { EquipmentCard } from "./EquipmentCard"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"

interface EquipmentGridProps {
  equipment: Equipment[]
  loading?: boolean
  searchParams?: FacilitySearchParams
  onSearch?: (params: FacilitySearchParams) => void
  onAddEquipment?: () => void
  viewMode?: 'grid' | 'list' | 'map'
  onViewModeChange?: (mode: 'grid' | 'list' | 'map') => void
  onMaintenanceRequest?: (id: string) => void
  onStatusChange?: (id: string, status: Equipment['status']) => void
}

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'operational', label: '정상' },
  { value: 'maintenance', label: '정비중' },
  { value: 'repair', label: '수리중' },
  { value: 'out_of_service', label: '가동중지' },
  { value: 'decommissioned', label: '폐기' }
]

const criticalityOptions = [
  { value: 'all', label: '전체 중요도' },
  { value: 'critical', label: '긴급' },
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' }
]

const typeOptions = [
  { value: 'all', label: '전체 유형' },
  { value: 'Pump', label: '펌프' },
  { value: 'Valve', label: '밸브' },
  { value: 'Motor', label: '모터' },
  { value: 'Sensor', label: '센서' },
  { value: 'Tank', label: '탱크' },
  { value: 'Compressor', label: '압축기' },
  { value: 'Heat Exchanger', label: '열교환기' },
  { value: 'Filter', label: '필터' },
  { value: 'Conveyor', label: '컨베이어' },
  { value: 'Reactor', label: '반응기' },
  { value: 'Boiler', label: '보일러' },
  { value: 'Fan', label: '팬' },
  { value: 'Transformer', label: '변압기' },
  { value: 'Generator', label: '발전기' },
  { value: 'Chiller', label: '냉각기' }
]

const locationOptions = [
  { value: 'all', label: '전체 위치' },
  { value: 'Production Floor', label: '생산층' },
  { value: 'Lab Building', label: '실험동' },
  { value: 'Warehouse', label: '창고' },
  { value: 'Utility Room', label: '유틸리티룸' },
  { value: 'Chemical Storage', label: '화학물질 저장소' },
  { value: 'Electrical Room', label: '전기실' },
  { value: 'HVAC Room', label: 'HVAC실' },
  { value: 'Server Room', label: '서버실' }
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
  const [sortBy, setSortBy] = useState<'name' | 'installDate' | 'lastMaintenanceDate' | 'nextMaintenanceDate' | 'criticality'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showMaintenanceDue, setShowMaintenanceDue] = useState(false)

  // 필터링 및 정렬된 장비 목록
  const filteredAndSortedEquipment = useMemo(() => {
    // equipment가 undefined이거나 배열이 아닌 경우 빈 배열 반환
    if (!equipment || !Array.isArray(equipment)) {
      return []
    }

    let filtered = [...equipment] // 원본 배열을 수정하지 않기 위해 복사

    // 검색 쿼리 필터링
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

    // 상태 필터링
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(eq => eq.status === selectedStatus)
    }

    // 중요도 필터링
    if (selectedCriticality !== 'all') {
      filtered = filtered.filter(eq => eq.criticality === selectedCriticality)
    }

    // 유형 필터링
    if (selectedType !== 'all') {
      filtered = filtered.filter(eq => eq.type === selectedType)
    }

    // 위치 필터링
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(eq => eq.location === selectedLocation)
    }

    // 정비 예정 필터링
    if (showMaintenanceDue) {
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
      filtered = filtered.filter(eq => {
        if (!eq.nextMaintenanceDate) return false
        const nextMaintenance = new Date(eq.nextMaintenanceDate)
        return nextMaintenance <= thirtyDaysFromNow
      })
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

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
          const criticalityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
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

  // 통계 계산
  const stats = useMemo(() => {
    // equipment가 undefined이거나 배열이 아닌 경우 기본값 반환
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

    // 정비 예정 (30일 이내)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    const maintenanceDue = equipment.filter(eq => {
      if (!eq.nextMaintenanceDate) return false
      const nextMaintenance = new Date(eq.nextMaintenanceDate)
      return nextMaintenance <= thirtyDaysFromNow
    }).length

    // 정비 지연
    const maintenanceOverdue = equipment.filter(eq => {
      if (!eq.nextMaintenanceDate) return false
      const nextMaintenance = new Date(eq.nextMaintenanceDate)
      return nextMaintenance < now
    }).length

    // 보증 만료 예정 (30일 이내)
    const warrantyExpiring = equipment.filter(eq => {
      if (!eq.warrantyExpiry) return false
      const warrantyExpiry = new Date(eq.warrantyExpiry)
      return warrantyExpiry <= thirtyDaysFromNow && warrantyExpiry > now
    }).length

    // 긴급 장비
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
        priority: selectedCriticality !== 'all' ? [selectedCriticality as any] : undefined,
        type: selectedType !== 'all' ? [selectedType] : undefined,
        location: selectedLocation !== 'all' ? [selectedLocation as any] : undefined,
        sortBy: sortBy as any,
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
      {/* 헤더 및 통계 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">장비 관리</h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>전체 {stats.total}대</span>
            <span>•</span>
            <span className="text-success-text">정상 {stats.operational}대</span>
            <span>•</span>
            <span className="text-error-text">비가동 {stats.nonOperational}대</span>
            <span>•</span>
            <span className="text-warning-text">정비예정 {stats.maintenanceDue}대</span>
            <span>•</span>
            <span className="text-red-600">긴급 {stats.critical}대</span>
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
            {viewMode === 'grid' ? '📋 목록' : 
             viewMode === 'list' ? '🗺️ 지도' : '⚏ 그리드'}
          </Button>
          <Button onClick={onAddEquipment}>
            <span className="mr-2">➕</span>
            장비 등록
          </Button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-background-secondary rounded-notion-md p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="장비명, 코드, 모델, 제조사, 시리얼넘버 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
            />
          </div>
          <Button type="submit" size="sm">
            🔍 검색
          </Button>
        </form>

        <div className="flex flex-wrap gap-3">
          {/* 상태 필터 */}
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

          {/* 중요도 필터 */}
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

          {/* 유형 필터 */}
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

          {/* 위치 필터 */}
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

          {/* 정렬 */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field as any)
              setSortOrder(order as any)
            }}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            <option value="name-asc">이름순 (A-Z)</option>
            <option value="name-desc">이름순 (Z-A)</option>
            <option value="criticality-desc">중요도 높은순</option>
            <option value="criticality-asc">중요도 낮은순</option>
            <option value="nextMaintenanceDate-asc">정비일 빠른순</option>
            <option value="nextMaintenanceDate-desc">정비일 늦은순</option>
            <option value="installDate-desc">설치일 최신순</option>
            <option value="installDate-asc">설치일 오래된순</option>
          </select>

          {/* 정비 예정 토글 */}
          <label className="flex items-center space-x-2 px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showMaintenanceDue}
              onChange={(e) => setShowMaintenanceDue(e.target.checked)}
              className="rounded border-border"
            />
            <span>정비 예정만</span>
          </label>
        </div>
      </div>

      {/* 빠른 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-success-text">{stats.operational}</div>
          <div className="text-sm text-text-secondary">정상</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.nonOperational}</div>
          <div className="text-sm text-text-secondary">비가동</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-warning-text">{stats.maintenanceDue}</div>
          <div className="text-sm text-text-secondary">정비예정</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.maintenanceOverdue}</div>
          <div className="text-sm text-text-secondary">정비지연</div>
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

      {/* 장비 목록 */}
      {filteredAndSortedEquipment.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchQuery || selectedStatus !== 'all' || selectedCriticality !== 'all' || selectedType !== 'all' || selectedLocation !== 'all' || showMaintenanceDue
              ? '검색 결과가 없습니다'
              : '등록된 장비가 없습니다'
            }
          </h3>
          <p className="text-text-secondary mb-4">
            {searchQuery || selectedStatus !== 'all' || selectedCriticality !== 'all' || selectedType !== 'all' || selectedLocation !== 'all' || showMaintenanceDue
              ? '다른 조건으로 검색해보세요'
              : '새로운 장비를 등록해보세요'
            }
          </p>
          {onAddEquipment && (
            <Button onClick={onAddEquipment}>
              <span className="mr-2">➕</span>
              장비 등록
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {filteredAndSortedEquipment.length}개의 장비가 있습니다
              {showMaintenanceDue && ' (정비 예정)'}
            </p>
            <div className="text-xs text-text-tertiary">
              마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}
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
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">장비</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">유형</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">위치</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">상태</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">중요도</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">다음 정비</th>
                    <th className="text-center p-4 text-sm font-semibold text-text-primary">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedEquipment.map((eq, index) => (
                    <tr key={eq.id} className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-background-secondary'}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{equipmentTypeIcons[eq.type] || '⚙️'}</span>
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
                          {statusConfig[eq.status]?.label || eq.status}
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
                            정비요청
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
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">지도 뷰</h3>
              <p className="text-text-secondary">
                장비 위치를 지도에서 확인할 수 있는 기능이 곧 제공될 예정입니다.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// 상태 설정
const statusConfig = {
  operational: { label: "정상" },
  maintenance: { label: "정비중" },
  repair: { label: "수리중" },
  out_of_service: { label: "가동중지" },
  decommissioned: { label: "폐기" }
}

// 중요도 설정
const criticalityConfig = {
  low: { label: "낮음" },
  medium: { label: "보통" },
  high: { label: "높음" },
  critical: { label: "긴급" }
}

// 장비 유형 아이콘
const equipmentTypeIcons: Record<string, string> = {
  "Pump": "⚪",
  "Valve": "🔘",
  "Motor": "🔋",
  "Sensor": "📡",
  "Tank": "🏺",
  "Compressor": "🌀",
  "Heat Exchanger": "🔥",
  "Filter": "🗂️",
  "Conveyor": "➡️",
  "Reactor": "⚗️",
  "Boiler": "🔥",
  "Fan": "🌪️",
  "Transformer": "⚡",
  "Generator": "🔌",
  "Chiller": "❄️"
}