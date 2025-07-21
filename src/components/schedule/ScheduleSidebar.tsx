"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Schedule, ScheduleStatus, SchedulePriority } from "@/lib/types/schedule"

interface SidebarSchedule {
  id: string
  title: string
  time: string
  type: string
  status: "urgent" | "scheduled" | "completed"
}

// 샘플 데이터 - 실제로는 props나 API로 받아올 것
const mockSchedules: SidebarSchedule[] = [
  { id: "1", title: "화학물질 재고 점검", time: "09:00", type: "점검", status: "urgent" },
  { id: "2", title: "신입 연구원 안전교육", time: "10:00", type: "교육", status: "urgent" },
  { id: "3", title: "월간 안전점검 보고서 제출", time: "14:00", type: "보고", status: "scheduled" },
  { id: "4", title: "실험실 환기시설 점검", time: "15:00", type: "점검", status: "scheduled" },
  { id: "5", title: "안전관리 회의", time: "16:00", type: "회의", status: "scheduled" },
  { id: "6", title: "폐기물 처리 확인", time: "11:00", type: "처리", status: "completed" },
  { id: "7", title: "보호구 착용 교육", time: "13:00", type: "교육", status: "completed" },
]

interface ScheduleSidebarProps {
  schedules?: Schedule[]
  onStatusUpdate?: (scheduleId: string, newStatus: string) => void
}

export function ScheduleSidebar({ schedules, onStatusUpdate }: ScheduleSidebarProps) {
  const [collapsedSections, setCollapsedSections] = useState<string[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setCollapsedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateStatus = (scheduleId: string, newStatus: string) => {
    // API 호출 또는 상태 업데이트 로직
    console.log(`일정 ${scheduleId}의 상태를 ${newStatus}로 변경`)
  }

  // 실제 schedules가 없으면 mockSchedules를 Schedule 형태로 변환
  const displaySchedules = schedules || mockSchedules.map((s): Schedule => ({
    id: s.id,
    title: s.title,
    description: '',
    categoryId: 'default',
    type: 'other',
    status: s.status === 'urgent' ? ScheduleStatus.OVERDUE : 
           s.status === 'scheduled' ? ScheduleStatus.SCHEDULED : 
           ScheduleStatus.COMPLETED,
    priority: s.status === 'urgent' ? SchedulePriority.HIGH : SchedulePriority.MEDIUM,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    allDay: false,
    timezone: 'Asia/Seoul',
    isRecurring: false,
    organizerId: 'system',
    participants: [],
    location: undefined,
    attachments: [],
    tags: [],
    completedAt: s.status === 'completed' ? new Date().toISOString() : undefined,
    completedBy: s.status === 'completed' ? 'system' : undefined,
    cancellationReason: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system'
  }))
  
  // 우선순위별로 일정 그룹화
  const groupedSchedules = {
    urgent: displaySchedules.filter((s) => s.status === ScheduleStatus.OVERDUE),
    scheduled: displaySchedules.filter((s) => s.status === ScheduleStatus.SCHEDULED),
    completed: displaySchedules.filter((s) => s.status === ScheduleStatus.COMPLETED),
  }

  const sectionConfig = {
    urgent: {
      title: "긴급",
      icon: "🚨",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      badgeVariant: "destructive" as const,
    },
    scheduled: {
      title: "예정",
      icon: "📅",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      badgeVariant: "warning" as const,
    },
    completed: {
      title: "완료",
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badgeVariant: "success" as const,
    },
  }

  return (
    <div className="w-80 h-full bg-white border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <span className="text-xl">📅</span>
          오늘의 일정
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </div>

      <div className="p-4 space-y-4">
        {(Object.keys(groupedSchedules) as Array<keyof typeof groupedSchedules>).map(status => {
          const config = sectionConfig[status]
          const items = groupedSchedules[status]
          const isCollapsed = collapsedSections.includes(status)

          return (
            <div
              key={status}
              className={`rounded-lg border ${config.borderColor} ${config.bgColor} transition-all duration-200`}
            >
              <div
                className="px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-opacity-70 transition-colors"
                onClick={() => toggleSection(status)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className={`font-medium ${config.color}`}>
                    {config.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={config.badgeVariant} className="text-xs">
                    {items.length}
                  </Badge>
                  <svg
                    className={`w-4 h-4 ${config.color} transition-transform duration-200 ${
                      isCollapsed ? "" : "rotate-180"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "max-h-0" : "max-h-[500px]"
                }`}
              >
                <div className="px-3 pb-2 space-y-2">
                  {items.map(schedule => (
                    <div
                      key={schedule.id}
                      className={`bg-white rounded-md p-3 cursor-pointer transition-all duration-200 ${
                        selectedSchedule === schedule.id
                          ? "ring-2 ring-primary shadow-sm"
                          : "hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedSchedule(schedule.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-text-primary line-clamp-2">
                            {schedule.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-text-secondary">
                              {new Date(schedule.startDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-xs text-text-tertiary">
                              • {schedule.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {status !== "completed" && (
                        <div className="flex gap-1 mt-2">
                          {status === "urgent" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateStatus(schedule.id, "scheduled")
                              onStatusUpdate?.(schedule.id, "scheduled")
                              }}
                            >
                              예정으로
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              updateStatus(schedule.id, "completed")
                              onStatusUpdate?.(schedule.id, "completed")
                            }}
                          >
                            완료
                          </Button>
                        </div>
                      )}

                      {status === "completed" && (
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              updateStatus(schedule.id, "scheduled")
                              onStatusUpdate?.(schedule.id, "scheduled")
                            }}
                          >
                            다시 예정
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {items.length === 0 && (
                    <p className="text-xs text-text-tertiary text-center py-2">
                      {status === "urgent" && "긴급한 일정이 없습니다"}
                      {status === "scheduled" && "예정된 일정이 없습니다"}
                      {status === "completed" && "완료된 일정이 없습니다"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-border">
        <Button className="w-full" size="sm">
          <span className="mr-2">➕</span>
          새 일정 추가
        </Button>
      </div>
    </div>
  )
}