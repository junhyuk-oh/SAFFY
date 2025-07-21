import { NextRequest, NextResponse } from 'next/server';
import { 
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  BaseDocument,
  toApiResponse,
  toApiError,
  AppError,
  ValidationError
} from '@/lib/types';
// import { documentService } from '@/lib/services/documentService';
import { mockDocumentService as documentService } from '@/lib/services/mockDocumentService';

/**
 * 태그별 문서 조회 API
 * 특정 태그를 가진 문서들을 조회합니다.
 */

// GET: 태그별 문서 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const tags = searchParams.getAll('tag');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!tags || tags.length === 0) {
      throw new ValidationError('태그가 필요합니다.', [
        { field: 'tag', message: '최소 하나의 태그를 제공해주세요.' }
      ]);
    }

    // DocumentService를 통해 태그별 문서 조회
    const documents = await documentService.getDocumentsByTags(tags, limit);
    
    const response: ApiResponse<BaseDocument[]> = toApiResponse(documents);
    response.message = `태그 '${tags.join(', ')}'에 해당하는 문서 ${documents.length}건이 조회되었습니다.`;
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error fetching documents by tags:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '태그별 문서 조회 중 오류가 발생했습니다.',
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