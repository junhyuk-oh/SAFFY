"use client"

import { useState } from "react"
import { WorkPermit } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"

interface PermitApprovalProps {
  permit: WorkPermit
  onApprove: (stage: string, comments?: string, conditions?: string[]) => Promise<void>
  onReject: (stage: string, comments: string) => Promise<void>
  onRequestInfo: (stage: string, comments: string) => Promise<void>
  currentUserRole: string
  canApprove: boolean
}

const approvalStages = [
  { stage: 'safety_review', label: '?�전검??, role: 'safety_manager', icon: '?���? },
  { stage: 'technical_review', label: '기술검??, role: 'technical_manager', icon: '?��' },
  { stage: 'management_approval', label: '관리승??, role: 'facility_manager', icon: '?��?��? },
  { stage: 'final_approval', label: '최종?�인', role: 'plant_manager', icon: '?? }
]

const statusConfig = {
  pending: {
    label: "?�기중",
    color: "text-text-secondary",
    bg: "bg-background-hover",
    icon: "??
  },
  approved: {
    label: "?�인??,
    color: "text-success-text",
    bg: "bg-success-bg",
    icon: "??
  },
  rejected: {
    label: "거�???,
    color: "text-error-text",
    bg: "bg-error-bg",
    icon: "??
  },
  info_requested: {
    label: "?�보?�청",
    color: "text-warning-text",
    bg: "bg-warning-bg",
    icon: "??
  }
}

export function PermitApproval({
  permit,
  onApprove,
  onReject,
  onRequestInfo,
  currentUserRole,
  canApprove
}: PermitApprovalProps) {
  const [activeAction, setActiveAction] = useState<{
    type: 'approve' | 'reject' | 'info_request' | null
    stage: string | null
  }>({ type: null, stage: null })
  
  const [comments, setComments] = useState('')
  const [conditions, setConditions] = useState<string[]>([])
  const [newCondition, setNewCondition] = useState('')

  // ?�짜 ?�맷???�수
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

  // ?�재 ?�용?��? ?�인?????�는 ?�계 ?�인
  const getCurrentApprovalStage = () => {
    return permit.approvals.find(approval => 
      approval.approverRole === currentUserRole && approval.status === 'pending'
    )
  }

  // ?�인 진행�?계산
  const getApprovalProgress = () => {
    const totalStages = permit.approvals.length
    const completedStages = permit.approvals.filter(approval => 
      approval.status === 'approved'
    ).length
    return totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0
  }

  const currentStage = getCurrentApprovalStage()
  const progress = getApprovalProgress()

  const handleAddCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions(prev => [...prev, newCondition.trim()])
      setNewCondition('')
    }
  }

  const handleRemoveCondition = (index: number) => {
    setConditions(prev => prev.filter((_, i) => i !== index))
  }

  const handleActionSubmit = async () => {
    if (!activeAction.type || !activeAction.stage) return

    try {
      switch (activeAction.type) {
        case 'approve':
          await onApprove(activeAction.stage, comments || undefined, conditions.length > 0 ? conditions : undefined)
          break
        case 'reject':
          if (!comments.trim()) {
            alert('거�? ?�유�??�력?�주?�요.')
            return
          }
          await onReject(activeAction.stage, comments)
          break
        case 'info_request':
          if (!comments.trim()) {
            alert('?�청 ?�용???�력?�주?�요.')
            return
          }
          await onRequestInfo(activeAction.stage, comments)
          break
      }

      // 초기??
      setActiveAction({ type: null, stage: null })
      setComments('')
      setConditions([])
    } catch (error) {
      console.error('?�인 처리 �??�류:', error)
      alert('처리 �??�류가 발생?�습?�다.')
    }
  }

  const handleCancel = () => {
    setActiveAction({ type: null, stage: null })
    setComments('')
    setConditions([])
    setNewCondition('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ?��????�보 ?�더 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-2">{permit.title}</h2>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span>#{permit.permitNumber}</span>
              <span>??/span>
              <span>{permit.type}</span>
              <span>??/span>
              <span>{permit.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={permit.priority === 'critical' ? 'destructive' : 
                     permit.priority === 'high' ? 'warning' : 'secondary'}
            >
              {permit.priority === 'critical' ? '긴급' :
               permit.priority === 'high' ? '?�음' :
               permit.priority === 'medium' ? '보통' : '??��'}
            </Badge>
            <Badge 
              variant={permit.status === 'approved' ? 'success' :
                     permit.status === 'rejected' ? 'destructive' : 'secondary'}
            >
              {permit.status === 'approved' ? '?�인?? :
               permit.status === 'rejected' ? '거�??? :
               permit.status === 'under_review' ? '검?�중' : permit.status}
            </Badge>
          </div>
        </div>

        {/* ?�청???�보 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">?�청??/div>
            <div className="font-medium text-text-primary mt-1">{permit.requestedBy.name}</div>
          </div>
          <div>
            <div className="text-text-secondary">부??/div>
            <div className="font-medium text-text-primary mt-1">{permit.requestedBy.department}</div>
          </div>
          <div>
            <div className="text-text-secondary">?�업기간</div>
            <div className="font-medium text-text-primary mt-1">
              {formatDateTime(permit.startDate)} ~ {formatDateTime(permit.endDate)}
            </div>
          </div>
          <div>
            <div className="text-text-secondary">?�상?�간</div>
            <div className="font-medium text-text-primary mt-1">{permit.estimatedDuration}?�간</div>
          </div>
        </div>

        {/* ?�인 진행�?*/}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">?�인 진행�?/span>
            <span className="text-sm font-medium text-text-primary">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-background-hover rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ?�인 ?�계 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">?�인 ?�계</h3>
        
        <div className="space-y-4">
          {permit.approvals.map((approval, index) => {
            const stageInfo = approvalStages.find(s => s.stage === approval.stage)
            const statusInfo = statusConfig[approval.status] || statusConfig.pending
            const isCurrentUserStage = approval.approverRole === currentUserRole && approval.status === 'pending'
            const isActive = activeAction.stage === approval.stage
            
            return (
              <div key={index} className={`border rounded-notion-md p-4 ${
                isCurrentUserStage ? 'border-primary bg-primary-light' : 
                approval.status === 'approved' ? 'border-success bg-success-bg' :
                approval.status === 'rejected' ? 'border-error bg-error-bg' :
                'border-border bg-background'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}>
                      <span className="text-lg">{stageInfo?.icon || '?��'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary flex items-center gap-2">
                        {stageInfo?.label || approval.stage}
                        <Badge className={`${statusInfo.bg} ${statusInfo.color}`}>
                          <span className="mr-1">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </Badge>
                      </h4>
                      <div className="text-sm text-text-secondary mt-1">
                        ?�당?? {approval.approverName || `${approval.approverRole} (미배??`}
                      </div>
                      
                      {approval.comments && (
                        <div className="mt-2 p-3 bg-background rounded-notion-sm">
                          <div className="text-sm font-medium text-text-primary mb-1">?�견:</div>
                          <div className="text-sm text-text-secondary">{approval.comments}</div>
                        </div>
                      )}
                      
                      {approval.conditions && approval.conditions.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-medium text-text-primary mb-1">?�인 조건:</div>
                          <ul className="space-y-1">
                            {approval.conditions.map((condition, condIndex) => (
                              <li key={condIndex} className="text-sm text-warning-text bg-warning-bg px-2 py-1 rounded">
                                ??{condition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {approval.date && (
                        <div className="text-xs text-text-tertiary mt-2">
                          {approval.status === 'approved' ? '?�인?�시' : 
                           approval.status === 'rejected' ? '거�??�시' : '처리?�시'}: {formatDate(approval.date)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ?�션 버튼 */}
                  {isCurrentUserStage && canApprove && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => setActiveAction({ type: 'approve', stage: approval.stage })}
                        className="bg-success hover:bg-success/90"
                      >
                        ?�인
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setActiveAction({ type: 'reject', stage: approval.stage })}
                      >
                        거�?
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveAction({ type: 'info_request', stage: approval.stage })}
                      >
                        ?�보?�청
                      </Button>
                    </div>
                  )}
                </div>

                {/* ?�션 ??*/}
                {isActive && (
                  <div className="mt-4 p-4 bg-background rounded-notion-md border border-border">
                    <h5 className="font-medium text-text-primary mb-3">
                      {activeAction.type === 'approve' ? '?�인 처리' :
                       activeAction.type === 'reject' ? '거�? 처리' : '?�보 ?�청'}
                    </h5>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          {activeAction.type === 'approve' ? '?�인 ?�견 (?�택?�항)' :
                           activeAction.type === 'reject' ? '거�? ?�유 (?�수)' : '?�청 ?�용 (?�수)'}
                        </label>
                        <textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                          placeholder={
                            activeAction.type === 'approve' ? '?�인 ?�견?�나 참고?�항???�력?�세??..' :
                            activeAction.type === 'reject' ? '거�? ?�유�?명확???�력?�세??..' :
                            '추�?�??�요???�보???�류�??�청?�세??..'
                          }
                        />
                      </div>

                      {/* ?�인 조건 (?�인 ?�만) */}
                      {activeAction.type === 'approve' && (
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            ?�인 조건 (?�택?�항)
                          </label>
                          <div className="space-y-2">
                            {conditions.map((condition, condIndex) => (
                              <div key={condIndex} className="flex items-center justify-between p-2 bg-warning-bg rounded-notion-sm">
                                <span className="text-sm text-warning-text">??{condition}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCondition(condIndex)}
                                  className="text-error-text hover:text-error text-sm"
                                >
                                  ??
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newCondition}
                                onChange={(e) => setNewCondition(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none text-sm"
                                placeholder="?�인 조건???�력?�세??.."
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleAddCondition()
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={handleAddCondition}
                              >
                                추�?
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        취소
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleActionSubmit}
                        className={
                          activeAction.type === 'approve' ? 'bg-success hover:bg-success/90' :
                          activeAction.type === 'reject' ? 'bg-error hover:bg-error/90' :
                          'bg-warning hover:bg-warning/90'
                        }
                      >
                        {activeAction.type === 'approve' ? '?�인 ?�료' :
                         activeAction.type === 'reject' ? '거�? ?�정' : '?�보 ?�청'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ?��????�세 ?�보 미리보기 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">?��????�세 ?�보</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-2">?�업 ?�명</h4>
            <p className="text-sm text-text-secondary bg-background p-3 rounded-notion-sm">
              {permit.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text-primary mb-2">?�험???��?</h4>
            <div className="space-y-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                permit.hazards.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                permit.hazards.riskLevel === 'high' ? 'bg-error-bg text-error-text' :
                permit.hazards.riskLevel === 'medium' ? 'bg-warning-bg text-warning-text' :
                'bg-success-bg text-success-text'
              }`}>
                ?�험?? {permit.hazards.riskLevel === 'critical' ? '긴급' :
                        permit.hazards.riskLevel === 'high' ? '?�음' :
                        permit.hazards.riskLevel === 'medium' ? '보통' : '??��'}
              </div>
              {permit.hazards.identified.length > 0 && (
                <div className="text-sm text-text-secondary">
                  <strong>?�별???�험:</strong> {permit.hazards.identified.join(', ')}
                </div>
              )}
            </div>
          </div>

          {permit.safety.requiredPPE.length > 0 && (
            <div>
              <h4 className="font-medium text-text-primary mb-2">?�요??보호�?/h4>
              <div className="flex flex-wrap gap-1">
                {permit.safety.requiredPPE.map((ppe, index) => (
                  <span key={index} className="inline-block px-2 py-1 bg-primary-light text-primary text-xs rounded-md">
                    {ppe}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium text-text-primary mb-2">?�전 ?�구?�항</h4>
            <div className="space-y-1 text-sm">
              {permit.safety.fireWatchRequired && (
                <div className="flex items-center gap-2 text-error-text">
                  <span>?��</span>
                  <span>?�재감시???�요</span>
                </div>
              )}
              {permit.safety.gasTestRequired && (
                <div className="flex items-center gap-2 text-warning-text">
                  <span>?��</span>
                  <span>가?�측???�요</span>
                </div>
              )}
              {permit.safety.isolationRequired && (
                <div className="flex items-center gap-2 text-primary">
                  <span>?��</span>
                  <span>격리조치 ?�요</span>
                </div>
              )}
              {!permit.safety.fireWatchRequired && !permit.safety.gasTestRequired && !permit.safety.isolationRequired && (
                <div className="text-text-secondary">?�별???�전 ?�구?�항 ?�음</div>
              )}
            </div>
          </div>
        </div>

        {permit.contractor && (
          <div className="mt-4 p-4 bg-background rounded-notion-sm">
            <h4 className="font-medium text-text-primary mb-2">?�주?�체 ?�보</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-text-secondary">?�체�?/div>
                <div className="font-medium text-text-primary">{permit.contractor.companyName}</div>
              </div>
              <div>
                <div className="text-text-secondary">?�당??/div>
                <div className="font-medium text-text-primary">{permit.contractor.contactPerson}</div>
              </div>
              <div>
                <div className="text-text-secondary">?�락�?/div>
                <div className="font-medium text-text-primary">{permit.contractor.contact}</div>
              </div>
              <div>
                <div className="text-text-secondary">보험 가??/div>
                <div className={`font-medium ${permit.contractor.insurance ? 'text-success-text' : 'text-error-text'}`}>
                  {permit.contractor.insurance ? '??가?? : '??미�???}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ?�재 ?�용???�태 ?�내 */}
      {canApprove && (
        <div className="bg-primary-light rounded-notion-md p-4 text-center">
          {currentStage ? (
            <div>
              <div className="text-lg font-semibold text-primary mb-1">
                ?�인 ?��?중인 ?�계가 ?�습?�다
              </div>
              <div className="text-sm text-primary">
                {approvalStages.find(s => s.stage === currentStage.stage)?.label} ?�계?�서 귀?�의 ?�인??기다리고 ?�습?�다.
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-text-secondary">
                ?�재 귀?��? ?�인?????�는 ?�계가 ?�습?�다.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}