import { NextRequest, NextResponse } from 'next/server';
import { 
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  PaginatedResponse,
  BaseDocument,
  DocumentSearchParams,
  UnifiedDocumentType,
  Status,
  toApiError,
  AppError,
  ValidationError
} from '@/lib/types';
// import { documentService } from '@/lib/services/documentService';
import { mockDocumentService as documentService } from '@/lib/services/mockDocumentService';

/**
 * 문서 검색 API
 * 고급 검색 기능을 제공합니다.
 */

// GET: 문서 검색
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || searchParams.get('query');
    
    if (!query) {
      throw new ValidationError('검색어가 필요합니다.', [
        { field: 'query', message: '검색어를 입력해주세요.' }
      ]);
    }

    // 검색 필터 파라미터 파싱
    const filters: Partial<DocumentSearchParams> = {
      type: searchParams.getAll('type') as UnifiedDocumentType[],
      status: searchParams.getAll('status') as Status[],
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
      sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'updatedAt' | 'title' | 'status',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    };

    // DocumentService를 통해 검색 수행
    const result = await documentService.searchDocuments(query, filters);
    
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
        field: filters.sortBy!,
        order: filters.sortOrder!
      },
      filters: {
        query,
        type: Array.isArray(filters.type) ? filters.type.join(',') : filters.type,
        status: Array.isArray(filters.status) && filters.status.length > 0 ? filters.status[0] : undefined,
        department: Array.isArray(filters.department) ? filters.department.join(',') : filters.department,
        author: filters.author,
        startDate: filters.dateRange?.start,
        endDate: filters.dateRange?.end,
        tags: filters.tags?.join(','),
        isAiGenerated: filters.isAiGenerated?.toString()
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID?.() || Math.random().toString(36).substring(7),
        version: '1.0.0'
      }
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error searching documents:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 검색 중 오류가 발생했습니다.',
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