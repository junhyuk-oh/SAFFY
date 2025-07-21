import { NextRequest, NextResponse } from 'next/server';
import { generateDocument, GeneratedDocument } from '@/lib/ai-documents/generator';
import { 
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode
} from '@/lib/types/api';
import {
  AppError,
  ValidationError,
  toApiResponse,
  toApiError
} from '@/lib/types';

// 유효한 문서 타입 정의
const VALID_DOCUMENT_TYPES = [
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
] as const;

type ValidDocumentType = typeof VALID_DOCUMENT_TYPES[number];

// 요청 본문 타입 정의
interface GenerateDocumentRequestBody {
  documentType: string;
  data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateDocumentRequestBody;
    const { documentType, data } = body;

    // 필수 파라미터 검증
    if (!documentType || !data) {
      const fields = [];
      if (!documentType) {
        fields.push({ field: 'documentType', message: '문서 타입은 필수입니다.' });
      }
      if (!data) {
        fields.push({ field: 'data', message: '문서 데이터는 필수입니다.' });
      }
      
      const error = new ValidationError('필수 파라미터가 누락되었습니다.', fields);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    // 문서 타입 검증
    if (!VALID_DOCUMENT_TYPES.includes(documentType as ValidDocumentType)) {
      const error = new ValidationError('유효하지 않은 문서 타입입니다.', [
        { 
          field: 'documentType', 
          message: '지원되는 문서 타입이 아닙니다.',
          value: documentType,
          suggestion: `다음 중 하나여야 합니다: ${VALID_DOCUMENT_TYPES.join(', ')}`
        }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    // 문서 생성
    const document = await generateDocument(documentType, data);

    const response: ApiResponse<{
      document: GeneratedDocument;
      generatedAt: string;
      documentType: string;
    }> = toApiResponse({
      document,
      generatedAt: new Date().toISOString(),
      documentType
    });
    
    response.message = '문서가 성공적으로 생성되었습니다.';

    return NextResponse.json(response, { status: ApiStatusCode.CREATED });

  } catch (error) {
    console.error('문서 생성 중 오류:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 생성 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR,
      suggestion: '잠시 후 다시 시도해주세요.'
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

// OPTIONS 메서드 지원 (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: ApiStatusCode.NO_CONTENT,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}