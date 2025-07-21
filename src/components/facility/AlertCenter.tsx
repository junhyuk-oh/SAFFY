"use client"

import { useState, useMemo } from "react"
import { FacilityAlert, FacilitySearchParams } from "@/lib/types/facility"
import { AlertItem } from "./AlertItem"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AlertCenterProps {
  alerts: FacilityAlert[]
  loading?: boolean
  searchParams?: FacilitySearchParams
  onSearch?: (params: FacilitySearchParams) => void
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
  { value: 'all', label: '전체 심각도' },
  { value: 'emergency', label: '비상' },
  { value: 'critical', label: '긴급' },
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' }
]

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'active', label: '활성' },
  { value: 'acknowledged', label: '확인됨' },
  { value: 'resolved', label: '해결됨' },
  { value: 'escalated', label: '상급보고' },
  { value: 'false_positive', label: '오탐지' }
]

const categoryOptions = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'safety', label: '안전' },
  { value: 'equipment', label: '장비' },
  { value: 'environmental', label: '환경' },
  { value: 'security', label: '보안' },
  { value: 'operational', label: '운영' },
  { value: 'compliance', label: '규정준수' }
]

const sourceOptions = [
  { value: 'all', label: '전체 소스' },
  { value: 'ai_system', label: 'AI 시스템' },
  { value: 'sensor', label: '센서' },
  { value: 'manual', label: '수동' },
  { value: 'inspection', label: '점검' },
  { value: 'maintenance', label: '정비' },
  { value: 'external', label: '외부' }
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
  const [sortBy, setSortBy] = useState<'detectedDate' | 'severity' | 'status' | 'category'>('detectedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showOnlyActive, setShowOnlyActive] = useState(true)
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed')

  // 필터링 및 정렬된 알림 목록
  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alerts

    // 활성 알림만 표시 옵션
    if (showOnlyActive) {
      filtered = filtered.filter(alert => alert.status === 'active' || alert.status === 'acknowledged')
    }

    // 검색 쿼리 필터링
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

    // 심각도 필터링
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity)
    }

    // 상태 필터링
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === selectedStatus)
    }

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(alert => alert.category === selectedCategory)
    }

    // 소스 필터링
    if (selectedSource !== 'all') {
      filtered = filtered.filter(alert => alert.source === selectedSource)
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'detectedDate':
          aValue = new Date(a.detectedDate).getTime()
          bValue = new Date(b.detectedDate).getTime()
          break
        case 'severity':
          const severityOrder = { emergency: 5, critical: 4, high: 3, medium: 2, low: 1 }
          aValue = severityOrder[a.severity]
          bValue = severityOrder[b.severity]
          break
        case 'status':
          const statusOrder = { active: 4, acknowledged: 3, escalated: 2, resolved: 1, false_positive: 0 }
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

  // 통계 계산
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

    // 최근 24시간 내 알림
    const last24Hours = alerts.filter(alert => {
      const alertTime = new Date(alert.detectedDate)
      const now = new Date()
      const diffTime = now.getTime() - alertTime.getTime()
      const diffHours = diffTime / (1000 * 60 * 60)
      return diffHours <= 24
    }).length

    // AI 생성 알림
    const aiGenerated = alerts.filter(alert => alert.source === 'ai_system').length

    // 평균 해결 시간 계산 (해결된 알림만)
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
        severity: selectedSeverity !== 'all' ? [selectedSeverity as any] : undefined,
        status: selectedStatus !== 'all' ? [selectedStatus] : undefined,
        category: selectedCategory !== 'all' ? [selectedCategory] : undefined,
        sortBy: sortBy as any,
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
      {/* 헤더 및 통계 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">알림 센터</h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>전체 {stats.total}개</span>
            <span>•</span>
            <span className="text-error-text">활성 {stats.active}개</span>
            <span>•</span>
            <span className="text-warning-text">확인 {stats.acknowledged}개</span>
            <span>•</span>
            <span className="text-red-600">긴급 {stats.criticalActive}개</span>
            <span>•</span>
            <span className="text-success-text">해결 {stats.resolved}개</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
          >
            {viewMode === 'detailed' ? '📋 간략히' : '📄 상세히'}
          </Button>
          {stats.active > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {stats.active}개 알림
            </Badge>
          )}
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-background-secondary rounded-notion-md p-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="알림 제목, 메시지, 위치, 장비명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
            />
          </div>
          <Button type="submit" size="sm">
            🔍 검색
          </Button>
        </form>

        <div className="flex flex-wrap gap-3 items-center">
          {/* 심각도 필터 */}
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

          {/* 카테고리 필터 */}
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

          {/* 소스 필터 */}
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
            <option value="detectedDate-desc">최신순</option>
            <option value="detectedDate-asc">오래된순</option>
            <option value="severity-desc">심각도 높은순</option>
            <option value="severity-asc">심각도 낮은순</option>
            <option value="status-desc">상태순</option>
            <option value="category-asc">카테고리순</option>
          </select>

          {/* 활성 알림만 토글 */}
          <label className="flex items-center space-x-2 px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={(e) => setShowOnlyActive(e.target.checked)}
              className="rounded border-border"
            />
            <span>활성 알림만</span>
          </label>
        </div>
      </div>

      {/* 빠른 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-error-text">{stats.active}</div>
          <div className="text-sm text-text-secondary">활성</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.criticalActive}</div>
          <div className="text-sm text-text-secondary">긴급</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-warning-text">{stats.acknowledged}</div>
          <div className="text-sm text-text-secondary">확인</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.escalated}</div>
          <div className="text-sm text-text-secondary">상급보고</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.aiGenerated}</div>
          <div className="text-sm text-text-secondary">AI 생성</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">{stats.avgResolutionTime}분</div>
          <div className="text-sm text-text-secondary">평균 해결</div>
        </div>
      </div>

      {/* 대량 작업 버튼 */}
      {showBulkActions && selectedAlerts.size > 0 && (
        <div className="bg-primary-light border border-primary rounded-notion-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium">
              {selectedAlerts.size}개 알림이 선택되었습니다
            </span>
            <div className="flex items-center gap-2">
              {canAcknowledge && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('acknowledge')}
                >
                  일괄 확인
                </Button>
              )}
              {canResolve && (
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('resolve')}
                  className="bg-success hover:bg-success/90"
                >
                  일괄 해결
                </Button>
              )}
              {canEscalate && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('escalate')}
                >
                  일괄 상급보고
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAlerts(new Set())}
              >
                선택 해제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 알림 목록 */}
      {filteredAndSortedAlerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchQuery || selectedSeverity !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedSource !== 'all'
              ? '검색 결과가 없습니다'
              : showOnlyActive
                ? '활성 알림이 없습니다'
                : '알림이 없습니다'
            }
          </h3>
          <p className="text-text-secondary">
            {searchQuery || selectedSeverity !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedSource !== 'all'
              ? '다른 조건으로 검색해보세요'
              : '모든 시스템이 정상적으로 작동하고 있습니다'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm text-text-secondary">
                {filteredAndSortedAlerts.length}개의 알림이 있습니다
                {showOnlyActive && ' (활성만)'}
              </p>
              {showBulkActions && (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-primary hover:underline"
                >
                  {selectedAlerts.size === filteredAndSortedAlerts.length ? '전체 해제' : '전체 선택'}
                </button>
              )}
            </div>
            <div className="text-xs text-text-tertiary">
              마지막 업데이트: {new Date().toLocaleString('ko-KR')}
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