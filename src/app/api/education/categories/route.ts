import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EducationCategory } from '@/lib/types/education';

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
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('교육 카테고리 조회 오류:', error);
    return NextResponse.json(
      { error: '교육 카테고리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 교육 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: Partial<EducationCategory> = await request.json();
    
    // 필수 필드 검증
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: '이름과 코드는 필수 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 코드 중복 확인
    const { data: existing } = await supabase
      .from('education_categories')
      .select('id')
      .eq('code', body.code)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: '이미 존재하는 코드입니다.' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('education_categories')
      .insert({
        name: body.name,
        code: body.code,
        description: body.description,
        is_mandatory: body.is_mandatory || false,
        required_hours: body.required_hours || 0,
        validity_months: body.validity_months,
        parent_id: body.parent_id,
        display_order: body.display_order || 0,
        is_active: body.is_active !== false
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('교육 카테고리 생성 오류:', error);
    return NextResponse.json(
      { error: '교육 카테고리 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 교육 카테고리 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '카테고리 ID가 필요합니다.' },
        { status: 400 }
      );
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
        return NextResponse.json(
          { error: '이미 존재하는 코드입니다.' },
          { status: 400 }
        );
      }
    }
    
    const { data, error } = await supabase
      .from('education_categories')
      .update({
        name: body.name,
        code: body.code,
        description: body.description,
        is_mandatory: body.is_mandatory,
        required_hours: body.required_hours,
        validity_months: body.validity_months,
        parent_id: body.parent_id,
        display_order: body.display_order,
        is_active: body.is_active
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
  } catch (error) {
    console.error('교육 카테고리 수정 오류:', error);
    return NextResponse.json(
      { error: '교육 카테고리 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 교육 카테고리 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '카테고리 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 하위 카테고리 확인
    const { data: children } = await supabase
      .from('education_categories')
      .select('id')
      .eq('parent_id', id)
      .limit(1);
    
    if (children && children.length > 0) {
      return NextResponse.json(
        { error: '하위 카테고리가 있어 삭제할 수 없습니다.' },
        { status: 400 }
      );
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
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ 
        data: { message: '연결된 데이터가 있어 비활성화 처리되었습니다.' } 
      });
    }
    
    // 실제 삭제
    const { error } = await supabase
      .from('education_categories')
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
    console.error('교육 카테고리 삭제 오류:', error);
    return NextResponse.json(
      { error: '교육 카테고리 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}