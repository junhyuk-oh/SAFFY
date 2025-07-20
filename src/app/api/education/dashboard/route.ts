import { NextResponse } from "next/server"
import { supabase } from "@/lib/db/supabase"

export async function GET(request: Request) {
  try {
    
    // 전체 통계 조회
    const { data: stats, error: statsError } = await supabase
      .from("user_trainings")
      .select("status")
    
    if (statsError) throw statsError
    
    // 상태별 카운트 계산
    const statusCounts = {
      total: stats?.length || 0,
      completed: stats?.filter(s => s.status === "completed").length || 0,
      inProgress: stats?.filter(s => s.status === "in-progress").length || 0,
      notStarted: stats?.filter(s => s.status === "not-started").length || 0,
      overdue: stats?.filter(s => s.status === "overdue").length || 0
    }
    
    // 이수율 계산
    const completionRate = statusCounts.total > 0 
      ? Math.round((statusCounts.completed / statusCounts.total) * 100)
      : 0
    
    // 다가오는 마감일 조회 (30일 이내)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    const { data: upcomingDeadlines, error: deadlineError } = await supabase
      .from("user_trainings")
      .select(`
        id,
        user_id,
        due_date,
        trainings (
          name
        )
      `)
      .eq("status", "in-progress")
      .lte("due_date", thirtyDaysFromNow.toISOString())
      .order("due_date", { ascending: true })
      .limit(5)
    
    if (deadlineError) throw deadlineError
    
    // 최근 교육 요구사항 조회
    const { data: requirements, error: reqError } = await supabase
      .from("training_requirements")
      .select(`
        id,
        reason,
        required_by_date,
        trainings (
          name,
          category_id,
          education_categories (
            name
          )
        )
      `)
      .eq("is_active", true)
      .order("required_by_date", { ascending: true })
      .limit(4)
    
    if (reqError) throw reqError
    
    return NextResponse.json({
      stats: {
        ...statusCounts,
        completionRate
      },
      upcomingDeadlines: upcomingDeadlines || [],
      requirements: requirements || []
    })
  } catch (error) {
    console.error("Education dashboard error:", error)
    return NextResponse.json(
      { error: "Failed to fetch education dashboard data" },
      { status: 500 }
    )
  }
}