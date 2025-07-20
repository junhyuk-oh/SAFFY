"use client"

import { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmModal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ScheduleEvent {
  id: string
  title: string
  date: string
  time: string
  priority: "high" | "medium" | "low"
  category: string
  description: string
  recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly"
}

interface ScheduleEventModalProps {
  isOpen: boolean
  onClose: () => void
  event?: ScheduleEvent | null
  onSave: (event: ScheduleEvent) => void
  onDelete?: (eventId: string) => void
}

const priorityOptions = [
  { value: "high", label: "높음", color: "bg-red-500" },
  { value: "medium", label: "보통", color: "bg-yellow-500" },
  { value: "low", label: "낮음", color: "bg-green-500" }
]

const recurrenceOptions = [
  { value: "none", label: "반복 없음" },
  { value: "daily", label: "매일" },
  { value: "weekly", label: "매주" },
  { value: "monthly", label: "매월" },
  { value: "yearly", label: "매년" }
]

const categoryOptions = [
  "안전 점검",
  "교육 일정",
  "회의",
  "보고서 제출",
  "감사/심사",
  "기타"
]

export function ScheduleEventModal({ 
  isOpen, 
  onClose, 
  event, 
  onSave, 
  onDelete 
}: ScheduleEventModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState<ScheduleEvent>({
    id: "",
    title: "",
    date: "",
    time: "",
    priority: "medium",
    category: categoryOptions[0],
    description: "",
    recurrence: "none"
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ScheduleEvent, string>>>({})

  // 이벤트가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (event) {
      setFormData(event)
    } else {
      // 새 이벤트인 경우 초기화
      setFormData({
        id: Date.now().toString(),
        title: "",
        date: new Date().toISOString().split('T')[0],
        time: "09:00",
        priority: "medium",
        category: categoryOptions[0],
        description: "",
        recurrence: "none"
      })
    }
    setErrors({})
  }, [event])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ScheduleEvent, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요"
    }
    if (!formData.date) {
      newErrors.date = "날짜를 선택해주세요"
    }
    if (!formData.time) {
      newErrors.time = "시간을 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id)
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  const handleInputChange = (field: keyof ScheduleEvent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        <ModalHeader 
          title={event ? "일정 편집" : "새 일정 추가"} 
          onClose={onClose} 
        />
        
        <ModalBody className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={cn(
                "w-full px-3 py-2 rounded-notion-sm border transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                errors.title 
                  ? "border-red-500 bg-red-50/50" 
                  : "border-border hover:border-text-tertiary"
              )}
              placeholder="일정 제목을 입력하세요"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* 날짜와 시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                날짜 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-notion-sm border transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  errors.date 
                    ? "border-red-500 bg-red-50/50" 
                    : "border-border hover:border-text-tertiary"
                )}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                시간 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-notion-sm border transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  errors.time 
                    ? "border-red-500 bg-red-50/50" 
                    : "border-border hover:border-text-tertiary"
                )}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          {/* 우선순위 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              우선순위
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange("priority", option.value as any)}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-notion-sm border transition-all",
                    "flex items-center justify-center gap-2",
                    formData.priority === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-text-tertiary"
                  )}
                >
                  <span 
                    className={cn(
                      "w-3 h-3 rounded-full",
                      option.color
                    )} 
                  />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              카테고리
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 rounded-notion-sm border border-border hover:border-text-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 반복 설정 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              반복 설정
            </label>
            <select
              value={formData.recurrence}
              onChange={(e) => handleInputChange("recurrence", e.target.value as any)}
              className="w-full px-3 py-2 rounded-notion-sm border border-border hover:border-text-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {recurrenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-notion-sm border border-border hover:border-text-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="일정에 대한 상세 설명을 입력하세요"
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-between">
          <div>
            {event && onDelete && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                삭제
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>
              {event ? "저장" : "추가"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="일정 삭제"
        message="이 일정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </>
  )
}