"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/card'
import { Button } from '@/components/ui/forms/button'
import { Badge } from '@/components/ui/display/badge'
import { Progress } from '@/components/ui/feedback/progress'
import { MaintenanceTask } from '@/lib/types/facility'
import { MAINTENANCE_STATUS, PRIORITY_CONFIG } from '@/lib/constants/status'
import { formatDate, getDaysDifference } from '@/lib/utils/date'

interface MaintenanceSchedulerProps {
  tasks: MaintenanceTask[]
  onTaskClick?: (task: MaintenanceTask) => void
  onCreateTask?: () => void
  loading?: boolean
  viewMode?: 'calendar' | 'list' | 'kanban'
}

export function MaintenanceScheduler({
  tasks,
  onTaskClick,
  onCreateTask,
  loading = false,
  viewMode = 'list'
}: MaintenanceSchedulerProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'overdue'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 필터 옵션
  const filterOptions = [
    { value: 'all', label: '전체', icon: '📋' },
    { value: 'today', label: '오늘', icon: '📅' },
    { value: 'week', label: '이번 주', icon: '📆' },
    { value: 'overdue', label: '지연', icon: '⏰' }
  ]

  // 필터링된 작업 목록
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]
    
    // 시간 필터
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    if (selectedFilter === 'today') {
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate)
        return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      })
    } else if (selectedFilter === 'week') {
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate)
        return dueDate >= today && dueDate <= weekEnd
      })
    } else if (selectedFilter === 'overdue') {
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate)
        return dueDate < today && task.status !== 'completed'
      })
    }
    
    // 상태 필터
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === selectedStatus)
    }
    
    // 우선순위 필터
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority)
    }
    
    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.location.toLowerCase().includes(query) ||
        task.equipmentName?.toLowerCase().includes(query)
      )
    }
    
    // 날짜순 정렬
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    
    return filtered
  }, [tasks, selectedFilter, selectedStatus, selectedPriority, searchQuery])

  // 통계 계산
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const overdue = tasks.filter(t => {
      const dueDate = new Date(t.dueDate)
      return dueDate < new Date() && t.status !== 'completed'
    }).length
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { total, completed, inProgress, overdue, completionRate }
  }, [tasks])

  // 우선순위 아이콘
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🔴'
      case 'high': return '🟠'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  // 카테고리 아이콘
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Electrical': '⚡',
      'HVAC': '🌡️',
      'Plumbing': '🚰',
      'Fire Safety': '🔥',
      'Security': '🔒',
      'Structural': '🏗️',
      'Equipment': '⚙️',
      'Cleaning': '🧹',
      'Preventive': '🔧',
      'Corrective': '🔨',
      'Emergency': '🆘',
      'Inspection': '🔍',
      'Calibration': '📊',
      'Software Update': '💻',
      'Safety Check': '✅'
    }
    return icons[category] || '📋'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-background-hover rounded-notion-md animate-pulse"></div>
        <div className="h-64 bg-background-hover rounded-notion-md animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 및 통계 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">정비 일정</h2>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>전체 {stats.total}건</span>
            <span>•</span>
            <span className="text-success-text">완료 {stats.completed}건</span>
            <span>•</span>
            <span className="text-primary">진행중 {stats.inProgress}건</span>
            <span>•</span>
            <span className="text-error-text">지연 {stats.overdue}건</span>
          </div>
        </div>
        {onCreateTask && (
          <Button onClick={onCreateTask}>
            <span className="mr-2">➕</span>
            새 작업
          </Button>
        )}
      </div>

      {/* 진행률 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">전체 진행률</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">완료율</span>
              <span className="text-2xl font-bold text-text-primary">{stats.completionRate}%</span>
            </div>
            <Progress value={stats.completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* 필터 및 검색 */}
      <div className="bg-background-secondary rounded-notion-md p-4 space-y-4">
        {/* 빠른 필터 */}
        <div className="flex items-center gap-2">
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant={selectedFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(option.value as any)}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </Button>
          ))}
        </div>

        {/* 상세 필터 */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            <option value="all">모든 상태</option>
            {Object.entries(MAINTENANCE_STATUS).map(([value, config]) => (
              <option key={value} value={value}>{config.label}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            <option value="all">모든 우선순위</option>
            {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
              <option key={value} value={value}>{config.label}</option>
            ))}
          </select>

          <div className="flex-1">
            <input
              type="text"
              placeholder="작업명, 위치, 장비명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm focus:border-border-focus focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 오늘의 작업 */}
      {selectedFilter === 'all' && (
        <div className="bg-warning-bg border border-warning rounded-notion-md p-4">
          <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center">
            <span className="mr-2">📅</span>
            오늘의 작업
          </h3>
          {(() => {
            const todayTasks = tasks.filter(task => {
              const dueDate = new Date(task.dueDate)
              const today = new Date()
              return dueDate.toDateString() === today.toDateString()
            })
            
            if (todayTasks.length === 0) {
              return <p className="text-text-secondary">오늘 예정된 작업이 없습니다.</p>
            }
            
            return (
              <div className="space-y-2">
                {todayTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-background rounded-notion-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onTaskClick?.(task)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getCategoryIcon(task.category)}</span>
                      <div>
                        <h4 className="font-medium text-text-primary">{task.title}</h4>
                        <p className="text-sm text-text-secondary">{task.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={PRIORITY_CONFIG[task.priority].bg + ' ' + PRIORITY_CONFIG[task.priority].color}>
                        {getPriorityIcon(task.priority)} {PRIORITY_CONFIG[task.priority].label}
                      </Badge>
                      <Badge className={MAINTENANCE_STATUS[task.status].bg + ' ' + MAINTENANCE_STATUS[task.status].color}>
                        {MAINTENANCE_STATUS[task.status].label}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}

      {/* 작업 목록 */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedFilter !== 'all'
                ? '검색 결과가 없습니다'
                : '예정된 작업이 없습니다'}
            </h3>
            <p className="text-text-secondary">
              {searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedFilter !== 'all'
                ? '다른 조건으로 검색해보세요'
                : '새로운 정비 작업을 등록해보세요'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <Card 
              key={task.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onTaskClick?.(task)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary">{task.title}</h3>
                        <Badge className={MAINTENANCE_STATUS[task.status].bg + ' ' + MAINTENANCE_STATUS[task.status].color}>
                          {MAINTENANCE_STATUS[task.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-text-secondary mb-2">
                        <span>#{task.id}</span>
                        <span>•</span>
                        <span>{task.location}</span>
                        {task.equipmentName && (
                          <>
                            <span>•</span>
                            <span>장비: {task.equipmentName}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>담당: {task.assignedTo?.name || '미지정'}</span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-text-secondary line-clamp-2">{task.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge className={PRIORITY_CONFIG[task.priority].bg + ' ' + PRIORITY_CONFIG[task.priority].color}>
                      {getPriorityIcon(task.priority)} {PRIORITY_CONFIG[task.priority].label}
                    </Badge>
                    <div className="text-sm text-text-secondary text-right">
                      <div>마감: {formatDate(task.dueDate)}</div>
                      {(() => {
                        const days = getDaysDifference(new Date(), new Date(task.dueDate))
                        if (days < 0) {
                          return <span className="text-error-text font-medium">{Math.abs(days)}일 지연</span>
                        } else if (days === 0) {
                          return <span className="text-warning-text font-medium">오늘 마감</span>
                        } else if (days <= 3) {
                          return <span className="text-warning-text font-medium">{days}일 남음</span>
                        } else {
                          return <span className="text-text-primary">{days}일 남음</span>
                        }
                      })()}
                    </div>
                  </div>
                </div>
                
                {/* 진행률 표시 */}
                {task.checklist && task.checklist.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-text-secondary">진행률</span>
                      <span className="text-sm font-medium text-text-primary">
                        {Math.round((task.checklist.filter(item => item.completed).length / task.checklist.length) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}