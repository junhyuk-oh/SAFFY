"use client"

import { useState } from 'react'
import {
  ScheduleCalendar,
  ScheduleSidebar,
  ScheduleToolbar,
  ScheduleEventModal,
  QuickAddModal
} from '@/components/schedule'
import { Card } from '@/components/ui/card'
import { Calendar, List, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react'

// 일정 타입 정의 (나중에 /lib/types/schedule.ts로 이동)
interface Schedule {
  id: string
  title: string
  date: string
  time: string
  priority: 'high' | 'medium' | 'low'
  category: 'inspection' | 'education' | 'meeting' | 'audit' | 'training'
  description?: string
  location?: string
  participants?: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
}

// 샘플 데이터
const sampleSchedules: Schedule[] = [
  {
    id: '1',
    title: '월간 안전점검',
    date: '2025-07-20',
    time: '10:00',
    priority: 'high',
    category: 'inspection',
    description: '연구실 전체 안전점검',
    location: '제1연구동',
    participants: ['김안전', '이점검'],
    status: 'scheduled'
  },
  {
    id: '2',
    title: '신입사원 안전교육',
    date: '2025-07-21',
    time: '14:00',
    priority: 'medium',
    category: 'education',
    description: '신규 입사자 대상 안전교육',
    location: '교육장 A',
    participants: ['박교육', '신입사원 5명'],
    status: 'scheduled'
  },
  {
    id: '3',
    title: '안전관리위원회 회의',
    date: '2025-07-25',
    time: '15:00',
    priority: 'medium',
    category: 'meeting',
    description: '분기별 안전관리 현황 검토',
    location: '회의실 301',
    participants: ['위원회 전원'],
    status: 'scheduled'
  },
  {
    id: '4',
    title: '외부 안전감사',
    date: '2025-07-27',
    time: '09:00',
    priority: 'high',
    category: 'audit',
    description: '정부 안전감사',
    location: '전체 사업장',
    participants: ['감사팀', '안전관리팀'],
    status: 'scheduled'
  },
  {
    id: '5',
    title: '비상대피 훈련',
    date: '2025-07-30',
    time: '16:00',
    priority: 'high',
    category: 'training',
    description: '화재 대피 훈련',
    location: '전 건물',
    participants: ['전 직원'],
    status: 'scheduled'
  }
]

// 일정 목록 뷰 컴포넌트
function ScheduleListView({ 
  schedules, 
  onScheduleClick 
}: { 
  schedules: Schedule[]
  onScheduleClick: (schedule: Schedule) => void
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error border-error bg-error-bg'
      case 'medium': return 'text-warning border-warning bg-warning-bg'
      case 'low': return 'text-success border-success bg-success-bg'
      default: return 'text-text-secondary border-border'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inspection': return '🔍'
      case 'education': return '🎓'
      case 'meeting': return '💼'
      case 'audit': return '📋'
      case 'training': return '🚨'
      default: return '📅'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-error" />
      default: return null
    }
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card 
          key={schedule.id} 
          className="p-4 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onScheduleClick(schedule)}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              {/* 카테고리 아이콘 */}
              <div className="text-3xl">{getCategoryIcon(schedule.category)}</div>
              
              {/* 일정 정보 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-text-primary">
                    {schedule.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${getPriorityColor(schedule.priority)}`}>
                    {schedule.priority === 'high' ? '높음' : schedule.priority === 'medium' ? '보통' : '낮음'}
                  </span>
                  {getStatusIcon(schedule.status)}
                </div>
                
                {schedule.description && (
                  <p className="text-sm text-text-secondary mb-2">
                    {schedule.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(schedule.date).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{schedule.time}</span>
                  </div>
                  {schedule.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule.location}</span>
                    </div>
                  )}
                  {schedule.participants && schedule.participants.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{schedule.participants[0]}{schedule.participants.length > 1 && ` 외 ${schedule.participants.length - 1}명`}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 상태 */}
            <div className="text-sm text-text-secondary">
              {schedule.status === 'scheduled' && '예정'}
              {schedule.status === 'completed' && '완료'}
              {schedule.status === 'cancelled' && '취소'}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function SchedulePage() {
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar')
  const [isEditMode, setIsEditMode] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>(sampleSchedules)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // 일정 추가 핸들러
  const handleAddSchedule = (newSchedule: Omit<Schedule, 'id'>) => {
    const schedule: Schedule = {
      ...newSchedule,
      id: Date.now().toString(),
      status: 'scheduled'
    }
    setSchedules([...schedules, schedule])
  }

  // 일정 수정 핸들러
  const handleEditSchedule = (updatedSchedule: Schedule) => {
    setSchedules(schedules.map(s => 
      s.id === updatedSchedule.id ? updatedSchedule : s
    ))
  }

  // 일정 삭제 핸들러
  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter(s => s.id !== scheduleId))
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Toolbar */}
      <ScheduleToolbar 
        currentView={viewType === 'calendar' ? 'month' : 'today'}
        onViewChange={(view) => {
          if (view === 'today' || view === 'week') {
            setViewType('list')
          } else {
            setViewType('calendar')
          }
        }}
        onAddSchedule={() => setIsModalOpen(true)}
        isEditMode={isEditMode}
        onEditModeToggle={() => setIsEditMode(!isEditMode)}
        currentDate={new Date()}
        onDateChange={(date) => {
          console.log('Date changed:', date)
        }}
      />

      {/* Main Content */}
      <div className="flex gap-6 mt-6">
        {/* Calendar/List View */}
        <div className="flex-1">
          <Card className="p-6">
            {viewType === 'calendar' ? (
              <ScheduleCalendar 
                schedules={schedules}
                onDateClick={(date: Date) => {
                  setIsModalOpen(true)
                }}
                onEventClick={(schedule: any) => {
                  setSelectedSchedule(schedule)
                  setIsEditModalOpen(true)
                }}
                isEditMode={isEditMode}
              />
            ) : (
              <ScheduleListView 
                schedules={schedules}
                onScheduleClick={(schedule) => {
                  setSelectedSchedule(schedule)
                  setIsEditModalOpen(true)
                }}
              />
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 hidden lg:block">
          <ScheduleSidebar 
            schedules={schedules}
            onStatusUpdate={(scheduleId: string, newStatus: string) => {
              setSchedules(schedules.map(s => 
                s.id === scheduleId ? { ...s, status: newStatus as 'scheduled' | 'completed' | 'cancelled' } : s
              ))
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data: any) => {
          handleAddSchedule({
            ...data,
            status: 'scheduled' as const
          })
        }}
      />
      
      <ScheduleEventModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedSchedule(null)
        }}
        event={selectedSchedule ? {
          id: selectedSchedule.id,
          title: selectedSchedule.title,
          date: selectedSchedule.date,
          time: selectedSchedule.time,
          priority: selectedSchedule.priority,
          category: selectedSchedule.category,
          description: selectedSchedule.description || '',
          recurrence: selectedSchedule.recurrence || 'none'
        } : null}
        onSave={(event: any) => {
          if (selectedSchedule) {
            handleEditSchedule({
              ...selectedSchedule,
              ...event
            })
          }
        }}
        onDelete={handleDeleteSchedule}
      />
    </div>
  )
}