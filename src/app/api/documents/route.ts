import { NextRequest, NextResponse } from 'next/server';
import { 
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  PaginatedResponse,
  BaseDocument,
  UnifiedDocumentType,
  DocumentSearchParams,
  CreateDocumentRequest,
  toApiResponse,
  toApiError,
  AppError,
  ValidationError
} from '@/lib/types';
import { documentService } from '@/lib/services/documentService';

/**
 * 통합 문서 API
 * 모든 문서 타입에 대한 CRUD 작업을 처리합니다.
 */

// GET: 문서 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 검색 파라미터 파싱
    const params: DocumentSearchParams = {
      query: searchParams.get('query') || undefined,
      type: searchParams.getAll('type') as UnifiedDocumentType[],
      status: searchParams.getAll('status') as ('draft' | 'completed' | 'archived')[],
      department: searchParams.getAll('department'),
      author: searchParams.get('author') || undefined,
      dateRange: searchParams.get('startDate') && searchParams.get('endDate') 
        ? {
            start: searchParams.get('startDate')!,
            end: searchParams.get('endDate')!
          }
        : undefined,
      tags: searchParams.getAll('tags'),
      isAiGenerated: searchParams.get('isAiGenerated') 
        ? searchParams.get('isAiGenerated') === 'true'
        : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'updatedAt' | 'title' | 'author',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    };

    // DocumentService를 통해 문서 조회
    const result = await documentService.getDocuments(params);
    
    // 응답 구성
    const response: PaginatedResponse<BaseDocument> = {
      success: true,
      data: result.documents,
      pagination: {
        page: result.currentPage,
        limit: result.limit,
        total: result.totalCount,
        totalPages: result.totalPages
      },
      sort: {
        field: params.sortBy!,
        order: params.sortOrder!
      },
      filters: {
        query: params.query,
        type: Array.isArray(params.type) ? params.type.join(',') : params.type,
        status: Array.isArray(params.status) ? params.status.join(',') : params.status,
        department: Array.isArray(params.department) ? params.department.join(',') : params.department,
        startDate: params.dateRange?.start,
        endDate: params.dateRange?.end,
        tags: params.tags?.join(','),
        isAiGenerated: params.isAiGenerated?.toString()
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID?.() || Math.random().toString(36).substring(7),
        version: '1.0.0'
      }
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error fetching documents:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 목록을 불러오는 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

// POST: 새 문서 생성
export async function POST(request: NextRequest) {
  try {
    const body: CreateDocumentRequest = await request.json();
    
    // 사용자 ID 가져오기 (실제 환경에서는 인증 정보에서 추출)
    const userId = 'temp-user-id'; // TODO: 실제 사용자 ID로 교체

    // DocumentService를 통해 문서 생성
    const createdDocument = await documentService.createDocument(body, userId);

    const response: ApiResponse<BaseDocument> = toApiResponse(createdDocument);
    response.message = '문서가 성공적으로 생성되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.CREATED });
  } catch (error) {
    console.error('Error creating document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 생성 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    const statusCode = error instanceof ValidationError 
      ? ApiStatusCode.BAD_REQUEST 
      : ApiStatusCode.INTERNAL_SERVER_ERROR;
    
    return NextResponse.json(response, { status: statusCode });
  }
}