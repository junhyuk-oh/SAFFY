import { NextRequest, NextResponse } from 'next/server'
import type { AnnualSafetyPlan } from '@/lib/types'
import { documentService } from '@/lib/services/documentService'
import { AppError } from '@/lib/types/error'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const department = searchParams.get('department')
    const status = searchParams.get('status') // draft, approved, completed

    // documentService를 사용하여 annual_safety_plan 타입의 문서 조회
    const searchParams_doc = {
      type: 'annual_safety_plan' as const,
      department: department || undefined,
      status: status as 'draft' | 'completed' | 'overdue' | undefined,
      page: 1,
      limit: 100
    }

    const result = await documentService.getDocuments(searchParams_doc)
    
    // BaseDocument를 AnnualSafetyPlan 형태로 변환
    let filteredPlans = result.documents.map(doc => {
      const content = doc as any // 타입 변환을 위해 임시로 any 사용
      return {
        id: doc.id,
        year: content.year || new Date().getFullYear(),
        department: doc.department,
        preparedBy: content.preparedBy || doc.author,
        approvedBy: content.approvedBy || doc.approval?.approver || '',
        approvalDate: doc.approval?.date || content.approvalDate,
        previousYearAnalysis: content.previousYearAnalysis || {
          achievements: [],
          challenges: [],
          incidentTrend: { total: 0, byType: {}, byDepartment: {} }
        },
        objectives: content.objectives || [],
        plans: content.plans || [],
        budget: content.budget || { total: 0, breakdown: [] },
        timeline: content.timeline || [],
        riskAssessment: content.riskAssessment || [],
        trainingProgram: content.trainingProgram || { programs: [], schedule: [] },
        emergencyPreparedness: content.emergencyPreparedness || { procedures: [], drills: [] },
        performanceIndicators: content.performanceIndicators || { kpis: [], targets: [] },
        complianceChecklist: content.complianceChecklist || [],
        reviewSchedule: content.reviewSchedule || { frequency: 'quarterly', dates: [] },
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      } as AnnualSafetyPlan
    })

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
        { status: error.statusCode }
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
      type: 'annual_safety_plan',
      department: body.department,
      page: 1,
      limit: 100
    })

    const existingPlan = existingDocuments.documents.find(doc => {
      const content = doc as any
      return content.year === body.year
    })

    if (existingPlan) {
      return NextResponse.json(
        { success: false, error: '해당 연도 및 부서의 계획이 이미 존재합니다.' },
        { status: 409 }
      )
    }

    // documentService를 사용하여 새 문서 생성
    const createRequest = {
      type: 'annual_safety_plan' as const,
      title: `${body.year}년 ${body.department} 연간 안전관리계획서`,
      department: body.department,
      data: {
        year: body.year,
        preparedBy: body.preparedBy,
        approvedBy: body.approvedBy || '',
        previousYearAnalysis: body.previousYearAnalysis || {
          achievements: [],
          challenges: [],
          incidentTrend: { total: 0, byType: {}, byDepartment: {} }
        },
        objectives: body.objectives || [],
        plans: body.plans || [],
        budget: body.budget || { total: 0, breakdown: [] },
        timeline: body.timeline || [],
        riskAssessment: body.riskAssessment || [],
        trainingProgram: body.trainingProgram || { programs: [], schedule: [] },
        emergencyPreparedness: body.emergencyPreparedness || { procedures: [], drills: [] },
        performanceIndicators: body.performanceIndicators || { kpis: [], targets: [] },
        complianceChecklist: body.complianceChecklist || [],
        reviewSchedule: body.reviewSchedule || { frequency: 'quarterly', dates: [] }
      }
    }

    const newDocument = await documentService.createDocument(createRequest, 'system') // TODO: 실제 사용자 ID로 교체

    // BaseDocument를 AnnualSafetyPlan 형태로 변환하여 반환
    const content = newDocument as any
    const newPlan: AnnualSafetyPlan = {
      id: newDocument.id,
      year: content.year || body.year,
      department: newDocument.department,
      preparedBy: content.preparedBy || body.preparedBy,
      approvedBy: content.approvedBy || body.approvedBy || '',
      approvalDate: content.approvalDate,
      previousYearAnalysis: content.previousYearAnalysis,
      objectives: content.objectives,
      plans: content.plans,
      budget: content.budget,
      timeline: content.timeline,
      riskAssessment: content.riskAssessment,
      trainingProgram: content.trainingProgram,
      emergencyPreparedness: content.emergencyPreparedness,
      performanceIndicators: content.performanceIndicators,
      complianceChecklist: content.complianceChecklist,
      reviewSchedule: content.reviewSchedule,
      createdAt: newDocument.createdAt,
      updatedAt: newDocument.updatedAt
    }

    return NextResponse.json({ 
      success: true, 
      data: newPlan 
    })
  } catch (error) {
    console.error('Error creating annual safety plan:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
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
    const existingContent = existingDocument as any
    if (existingContent.approvalDate || existingDocument.approval?.date) {
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
        objectives: updateData.objectives,
        plans: updateData.plans,
        budget: updateData.budget,
        timeline: updateData.timeline,
        riskAssessment: updateData.riskAssessment,
        trainingProgram: updateData.trainingProgram,
        emergencyPreparedness: updateData.emergencyPreparedness,
        performanceIndicators: updateData.performanceIndicators,
        complianceChecklist: updateData.complianceChecklist,
        reviewSchedule: updateData.reviewSchedule
      }
    }

    const updatedDocument = await documentService.updateDocument(updateRequest, 'system') // TODO: 실제 사용자 ID로 교체

    // BaseDocument를 AnnualSafetyPlan 형태로 변환하여 반환
    const content = updatedDocument as any
    const updatedPlan: AnnualSafetyPlan = {
      id: updatedDocument.id,
      year: content.year || updateData.year,
      department: updatedDocument.department,
      preparedBy: content.preparedBy || updateData.preparedBy,
      approvedBy: content.approvedBy || updateData.approvedBy || '',
      approvalDate: content.approvalDate,
      previousYearAnalysis: content.previousYearAnalysis,
      objectives: content.objectives,
      plans: content.plans,
      budget: content.budget,
      timeline: content.timeline,
      riskAssessment: content.riskAssessment,
      trainingProgram: content.trainingProgram,
      emergencyPreparedness: content.emergencyPreparedness,
      performanceIndicators: content.performanceIndicators,
      complianceChecklist: content.complianceChecklist,
      reviewSchedule: content.reviewSchedule,
      createdAt: updatedDocument.createdAt,
      updatedAt: updatedDocument.updatedAt
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedPlan 
    })
  } catch (error) {
    console.error('Error updating annual safety plan:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
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
    const existingContent = existingDocument as any
    if (existingContent.approvalDate || existingDocument.approval?.date) {
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
        { status: error.statusCode }
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

    const planIndex = annualPlans.findIndex(plan => plan.id === id)
    
    if (planIndex === -1) {
      return NextResponse.json(
        { success: false, error: '계획서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      if (!approvedBy) {
        return NextResponse.json(
          { success: false, error: '승인자 정보가 필요합니다.' },
          { status: 400 }
        )
      }

      annualPlans[planIndex] = {
        ...annualPlans[planIndex],
        approvedBy,
        approvalDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return NextResponse.json({ 
        success: true, 
        message: '계획서가 승인되었습니다.',
        data: annualPlans[planIndex] 
      })
    }

    return NextResponse.json(
      { success: false, error: '지원하지 않는 작업입니다.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing annual safety plan action:', error)
    return NextResponse.json(
      { success: false, error: '작업 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}