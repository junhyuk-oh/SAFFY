"use client"

import { useState, useMemo } from "react"
import { Equipment, FacilitySearchParams, Priority, FacilityArea } from "@/lib/types/facility"
import { EquipmentCard } from "./EquipmentCard"
import { Badge } from "@/components/ui/display"
import { Button } from "@/components/ui/button"
import { EQUIPMENT_STATUS } from "@/lib/constants/status"

// ?•ÎπÑ Í∑∏Î¶¨?úÏö© ?ïÎ†¨ ?ÑÎìú ?Ä??
type EquipmentSortField = 'name' | 'installDate' | 'lastMaintenanceDate' | 'nextMaintenanceDate' | 'criticality'

// ?•ÎπÑ Í≤Ä???åÎùºÎØ∏ÌÑ∞ (FacilitySearchParamsÎ•??ïÏû•)
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
  { value: 'all', label: '?ÑÏ≤¥ ?ÅÌÉú' },
  { value: 'operational', label: '?ïÏÉÅ' },
  { value: 'maintenance', label: '?ïÎπÑÏ§? },
  { value: 'repair', label: '?òÎ¶¨Ï§? },
  { value: 'out_of_service', label: 'Í∞Ä?ôÏ§ëÏßÄ' },
  { value: 'decommissioned', label: '?êÍ∏∞' }
]

const criticalityOptions = [
  { value: 'all', label: '?ÑÏ≤¥ Ï§ëÏöî?? },
  { value: 'critical', label: 'Í∏¥Í∏â' },
  { value: 'high', label: '?íÏùå' },
  { value: 'medium', label: 'Î≥¥ÌÜµ' },
  { value: 'low', label: '??ùå' }
]

const typeOptions = [
  { value: 'all', label: '?ÑÏ≤¥ ?†Ìòï' },
  { value: 'Pump', label: '?åÌîÑ' },
  { value: 'Valve', label: 'Î∞∏Î∏å' },
  { value: 'Motor', label: 'Î™®ÌÑ∞' },
  { value: 'Sensor', label: '?ºÏÑú' },
  { value: 'Tank', label: '?±ÌÅ¨' },
  { value: 'Compressor', label: '?ïÏ∂ïÍ∏? },
  { value: 'Heat Exchanger', label: '?¥Íµê?òÍ∏∞' },
  { value: 'Filter', label: '?ÑÌÑ∞' },
  { value: 'Conveyor', label: 'Ïª®Î≤†?¥Ïñ¥' },
  { value: 'Reactor', label: 'Î∞òÏùëÍ∏? },
  { value: 'Boiler', label: 'Î≥¥Ïùº?? },
  { value: 'Fan', label: '?? },
  { value: 'Transformer', label: 'Î≥Ä?ïÍ∏∞' },
  { value: 'Generator', label: 'Î∞úÏ†ÑÍ∏? },
  { value: 'Chiller', label: '?âÍ∞ÅÍ∏? }
]

const locationOptions = [
  { value: 'all', label: '?ÑÏ≤¥ ?ÑÏπò' },
  { value: 'Production Floor', label: '?ùÏÇ∞Ï∏? },
  { value: 'Lab Building', label: '?§Ìóò?? },
  { value: 'Warehouse', label: 'Ï∞ΩÍ≥†' },
  { value: 'Utility Room', label: '?†Ìã∏Î¶¨Ìã∞Î£? },
  { value: 'Chemical Storage', label: '?îÌïôÎ¨ºÏßà ?Ä?•ÏÜå' },
  { value: 'Electrical Room', label: '?ÑÍ∏∞?? },
  { value: 'HVAC Room', label: 'HVAC?? },
  { value: 'Server Room', label: '?úÎ≤Ñ?? }
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

  // ?ÑÌÑ∞Îß?Î∞??ïÎ†¨???•ÎπÑ Î™©Î°ù
  const filteredAndSortedEquipment = useMemo(() => {
    // equipmentÍ∞Ä undefined?¥Í±∞??Î∞∞Ïó¥???ÑÎãå Í≤ΩÏö∞ Îπ?Î∞∞Ïó¥ Î∞òÌôò
    if (!equipment || !Array.isArray(equipment)) {
      return []
    }

    let filtered = [...equipment] // ?êÎ≥∏ Î∞∞Ïó¥???òÏ†ï?òÏ? ?äÍ∏∞ ?ÑÌï¥ Î≥µÏÇ¨

    // Í≤Ä??ÏøºÎ¶¨ ?ÑÌÑ∞Îß?
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

    // ?ÅÌÉú ?ÑÌÑ∞Îß?
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(eq => eq.status === selectedStatus)
    }

    // Ï§ëÏöî???ÑÌÑ∞Îß?
    if (selectedCriticality !== 'all') {
      filtered = filtered.filter(eq => eq.criticality === selectedCriticality)
    }

    // ?†Ìòï ?ÑÌÑ∞Îß?
    if (selectedType !== 'all') {
      filtered = filtered.filter(eq => eq.type === selectedType)
    }

    // ?ÑÏπò ?ÑÌÑ∞Îß?
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(eq => eq.location === selectedLocation)
    }

    // ?ïÎπÑ ?àÏ†ï ?ÑÌÑ∞Îß?
    if (showMaintenanceDue) {
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
      filtered = filtered.filter(eq => {
        if (!eq.nextMaintenanceDate) return false
        const nextMaintenance = new Date(eq.nextMaintenanceDate)
        return nextMaintenance <= thirtyDaysFromNow
      })
    }

    // ?ïÎ†¨
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

  // ?µÍ≥Ñ Í≥ÑÏÇ∞
  const stats = useMemo(() => {
    // equipmentÍ∞Ä undefined?¥Í±∞??Î∞∞Ïó¥???ÑÎãå Í≤ΩÏö∞ Í∏∞Î≥∏Í∞?Î∞òÌôò
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

    // ?ïÎπÑ ?àÏ†ï (30???¥ÎÇ¥)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    const maintenanceDue = equipment.filter(eq => {
      if (!eq.nextMaintenanceDate) return false
      const nextMaintenance = new Date(eq.nextMaintenanceDate)
      return nextMaintenance <= thirtyDaysFromNow
    }).length

    // ?ïÎπÑ ÏßÄ??
    const maintenanceOverdue = equipment.filter(eq => {
      if (!eq.nextMaintenanceDate) return false
      const nextMaintenance = new Date(eq.nextMaintenanceDate)
      return nextMaintenance < now
    }).length

    // Î≥¥Ï¶ù ÎßåÎ£å ?àÏ†ï (30???¥ÎÇ¥)
    const warrantyExpiring = equipment.filter(eq => {
      if (!eq.warrantyExpiry) return false
      const warrantyExpiry = new Date(eq.warrantyExpiry)
      return warrantyExpiry <= thirtyDaysFromNow && warrantyExpiry > now
    }).length

    // Í∏¥Í∏â ?•ÎπÑ
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
      {/* ?§Îçî Î∞??µÍ≥Ñ */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">?•ÎπÑ Í¥ÄÎ¶?/h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>?ÑÏ≤¥ {stats.total}?Ä</span>
            <span>??/span>
            <span className="text-success-text">?ïÏÉÅ {stats.operational}?Ä</span>
            <span>??/span>
            <span className="text-error-text">ÎπÑÍ???{stats.nonOperational}?Ä</span>
            <span>??/span>
            <span className="text-warning-text">?ïÎπÑ?àÏ†ï {stats.maintenanceDue}?Ä</span>
            <span>??/span>
            <span className="text-red-600">Í∏¥Í∏â {stats.critical}?Ä</span>
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
            {viewMode === 'grid' ? '?ìã Î™©Î°ù' : 
             viewMode === 'list' ? '?ó∫Ô∏?ÏßÄ?? : '??Í∑∏Î¶¨??}
          </Button>
          <Button onClick={onAddEquipment}>
            <span className="mr-2">??/span>
            ?•ÎπÑ ?±Î°ù
          </Button>
        </div>
      </div>

      {/* Í≤Ä??Î∞??ÑÌÑ∞ */}
      <div className="bg-background-secondary rounded-notion-md p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="?•ÎπÑÎ™? ÏΩîÎìú, Î™®Îç∏, ?úÏ°∞?? ?úÎ¶¨?ºÎÑòÎ≤?Í≤Ä??.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
            />
          </div>
          <Button type="submit" size="sm">
            ?îç Í≤Ä??
          </Button>
        </form>

        <div className="flex flex-wrap gap-3">
          {/* ?ÅÌÉú ?ÑÌÑ∞ */}
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

          {/* Ï§ëÏöî???ÑÌÑ∞ */}
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

          {/* ?†Ìòï ?ÑÌÑ∞ */}
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

          {/* ?ÑÏπò ?ÑÌÑ∞ */}
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

          {/* ?ïÎ†¨ */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field as EquipmentSortField)
              setSortOrder(order as 'asc' | 'desc')
            }}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            <option value="name-asc">?¥Î¶Ñ??(A-Z)</option>
            <option value="name-desc">?¥Î¶Ñ??(Z-A)</option>
            <option value="criticality-desc">Ï§ëÏöî???íÏ???/option>
            <option value="criticality-asc">Ï§ëÏöî???????/option>
            <option value="nextMaintenanceDate-asc">?ïÎπÑ??Îπ†Î•∏??/option>
            <option value="nextMaintenanceDate-desc">?ïÎπÑ???????/option>
            <option value="installDate-desc">?§Ïπò??ÏµúÏã†??/option>
            <option value="installDate-asc">?§Ïπò???§Îûò?úÏàú</option>
          </select>

          {/* ?ïÎπÑ ?àÏ†ï ?†Í? */}
          <label className="flex items-center space-x-2 px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showMaintenanceDue}
              onChange={(e) => setShowMaintenanceDue(e.target.checked)}
              className="rounded border-border"
            />
            <span>?ïÎπÑ ?àÏ†ïÎß?/span>
          </label>
        </div>
      </div>

      {/* Îπ†Î•∏ ?µÍ≥Ñ Ïπ¥Îìú */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-success-text">{stats.operational}</div>
          <div className="text-sm text-text-secondary">?ïÏÉÅ</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.nonOperational}</div>
          <div className="text-sm text-text-secondary">ÎπÑÍ???/div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-warning-text">{stats.maintenanceDue}</div>
          <div className="text-sm text-text-secondary">?ïÎπÑ?àÏ†ï</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.maintenanceOverdue}</div>
          <div className="text-sm text-text-secondary">?ïÎπÑÏßÄ??/div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-warning-text">{stats.warrantyExpiring}</div>
          <div className="text-sm text-text-secondary">Î≥¥Ï¶ùÎßåÎ£å</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-text-secondary">Í∏¥Í∏â</div>
        </div>
      </div>

      {/* ?•ÎπÑ Î™©Î°ù */}
      {filteredAndSortedEquipment.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">?ôÔ∏è</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchQuery || selectedStatus !== 'all' || selectedCriticality !== 'all' || selectedType !== 'all' || selectedLocation !== 'all' || showMaintenanceDue
              ? 'Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏäµ?àÎã§'
              : '?±Î°ù???•ÎπÑÍ∞Ä ?ÜÏäµ?àÎã§'
            }
          </h3>
          <p className="text-text-secondary mb-4">
            {searchQuery || selectedStatus !== 'all' || selectedCriticality !== 'all' || selectedType !== 'all' || selectedLocation !== 'all' || showMaintenanceDue
              ? '?§Î•∏ Ï°∞Í±¥?ºÎ°ú Í≤Ä?âÌï¥Î≥¥ÏÑ∏??
              : '?àÎ°ú???•ÎπÑÎ•??±Î°ù?¥Î≥¥?∏Ïöî'
            }
          </p>
          {onAddEquipment && (
            <Button onClick={onAddEquipment}>
              <span className="mr-2">??/span>
              ?•ÎπÑ ?±Î°ù
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {filteredAndSortedEquipment.length}Í∞úÏùò ?•ÎπÑÍ∞Ä ?àÏäµ?àÎã§
              {showMaintenanceDue && ' (?ïÎπÑ ?àÏ†ï)'}
            </p>
            <div className="text-xs text-text-tertiary">
              ÎßàÏ?Îß??ÖÎç∞?¥Ìä∏: {new Date().toLocaleDateString('ko-KR')}
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
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?•ÎπÑ</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?†Ìòï</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?ÑÏπò</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?ÅÌÉú</th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">Ï§ëÏöî??/th>
                    <th className="text-left p-4 text-sm font-semibold text-text-primary">?§Ïùå ?ïÎπÑ</th>
                    <th className="text-center p-4 text-sm font-semibold text-text-primary">?ëÏóÖ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedEquipment.map((eq, index) => (
                    <tr key={eq.id} className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-background-secondary'}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{equipmentTypeIcons[eq.type] || '?ôÔ∏è'}</span>
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
                            ?ïÎπÑ?îÏ≤≠
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
              <div className="text-4xl mb-4">?ó∫Ô∏?/div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">ÏßÄ??Î∑?/h3>
              <p className="text-text-secondary">
                ?•ÎπÑ ?ÑÏπòÎ•?ÏßÄ?ÑÏóê???ïÏù∏?????àÎäî Í∏∞Îä•??Í≥??úÍ≥µ???àÏ†ï?ÖÎãà??
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}


// Ï§ëÏöî???§Ï†ï
const criticalityConfig = {
  low: { label: "??ùå" },
  medium: { label: "Î≥¥ÌÜµ" },
  high: { label: "?íÏùå" },
  critical: { label: "Í∏¥Í∏â" }
}

// ?•ÎπÑ ?†Ìòï ?ÑÏù¥ÏΩ?
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