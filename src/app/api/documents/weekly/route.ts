import { NextResponse } from 'next/server';
import { WeeklyCheckList, ChemicalUsageReport } from '@/lib/types/documents';

// 유니온 타입 정의
type WeeklyDocument = WeeklyCheckList | ChemicalUsageReport;
type WeeklyDocumentType = 'weekly-checklist' | 'chemical-usage-report';

// 임시 메모리 저장소 (실제로는 데이터베이스 사용)
const weeklyCheckLists: WeeklyCheckList[] = [];
const chemicalUsageReports: ChemicalUsageReport[] = [];

// GET: 주별 문서 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const weekStart = searchParams.get('weekStart');
    const weekEnd = searchParams.get('weekEnd');
    const department = searchParams.get('department');

    let results: WeeklyDocument[] = [];

    if (type === 'weekly-checklist' || !type) {
      let filteredCheckLists = [...weeklyCheckLists];
      
      if (weekStart) {
        filteredCheckLists = filteredCheckLists.filter(
          doc => new Date(doc.weekStartDate) >= new Date(weekStart)
        );
      }
      
      if (weekEnd) {
        filteredCheckLists = filteredCheckLists.filter(
          doc => new Date(doc.weekEndDate) <= new Date(weekEnd)
        );
      }
      
      if (department) {
        filteredCheckLists = filteredCheckLists.filter(
          doc => doc.department.toLowerCase().includes(department.toLowerCase())
        );
      }
      
      results = [...results, ...filteredCheckLists];
    }

    if (type === 'chemical-usage-report' || !type) {
      let filteredReports = [...chemicalUsageReports];
      
      if (weekStart) {
        filteredReports = filteredReports.filter(
          doc => new Date(doc.weekStartDate) >= new Date(weekStart)
        );
      }
      
      if (weekEnd) {
        filteredReports = filteredReports.filter(
          doc => new Date(doc.weekEndDate) <= new Date(weekEnd)
        );
      }
      
      if (department) {
        filteredReports = filteredReports.filter(
          doc => doc.department.toLowerCase().includes(department.toLowerCase())
        );
      }
      
      results = [...results, ...filteredReports];
    }

    // 날짜 기준 내림차순 정렬
    results.sort((a, b) => 
      new Date(b.weekStartDate || b.createdAt).getTime() - 
      new Date(a.weekStartDate || a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching weekly documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

interface PostRequestBody {
  type: WeeklyDocumentType;
  data: Partial<WeeklyDocument>;
}

// POST: 새 주별 문서 생성
export async function POST(request: Request) {
  try {
    const body = await request.json() as PostRequestBody;
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: 'Type and data are required' },
        { status: 400 }
      );
    }

    let newDocument: WeeklyDocument;

    if (type === 'weekly-checklist') {
      newDocument = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as WeeklyCheckList;
      
      weeklyCheckLists.push(newDocument);
    } else if (type === 'chemical-usage-report') {
      newDocument = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as ChemicalUsageReport;
      
      chemicalUsageReports.push(newDocument);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newDocument
    });
  } catch (error) {
    console.error('Error creating weekly document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

interface PutRequestBody {
  type: WeeklyDocumentType;
  id: string;
  data: Partial<WeeklyDocument>;
}

// PUT: 주별 문서 수정
export async function PUT(request: Request) {
  try {
    const body = await request.json() as PutRequestBody;
    const { type, id, data } = body;

    if (!type || !id || !data) {
      return NextResponse.json(
        { success: false, error: 'Type, id, and data are required' },
        { status: 400 }
      );
    }

    let updatedDocument: WeeklyDocument;

    if (type === 'weekly-checklist') {
      const index = weeklyCheckLists.findIndex(doc => doc.id === id);
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Document not found' },
          { status: 404 }
        );
      }
      
      updatedDocument = {
        ...weeklyCheckLists[index],
        ...data,
        id,
        updatedAt: new Date().toISOString()
      };
      
      weeklyCheckLists[index] = updatedDocument;
    } else if (type === 'chemical-usage-report') {
      const index = chemicalUsageReports.findIndex(doc => doc.id === id);
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Document not found' },
          { status: 404 }
        );
      }
      
      updatedDocument = {
        ...chemicalUsageReports[index],
        ...data,
        id,
        updatedAt: new Date().toISOString()
      };
      
      chemicalUsageReports[index] = updatedDocument;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedDocument
    });
  } catch (error) {
    console.error('Error updating weekly document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE: 주별 문서 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: 'Type and id are required' },
        { status: 400 }
      );
    }

    if (type === 'weekly-checklist') {
      const index = weeklyCheckLists.findIndex(doc => doc.id === id);
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Document not found' },
          { status: 404 }
        );
      }
      
      weeklyCheckLists.splice(index, 1);
    } else if (type === 'chemical-usage-report') {
      const index = chemicalUsageReports.findIndex(doc => doc.id === id);
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Document not found' },
          { status: 404 }
        );
      }
      
      chemicalUsageReports.splice(index, 1);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting weekly document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}