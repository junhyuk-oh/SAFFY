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
import { documentService } from '@/lib/services/documentService';

/**
 * 부서별 문서 조회 API
 * 특정 부서의 문서들을 조회합니다.
 */

// GET: 부서별 문서 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ department: string }> }
) {
  try {
    const { department } = await params;
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!department) {
      throw new ValidationError('부서명이 필요합니다.', [
        { field: 'department', message: '부서명은 필수 파라미터입니다.' }
      ]);
    }

    // URL 디코딩 (한글 부서명 지원)
    const decodedDepartment = decodeURIComponent(department);

    // DocumentService를 통해 부서별 문서 조회
    const documents = await documentService.getDocumentsByDepartment(decodedDepartment, limit);
    
    const response: ApiResponse<BaseDocument[]> = toApiResponse(documents);
    response.message = `'${decodedDepartment}' 부서의 문서 ${documents.length}건이 조회되었습니다.`;
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error fetching documents by department:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '부서별 문서 조회 중 오류가 발생했습니다.',
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