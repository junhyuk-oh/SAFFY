"use client"

import { useState } from "react"
import { MaintenanceTask } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display"
import { Button } from "@/components/ui/button"
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
  "HVAC": "?å°Ô∏?,
  "Plumbing": "?îß",
  "Fire Safety": "?î•", 
  "Security": "?õ°Ô∏?,
  "Structural": "?èóÔ∏?,
  "Equipment": "?ôÔ∏è",
  "Cleaning": "?ßπ",
  "Preventive": "?îÑ",
  "Corrective": "?îß",
  "Emergency": "?ö®",
  "Inspection": "?îç",
  "Calibration": "?ìè",
  "Software Update": "?íª",
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
  const categoryIcon = categoryIcons[task.category] || "?îß"


  // Í∏∞ÌïúÍπåÏ? ?®Ï? ?úÍ∞Ñ Í≥ÑÏÇ∞
  const getTimeUntilDue = () => {
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}??ÏßÄ??, urgent: true, type: 'overdue' }
    if (diffDays === 0) return { text: "?§Îäò ÎßàÍ∞ê", urgent: true, type: 'today' }
    if (diffDays === 1) return { text: "?¥Ïùº ÎßàÍ∞ê", urgent: true, type: 'tomorrow' }
    if (diffDays <= 3) return { text: `${diffDays}???®Ïùå`, urgent: true, type: 'soon' }
    return { text: `${diffDays}???®Ïùå`, urgent: false, type: 'normal' }
  }

  // ÏßÑÌñâÎ•?Í≥ÑÏÇ∞
  const getProgress = () => {
    if (!task.checklist || task.checklist.length === 0) return 0
    return Math.round((task.checklist.filter(item => item.completed).length / task.checklist.length) * 100)
  }

  const timeInfo = getTimeUntilDue()
  const progress = getProgress()

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        actualDuration: task.estimatedDuration, // ?§Ï†úÎ°úÎäî ?¨Ïö©???ÖÎ†• Î∞õÏïÑ????
        notes: completionNotes,
        completedDate: new Date().toISOString()
      })
      setShowCompleteModal(false)
      setCompletionNotes('')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Í∞úÏöî', icon: '?ìã' },
    { id: 'safety', label: '?àÏ†Ñ?ïÎ≥¥', icon: '?õ°Ô∏? },
    { id: 'checklist', label: 'Ï≤¥ÌÅ¨Î¶¨Ïä§??, icon: '?? },
    { id: 'materials', label: '?êÏû¨/?ÑÍµ¨', icon: '?ì¶' },
    { id: 'history', label: '?¥Î†•', icon: '?ìù' }
  ] as const

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ?§Îçî */}
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
                ?ëÏóÖ ?ÑÎ£å
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <span className="mr-1">?èÔ∏è</span>
                ?òÏ†ï
              </Button>
            )}
            {onStatusChange && (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value as MaintenanceTask['status'])}
                className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
              >
                <option value="scheduled">?àÏ†ï??/option>
                <option value="in_progress">ÏßÑÌñâÏ§?/option>
                <option value="on_hold">Î≥¥Î•ò</option>
                <option value="completed">?ÑÎ£å</option>
                <option value="cancelled">Ï∑®ÏÜå</option>
              </select>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-text-secondary mb-4">{task.description}</p>
        )}

        {/* ÏßÑÌñâÎ•??úÏãú */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">ÏßÑÌñâÎ•?/span>
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

        {/* Í∏∞Î≥∏ ?ïÎ≥¥ Í∑∏Î¶¨??*/}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">?¥Îãπ??/div>
            <div className="font-medium text-text-primary flex items-center gap-2 mt-1">
              <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-semibold">
                {task.assignedTo.name.charAt(0)}
              </div>
              <span>{task.assignedTo.name}</span>
            </div>
          </div>
          <div>
            <div className="text-text-secondary">?†Ï≤≠??/div>
            <div className="font-medium text-text-primary mt-1">{task.reportedBy.name}</div>
          </div>
          <div>
            <div className="text-text-secondary">?àÏ†ï??/div>
            <div className="font-medium text-text-primary mt-1">{formatDateTime(task.scheduledDate)}</div>
          </div>
          <div>
            <div className="text-text-secondary">ÎßàÍ∞ê??/div>
            <div className={`font-medium mt-1 ${timeInfo.urgent ? 'text-error-text' : 'text-text-primary'}`}>
              {formatDateTime(task.dueDate)}
            </div>
          </div>
        </div>
      </div>

      {/* ???§ÎπÑÍ≤åÏù¥??*/}
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
          {/* Í∞úÏöî ??*/}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">?ëÏóÖ ?ïÎ≥¥</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?àÏÉÅ ?åÏöî?úÍ∞Ñ</span>
                      <span className="text-text-primary">{task.estimatedDuration}Î∂?/span>
                    </div>
                    {task.actualDuration && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">?§Ï†ú ?åÏöî?úÍ∞Ñ</span>
                        <span className="text-text-primary">{task.actualDuration}Î∂?/span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">?ùÏÑ±??/span>
                      <span className="text-text-primary">{formatDateTime(task.createdAt)}</span>
                    </div>
                    {task.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">?ÑÎ£å??/span>
                        <span className="text-text-primary">{formatDateTime(task.completedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {task.equipmentName && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Í¥Ä???•ÎπÑ</h3>
                    <div className="p-4 bg-background rounded-notion-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">?ôÔ∏è</span>
                        <div>
                          <div className="font-medium text-text-primary">{task.equipmentName}</div>
                          <div className="text-sm text-text-secondary">?•ÎπÑ ID: {task.equipmentId}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {task.cost && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">ÎπÑÏö© ?ïÎ≥¥</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.labor.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">?∏Í±¥Îπ?/div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.materials.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">?êÏû¨Îπ?/div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-text-primary">{task.cost.external.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">?∏Ï£ºÎπ?/div>
                    </div>
                    <div className="p-4 bg-background rounded-notion-sm text-center">
                      <div className="text-lg font-bold text-primary">{task.cost.total.toLocaleString()}</div>
                      <div className="text-sm text-text-secondary">Ï¥?ÎπÑÏö©</div>
                    </div>
                  </div>
                </div>
              )}

              {task.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">Ï∂îÍ? Î©îÎ™®</h3>
                  <div className="p-4 bg-background rounded-notion-sm">
                    <p className="text-text-primary whitespace-pre-wrap">{task.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ?àÏ†Ñ?ïÎ≥¥ ??*/}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              {/* ?àÏ†Ñ ?åÎ¶º */}
              <div className="flex items-center gap-3 p-4 bg-warning-bg text-warning-text rounded-notion-md">
                <span className="text-2xl">?†Ô∏è</span>
                <div>
                  <div className="font-semibold">?àÏ†Ñ Ï£ºÏùò?¨Ìï≠</div>
                  <div className="text-sm">?ëÏóÖ ?úÏûë ??Î™®Îì† ?àÏ†Ñ ?îÍµ¨?¨Ìï≠???ïÏù∏?òÏÑ∏??/div>
                </div>
              </div>

              {/* ?àÏ†Ñ ?µÏÖò */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">?àÏ†Ñ ?îÍµ¨?¨Ìï≠</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-3 p-3 rounded-notion-sm ${
                      task.safety.lockoutTagout ? 'bg-error-bg text-error-text' : 'bg-background'
                    }`}>
                      <span>{task.safety.lockoutTagout ? '?? : '??}</span>
                      <span>LOTO (?†Í∏à?úÏãú) ?ÑÏöî</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-notion-sm ${
                      task.safety.permitRequired ? 'bg-warning-bg text-warning-text' : 'bg-background'
                    }`}>
                      <span>{task.safety.permitRequired ? '?? : '??}</span>
                      <span>?ëÏóÖ?àÍ????ÑÏöî</span>
                      {task.safety.permitId && (
                        <span className="text-sm">({task.safety.permitId})</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ?ÑÌóò?îÏÜå */}
              {task.safety.hazards.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">?ùÎ≥Ñ???ÑÌóò?îÏÜå</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {task.safety.hazards.map((hazard, index) => (
                      <div key={index} className="p-3 bg-error-bg text-error-text rounded-notion-sm text-sm">
                        <span className="mr-2">?†Ô∏è</span>
                        {hazard}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ?àÎ∞©Ï°∞Ïπò */}
              {task.safety.precautions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">?àÎ∞©Ï°∞Ïπò</h3>
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

              {/* ?ÑÏöî??PPE */}
              {task.safety.requiredPPE.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-primary">?ÑÏöî??Î≥¥Ìò∏Íµ?(PPE)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {task.safety.requiredPPE.map((ppe, index) => (
                      <div key={index} className="p-3 bg-primary-light text-primary rounded-notion-sm text-sm text-center">
                        <span className="mr-2">?õ°Ô∏?/span>
                        {ppe}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ï≤¥ÌÅ¨Î¶¨Ïä§????*/}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">?ëÏóÖ Ï≤¥ÌÅ¨Î¶¨Ïä§??/h3>
                {task.checklist && (
                  <div className="text-sm text-text-secondary">
                    {task.checklist.filter(item => item.completed).length} / {task.checklist.length} ?ÑÎ£å
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
                  <div className="text-4xl mb-2">?ìã</div>
                  <p>Ï≤¥ÌÅ¨Î¶¨Ïä§?∏Í? ?ÜÏäµ?àÎã§</p>
                </div>
              )}
            </div>
          )}

          {/* ?êÏû¨/?ÑÍµ¨ ??*/}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">?ÑÏöî???êÏû¨ Î∞??ÑÍµ¨</h3>

              {task.materials && task.materials.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-sm font-semibold text-text-primary">?êÏû¨Î™?/th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">?òÎüâ</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">?®ÏúÑ</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">?®Í?</th>
                        <th className="text-right py-3 text-sm font-semibold text-text-primary">?©Í≥Ñ</th>
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
                        <span>?êÏû¨Îπ?Ï¥ùÍ≥Ñ</span>
                        <span className="text-primary">
                          ??task.materials.reduce((sum, m) => sum + (m.cost || 0) * m.quantity, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <div className="text-4xl mb-2">?ì¶</div>
                  <p>?±Î°ù???êÏû¨Í∞Ä ?ÜÏäµ?àÎã§</p>
                </div>
              )}
            </div>
          )}

          {/* ?¥Î†• ??*/}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">?ëÏóÖ ?¥Î†•</h3>
              
              <div className="space-y-4">
                {/* ?ùÏÑ± ?¥Î≤§??*/}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-background-hover rounded-full flex items-center justify-center">
                    <span className="text-sm">?ìù</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">?ëÏóÖ ?ùÏÑ±</div>
                    <div className="text-sm text-text-secondary">
                      {task.reportedBy.name}??Í∞Ä) ?ëÏóÖ???ùÏÑ±?àÏäµ?àÎã§
                    </div>
                    <div className="text-xs text-text-tertiary">{formatDateTime(task.createdAt)}</div>
                  </div>
                </div>

                {/* ?πÏù∏ ?¥Î≤§??*/}
                {task.approvedBy && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                      <span className="text-sm text-success-text">??/span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">?ëÏóÖ ?πÏù∏</div>
                      <div className="text-sm text-text-secondary">
                        {task.approvedBy.name}??Í∞Ä) ?ëÏóÖ???πÏù∏?àÏäµ?àÎã§
                      </div>
                      <div className="text-xs text-text-tertiary">{formatDateTime(task.approvedBy.date)}</div>
                    </div>
                  </div>
                )}

                {/* ?ÑÎ£å ?¥Î≤§??*/}
                {task.status === 'completed' && task.completedDate && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-success-bg rounded-full flex items-center justify-center">
                      <span className="text-sm text-success-text">?éâ</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">?ëÏóÖ ?ÑÎ£å</div>
                      <div className="text-sm text-text-secondary">
                        {task.assignedTo.name}??Í∞Ä) ?ëÏóÖ???ÑÎ£å?àÏäµ?àÎã§
                      </div>
                      <div className="text-xs text-text-tertiary">{formatDateTime(task.completedDate)}</div>
                    </div>
                  </div>
                )}

                {/* ?ºÎìúÎ∞?*/}
                {task.feedback && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-sm text-primary">‚≠?/span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">?ëÏóÖ ?âÍ?</div>
                      <div className="text-sm text-text-secondary">
                        ?âÏ†ê: {task.feedback.rating}/5 ‚≠?
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

      {/* ?ÑÎ£å Î™®Îã¨ */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-notion-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">?ëÏóÖ ?ÑÎ£å</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?ÑÎ£å Î©îÎ™®
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                  placeholder="?ëÏóÖ ?ÑÎ£å???Ä??Î©îÎ™®Î•??ÖÎ†•?òÏÑ∏??.."
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline" 
                onClick={() => setShowCompleteModal(false)}
                className="flex-1"
              >
                Ï∑®ÏÜå
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-success hover:bg-success/90"
              >
                ?ÑÎ£å Ï≤òÎ¶¨
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}