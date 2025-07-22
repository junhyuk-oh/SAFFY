"use client"

import { useState } from "react"
import { MaintenanceTask } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { MAINTENANCE_STATUS, PRIORITY_CONFIG } from "@/lib/constants/status"
import { formatDateTimeTime } from "@/lib/utils/date"

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
  "Electrical": "??,
  "HVAC": "?���?,
  "Plumbing": "?��",
  "Fire Safety": "?��", 
  "Security": "?���?,
  "Structural": "?���?,
  "Equipment": "?�️",
  "Cleaning": "?��",
  "Preventive": "?��",
  "Corrective": "?��",
  "Emergency": "?��",
  "Inspection": "?��",
  "Calibration": "?��",
  "Software Update": "?��",
  "Safety Check": "??
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

  const statusInfo = MAINTENANCE_STATUS[task.status]
  const priorityInfo = PRIORITY_CONFIG[task.priority]
  const categoryIcon = categoryIcons[task.category] || "?��"


  // 기한까�? ?��? ?�간 계산
  const getTimeUntilDue = () => {
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}??지??, urgent: true, type: 'overdue' }
    if (diffDays === 0) return { text: "?�늘 마감", urgent: true, type: 'today' }
    if (diffDays === 1) return { text: "?�일 마감", urgent: true, type: 'tomorrow' }
    if (diffDays <= 3) return { text: `${diffDays}???�음`, urgent: true, type: 'soon' }
    return { text: `${diffDays}???�음`, urgent: false, type: 'normal' }
  }

  // 진행�?계산
  const getProgress = () => {
    if (!task.checklist || task.checklist.length === 0) return 0
    return Math.round((task.checklist.filter(item => item.completed).length / task.checklist.length) * 100)
  }

  const timeInfo = getTimeUntilDue()
  const progress = getProgress()

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        actualDuration: task.estimatedDuration, // ?�제로는 ?�용???�력 받아????
        notes: completionNotes,
        completedDate: new Date().toISOString()
      })
      setShowCompleteModal(false)
      setCompletionNotes('')
    }
  }

  const tabs = [
    { id: 'overview', label: '개요', icon: '?��' },
    { id: 'safety', label: '?�전?�보', icon: '?���? },
    { id: 'checklist', label: '체크리스??, icon: '?? },
    { id: 'materials', label: '?�재/?�구', icon: '?��' },
    { id: 'history', label: '?�력', icon: '?��' }
  ] as const

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ?�더 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <span className="text-4xl">{categoryIcon}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-2">{task.title}</h1>
              <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
                <span>{task.category}</span>
                <span>??/span>
                <span>{task.location}</span>
                {task.subLocation && (
                  <>
                    <span>??/span>
                    <span>{task.subLocation}</span>
                  </>
                )}
                {task.workOrder && (
                  <>
                    <span>??/span>
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
                <span className="mr-1">??/span>
                ?�업 ?�료
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <span className="mr-1">?�️</span>
                ?�정
              </Button>
            )}
            {onStatusChange && (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value as MaintenanceTask['status'])}
                className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
              >
                <option value="scheduled">?�정??/option>
                <option value="in_progress">진행�?/option>
                <option value="on_hold">보류</option>
                <option value="completed">?�료</option>
                <option value="cancelled">취소</option>
              </select>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-text-secondary mb-4">{task.description}</p>
        )}

        {/* 진행�??�시 */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">진행�?/span>
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

        {/* 기본 ?�보 그리??*/}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">?�당??/div>
            <div className="font-medium text-text-primary flex items-center gap-2 mt-1">
              <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-semibold">
                {task.assignedTo.name.charAt(0)}
              </div>
              <span>{task.assignedTo.name}</span>
            </div>
          </div>
          <div>
            <div className="text-text-secondary">?�청??/div>
            <div className="font-medium text-text-primary mt-1">{task.reportedBy.name}</div>
          </div>
          <div>
            <div className="text-text-secondary">?�정??/div>
            <div className="font-medium text-text-primary mt-1">{formatDateTime(task.scheduledDate)}</div>
          </div>
          <div>
            <div className="text-text-secondary">마감??/div>
            <div className={`font-medium mt-1 ${timeInfo.urgent ? 'text-error-text' : 'text-text-primary'}`}>
              {formatDateTime(task.dueDate)}
            </div>
          </div>
        </div>
      </div>

      {/* ???�비게이??*/}
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
          {/* 개요 ??*/}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">?�업 ?�보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?�상 ?�요?�간</span>
                      <span className="text-text-primary">{task.estimatedDuration}�?/span>
                    </div>
                    {task.actualDuration && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">?�제 ?�요?�간</span>
                        <span className="text-text-primary">{task.actualDuration}�?/span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?�성??/span>
                      <span className="text-text-primary">{formatDateTime(task.createdAt)}</span>
                    </div>
                    {task.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">?�료??/span>
                        <span className="text-text-primary">{formatDateTime(task.completedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {task.equipmentName && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">관???�비</h3>
                    <div className="p-4 bg-background rounded-notion-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">?�️</span>
                        <div>
                          <div className="font-medium text-text-primary">{task.equipmentName}</div>
                          <div className="text-sm text-text-secondary">?�비 ID: {task.equipmentId}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {task.cost && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">비용 ?�보</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.labor.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">?�건�?/div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.materials.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">?�재�?/div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.external.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">?�주�?/div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-primary">{task.cost.total.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">�?비용</div>
                    </div>
                  </div>
                </div>
              )}

              {task.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">추�? 메모</h3>
                  <div className="p-4 bg-background rounded-notion-sm">
                    <p className="text-text-primary whitespace-pre-wrap">{task.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ?�전?�보 ??*/}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              {/* ?�전 ?�림 */}
              <div className="flex items-center gap-3 p-4 bg-warning-bg text-warning-text rounded-notion-md">
                <span className="text-2xl">?�️</span>
                <div>
                  <div className="font-semibold">?�전 주의?�항</div>
                  <div className="text-sm">?�업 ?�작 ??모든 ?�전 ?�구?�항???�인?�세??/div>
                </div>
              </div>

              {/* ?�전 ?�션 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">?�전 ?�구?�항</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-3 p-3 rounded-notion-sm ${
                      task.safety.lockoutTagout ? 'bg-error-bg text-error-text' : 'bg-background'
                    }`}>
                      <span>{task.safety.lockoutTagout ? '?? : '??}</span>
                      <span>LOTO (?�금?�시) ?�요</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-notion-sm ${
                      task.safety.permitRequired ? 'bg-warning-bg text-warning-text' : 'bg-background'
                    }`}>
                      <span>{task.safety.permitRequired ? '?? : '??}</span>
                      <span>?�업?��????�요</span>
                      {task.safety.permitId && (
                        <span className="text-sm">({task.safety.permitId})</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ?�험?�소 */}
              {task.safety.hazards.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">?�별???�험?�소</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {task.safety.hazards.map((hazard, index) => (
                      <div key={index} className="p-3 bg-error-bg text-error-text rounded-notion-sm text-sm">
                        <span className="mr-2">?�️</span>
                        {hazard}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ?�방조치 */}
              {task.safety.precautions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">?�방조치</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {task.safety.precautions.map((precaution, index) => (
                      <div key={index} className="p-3 bg-success-bg text-success-text rounded-notion-sm text-sm">
                        <span className="mr-2">??/span>
                        {precaution}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ?�요??PPE */}
              {task.safety.requiredPPE.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">?�요??보호�?(PPE)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {task.safety.requiredPPE.map((ppe, index) => (
                      <div key={index} className="p-3 bg-primary-light text-primary rounded-notion-sm text-sm text-center">
                        <span className="mr-2">?���?/span>
                        {ppe}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 체크리스????*/}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">?�업 체크리스??/h3>
                {task.checklist && (
                  <div className="text-sm text-text-secondary">
                    {task.checklist.filter(item => item.completed).length} / {task.checklist.length} ?�료
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
                          {item.completed && <span className="text-sm">??/span>}
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
                              {item.completedBy} ??{item.completedDate && formatDateTime(item.completedDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <div className="text-4xl mb-2">?��</div>
                  <p>체크리스?��? ?�습?�다</p>
                </div>
              )}
            </div>
          )}

          {/* ?�재/?�구 ??*/}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">?�요???�재 �??�구</h3>

              {task.materials && task.materials.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-sm font-semibold text-text-primary">?�재�?/th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">?�량</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">?�위</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">?��?</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">?�계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {task.materials.map((material, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 text-text-primary">{material.name}</td>
                          <td className="py-3 text-right text-text-primary">{material.quantity}</td>
                          <td className="py-3 text-right text-text-primary">{material.unit}</td>
                          <td className="py-3 text-right text-text-primary">
                            {material.cost ? `??{material.cost.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-3 text-right font-medium text-text-primary">
                            {material.cost ? `??{(material.cost * material.quantity).toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {task.materials.some(m => m.cost) && (
                    <div className="mt-4 p-4 bg-background rounded-notion-sm">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>?�재�?총계</span>
                        <span className="text-primary">
                          ??task.materials.reduce((sum, m) => sum + (m.cost || 0) * m.quantity, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <div className="text-4xl mb-2">?��</div>
                  <p>?�록???�재가 ?�습?�다</p>
                </div>
              )}
            </div>
          )}

          {/* ?�력 ??*/}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">?�업 ?�력</h3>
              
              <div className="space-y-4">
                {/* ?�성 ?�벤??*/}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-background-hover rounded-full flex items-center justify-center">
                    <span className="text-sm">?��</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">?�업 ?�성</div>
                    <div className="text-sm text-text-secondary">
                      {task.reportedBy.name}??가) ?�업???�성?�습?�다
                    </div>
                    <div className="text-xs text-text-tertiary">{formatDateTime(task.createdAt)}</div>
                  </div>
                </div>

                {/* ?�인 ?�벤??*/}
                {task.approvedBy && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                      <span className="text-sm text-success-text">??/span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">?�업 ?�인</div>
                      <div className="text-sm text-text-secondary">
                        {task.approvedBy.name}??가) ?�업???�인?�습?�다
                      </div>
                      <div className="text-xs text-text-tertiary">{formatDateTime(task.approvedBy.date)}</div>
                    </div>
                  </div>
                )}

                {/* ?�료 ?�벤??*/}
                {task.status === 'completed' && task.completedDate && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                      <span className="text-sm text-success-text">?��</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">?�업 ?�료</div>
                      <div className="text-sm text-text-secondary">
                        {task.assignedTo.name}??가) ?�업???�료?�습?�다
                      </div>
                      <div className="text-xs text-text-tertiary">{formatDateTime(task.completedDate)}</div>
                    </div>
                  </div>
                )}

                {/* ?�드�?*/}
                {task.feedback && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-sm text-primary">�?/span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">?�업 ?��?</div>
                      <div className="text-sm text-text-secondary">
                        ?�점: {task.feedback.rating}/5 �?
                      </div>
                      <div className="text-sm text-text-primary mt-1">{task.feedback.comment}</div>
                      <div className="text-xs text-text-tertiary">{formatDateTime(task.feedback.submittedDate)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ?�료 모달 */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-notion-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">?�업 ?�료</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?�료 메모
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                  placeholder="?�업 ?�료???�??메모�??�력?�세??.."
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
                ?�료 처리
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}