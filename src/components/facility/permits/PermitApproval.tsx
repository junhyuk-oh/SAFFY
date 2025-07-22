"use client"

import { useState } from "react"
import { WorkPermit } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display"
import { Button } from "@/components/ui/button"

interface PermitApprovalProps {
  permit: WorkPermit
  onApprove: (stage: string, comments?: string, conditions?: string[]) => Promise<void>
  onReject: (stage: string, comments: string) => Promise<void>
  onRequestInfo: (stage: string, comments: string) => Promise<void>
  currentUserRole: string
  canApprove: boolean
}

const approvalStages = [
  { stage: 'safety_review', label: '?ˆì „ê²€??, role: 'safety_manager', icon: '?›¡ï¸? },
  { stage: 'technical_review', label: 'ê¸°ìˆ ê²€??, role: 'technical_manager', icon: '?”§' },
  { stage: 'management_approval', label: 'ê´€ë¦¬ìŠ¹??, role: 'facility_manager', icon: '?‘¨?ğŸ’? },
  { stage: 'final_approval', label: 'ìµœì¢…?¹ì¸', role: 'plant_manager', icon: '?? }
]

const statusConfig = {
  pending: {
    label: "?€ê¸°ì¤‘",
    color: "text-text-secondary",
    bg: "bg-background-hover",
    icon: "??
  },
  approved: {
    label: "?¹ì¸??,
    color: "text-success-text",
    bg: "bg-success-bg",
    icon: "??
  },
  rejected: {
    label: "ê±°ë???,
    color: "text-error-text",
    bg: "bg-error-bg",
    icon: "??
  },
  info_requested: {
    label: "?•ë³´?”ì²­",
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

  // ? ì§œ ?¬ë§·???¨ìˆ˜
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

  // ?„ì¬ ?¬ìš©?ê? ?¹ì¸?????ˆëŠ” ?¨ê³„ ?•ì¸
  const getCurrentApprovalStage = () => {
    return permit.approvals.find(approval => 
      approval.approverRole === currentUserRole && approval.status === 'pending'
    )
  }

  // ?¹ì¸ ì§„í–‰ë¥?ê³„ì‚°
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
            alert('ê±°ë? ?¬ìœ ë¥??…ë ¥?´ì£¼?¸ìš”.')
            return
          }
          await onReject(activeAction.stage, comments)
          break
        case 'info_request':
          if (!comments.trim()) {
            alert('?”ì²­ ?´ìš©???…ë ¥?´ì£¼?¸ìš”.')
            return
          }
          await onRequestInfo(activeAction.stage, comments)
          break
      }

      // ì´ˆê¸°??
      setActiveAction({ type: null, stage: null })
      setComments('')
      setConditions([])
    } catch (error) {
      console.error('?¹ì¸ ì²˜ë¦¬ ì¤??¤ë¥˜:', error)
      alert('ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.')
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
      {/* ?ˆê????•ë³´ ?¤ë” */}
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
              {permit.priority === 'critical' ? 'ê¸´ê¸‰' :
               permit.priority === 'high' ? '?’ìŒ' :
               permit.priority === 'medium' ? 'ë³´í†µ' : '??Œ'}
            </Badge>
            <Badge 
              variant={permit.status === 'approved' ? 'success' :
                     permit.status === 'rejected' ? 'destructive' : 'secondary'}
            >
              {permit.status === 'approved' ? '?¹ì¸?? :
               permit.status === 'rejected' ? 'ê±°ë??? :
               permit.status === 'under_review' ? 'ê²€? ì¤‘' : permit.status}
            </Badge>
          </div>
        </div>

        {/* ? ì²­???•ë³´ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">? ì²­??/div>
            <div className="font-medium text-text-primary mt-1">{permit.requestedBy.name}</div>
          </div>
          <div>
            <div className="text-text-secondary">ë¶€??/div>
            <div className="font-medium text-text-primary mt-1">{permit.requestedBy.department}</div>
          </div>
          <div>
            <div className="text-text-secondary">?‘ì—…ê¸°ê°„</div>
            <div className="font-medium text-text-primary mt-1">
              {formatDateTime(permit.startDate)} ~ {formatDateTime(permit.endDate)}
            </div>
          </div>
          <div>
            <div className="text-text-secondary">?ˆìƒ?œê°„</div>
            <div className="font-medium text-text-primary mt-1">{permit.estimatedDuration}?œê°„</div>
          </div>
        </div>

        {/* ?¹ì¸ ì§„í–‰ë¥?*/}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">?¹ì¸ ì§„í–‰ë¥?/span>
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

      {/* ?¹ì¸ ?¨ê³„ */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">?¹ì¸ ?¨ê³„</h3>
        
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
                      <span className="text-lg">{stageInfo?.icon || '?“‹'}</span>
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
                        ?´ë‹¹?? {approval.approverName || `${approval.approverRole} (ë¯¸ë°°??`}
                      </div>
                      
                      {approval.comments && (
                        <div className="mt-2 p-3 bg-background rounded-notion-sm">
                          <div className="text-sm font-medium text-text-primary mb-1">?˜ê²¬:</div>
                          <div className="text-sm text-text-secondary">{approval.comments}</div>
                        </div>
                      )}
                      
                      {approval.conditions && approval.conditions.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-medium text-text-primary mb-1">?¹ì¸ ì¡°ê±´:</div>
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
                          {approval.status === 'approved' ? '?¹ì¸?¼ì‹œ' : 
                           approval.status === 'rejected' ? 'ê±°ë??¼ì‹œ' : 'ì²˜ë¦¬?¼ì‹œ'}: {formatDate(approval.date)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ?¡ì…˜ ë²„íŠ¼ */}
                  {isCurrentUserStage && canApprove && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => setActiveAction({ type: 'approve', stage: approval.stage })}
                        className="bg-success hover:bg-success/90"
                      >
                        ?¹ì¸
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setActiveAction({ type: 'reject', stage: approval.stage })}
                      >
                        ê±°ë?
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveAction({ type: 'info_request', stage: approval.stage })}
                      >
                        ?•ë³´?”ì²­
                      </Button>
                    </div>
                  )}
                </div>

                {/* ?¡ì…˜ ??*/}
                {isActive && (
                  <div className="mt-4 p-4 bg-background rounded-notion-md border border-border">
                    <h5 className="font-medium text-text-primary mb-3">
                      {activeAction.type === 'approve' ? '?¹ì¸ ì²˜ë¦¬' :
                       activeAction.type === 'reject' ? 'ê±°ë? ì²˜ë¦¬' : '?•ë³´ ?”ì²­'}
                    </h5>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          {activeAction.type === 'approve' ? '?¹ì¸ ?˜ê²¬ (? íƒ?¬í•­)' :
                           activeAction.type === 'reject' ? 'ê±°ë? ?¬ìœ  (?„ìˆ˜)' : '?”ì²­ ?´ìš© (?„ìˆ˜)'}
                        </label>
                        <textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                          placeholder={
                            activeAction.type === 'approve' ? '?¹ì¸ ?˜ê²¬?´ë‚˜ ì°¸ê³ ?¬í•­???…ë ¥?˜ì„¸??..' :
                            activeAction.type === 'reject' ? 'ê±°ë? ?¬ìœ ë¥?ëª…í™•???…ë ¥?˜ì„¸??..' :
                            'ì¶”ê?ë¡??„ìš”???•ë³´???œë¥˜ë¥??”ì²­?˜ì„¸??..'
                          }
                        />
                      </div>

                      {/* ?¹ì¸ ì¡°ê±´ (?¹ì¸ ?œë§Œ) */}
                      {activeAction.type === 'approve' && (
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            ?¹ì¸ ì¡°ê±´ (? íƒ?¬í•­)
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
                                placeholder="?¹ì¸ ì¡°ê±´???…ë ¥?˜ì„¸??.."
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
                                ì¶”ê?
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
                        ì·¨ì†Œ
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
                        {activeAction.type === 'approve' ? '?¹ì¸ ?„ë£Œ' :
                         activeAction.type === 'reject' ? 'ê±°ë? ?•ì •' : '?•ë³´ ?”ì²­'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ?ˆê????ì„¸ ?•ë³´ ë¯¸ë¦¬ë³´ê¸° */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">?ˆê????ì„¸ ?•ë³´</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-2">?‘ì—… ?¤ëª…</h4>
            <p className="text-sm text-text-secondary bg-background p-3 rounded-notion-sm">
              {permit.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text-primary mb-2">?„í—˜???‰ê?</h4>
            <div className="space-y-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                permit.hazards.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                permit.hazards.riskLevel === 'high' ? 'bg-error-bg text-error-text' :
                permit.hazards.riskLevel === 'medium' ? 'bg-warning-bg text-warning-text' :
                'bg-success-bg text-success-text'
              }`}>
                ?„í—˜?? {permit.hazards.riskLevel === 'critical' ? 'ê¸´ê¸‰' :
                        permit.hazards.riskLevel === 'high' ? '?’ìŒ' :
                        permit.hazards.riskLevel === 'medium' ? 'ë³´í†µ' : '??Œ'}
              </div>
              {permit.hazards.identified.length > 0 && (
                <div className="text-sm text-text-secondary">
                  <strong>?ë³„???„í—˜:</strong> {permit.hazards.identified.join(', ')}
                </div>
              )}
            </div>
          </div>

          {permit.safety.requiredPPE.length > 0 && (
            <div>
              <h4 className="font-medium text-text-primary mb-2">?„ìš”??ë³´í˜¸êµ?/h4>
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
            <h4 className="font-medium text-text-primary mb-2">?ˆì „ ?”êµ¬?¬í•­</h4>
            <div className="space-y-1 text-sm">
              {permit.safety.fireWatchRequired && (
                <div className="flex items-center gap-2 text-error-text">
                  <span>?”¥</span>
                  <span>?”ì¬ê°ì‹œ???„ìš”</span>
                </div>
              )}
              {permit.safety.gasTestRequired && (
                <div className="flex items-center gap-2 text-warning-text">
                  <span>?§ª</span>
                  <span>ê°€?¤ì¸¡???„ìš”</span>
                </div>
              )}
              {permit.safety.isolationRequired && (
                <div className="flex items-center gap-2 text-primary">
                  <span>?”’</span>
                  <span>ê²©ë¦¬ì¡°ì¹˜ ?„ìš”</span>
                </div>
              )}
              {!permit.safety.fireWatchRequired && !permit.safety.gasTestRequired && !permit.safety.isolationRequired && (
                <div className="text-text-secondary">?¹ë³„???ˆì „ ?”êµ¬?¬í•­ ?†ìŒ</div>
              )}
            </div>
          </div>
        </div>

        {permit.contractor && (
          <div className="mt-4 p-4 bg-background rounded-notion-sm">
            <h4 className="font-medium text-text-primary mb-2">?¸ì£¼?…ì²´ ?•ë³´</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-text-secondary">?…ì²´ëª?/div>
                <div className="font-medium text-text-primary">{permit.contractor.companyName}</div>
              </div>
              <div>
                <div className="text-text-secondary">?´ë‹¹??/div>
                <div className="font-medium text-text-primary">{permit.contractor.contactPerson}</div>
              </div>
              <div>
                <div className="text-text-secondary">?°ë½ì²?/div>
                <div className="font-medium text-text-primary">{permit.contractor.contact}</div>
              </div>
              <div>
                <div className="text-text-secondary">ë³´í—˜ ê°€??/div>
                <div className={`font-medium ${permit.contractor.insurance ? 'text-success-text' : 'text-error-text'}`}>
                  {permit.contractor.insurance ? '??ê°€?? : '??ë¯¸ê???}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ?„ì¬ ?¬ìš©???íƒœ ?ˆë‚´ */}
      {canApprove && (
        <div className="bg-primary-light rounded-notion-md p-4 text-center">
          {currentStage ? (
            <div>
              <div className="text-lg font-semibold text-primary mb-1">
                ?¹ì¸ ?€ê¸?ì¤‘ì¸ ?¨ê³„ê°€ ?ˆìŠµ?ˆë‹¤
              </div>
              <div className="text-sm text-primary">
                {approvalStages.find(s => s.stage === currentStage.stage)?.label} ?¨ê³„?ì„œ ê·€?˜ì˜ ?¹ì¸??ê¸°ë‹¤ë¦¬ê³  ?ˆìŠµ?ˆë‹¤.
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-text-secondary">
                ?„ì¬ ê·€?˜ê? ?¹ì¸?????ˆëŠ” ?¨ê³„ê°€ ?†ìŠµ?ˆë‹¤.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}