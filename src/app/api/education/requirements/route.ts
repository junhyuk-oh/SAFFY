import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  UserEducationRequirement, 
  CreateEducationRequirementDTO,
  EducationFilterOptions,
  PaginationParams 
} from '@/lib/types/education';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET: 교육 요구사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    // 필터 파라미터
    const filters: EducationFilterOptions = {
      category_id: searchParams.get('category_id') || undefined,
      status: searchParams.get('status') as any || undefined,
      user_id: searchParams.get('user_id') || undefined,
      department: searchParams.get('department') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
    };
    
    // 페이지네이션 파라미터
    const pagination: PaginationParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sort_by: searchParams.get('sort_by') || 'due_date',
      sort_order: (searchParams.get('sort_order') || 'asc') as 'asc' | 'desc'
    };
    
    // 기본 쿼리
    let query = supabase
      .from('user_education_requirements')
      .select(`
        *,
        category:education_categories(*),
        user:users(id, name, email, department, position)
      `, { count: 'exact' });
    
    // 필터 적용
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.date_from) {
      query = query.gte('due_date', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('due_date', filters.date_to);
    }
    
    // 부서 필터 (users 테이블 조인 필요)
    if (filters.department) {
      query = query.eq('user.department', filters.department);
    }
    
    // 정렬
    query = query.order(pagination.sort_by, { 
      ascending: pagination.sort_order === 'asc' 
    });
    
    // 페이지네이션
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit - 1;
    query = query.range(start, end);
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / pagination.limit)
      }
    });
  } catch (error) {
    console.error('교육 요구사항 조회 오류:', error);
    return NextResponse.json(
      { error: '교육 요구사항 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 교육 요구사항 생성 (대량 생성 지원)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: CreateEducationRequirementDTO = await request.json();
    
    // 필수 필드 검증
    if (!body.user_ids || body.user_ids.length === 0 || !body.category_id) {
      return NextResponse.json(
        { error: '사용자와 교육 카테고리는 필수 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 날짜 검증
    if (new Date(body.due_date) < new Date(body.required_date)) {
      return NextResponse.json(
        { error: '완료 기한은 시작일보다 이후여야 합니다.' },
        { status: 400 }
      );
    }
    
    // 중복 확인 및 생성
    const requirements = [];
    const errors = [];
    
    for (const userId of body.user_ids) {
      // 중복 확인
      const { data: existing } = await supabase
        .from('user_education_requirements')
        .select('id')
        .eq('user_id', userId)
        .eq('category_id', body.category_id)
        .eq('required_date', body.required_date)
        .single();
      
      if (existing) {
        errors.push(`사용자 ${userId}에 대한 요구사항이 이미 존재합니다.`);
        continue;
      }
      
      // 요구사항 생성
      const { data, error } = await supabase
        .from('user_education_requirements')
        .insert({
          user_id: userId,
          category_id: body.category_id,
          required_date: body.required_date,
          due_date: body.due_date,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        errors.push(`사용자 ${userId}: ${error.message}`);
      } else {
        requirements.push(data);
      }
    }
    
    if (requirements.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { error: '요구사항 생성 실패', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      data: requirements,
      errors: errors.length > 0 ? errors : undefined 
    }, { status: 201 });
  } catch (error) {
    console.error('교육 요구사항 생성 오류:', error);
    return NextResponse.json(
      { error: '교육 요구사항 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 교육 요구사항 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '요구사항 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const body: Partial<UserEducationRequirement> = await request.json();
    
    // 날짜 검증
    if (body.due_date && body.required_date) {
      if (new Date(body.due_date) < new Date(body.required_date)) {
        return NextResponse.json(
          { error: '완료 기한은 시작일보다 이후여야 합니다.' },
          { status: 400 }
        );
      }
    }
    
    const updateData: any = {};
    
    // 수정 가능한 필드만 업데이트
    if (body.due_date) updateData.due_date = body.due_date;
    if (body.status) updateData.status = body.status;
    if (body.completion_date) updateData.completion_date = body.completion_date;
    if (body.exemption_reason !== undefined) updateData.exemption_reason = body.exemption_reason;
    if (body.is_exempted !== undefined) updateData.is_exempted = body.is_exempted;
    
    const { data, error } = await supabase
      .from('user_education_requirements')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:education_categories(*),
        user:users(id, name, email, department, position)
      `)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('교육 요구사항 수정 오류:', error);
    return NextResponse.json(
      { error: '교육 요구사항 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 교육 요구사항 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '요구사항 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 연결된 교육 기록 확인
    const { data: records } = await supabase
      .from('education_records')
      .select('id')
      .eq('requirement_id', id)
      .limit(1);
    
    if (records && records.length > 0) {
      return NextResponse.json(
        { error: '연결된 교육 기록이 있어 삭제할 수 없습니다.' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('user_education_requirements')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ data: { message: '삭제되었습니다.' } });
  } catch (error) {
    console.error('교육 요구사항 삭제 오류:', error);
    return NextResponse.json(
      { error: '교육 요구사항 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 만료된 요구사항 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'check-overdue') {
      // 만료된 요구사항 확인 및 업데이트
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('user_education_requirements')
        .update({ status: 'overdue' })
        .in('status', ['pending', 'in_progress'])
        .lt('due_date', today)
        .select();
      
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ 
        data: { 
          message: `${data?.length || 0}개의 요구사항이 만료 상태로 업데이트되었습니다.` 
        } 
      });
    }
    
    return NextResponse.json(
      { error: '유효하지 않은 액션입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('교육 요구사항 업데이트 오류:', error);
    return NextResponse.json(
      { error: '교육 요구사항 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}