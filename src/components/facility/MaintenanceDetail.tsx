"use client"

import { useState } from "react"
import { MaintenanceTask } from "@/lib/types/facility"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface MaintenanceDetailProps {
  task: MaintenanceTask
  onEdit?: () => void
  onStatusChange?: (status: MaintenanceTask['status']) => void
  onComplete?: (completionData: any) => void
  onDelete?: () => void
  canEdit?: boolean
  canComplete?: boolean
}

const statusConfig = {
  scheduled: {
    label: "예정됨",
    color: "text-primary",
    bg: "bg-blue-50",
    icon: "📅"
  },
  in_progress: {
    label: "진행중",
    color: "text-warning-text",
    bg: "bg-warning-bg",
    icon: "⚡"
  },
  completed: {
    label: "완료",
    color: "text-success-text", 
    bg: "bg-success-bg",
    icon: "✅"
  },
  overdue: {
    label: "지연",
    color: "text-error-text",
    bg: "bg-error-bg",
    icon: "⏰"
  },
  cancelled: {
    label: "취소",
    color: "text-text-tertiary",
    bg: "bg-gray-100",
    icon: "❌"
  },
  on_hold: {
    label: "보류",
    color: "text-text-secondary",
    bg: "bg-background-hover",
    icon: "⏸️"
  }
}

const priorityConfig = {
  low: {
    label: "낮음",
    color: "text-success-text",
    bg: "bg-success-bg"
  },
  medium: {
    label: "보통", 
    color: "text-warning-text",
    bg: "bg-warning-bg"
  },
  high: {
    label: "높음",
    color: "text-error-text",
    bg: "bg-error-bg"
  },
  critical: {
    label: "긴급",
    color: "text-white",
    bg: "bg-red-600"
  }
}

const categoryIcons: Record<string, string> = {
  "Electrical": "⚡",
  "HVAC": "🌡️",
  "Plumbing": "🔧",
  "Fire Safety": "🔥", 
  "Security": "🛡️",
  "Structural": "🏗️",
  "Equipment": "⚙️",
  "Cleaning": "🧹",
  "Preventive": "🔄",
  "Corrective": "🔧",
  "Emergency": "🚨",
  "Inspection": "🔍",
  "Calibration": "📏",
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
  const [activeTab, setActiveTab] = useState<'overview' | 'safety' | 'checklist' | 'materials' | 'history'>('overview')
  const [completionNotes, setCompletionNotes] = useState('')
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const statusInfo = statusConfig[task.status]
  const priorityInfo = priorityConfig[task.priority]
  const categoryIcon = categoryIcons[task.category] || "🔧"

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        actualDuration: task.estimatedDuration, // 실제로는 사용자 입력 받아야 함
        notes: completionNotes,
        completedDate: new Date().toISOString()
      })
      setShowCompleteModal(false)
      setCompletionNotes('')
    }
  }

  const tabs = [
    { id: 'overview', label: '개요', icon: '📋' },
    { id: 'safety', label: '안전정보', icon: '🛡️' },
    { id: 'checklist', label: '체크리스트', icon: '✅' },
    { id: 'materials', label: '자재/도구', icon: '📦' },
    { id: 'history', label: '이력', icon: '📝' }
  ] as const

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <span className="text-4xl">{categoryIcon}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-2">{task.title}</h1>
              <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
                <span>{task.category}</span>
                <span>•</span>
                <span>{task.location}</span>
                {task.subLocation && (
                  <>
                    <span>•</span>
                    <span>{task.subLocation}</span>
                  </>
                )}
                {task.workOrder && (
                  <>
                    <span>•</span>
                    <span>WO: {task.workOrder}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={`${statusInfo.bg} ${statusInfo.color}`}>
                  <span className="mr-1">{statusInfo.icon}</span>
                  {statusInfo.label}
                </Badge>
                <Badge className={priorityInfo.bg + ' ' + priorityInfo.color}>
                  {priorityInfo.label}
                </Badge>
                <div className={`text-sm font-medium ${timeInfo.urgent ? 'text-error-text' : 'text-text-primary'}`}>
                  {timeInfo.text}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canComplete && task.status !== 'completed' && (
              <Button
                size="sm"
                onClick={() => setShowCompleteModal(true)}
                className="bg-success hover:bg-success/90"
              >
                <span className="mr-1">✅</span>
                작업 완료
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <span className="mr-1">✏️</span>
                수정
              </Button>
            )}
            {onStatusChange && (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value as MaintenanceTask['status'])}
                className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
              >
                <option value="scheduled">예정됨</option>
                <option value="in_progress">진행중</option>
                <option value="on_hold">보류</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
              </select>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-text-secondary mb-4">{task.description}</p>
        )}

        {/* 진행률 표시 */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">진행률</span>
              <span className="text-sm font-medium text-text-primary">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-background-hover rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 기본 정보 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">담당자</div>
            <div className="font-medium text-text-primary flex items-center gap-2 mt-1">
              <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-semibold">
                {task.assignedTo.name.charAt(0)}
              </div>
              <span>{task.assignedTo.name}</span>
            </div>
          </div>
          <div>
            <div className="text-text-secondary">신청자</div>
            <div className="font-medium text-text-primary mt-1">{task.reportedBy.name}</div>
          </div>
          <div>
            <div className="text-text-secondary">예정일</div>
            <div className="font-medium text-text-primary mt-1">{formatDate(task.scheduledDate)}</div>
          </div>
          <div>
            <div className="text-text-secondary">마감일</div>
            <div className={`font-medium mt-1 ${timeInfo.urgent ? 'text-error-text' : 'text-text-primary'}`}>
              {formatDate(task.dueDate)}
            </div>
          </div>
        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">작업 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">예상 소요시간</span>
                      <span className="text-text-primary">{task.estimatedDuration}분</span>
                    </div>
                    {task.actualDuration && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">실제 소요시간</span>
                        <span className="text-text-primary">{task.actualDuration}분</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">생성일</span>
                      <span className="text-text-primary">{formatDate(task.createdAt)}</span>
                    </div>
                    {task.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">완료일</span>
                        <span className="text-text-primary">{formatDate(task.completedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {task.equipmentName && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">관련 장비</h3>
                    <div className="p-4 bg-background rounded-notion-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚙️</span>
                        <div>
                          <div className="font-medium text-text-primary">{task.equipmentName}</div>
                          <div className="text-sm text-text-secondary">장비 ID: {task.equipmentId}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {task.cost && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">비용 정보</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.labor.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">인건비</div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.materials.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">자재비</div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.external.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">외주비</div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-primary">{task.cost.total.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">총 비용</div>
                    </div>
                  </div>
                </div>
              )}

              {task.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">추가 메모</h3>
                  <div className="p-4 bg-background rounded-notion-sm">
                    <p className="text-text-primary whitespace-pre-wrap">{task.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 안전정보 탭 */}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              {/* 안전 알림 */}
              <div className="flex items-center gap-3 p-4 bg-warning-bg text-warning-text rounded-notion-md">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-semibold">안전 주의사항</div>
                  <div className="text-sm">작업 시작 전 모든 안전 요구사항을 확인하세요</div>
                </div>
              </div>

              {/* 안전 옵션 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">안전 요구사항</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-3 p-3 rounded-notion-sm ${
                      task.safety.lockoutTagout ? 'bg-error-bg text-error-text' : 'bg-background'
                    }`}>
                      <span>{task.safety.lockoutTagout ? '✅' : '❌'}</span>
                      <span>LOTO (잠금표시) 필요</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-notion-sm ${
                      task.safety.permitRequired ? 'bg-warning-bg text-warning-text' : 'bg-background'
                    }`}>
                      <span>{task.safety.permitRequired ? '✅' : '❌'}</span>
                      <span>작업허가서 필요</span>
                      {task.safety.permitId && (
                        <span className="text-sm">({task.safety.permitId})</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 위험요소 */}
              {task.safety.hazards.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">식별된 위험요소</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {task.safety.hazards.map((hazard, index) => (
                      <div key={index} className="p-3 bg-error-bg text-error-text rounded-notion-sm text-sm">
                        <span className="mr-2">⚠️</span>
                        {hazard}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 예방조치 */}
              {task.safety.precautions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">예방조치</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {task.safety.precautions.map((precaution, index) => (
                      <div key={index} className="p-3 bg-success-bg text-success-text rounded-notion-sm text-sm">
                        <span className="mr-2">✅</span>
                        {precaution}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 필요한 PPE */}
              {task.safety.requiredPPE.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">필요한 보호구 (PPE)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {task.safety.requiredPPE.map((ppe, index) => (
                      <div key={index} className="p-3 bg-primary-light text-primary rounded-notion-sm text-sm text-center">
                        <span className="mr-2">🛡️</span>
                        {ppe}
                      </div>
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
                <h3 className="text-lg font-semibold text-text-primary">작업 체크리스트</h3>
                {task.checklist && (
                  <div className="text-sm text-text-secondary">
                    {task.checklist.filter(item => item.completed).length} / {task.checklist.length} 완료
                  </div>
                )}
              </div>

              {task.checklist && task.checklist.length > 0 ? (
                <div className="space-y-3">
                  {task.checklist.map((item, index) => (
                    <div key={index} className={`p-4 rounded-notion-md border ${
                      item.completed ? 'bg-success-bg border-success' : 'bg-background border-border'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          item.completed 
                            ? 'bg-success border-success text-white' 
                            : 'border-border bg-background'
                        }`}>
                          {item.completed && <span className="text-sm">✓</span>}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            item.completed ? 'text-success-text line-through' : 'text-text-primary'
                          }`}>
                            {item.item}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-text-secondary mt-1">{item.notes}</div>
                          )}
                          {item.completed && item.completedBy && (
                            <div className="text-xs text-text-tertiary mt-1">
                              {item.completedBy} • {item.completedDate && formatDate(item.completedDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <div className="text-4xl mb-2">📋</div>
                  <p>체크리스트가 없습니다</p>
                </div>
              )}
            </div>
          )}

          {/* 자재/도구 탭 */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">필요한 자재 및 도구</h3>

              {task.materials && task.materials.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-sm font-semibold text-text-primary">자재명</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">수량</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">단위</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">단가</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">합계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {task.materials.map((material, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 text-text-primary">{material.name}</td>
                          <td className="py-3 text-right text-text-primary">{material.quantity}</td>
                          <td className="py-3 text-right text-text-primary">{material.unit}</td>
                          <td className="py-3 text-right text-text-primary">
                            {material.cost ? `₩${material.cost.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-3 text-right font-medium text-text-primary">
                            {material.cost ? `₩${(material.cost * material.quantity).toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {task.materials.some(m => m.cost) && (
                    <div className="mt-4 p-4 bg-background rounded-notion-sm">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>자재비 총계</span>
                        <span className="text-primary">
                          ₩{task.materials.reduce((sum, m) => sum + (m.cost || 0) * m.quantity, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <div className="text-4xl mb-2">📦</div>
                  <p>등록된 자재가 없습니다</p>
                </div>
              )}
            </div>
          )}

          {/* 이력 탭 */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">작업 이력</h3>
              
              <div className="space-y-4">
                {/* 생성 이벤트 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-background-hover rounded-full flex items-center justify-center">
                    <span className="text-sm">📝</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">작업 생성</div>
                    <div className="text-sm text-text-secondary">
                      {task.reportedBy.name}이(가) 작업을 생성했습니다
                    </div>
                    <div className="text-xs text-text-tertiary">{formatDate(task.createdAt)}</div>
                  </div>
                </div>

                {/* 승인 이벤트 */}
                {task.approvedBy && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                      <span className="text-sm text-success-text">✅</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">작업 승인</div>
                      <div className="text-sm text-text-secondary">
                        {task.approvedBy.name}이(가) 작업을 승인했습니다
                      </div>
                      <div className="text-xs text-text-tertiary">{formatDate(task.approvedBy.date)}</div>
                    </div>
                  </div>
                )}

                {/* 완료 이벤트 */}
                {task.status === 'completed' && task.completedDate && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                      <span className="text-sm text-success-text">🎉</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">작업 완료</div>
                      <div className="text-sm text-text-secondary">
                        {task.assignedTo.name}이(가) 작업을 완료했습니다
                      </div>
                      <div className="text-xs text-text-tertiary">{formatDate(task.completedDate)}</div>
                    </div>
                  </div>
                )}

                {/* 피드백 */}
                {task.feedback && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-sm text-primary">⭐</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">작업 평가</div>
                      <div className="text-sm text-text-secondary">
                        평점: {task.feedback.rating}/5 ⭐
                      </div>
                      <div className="text-sm text-text-primary mt-1">{task.feedback.comment}</div>
                      <div className="text-xs text-text-tertiary">{formatDate(task.feedback.submittedDate)}</div>
                    </div>
                  </div>
                )}
              </div>
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