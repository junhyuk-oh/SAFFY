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

// ?�터 ?�션
interface FilterOptions {
  priority?: Priority
  status?: MaintenanceStatus
  category?: MaintenanceCategory
}

// Mock ?�이??const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: '?�각???�프 ?��?',
    description: '?�험??A???�각?�스???�프 ?�기?��? �?교체 검??,
    priority: 'urgent',
    status: 'pending',
    assignee: '김?�비',
    location: '?�험??A??지??,
    estimatedDuration: 120,
    scheduledDate: new Date().toISOString(),
    category: '기계?�비'
  },
  {
    id: '2',
    title: '?�기 ?�널 ?�기 ?��?',
    description: 'B??�??�기 ?�널 ?�전?��? �??�도 모니?�링',
    priority: 'normal',
    status: 'in-progress',
    assignee: '?�전�?,
    location: '?�험??B??1�?,
    estimatedDuration: 90,
    scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2?�간 ??    category: '?�기?�비'
  },
  {
    id: '3',
    title: '?�어�??�터 교체',
    description: 'C???�구??HVAC ?�스???�터 ?�기 교체',
    priority: 'preventive',
    status: 'completed',
    assignee: '박시??,
    location: '?�험??C???�층',
    estimatedDuration: 60,
    scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1????    completedDate: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    category: '공조?�비'
  },
  {
    id: '4',
    title: '?�학물질 ?�드 ?��?',
    description: '?�학?�험???�드 배기?�스???�능 ?��?',
    priority: 'urgent',
    status: 'overdue',
    assignee: '최안??,
    location: '?�학?�험??201??,
    estimatedDuration: 150,
    scheduledDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2????    category: '?�전?�비'
  }
]

const mockStats = {
  total: 24,
  completed: 18,
  pending: 4,
  overdue: 2,
  todayTasks: 3
}

// ?�선?�위�??�상 매핑
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

// ?�선?�위 ?�이�?const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return '?��'
    case 'medium':
      return '?��'
    case 'low':
      return '?��'
    default:
      return '??
  }
}

// ?�태�?배�? ?�상
const getStatusBadge = (status: MaintenanceStatus) => {
  switch (status) {
    case 'scheduled':
      return <Badge variant="secondary">?�정</Badge>
    case 'in_progress':
      return <Badge className="bg-blue-500 text-white">진행�?/Badge>
    case 'completed':
      return <Badge variant="success">?�료</Badge>
    case 'overdue':
      return <Badge variant="destructive">지??/Badge>
    case 'cancelled':
      return <Badge variant="outline">취소</Badge>
    case 'on_hold':
      return <Badge variant="outline">보류</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// ?�간 ?�맷 ?�수
const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffMinutes < 60) {
    return `${diffMinutes}�???
  } else if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}?�간 ??
  } else {
    const days = Math.floor(diffMinutes / (24 * 60))
    return `${days}????
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

  // ?�터???�업 목록
  const filteredTasks = tasks.filter(task => {
    if (filter.priority && task.priority !== filter.priority) return false
    if (filter.status && task.status !== filter.status) return false
    if (filter.category && task.category !== filter.category) return false
    return true
  })

  // ?�늘???�업�??�터�?  const todayTasks = filteredTasks.filter(task => {
    const taskDate = new Date(task.scheduledDate)
    const today = new Date()
    return taskDate.toDateString() === today.toDateString()
  })

  // ?�업 ?�료 처리
  const handleCompleteTask = useCallback(async (taskId: string) => {
    setIsLoading(true)
    try {
      // ?�제 API ?�출 ?��??�이??      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
      
      // ?�공 메시지 ?�시 (?�제로는 toast ?�용)
      console.log('?�업???�료?�었?�니??')
    } catch (error) {
      console.error('?�업 ?�료 �??�류가 발생?�습?�다:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ?�진 첨�? 처리
  const handleAttachPhoto = useCallback(async (taskId: string) => {
    // ?�제로는 카메???�일 ?�로??모달???�어????    console.log('?�진 첨�? 기능 - ?�업 ID:', taskId)
  }, [])

  // ???�업 추�?
  const handleAddTask = useCallback(() => {
    console.log('???�업 추�? 모달 ?�기')
  }, [])

  // ?�력 보기
  const handleViewHistory = useCallback(() => {
    console.log('?�비 ?�력 ?�이지�??�동')
  }, [])

  return (
    <div className={cn("space-y-6", className)}>
      {/* ?�더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            ?�마???�비 ?��?줄러
          </h1>
          <p className="text-text-secondary mt-1">?�설 ?�비 ?�업???�율?�으�?관리하?�요</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            ?�터
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleAddTask}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            ???�업
          </Button>
        </div>
      </div>

      {/* ?�체 ?�황 ?�약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">?�체 ?�업</p>
                <p className="text-2xl font-bold text-text-primary">{mockStats.total}</p>
              </div>
              <div className="p-3 bg-primary-light rounded-notion-sm">
                <Settings className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(mockStats.completed / mockStats.total) * 100} className="h-2" />
              <p className="text-xs text-text-secondary mt-1">
                ?�료??{Math.round((mockStats.completed / mockStats.total) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">?�료</p>
                <p className="text-2xl font-bold text-green-600">{mockStats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-notion-sm">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">
              ?�체??{Math.round((mockStats.completed / mockStats.total) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">?��?/p>
                <p className="text-2xl font-bold text-blue-600">{mockStats.pending}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-notion-sm">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">?�정???�업</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">지??/p>
                <p className="text-2xl font-bold text-red-600">{mockStats.overdue}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-notion-sm">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">즉시 조치 ?�요</p>
          </CardContent>
        </Card>
      </div>

      {/* ?�늘???�비 ?�업 */}
      <Card className="shadow-notion-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              ?�늘???�비 ?�업
            </CardTitle>
            <Badge variant="secondary" className="px-2 py-1">
              {todayTasks.length}�?            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">??/div>
              <p className="text-text-secondary">?�늘 ?�정???�비 ?�업???�습?�다</p>
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
                        {task.estimatedDuration}�?                      </span>
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
                          ?�료
                        </Button>
                      </>
                    )}
                    
                    {task.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        ?�료??                      </div>
                    )}
                    
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 text-text-tertiary transition-transform",
                        selectedTask === task.id && "rotate-90"
                      )}
                    />
                  </div>
                </div>
                
                {/* ?�장???��? ?�보 */}
                {selectedTask === task.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3 animate-slideDown">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-text-secondary mb-1">?�정 ?�간</p>
                        <p className="text-text-primary">
                          {new Date(task.scheduledDate).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      
                      {task.completedDate && (
                        <div>
                          <p className="font-medium text-text-secondary mb-1">?�료 ?�간</p>
                          <p className="text-text-primary">
                            {new Date(task.completedDate).toLocaleString('ko-KR')}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <p className="font-medium text-text-secondary mb-1">?�당??/p>
                        <p className="text-text-primary">{task.assignedTo.name} ({task.assignedTo.role})</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-text-secondary mb-1">?�치</p>
                        <p className="text-text-primary">{task.location}{task.subLocation ? ` - ${task.subLocation}` : ''}</p>
                      </div>
                    </div>
                    
                    {task.notes && (
                      <div>
                        <p className="font-medium text-text-secondary mb-1">비고</p>
                        <p className="text-text-primary text-sm">{task.notes}</p>
                      </div>
                    )}
                    
                    {/* ?�전 ?�보 ?�시 */}
                    <div>
                      <p className="font-medium text-text-secondary mb-2">?�전 ?�보</p>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {task.safety.requiredPPE.map((ppe, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{ppe}</Badge>
                          ))}
                        </div>
                        {task.safety.lockoutTagout && (
                          <Badge variant="destructive" className="text-xs">LOTO ?�요</Badge>
                        )}
                        {task.safety.permitRequired && (
                          <Badge variant="secondary" className="text-xs">?�업?��????�요</Badge>
                        )}
                      </div>
                    </div>
                    
                    {task.attachments && task.attachments.length > 0 && (
                      <div>
                        <p className="font-medium text-text-secondary mb-2">첨�??�일</p>
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

      {/* ?�단 ?�션 버튼??*/}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handleAddTask}
          className="flex items-center justify-center gap-2 h-12 text-base"
        >
          <Plus className="h-5 w-5" />
          ???�업 추�?
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleViewHistory}
          className="flex items-center justify-center gap-2 h-12 text-base"
        >
          <BarChart3 className="h-5 w-5" />
          ?�비 ?�력 보기
        </Button>
      </div>
    </div>
  )
}

export default MaintenanceScheduler