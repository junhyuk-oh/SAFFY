"use client"

import { useState, useMemo } from "react"
import { FacilityAlert, FacilitySearchParams, AlertSeverity } from "@/lib/types/facility"
import { AlertItem } from "./AlertItem"
import { Badge } from "@/components/ui/display"
import { Button } from "@/components/ui/button"

// ?�림 ?�터???�렬 ?�드 ?�??
type AlertSortField = 'detectedDate' | 'severity' | 'status' | 'category'

// ?�림 검???�라미터 (FacilitySearchParams�??�장)
interface AlertSearchParams extends Omit<FacilitySearchParams, 'sortBy'> {
  sortBy?: AlertSortField
}

interface AlertCenterProps {
  alerts: FacilityAlert[]
  loading?: boolean
  searchParams?: AlertSearchParams
  onSearch?: (params: AlertSearchParams) => void
  onAcknowledge?: (id: string, notes?: string) => void
  onResolve?: (id: string, resolution: string, actionsTaken: string[]) => void
  onEscalate?: (id: string) => void
  onBulkAction?: (ids: string[], action: 'acknowledge' | 'resolve' | 'escalate') => void
  canAcknowledge?: boolean
  canResolve?: boolean
  canEscalate?: boolean
  showBulkActions?: boolean
}

const severityOptions = [
  { value: 'all', label: '?�체 ?�각?? },
  { value: 'emergency', label: '비상' },
  { value: 'critical', label: '긴급' },
  { value: 'high', label: '?�음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '??��' }
]

const statusOptions = [
  { value: 'all', label: '?�체 ?�태' },
  { value: 'active', label: '?�성' },
  { value: 'acknowledged', label: '?�인?? },
  { value: 'resolved', label: '?�결?? },
  { value: 'escalated', label: '?�급보고' },
  { value: 'false_positive', label: '?�탐지' }
]

const categoryOptions = [
  { value: 'all', label: '?�체 카테고리' },
  { value: 'safety', label: '?�전' },
  { value: 'equipment', label: '?�비' },
  { value: 'environmental', label: '?�경' },
  { value: 'security', label: '보안' },
  { value: 'operational', label: '?�영' },
  { value: 'compliance', label: '규정준?? }
]

const sourceOptions = [
  { value: 'all', label: '?�체 ?�스' },
  { value: 'ai_system', label: 'AI ?�스?? },
  { value: 'sensor', label: '?�서' },
  { value: 'manual', label: '?�동' },
  { value: 'inspection', label: '?��?' },
  { value: 'maintenance', label: '?�비' },
  { value: 'external', label: '?��?' }
]

export function AlertCenter({
  alerts,
  loading = false,
  searchParams = {},
  onSearch,
  onAcknowledge,
  onResolve,
  onEscalate,
  onBulkAction,
  canAcknowledge = false,
  canResolve = false,
  canEscalate = false,
  showBulkActions = false
}: AlertCenterProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<AlertSortField>('detectedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showOnlyActive, setShowOnlyActive] = useState(true)
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed')

  // ?�터�?�??�렬???�림 목록
  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alerts

    // ?�성 ?�림�??�시 ?�션
    if (showOnlyActive) {
      filtered = filtered.filter(alert => alert.status === 'active' || alert.status === 'acknowledged')
    }

    // 검??쿼리 ?�터�?
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(query) ||
        alert.message.toLowerCase().includes(query) ||
        alert.location.toLowerCase().includes(query) ||
        alert.equipmentName?.toLowerCase().includes(query) ||
        alert.category.toLowerCase().includes(query) ||
        alert.type.toLowerCase().includes(query)
      )
    }

    // ?�각???�터�?
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity)
    }

    // ?�태 ?�터�?
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === selectedStatus)
    }

    // 카테고리 ?�터�?
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(alert => alert.category === selectedCategory)
    }

    // ?�스 ?�터�?
    if (selectedSource !== 'all') {
      filtered = filtered.filter(alert => alert.source === selectedSource)
    }

    // ?�렬
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'detectedDate':
          aValue = new Date(a.detectedDate).getTime()
          bValue = new Date(b.detectedDate).getTime()
          break
        case 'severity':
          const severityOrder: Record<FacilityAlert['severity'], number> = { 
            emergency: 5, 
            critical: 4, 
            high: 3, 
            medium: 2, 
            low: 1 
          }
          aValue = severityOrder[a.severity]
          bValue = severityOrder[b.severity]
          break
        case 'status':
          const statusOrder: Record<FacilityAlert['status'], number> = { 
            active: 4, 
            acknowledged: 3, 
            escalated: 2, 
            resolved: 1, 
            false_positive: 0 
          }
          aValue = statusOrder[a.status]
          bValue = statusOrder[b.status]
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
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
  }, [alerts, searchQuery, selectedSeverity, selectedStatus, selectedCategory, selectedSource, showOnlyActive, sortBy, sortOrder])

  // ?�계 계산
  const stats = useMemo(() => {
    const total = alerts.length
    const active = alerts.filter(alert => alert.status === 'active').length
    const acknowledged = alerts.filter(alert => alert.status === 'acknowledged').length
    const resolved = alerts.filter(alert => alert.status === 'resolved').length
    const escalated = alerts.filter(alert => alert.status === 'escalated').length

    const bySeverity = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byCategory = alerts.reduce((acc, alert) => {
      acc[alert.category] = (acc[alert.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // 최근 24?�간 ???�림
    const last24Hours = alerts.filter(alert => {
      const alertTime = new Date(alert.detectedDate)
      const now = new Date()
      const diffTime = now.getTime() - alertTime.getTime()
      const diffHours = diffTime / (1000 * 60 * 60)
      return diffHours <= 24
    }).length

    // AI ?�성 ?�림
    const aiGenerated = alerts.filter(alert => alert.source === 'ai_system').length

    // ?�균 ?�결 ?�간 계산 (?�결???�림�?
    const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved' && alert.resolvedDate)
    const avgResolutionTime = resolvedAlerts.length > 0 
      ? Math.round(resolvedAlerts.reduce((sum, alert) => {
          const detected = new Date(alert.detectedDate)
          const resolved = new Date(alert.resolvedDate!)
          return sum + (resolved.getTime() - detected.getTime()) / (1000 * 60)
        }, 0) / resolvedAlerts.length)
      : 0

    return {
      total,
      active,
      acknowledged,
      resolved,
      escalated,
      bySeverity,
      byCategory,
      last24Hours,
      aiGenerated,
      avgResolutionTime,
      criticalActive: alerts.filter(alert => 
        (alert.severity === 'critical' || alert.severity === 'emergency') && 
        (alert.status === 'active' || alert.status === 'acknowledged')
      ).length
    }
  }, [alerts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({
        query: searchQuery,
        severity: selectedSeverity !== 'all' ? [selectedSeverity as AlertSeverity] : undefined,
        status: selectedStatus !== 'all' ? [selectedStatus] : undefined,
        category: selectedCategory !== 'all' ? [selectedCategory] : undefined,
        sortBy,
        sortOrder
      })
    }
  }

  const handleSelectAll = () => {
    if (selectedAlerts.size === filteredAndSortedAlerts.length) {
      setSelectedAlerts(new Set())
    } else {
      setSelectedAlerts(new Set(filteredAndSortedAlerts.map(alert => alert.id)))
    }
  }

  const handleSelectAlert = (alertId: string) => {
    const newSelected = new Set(selectedAlerts)
    if (newSelected.has(alertId)) {
      newSelected.delete(alertId)
    } else {
      newSelected.add(alertId)
    }
    setSelectedAlerts(newSelected)
  }

  const handleBulkAction = (action: 'acknowledge' | 'resolve' | 'escalate') => {
    if (onBulkAction && selectedAlerts.size > 0) {
      onBulkAction(Array.from(selectedAlerts), action)
      setSelectedAlerts(new Set())
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-background-hover rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-background-hover rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-background-hover rounded-notion-md animate-pulse"></div>
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
          <h2 className="text-2xl font-bold text-text-primary mb-2">?�림 ?�터</h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>?�체 {stats.total}�?/span>
            <span>??/span>
            <span className="text-error-text">?�성 {stats.active}�?/span>
            <span>??/span>
            <span className="text-warning-text">?�인 {stats.acknowledged}�?/span>
            <span>??/span>
            <span className="text-red-600">긴급 {stats.criticalActive}�?/span>
            <span>??/span>
            <span className="text-success-text">?�결 {stats.resolved}�?/span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
          >
            {viewMode === 'detailed' ? '?�� 간략?? : '?�� ?�세??}
          </Button>
          {stats.active > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {stats.active}�??�림
            </Badge>
          )}
        </div>
      </div>

      {/* 검??�??�터 */}
      <div className="bg-background-secondary rounded-notion-md p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="?�림 ?�목, 메시지, ?�치, ?�비�?검??.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
            />
          </div>
          <Button type="submit" size="sm">
            ?�� 검??
          </Button>
        </form>

        <div className="flex flex-wrap gap-3 items-center">
          {/* ?�각???�터 */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

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

          {/* 카테고리 ?�터 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* ?�스 ?�터 */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            {sourceOptions.map((option) => (
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
              setSortBy(field as AlertSortField)
              setSortOrder(order as 'asc' | 'desc')
            }}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            <option value="detectedDate-desc">최신??/option>
            <option value="detectedDate-asc">?�래?�순</option>
            <option value="severity-desc">?�각???��???/option>
            <option value="severity-asc">?�각???????/option>
            <option value="status-desc">?�태??/option>
            <option value="category-asc">카테고리??/option>
          </select>

          {/* ?�성 ?�림�??��? */}
          <label className="flex items-center space-x-2 px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={(e) => setShowOnlyActive(e.target.checked)}
              className="rounded border-border"
            />
            <span>?�성 ?�림�?/span>
          </label>
        </div>
      </div>

      {/* 빠른 ?�계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.active}</div>
          <div className="text-sm text-text-secondary">?�성</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.criticalActive}</div>
          <div className="text-sm text-text-secondary">긴급</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-warning-text">{stats.acknowledged}</div>
          <div className="text-sm text-text-secondary">?�인</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.escalated}</div>
          <div className="text-sm text-text-secondary">?�급보고</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.aiGenerated}</div>
          <div className="text-sm text-text-secondary">AI ?�성</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">{stats.avgResolutionTime}�?/div>
          <div className="text-sm text-text-secondary">?�균 ?�결</div>
        </div>
      </div>

      {/* ?�???�업 버튼 */}
      {showBulkActions && selectedAlerts.size > 0 && (
        <div className="bg-primary-light border border-primary rounded-notion-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium">
              {selectedAlerts.size}�??�림???�택?�었?�니??
            </span>
            <div className="flex items-center gap-2">
              {canAcknowledge && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('acknowledge')}
                >
                  ?�괄 ?�인
                </Button>
              )}
              {canResolve && (
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('resolve')}
                  className="bg-success hover:bg-success/90"
                >
                  ?�괄 ?�결
                </Button>
              )}
              {canEscalate && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('escalate')}
                >
                  ?�괄 ?�급보고
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAlerts(new Set())}
              >
                ?�택 ?�제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ?�림 목록 */}
      {filteredAndSortedAlerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">?��</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchQuery || selectedSeverity !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedSource !== 'all'
              ? '검??결과가 ?�습?�다'
              : showOnlyActive
                ? '?�성 ?�림???�습?�다'
                : '?�림???�습?�다'
            }
          </h3>
          <p className="text-text-secondary">
            {searchQuery || selectedSeverity !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedSource !== 'all'
              ? '?�른 조건?�로 검?�해보세??
              : '모든 ?�스?�이 ?�상?�으�??�동?�고 ?�습?�다'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm text-text-secondary">
                {filteredAndSortedAlerts.length}개의 ?�림???�습?�다
                {showOnlyActive && ' (?�성�?'}
              </p>
              {showBulkActions && (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-primary hover:underline"
                >
                  {selectedAlerts.size === filteredAndSortedAlerts.length ? '?�체 ?�제' : '?�체 ?�택'}
                </button>
              )}
            </div>
            <div className="text-xs text-text-tertiary">
              마�?�??�데?�트: {new Date().toLocaleString('ko-KR')}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAndSortedAlerts.map((alert) => (
              <div key={alert.id} className="relative">
                {showBulkActions && (
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.has(alert.id)}
                      onChange={() => handleSelectAlert(alert.id)}
                      className="rounded border-border"
                    />
                  </div>
                )}
                <div className={showBulkActions ? 'ml-8' : ''}>
                  <AlertItem
                    alert={alert}
                    onAcknowledge={onAcknowledge}
                    onResolve={onResolve}
                    onEscalate={onEscalate}
                    canAcknowledge={canAcknowledge}
                    canResolve={canResolve}
                    canEscalate={canEscalate}
                    compact={viewMode === 'compact'}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}