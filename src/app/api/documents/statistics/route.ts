import { NextResponse } from 'next/server';
import { 
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  DocumentStatistics,
  toApiResponse,
  toApiError,
  AppError
} from '@/lib/types';
// import { documentService } from '@/lib/services/documentService';
import { mockDocumentService as documentService } from '@/lib/services/mockDocumentService';

/**
 * 문서 통계 API
 * 문서 관련 통계 정보를 제공합니다.
 */

// GET: 문서 통계 조회
export async function GET() {
  try {
    // DocumentService를 통해 통계 조회
    const statistics = await documentService.getDocumentStatistics();

    const response: ApiResponse<DocumentStatistics> = toApiResponse(statistics);
    response.message = '문서 통계가 성공적으로 조회되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error fetching document statistics:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 통계 조회 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}