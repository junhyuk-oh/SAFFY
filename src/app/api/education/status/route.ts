import { NextResponse } from "next/server"
import { supabase } from "@/lib/db/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    
    let query = supabase
      .from("user_trainings")
      .select(`
        *,
        trainings (
          id,
          name,
          duration,
          is_mandatory
        )
      `)
      .order("due_date", { ascending: true })
    
    // 상태 필터
    if (status && status !== "전체") {
      const statusMap: Record<string, 'completed' | 'in-progress' | 'not-started' | 'overdue'> = {
        "완료": "completed",
        "진행중": "in-progress",
        "미시작": "not-started",
        "기한초과": "overdue"
      }
      if (statusMap[status]) {
        query = query.eq("status", statusMap[status])
      }
    }
    
    // 검색 필터 (교육명)
    if (search) {
      // Supabase에서 관계 테이블 검색은 복잡하므로 
      // 클라이언트 사이드 필터링으로 처리
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // 클라이언트 사이드 검색 필터 적용
    let filteredData = data || []
    if (search) {
      filteredData = filteredData.filter(item => 
        item.trainings?.name?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    return NextResponse.json({ records: filteredData })
  } catch (error) {
    console.error("Training status fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch training status" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 수료증 업로드 처리
    const { data: userTraining, error: updateError } = await supabase
      .from("user_trainings")
      .update({
        status: "completed",
        completion_date: body.completionDate,
        certificate_number: body.certificateNumber,
        certificate_url: body.certificateUrl,
        score: body.score
      })
      .eq("id", body.userTrainingId)
      .select()
      .single()
    
    if (updateError) throw updateError
    
    // 수료증 정보 저장
    if (body.certificateNumber) {
      const { error: certError } = await supabase
        .from("certificates")
        .insert([{
          user_training_id: body.userTrainingId,
          certificate_number: body.certificateNumber,
          issue_date: body.completionDate,
          expiry_date: body.expiryDate,
          file_url: body.certificateUrl,
          issued_by: body.issuedBy || "시스템"
        }])
      
      if (certError) throw certError
    }
    
    // 완료 알림 생성
    const { error: notifError } = await supabase
      .from("training_notifications")
      .insert([{
        user_id: userTraining.user_id,
        type: "completion_congratulation",
        training_id: userTraining.training_id,
        message: "교육을 성공적으로 완료하셨습니다!",
        priority: "low"
      }])
    
    if (notifError) console.error("Notification creation failed:", notifError)
    
    return NextResponse.json({ success: true, userTraining })
  } catch (error) {
    console.error("Certificate upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload certificate" },
      { status: 500 }
    )
  }
}

// 교육 배정 API
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    // 교육 요구사항 생성
    const { data: requirement, error: reqError } = await supabase
      .from("training_requirements")
      .insert([{
        user_id: body.userId,
        training_id: body.trainingId,
        required_by_date: body.requiredByDate,
        reason: body.reason,
        assigned_by: body.assignedBy,
        assigned_date: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (reqError) throw reqError
    
    // 사용자-교육 매핑 생성
    const { error: userTrainingError } = await supabase
      .from("user_trainings")
      .insert([{
        user_id: body.userId,
        training_id: body.trainingId,
        status: "not-started",
        enrolled_date: new Date().toISOString(),
        due_date: body.requiredByDate
      }])
    
    if (userTrainingError) throw userTrainingError
    
    // 배정 알림 생성
    const { error: notifError } = await supabase
      .from("training_notifications")
      .insert([{
        user_id: body.userId,
        type: "new_assignment",
        training_id: body.trainingId,
        message: "새로운 교육이 배정되었습니다.",
        priority: "medium"
      }])
    
    if (notifError) console.error("Notification creation failed:", notifError)
    
    return NextResponse.json({ success: true, requirement })
  } catch (error) {
    console.error("Training assignment error:", error)
    return NextResponse.json(
      { error: "Failed to assign training" },
      { status: 500 }
    )
  }
}