import { NextRequest, NextResponse } from 'next/server'
import type { QuarterlyReport } from '@/lib/types/documents'
import { documentService } from '@/lib/services/documentService'
import { UnifiedDocumentType } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const quarter = searchParams.get('quarter')
    const department = searchParams.get('department')

    // documentService를 사용하여 quarterly_report 타입 문서 조회
    const result = await documentService.getDocuments({
      type: UnifiedDocumentType.QUARTERLY_REPORT,
      department: department || undefined,
      page: 1,
      limit: 100 // 충분한 수의 문서를 가져오기
    })

    // QuarterlyReport 형태로 변환하고 필터링
    let filteredReports = result.documents
      .filter(doc => doc.type === UnifiedDocumentType.QUARTERLY_REPORT)
      .map(doc => {
        const content = (doc.data as Record<string, unknown>) || {}
        return {
          id: doc.id,
          year: content.year as number || new Date().getFullYear(),
          quarter: content.quarter as number || 1,
          department: doc.department,
          reportDate: content.reportDate as string || doc.createdAt,
          summary: content.summary as string || '',
          achievements: content.achievements as string[] || [],
          challenges: content.challenges as string[] || [],
          nextQuarterPlan: content.nextQuarterPlan as string[] || [],
          kpis: content.kpis as Array<{ metric: string; target: number; actual: number; unit: string }> || [],
          budgetStatus: content.budgetStatus as { allocated: number; used: number; remaining: number } || { allocated: 0, used: 0, remaining: 0 },
          teamPerformance: content.teamPerformance as { totalEmployees: number; satisfactionScore: number; trainingHours: number } || { totalEmployees: 0, satisfactionScore: 0, trainingHours: 0 },
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        } as QuarterlyReport
      })

    // 클라이언트 사이드 필터링 (더 정확한 필터링을 위해)
    if (year) {
      filteredReports = filteredReports.filter(report => report.year === parseInt(year))
    }

    if (quarter) {
      filteredReports = filteredReports.filter(report => report.quarter === parseInt(quarter))
    }

    if (department) {
      filteredReports = filteredReports.filter(report => 
        report.department.toLowerCase().includes(department.toLowerCase())
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredReports 
    })
  } catch (error) {
    console.error('Error fetching quarterly reports:', error)
    return NextResponse.json(
      { success: false, error: '분기 보고서를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 유효성 검사
    if (!body.year || !body.quarter || !body.department) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // documentService를 사용하여 문서 생성
    const newDocument = await documentService.createDocument({
      type: UnifiedDocumentType.QUARTERLY_REPORT,
      title: `${body.year}년 ${body.quarter}분기 보고서 - ${body.department}`,
      department: body.department,
      data: {
        year: body.year,
        quarter: body.quarter,
        reportDate: body.reportDate || new Date().toISOString(),
        summary: body.summary || '',
        achievements: body.achievements || [],
        challenges: body.challenges || [],
        nextQuarterPlan: body.nextQuarterPlan || [],
        kpis: body.kpis || [],
        budgetStatus: body.budgetStatus || { allocated: 0, used: 0, remaining: 0 },
        teamPerformance: body.teamPerformance || { totalEmployees: 0, satisfactionScore: 0, trainingHours: 0 }
      },
      isDraft: body.isDraft || false
    }, 'current-user') // TODO: 실제 사용자 ID로 교체

    // QuarterlyReport 형태로 변환
    const newReport: QuarterlyReport = {
      id: newDocument.id,
      year: body.year,
      quarter: body.quarter,
      department: newDocument.department,
      reportDate: body.reportDate || newDocument.createdAt,
      summary: body.summary || '',
      achievements: body.achievements || [],
      challenges: body.challenges || [],
      nextQuarterPlan: body.nextQuarterPlan || [],
      kpis: body.kpis || [],
      budgetStatus: body.budgetStatus || { allocated: 0, used: 0, remaining: 0 },
      teamPerformance: body.teamPerformance || { totalEmployees: 0, satisfactionScore: 0, trainingHours: 0 },
      createdAt: newDocument.createdAt,
      updatedAt: newDocument.updatedAt
    }

    return NextResponse.json({ 
      success: true, 
      data: newReport 
    })
  } catch (error) {
    console.error('Error creating quarterly report:', error)
    return NextResponse.json(
      { success: false, error: '분기 보고서 생성에 실패했습니다.' },
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
        { success: false, error: '보고서 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // documentService를 사용하여 문서 업데이트
    const updatedDocument = await documentService.updateDocument({
      id,
      updates: {
        title: updateData.year && updateData.quarter && updateData.department ? 
          `${updateData.year}년 ${updateData.quarter}분기 보고서 - ${updateData.department}` : undefined,
        year: updateData.year,
        quarter: updateData.quarter,
        reportDate: updateData.reportDate,
        summary: updateData.summary,
        achievements: updateData.achievements,
        challenges: updateData.challenges,
        nextQuarterPlan: updateData.nextQuarterPlan,
        kpis: updateData.kpis,
        budgetStatus: updateData.budgetStatus,
        teamPerformance: updateData.teamPerformance
      }
    }, 'current-user') // TODO: 실제 사용자 ID로 교체

    // QuarterlyReport 형태로 변환
    const content = updatedDocument as unknown as { [key: string]: unknown }
    const updatedReport: QuarterlyReport = {
      id: updatedDocument.id,
      year: content.year as number || new Date().getFullYear(),
      quarter: content.quarter as number || 1,
      department: updatedDocument.department,
      reportDate: content.reportDate as string || updatedDocument.createdAt,
      summary: content.summary as string || '',
      achievements: content.achievements as string[] || [],
      challenges: content.challenges as string[] || [],
      nextQuarterPlan: content.nextQuarterPlan as string[] || [],
      kpis: content.kpis as Array<{ metric: string; target: number; actual: number; unit: string }> || [],
      budgetStatus: content.budgetStatus as { allocated: number; used: number; remaining: number } || { allocated: 0, used: 0, remaining: 0 },
      teamPerformance: content.teamPerformance as { totalEmployees: number; satisfactionScore: number; trainingHours: number } || { totalEmployees: 0, satisfactionScore: 0, trainingHours: 0 },
      createdAt: updatedDocument.createdAt,
      updatedAt: updatedDocument.updatedAt
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedReport 
    })
  } catch (error) {
    console.error('Error updating quarterly report:', error)
    return NextResponse.json(
      { success: false, error: '분기 보고서 수정에 실패했습니다.' },
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
        { success: false, error: '보고서 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // documentService를 사용하여 문서 삭제
    await documentService.deleteDocument(id)

    return NextResponse.json({ 
      success: true, 
      message: '분기 보고서가 삭제되었습니다.' 
    })
  } catch (error) {
    console.error('Error deleting quarterly report:', error)
    return NextResponse.json(
      { success: false, error: '분기 보고서 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}