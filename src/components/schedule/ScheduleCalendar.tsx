"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Grid3x3, List } from 'lucide-react'

// 타입 정의
interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  priority: 'high' | 'medium' | 'low'
  color?: string
}

type ViewMode = 'month' | 'week' | 'day'

interface CalendarDayProps {
  date: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  onDayClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  viewMode: ViewMode
}

// 우선순위별 색상 매핑
const priorityColors = {
  high: 'bg-red-500 hover:bg-red-600 text-white',
  medium: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  low: 'bg-green-500 hover:bg-green-600 text-white'
}

// 날짜 유틸리티 함수
const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  const days: Date[] = []
  
  // 이전 달의 날짜들 (첫 주 채우기)
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i))
  }
  
  // 현재 달의 날짜들
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }
  
  // 다음 달의 날짜들 (마지막 주 채우기)
  const remainingDays = 42 - days.length // 6주 * 7일
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i))
  }
  
  return days
}

const getWeekDays = (date: Date): Date[] => {
  const days: Date[] = []
  const dayOfWeek = date.getDay()
  const sunday = new Date(date)
  sunday.setDate(date.getDate() - dayOfWeek)
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday)
    day.setDate(sunday.getDate() + i)
    days.push(day)
  }
  
  return days
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long' 
  })
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

// 캘린더 날짜 컴포넌트
const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  events,
  isCurrentMonth,
  isToday,
  isSelected,
  onDayClick,
  onEventClick,
  viewMode
}) => {
  const dayEvents = events.filter(event => isSameDay(event.date, date))
  
  return (
    <div
      className={cn(
        "min-h-[100px] p-2 border border-gray-200 cursor-pointer transition-all",
        "hover:bg-gray-50",
        !isCurrentMonth && "bg-gray-50 text-gray-400",
        isToday && "bg-blue-50 border-blue-300",
        isSelected && "ring-2 ring-blue-500"
      )}
      onClick={() => onDayClick(date)}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={cn(
          "text-sm font-medium",
          isToday && "text-blue-600"
        )}>
          {date.getDate()}
        </span>
        {dayEvents.length > 0 && viewMode === 'month' && (
          <span className="text-xs text-gray-500">
            {dayEvents.length}건
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        {viewMode === 'month' ? (
          // 월간 뷰: 간단한 이벤트 표시
          dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className={cn(
                "text-xs px-1 py-0.5 rounded truncate cursor-pointer",
                priorityColors[event.priority]
              )}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              title={event.title}
            >
              {event.title}
            </div>
          ))
        ) : (
          // 주간/일간 뷰: 시간과 함께 표시
          dayEvents.map((event) => (
            <div
              key={event.id}
              className={cn(
                "text-xs px-2 py-1 rounded cursor-pointer",
                priorityColors[event.priority]
              )}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
            >
              <div className="font-medium truncate">{event.title}</div>
              <div className="text-xs opacity-90">
                {event.startTime} - {event.endTime}
              </div>
            </div>
          ))
        )}
        {dayEvents.length > 3 && viewMode === 'month' && (
          <div className="text-xs text-gray-500 pl-1">
            +{dayEvents.length - 3}개 더보기
          </div>
        )}
      </div>
    </div>
  )
}

// Props 인터페이스 추가
interface ScheduleCalendarProps {
  schedules?: any[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: any) => void
  isEditMode?: boolean
}

// 메인 캘린더 컴포넌트
export function ScheduleCalendar({ 
  schedules = [], 
  onDateClick, 
  onEventClick,
  isEditMode = false 
}: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [events, setEvents] = useState<CalendarEvent[]>([
    // 샘플 이벤트 데이터
    {
      id: '1',
      title: '안전교육',
      description: '월간 안전교육 실시',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      priority: 'high'
    },
    {
      id: '2',
      title: '실험실 점검',
      description: '정기 실험실 안전점검',
      date: new Date(),
      startTime: '14:00',
      endTime: '16:00',
      priority: 'medium'
    },
    {
      id: '3',
      title: '장비 유지보수',
      description: '실험장비 정기 점검',
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      startTime: '10:00',
      endTime: '12:00',
      priority: 'low'
    }
  ])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  // 네비게이션 함수
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() - 7)
        break
      case 'day':
        newDate.setDate(newDate.getDate() - 1)
        break
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + 7)
        break
      case 'day':
        newDate.setDate(newDate.getDate() + 1)
        break
    }
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  // 이벤트 핸들러
  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    if (viewMode !== 'day') {
      // 날짜 클릭시 이벤트 추가 모달 열기
      setIsAddingEvent(true)
    }
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  // 캘린더 렌더링
  const renderCalendar = () => {
    const today = new Date()
    
    switch (viewMode) {
      case 'month': {
        const days = getDaysInMonth(currentDate)
        const weekDays = ['일', '월', '화', '수', '목', '금', '토']
        
        return (
          <div className="grid grid-cols-7 gap-0">
            {/* 요일 헤더 */}
            {weekDays.map((day) => (
              <div key={day} className="text-center py-2 font-medium text-sm border-b border-gray-200">
                {day}
              </div>
            ))}
            
            {/* 날짜 그리드 */}
            {days.map((day, index) => (
              <CalendarDay
                key={index}
                date={day}
                events={events}
                isCurrentMonth={day.getMonth() === currentDate.getMonth()}
                isToday={isSameDay(day, today)}
                isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                viewMode={viewMode}
              />
            ))}
          </div>
        )
      }
      
      case 'week': {
        const weekDays = getWeekDays(currentDate)
        const dayNames = ['일', '월', '화', '수', '목', '금', '토']
        
        return (
          <div className="grid grid-cols-7 gap-0">
            {/* 요일 헤더 */}
            {weekDays.map((day, index) => (
              <div key={index} className="text-center py-2 font-medium text-sm border-b border-gray-200">
                <div>{dayNames[index]}</div>
                <div className={cn(
                  "text-lg",
                  isSameDay(day, today) && "text-blue-600 font-bold"
                )}>
                  {day.getDate()}
                </div>
              </div>
            ))}
            
            {/* 날짜 그리드 */}
            {weekDays.map((day, index) => (
              <CalendarDay
                key={index}
                date={day}
                events={events}
                isCurrentMonth={true}
                isToday={isSameDay(day, today)}
                isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                viewMode={viewMode}
              />
            ))}
          </div>
        )
      }
      
      case 'day': {
        const dayEvents = events.filter(event => isSameDay(event.date, currentDate))
        
        return (
          <div className="space-y-4">
            <div className="text-center py-4 border-b">
              <h3 className="text-xl font-semibold">
                {formatDate(currentDate)}
              </h3>
            </div>
            
            <div className="space-y-2 p-4">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-4 rounded-lg cursor-pointer transition-all",
                      priorityColors[event.priority]
                    )}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm mt-1 opacity-90">{event.description}</p>
                        )}
                      </div>
                      <div className="text-sm">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  이 날짜에 예정된 일정이 없습니다.
                </div>
              )}
            </div>
          </div>
        )
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">일정 관리</CardTitle>
          
          <div className="flex items-center gap-2">
            {/* 뷰 모드 선택 */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
                className="px-3"
              >
                <Grid3x3 className="w-4 h-4 mr-1" />
                월
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="px-3"
              >
                <Calendar className="w-4 h-4 mr-1" />
                주
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
                className="px-3"
              >
                <List className="w-4 h-4 mr-1" />
                일
              </Button>
            </div>
            
            {/* 일정 추가 버튼 */}
            <Button
              onClick={() => setIsAddingEvent(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              일정 추가
            </Button>
          </div>
        </div>
        
        {/* 네비게이션 */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={navigatePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={navigateToday}
            >
              오늘
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={navigateNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold">
            {viewMode === 'day' 
              ? formatDate(currentDate)
              : formatMonthYear(currentDate)
            }
          </h2>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>높음</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>보통</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>낮음</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {renderCalendar()}
      </CardContent>
      
      {/* 이벤트 상세 모달 */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{selectedEvent.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedEvent.description && (
                  <p className="text-gray-600">{selectedEvent.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={cn(
                    "px-2 py-1 rounded text-xs",
                    priorityColors[selectedEvent.priority]
                  )}>
                    {selectedEvent.priority === 'high' ? '높음' : 
                     selectedEvent.priority === 'medium' ? '보통' : '낮음'}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEvent(null)}
                >
                  닫기
                </Button>
                <Button variant="destructive">
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
}