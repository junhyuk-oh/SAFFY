import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai-documents/generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentType, data } = body;

    // 필수 파라미터 검증
    if (!documentType || !data) {
      return NextResponse.json(
        { error: '문서 타입과 데이터는 필수입니다.' },
        { status: 400 }
      );
    }

    // 문서 타입 검증
    const validTypes = [
      'safety-assessment',
      'requirements-spec',
      'implementation-plan',
      'test-scenarios',
      'training-program',
      'compliance-checklist',
      'ethical-framework',
      'incident-response',
      'monitoring-dashboard',
      'risk-mitigation'
    ];

    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: '유효하지 않은 문서 타입입니다.' },
        { status: 400 }
      );
    }

    // 문서 생성 (Mock)
    const document = await generateDocument(documentType, data);

    return NextResponse.json({
      success: true,
      document,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('문서 생성 중 오류:', error);
    return NextResponse.json(
      { error: '문서 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 지원 (CORS)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}