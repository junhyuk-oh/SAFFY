import { NextRequest, NextResponse } from 'next/server';
import { 
  DailyCheckList, 
  ExperimentLog, 
  DocumentMetadata,
  ApiResponse,
  ApiStatusCode,
  ApiErrorCode,
  AppError,
  ValidationError,
  ResourceError,
  toApiResponse,
  toApiError
} from '@/lib/types';

// 임시 메모리 저장소 (실제 환경에서는 데이터베이스 사용)
const checkLists: DailyCheckList[] = [];
const experimentLogs: ExperimentLog[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const date = searchParams.get('date');
    const department = searchParams.get('department');

    let results: (DailyCheckList | ExperimentLog)[] = [];

    // 문서 타입에 따라 필터링
    if (type === 'checklist') {
      results = checkLists;
    } else if (type === 'experiment-log') {
      results = experimentLogs;
    } else {
      // 모든 문서 반환
      results = [...checkLists, ...experimentLogs];
    }

    // 날짜 필터링
    if (date) {
      results = results.filter(doc => doc.date === date);
    }

    // 부서 필터링
    if (department) {
      results = results.filter(doc => 
        doc.department.toLowerCase().includes(department.toLowerCase())
      );
    }

    // 메타데이터 형식으로 변환
    const metadata: DocumentMetadata[] = results.map(doc => {
      const isCheckList = 'checkItems' in doc;
      return {
        id: doc.id,
        type: isCheckList ? 'checklist' : 'experiment-log',
        title: isCheckList ? `일일 안전점검표 - ${doc.date}` : (doc as ExperimentLog).experimentTitle,
        date: doc.date,
        creator: isCheckList ? (doc as DailyCheckList).inspectorName : (doc as ExperimentLog).researcher,
        status: doc.signature ? 'completed' : 'draft',
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        author: isCheckList ? (doc as DailyCheckList).inspectorName : (doc as ExperimentLog).researcher,
        department: doc.department || '안전관리팀',
        version: '1.0.0'
      };
    });

    const response: ApiResponse<{ documents: DocumentMetadata[]; count: number }> = toApiResponse({
      documents: metadata,
      count: metadata.length
    });
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error fetching daily documents:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서를 불러오는 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      const error = new ValidationError('필수 데이터가 누락되었습니다.', [
        { field: 'type', message: '문서 타입은 필수입니다.' },
        { field: 'data', message: '문서 데이터는 필수입니다.' }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    let savedDocument;

    if (type === 'checklist') {
      const checkList: DailyCheckList = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      checkLists.push(checkList);
      savedDocument = checkList;
    } else if (type === 'experiment-log') {
      const experimentLog: ExperimentLog = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      experimentLogs.push(experimentLog);
      savedDocument = experimentLog;
    } else {
      const error = new ValidationError('유효하지 않은 문서 타입입니다.', [
        { field: 'type', message: `문서 타입은 'checklist' 또는 'experiment-log'여야 합니다.`, value: type }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    const response: ApiResponse = toApiResponse(savedDocument);
    response.message = '문서가 성공적으로 저장되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.CREATED });
  } catch (error) {
    console.error('Error saving daily document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 저장 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, data } = body;

    if (!id || !type || !data) {
      const error = new ValidationError('필수 데이터가 누락되었습니다.', [
        { field: 'id', message: '문서 ID는 필수입니다.' },
        { field: 'type', message: '문서 타입은 필수입니다.' },
        { field: 'data', message: '문서 데이터는 필수입니다.' }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    let updatedDocument;

    if (type === 'checklist') {
      const index = checkLists.findIndex(doc => doc.id === id);
      if (index === -1) {
        const error = new ResourceError({
          message: '문서를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'checklist',
          resourceId: id
        });
        
        const response: ApiResponse = {
          success: false,
          error: toApiError(error)
        };
        
        return NextResponse.json(response, { status: ApiStatusCode.NOT_FOUND });
      }
      checkLists[index] = {
        ...checkLists[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      updatedDocument = checkLists[index];
    } else if (type === 'experiment-log') {
      const index = experimentLogs.findIndex(doc => doc.id === id);
      if (index === -1) {
        const error = new ResourceError({
          message: '문서를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'experiment-log',
          resourceId: id
        });
        
        const response: ApiResponse = {
          success: false,
          error: toApiError(error)
        };
        
        return NextResponse.json(response, { status: ApiStatusCode.NOT_FOUND });
      }
      experimentLogs[index] = {
        ...experimentLogs[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      updatedDocument = experimentLogs[index];
    } else {
      const error = new ValidationError('유효하지 않은 문서 타입입니다.', [
        { field: 'type', message: `문서 타입은 'checklist' 또는 'experiment-log'여야 합니다.`, value: type }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    const response: ApiResponse = toApiResponse(updatedDocument);
    response.message = '문서가 성공적으로 업데이트되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error updating daily document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 업데이트 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      const error = new ValidationError('필수 파라미터가 누락되었습니다.', [
        { field: 'id', message: '문서 ID는 필수입니다.' },
        { field: 'type', message: '문서 타입은 필수입니다.' }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    if (type === 'checklist') {
      const index = checkLists.findIndex(doc => doc.id === id);
      if (index === -1) {
        const error = new ResourceError({
          message: '문서를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'checklist',
          resourceId: id
        });
        
        const response: ApiResponse = {
          success: false,
          error: toApiError(error)
        };
        
        return NextResponse.json(response, { status: ApiStatusCode.NOT_FOUND });
      }
      checkLists.splice(index, 1);
    } else if (type === 'experiment-log') {
      const index = experimentLogs.findIndex(doc => doc.id === id);
      if (index === -1) {
        const error = new ResourceError({
          message: '문서를 찾을 수 없습니다.',
          code: ApiErrorCode.RESOURCE_NOT_FOUND,
          resourceType: 'experiment-log',
          resourceId: id
        });
        
        const response: ApiResponse = {
          success: false,
          error: toApiError(error)
        };
        
        return NextResponse.json(response, { status: ApiStatusCode.NOT_FOUND });
      }
      experimentLogs.splice(index, 1);
    } else {
      const error = new ValidationError('유효하지 않은 문서 타입입니다.', [
        { field: 'type', message: `문서 타입은 'checklist' 또는 'experiment-log'여야 합니다.`, value: type }
      ]);
      
      const response: ApiResponse = {
        success: false,
        error: toApiError(error)
      };
      
      return NextResponse.json(response, { status: ApiStatusCode.BAD_REQUEST });
    }

    const response: ApiResponse = toApiResponse({ deleted: true });
    response.message = '문서가 성공적으로 삭제되었습니다.';
    
    return NextResponse.json(response, { status: ApiStatusCode.OK });
  } catch (error) {
    console.error('Error deleting daily document:', error);
    
    const appError = error instanceof AppError ? error : new AppError({
      message: '문서 삭제 중 오류가 발생했습니다.',
      code: ApiErrorCode.INTERNAL_ERROR
    });
    
    const response: ApiResponse = {
      success: false,
      error: toApiError(appError)
    };
    
    return NextResponse.json(response, { status: ApiStatusCode.INTERNAL_SERVER_ERROR });
  }
}