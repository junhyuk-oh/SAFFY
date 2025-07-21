import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  DailyEducationLog,
  CreateDailyEducationLogDTO,
  EducationType,
  PaginationParams 
} from '@/lib/types/education';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET: 일일 교육 로그 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    // 필터 파라미터
    const filters = {
      user_id: searchParams.get('user_id'),
      education_type: searchParams.get('education_type') as EducationType,
      date_from: searchParams.get('date_from'),
      date_to: searchParams.get('date_to'),
      department: searchParams.get('department'),
    };
    
    // 페이지네이션 파라미터
    const pagination: PaginationParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
      sortBy: searchParams.get('sort_by') || 'education_date',
      sortOrder: (searchParams.get('sort_order') || 'desc') as 'asc' | 'desc'
    };
    
    // 기본 쿼리
    let query = supabase
      .from('daily_education_logs')
      .select(`
        *,
        user:users(id, name, department),
        instructor:users!instructor_id(id, name)
      `, { count: 'exact' });
    
    // 필터 적용
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.education_type) {
      query = query.eq('education_type', filters.education_type);
    }
    if (filters.date_from) {
      query = query.gte('education_date', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('education_date', filters.date_to);
    }
    
    // 정렬
    query = query.order(pagination.sortBy || 'education_date', { 
      ascending: pagination.sortOrder === 'asc' 
    });
    
    // 페이지네이션
    const page = pagination.page || 1;
    const limit = pagination.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit - 1;
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
        page: pagination.page || 1,
        limit: pagination.limit || 50,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / (pagination.limit || 50))
      }
    });
  } catch (error) {
    console.error('일일 교육 로그 조회 오류:', error);
    return NextResponse.json(
      { error: '일일 교육 로그 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 일일 교육 로그 생성 (대량 생성 지원)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: CreateDailyEducationLogDTO = await request.json();
    
    // 필수 필드 검증
    if (!body.educationDate || !body.educationType || !body.topic) {
      return NextResponse.json(
        { error: '교육일, 교육 유형, 주제는 필수 항목입니다.' },
        { status: 400 }
      );
    }
    
    if (!body.attendanceRecords || body.attendanceRecords.length === 0) {
      return NextResponse.json(
        { error: '출석 기록이 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 일일 교육 로그 생성
    const logs = [];
    const errors = [];
    
    for (const attendance of body.attendanceRecords) {
      // 중복 확인
      const { data: existing } = await supabase
        .from('daily_education_logs')
        .select('id')
        .eq('user_id', attendance.userId)
        .eq('education_date', body.educationDate)
        .eq('education_type', body.educationType)
        .single();
      
      if (existing) {
        errors.push(`사용자 ${attendance.userId}의 ${body.educationDate} ${body.educationType} 기록이 이미 존재합니다.`);
        continue;
      }
      
      // 로그 생성
      const { data, error } = await supabase
        .from('daily_education_logs')
        .insert({
          user_id: attendance.userId,
          education_date: body.educationDate,
          education_type: body.educationType,
          topic: body.topic,
          duration_minutes: body.durationMinutes || 0,
          instructor_id: body.instructorId,
          location: body.location,
          attendance_status: attendance.present ? 'present' : 'absent',
          notes: attendance.notes
        })
        .select(`
          *,
          user:users(id, name, department),
          instructor:users!instructor_id(id, name)
        `)
        .single();
      
      if (error) {
        errors.push(`사용자 ${attendance.userId}: ${error.message}`);
      } else {
        logs.push(data);
      }
    }
    
    if (logs.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { error: '일일 교육 로그 생성 실패', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      data: logs,
      errors: errors.length > 0 ? errors : undefined 
    }, { status: 201 });
  } catch (error) {
    console.error('일일 교육 로그 생성 오류:', error);
    return NextResponse.json(
      { error: '일일 교육 로그 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 일일 교육 로그 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '로그 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const body: Partial<DailyEducationLog> = await request.json();
    
    interface UpdateData {
      topic?: string;
      duration_minutes?: number;
      instructor_id?: string;
      location?: string;
      attendance_status?: 'present' | 'absent' | 'excused';
      notes?: string;
    }
    
    const updateData: UpdateData = {};
    
    // 수정 가능한 필드만 업데이트
    if (body.topic) updateData.topic = body.topic;
    if (body.durationMinutes !== undefined) updateData.duration_minutes = body.durationMinutes;
    if (body.instructorId !== undefined) updateData.instructor_id = body.instructorId;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.attendanceStatus) updateData.attendance_status = body.attendanceStatus;
    if (body.notes !== undefined) updateData.notes = body.notes;
    
    const { data, error } = await supabase
      .from('daily_education_logs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        user:users(id, name, department),
        instructor:users!instructor_id(id, name)
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
    console.error('일일 교육 로그 수정 오류:', error);
    return NextResponse.json(
      { error: '일일 교육 로그 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 일일 교육 로그 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '로그 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('daily_education_logs')
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
    console.error('일일 교육 로그 삭제 오류:', error);
    return NextResponse.json(
      { error: '일일 교육 로그 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 일일 교육 통계
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'statistics') {
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
      const educationType = searchParams.get('education_type') as EducationType;
      
      // 출석 통계 조회
      let statsQuery = supabase
        .from('daily_education_logs')
        .select('attendance_status, user_id', { count: 'exact' })
        .eq('education_date', date);
      
      if (educationType) {
        statsQuery = statsQuery.eq('education_type', educationType);
      }
      
      const { data, error, count } = await statsQuery;
      
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      // 통계 계산
      const statistics = {
        date,
        education_type: educationType,
        total_participants: count || 0,
        present: data?.filter(d => d.attendance_status === 'present').length || 0,
        absent: data?.filter(d => d.attendance_status === 'absent').length || 0,
        excused: data?.filter(d => d.attendance_status === 'excused').length || 0,
        attendance_rate: 0
      };
      
      if (statistics.total_participants > 0) {
        statistics.attendance_rate = (statistics.present / statistics.total_participants) * 100;
      }
      
      return NextResponse.json({ data: statistics });
    }
    
    return NextResponse.json(
      { error: '유효하지 않은 액션입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('일일 교육 통계 조회 오류:', error);
    return NextResponse.json(
      { error: '일일 교육 통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}