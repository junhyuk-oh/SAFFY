"use client"

import { useState } from 'react'
import {
  ScheduleCalendar,
  ScheduleSidebar,
  ScheduleToolbar,
  ScheduleEventModal,
  QuickAddModal
} from '@/components/schedule'
import type { ScheduleEvent } from '@/components/schedule/ScheduleEventModal'
import { Card } from '@/components/ui/display'
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react'
import { type Schedule, ScheduleStatus, SchedulePriority } from '@/lib/types/schedule'

// 샘플 데이터
const sampleSchedules: Schedule[] = [
  {
    id: '1',
    title: '월간 안전점검',
    description: '연구실 전체 안전점검',
    categoryId: 'cat-1',
    type: 'safety-inspection' as const,
    status: ScheduleStatus.SCHEDULED,
    priority: SchedulePriority.HIGH,
    startDate: '2025-07-20T10:00:00',
    endDate: '2025-07-20T12:00:00',
    allDay: false,
    timezone: 'Asia/Seoul',
    isRecurring: false,
    location: {
      name: '제1연구동',
      address: '',
      room: '',
      onlineUrl: undefined
    },
    participants: [
      { userId: 'user1', role: 'required' as const, responseStatus: 'accepted' },
      { userId: 'user2', role: 'required' as const, responseStatus: 'accepted' }
    ],
    organizerId: 'admin',
    tags: [],
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin'
  },
  {
    id: '2',
    title: '신입사원 안전교육',
    description: '신규 입사자 대상 안전교육',
    categoryId: 'cat-2',
    type: 'education' as const,
    status: ScheduleStatus.SCHEDULED,
    priority: SchedulePriority.MEDIUM,
    startDate: '2025-07-21T14:00:00',
    endDate: '2025-07-21T16:00:00',
    allDay: false,
    timezone: 'Asia/Seoul',
    isRecurring: false,
    location: {
      name: '교육장 A',
      address: '',
      room: '',
      onlineUrl: undefined
    },
    participants: [
      { userId: 'user3', role: 'required' as const, responseStatus: 'accepted' }
    ],
    organizerId: 'admin',
    tags: [],
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin'
  },
  {
    id: '3',
    title: '안전관리위원회 회의',
    description: '분기별 안전관리 현황 검토',
    categoryId: 'cat-3',
    type: 'meeting' as const,
    status: ScheduleStatus.SCHEDULED,
    priority: SchedulePriority.MEDIUM,
    startDate: '2025-07-25T15:00:00',
    endDate: '2025-07-25T17:00:00',
    allDay: false,
    timezone: 'Asia/Seoul',
    isRecurring: false,
    location: {
      name: '회의실 301',
      address: '',
      room: '301',
      onlineUrl: undefined
    },
    participants: [],
    organizerId: 'admin',
    tags: [],
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin'
  },
  {
    id: '4',
    title: '외부 안전감사',
    description: '정부 안전감사',
    categoryId: 'cat-4',
    type: 'audit' as const,
    status: ScheduleStatus.SCHEDULED,
    priority: SchedulePriority.HIGH,
    startDate: '2025-07-27T09:00:00',
    endDate: '2025-07-27T18:00:00',
    allDay: false,
    timezone: 'Asia/Seoul',
    isRecurring: false,
    location: {
      name: '전체 사업장',
      address: '',
      room: '',
      onlineUrl: undefined
    },
    participants: [],
    organizerId: 'admin',
    tags: [],
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin'
  },
  {
    id: '5',
    title: '비상대피 훈련',
    description: '화재 대피 훈련',
    categoryId: 'cat-5',
    type: 'other' as const,
    status: ScheduleStatus.SCHEDULED,
    priority: SchedulePriority.HIGH,
    startDate: '2025-07-30T16:00:00',
    endDate: '2025-07-30T17:00:00',
    allDay: false,
    timezone: 'Asia/Seoul',
    isRecurring: false,
    location: {
      name: '전 건물',
      address: '',
      room: '',
      onlineUrl: undefined
    },
    participants: [],
    organizerId: 'admin',
    tags: [],
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin'
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
      case 'safety-inspection': return '🔍'
      case 'education': return '🎓'
      case 'meeting': return '💼'
      case 'audit': return '📋'
      case 'equipment-maintenance': return '🔧'
      case 'document-submission': return '📄'
      case 'other': return '🚨'
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
              <div className="text-3xl">{getCategoryIcon(schedule.type)}</div>
              
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
                    <span>{new Date(schedule.startDate).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(schedule.startDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {schedule.location?.name && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule.location.name}</span>
                    </div>
                  )}
                  {schedule.participants && schedule.participants.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>참여자 {schedule.participants.length}명</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 상태 */}
            <div className="text-sm text-text-secondary">
              {schedule.status === ScheduleStatus.SCHEDULED && '예정'}
              {schedule.status === ScheduleStatus.COMPLETED && '완료'}
              {schedule.status === ScheduleStatus.CANCELLED && '취소'}
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
      status: ScheduleStatus.SCHEDULED
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
                onDateClick={() => {
                  setIsModalOpen(true)
                }}
                onEventClick={(schedule: Schedule) => {
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
                s.id === scheduleId ? { ...s, status: newStatus as ScheduleStatus } : s
              ))
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          handleAddSchedule({
            title: data.title,
            description: data.description || '',
            startDate: data.date + (data.time ? `T${data.time}:00` : 'T09:00:00'),
            endDate: data.date + (data.time ? `T${data.time}:00` : 'T18:00:00'),
            priority: (data.priority === 'high' ? SchedulePriority.HIGH : 
                      data.priority === 'low' ? SchedulePriority.LOW : 
                      SchedulePriority.MEDIUM),
            status: ScheduleStatus.SCHEDULED,
            categoryId: 'default',
            type: 'other',
            allDay: !data.time,
            timezone: 'Asia/Seoul',
            isRecurring: data.recurrence !== 'none',
            organizerId: 'current-user',
            participants: [],
            resources: [],
            attachments: [],
            tags: [],
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user',
            updatedBy: 'current-user'
          } as Omit<Schedule, 'id'>)
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
          date: selectedSchedule.startDate,
          time: new Date(selectedSchedule.startDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          priority: selectedSchedule.priority as 'high' | 'medium' | 'low',
          category: selectedSchedule.type,
          description: selectedSchedule.description || '',
          recurrence: selectedSchedule.isRecurring ? 'daily' : 'none'
        } as ScheduleEvent : null}
        onSave={(event: Partial<ScheduleEvent>) => {
          if (selectedSchedule) {
            handleEditSchedule({
              ...selectedSchedule,
              title: event.title || selectedSchedule.title,
              description: event.description || selectedSchedule.description,
              priority: event.priority ? 
                (event.priority === 'high' ? SchedulePriority.HIGH : 
                 event.priority === 'low' ? SchedulePriority.LOW : 
                 SchedulePriority.MEDIUM) : selectedSchedule.priority
            })
          }
        }}
        onDelete={handleDeleteSchedule}
      />
    </div>
  )
}