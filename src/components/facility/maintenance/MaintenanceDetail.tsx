"use client"

import { useState } from "react"
import { MaintenanceTask } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { MAINTENANCE_STATUS, PRIORITY_CONFIG } from "@/lib/constants/status"
import { formatDateTime } from "@/lib/utils/date"

interface MaintenanceDetailProps {
  task: MaintenanceTask
  onEdit?: () => void
  onStatusChange?: (status: MaintenanceTask['status']) => void
  onComplete?: (completionData: any) => void
  onDelete?: () => void
  canEdit?: boolean
  canComplete?: boolean
}

const categoryIcons: Record<string, string> = {
  "Electrical": "⚡",
  "HVAC": "🌡️",
  "Plumbing": "🚰",
  "Fire Safety": "🔥", 
  "Security": "🔒",
  "Structural": "🏗️",
  "Equipment": "⚙️",
  "Cleaning": "🧹",
  "Preventive": "🔧",
  "Corrective": "🔨",
  "Emergency": "🆘",
  "Inspection": "🔍",
  "Calibration": "📊",
  "Software Update": "💻",
  "Safety Check": "✅"
}

export function MaintenanceDetail({
  task,
  onEdit,
  onStatusChange,
  onComplete,
  onDelete,
  canEdit = false,
  canComplete = false
}: MaintenanceDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'history' | 'attachments'>('overview')
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [completionNotes, setCompletionNotes] = useState('')
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    new Set(task.checklist?.filter(item => item.completed).map(item => item.id) || [])
  )

  const statusInfo = MAINTENANCE_STATUS[task.status]
  const priorityInfo = PRIORITY_CONFIG[task.priority]
  const categoryIcon = categoryIcons[task.category] || "📋"

  // 기한까지 남은 시간 계산
  const getTimeUntilDue = () => {
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}일 지연`, urgent: true, type: 'overdue' }
    if (diffDays === 0) return { text: "오늘 마감", urgent: true, type: 'today' }
    if (diffDays === 1) return { text: "내일 마감", urgent: true, type: 'tomorrow' }
    if (diffDays <= 3) return { text: `${diffDays}일 남음`, urgent: true, type: 'soon' }
    return { text: `${diffDays}일 남음`, urgent: false, type: 'normal' }
  }

  // 진행률 계산
  const getProgress = () => {
    if (!task.checklist || task.checklist.length === 0) return 0
    return Math.round((task.checklist.filter(item => item.completed).length / task.checklist.length) * 100)
  }

  const timeInfo = getTimeUntilDue()
  const progress = getProgress()

  const handleToggleChecklistItem = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems)
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId)
    } else {
      newCheckedItems.add(itemId)
    }
    setCheckedItems(newCheckedItems)
  }

  const handleComplete = () => {
    if (onComplete) {
      const completionData = {
        completedDate: new Date().toISOString(),
        completionNotes,
        checklist: task.checklist?.map(item => ({
          ...item,
          completed: checkedItems.has(item.id)
        }))
      }
      onComplete(completionData)
      setShowCompleteModal(false)
      setCompletionNotes('')
    }
  }

  const tabs = [
    { id: 'overview', label: '개요', icon: '📋' },
    { id: 'checklist', label: '체크리스트', icon: '✅' },
    { id: 'history', label: '이력', icon: '📝' },
    { id: 'attachments', label: '첨부파일', icon: '📎' }
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <span className="text-4xl">{categoryIcon}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-2">{task.title}</h1>
              <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
                <span>#{task.id}</span>
                <span>•</span>
                <span>{task.category}</span>
                <span>•</span>
                <span>{task.location}</span>
                {task.equipmentName && (
                  <>
                    <span>•</span>
                    <span>장비: {task.equipmentName}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  className={`${statusInfo.bg} ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </Badge>
                <Badge 
                  className={`${priorityInfo.bg} ${priorityInfo.color}`}
                >
                  {priorityInfo.label} 우선순위
                </Badge>
                <div className={`text-sm font-medium ${
                  timeInfo.urgent ? 'text-error-text' : 'text-text-primary'
                }`}>
                  {timeInfo.text}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canComplete && task.status === 'in_progress' && (
              <Button
                size="sm"
                onClick={() => setShowCompleteModal(true)}
                className="bg-success hover:bg-success/90"
              >
                <span className="mr-1">✅</span>
                완료
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <span className="mr-1">✏️</span>
                편집
              </Button>
            )}
            {onStatusChange && (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value as MaintenanceTask['status'])}
                className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
              >
                <option value="scheduled">예정</option>
                <option value="in_progress">진행중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
                <option value="overdue">지연</option>
              </select>
            )}
          </div>
        </div>

        {/* 진행률 표시 */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">진행률</span>
              <span className="text-sm font-medium text-text-primary">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-background-secondary rounded-notion-md">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* 개요 탭 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">작업 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-text-secondary">담당자</div>
                    <div className="font-medium text-text-primary mt-1">
                      {task.assignedTo?.name || '미지정'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">마감일</div>
                    <div className="font-medium text-text-primary mt-1">
                      {formatDateTime(task.dueDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">빈도</div>
                    <div className="font-medium text-text-primary mt-1">
                      {task.frequency}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">예상 소요시간</div>
                    <div className="font-medium text-text-primary mt-1">
                      {task.estimatedDuration}분
                    </div>
                  </div>
                  {task.cost && (
                    <div>
                      <div className="text-sm text-text-secondary">예상 비용</div>
                      <div className="font-medium text-text-primary mt-1">
                        ₩{task.cost.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {task.description && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">작업 설명</h3>
                  <div className="p-4 bg-background rounded-notion-sm">
                    <p className="text-text-primary whitespace-pre-wrap">{task.description}</p>
                  </div>
                </div>
              )}

              {task.safetyPrecautions && task.safetyPrecautions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">안전 주의사항</h3>
                  <div className="space-y-2">
                    {task.safetyPrecautions.map((precaution, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-warning-bg rounded-notion-sm">
                        <span className="text-warning-text">⚠️</span>
                        <span className="text-sm text-text-primary">{precaution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {task.requiredTools && task.requiredTools.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">필요 도구</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.requiredTools.map((tool, index) => (
                      <Badge key={index} variant="secondary">
                        🔧 {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 체크리스트 탭 */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">체크리스트</h3>
                <span className="text-sm text-text-secondary">
                  {checkedItems.size} / {task.checklist?.length || 0} 완료
                </span>
              </div>

              {task.checklist && task.checklist.length > 0 ? (
                <div className="space-y-2">
                  {task.checklist.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-notion-sm border ${
                        checkedItems.has(item.id) 
                          ? 'bg-success-bg border-success' 
                          : 'bg-background border-border'
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkedItems.has(item.id)}
                          onChange={() => handleToggleChecklistItem(item.id)}
                          className="mt-1 rounded border-border"
                          disabled={!canComplete || task.status !== 'in_progress'}
                        />
                        <div className="flex-1">
                          <div className={`font-medium ${
                            checkedItems.has(item.id) 
                              ? 'text-success-text line-through' 
                              : 'text-text-primary'
                          }`}>
                            {item.item}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-text-secondary mt-1">
                              {item.notes}
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-text-secondary">체크리스트가 없습니다</p>
                </div>
              )}
            </div>
          )}

          {/* 이력 탭 */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">작업 이력</h3>
              
              {/* 이력은 별도 데이터가 필요하므로 placeholder */}
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-text-secondary">작업 이력이 없습니다</p>
              </div>
            </div>
          )}

          {/* 첨부파일 탭 */}
          {activeTab === 'attachments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">첨부파일</h3>
              
              {task.attachments && task.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {task.attachments.map((attachment, index) => (
                    <div key={index} className="p-4 bg-background rounded-notion-md border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                          <span className="text-primary">📄</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{attachment.fileName}</h4>
                          <div className="text-sm text-text-secondary mt-1">
                            크기: {Math.round(attachment.fileSize / 1024)}KB
                          </div>
                          <div className="text-xs text-text-tertiary mt-1">
                            업로드: {formatDateTime(attachment.uploadedDate)}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          다운로드
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-text-secondary">첨부파일이 없습니다</p>
                  {canEdit && (
                    <Button size="sm" className="mt-3">
                      파일 업로드
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 완료 모달 */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-notion-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">작업 완료</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  완료 메모
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                  placeholder="작업 완료에 대한 메모를 입력하세요..."
                />
              </div>
              <div className="text-sm text-text-secondary">
                체크리스트: {checkedItems.size} / {task.checklist?.length || 0} 완료
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline" 
                onClick={() => setShowCompleteModal(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-success hover:bg-success/90"
              >
                완료 처리
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}