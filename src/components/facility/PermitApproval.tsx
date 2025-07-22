"use client"

import { useState } from "react"
import { WorkPermit } from "@/lib/types/facility"
import { Badge } from "@/components/ui/badge"
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
  { stage: 'safety_review', label: '안전검토', role: 'safety_manager', icon: '🛡️' },
  { stage: 'technical_review', label: '기술검토', role: 'technical_manager', icon: '🔧' },
  { stage: 'management_approval', label: '관리승인', role: 'facility_manager', icon: '👨‍💼' },
  { stage: 'final_approval', label: '최종승인', role: 'plant_manager', icon: '✅' }
]

const statusConfig = {
  pending: {
    label: "대기중",
    color: "text-text-secondary",
    bg: "bg-background-hover",
    icon: "⏳"
  },
  approved: {
    label: "승인됨",
    color: "text-success-text",
    bg: "bg-success-bg",
    icon: "✅"
  },
  rejected: {
    label: "거부됨",
    color: "text-error-text",
    bg: "bg-error-bg",
    icon: "❌"
  },
  info_requested: {
    label: "정보요청",
    color: "text-warning-text",
    bg: "bg-warning-bg",
    icon: "❓"
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

  // 현재 사용자가 승인할 수 있는 단계 확인
  const getCurrentApprovalStage = () => {
    return permit.approvals.find(approval => 
      approval.approverRole === currentUserRole && approval.status === 'pending'
    )
  }

  // 승인 진행률 계산
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
            alert('거부 사유를 입력해주세요.')
            return
          }
          await onReject(activeAction.stage, comments)
          break
        case 'info_request':
          if (!comments.trim()) {
            alert('요청 내용을 입력해주세요.')
            return
          }
          await onRequestInfo(activeAction.stage, comments)
          break
      }

      // 초기화
      setActiveAction({ type: null, stage: null })
      setComments('')
      setConditions([])
    } catch (error) {
      console.error('승인 처리 중 오류:', error)
      alert('처리 중 오류가 발생했습니다.')
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
      {/* 허가서 정보 헤더 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-2">{permit.title}</h2>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span>#{permit.permitNumber}</span>
              <span>•</span>
              <span>{permit.type}</span>
              <span>•</span>
              <span>{permit.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={permit.priority === 'critical' ? 'destructive' : 
                     permit.priority === 'high' ? 'warning' : 'secondary'}
            >
              {permit.priority === 'critical' ? '긴급' :
               permit.priority === 'high' ? '높음' :
               permit.priority === 'medium' ? '보통' : '낮음'}
            </Badge>
            <Badge 
              variant={permit.status === 'approved' ? 'success' :
                     permit.status === 'rejected' ? 'destructive' : 'secondary'}
            >
              {permit.status === 'approved' ? '승인됨' :
               permit.status === 'rejected' ? '거부됨' :
               permit.status === 'under_review' ? '검토중' : permit.status}
            </Badge>
          </div>
        </div>

        {/* 신청자 정보 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">신청자</div>
            <div className="font-medium text-text-primary mt-1">{permit.requestedBy.name}</div>
          </div>
          <div>
            <div className="text-text-secondary">부서</div>
            <div className="font-medium text-text-primary mt-1">{permit.requestedBy.department}</div>
          </div>
          <div>
            <div className="text-text-secondary">작업기간</div>
            <div className="font-medium text-text-primary mt-1">
              {formatDateTime(permit.startDate)} ~ {formatDateTime(permit.endDate)}
            </div>
          </div>
          <div>
            <div className="text-text-secondary">예상시간</div>
            <div className="font-medium text-text-primary mt-1">{permit.estimatedDuration}시간</div>
          </div>
        </div>

        {/* 승인 진행률 */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">승인 진행률</span>
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

      {/* 승인 단계 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">승인 단계</h3>
        
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
                      <span className="text-lg">{stageInfo?.icon || '📋'}</span>
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
                        담당자: {approval.approverName || `${approval.approverRole} (미배정)`}
                      </div>
                      
                      {approval.comments && (
                        <div className="mt-2 p-3 bg-background rounded-notion-sm">
                          <div className="text-sm font-medium text-text-primary mb-1">의견:</div>
                          <div className="text-sm text-text-secondary">{approval.comments}</div>
                        </div>
                      )}
                      
                      {approval.conditions && approval.conditions.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-medium text-text-primary mb-1">승인 조건:</div>
                          <ul className="space-y-1">
                            {approval.conditions.map((condition, condIndex) => (
                              <li key={condIndex} className="text-sm text-warning-text bg-warning-bg px-2 py-1 rounded">
                                • {condition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {approval.date && (
                        <div className="text-xs text-text-tertiary mt-2">
                          {approval.status === 'approved' ? '승인일시' : 
                           approval.status === 'rejected' ? '거부일시' : '처리일시'}: {formatDate(approval.date)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  {isCurrentUserStage && canApprove && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => setActiveAction({ type: 'approve', stage: approval.stage })}
                        className="bg-success hover:bg-success/90"
                      >
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setActiveAction({ type: 'reject', stage: approval.stage })}
                      >
                        거부
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveAction({ type: 'info_request', stage: approval.stage })}
                      >
                        정보요청
                      </Button>
                    </div>
                  )}
                </div>

                {/* 액션 폼 */}
                {isActive && (
                  <div className="mt-4 p-4 bg-background rounded-notion-md border border-border">
                    <h5 className="font-medium text-text-primary mb-3">
                      {activeAction.type === 'approve' ? '승인 처리' :
                       activeAction.type === 'reject' ? '거부 처리' : '정보 요청'}
                    </h5>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          {activeAction.type === 'approve' ? '승인 의견 (선택사항)' :
                           activeAction.type === 'reject' ? '거부 사유 (필수)' : '요청 내용 (필수)'}
                        </label>
                        <textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                          placeholder={
                            activeAction.type === 'approve' ? '승인 의견이나 참고사항을 입력하세요...' :
                            activeAction.type === 'reject' ? '거부 사유를 명확히 입력하세요...' :
                            '추가로 필요한 정보나 서류를 요청하세요...'
                          }
                        />
                      </div>

                      {/* 승인 조건 (승인 시만) */}
                      {activeAction.type === 'approve' && (
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            승인 조건 (선택사항)
                          </label>
                          <div className="space-y-2">
                            {conditions.map((condition, condIndex) => (
                              <div key={condIndex} className="flex items-center justify-between p-2 bg-warning-bg rounded-notion-sm">
                                <span className="text-sm text-warning-text">• {condition}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCondition(condIndex)}
                                  className="text-error-text hover:text-error text-sm"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newCondition}
                                onChange={(e) => setNewCondition(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none text-sm"
                                placeholder="승인 조건을 입력하세요..."
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
                                추가
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
                        {activeAction.type === 'approve' ? '승인 완료' :
                         activeAction.type === 'reject' ? '거부 확정' : '정보 요청'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 허가서 상세 정보 미리보기 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">허가서 상세 정보</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-2">작업 설명</h4>
            <p className="text-sm text-text-secondary bg-background p-3 rounded-notion-sm">
              {permit.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text-primary mb-2">위험도 평가</h4>
            <div className="space-y-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                permit.hazards.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                permit.hazards.riskLevel === 'high' ? 'bg-error-bg text-error-text' :
                permit.hazards.riskLevel === 'medium' ? 'bg-warning-bg text-warning-text' :
                'bg-success-bg text-success-text'
              }`}>
                위험도: {permit.hazards.riskLevel === 'critical' ? '긴급' :
                        permit.hazards.riskLevel === 'high' ? '높음' :
                        permit.hazards.riskLevel === 'medium' ? '보통' : '낮음'}
              </div>
              {permit.hazards.identified.length > 0 && (
                <div className="text-sm text-text-secondary">
                  <strong>식별된 위험:</strong> {permit.hazards.identified.join(', ')}
                </div>
              )}
            </div>
          </div>

          {permit.safety.requiredPPE.length > 0 && (
            <div>
              <h4 className="font-medium text-text-primary mb-2">필요한 보호구</h4>
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
            <h4 className="font-medium text-text-primary mb-2">안전 요구사항</h4>
            <div className="space-y-1 text-sm">
              {permit.safety.fireWatchRequired && (
                <div className="flex items-center gap-2 text-error-text">
                  <span>🔥</span>
                  <span>화재감시자 필요</span>
                </div>
              )}
              {permit.safety.gasTestRequired && (
                <div className="flex items-center gap-2 text-warning-text">
                  <span>🧪</span>
                  <span>가스측정 필요</span>
                </div>
              )}
              {permit.safety.isolationRequired && (
                <div className="flex items-center gap-2 text-primary">
                  <span>🔒</span>
                  <span>격리조치 필요</span>
                </div>
              )}
              {!permit.safety.fireWatchRequired && !permit.safety.gasTestRequired && !permit.safety.isolationRequired && (
                <div className="text-text-secondary">특별한 안전 요구사항 없음</div>
              )}
            </div>
          </div>
        </div>

        {permit.contractor && (
          <div className="mt-4 p-4 bg-background rounded-notion-sm">
            <h4 className="font-medium text-text-primary mb-2">외주업체 정보</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-text-secondary">업체명</div>
                <div className="font-medium text-text-primary">{permit.contractor.companyName}</div>
              </div>
              <div>
                <div className="text-text-secondary">담당자</div>
                <div className="font-medium text-text-primary">{permit.contractor.contactPerson}</div>
              </div>
              <div>
                <div className="text-text-secondary">연락처</div>
                <div className="font-medium text-text-primary">{permit.contractor.contact}</div>
              </div>
              <div>
                <div className="text-text-secondary">보험 가입</div>
                <div className={`font-medium ${permit.contractor.insurance ? 'text-success-text' : 'text-error-text'}`}>
                  {permit.contractor.insurance ? '✅ 가입' : '❌ 미가입'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 현재 사용자 상태 안내 */}
      {canApprove && (
        <div className="bg-primary-light rounded-notion-md p-4 text-center">
          {currentStage ? (
            <div>
              <div className="text-lg font-semibold text-primary mb-1">
                승인 대기 중인 단계가 있습니다
              </div>
              <div className="text-sm text-primary">
                {approvalStages.find(s => s.stage === currentStage.stage)?.label} 단계에서 귀하의 승인을 기다리고 있습니다.
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-text-secondary">
                현재 귀하가 승인할 수 있는 단계가 없습니다.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}