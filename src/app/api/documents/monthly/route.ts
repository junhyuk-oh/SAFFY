import { NextRequest, NextResponse } from 'next/server'
// import { documentService } from '@/lib/services/documentService'
import { mockDocumentService as documentService } from '@/lib/services/mockDocumentService'
import type { SafetyInspection, EducationLog, RiskAssessment } from '@/lib/types/documents'
import { DocumentSearchParams, UnifiedDocumentType, Status, BaseDocument } from '@/lib/types'

// 유니온 타입 정의
type MonthlyDocument = SafetyInspection | EducationLog | RiskAssessment;
type DocumentType = 'safety-inspection' | 'education-log' | 'risk-assessment';

// 공통 필드를 포함한 기본 타입
interface BaseMonthlyFields {
  id: string;
  title: string;
  status: Status;
  author: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  month?: string;
}

// 문서 타입 확장 (문서 타입 정보 포함)
type DocumentWithType = MonthlyDocument & BaseMonthlyFields & { documentType?: DocumentType };

// 월별 문서 타입을 UnifiedDocumentType으로 매핑
const MONTHLY_TYPE_MAP: Record<DocumentType, UnifiedDocumentType> = {
  'safety-inspection': UnifiedDocumentType.SAFETY_INSPECTION,
  'education-log': UnifiedDocumentType.EDUCATION_LOG,
  'risk-assessment': UnifiedDocumentType.RISK_ASSESSMENT
};

// 역매핑
const SUPABASE_TYPE_MAP: Record<string, DocumentType> = {
  'safety_inspection': 'safety-inspection',
  'education_log': 'education-log',
  'risk_assessment': 'risk-assessment'
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const month = searchParams.get('month')
  const department = searchParams.get('department')

  try {
    // 문서 조회 파라미터 구성
    const searchFilters: Partial<DocumentSearchParams> = {
      page: 1,
      limit: 1000, // 월별 문서는 보통 많지 않으므로 큰 제한
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }

    // 타입별 필터링
    if (type && MONTHLY_TYPE_MAP[type as DocumentType]) {
      searchFilters.type = [MONTHLY_TYPE_MAP[type as DocumentType]]
    } else {
      // 모든 월별 문서 타입 포함
      searchFilters.type = Object.values(MONTHLY_TYPE_MAP)
    }

    // 부서별 필터링
    if (department) {
      searchFilters.department = department
    }

    // Supabase에서 문서 조회
    const result = await documentService.getDocuments(searchFilters)
    const documents = result.documents

    // BaseDocument를 월별 문서 형식으로 변환
    let results = documents.map(doc => {
      const monthlyDoc: DocumentWithType = {
        id: doc.id,
        title: doc.title,
        status: doc.status,
        author: doc.author,
        department: doc.department,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        month: (doc.metadata?.periodDate as string)?.substring(0, 7) || new Date().toISOString().substring(0, 7), // YYYY-MM 형식
      } as DocumentWithType

      // 문서 타입별 특정 필드 추가 (content에서 추출)
      const docWithData = doc as BaseDocument & { [key: string]: unknown }
      const extendedDoc = monthlyDoc as DocumentWithType & { [key: string]: unknown }
      
      if (docWithData.description) extendedDoc.description = docWithData.description
      if (docWithData.location) extendedDoc.location = docWithData.location
      if (docWithData.inspector) extendedDoc.inspector = docWithData.inspector
      if (docWithData.checkItems) extendedDoc.checkItems = docWithData.checkItems
      if (docWithData.findings) extendedDoc.findings = docWithData.findings
      if (docWithData.actions) extendedDoc.actions = docWithData.actions
      if (docWithData.participants) extendedDoc.participants = docWithData.participants
      if (docWithData.duration) extendedDoc.duration = docWithData.duration
      if (docWithData.materials) extendedDoc.materials = docWithData.materials
      if (docWithData.evaluation) extendedDoc.evaluation = docWithData.evaluation
      if (docWithData.riskLevel) extendedDoc.riskLevel = docWithData.riskLevel
      if (docWithData.probability) extendedDoc.probability = docWithData.probability
      if (docWithData.severity) extendedDoc.severity = docWithData.severity
      if (docWithData.controlMeasures) extendedDoc.controlMeasures = docWithData.controlMeasures
      if (docWithData.residualRisk) extendedDoc.residualRisk = docWithData.residualRisk

      return monthlyDoc
    })

    // 타입이 지정되지 않은 경우 documentType 추가
    if (!type) {
      results = results.map((doc) => {
        const baseDoc = documents.find(d => d.id === doc.id)
        if (baseDoc && SUPABASE_TYPE_MAP[baseDoc.type]) {
          return { ...doc, documentType: SUPABASE_TYPE_MAP[baseDoc.type] }
        }
        return doc
      })
    }

    // 월별 필터링 (클라이언트 사이드에서 추가 필터링)
    if (month) {
      results = results.filter((doc) => doc.month === month)
    }

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
  data: Partial<MonthlyDocument> & {
    title?: string;
    department?: string;
    month?: string;
  };
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

    if (!MONTHLY_TYPE_MAP[type]) {
      return NextResponse.json(
        { success: false, error: '알 수 없는 문서 타입입니다.' },
        { status: 400 }
      )
    }

    // 문서 생성 요청 구성
    const createRequest = {
      type: MONTHLY_TYPE_MAP[type],
      title: data.title || `${type} - ${new Date().toISOString().substring(0, 10)}`,
      department: data.department || '안전관리팀',
      data: {
        ...data,
        period: 'monthly' as const,
        periodDate: data.month ? `${data.month}-01` : new Date().toISOString().substring(0, 10)
      },
      isDraft: false
    }

    // Supabase에 문서 생성
    const savedDocument = await documentService.createDocument(createRequest, 'current-user-id') // TODO: 실제 사용자 ID 사용

    // BaseDocument를 월별 문서 형식으로 변환하여 반환
    const monthlyDoc = {
      ...data,
      id: savedDocument.id,
      title: savedDocument.title,
      author: savedDocument.author,
      department: savedDocument.department,
      createdAt: savedDocument.createdAt,
      updatedAt: savedDocument.updatedAt,
      month: (savedDocument.metadata?.periodDate as string)?.substring(0, 7) || new Date().toISOString().substring(0, 7)
    } as unknown as MonthlyDocument

    return NextResponse.json({
      success: true,
      data: monthlyDoc
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
  data: Partial<MonthlyDocument> & {
    title?: string;
    department?: string;
    month?: string;
  };
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

    if (!MONTHLY_TYPE_MAP[type]) {
      return NextResponse.json(
        { success: false, error: '알 수 없는 문서 타입입니다.' },
        { status: 400 }
      )
    }

    try {
      // 기존 문서 조회하여 존재 확인
      const existingDoc = await documentService.getDocumentById(id)
      
      // 업데이트 요청 구성
      const updateRequest = {
        id,
        updates: {
          title: data.title || existingDoc.title,
          data: {
            ...data
          },
          metadata: {
            ...existingDoc.metadata,
            periodDate: data.month ? `${data.month}-01` : existingDoc.metadata?.periodDate
          }
        }
      }

      // Supabase에서 문서 업데이트
      const updatedDocument = await documentService.updateDocument(updateRequest, 'current-user-id') // TODO: 실제 사용자 ID 사용

      // BaseDocument를 월별 문서 형식으로 변환하여 반환
      const monthlyDoc = {
        ...data,
        id: updatedDocument.id,
        title: updatedDocument.title,
        status: updatedDocument.status,
        author: updatedDocument.author,
        department: updatedDocument.department,
        createdAt: updatedDocument.createdAt,
        updatedAt: updatedDocument.updatedAt,
        month: (updatedDocument.metadata?.periodDate as string)?.substring(0, 7) || new Date().toISOString().substring(0, 7)
      } as unknown as MonthlyDocument

      return NextResponse.json({
        success: true,
        data: monthlyDoc
      })
    } catch (docError) {
      if ((docError as { code?: string })?.code === 'RESOURCE_NOT_FOUND') {
        return NextResponse.json(
          { success: false, error: '문서를 찾을 수 없습니다.' },
          { status: 404 }
        )
      }
      throw docError
    }
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

    if (!MONTHLY_TYPE_MAP[type as DocumentType]) {
      return NextResponse.json(
        { success: false, error: '알 수 없는 문서 타입입니다.' },
        { status: 400 }
      )
    }

    try {
      // Supabase에서 문서 삭제
      await documentService.deleteDocument(id)

      return NextResponse.json({
        success: true,
        message: '문서가 삭제되었습니다.'
      })
    } catch (docError) {
      if ((docError as { code?: string })?.code === 'RESOURCE_NOT_FOUND') {
        return NextResponse.json(
          { success: false, error: '문서를 찾을 수 없습니다.' },
          { status: 404 }
        )
      }
      throw docError
    }
  } catch (error) {
    console.error('Error deleting monthly document:', error)
    return NextResponse.json(
      { success: false, error: '문서 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}