import { NextRequest, NextResponse } from 'next/server';
import { 
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  ApiError,
  BaseDocument,
  UpdateDocumentRequest,
  AppError,
  ValidationError,
  ResourceError
} from '@/lib/types';
// import { documentService } from '@/lib/services/documentService';
import { mockDocumentService as documentService } from '@/lib/services/mockDocumentService';

/**
 * 개별 문서 CRUD API
 * 특정 문서에 대한 조회, 수정, 삭제 작업을 처리합니다.
 */

// GET: 개별 문서 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      throw new ValidationError('문서 ID가 필요합니다.', [
        { field: 'id', message: '문서 ID는 필수 파라미터입니다.' }
      ]);
    }

    // DocumentService를 통해 문서 조회
    const document = await documentService.getDocumentById(id);

    // TODO: 권한 체크 (실제 환경에서는 사용자 권한 확인)
    // const currentUserId = 'temp-user-id';
    // if (document.permissions?.view && !document.permissions.view.includes(currentUserId)) {
    //   throw new AppError({
    //     message: '이 문서를 볼 권한이 없습니다.',
    //     code: ApiErrorCode.PERMISSION_DENIED
    //   });
    // }

    const response: ApiResponse<BaseDocument> = {
      success: true,
      data: document,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID?.() || Math.random().toString(36).substring(7),
        version: '1.0.0'
      }
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error fetching document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 조회 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const apiError: ApiError = {
      code: appError.code as ApiErrorCode,
      message: appError.message,
      timestamp: appError.timestamp,
      details: appError.context ? [{ issue: JSON.stringify(appError.context) }] : undefined
    };
    
    const response: ApiResponse = {
      success: false,
      error: apiError
    };
    
    const statusCode = error instanceof ValidationError 
      ? ApiStatusCode.BAD_REQUEST 
      : error instanceof ResourceError
      ? ApiStatusCode.NOT_FOUND
      : ApiStatusCode.INTERNAL_SERVER_ERROR;
    
    return NextResponse.json(response, { status: statusCode });
  }
}

// PUT: 문서 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      throw new ValidationError('문서 ID가 필요합니다.', [
        { field: 'id', message: '문서 ID는 필수 파라미터입니다.' }
      ]);
    }

    if (!body.updates || Object.keys(body.updates).length === 0) {
      throw new ValidationError('수정할 내용이 없습니다.', [
        { field: 'updates', message: '수정할 필드를 제공해주세요.' }
      ]);
    }

    // 사용자 ID 가져오기 (실제 환경에서는 인증 정보에서 추출)
    const userId = 'temp-user-id'; // TODO: 실제 사용자 ID로 교체

    // UpdateDocumentRequest 형식으로 변환
    const updateRequest: UpdateDocumentRequest = {
      id,
      updates: body.updates,
      reason: body.reason
    };

    // DocumentService를 통해 문서 수정
    const updatedDocument = await documentService.updateDocument(updateRequest, userId);

    const response: ApiResponse<BaseDocument> = {
      success: true,
      data: updatedDocument,
      message: '문서가 성공적으로 수정되었습니다.',
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID?.() || Math.random().toString(36).substring(7),
        version: '1.0.0'
      }
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error updating document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 수정 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const apiError: ApiError = {
      code: appError.code as ApiErrorCode,
      message: appError.message,
      timestamp: appError.timestamp,
      details: appError.context ? [{ issue: JSON.stringify(appError.context) }] : undefined
    };
    
    const response: ApiResponse = {
      success: false,
      error: apiError
    };
    
    const statusCode = error instanceof ValidationError 
      ? ApiStatusCode.BAD_REQUEST 
      : error instanceof ResourceError
      ? ApiStatusCode.NOT_FOUND
      : ApiStatusCode.INTERNAL_SERVER_ERROR;
    
    return NextResponse.json(response, { status: statusCode });
  }
}

// DELETE: 문서 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      throw new ValidationError('문서 ID가 필요합니다.', [
        { field: 'id', message: '문서 ID는 필수 파라미터입니다.' }
      ]);
    }

    // TODO: 권한 체크 (실제 환경에서는 사용자 권한 확인)
    // const currentUserId = 'temp-user-id';
    // 권한 체크 로직...

    // DocumentService를 통해 문서 삭제
    await documentService.deleteDocument(id);

    const response: ApiResponse<{ id: string; message: string }> = {
      success: true,
      data: { 
        id,
        message: '문서가 성공적으로 삭제되었습니다.' 
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID?.() || Math.random().toString(36).substring(7),
        version: '1.0.0'
      }
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error deleting document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 삭제 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const apiError: ApiError = {
      code: appError.code as ApiErrorCode,
      message: appError.message,
      timestamp: appError.timestamp,
      details: appError.context ? [{ issue: JSON.stringify(appError.context) }] : undefined
    };
    
    const response: ApiResponse = {
      success: false,
      error: apiError
    };
    
    const statusCode = error instanceof ValidationError 
      ? ApiStatusCode.BAD_REQUEST 
      : error instanceof ResourceError
      ? ApiStatusCode.NOT_FOUND
      : ApiStatusCode.INTERNAL_SERVER_ERROR;
    
    return NextResponse.json(response, { status: statusCode });
  }
}