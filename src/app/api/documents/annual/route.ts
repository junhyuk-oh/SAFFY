import { NextRequest, NextResponse } from 'next/server'
import type { AnnualSafetyPlan } from '@/lib/types'
import { UnifiedDocumentType } from '@/lib/types'
// import { documentService } from '@/lib/services/documentService'
import { mockDocumentService as documentService } from '@/lib/services/mockDocumentService'
import { AppError } from '@/lib/types/error'
import type { BaseDocument } from '@/lib/types'

// BaseDocument를 AnnualSafetyPlan으로 변환하는 헬퍼 함수
function convertToAnnualSafetyPlan(doc: BaseDocument): AnnualSafetyPlan {
  const content = doc as unknown as Record<string, unknown>
  return {
    id: doc.id,
    year: (content.year as number) || new Date().getFullYear(),
    department: doc.department,
    preparedBy: (content.preparedBy as string) || doc.author,
    approvedBy: (content.approvedBy as string) || doc.approval?.approverName || '',
    approvalDate: doc.approval?.approvedAt || (content.approvalDate as string),
    previousYearAnalysis: (content.previousYearAnalysis as AnnualSafetyPlan['previousYearAnalysis']) || {
      achievements: [],
      challenges: [],
      incidentTrend: { total: 0, byType: {}, reduction: 0 },
      complianceRate: 0
    },
    annualGoals: (content.annualGoals as AnnualSafetyPlan['annualGoals']) || [],
    budgetPlan: (content.budgetPlan as AnnualSafetyPlan['budgetPlan']) || {
      totalBudget: 0,
      breakdown: { safetyEquipment: 0, education: 0, inspection: 0, consulting: 0, emergency: 0, other: 0 },
      details: [],
      contingency: 0
    },
    educationPlan: (content.educationPlan as AnnualSafetyPlan['educationPlan']) || {
      mandatoryPrograms: [],
      developmentPrograms: [],
      totalHours: 0,
      totalBudget: 0
    },
    inspectionPlan: (content.inspectionPlan as AnnualSafetyPlan['inspectionPlan']) || {
      schedule: [],
      externalInspections: []
    },
    riskAssessmentPlan: (content.riskAssessmentPlan as AnnualSafetyPlan['riskAssessmentPlan']) || {
      regularAssessment: { frequency: 'quarterly', scope: [], methodology: '' },
      specialAssessment: { trigger: [], process: '' },
      targetRiskReduction: 0
    },
    emergencyResponsePlan: (content.emergencyResponsePlan as AnnualSafetyPlan['emergencyResponsePlan']) || {
      drills: [],
      equipmentMaintenance: [],
      trainingRequired: []
    },
    managementSystem: (content.managementSystem as AnnualSafetyPlan['managementSystem']) || {
      certifications: [],
      internalAudits: [],
      managementReview: { frequency: 'quarterly', participants: [], agenda: [] }
    },
    kpiTargets: (content.kpiTargets as AnnualSafetyPlan['kpiTargets']) || [],
    implementationPlan: (content.implementationPlan as AnnualSafetyPlan['implementationPlan']) || [],
    attachments: (content.attachments as AnnualSafetyPlan['attachments']) || [],
    signature: content.signature as string | undefined,
    signedAt: content.signedAt as string | undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const department = searchParams.get('department')
    const status = searchParams.get('status') // draft, approved, completed

    // documentService를 사용하여 annual_safety_plan 타입의 문서 조회
    const searchParams_doc = {
      type: UnifiedDocumentType.ANNUAL_SAFETY_PLAN,
      department: department || undefined,
      status: status as 'draft' | 'completed' | 'overdue' | undefined,
      page: 1,
      limit: 100
    }

    const result = await documentService.getDocuments(searchParams_doc)
    
    // BaseDocument를 AnnualSafetyPlan 형태로 변환
    let filteredPlans = result.documents.map(convertToAnnualSafetyPlan)

    // 년도별 필터링
    if (year) {
      filteredPlans = filteredPlans.filter(plan => plan.year === parseInt(year))
    }

    // 상태별 필터링 (승인 여부 기준)
    if (status) {
      filteredPlans = filteredPlans.filter(plan => {
        if (status === 'draft') return !plan.approvalDate
        if (status === 'approved') return !!plan.approvalDate
        return true
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredPlans 
    })
  } catch (error) {
    console.error('Error fetching annual safety plans:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: '연간 안전관리계획서를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 유효성 검사
    if (!body.year || !body.department || !body.preparedBy) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 동일 연도 및 부서의 계획이 이미 존재하는지 확인
    const existingDocuments = await documentService.getDocuments({
      type: UnifiedDocumentType.ANNUAL_SAFETY_PLAN,
      department: body.department,
      page: 1,
      limit: 100
    })

    const existingPlan = existingDocuments.documents.find(doc => {
      const content = doc as unknown as Record<string, unknown>
      return (content.year as number) === body.year
    })

    if (existingPlan) {
      return NextResponse.json(
        { success: false, error: '해당 연도 및 부서의 계획이 이미 존재합니다.' },
        { status: 409 }
      )
    }

    // documentService를 사용하여 새 문서 생성
    const createRequest = {
      type: UnifiedDocumentType.ANNUAL_SAFETY_PLAN,
      title: `${body.year}년 ${body.department} 연간 안전관리계획서`,
      department: body.department,
      data: {
        year: body.year,
        preparedBy: body.preparedBy,
        approvedBy: body.approvedBy || '',
        previousYearAnalysis: body.previousYearAnalysis || {
          achievements: [],
          challenges: [],
          incidentTrend: { total: 0, byType: {}, reduction: 0 },
          complianceRate: 0
        },
        annualGoals: body.annualGoals || [],
        budgetPlan: body.budgetPlan || {
          totalBudget: 0,
          breakdown: { safetyEquipment: 0, education: 0, inspection: 0, consulting: 0, emergency: 0, other: 0 },
          details: [],
          contingency: 0
        },
        educationPlan: body.educationPlan || {
          mandatoryPrograms: [],
          developmentPrograms: [],
          totalHours: 0,
          totalBudget: 0
        },
        inspectionPlan: body.inspectionPlan || {
          schedule: [],
          externalInspections: []
        },
        riskAssessmentPlan: body.riskAssessmentPlan || {
          regularAssessment: { frequency: 'quarterly' as const, scope: [], methodology: '' },
          specialAssessment: { trigger: [], process: '' },
          targetRiskReduction: 0
        },
        emergencyResponsePlan: body.emergencyResponsePlan || {
          drills: [],
          equipmentMaintenance: [],
          trainingRequired: []
        },
        managementSystem: body.managementSystem || {
          certifications: [],
          internalAudits: [],
          managementReview: { frequency: 'quarterly', participants: [], agenda: [] }
        },
        kpiTargets: body.kpiTargets || [],
        implementationPlan: body.implementationPlan || [],
        attachments: body.attachments || []
      }
    }

    const newDocument = await documentService.createDocument(createRequest, 'system') // TODO: 실제 사용자 ID로 교체

    // BaseDocument를 AnnualSafetyPlan 형태로 변환하여 반환
    const newPlan = convertToAnnualSafetyPlan(newDocument)

    return NextResponse.json({ 
      success: true, 
      data: newPlan 
    })
  } catch (error) {
    console.error('Error creating annual safety plan:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: '연간 안전관리계획서 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: '계획서 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 기존 문서 조회
    const existingDocument = await documentService.getDocumentById(id)
    
    // 승인된 계획서는 수정 불가 확인
    const existingContent = existingDocument as unknown as Record<string, unknown>
    if ((existingContent.approvalDate as string) || existingDocument.approval?.approvedAt) {
      return NextResponse.json(
        { success: false, error: '승인된 계획서는 수정할 수 없습니다.' },
        { status: 403 }
      )
    }

    // 업데이트 요청 생성
    const updateRequest = {
      id: id,
      updates: {
        title: updateData.title || existingDocument.title,
        ...updateData,
        year: updateData.year,
        preparedBy: updateData.preparedBy,
        approvedBy: updateData.approvedBy,
        previousYearAnalysis: updateData.previousYearAnalysis,
        annualGoals: updateData.annualGoals,
        budgetPlan: updateData.budgetPlan,
        educationPlan: updateData.educationPlan,
        inspectionPlan: updateData.inspectionPlan,
        riskAssessmentPlan: updateData.riskAssessmentPlan,
        emergencyResponsePlan: updateData.emergencyResponsePlan,
        managementSystem: updateData.managementSystem,
        kpiTargets: updateData.kpiTargets,
        implementationPlan: updateData.implementationPlan
      }
    }

    const updatedDocument = await documentService.updateDocument(updateRequest, 'system') // TODO: 실제 사용자 ID로 교체

    // BaseDocument를 AnnualSafetyPlan 형태로 변환하여 반환
    const updatedPlan = convertToAnnualSafetyPlan(updatedDocument)

    return NextResponse.json({ 
      success: true, 
      data: updatedPlan 
    })
  } catch (error) {
    console.error('Error updating annual safety plan:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: '연간 안전관리계획서 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: '계획서 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 기존 문서 조회
    const existingDocument = await documentService.getDocumentById(id)
    
    // 승인된 계획서는 삭제 불가 확인
    const existingContent = existingDocument as unknown as Record<string, unknown>
    if ((existingContent.approvalDate as string) || existingDocument.approval?.approvedAt) {
      return NextResponse.json(
        { success: false, error: '승인된 계획서는 삭제할 수 없습니다.' },
        { status: 403 }
      )
    }

    // 문서 삭제
    await documentService.deleteDocument(id)

    return NextResponse.json({ 
      success: true, 
      message: '연간 안전관리계획서가 삭제되었습니다.' 
    })
  } catch (error) {
    console.error('Error deleting annual safety plan:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: '연간 안전관리계획서 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 계획서 승인 엔드포인트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, approvedBy } = body

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 기존 문서 조회
    await documentService.getDocumentById(id)

    if (action === 'approve') {
      if (!approvedBy) {
        return NextResponse.json(
          { success: false, error: '승인자 정보가 필요합니다.' },
          { status: 400 }
        )
      }

      const approvalDate = new Date().toISOString()

      // 승인 정보가 포함된 업데이트 요청 생성
      const updateRequest = {
        id: id,
        updates: {
          approvedBy: approvedBy,
          approvalDate: approvalDate,
          approval: {
            approverId: 'system',
            approverName: approvedBy,
            approvedAt: approvalDate,
            comments: '연간 안전관리계획서 승인'
          },
          status: 'completed' as const
        }
      }

      const updatedDocument = await documentService.updateDocument(updateRequest, 'system') // TODO: 실제 사용자 ID로 교체

      // BaseDocument를 AnnualSafetyPlan 형태로 변환하여 반환
      const approvedPlan = convertToAnnualSafetyPlan(updatedDocument)

      return NextResponse.json({ 
        success: true, 
        message: '계획서가 승인되었습니다.',
        data: approvedPlan 
      })
    }

    return NextResponse.json(
      { success: false, error: '지원하지 않는 작업입니다.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing annual safety plan action:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: '작업 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}