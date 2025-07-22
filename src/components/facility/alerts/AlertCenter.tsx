"use client"

import { useState, useMemo } from "react"
import { FacilityAlert, FacilitySearchParams, AlertSeverity } from "@/lib/types/facility"
import { AlertItem } from "./AlertItem"
import { Badge } from "@/components/ui/display"
import { Button } from "@/components/ui/button"

// ?Œë¦¼ ?¼í„°???•ë ¬ ?„ë“œ ?€??
type AlertSortField = 'detectedDate' | 'severity' | 'status' | 'category'

// ?Œë¦¼ ê²€???Œë¼ë¯¸í„° (FacilitySearchParamsë¥??•ì¥)
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
  { value: 'all', label: '?„ì²´ ?¬ê°?? },
  { value: 'emergency', label: 'ë¹„ìƒ' },
  { value: 'critical', label: 'ê¸´ê¸‰' },
  { value: 'high', label: '?’ìŒ' },
  { value: 'medium', label: 'ë³´í†µ' },
  { value: 'low', label: '??Œ' }
]

const statusOptions = [
  { value: 'all', label: '?„ì²´ ?íƒœ' },
  { value: 'active', label: '?œì„±' },
  { value: 'acknowledged', label: '?•ì¸?? },
  { value: 'resolved', label: '?´ê²°?? },
  { value: 'escalated', label: '?ê¸‰ë³´ê³ ' },
  { value: 'false_positive', label: '?¤íƒì§€' }
]

const categoryOptions = [
  { value: 'all', label: '?„ì²´ ì¹´í…Œê³ ë¦¬' },
  { value: 'safety', label: '?ˆì „' },
  { value: 'equipment', label: '?¥ë¹„' },
  { value: 'environmental', label: '?˜ê²½' },
  { value: 'security', label: 'ë³´ì•ˆ' },
  { value: 'operational', label: '?´ì˜' },
  { value: 'compliance', label: 'ê·œì •ì¤€?? }
]

const sourceOptions = [
  { value: 'all', label: '?„ì²´ ?ŒìŠ¤' },
  { value: 'ai_system', label: 'AI ?œìŠ¤?? },
  { value: 'sensor', label: '?¼ì„œ' },
  { value: 'manual', label: '?˜ë™' },
  { value: 'inspection', label: '?ê?' },
  { value: 'maintenance', label: '?•ë¹„' },
  { value: 'external', label: '?¸ë?' }
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

  // ?„í„°ë§?ë°??•ë ¬???Œë¦¼ ëª©ë¡
  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alerts

    // ?œì„± ?Œë¦¼ë§??œì‹œ ?µì…˜
    if (showOnlyActive) {
      filtered = filtered.filter(alert => alert.status === 'active' || alert.status === 'acknowledged')
    }

    // ê²€??ì¿¼ë¦¬ ?„í„°ë§?
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

    // ?¬ê°???„í„°ë§?
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity)
    }

    // ?íƒœ ?„í„°ë§?
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === selectedStatus)
    }

    // ì¹´í…Œê³ ë¦¬ ?„í„°ë§?
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(alert => alert.category === selectedCategory)
    }

    // ?ŒìŠ¤ ?„í„°ë§?
    if (selectedSource !== 'all') {
      filtered = filtered.filter(alert => alert.source === selectedSource)
    }

    // ?•ë ¬
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

  // ?µê³„ ê³„ì‚°
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

    // ìµœê·¼ 24?œê°„ ???Œë¦¼
    const last24Hours = alerts.filter(alert => {
      const alertTime = new Date(alert.detectedDate)
      const now = new Date()
      const diffTime = now.getTime() - alertTime.getTime()
      const diffHours = diffTime / (1000 * 60 * 60)
      return diffHours <= 24
    }).length

    // AI ?ì„± ?Œë¦¼
    const aiGenerated = alerts.filter(alert => alert.source === 'ai_system').length

    // ?‰ê·  ?´ê²° ?œê°„ ê³„ì‚° (?´ê²°???Œë¦¼ë§?
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
      {/* ?¤ë” ë°??µê³„ */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">?Œë¦¼ ?¼í„°</h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>?„ì²´ {stats.total}ê°?/span>
            <span>??/span>
            <span className="text-error-text">?œì„± {stats.active}ê°?/span>
            <span>??/span>
            <span className="text-warning-text">?•ì¸ {stats.acknowledged}ê°?/span>
            <span>??/span>
            <span className="text-red-600">ê¸´ê¸‰ {stats.criticalActive}ê°?/span>
            <span>??/span>
            <span className="text-success-text">?´ê²° {stats.resolved}ê°?/span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
          >
            {viewMode === 'detailed' ? '?“‹ ê°„ëµ?? : '?“„ ?ì„¸??}
          </Button>
          {stats.active > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {stats.active}ê°??Œë¦¼
            </Badge>
          )}
        </div>
      </div>

      {/* ê²€??ë°??„í„° */}
      <div className="bg-background-secondary rounded-notion-md p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="?Œë¦¼ ?œëª©, ë©”ì‹œì§€, ?„ì¹˜, ?¥ë¹„ëª?ê²€??.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
            />
          </div>
          <Button type="submit" size="sm">
            ?” ê²€??
          </Button>
        </form>

        <div className="flex flex-wrap gap-3 items-center">
          {/* ?¬ê°???„í„° */}
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

          {/* ?íƒœ ?„í„° */}
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

          {/* ì¹´í…Œê³ ë¦¬ ?„í„° */}
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

          {/* ?ŒìŠ¤ ?„í„° */}
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

          {/* ?•ë ¬ */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field as AlertSortField)
              setSortOrder(order as 'asc' | 'desc')
            }}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            <option value="detectedDate-desc">ìµœì‹ ??/option>
            <option value="detectedDate-asc">?¤ë˜?œìˆœ</option>
            <option value="severity-desc">?¬ê°???’ì???/option>
            <option value="severity-asc">?¬ê°???????/option>
            <option value="status-desc">?íƒœ??/option>
            <option value="category-asc">ì¹´í…Œê³ ë¦¬??/option>
          </select>

          {/* ?œì„± ?Œë¦¼ë§?? ê? */}
          <label className="flex items-center space-x-2 px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={(e) => setShowOnlyActive(e.target.checked)}
              className="rounded border-border"
            />
            <span>?œì„± ?Œë¦¼ë§?/span>
          </label>
        </div>
      </div>

      {/* ë¹ ë¥¸ ?µê³„ ì¹´ë“œ */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.active}</div>
          <div className="text-sm text-text-secondary">?œì„±</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.criticalActive}</div>
          <div className="text-sm text-text-secondary">ê¸´ê¸‰</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-warning-text">{stats.acknowledged}</div>
          <div className="text-sm text-text-secondary">?•ì¸</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.escalated}</div>
          <div className="text-sm text-text-secondary">?ê¸‰ë³´ê³ </div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.aiGenerated}</div>
          <div className="text-sm text-text-secondary">AI ?ì„±</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">{stats.avgResolutionTime}ë¶?/div>
          <div className="text-sm text-text-secondary">?‰ê·  ?´ê²°</div>
        </div>
      </div>

      {/* ?€???‘ì—… ë²„íŠ¼ */}
      {showBulkActions && selectedAlerts.size > 0 && (
        <div className="bg-primary-light border border-primary rounded-notion-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium">
              {selectedAlerts.size}ê°??Œë¦¼??? íƒ?˜ì—ˆ?µë‹ˆ??
            </span>
            <div className="flex items-center gap-2">
              {canAcknowledge && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('acknowledge')}
                >
                  ?¼ê´„ ?•ì¸
                </Button>
              )}
              {canResolve && (
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('resolve')}
                  className="bg-success hover:bg-success/90"
                >
                  ?¼ê´„ ?´ê²°
                </Button>
              )}
              {canEscalate && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('escalate')}
                >
                  ?¼ê´„ ?ê¸‰ë³´ê³ 
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAlerts(new Set())}
              >
                ? íƒ ?´ì œ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ?Œë¦¼ ëª©ë¡ */}
      {filteredAndSortedAlerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">?””</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchQuery || selectedSeverity !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedSource !== 'all'
              ? 'ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤'
              : showOnlyActive
                ? '?œì„± ?Œë¦¼???†ìŠµ?ˆë‹¤'
                : '?Œë¦¼???†ìŠµ?ˆë‹¤'
            }
          </h3>
          <p className="text-text-secondary">
            {searchQuery || selectedSeverity !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedSource !== 'all'
              ? '?¤ë¥¸ ì¡°ê±´?¼ë¡œ ê²€?‰í•´ë³´ì„¸??
              : 'ëª¨ë“  ?œìŠ¤?œì´ ?•ìƒ?ìœ¼ë¡??‘ë™?˜ê³  ?ˆìŠµ?ˆë‹¤'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm text-text-secondary">
                {filteredAndSortedAlerts.length}ê°œì˜ ?Œë¦¼???ˆìŠµ?ˆë‹¤
                {showOnlyActive && ' (?œì„±ë§?'}
              </p>
              {showBulkActions && (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-primary hover:underline"
                >
                  {selectedAlerts.size === filteredAndSortedAlerts.length ? '?„ì²´ ?´ì œ' : '?„ì²´ ? íƒ'}
                </button>
              )}
            </div>
            <div className="text-xs text-text-tertiary">
              ë§ˆì?ë§??…ë°?´íŠ¸: {new Date().toLocaleString('ko-KR')}
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