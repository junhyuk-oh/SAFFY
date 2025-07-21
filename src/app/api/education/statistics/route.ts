import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  EducationStatistics,
  CategoryStatistics 
} from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET: 교육 통계 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'overview';
    const userId = searchParams.get('user_id');
    const categoryId = searchParams.get('category_id');
    const department = searchParams.get('department');
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    
    if (type === 'overview') {
      // 전체 개요 통계
      const stats: EducationStatistics = {
        total_requirements: 0,
        completed_requirements: 0,
        pending_requirements: 0,
        overdue_requirements: 0,
        completion_rate: 0,
        total_hours: 0,
        recent_education: [],
        upcoming_due_dates: []
      };
      
      // 기본 필터
      let requirementsQuery = supabase
        .from('user_education_requirements')
        .select('*', { count: 'exact' });
      
      let recordsQuery = supabase
        .from('education_records')
        .select('education_hours');
      
      // 사용자별 필터
      if (userId) {
        requirementsQuery = requirementsQuery.eq('user_id', userId);
        recordsQuery = recordsQuery.eq('user_id', userId);
      }
      
      // 연도 필터
      requirementsQuery = requirementsQuery
        .gte('required_date', `${year}-01-01`)
        .lte('required_date', `${year}-12-31`);
      
      // 요구사항 통계
      const { data: requirements, count } = await requirementsQuery;
      
      if (requirements) {
        stats.total_requirements = count || 0;
        stats.completed_requirements = requirements.filter(r => r.status === 'completed').length;
        stats.pending_requirements = requirements.filter(r => r.status === 'pending').length;
        stats.overdue_requirements = requirements.filter(r => r.status === 'overdue').length;
        
        if (stats.total_requirements > 0) {
          stats.completion_rate = (stats.completed_requirements / stats.total_requirements) * 100;
        }
      }
      
      // 교육 시간 합계
      const { data: records } = await recordsQuery;
      if (records) {
        stats.total_hours = records.reduce((sum, r) => sum + (r.education_hours || 0), 0);
      }
      
      // 최근 교육 기록
      let recentQuery = supabase
        .from('education_records')
        .select(`
          *,
          category:education_categories(name),
          user:users(name)
        `)
        .eq('verification_status', 'verified')
        .order('education_date', { ascending: false })
        .limit(5);
      
      if (userId) {
        recentQuery = recentQuery.eq('user_id', userId);
      }
      
      const { data: recentEducation } = await recentQuery;
      if (recentEducation) {
        stats.recent_education = recentEducation;
      }
      
      // 임박한 마감일
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      let upcomingQuery = supabase
        .from('user_education_requirements')
        .select(`
          *,
          category:education_categories(name),
          user:users(name)
        `)
        .in('status', ['pending', 'in_progress'])
        .gte('due_date', today)
        .lte('due_date', thirtyDaysLater)
        .order('due_date', { ascending: true })
        .limit(10);
      
      if (userId) {
        upcomingQuery = upcomingQuery.eq('user_id', userId);
      }
      
      const { data: upcomingDueDates } = await upcomingQuery;
      if (upcomingDueDates) {
        stats.upcoming_due_dates = upcomingDueDates;
      }
      
      return NextResponse.json({ data: stats });
      
    } else if (type === 'by-category') {
      // 카테고리별 통계
      const { data: categories } = await supabase
        .from('education_categories')
        .select('id, name')
        .eq('is_active', true);
      
      if (!categories) {
        return NextResponse.json({ data: [] });
      }
      
      const categoryStats: CategoryStatistics[] = [];
      
      for (const category of categories) {
        let query = supabase
          .from('user_education_requirements')
          .select('status, user_id', { count: 'exact' })
          .eq('category_id', category.id)
          .gte('required_date', `${year}-01-01`)
          .lte('required_date', `${year}-12-31`);
        
        if (department) {
          // 부서 필터링을 위해 users 테이블 조인 필요
          // Supabase에서는 복잡한 조인 쿼리가 제한적이므로 별도 처리 필요
        }
        
        const { data: requirements, count } = await query;
        
        const stat: CategoryStatistics = {
          category_id: category.id,
          category_name: category.name,
          total_users: count || 0,
          completed_users: 0,
          pending_users: 0,
          overdue_users: 0,
          completion_rate: 0,
          average_hours: 0
        };
        
        if (requirements) {
          const userStatusMap = new Map<string, string>();
          requirements.forEach(r => {
            userStatusMap.set(r.user_id, r.status);
          });
          
          stat.total_users = userStatusMap.size;
          stat.completed_users = Array.from(userStatusMap.values()).filter(s => s === 'completed').length;
          stat.pending_users = Array.from(userStatusMap.values()).filter(s => s === 'pending').length;
          stat.overdue_users = Array.from(userStatusMap.values()).filter(s => s === 'overdue').length;
          
          if (stat.total_users > 0) {
            stat.completion_rate = (stat.completed_users / stat.total_users) * 100;
          }
        }
        
        // 평균 교육 시간
        const { data: records } = await supabase
          .from('education_records')
          .select('education_hours')
          .eq('category_id', category.id)
          .eq('verification_status', 'verified');
        
        if (records && records.length > 0) {
          const totalHours = records.reduce((sum, r) => sum + (r.education_hours || 0), 0);
          stat.average_hours = totalHours / records.length;
        }
        
        categoryStats.push(stat);
      }
      
      return NextResponse.json({ data: categoryStats });
      
    } else if (type === 'monthly') {
      // 월별 통계
      const monthlyStats = [];
      
      for (let month = 1; month <= 12; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const startDate = `${year}-${monthStr}-01`;
        const endDate = new Date(parseInt(year), month, 0).toISOString().split('T')[0];
        
        let completedQuery = supabase
          .from('user_education_requirements')
          .select('id', { count: 'exact' })
          .eq('status', 'completed')
          .gte('completion_date', startDate)
          .lte('completion_date', endDate);
        
        let recordsQuery = supabase
          .from('education_records')
          .select('education_hours')
          .eq('verification_status', 'verified')
          .gte('education_date', startDate)
          .lte('education_date', endDate);
        
        if (userId) {
          completedQuery = completedQuery.eq('user_id', userId);
          recordsQuery = recordsQuery.eq('user_id', userId);
        }
        
        if (categoryId) {
          completedQuery = completedQuery.eq('category_id', categoryId);
          recordsQuery = recordsQuery.eq('category_id', categoryId);
        }
        
        const { count: completedCount } = await completedQuery;
        const { data: records } = await recordsQuery;
        
        const totalHours = records?.reduce((sum, r) => sum + (r.education_hours || 0), 0) || 0;
        
        monthlyStats.push({
          year: parseInt(year),
          month,
          completed_requirements: completedCount || 0,
          total_hours: totalHours,
          education_count: records?.length || 0
        });
      }
      
      return NextResponse.json({ data: monthlyStats });
      
    } else if (type === 'department') {
      // 부서별 통계 (복잡한 조인이 필요하므로 간단한 버전으로 구현)
      return NextResponse.json({ 
        data: [], 
        message: '부서별 통계는 별도 구현이 필요합니다.' 
      });
    }
    
    return NextResponse.json(
      { error: '유효하지 않은 통계 유형입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('교육 통계 조회 오류:', error);
    return NextResponse.json(
      { error: '교육 통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}