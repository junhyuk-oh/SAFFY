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
  ValidationError,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPE_CATEGORY_MAP
} from '@/lib/types';
import { supabase } from '@/lib/db/supabase';

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
      status: searchParams.getAll('status') as any[],
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
      sortBy: searchParams.get('sortBy') as any || 'createdAt',
      sortOrder: searchParams.get('sortOrder') as any || 'desc'
    };

    // 카테고리 필터링
    const category = searchParams.get('category');
    
    // Supabase 쿼리 구성
    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' });

    // 필터 적용
    if (params.query) {
      query = query.or(`title.ilike.%${params.query}%,content->>'description'.ilike.%${params.query}%`);
    }

    if (params.type && params.type.length > 0) {
      query = query.in('content->type', params.type);
    }

    if (params.status && params.status.length > 0) {
      query = query.in('status', params.status);
    }

    if (params.department && params.department.length > 0) {
      query = query.in('content->department', params.department);
    }

    if (params.author) {
      query = query.eq('user_id', params.author);
    }

    if (params.dateRange) {
      query = query
        .gte('created_at', params.dateRange.start)
        .lte('created_at', params.dateRange.end);
    }

    if (params.tags && params.tags.length > 0) {
      query = query.contains('content->metadata->tags', params.tags);
    }

    if (params.isAiGenerated !== undefined) {
      query = query.eq('content->metadata->isAiGenerated', params.isAiGenerated);
    }

    if (category) {
      // 카테고리에 해당하는 문서 타입들 필터링
      const typesInCategory = Object.entries(DOCUMENT_TYPE_CATEGORY_MAP)
        .filter(([_, cat]) => cat === category)
        .map(([type, _]) => type);
      
      if (typesInCategory.length > 0) {
        query = query.in('content->type', typesInCategory);
      }
    }

    // 정렬 적용
    const sortColumn = params.sortBy === 'createdAt' ? 'created_at' 
                     : params.sortBy === 'updatedAt' ? 'updated_at'
                     : params.sortBy === 'title' ? 'title'
                     : params.sortBy === 'status' ? 'status'
                     : 'created_at';
    
    query = query.order(sortColumn, { ascending: params.sortOrder === 'asc' });

    // 페이지네이션 적용
    const from = (params.page! - 1) * params.limit!;
    const to = from + params.limit! - 1;
    query = query.range(from, to);

    // 쿼리 실행
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new AppError({
        message: '문서 조회 중 데이터베이스 오류가 발생했습니다.',
        code: ApiErrorCode.DATABASE_ERROR,
        context: { error: error.message }
      });
    }

    // 데이터 변환 (Supabase 구조 -> BaseDocument)
    const documents: BaseDocument[] = (data || []).map(doc => ({
      id: doc.id,
      type: doc.content?.type || UnifiedDocumentType.DAILY_CHECKLIST,
      title: doc.title,
      status: doc.status,
      author: doc.content?.author || 'Unknown',
      authorId: doc.user_id,
      department: doc.content?.department || '안전관리팀',
      departmentId: doc.content?.departmentId,
      metadata: {
        version: doc.content?.metadata?.version || 1,
        isAiGenerated: doc.content?.metadata?.isAiGenerated || false,
        templateId: doc.template_id || undefined,
        parentDocumentId: doc.content?.metadata?.parentDocumentId,
        tags: doc.content?.metadata?.tags || [],
        category: doc.content?.metadata?.category,
        period: doc.content?.metadata?.period,
        periodDate: doc.content?.metadata?.periodDate
      },
      review: doc.content?.review,
      approval: doc.content?.approval,
      attachments: doc.content?.attachments || [],
      permissions: doc.content?.permissions,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
      signature: doc.content?.signature,
      signedAt: doc.content?.signedAt
    }));

    // 응답 구성
    const totalPages = Math.ceil((count || 0) / params.limit!);
    
    const response: PaginatedResponse<BaseDocument> = {
      success: true,
      data: documents,
      pagination: {
        page: params.page!,
        limit: params.limit!,
        total: count || 0,
        totalPages
      },
      sort: {
        field: params.sortBy!,
        order: params.sortOrder!
      },
      filters: {
        type: params.type?.join(','),
        status: params.status?.join(','),
        department: params.department?.join(','),
        startDate: params.dateRange?.start,
        endDate: params.dateRange?.end,
        tags: params.tags?.join(','),
        isAiGenerated: params.isAiGenerated?.toString(),
        category
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
    
    // 필수 필드 검증
    if (!body.type || !body.title || !body.department) {
      throw new ValidationError('필수 필드가 누락되었습니다.', [
        { field: 'type', message: '문서 타입은 필수입니다.' },
        { field: 'title', message: '문서 제목은 필수입니다.' },
        { field: 'department', message: '부서는 필수입니다.' }
      ]);
    }

    // 문서 타입 유효성 검증
    if (!Object.values(UnifiedDocumentType).includes(body.type)) {
      throw new ValidationError('유효하지 않은 문서 타입입니다.', [
        { field: 'type', message: `문서 타입은 다음 중 하나여야 합니다: ${Object.values(UnifiedDocumentType).join(', ')}`, value: body.type }
      ]);
    }

    // 사용자 ID 가져오기 (실제 환경에서는 인증 정보에서 추출)
    const userId = 'temp-user-id'; // TODO: 실제 사용자 ID로 교체

    // BaseDocument 구조로 content 생성
    const content = {
      type: body.type,
      author: 'Current User', // TODO: 실제 사용자 이름으로 교체
      department: body.department,
      metadata: {
        version: 1,
        isAiGenerated: body.aiOptions ? true : false,
        templateId: body.templateId,
        tags: [],
        category: DOCUMENT_CATEGORIES[DOCUMENT_TYPE_CATEGORY_MAP[body.type]],
        period: body.data?.period,
        periodDate: body.data?.periodDate || new Date().toISOString().split('T')[0]
      },
      attachments: [],
      ...body.data // 문서 타입별 특정 데이터
    };

    // Supabase에 저장
    const { data, error } = await supabase
      .from('documents')
      .insert({
        template_id: body.templateId || null,
        user_id: userId,
        title: body.title,
        content: content,
        file_path: null,
        status: body.isDraft ? 'draft' : 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new AppError({
        message: '문서 생성 중 데이터베이스 오류가 발생했습니다.',
        code: ApiErrorCode.DATABASE_ERROR,
        context: { error: error.message }
      });
    }

    // 생성된 문서를 BaseDocument 형식으로 변환
    const createdDocument: BaseDocument = {
      id: data.id,
      type: body.type,
      title: data.title,
      status: data.status,
      author: content.author,
      authorId: data.user_id,
      department: content.department,
      metadata: content.metadata,
      attachments: content.attachments,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

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