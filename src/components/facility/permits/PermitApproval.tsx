"use client"

import { useState } from "react"
import { WorkPermit } from "@/lib/types/facility"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { formatDateTime } from "@/lib/utils/date"

interface PermitApprovalProps {
  permit: WorkPermit
  onApprove?: (stage: string, comments: string) => void
  onReject?: (stage: string, reason: string) => void
  onRequest?: (changes: string) => void
  canApprove?: boolean
  currentUserRole?: string
}

const approvalStages = [
  { stage: 'safety_review', label: '안전검토', role: 'safety_manager', icon: '🛡️' },
  { stage: 'technical_review', label: '기술검토', role: 'technical_manager', icon: '⚙️' },
  { stage: 'management_approval', label: '관리승인', role: 'facility_manager', icon: '👔' },
  { stage: 'final_approval', label: '최종승인', role: 'plant_manager', icon: '✅' }
]

const statusConfig = {
  draft: { label: "초안", color: "text-text-secondary", bg: "bg-background-hover" },
  pending: { label: "대기중", color: "text-warning-text", bg: "bg-warning-bg" },
  approved: { label: "승인됨", color: "text-success-text", bg: "bg-success-bg" },
  rejected: { label: "거부됨", color: "text-error-text", bg: "bg-error-bg" },
  expired: { label: "만료됨", color: "text-text-tertiary", bg: "bg-gray-100" },
  completed: { label: "완료됨", color: "text-primary", bg: "bg-blue-50" }
}

const typeConfig = {
  'Hot Work': { label: '화기작업', icon: '🔥' },
  'Confined Space': { label: '밀폐공간', icon: '🔒' },
  'Working at Height': { label: '고소작업', icon: '🪜' },
  'Electrical Work': { label: '전기작업', icon: '⚡' },
  'Chemical Handling': { label: '화학물질취급', icon: '🧪' },
  'Heavy Lifting': { label: '중량물취급', icon: '🏋️' },
  'Excavation': { label: '굴착작업', icon: '🚧' },
  'Radiation Work': { label: '방사선작업', icon: '☢️' }
}

export function PermitApproval({
  permit,
  onApprove,
  onReject,
  onRequest,
  canApprove = false,
  currentUserRole
}: PermitApprovalProps) {
  const [activeStage, setActiveStage] = useState<string>('')
  const [comments, setComments] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [changeRequest, setChangeRequest] = useState('')
  const [showModal, setShowModal] = useState<'approve' | 'reject' | 'request' | null>(null)

  const statusInfo = statusConfig[permit.status]
  const typeInfo = typeConfig[permit.type]

  // 현재 사용자가 승인할 수 있는 단계인지 확인
  const canUserApprove = (stage: string) => {
    const stageInfo = approvalStages.find(s => s.stage === stage)
    return canApprove && stageInfo?.role === currentUserRole
  }

  // 승인 진행률 계산
  const getApprovalProgress = () => {
    if (!permit.approvalHistory || permit.approvalHistory.length === 0) return 0
    const approvedStages = permit.approvalHistory.filter(h => h.action === 'approved').length
    return Math.round((approvedStages / approvalStages.length) * 100)
  }

  // 현재 승인 단계
  const getCurrentStage = () => {
    const approvedStages = permit.approvalHistory?.filter(h => h.action === 'approved') || []
    const rejectedStage = permit.approvalHistory?.find(h => h.action === 'rejected')
    
    if (rejectedStage) {
      return rejectedStage.stage
    }
    
    const nextStageIndex = approvedStages.length
    return nextStageIndex < approvalStages.length ? approvalStages[nextStageIndex].stage : null
  }

  const handleApprove = () => {
    if (onApprove && activeStage && comments.trim()) {
      onApprove(activeStage, comments)
      setComments('')
      setActiveStage('')
      setShowModal(null)
    } else {
      alert('승인 의견을 입력해주세요.')
    }
  }

  const handleReject = () => {
    if (onReject && activeStage && rejectionReason.trim()) {
      onReject(activeStage, rejectionReason)
      setRejectionReason('')
      setActiveStage('')
      setShowModal(null)
    } else {
      alert('거부 사유를 입력해주세요.')
    }
  }

  const handleRequestChanges = () => {
    if (onRequest && changeRequest.trim()) {
      onRequest(changeRequest)
      setChangeRequest('')
      setShowModal(null)
    } else {
      alert('수정 요청 사항을 입력해주세요.')
    }
  }

  const currentStage = getCurrentStage()
  const progress = getApprovalProgress()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{typeInfo?.icon || '📄'}</span>
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">{permit.title}</h1>
              <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
                <span>#{permit.id}</span>
                <span>•</span>
                <span>{typeInfo?.label || permit.type}</span>
                <span>•</span>
                <span>{permit.location}</span>
                <span>•</span>
                <span>신청자: {permit.requester.name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={`${statusInfo.bg} ${statusInfo.color}`}>
                  {statusInfo.label}
                </Badge>
                <Badge variant="outline">
                  우선순위: {permit.priority}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-right text-sm">
            <div className="text-text-secondary">유효기간</div>
            <div className="font-medium text-text-primary">
              {formatDateTime(permit.validFrom)} ~ {formatDateTime(permit.validTo)}
            </div>
          </div>
        </div>

        {/* 진행률 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">승인 진행률</span>
            <span className="text-sm font-medium text-text-primary">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">신청일</div>
            <div className="font-medium text-text-primary mt-1">
              {formatDateTime(permit.requestDate)}
            </div>
          </div>
          <div>
            <div className="text-text-secondary">작업 시작</div>
            <div className="font-medium text-text-primary mt-1">
              {formatDateTime(permit.validFrom)}
            </div>
          </div>
          <div>
            <div className="text-text-secondary">작업 종료</div>
            <div className="font-medium text-text-primary mt-1">
              {formatDateTime(permit.validTo)}
            </div>
          </div>
          <div>
            <div className="text-text-secondary">작업자 수</div>
            <div className="font-medium text-text-primary mt-1">
              {permit.workers?.length || 0}명
            </div>
          </div>
        </div>
      </div>

      {/* 작업 내용 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">작업 내용</h3>
        
        {permit.description && (
          <div className="mb-4">
            <div className="text-sm text-text-secondary mb-2">작업 설명</div>
            <div className="p-4 bg-background rounded-notion-sm">
              <p className="text-text-primary whitespace-pre-wrap">{permit.description}</p>
            </div>
          </div>
        )}

        {permit.hazards && permit.hazards.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-text-secondary mb-2">위험 요소</div>
            <div className="space-y-2">
              {permit.hazards.map((hazard, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-error-bg rounded-notion-sm">
                  <span className="text-error-text">⚠️</span>
                  <span className="text-sm text-text-primary">{hazard}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {permit.safetyMeasures && permit.safetyMeasures.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-text-secondary mb-2">안전 조치</div>
            <div className="space-y-2">
              {permit.safetyMeasures.map((measure, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-success-bg rounded-notion-sm">
                  <span className="text-success-text">✅</span>
                  <span className="text-sm text-text-primary">{measure}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {permit.workers && permit.workers.length > 0 && (
          <div>
            <div className="text-sm text-text-secondary mb-2">작업자 목록</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permit.workers.map((worker, index) => (
                <div key={index} className="p-3 bg-background rounded-notion-sm border border-border">
                  <div className="font-medium text-text-primary">{worker.name}</div>
                  <div className="text-sm text-text-secondary">{worker.role}</div>
                  {worker.certifications && worker.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.certifications.map((cert, certIndex) => (
                        <Badge key={certIndex} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 승인 단계 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">승인 단계</h3>
        
        <div className="space-y-4">
          {approvalStages.map((stage, index) => {
            const history = permit.approvalHistory?.find(h => h.stage === stage.stage)
            const isCurrentStage = currentStage === stage.stage
            const canApproveThisStage = canUserApprove(stage.stage) && isCurrentStage

            return (
              <div 
                key={stage.stage}
                className={`p-4 rounded-notion-md border-2 transition-colors ${
                  isCurrentStage ? 'border-primary bg-primary-light' : 'border-border bg-background'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stage.icon}</span>
                    <div>
                      <h4 className="font-medium text-text-primary">{stage.label}</h4>
                      <div className="text-sm text-text-secondary">담당: {stage.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {history ? (
                      <div className="text-right">
                        <Badge 
                          className={
                            history.action === 'approved' ? 'bg-success-bg text-success-text' :
                            history.action === 'rejected' ? 'bg-error-bg text-error-text' :
                            'bg-warning-bg text-warning-text'
                          }
                        >
                          {history.action === 'approved' ? '승인됨' :
                           history.action === 'rejected' ? '거부됨' : '수정요청'}
                        </Badge>
                        <div className="text-xs text-text-secondary mt-1">
                          {formatDateTime(history.date)}
                        </div>
                      </div>
                    ) : canApproveThisStage ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveStage(stage.stage)
                            setShowModal('request')
                          }}
                        >
                          수정요청
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setActiveStage(stage.stage)
                            setShowModal('reject')
                          }}
                        >
                          거부
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveStage(stage.stage)
                            setShowModal('approve')
                          }}
                          className="bg-success hover:bg-success/90"
                        >
                          승인
                        </Button>
                      </div>
                    ) : isCurrentStage ? (
                      <Badge variant="outline">대기중</Badge>
                    ) : (
                      <Badge variant="secondary">미진행</Badge>
                    )}
                  </div>
                </div>
                
                {history?.comments && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-sm text-text-secondary mb-1">의견</div>
                    <p className="text-sm text-text-primary">{history.comments}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 승인 모달 */}
      {showModal === 'approve' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-notion-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">승인 처리</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  승인 의견 <span className="text-error-text">*</span>
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                  placeholder="승인 의견을 입력하세요..."
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline" 
                onClick={() => setShowModal(null)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleApprove}
                className="flex-1 bg-success hover:bg-success/90"
              >
                승인
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 거부 모달 */}
      {showModal === 'reject' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-notion-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">거부 처리</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  거부 사유 <span className="text-error-text">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                  placeholder="거부 사유를 입력하세요..."
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline" 
                onClick={() => setShowModal(null)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleReject}
                variant="destructive"
                className="flex-1"
              >
                거부
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 요청 모달 */}
      {showModal === 'request' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-notion-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">수정 요청</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  수정 요청 사항 <span className="text-error-text">*</span>
                </label>
                <textarea
                  value={changeRequest}
                  onChange={(e) => setChangeRequest(e.target.value)}
                  className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none h-24 resize-none"
                  placeholder="수정이 필요한 사항을 입력하세요..."
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline" 
                onClick={() => setShowModal(null)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleRequestChanges}
                className="flex-1"
              >
                수정 요청
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}