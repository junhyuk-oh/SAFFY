"use client"

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display/card'
import { Button } from '@/components/ui/forms/button'
import { Badge } from '@/components/ui/display/badge'
import { Progress } from '@/components/ui/display/progress'
import { cn } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Plus, 
  BarChart3,
  Wrench,
  Settings,
  Filter,
  ChevronRight,
  RefreshCw,
  Upload
} from 'lucide-react'
import { 
  MaintenanceTask, 
  MaintenanceStatus, 
  MaintenanceCategory,
  Priority,
  FacilityArea
} from '@/lib/types/facility'

// 필터 옵션
interface FilterOptions {
  priority?: Priority
  status?: MaintenanceStatus
  category?: MaintenanceCategory
}

// Mock 데이터
const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: '냉각수 펌프 점검',
    description: '실험실 A동 냉각시스템 펌프 정기점검 및 교체 검토',
    priority: 'urgent',
    status: 'pending',
    assignee: '김정비',
    location: '실험실 A동 지하',
    estimatedDuration: 120,
    scheduledDate: new Date().toISOString(),
    category: '기계설비'
  },
  {
    id: '2',
    title: '전기 패널 정기 점검',
    description: 'B동 주 전기 패널 안전점검 및 온도 모니터링',
    priority: 'normal',
    status: 'in-progress',
    assignee: '이전기',
    location: '실험실 B동 1층',
    estimatedDuration: 90,
    scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2시간 후
    category: '전기설비'
  },
  {
    id: '3',
    title: '에어컨 필터 교체',
    description: 'C동 연구실 HVAC 시스템 필터 정기 교체',
    priority: 'preventive',
    status: 'completed',
    assignee: '박시설',
    location: '실험실 C동 전층',
    estimatedDuration: 60,
    scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    completedDate: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    category: '공조설비'
  },
  {
    id: '4',
    title: '화학물질 후드 점검',
    description: '화학실험실 후드 배기시스템 성능 점검',
    priority: 'urgent',
    status: 'overdue',
    assignee: '최안전',
    location: '화학실험실 201호',
    estimatedDuration: 150,
    scheduledDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2일 전
    category: '안전설비'
  }
]

const mockStats = {
  total: 24,
  completed: 18,
  pending: 4,
  overdue: 2,
  todayTasks: 3
}

// 우선순위별 색상 매핑
const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// 우선순위 아이콘
const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return '🔴'
    case 'medium':
      return '🟡'
    case 'low':
      return '🟢'
    default:
      return '⚪'
  }
}

// 상태별 배지 색상
const getStatusBadge = (status: MaintenanceStatus) => {
  switch (status) {
    case 'scheduled':
      return <Badge variant="secondary">예정</Badge>
    case 'in_progress':
      return <Badge className="bg-blue-500 text-white">진행중</Badge>
    case 'completed':
      return <Badge variant="success">완료</Badge>
    case 'overdue':
      return <Badge variant="destructive">지연</Badge>
    case 'cancelled':
      return <Badge variant="outline">취소</Badge>
    case 'on_hold':
      return <Badge variant="outline">보류</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// 시간 포맷 함수
const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`
  } else if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}시간 전`
  } else {
    const days = Math.floor(diffMinutes / (24 * 60))
    return `${days}일 전`
  }
}

interface MaintenanceSchedulerProps {
  className?: string
}

export function MaintenanceScheduler({ className }: MaintenanceSchedulerProps) {
  const [tasks, setTasks] = useState<MaintenanceTask[]>(mockTasks)
  const [filter, setFilter] = useState<FilterOptions>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  // 필터된 작업 목록
  const filteredTasks = tasks.filter(task => {
    if (filter.priority && task.priority !== filter.priority) return false
    if (filter.status && task.status !== filter.status) return false
    if (filter.category && task.category !== filter.category) return false
    return true
  })

  // 오늘의 작업만 필터링
  const todayTasks = filteredTasks.filter(task => {
    const taskDate = new Date(task.scheduledDate)
    const today = new Date()
    return taskDate.toDateString() === today.toDateString()
  })

  // 작업 완료 처리
  const handleCompleteTask = useCallback(async (taskId: string) => {
    setIsLoading(true)
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'completed' as MaintenanceStatus,
              completedDate: new Date().toISOString(),
              actualDuration: task.estimatedDuration
            }
          : task
      ))
      
      // 성공 메시지 표시 (실제로는 toast 사용)
      console.log('작업이 완료되었습니다!')
    } catch (error) {
      console.error('작업 완료 중 오류가 발생했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 사진 첨부 처리
  const handleAttachPhoto = useCallback(async (taskId: string) => {
    // 실제로는 카메라/파일 업로드 모달을 열어야 함
    console.log('사진 첨부 기능 - 작업 ID:', taskId)
  }, [])

  // 새 작업 추가
  const handleAddTask = useCallback(() => {
    console.log('새 작업 추가 모달 열기')
  }, [])

  // 이력 보기
  const handleViewHistory = useCallback(() => {
    console.log('정비 이력 페이지로 이동')
  }, [])

  return (
    <div className={cn("space-y-6", className)}>
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            스마트 정비 스케줄러
          </h1>
          <p className="text-text-secondary mt-1">시설 정비 작업을 효율적으로 관리하세요</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            필터
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleAddTask}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            새 작업
          </Button>
        </div>
      </div>

      {/* 전체 현황 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">전체 작업</p>
                <p className="text-2xl font-bold text-text-primary">{mockStats.total}</p>
              </div>
              <div className="p-3 bg-primary-light rounded-notion-sm">
                <Settings className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(mockStats.completed / mockStats.total) * 100} className="h-2" />
              <p className="text-xs text-text-secondary mt-1">
                완료율 {Math.round((mockStats.completed / mockStats.total) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">완료</p>
                <p className="text-2xl font-bold text-green-600">{mockStats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-notion-sm">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">
              전체의 {Math.round((mockStats.completed / mockStats.total) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">대기</p>
                <p className="text-2xl font-bold text-blue-600">{mockStats.pending}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-notion-sm">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">예정된 작업</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">지연</p>
                <p className="text-2xl font-bold text-red-600">{mockStats.overdue}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-notion-sm">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">즉시 조치 필요</p>
          </CardContent>
        </Card>
      </div>

      {/* 오늘의 정비 작업 */}
      <Card className="shadow-notion-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              오늘의 정비 작업
            </CardTitle>
            <Badge variant="secondary" className="px-2 py-1">
              {todayTasks.length}건
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-text-secondary">오늘 예정된 정비 작업이 없습니다</p>
            </div>
          ) : (
            todayTasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "p-4 rounded-notion-md border-l-4 transition-all duration-200",
                  "hover:shadow-notion-sm hover:-translate-y-0.5 cursor-pointer",
                  getPriorityColor(task.priority),
                  selectedTask === task.id && "ring-2 ring-primary ring-opacity-50"
                )}
                onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getPriorityIcon(task.priority)}</span>
                      <h3 className="font-semibold text-text-primary truncate">
                        {task.title}
                      </h3>
                      {getStatusBadge(task.status)}
                    </div>
                    
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.estimatedDuration}분
                      </span>
                      <span>{task.location}</span>
                      <span>{task.assignedTo.name}</span>
                      <span className="px-2 py-1 bg-background-hover rounded-full">
                        {task.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {(task.status === 'scheduled' || task.status === 'in_progress') && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAttachPhoto(task.id)
                          }}
                          className="h-8 w-8 p-0 hover:bg-background-hover"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCompleteTask(task.id)
                          }}
                          disabled={isLoading}
                          className="flex items-center gap-1 px-3 py-1 h-8"
                        >
                          {isLoading ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          완료
                        </Button>
                      </>
                    )}
                    
                    {task.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        완료됨
                      </div>
                    )}
                    
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 text-text-tertiary transition-transform",
                        selectedTask === task.id && "rotate-90"
                      )}
                    />
                  </div>
                </div>
                
                {/* 확장된 세부 정보 */}
                {selectedTask === task.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3 animate-slideDown">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-text-secondary mb-1">예정 시간</p>
                        <p className="text-text-primary">
                          {new Date(task.scheduledDate).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      
                      {task.completedDate && (
                        <div>
                          <p className="font-medium text-text-secondary mb-1">완료 시간</p>
                          <p className="text-text-primary">
                            {new Date(task.completedDate).toLocaleString('ko-KR')}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <p className="font-medium text-text-secondary mb-1">담당자</p>
                        <p className="text-text-primary">{task.assignedTo.name} ({task.assignedTo.role})</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-text-secondary mb-1">위치</p>
                        <p className="text-text-primary">{task.location}{task.subLocation ? ` - ${task.subLocation}` : ''}</p>
                      </div>
                    </div>
                    
                    {task.notes && (
                      <div>
                        <p className="font-medium text-text-secondary mb-1">비고</p>
                        <p className="text-text-primary text-sm">{task.notes}</p>
                      </div>
                    )}
                    
                    {/* 안전 정보 표시 */}
                    <div>
                      <p className="font-medium text-text-secondary mb-2">안전 정보</p>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {task.safety.requiredPPE.map((ppe, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{ppe}</Badge>
                          ))}
                        </div>
                        {task.safety.lockoutTagout && (
                          <Badge variant="destructive" className="text-xs">LOTO 필요</Badge>
                        )}
                        {task.safety.permitRequired && (
                          <Badge variant="secondary" className="text-xs">작업허가서 필요</Badge>
                        )}
                      </div>
                    </div>
                    
                    {task.attachments && task.attachments.length > 0 && (
                      <div>
                        <p className="font-medium text-text-secondary mb-2">첨부파일</p>
                        <div className="flex flex-wrap gap-2">
                          {task.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center gap-2 px-3 py-1 bg-background-hover rounded-notion-sm text-sm"
                            >
                              {attachment.type === 'image' ? (
                                <Camera className="h-3 w-3" />
                              ) : (
                                <Upload className="h-3 w-3" />
                              )}
                              <span className="truncate max-w-32">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 하단 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handleAddTask}
          className="flex items-center justify-center gap-2 h-12 text-base"
        >
          <Plus className="h-5 w-5" />
          새 작업 추가
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleViewHistory}
          className="flex items-center justify-center gap-2 h-12 text-base"
        >
          <BarChart3 className="h-5 w-5" />
          정비 이력 보기
        </Button>
      </div>
    </div>
  )
}

export default MaintenanceScheduler