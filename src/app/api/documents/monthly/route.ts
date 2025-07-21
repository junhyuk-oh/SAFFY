import { NextRequest, NextResponse } from 'next/server'
import type { SafetyInspection, EducationLog, RiskAssessment } from '@/lib/types/documents'

// 유니온 타입 정의
type MonthlyDocument = SafetyInspection | EducationLog | RiskAssessment;
type DocumentType = 'safety-inspection' | 'education-log' | 'risk-assessment';

// 문서 타입 확장 (문서 타입 정보 포함)
type DocumentWithType = MonthlyDocument & { documentType: DocumentType };

// 임시 메모리 저장소 (실제로는 데이터베이스를 사용해야 함)
const safetyInspections: SafetyInspection[] = []
const educationLogs: EducationLog[] = []
const riskAssessments: RiskAssessment[] = []

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const month = searchParams.get('month')
  const department = searchParams.get('department')

  try {
    let results: MonthlyDocument[] | DocumentWithType[] = []

    // 문서 타입별로 필터링
    switch (type) {
      case 'safety-inspection':
        results = safetyInspections
        break
      case 'education-log':
        results = educationLogs
        break
      case 'risk-assessment':
        results = riskAssessments
        break
      default:
        // 타입이 지정되지 않은 경우 모든 문서 반환
        results = [
          ...safetyInspections.map(doc => ({ ...doc, documentType: 'safety-inspection' as const })),
          ...educationLogs.map(doc => ({ ...doc, documentType: 'education-log' as const })),
          ...riskAssessments.map(doc => ({ ...doc, documentType: 'risk-assessment' as const }))
        ]
    }

    // 월별 필터링
    if (month) {
      results = results.filter(doc => doc.month === month)
    }

    // 부서별 필터링
    if (department) {
      results = results.filter(doc => 'department' in doc && doc.department === department)
    }

    // 최신 문서가 먼저 오도록 정렬
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length
    })
  } catch (error) {
    console.error('Error fetching monthly documents:', error)
    return NextResponse.json(
      { success: false, error: '문서를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

interface PostRequestBody {
  type: DocumentType;
  data: Partial<MonthlyDocument>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PostRequestBody
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    const id = `${type}-${Date.now()}`

    let savedDocument: MonthlyDocument

    switch (type) {
      case 'safety-inspection':
        savedDocument = {
          ...data,
          id,
          createdAt: timestamp,
          updatedAt: timestamp
        } as SafetyInspection
        safetyInspections.push(savedDocument as SafetyInspection)
        break

      case 'education-log':
        savedDocument = {
          ...data,
          id,
          createdAt: timestamp,
          updatedAt: timestamp
        } as EducationLog
        educationLogs.push(savedDocument as EducationLog)
        break

      case 'risk-assessment':
        savedDocument = {
          ...data,
          id,
          createdAt: timestamp,
          updatedAt: timestamp
        } as RiskAssessment
        riskAssessments.push(savedDocument as RiskAssessment)
        break

      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 문서 타입입니다.' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: savedDocument
    })
  } catch (error) {
    console.error('Error saving monthly document:', error)
    return NextResponse.json(
      { success: false, error: '문서 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}

interface PutRequestBody {
  type: DocumentType;
  id: string;
  data: Partial<MonthlyDocument>;
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as PutRequestBody
    const { type, id, data } = body

    if (!type || !id || !data) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    let updatedDocument: MonthlyDocument

    switch (type) {
      case 'safety-inspection':
        const inspectionIndex = safetyInspections.findIndex(doc => doc.id === id)
        if (inspectionIndex === -1) {
          return NextResponse.json(
            { success: false, error: '문서를 찾을 수 없습니다.' },
            { status: 404 }
          )
        }
        updatedDocument = {
          ...safetyInspections[inspectionIndex],
          ...data,
          id,
          updatedAt: timestamp
        } as SafetyInspection
        safetyInspections[inspectionIndex] = updatedDocument as SafetyInspection
        break

      case 'education-log':
        const educationIndex = educationLogs.findIndex(doc => doc.id === id)
        if (educationIndex === -1) {
          return NextResponse.json(
            { success: false, error: '문서를 찾을 수 없습니다.' },
            { status: 404 }
          )
        }
        updatedDocument = {
          ...educationLogs[educationIndex],
          ...data,
          id,
          updatedAt: timestamp
        } as EducationLog
        educationLogs[educationIndex] = updatedDocument as EducationLog
        break

      case 'risk-assessment':
        const riskIndex = riskAssessments.findIndex(doc => doc.id === id)
        if (riskIndex === -1) {
          return NextResponse.json(
            { success: false, error: '문서를 찾을 수 없습니다.' },
            { status: 404 }
          )
        }
        updatedDocument = {
          ...riskAssessments[riskIndex],
          ...data,
          id,
          updatedAt: timestamp
        } as RiskAssessment
        riskAssessments[riskIndex] = updatedDocument as RiskAssessment
        break

      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 문서 타입입니다.' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: updatedDocument
    })
  } catch (error) {
    console.error('Error updating monthly document:', error)
    return NextResponse.json(
      { success: false, error: '문서 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'safety-inspection':
        const inspectionIndex = safetyInspections.findIndex(doc => doc.id === id)
        if (inspectionIndex === -1) {
          return NextResponse.json(
            { success: false, error: '문서를 찾을 수 없습니다.' },
            { status: 404 }
          )
        }
        safetyInspections.splice(inspectionIndex, 1)
        break

      case 'education-log':
        const educationIndex = educationLogs.findIndex(doc => doc.id === id)
        if (educationIndex === -1) {
          return NextResponse.json(
            { success: false, error: '문서를 찾을 수 없습니다.' },
            { status: 404 }
          )
        }
        educationLogs.splice(educationIndex, 1)
        break

      case 'risk-assessment':
        const riskIndex = riskAssessments.findIndex(doc => doc.id === id)
        if (riskIndex === -1) {
          return NextResponse.json(
            { success: false, error: '문서를 찾을 수 없습니다.' },
            { status: 404 }
          )
        }
        riskAssessments.splice(riskIndex, 1)
        break

      default:
        return NextResponse.json(
          { success: false, error: '알 수 없는 문서 타입입니다.' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: '문서가 삭제되었습니다.'
    })
  } catch (error) {
    console.error('Error deleting monthly document:', error)
    return NextResponse.json(
      { success: false, error: '문서 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}