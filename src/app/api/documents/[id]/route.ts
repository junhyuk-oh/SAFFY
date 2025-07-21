import { NextRequest, NextResponse } from 'next/server';
import { 
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  BaseDocument,
  UpdateDocumentRequest,
  toApiResponse,
  toApiError,
  AppError,
  ValidationError,
  ResourceError,
  DOCUMENT_TYPE_CATEGORY_MAP,
  DOCUMENT_CATEGORIES
} from '@/lib/types';
import { supabase } from '@/lib/db/supabase';

/**
 * 개별 문서 CRUD API
 * 특정 문서에 대한 조회, 수정, 삭제 작업을 처리합니다.
 */

// GET: 개별 문서 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      throw new ValidationError('문서 ID가 필요합니다.', [
        { field: 'id', message: '문서 ID는 필수 파라미터입니다.' }
      ]);
    }

    // Supabase에서 문서 조회
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ResourceError({
          message: '문서를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'document',
          resourceId: id
        });
      }
      
      console.error('Supabase error:', error);
      throw new AppError({
        message: '문서 조회 중 데이터베이스 오류가 발생했습니다.',
        code: ApiErrorCode.DATABASE_ERROR,
        context: { error: error.message }
      });
    }

    // TODO: 권한 체크 (실제 환경에서는 사용자 권한 확인)
    // const currentUserId = 'temp-user-id';
    // if (data.content?.permissions?.view && !data.content.permissions.view.includes(currentUserId)) {
    //   throw new AppError({
    //     message: '이 문서를 볼 권한이 없습니다.',
    //     code: ApiErrorCode.PERMISSION_DENIED
    //   });
    // }

    // BaseDocument 형식으로 변환
    const document: BaseDocument = {
      id: data.id,
      type: data.content?.type,
      title: data.title,
      status: data.status,
      author: data.content?.author || 'Unknown',
      authorId: data.user_id,
      department: data.content?.department || '안전관리팀',
      departmentId: data.content?.departmentId,
      metadata: {
        version: data.content?.metadata?.version || 1,
        isAiGenerated: data.content?.metadata?.isAiGenerated || false,
        templateId: data.template_id || undefined,
        parentDocumentId: data.content?.metadata?.parentDocumentId,
        tags: data.content?.metadata?.tags || [],
        category: data.content?.metadata?.category,
        period: data.content?.metadata?.period,
        periodDate: data.content?.metadata?.periodDate
      },
      review: data.content?.review,
      approval: data.content?.approval,
      attachments: data.content?.attachments || [],
      permissions: data.content?.permissions,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      signature: data.content?.signature,
      signedAt: data.content?.signedAt
    };

    // 문서 타입별 상세 데이터 포함
    const fullDocument = {
      ...document,
      data: data.content
    };

    const response: ApiResponse = toApiResponse(fullDocument);
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error fetching document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 조회 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateDocumentRequest = await request.json();

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

    // 기존 문서 조회
    const { data: existingDoc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new ResourceError({
          message: '문서를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'document',
          resourceId: id
        });
      }
      
      throw new AppError({
        message: '문서 조회 중 오류가 발생했습니다.',
        code: ApiErrorCode.DATABASE_ERROR,
        context: { error: fetchError.message }
      });
    }

    // TODO: 권한 체크 (실제 환경에서는 사용자 권한 확인)
    // const currentUserId = 'temp-user-id';
    // if (existingDoc.content?.permissions?.edit && !existingDoc.content.permissions.edit.includes(currentUserId)) {
    //   throw new AppError({
    //     message: '이 문서를 수정할 권한이 없습니다.',
    //     code: ApiErrorCode.PERMISSION_DENIED
    //   });
    // }

    // 문서 히스토리 저장 (버전 관리)
    if (body.reason) {
      const version = (existingDoc.content?.metadata?.version || 1) + 1;
      const historyData = {
        document_id: id,
        version: version,
        changes: body.updates,
        changed_by: 'temp-user-id' // TODO: 실제 사용자 ID로 교체
      };

      await supabase
        .from('document_history')
        .insert(historyData);
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};
    
    if (body.updates.title) updateData.title = body.updates.title;
    if (body.updates.status) updateData.status = body.updates.status;
    
    // content 필드 업데이트
    const updatedContent = {
      ...existingDoc.content,
      ...body.updates.data
    };

    // BaseDocument 필드들을 content에 병합
    if (body.updates.department) updatedContent.department = body.updates.department;
    if (body.updates.metadata) {
      updatedContent.metadata = {
        ...existingDoc.content?.metadata,
        ...body.updates.metadata,
        version: (existingDoc.content?.metadata?.version || 1) + 1
      };
    }
    if (body.updates.review) updatedContent.review = body.updates.review;
    if (body.updates.approval) updatedContent.approval = body.updates.approval;
    if (body.updates.attachments) updatedContent.attachments = body.updates.attachments;
    if (body.updates.permissions) updatedContent.permissions = body.updates.permissions;
    if (body.updates.signature) {
      updatedContent.signature = body.updates.signature;
      updatedContent.signedAt = new Date().toISOString();
    }

    updateData.content = updatedContent;

    // Supabase에서 문서 업데이트
    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new AppError({
        message: '문서 수정 중 데이터베이스 오류가 발생했습니다.',
        code: ApiErrorCode.DATABASE_ERROR,
        context: { error: error.message }
      });
    }

    // 업데이트된 문서를 BaseDocument 형식으로 변환
    const updatedDocument: BaseDocument = {
      id: data.id,
      type: data.content?.type,
      title: data.title,
      status: data.status,
      author: data.content?.author || 'Unknown',
      authorId: data.user_id,
      department: data.content?.department || '안전관리팀',
      departmentId: data.content?.departmentId,
      metadata: data.content?.metadata,
      review: data.content?.review,
      approval: data.content?.approval,
      attachments: data.content?.attachments || [],
      permissions: data.content?.permissions,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      signature: data.content?.signature,
      signedAt: data.content?.signedAt
    };

    const response: ApiResponse<BaseDocument> = toApiResponse(updatedDocument);
    response.message = '문서가 성공적으로 수정되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error updating document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 수정 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    const statusCode = error instanceof ValidationError 
      ? ApiStatusCode.BAD_REQUEST 
      : error instanceof ResourceError
      ? ApiStatusCode.NOT_FOUND
      : ApiStatusCode.INTERNAL_SERVER_ERROR;
    
    return NextResponse.json(response, { status: statusCode });
  }
}

// DELETE: 문서 삭제 (Soft Delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      throw new ValidationError('문서 ID가 필요합니다.', [
        { field: 'id', message: '문서 ID는 필수 파라미터입니다.' }
      ]);
    }

    // 기존 문서 조회
    const { data: existingDoc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new ResourceError({
          message: '문서를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'document',
          resourceId: id
        });
      }
      
      throw new AppError({
        message: '문서 조회 중 오류가 발생했습니다.',
        code: ApiErrorCode.DATABASE_ERROR,
        context: { error: fetchError.message }
      });
    }

    // TODO: 권한 체크 (실제 환경에서는 사용자 권한 확인)
    // const currentUserId = 'temp-user-id';
    // if (existingDoc.content?.permissions?.approve && !existingDoc.content.permissions.approve.includes(currentUserId)) {
    //   throw new AppError({
    //     message: '이 문서를 삭제할 권한이 없습니다.',
    //     code: ApiErrorCode.PERMISSION_DENIED
    //   });
    // }

    // 이미 삭제된 문서인지 확인
    if (existingDoc.status === 'archived') {
      throw new ValidationError('이미 삭제된 문서입니다.', [
        { field: 'status', message: '문서가 이미 보관 처리되었습니다.', value: 'archived' }
      ]);
    }

    // Soft delete - status를 'archived'로 변경
    const { error } = await supabase
      .from('documents')
      .update({ 
        status: 'archived',
        content: {
          ...existingDoc.content,
          archivedAt: new Date().toISOString(),
          archivedBy: 'temp-user-id' // TODO: 실제 사용자 ID로 교체
        }
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new AppError({
        message: '문서 삭제 중 데이터베이스 오류가 발생했습니다.',
        code: ApiErrorCode.DATABASE_ERROR,
        context: { error: error.message }
      });
    }

    const response: ApiResponse = toApiResponse({ 
      id, 
      status: 'archived',
      message: '문서가 성공적으로 보관 처리되었습니다.' 
    });
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error deleting document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 삭제 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    const statusCode = error instanceof ValidationError 
      ? ApiStatusCode.BAD_REQUEST 
      : error instanceof ResourceError
      ? ApiStatusCode.NOT_FOUND
      : ApiStatusCode.INTERNAL_SERVER_ERROR;
    
    return NextResponse.json(response, { status: statusCode });
  }
}