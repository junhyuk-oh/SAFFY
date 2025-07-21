import { NextRequest, NextResponse } from 'next/server'
import type { QuarterlyReport } from '@/lib/types/documents'

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
const quarterlyReports: QuarterlyReport[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const quarter = searchParams.get('quarter')
    const department = searchParams.get('department')

    let filteredReports = quarterlyReports

    if (year) {
      filteredReports = filteredReports.filter(report => report.year === parseInt(year))
    }

    if (quarter) {
      filteredReports = filteredReports.filter(report => report.quarter === parseInt(quarter))
    }

    if (department) {
      filteredReports = filteredReports.filter(report => 
        report.department.toLowerCase().includes(department.toLowerCase())
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredReports 
    })
  } catch (error) {
    console.error('Error fetching quarterly reports:', error)
    return NextResponse.json(
      { success: false, error: '분기 보고서를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 유효성 검사
    if (!body.year || !body.quarter || !body.department) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const newReport: QuarterlyReport = {
      id: `QR-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    quarterlyReports.push(newReport)

    return NextResponse.json({ 
      success: true, 
      data: newReport 
    })
  } catch (error) {
    console.error('Error creating quarterly report:', error)
    return NextResponse.json(
      { success: false, error: '분기 보고서 생성에 실패했습니다.' },
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
        { success: false, error: '보고서 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const reportIndex = quarterlyReports.findIndex(report => report.id === id)
    
    if (reportIndex === -1) {
      return NextResponse.json(
        { success: false, error: '보고서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    quarterlyReports[reportIndex] = {
      ...quarterlyReports[reportIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      data: quarterlyReports[reportIndex] 
    })
  } catch (error) {
    console.error('Error updating quarterly report:', error)
    return NextResponse.json(
      { success: false, error: '분기 보고서 수정에 실패했습니다.' },
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
        { success: false, error: '보고서 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const reportIndex = quarterlyReports.findIndex(report => report.id === id)
    
    if (reportIndex === -1) {
      return NextResponse.json(
        { success: false, error: '보고서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    quarterlyReports.splice(reportIndex, 1)

    return NextResponse.json({ 
      success: true, 
      message: '분기 보고서가 삭제되었습니다.' 
    })
  } catch (error) {
    console.error('Error deleting quarterly report:', error)
    return NextResponse.json(
      { success: false, error: '분기 보고서 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}