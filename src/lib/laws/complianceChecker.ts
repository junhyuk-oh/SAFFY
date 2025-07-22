// 컴플라이언스 상태 체크 로직

import { DOCUMENT_LAW_MAPPINGS, getRelatedLaws } from './lawMapping'

export interface ComplianceStatus {
  documentType: string
  documentName: string
  totalRequirements: number
  completedRequirements: number
  pendingRequirements: number
  complianceRate: number
  status: 'compliant' | 'partial' | 'non-compliant' | 'unknown'
  details: ComplianceDetail[]
}

export interface ComplianceDetail {
  lawId: string
  lawName: string
  articleNumber: string
  articleTitle: string
  complianceType: string
  status: 'completed' | 'pending' | 'overdue' | 'not-started'
  dueDate?: string
  lastUpdated?: string
  evidence?: string[]
}

export interface OverallCompliance {
  totalDocuments: number
  compliantDocuments: number
  partialCompliantDocuments: number
  nonCompliantDocuments: number
  overallRate: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  criticalItems: string[]
  upcomingDeadlines: Array<{
    item: string
    dueDate: string
    daysRemaining: number
  }>
}

// 모의 문서 상태 데이터 (실제로는 데이터베이스에서 가져올 것)
const mockDocumentStatuses = {
  'risk-assessment': {
    lastCompleted: '2024-01-15',
    nextDue: '2025-01-15',
    status: 'completed',
    evidence: ['위험성평가서_2024.pdf', '개선조치_이행확인서.pdf']
  },
  'work-permit': {
    lastCompleted: '2024-07-20',
    nextDue: '2024-07-27',
    status: 'pending',
    evidence: ['화기작업허가서_001.pdf']
  },
  'safety-education': {
    lastCompleted: '2024-06-01',
    nextDue: '2024-09-01',
    status: 'overdue',
    evidence: []
  },
  'experiment-plan': {
    lastCompleted: null,
    nextDue: null,
    status: 'not-started',
    evidence: []
  }
}

// 문서별 컴플라이언스 상태 체크
export function checkDocumentCompliance(documentType: string): ComplianceStatus {
  const relatedLaws = getRelatedLaws(documentType)
  const mockStatus = mockDocumentStatuses[documentType as keyof typeof mockDocumentStatuses]
  
  if (relatedLaws.length === 0) {
    return {
      documentType,
      documentName: documentType,
      totalRequirements: 0,
      completedRequirements: 0,
      pendingRequirements: 0,
      complianceRate: 0,
      status: 'unknown',
      details: []
    }
  }

  const details: ComplianceDetail[] = relatedLaws.map(law => {
    let status: ComplianceDetail['status'] = 'not-started'
    
    if (mockStatus) {
      switch (mockStatus.status) {
        case 'completed':
          status = 'completed'
          break
        case 'pending':
          status = 'pending'
          break
        case 'overdue':
          status = 'overdue'
          break
        default:
          status = 'not-started'
      }
    }

    return {
      lawId: law.lawId,
      lawName: law.lawName,
      articleNumber: law.articleNumber,
      articleTitle: law.articleTitle,
      complianceType: law.complianceType,
      status,
      dueDate: mockStatus?.nextDue,
      lastUpdated: mockStatus?.lastCompleted,
      evidence: mockStatus?.evidence || []
    }
  })

  const totalRequirements = details.length
  const completedRequirements = details.filter(d => d.status === 'completed').length
  const pendingRequirements = details.filter(d => d.status === 'pending').length
  const overdueRequirements = details.filter(d => d.status === 'overdue').length
  
  const complianceRate = totalRequirements > 0 ? Math.round((completedRequirements / totalRequirements) * 100) : 0
  
  let status: ComplianceStatus['status'] = 'unknown'
  if (overdueRequirements > 0) {
    status = 'non-compliant'
  } else if (pendingRequirements > 0) {
    status = 'partial'
  } else if (completedRequirements === totalRequirements) {
    status = 'compliant'
  }

  return {
    documentType,
    documentName: getDocumentTypeName(documentType),
    totalRequirements,
    completedRequirements,
    pendingRequirements: pendingRequirements + overdueRequirements,
    complianceRate,
    status,
    details
  }
}

// 전체 컴플라이언스 상태 계산
export function calculateOverallCompliance(): OverallCompliance {
  const documentTypes = ['risk-assessment', 'work-permit', 'safety-education', 'experiment-plan']
  const complianceStatuses = documentTypes.map(type => checkDocumentCompliance(type))
  
  const totalDocuments = complianceStatuses.length
  const compliantDocuments = complianceStatuses.filter(s => s.status === 'compliant').length
  const partialCompliantDocuments = complianceStatuses.filter(s => s.status === 'partial').length
  const nonCompliantDocuments = complianceStatuses.filter(s => s.status === 'non-compliant').length
  
  const overallRate = Math.round((compliantDocuments / totalDocuments) * 100)
  
  let status: OverallCompliance['status'] = 'critical'
  if (overallRate >= 90) status = 'excellent'
  else if (overallRate >= 75) status = 'good'
  else if (overallRate >= 50) status = 'warning'

  const criticalItems = complianceStatuses
    .filter(s => s.status === 'non-compliant')
    .map(s => s.documentName)

  const upcomingDeadlines = complianceStatuses
    .flatMap(s => s.details.filter(d => d.dueDate))
    .map(d => ({
      item: `${d.lawName} ${d.articleNumber}`,
      dueDate: d.dueDate!,
      daysRemaining: calculateDaysRemaining(d.dueDate!)
    }))
    .filter(item => item.daysRemaining <= 30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)

  return {
    totalDocuments,
    compliantDocuments,
    partialCompliantDocuments,
    nonCompliantDocuments,
    overallRate,
    status,
    criticalItems,
    upcomingDeadlines
  }
}

// 특정 법률의 준수 상태 조회
export function getLawComplianceStatus(lawId: string) {
  const allStatuses = ['risk-assessment', 'work-permit', 'safety-education', 'experiment-plan']
    .map(type => checkDocumentCompliance(type))
  
  const relevantStatuses = allStatuses.filter(status => 
    status.details.some(detail => detail.lawId === lawId)
  )
  
  return relevantStatuses
}

// 유틸리티 함수들
function getDocumentTypeName(documentType: string): string {
  const names: Record<string, string> = {
    'risk-assessment': '위험성평가',
    'work-permit': '작업허가서',
    'safety-education': '안전교육',
    'experiment-plan': '실험계획서',
    'facility-management': '시설관리',
    'chemical-safety': '화학물질안전'
  }
  return names[documentType] || documentType
}

function calculateDaysRemaining(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// 컴플라이언스 개선 제안
export function getComplianceRecommendations(status: ComplianceStatus): string[] {
  const recommendations: string[] = []
  
  if (status.status === 'non-compliant') {
    recommendations.push('즉시 미준수 항목에 대한 조치가 필요합니다')
    recommendations.push('법무팀 또는 안전관리자와 상담을 진행하세요')
  }
  
  if (status.pendingRequirements > 0) {
    recommendations.push('보류 중인 요구사항들의 우선순위를 정하고 일정을 수립하세요')
  }
  
  if (status.details.some(d => d.evidence.length === 0)) {
    recommendations.push('증빙 자료를 체계적으로 관리하고 보관하세요')
  }
  
  return recommendations
}