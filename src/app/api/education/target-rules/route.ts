import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TargetRule } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET: 대상자 규칙 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const categoryId = searchParams.get('category_id');
    const ruleType = searchParams.get('rule_type');
    const isActive = searchParams.get('active');
    
    let query = supabase
      .from('target_rules')
      .select(`
        *,
        category:education_categories(id, name, code)
      `)
      .order('priority', { ascending: false });
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (ruleType) {
      query = query.eq('rule_type', ruleType);
    }
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
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
    console.error('대상자 규칙 조회 오류:', error);
    return NextResponse.json(
      { error: '대상자 규칙 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 대상자 규칙 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: Partial<TargetRule> = await request.json();
    
    // 필수 필드 검증
    if (!body.category_id || !body.rule_type || !body.rule_value) {
      return NextResponse.json(
        { error: '카테고리, 규칙 유형, 규칙 값은 필수 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 규칙 값 검증
    const validRuleTypes = ['department', 'position', 'role', 'work_type', 'custom'];
    if (!validRuleTypes.includes(body.rule_type)) {
      return NextResponse.json(
        { error: '유효하지 않은 규칙 유형입니다.' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('target_rules')
      .insert({
        category_id: body.category_id,
        rule_type: body.rule_type,
        rule_value: body.rule_value,
        priority: body.priority || 0,
        is_active: body.is_active !== false
      })
      .select(`
        *,
        category:education_categories(id, name, code)
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
    console.error('대상자 규칙 생성 오류:', error);
    return NextResponse.json(
      { error: '대상자 규칙 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 대상자 규칙 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '규칙 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const body: Partial<TargetRule> = await request.json();
    
    const updateData: any = {};
    
    if (body.rule_value) updateData.rule_value = body.rule_value;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    
    const { data, error } = await supabase
      .from('target_rules')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:education_categories(id, name, code)
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
    console.error('대상자 규칙 수정 오류:', error);
    return NextResponse.json(
      { error: '대상자 규칙 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 대상자 규칙 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '규칙 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('target_rules')
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
    console.error('대상자 규칙 삭제 오류:', error);
    return NextResponse.json(
      { error: '대상자 규칙 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 대상자 규칙 적용
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'apply-rules') {
      const body = await request.json();
      const { category_id, dry_run = false } = body;
      
      if (!category_id) {
        return NextResponse.json(
          { error: '카테고리 ID가 필요합니다.' },
          { status: 400 }
        );
      }
      
      // 카테고리에 해당하는 활성 규칙 조회
      const { data: rules, error: rulesError } = await supabase
        .from('target_rules')
        .select('*')
        .eq('category_id', category_id)
        .eq('is_active', true)
        .order('priority', { ascending: false });
      
      if (rulesError || !rules || rules.length === 0) {
        return NextResponse.json(
          { error: '적용할 규칙이 없습니다.' },
          { status: 404 }
        );
      }
      
      // 사용자 목록 조회
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, department, position, role');
      
      if (usersError || !users) {
        return NextResponse.json(
          { error: '사용자 조회 실패' },
          { status: 500 }
        );
      }
      
      // 규칙에 매칭되는 사용자 찾기
      const matchedUsers = new Set<string>();
      
      for (const rule of rules) {
        for (const user of users) {
          let isMatch = false;
          
          switch (rule.rule_type) {
            case 'department':
              if (rule.rule_value.departments?.includes(user.department)) {
                isMatch = true;
              }
              break;
            case 'position':
              if (rule.rule_value.positions?.includes(user.position)) {
                isMatch = true;
              }
              break;
            case 'role':
              if (rule.rule_value.roles?.includes(user.role)) {
                isMatch = true;
              }
              break;
            case 'custom':
              // 커스텀 규칙은 별도 로직 필요
              break;
          }
          
          if (isMatch) {
            matchedUsers.add(user.id);
          }
        }
      }
      
      const matchedUserIds = Array.from(matchedUsers);
      
      if (dry_run) {
        // 드라이런 모드: 실제 생성하지 않고 대상자만 반환
        return NextResponse.json({ 
          data: {
            matched_users: matchedUserIds,
            count: matchedUserIds.length,
            dry_run: true
          }
        });
      }
      
      // 실제 교육 요구사항 생성
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setMonth(dueDate.getMonth() + 1); // 기본 1개월 후 마감
      
      const requirements = [];
      const errors = [];
      
      for (const userId of matchedUserIds) {
        // 중복 확인
        const { data: existing } = await supabase
          .from('user_education_requirements')
          .select('id')
          .eq('user_id', userId)
          .eq('category_id', category_id)
          .eq('required_date', today.toISOString().split('T')[0])
          .single();
        
        if (existing) {
          continue;
        }
        
        const { data, error } = await supabase
          .from('user_education_requirements')
          .insert({
            user_id: userId,
            category_id: category_id,
            required_date: today.toISOString().split('T')[0],
            due_date: dueDate.toISOString().split('T')[0],
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
      
      return NextResponse.json({ 
        data: {
          created_requirements: requirements.length,
          errors: errors.length > 0 ? errors : undefined,
          matched_users: matchedUserIds.length
        }
      });
    }
    
    return NextResponse.json(
      { error: '유효하지 않은 액션입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('대상자 규칙 적용 오류:', error);
    return NextResponse.json(
      { error: '대상자 규칙 적용 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}