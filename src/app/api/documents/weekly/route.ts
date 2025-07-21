import { NextResponse } from 'next/server';
import { WeeklyCheckList, ChemicalUsageReport } from '@/lib/types/documents';
import { documentService } from '@/lib/services/documentService';
import { DocumentSearchParams } from '@/lib/types';
import { UnifiedDocumentType } from '@/lib/types/document';

// 유니온 타입 정의
type WeeklyDocument = WeeklyCheckList | ChemicalUsageReport;
type WeeklyDocumentType = 'weekly-checklist' | 'chemical-usage-report';

// GET: 주별 문서 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const weekStart = searchParams.get('weekStart');
    const weekEnd = searchParams.get('weekEnd');
    const department = searchParams.get('department');

    // DocumentSearchParams 구성
    const searchParamsObj: DocumentSearchParams = {
      page: 1,
      limit: 100, // 충분히 큰 값으로 설정
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    // 타입 필터링 설정 (enum 값 사용)
    if (type === 'weekly-checklist') {
      searchParamsObj.type = [UnifiedDocumentType.WEEKLY_CHECKLIST];
    } else if (type === 'chemical-usage-report') {
      searchParamsObj.type = [UnifiedDocumentType.CHEMICAL_USAGE_REPORT];
    } else {
      // type이 없으면 둘 다 조회
      searchParamsObj.type = [UnifiedDocumentType.WEEKLY_CHECKLIST, UnifiedDocumentType.CHEMICAL_USAGE_REPORT];
    }

    // 부서 필터링
    if (department) {
      searchParamsObj.department = department;
    }

    // 날짜 범위 필터링
    if (weekStart && weekEnd) {
      searchParamsObj.dateRange = {
        start: weekStart,
        end: weekEnd
      };
    } else if (weekStart) {
      searchParamsObj.dateRange = {
        start: weekStart,
        end: new Date().toISOString()
      };
    } else if (weekEnd) {
      // 시작 날짜를 충분히 과거로 설정
      searchParamsObj.dateRange = {
        start: '2020-01-01T00:00:00.000Z',
        end: weekEnd
      };
    }

    // documentService를 통해 데이터 조회
    const result = await documentService.getDocuments(searchParamsObj);

    return NextResponse.json({
      success: true,
      data: result.documents,
      count: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage
    });
  } catch (error) {
    console.error('Error fetching weekly documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

interface PostRequestBody {
  type: WeeklyDocumentType;
  data: Partial<WeeklyDocument>;
}

// POST: 새 주별 문서 생성
export async function POST(request: Request) {
  try {
    const body = await request.json() as PostRequestBody;
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: 'Type and data are required' },
        { status: 400 }
      );
    }

    // 타입을 enum 값으로 변환
    let documentType: UnifiedDocumentType;
    if (type === 'weekly-checklist') {
      documentType = UnifiedDocumentType.WEEKLY_CHECKLIST;
    } else if (type === 'chemical-usage-report') {
      documentType = UnifiedDocumentType.CHEMICAL_USAGE_REPORT;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // CreateDocumentRequest 구성
    const createRequest = {
      type: documentType,
      title: (data as { title?: string }).title || `${type} - ${new Date().toLocaleDateString()}`,
      department: (data as { department?: string }).department || '안전관리팀',
      data: data,
      isDraft: false
    };

    // 임시 사용자 ID (실제로는 인증에서 가져와야 함)
    const userId = 'temp-user-id';

    // documentService를 통해 문서 생성
    const newDocument = await documentService.createDocument(createRequest, userId);

    return NextResponse.json({
      success: true,
      data: newDocument
    });
  } catch (error) {
    console.error('Error creating weekly document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

interface PutRequestBody {
  type: WeeklyDocumentType;
  id: string;
  data: Partial<WeeklyDocument>;
}

// PUT: 주별 문서 수정
export async function PUT(request: Request) {
  try {
    const body = await request.json() as PutRequestBody;
    const { type, id, data } = body;

    if (!type || !id || !data) {
      return NextResponse.json(
        { success: false, error: 'Type, id, and data are required' },
        { status: 400 }
      );
    }

    // UpdateDocumentRequest 구성
    const updateRequest = {
      id,
      updates: {
        title: (data as { title?: string }).title,
        status: (data as { status?: 'draft' | 'completed' | 'overdue' }).status,
        ...data
      },
      reason: 'Weekly document update'
    };

    // 임시 사용자 ID (실제로는 인증에서 가져와야 함)
    const userId = 'temp-user-id';

    // documentService를 통해 문서 수정
    const updatedDocument = await documentService.updateDocument(updateRequest, userId);

    return NextResponse.json({
      success: true,
      data: updatedDocument
    });
  } catch (error) {
    console.error('Error updating weekly document:', error);
    
    // 404 오류인 경우 별도 처리
    if (error instanceof Error && error.message.includes('문서를 찾을 수 없습니다')) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE: 주별 문서 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: 'Type and id are required' },
        { status: 400 }
      );
    }

    // 타입 유효성 검증
    if (type !== 'weekly-checklist' && type !== 'chemical-usage-report') {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // documentService를 통해 문서 삭제
    await documentService.deleteDocument(id);

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting weekly document:', error);
    
    // 404 오류인 경우 별도 처리
    if (error instanceof Error && error.message.includes('문서를 찾을 수 없습니다')) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}