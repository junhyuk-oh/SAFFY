import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  EducationCategory,
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  AppError,
  ValidationError,
  ResourceError,
  DatabaseError,
  toApiResponse,
  toApiError
} from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET: 교육 카테고리 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const isActive = searchParams.get('active');
    const parentId = searchParams.get('parent_id');
    
    let query = supabase
      .from('education_categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    if (parentId) {
      query = query.eq('parent_id', parentId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new DatabaseError(error.message);
    }
    
    const response: ApiResponse<EducationCategory[]> = toApiResponse(data || []);
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('교육 카테고리 조회 오류:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '교육 카테고리 조회 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

// POST: 교육 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: Partial<EducationCategory> = await request.json();
    
    // 필수 필드 검증
    if (!body.name || !body.code) {
      const error = new ValidationError('필수 필드가 누락되었습니다.', [
        ...(body.name ? [] : [{ field: 'name', message: '이름은 필수 항목입니다.' }]),
        ...(body.code ? [] : [{ field: 'code', message: '코드는 필수 항목입니다.' }])
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }
    
    // 코드 중복 확인
    const { data: existing } = await supabase
      .from('education_categories')
      .select('id')
      .eq('code', body.code)
      .single();
    
    if (existing) {
      const error = new ResourceError({
        message: '이미 존재하는 코드입니다.',
        code: ApiErrorCode.RESOURCE_ALREADY_EXISTS,
        resourceType: 'education_category',
        resourceId: body.code
      });
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.CONFLICT });
    }
    
    const { data, error } = await supabase
      .from('education_categories')
      .insert({
        name: body.name,
        code: body.code,
        description: body.description,
        is_mandatory: body.isMandatory || false,
        required_hours: body.requiredHours || 0,
        validity_months: body.validityMonths,
        parent_id: body.parentId,
        display_order: body.displayOrder || 0,
        is_active: body.isActive !== false
      })
      .select()
      .single();
    
    if (error) {
      throw new DatabaseError(error.message);
    }
    
    const response: ApiResponse<EducationCategory> = toApiResponse(data);
    response.message = '교육 카테고리가 성공적으로 생성되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.CREATED });
  } catch (error) {
    console.error('교육 카테고리 생성 오류:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '교육 카테고리 생성 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

// PUT: 교육 카테고리 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      const error = new ValidationError('필수 파라미터가 누락되었습니다.', [
        { field: 'id', message: '카테고리 ID가 필요합니다.' }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }
    
    const body: Partial<EducationCategory> = await request.json();
    
    // 코드 변경시 중복 확인
    if (body.code) {
      const { data: existing } = await supabase
        .from('education_categories')
        .select('id')
        .eq('code', body.code)
        .neq('id', id)
        .single();
      
      if (existing) {
        const error = new ResourceError({
          message: '이미 존재하는 코드입니다.',
          code: ApiErrorCode.RESOURCE_ALREADY_EXISTS,
          resourceType: 'education_category',
          resourceId: body.code
        });
        
        const response: ApiResponse = {
          success: false,
          error: toApiError(error)
        };
        
        return NextResponse.json(response, { status: ApiStatusCode.CONFLICT });
      }
    }
    
    const { data, error } = await supabase
      .from('education_categories')
      .update({
        name: body.name,
        code: body.code,
        description: body.description,
        is_mandatory: body.isMandatory,
        required_hours: body.requiredHours,
        validity_months: body.validityMonths,
        parent_id: body.parentId,
        display_order: body.displayOrder,
        is_active: body.isActive
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.message.includes('no rows')) {
        throw new ResourceError({
          message: '카테고리를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'education_category',
          resourceId: id
        });
      }
      throw new DatabaseError(error.message);
    }
    
    const response: ApiResponse<EducationCategory> = toApiResponse(data);
    response.message = '교육 카테고리가 성공적으로 수정되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('교육 카테고리 수정 오류:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '교육 카테고리 수정 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    const statusCode = error instanceof ResourceError && error.code === ApiErrorCode.RESOURCE_NOT_FOUND
      ? ApiStatusCode.NOT_FOUND
      : ApiStatusCode.INTERNAL_SERVER_ERROR;
    
    return NextResponse.json(response, { status: statusCode });
  }
}

// DELETE: 교육 카테고리 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      const error = new ValidationError('필수 파라미터가 누락되었습니다.', [
        { field: 'id', message: '카테고리 ID가 필요합니다.' }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }
    
    // 하위 카테고리 확인
    const { data: children } = await supabase
      .from('education_categories')
      .select('id')
      .eq('parent_id', id)
      .limit(1);
    
    if (children && children.length > 0) {
      const error = new ResourceError({
        message: '하위 카테고리가 있어 삭제할 수 없습니다.',
        code: ApiErrorCode.RESOURCE_CONFLICT,
        resourceType: 'education_category',
        resourceId: id,
        suggestion: '먼저 하위 카테고리를 삭제하거나 다른 상위 카테고리로 이동시켜주세요.'
      });
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.CONFLICT });
    }
    
    // 연결된 교육 요구사항 확인
    const { data: requirements } = await supabase
      .from('user_education_requirements')
      .select('id')
      .eq('category_id', id)
      .limit(1);
    
    if (requirements && requirements.length > 0) {
      // 비활성화로 처리
      const { error } = await supabase
        .from('education_categories')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) {
        throw new DatabaseError(error.message);
      }
      
      const response: ApiResponse<{ deactivated: boolean }> = toApiResponse({ deactivated: true });
      response.message = '연결된 데이터가 있어 비활성화 처리되었습니다.';
      
      return NextResponse.json(response, { status: ApiStatusCode.OK });
    }
    
    // 실제 삭제
    const { error } = await supabase
      .from('education_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      if (error.message.includes('no rows')) {
        throw new ResourceError({
          message: '카테고리를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'education_category',
          resourceId: id
        });
      }
      throw new DatabaseError(error.message);
    }
    
    const response: ApiResponse<{ deleted: boolean }> = toApiResponse({ deleted: true });
    response.message = '교육 카테고리가 성공적으로 삭제되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('교육 카테고리 삭제 오류:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '교육 카테고리 삭제 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    const statusCode = error instanceof ResourceError && error.code === ApiErrorCode.RESOURCE_NOT_FOUND
      ? ApiStatusCode.NOT_FOUND
      : ApiStatusCode.INTERNAL_SERVER_ERROR;
    
    return NextResponse.json(response, { status: statusCode });
  }
}