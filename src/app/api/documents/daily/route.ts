import { NextRequest, NextResponse } from 'next/server';
import { 
  DocumentMetadata,
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  AppError,
  ValidationError,
  toApiResponse,
  toApiError,
  BaseDocument
} from '@/lib/types';
import { documentService } from '@/lib/services/documentService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const date = searchParams.get('date');
    const department = searchParams.get('department');

    // documentService를 사용하여 문서 조회
    const searchParams_obj = {
      type: type ? (
        type === 'checklist' ? ['daily-checklist'] :
        type === 'experiment-log' ? ['experiment-log'] :
        ['daily-checklist', 'experiment-log']
      ) : ['daily-checklist', 'experiment-log'],
      department: department ? [department] : undefined,
      dateRange: date ? {
        start: `${date}T00:00:00.000Z`,
        end: `${date}T23:59:59.999Z`
      } : undefined,
      page: 1,
      limit: 100
    };

    const result = await documentService.getDocuments(searchParams_obj);
    
    // 메타데이터 형식으로 변환
    const metadata: DocumentMetadata[] = result.documents.map((doc: BaseDocument) => {
      const isCheckList = doc.type === 'daily-checklist';
      return {
        id: doc.id,
        type: isCheckList ? 'checklist' : 'experiment-log',
        title: doc.title,
        date: doc.metadata?.periodDate || doc.createdAt.split('T')[0],
        creator: doc.author,
        status: doc.status === 'completed' ? 'completed' : 'draft',
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        author: doc.author,
        department: doc.department,
        version: `${doc.metadata?.version || 1}.0.0`
      };
    });

    const response: ApiResponse<{ documents: DocumentMetadata[]; count: number }> = toApiResponse({
      documents: metadata,
      count: result.totalCount
    });
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error fetching daily documents:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서를 불러오는 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      const error = new ValidationError('필수 데이터가 누락되었습니다.', [
        { field: 'type', message: '문서 타입은 필수입니다.' },
        { field: 'data', message: '문서 데이터는 필수입니다.' }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    let documentType: string;
    let title: string;

    if (type === 'checklist') {
      documentType = 'daily-checklist';
      title = `일일 안전점검표 - ${data.date || new Date().toISOString().split('T')[0]}`;
    } else if (type === 'experiment-log') {
      documentType = 'experiment-log';
      title = data.experimentTitle || '실험 로그';
    } else {
      const error = new ValidationError('유효하지 않은 문서 타입입니다.', [
        { field: 'type', message: `문서 타입은 'checklist' 또는 'experiment-log'여야 합니다.`, value: type }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    // documentService를 사용하여 문서 생성
    const createRequest = {
      type: documentType as 'daily-checklist' | 'experiment-log',
      title: title,
      department: data.department || '안전관리팀',
      data: {
        ...data,
        periodDate: data.date || new Date().toISOString().split('T')[0]
      },
      isDraft: !data.signature
    };

    const savedDocument = await documentService.createDocument(createRequest, 'system-user');

    const response: ApiResponse = toApiResponse(savedDocument);
    response.message = '문서가 성공적으로 저장되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.CREATED });
  } catch (error) {
    console.error('Error saving daily document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 저장 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, data } = body;

    if (!id || !type || !data) {
      const error = new ValidationError('필수 데이터가 누락되었습니다.', [
        { field: 'id', message: '문서 ID는 필수입니다.' },
        { field: 'type', message: '문서 타입은 필수입니다.' },
        { field: 'data', message: '문서 데이터는 필수입니다.' }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    if (type !== 'checklist' && type !== 'experiment-log') {
      const error = new ValidationError('유효하지 않은 문서 타입입니다.', [
        { field: 'type', message: `문서 타입은 'checklist' 또는 'experiment-log'여야 합니다.`, value: type }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    // documentService를 사용하여 문서 수정
    const updateRequest = {
      id: id,
      updates: {
        ...data,
        status: data.signature ? 'completed' : 'draft'
      }
    };

    const updatedDocument = await documentService.updateDocument(updateRequest, 'system-user');

    const response: ApiResponse = toApiResponse(updatedDocument);
    response.message = '문서가 성공적으로 업데이트되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error updating daily document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 업데이트 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      const error = new ValidationError('필수 파라미터가 누락되었습니다.', [
        { field: 'id', message: '문서 ID는 필수입니다.' },
        { field: 'type', message: '문서 타입은 필수입니다.' }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    if (type !== 'checklist' && type !== 'experiment-log') {
      const error = new ValidationError('유효하지 않은 문서 타입입니다.', [
        { field: 'type', message: `문서 타입은 'checklist' 또는 'experiment-log'여야 합니다.`, value: type }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    // documentService를 사용하여 문서 삭제
    await documentService.deleteDocument(id);

    const response: ApiResponse = toApiResponse({ deleted: true });
    response.message = '문서가 성공적으로 삭제되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error deleting daily document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 삭제 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}