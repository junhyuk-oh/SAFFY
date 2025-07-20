import { NextRequest, NextResponse } from 'next/server'
import type { AnnualSafetyPlan } from '@/lib/types/documents'

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let annualPlans: AnnualSafetyPlan[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const department = searchParams.get('department')
    const status = searchParams.get('status') // draft, approved, completed

    let filteredPlans = annualPlans

    if (year) {
      filteredPlans = filteredPlans.filter(plan => plan.year === parseInt(year))
    }

    if (department) {
      filteredPlans = filteredPlans.filter(plan => 
        plan.department.toLowerCase().includes(department.toLowerCase())
      )
    }

    if (status) {
      filteredPlans = filteredPlans.filter(plan => {
        if (status === 'draft') return !plan.approvalDate
        if (status === 'approved') return !!plan.approvalDate
        return true
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredPlans 
    })
  } catch (error) {
    console.error('Error fetching annual safety plans:', error)
    return NextResponse.json(
      { success: false, error: '연간 안전관리계획서를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 유효성 검사
    if (!body.year || !body.department || !body.preparedBy) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 동일 연도 및 부서의 계획이 이미 존재하는지 확인
    const existingPlan = annualPlans.find(
      plan => plan.year === body.year && plan.department === body.department
    )

    if (existingPlan) {
      return NextResponse.json(
        { success: false, error: '해당 연도 및 부서의 계획이 이미 존재합니다.' },
        { status: 409 }
      )
    }

    const newPlan: AnnualSafetyPlan = {
      id: `ASP-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    annualPlans.push(newPlan)

    return NextResponse.json({ 
      success: true, 
      data: newPlan 
    })
  } catch (error) {
    console.error('Error creating annual safety plan:', error)
    return NextResponse.json(
      { success: false, error: '연간 안전관리계획서 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: '계획서 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const planIndex = annualPlans.findIndex(plan => plan.id === id)
    
    if (planIndex === -1) {
      return NextResponse.json(
        { success: false, error: '계획서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 승인된 계획서는 수정 불가
    if (annualPlans[planIndex].approvalDate) {
      return NextResponse.json(
        { success: false, error: '승인된 계획서는 수정할 수 없습니다.' },
        { status: 403 }
      )
    }

    annualPlans[planIndex] = {
      ...annualPlans[planIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      data: annualPlans[planIndex] 
    })
  } catch (error) {
    console.error('Error updating annual safety plan:', error)
    return NextResponse.json(
      { success: false, error: '연간 안전관리계획서 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: '계획서 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const planIndex = annualPlans.findIndex(plan => plan.id === id)
    
    if (planIndex === -1) {
      return NextResponse.json(
        { success: false, error: '계획서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 승인된 계획서는 삭제 불가
    if (annualPlans[planIndex].approvalDate) {
      return NextResponse.json(
        { success: false, error: '승인된 계획서는 삭제할 수 없습니다.' },
        { status: 403 }
      )
    }

    annualPlans.splice(planIndex, 1)

    return NextResponse.json({ 
      success: true, 
      message: '연간 안전관리계획서가 삭제되었습니다.' 
    })
  } catch (error) {
    console.error('Error deleting annual safety plan:', error)
    return NextResponse.json(
      { success: false, error: '연간 안전관리계획서 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 계획서 승인 엔드포인트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, approvedBy } = body

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const planIndex = annualPlans.findIndex(plan => plan.id === id)
    
    if (planIndex === -1) {
      return NextResponse.json(
        { success: false, error: '계획서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      if (!approvedBy) {
        return NextResponse.json(
          { success: false, error: '승인자 정보가 필요합니다.' },
          { status: 400 }
        )
      }

      annualPlans[planIndex] = {
        ...annualPlans[planIndex],
        approvedBy,
        approvalDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return NextResponse.json({ 
        success: true, 
        message: '계획서가 승인되었습니다.',
        data: annualPlans[planIndex] 
      })
    }

    return NextResponse.json(
      { success: false, error: '지원하지 않는 작업입니다.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing annual safety plan action:', error)
    return NextResponse.json(
      { success: false, error: '작업 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}