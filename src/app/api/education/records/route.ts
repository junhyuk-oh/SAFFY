import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  EducationRecord,
  CreateEducationRecordDTO,
  EducationFilterOptions,
  PaginationParams,
  VerificationStatus 
} from '@/lib/types/education';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET: 교육 기록 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    // 필터 파라미터
    const filters: EducationFilterOptions = {
      category_id: searchParams.get('category_id') || undefined,
      user_id: searchParams.get('user_id') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      verification_status: searchParams.get('verification_status') as VerificationStatus || undefined,
    };
    
    // 페이지네이션 파라미터
    const pagination: PaginationParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sort_by: searchParams.get('sort_by') || 'education_date',
      sort_order: (searchParams.get('sort_order') || 'desc') as 'asc' | 'desc'
    };
    
    // 기본 쿼리
    let query = supabase
      .from('education_records')
      .select(`
        *,
        category:education_categories(*),
        user:users(id, name, email),
        verifier:users!verified_by(id, name)
      `, { count: 'exact' });
    
    // 필터 적용
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.date_from) {
      query = query.gte('education_date', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('education_date', filters.date_to);
    }
    if (filters.verification_status) {
      query = query.eq('verification_status', filters.verification_status);
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
    console.error('교육 기록 조회 오류:', error);
    return NextResponse.json(
      { error: '교육 기록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 교육 기록 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const formData = await request.formData();
    
    // FormData에서 데이터 추출
    const recordData: CreateEducationRecordDTO = {
      user_id: formData.get('user_id') as string,
      category_id: formData.get('category_id') as string,
      requirement_id: formData.get('requirement_id') as string || undefined,
      education_date: formData.get('education_date') as string,
      education_hours: parseFloat(formData.get('education_hours') as string),
      provider: formData.get('provider') as string || undefined,
      certificate_number: formData.get('certificate_number') as string || undefined,
      certificate_file: formData.get('certificate_file') as File || undefined,
      expiry_date: formData.get('expiry_date') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };
    
    // 필수 필드 검증
    if (!recordData.user_id || !recordData.category_id || !recordData.education_date) {
      return NextResponse.json(
        { error: '사용자, 교육 카테고리, 교육일은 필수 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 수료증 파일 처리
    let certificateUrl: string | undefined;
    let certificateFilePath: string | undefined;
    
    if (recordData.certificate_file) {
      // 파일 업로드 로직 (별도 스토리지 서비스 연동 필요)
      // 임시로 파일명만 저장
      certificateFilePath = `certificates/${recordData.user_id}/${Date.now()}_${recordData.certificate_file.name}`;
      // TODO: 실제 파일 업로드 구현
    }
    
    // 교육 기록 생성
    const { data, error } = await supabase
      .from('education_records')
      .insert({
        user_id: recordData.user_id,
        category_id: recordData.category_id,
        requirement_id: recordData.requirement_id,
        education_date: recordData.education_date,
        education_hours: recordData.education_hours,
        provider: recordData.provider,
        certificate_number: recordData.certificate_number,
        certificate_url: certificateUrl,
        certificate_file_path: certificateFilePath,
        expiry_date: recordData.expiry_date,
        verification_status: 'pending',
        notes: recordData.notes
      })
      .select(`
        *,
        category:education_categories(*),
        user:users(id, name, email)
      `)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('교육 기록 생성 오류:', error);
    return NextResponse.json(
      { error: '교육 기록 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 교육 기록 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '기록 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const body: Partial<EducationRecord> = await request.json();
    
    const updateData: any = {};
    
    // 수정 가능한 필드만 업데이트
    if (body.education_date) updateData.education_date = body.education_date;
    if (body.education_hours !== undefined) updateData.education_hours = body.education_hours;
    if (body.provider !== undefined) updateData.provider = body.provider;
    if (body.certificate_number !== undefined) updateData.certificate_number = body.certificate_number;
    if (body.expiry_date !== undefined) updateData.expiry_date = body.expiry_date;
    if (body.notes !== undefined) updateData.notes = body.notes;
    
    const { data, error } = await supabase
      .from('education_records')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:education_categories(*),
        user:users(id, name, email),
        verifier:users!verified_by(id, name)
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
    console.error('교육 기록 수정 오류:', error);
    return NextResponse.json(
      { error: '교육 기록 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 교육 기록 검증 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!id) {
      return NextResponse.json(
        { error: '기록 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 현재 사용자 정보 가져오기 (인증 미들웨어에서 설정된다고 가정)
    // TODO: 실제 인증 정보 연동
    const verifierId = 'current-user-id'; // 임시 값
    
    if (action === 'verify') {
      // 검증 승인
      const { data, error } = await supabase
        .from('education_records')
        .update({
          verification_status: 'verified',
          verification_date: new Date().toISOString(),
          verified_by: verifierId,
          rejection_reason: null
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ data });
    } else if (action === 'reject') {
      // 검증 거부
      const body = await request.json();
      const { rejection_reason } = body;
      
      if (!rejection_reason) {
        return NextResponse.json(
          { error: '거부 사유가 필요합니다.' },
          { status: 400 }
        );
      }
      
      const { data, error } = await supabase
        .from('education_records')
        .update({
          verification_status: 'rejected',
          verification_date: new Date().toISOString(),
          verified_by: verifierId,
          rejection_reason
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ data });
    }
    
    return NextResponse.json(
      { error: '유효하지 않은 액션입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('교육 기록 검증 오류:', error);
    return NextResponse.json(
      { error: '교육 기록 검증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 교육 기록 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '기록 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 검증된 기록은 삭제 불가
    const { data: record } = await supabase
      .from('education_records')
      .select('verification_status')
      .eq('id', id)
      .single();
    
    if (record?.verification_status === 'verified') {
      return NextResponse.json(
        { error: '검증된 기록은 삭제할 수 없습니다.' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('education_records')
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
    console.error('교육 기록 삭제 오류:', error);
    return NextResponse.json(
      { error: '교육 기록 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}