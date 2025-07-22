"use client"

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/display'
import { Progress } from '@/components/ui/feedback'
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

// ?ÑÌÑ∞ ?µÏÖò
interface FilterOptions {
  priority?: Priority
  status?: MaintenanceStatus
  category?: MaintenanceCategory
}

// Mock ?∞Ïù¥??const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: '?âÍ∞Å???åÌîÑ ?êÍ?',
    description: '?§Ìóò??A???âÍ∞Å?úÏä§???åÌîÑ ?ïÍ∏∞?êÍ? Î∞?ÍµêÏ≤¥ Í≤Ä??,
    priority: 'urgent',
    status: 'pending',
    assignee: 'ÍπÄ?ïÎπÑ',
    location: '?§Ìóò??A??ÏßÄ??,
    estimatedDuration: 120,
    scheduledDate: new Date().toISOString(),
    category: 'Í∏∞Í≥Ñ?§ÎπÑ'
  },
  {
    id: '2',
    title: '?ÑÍ∏∞ ?®ÎÑê ?ïÍ∏∞ ?êÍ?',
    description: 'B??Ï£??ÑÍ∏∞ ?®ÎÑê ?àÏ†Ñ?êÍ? Î∞??®ÎèÑ Î™®Îãà?∞ÎßÅ',
    priority: 'normal',
    status: 'in-progress',
    assignee: '?¥Ï†ÑÍ∏?,
    location: '?§Ìóò??B??1Ï∏?,
    estimatedDuration: 90,
    scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2?úÍ∞Ñ ??    category: '?ÑÍ∏∞?§ÎπÑ'
  },
  {
    id: '3',
    title: '?êÏñ¥Ïª??ÑÌÑ∞ ÍµêÏ≤¥',
    description: 'C???∞Íµ¨??HVAC ?úÏä§???ÑÌÑ∞ ?ïÍ∏∞ ÍµêÏ≤¥',
    priority: 'preventive',
    status: 'completed',
    assignee: 'Î∞ïÏãú??,
    location: '?§Ìóò??C???ÑÏ∏µ',
    estimatedDuration: 60,
    scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1????    completedDate: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    category: 'Í≥µÏ°∞?§ÎπÑ'
  },
  {
    id: '4',
    title: '?îÌïôÎ¨ºÏßà ?ÑÎìú ?êÍ?',
    description: '?îÌïô?§Ìóò???ÑÎìú Î∞∞Í∏∞?úÏä§???±Îä• ?êÍ?',
    priority: 'urgent',
    status: 'overdue',
    assignee: 'ÏµúÏïà??,
    location: '?îÌïô?§Ìóò??201??,
    estimatedDuration: 150,
    scheduledDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2????    category: '?àÏ†Ñ?§ÎπÑ'
  }
]

const mockStats = {
  total: 24,
  completed: 18,
  pending: 4,
  overdue: 2,
  todayTasks: 3
}

// ?∞ÏÑ†?úÏúÑÎ≥??âÏÉÅ Îß§Ìïë
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

// ?∞ÏÑ†?úÏúÑ ?ÑÏù¥ÏΩ?const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return '?î¥'
    case 'medium':
      return '?ü°'
    case 'low':
      return '?ü¢'
    default:
      return '??
  }
}

// ?ÅÌÉúÎ≥?Î∞∞Ï? ?âÏÉÅ
const getStatusBadge = (status: MaintenanceStatus) => {
  switch (status) {
    case 'scheduled':
      return <Badge variant="secondary">?àÏ†ï</Badge>
    case 'in_progress':
      return <Badge className="bg-blue-500 text-white">ÏßÑÌñâÏ§?/Badge>
    case 'completed':
      return <Badge variant="success">?ÑÎ£å</Badge>
    case 'overdue':
      return <Badge variant="destructive">ÏßÄ??/Badge>
    case 'cancelled':
      return <Badge variant="outline">Ï∑®ÏÜå</Badge>
    case 'on_hold':
      return <Badge variant="outline">Î≥¥Î•ò</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// ?úÍ∞Ñ ?¨Îß∑ ?®Ïàò
const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffMinutes < 60) {
    return `${diffMinutes}Î∂???
  } else if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}?úÍ∞Ñ ??
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

  // ?ÑÌÑ∞???ëÏóÖ Î™©Î°ù
  const filteredTasks = tasks.filter(task => {
    if (filter.priority && task.priority !== filter.priority) return false
    if (filter.status && task.status !== filter.status) return false
    if (filter.category && task.category !== filter.category) return false
    return true
  })

  // ?§Îäò???ëÏóÖÎß??ÑÌÑ∞Îß?  const todayTasks = filteredTasks.filter(task => {
    const taskDate = new Date(task.scheduledDate)
    const today = new Date()
    return taskDate.toDateString() === today.toDateString()
  })

  // ?ëÏóÖ ?ÑÎ£å Ï≤òÎ¶¨
  const handleCompleteTask = useCallback(async (taskId: string) => {
    setIsLoading(true)
    try {
      // ?§Ï†ú API ?∏Ï∂ú ?úÎ??àÏù¥??      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
      
      // ?±Í≥µ Î©îÏãúÏßÄ ?úÏãú (?§Ï†úÎ°úÎäî toast ?¨Ïö©)
      console.log('?ëÏóÖ???ÑÎ£å?òÏóà?µÎãà??')
    } catch (error) {
      console.error('?ëÏóÖ ?ÑÎ£å Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ?¨ÏßÑ Ï≤®Î? Ï≤òÎ¶¨
  const handleAttachPhoto = useCallback(async (taskId: string) => {
    // ?§Ï†úÎ°úÎäî Ïπ¥Î©î???åÏùº ?ÖÎ°ú??Î™®Îã¨???¥Ïñ¥????    console.log('?¨ÏßÑ Ï≤®Î? Í∏∞Îä• - ?ëÏóÖ ID:', taskId)
  }, [])

  // ???ëÏóÖ Ï∂îÍ?
  const handleAddTask = useCallback(() => {
    console.log('???ëÏóÖ Ï∂îÍ? Î™®Îã¨ ?¥Í∏∞')
  }, [])

  // ?¥Î†• Î≥¥Í∏∞
  const handleViewHistory = useCallback(() => {
    console.log('?ïÎπÑ ?¥Î†• ?òÏù¥ÏßÄÎ°??¥Îèô')
  }, [])

  return (
    <div className={cn("space-y-6", className)}>
      {/* ?§Îçî */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            ?§Îßà???ïÎπÑ ?§Ï?Ï§ÑÎü¨
          </h1>
          <p className="text-text-secondary mt-1">?úÏÑ§ ?ïÎπÑ ?ëÏóÖ???®Ïú®?ÅÏúºÎ°?Í¥ÄÎ¶¨Ìïò?∏Ïöî</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            ?ÑÌÑ∞
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleAddTask}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            ???ëÏóÖ
          </Button>
        </div>
      </div>

      {/* ?ÑÏ≤¥ ?ÑÌô© ?îÏïΩ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">?ÑÏ≤¥ ?ëÏóÖ</p>
                <p className="text-2xl font-bold text-text-primary">{mockStats.total}</p>
              </div>
              <div className="p-3 bg-primary-light rounded-notion-sm">
                <Settings className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(mockStats.completed / mockStats.total) * 100} className="h-2" />
              <p className="text-xs text-text-secondary mt-1">
                ?ÑÎ£å??{Math.round((mockStats.completed / mockStats.total) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">?ÑÎ£å</p>
                <p className="text-2xl font-bold text-green-600">{mockStats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-notion-sm">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">
              ?ÑÏ≤¥??{Math.round((mockStats.completed / mockStats.total) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">?ÄÍ∏?/p>
                <p className="text-2xl font-bold text-blue-600">{mockStats.pending}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-notion-sm">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">?àÏ†ï???ëÏóÖ</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-notion-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">ÏßÄ??/p>
                <p className="text-2xl font-bold text-red-600">{mockStats.overdue}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-notion-sm">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-4">Ï¶âÏãú Ï°∞Ïπò ?ÑÏöî</p>
          </CardContent>
        </Card>
      </div>

      {/* ?§Îäò???ïÎπÑ ?ëÏóÖ */}
      <Card className="shadow-notion-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              ?§Îäò???ïÎπÑ ?ëÏóÖ
            </CardTitle>
            <Badge variant="secondary" className="px-2 py-1">
              {todayTasks.length}Í±?            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">??/div>
              <p className="text-text-secondary">?§Îäò ?àÏ†ï???ïÎπÑ ?ëÏóÖ???ÜÏäµ?àÎã§</p>
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
                        {task.estimatedDuration}Î∂?                      </span>
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
                          ?ÑÎ£å
                        </Button>
                      </>
                    )}
                    
                    {task.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        ?ÑÎ£å??                      </div>
                    )}
                    
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 text-text-tertiary transition-transform",
                        selectedTask === task.id && "rotate-90"
                      )}
                    />
                  </div>
                </div>
                
                {/* ?ïÏû•???∏Î? ?ïÎ≥¥ */}
                {selectedTask === task.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3 animate-slideDown">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-text-secondary mb-1">?àÏ†ï ?úÍ∞Ñ</p>
                        <p className="text-text-primary">
                          {new Date(task.scheduledDate).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      
                      {task.completedDate && (
                        <div>
                          <p className="font-medium text-text-secondary mb-1">?ÑÎ£å ?úÍ∞Ñ</p>
                          <p className="text-text-primary">
                            {new Date(task.completedDate).toLocaleString('ko-KR')}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <p className="font-medium text-text-secondary mb-1">?¥Îãπ??/p>
                        <p className="text-text-primary">{task.assignedTo.name} ({task.assignedTo.role})</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-text-secondary mb-1">?ÑÏπò</p>
                        <p className="text-text-primary">{task.location}{task.subLocation ? ` - ${task.subLocation}` : ''}</p>
                      </div>
                    </div>
                    
                    {task.notes && (
                      <div>
                        <p className="font-medium text-text-secondary mb-1">ÎπÑÍ≥†</p>
                        <p className="text-text-primary text-sm">{task.notes}</p>
                      </div>
                    )}
                    
                    {/* ?àÏ†Ñ ?ïÎ≥¥ ?úÏãú */}
                    <div>
                      <p className="font-medium text-text-secondary mb-2">?àÏ†Ñ ?ïÎ≥¥</p>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {task.safety.requiredPPE.map((ppe, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{ppe}</Badge>
                          ))}
                        </div>
                        {task.safety.lockoutTagout && (
                          <Badge variant="destructive" className="text-xs">LOTO ?ÑÏöî</Badge>
                        )}
                        {task.safety.permitRequired && (
                          <Badge variant="secondary" className="text-xs">?ëÏóÖ?àÍ????ÑÏöî</Badge>
                        )}
                      </div>
                    </div>
                    
                    {task.attachments && task.attachments.length > 0 && (
                      <div>
                        <p className="font-medium text-text-secondary mb-2">Ï≤®Î??åÏùº</p>
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

      {/* ?òÎã® ?°ÏÖò Î≤ÑÌäº??*/}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handleAddTask}
          className="flex items-center justify-center gap-2 h-12 text-base"
        >
          <Plus className="h-5 w-5" />
          ???ëÏóÖ Ï∂îÍ?
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleViewHistory}
          className="flex items-center justify-center gap-2 h-12 text-base"
        >
          <BarChart3 className="h-5 w-5" />
          ?ïÎπÑ ?¥Î†• Î≥¥Í∏∞
        </Button>
      </div>
    </div>
  )
}

export default MaintenanceScheduler