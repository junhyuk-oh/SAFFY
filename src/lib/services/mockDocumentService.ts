/**
 * Mock 문서 서비스 (테스트용)
 * 실제 데이터베이스 연결 없이 메모리상에서 작동합니다.
 */

import { 
  BaseDocument, 
  UnifiedDocumentType, 
  DocumentSearchParams,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  DocumentStatistics,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPE_CATEGORY_MAP
} from '@/lib/types';
import { AppError, ValidationError } from '@/lib/types/error';
import { ApiErrorCode } from '@/lib/types/api';

// Mock 데이터 저장소
let mockDocuments: BaseDocument[] = [
  // 일일 점검 문서들
  {
    id: '1',
    type: 'daily-checklist',
    title: '2025년 1월 21일 일일 안전 점검',
    status: 'completed',
    author: '김안전',
    authorId: 'user-1',
    department: '안전관리팀',
    departmentId: 'dept-safety',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['일일점검', '안전'],
      category: '일상 안전 관리'
    },
    attachments: [],
    createdAt: '2025-01-21T08:00:00Z',
    updatedAt: '2025-01-21T09:30:00Z'
  },
  {
    id: '2',
    type: 'daily-checklist',
    title: '2025년 1월 20일 일일 안전 점검',
    status: 'completed',
    author: '김안전',
    authorId: 'user-1',
    department: '안전관리팀',
    departmentId: 'dept-safety',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['일일점검', '안전'],
      category: '일상 안전 관리'
    },
    attachments: [],
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-20T09:15:00Z'
  },
  {
    id: '3',
    type: 'daily-checklist',
    title: '2025년 1월 19일 일일 안전 점검',
    status: 'overdue',
    author: '김안전',
    authorId: 'user-1',
    department: '안전관리팀',
    departmentId: 'dept-safety',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['일일점검', '안전', '미완료'],
      category: '일상 안전 관리'
    },
    attachments: [],
    createdAt: '2025-01-19T08:00:00Z',
    updatedAt: '2025-01-19T08:00:00Z'
  },
  
  // 위험성 평가 문서들
  {
    id: '4',
    type: 'risk-assessment',
    title: '실험실 A동 위험성 평가 보고서',
    status: 'draft',
    author: '이연구',
    authorId: 'user-2',
    department: '연구개발팀',
    departmentId: 'dept-rd',
    metadata: {
      version: 2,
      isAiGenerated: true,
      tags: ['위험성평가', '실험실', 'AI생성'],
      category: '위험 평가 및 대응'
    },
    attachments: [],
    createdAt: '2025-01-20T14:00:00Z',
    updatedAt: '2025-01-21T10:00:00Z'
  },
  {
    id: '5',
    type: 'risk-assessment',
    title: '신규 화학물질 도입 위험성 평가',
    status: 'completed',
    author: '박화학',
    authorId: 'user-4',
    department: '품질관리팀',
    departmentId: 'dept-qc',
    metadata: {
      version: 3,
      isAiGenerated: false,
      tags: ['위험성평가', '화학물질', '승인완료'],
      category: '위험 평가 및 대응'
    },
    attachments: [],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-18T16:00:00Z'
  },
  {
    id: '6',
    type: 'jha',
    title: '용접 작업 위험성 평가(JHA)',
    status: 'completed',
    author: '최안전',
    authorId: 'user-5',
    department: '시설관리팀',
    departmentId: 'dept-facility',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['JHA', '용접', '고위험작업'],
      category: '위험 평가 및 대응'
    },
    attachments: [],
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-10T15:00:00Z'
  },
  
  // 교육 관련 문서들
  {
    id: '7',
    type: 'education-log',
    title: '1월 정기 안전교육 실시 기록',
    status: 'completed',
    author: '박교육',
    authorId: 'user-3',
    department: '인사팀',
    departmentId: 'dept-hr',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['교육', '정기교육', '안전교육'],
      category: '교육 및 훈련'
    },
    attachments: [],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T16:00:00Z'
  },
  {
    id: '8',
    type: 'education-log',
    title: '신입사원 안전교육 이수 기록',
    status: 'completed',
    author: '박교육',
    authorId: 'user-3',
    department: '인사팀',
    departmentId: 'dept-hr',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['교육', '신입교육', '필수교육'],
      category: '교육 및 훈련'
    },
    attachments: [],
    createdAt: '2025-01-08T09:00:00Z',
    updatedAt: '2025-01-08T18:00:00Z'
  },
  {
    id: '9',
    type: 'ai-training-program',
    title: 'AI 안전 시스템 활용 교육 계획',
    status: 'draft',
    author: '강혁신',
    authorId: 'user-6',
    department: 'IT팀',
    departmentId: 'dept-it',
    metadata: {
      version: 1,
      isAiGenerated: true,
      tags: ['AI교육', '신기술', '교육계획'],
      category: 'AI 안전 관리'
    },
    attachments: [],
    createdAt: '2025-01-20T11:00:00Z',
    updatedAt: '2025-01-21T09:00:00Z'
  },
  
  // 화학물질 관련 문서들
  {
    id: '10',
    type: 'chemical-usage-report',
    title: '2025년 1월 화학물질 사용 현황 보고서',
    status: 'completed',
    author: '정화학',
    authorId: 'user-7',
    department: '연구개발팀',
    departmentId: 'dept-rd',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['화학물질', '월간보고', '사용현황'],
      category: '화학물질 안전'
    },
    attachments: [],
    createdAt: '2025-01-20T16:00:00Z',
    updatedAt: '2025-01-20T17:30:00Z'
  },
  {
    id: '11',
    type: 'chemical-inventory',
    title: '실험실 화학물질 재고 현황',
    status: 'completed',
    author: '정화학',
    authorId: 'user-7',
    department: '연구개발팀',
    departmentId: 'dept-rd',
    metadata: {
      version: 2,
      isAiGenerated: false,
      tags: ['화학물질', '재고관리', '실험실'],
      category: '화학물질 안전'
    },
    attachments: [],
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-01-21T11:00:00Z'
  },
  {
    id: '12',
    type: 'msds-summary',
    title: '신규 화학물질 MSDS 요약본',
    status: 'draft',
    author: '정화학',
    authorId: 'user-7',
    department: '연구개발팀',
    departmentId: 'dept-rd',
    metadata: {
      version: 1,
      isAiGenerated: true,
      tags: ['MSDS', '화학물질', 'AI요약'],
      category: '화학물질 안전'
    },
    attachments: [],
    createdAt: '2025-01-21T13:00:00Z',
    updatedAt: '2025-01-21T13:30:00Z'
  },
  
  // 주간/월간/분기/연간 보고서들
  {
    id: '13',
    type: 'weekly-checklist',
    title: '2025년 1월 3주차 주간 안전 점검표',
    status: 'completed',
    author: '김안전',
    authorId: 'user-1',
    department: '안전관리팀',
    departmentId: 'dept-safety',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['주간점검', '안전점검'],
      category: '정기 보고서'
    },
    attachments: [],
    createdAt: '2025-01-17T16:00:00Z',
    updatedAt: '2025-01-17T17:00:00Z'
  },
  {
    id: '14',
    type: 'quarterly-report',
    title: '2024년 4분기 안전관리 실적 보고서',
    status: 'completed',
    author: '김안전',
    authorId: 'user-1',
    department: '안전관리팀',
    departmentId: 'dept-safety',
    metadata: {
      version: 3,
      isAiGenerated: false,
      tags: ['분기보고', '실적보고', '경영진보고'],
      category: '정기 보고서'
    },
    attachments: [],
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-10T14:00:00Z'
  },
  {
    id: '15',
    type: 'annual-safety-plan',
    title: '2025년 연간 안전관리 계획서',
    status: 'completed',
    author: '임팀장',
    authorId: 'user-8',
    department: '안전관리팀',
    departmentId: 'dept-safety',
    metadata: {
      version: 2,
      isAiGenerated: false,
      tags: ['연간계획', '안전계획', '승인완료'],
      category: '정기 보고서'
    },
    attachments: [],
    createdAt: '2024-12-20T09:00:00Z',
    updatedAt: '2024-12-28T16:00:00Z'
  },
  
  // 안전 점검 및 사고 관련 문서들
  {
    id: '16',
    type: 'safety-inspection',
    title: '2층 실험실 정기 안전점검 보고서',
    status: 'completed',
    author: '최점검',
    authorId: 'user-9',
    department: '시설관리팀',
    departmentId: 'dept-facility',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['정기점검', '실험실', '시설안전'],
      category: '안전 점검'
    },
    attachments: [],
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-16T15:00:00Z'
  },
  {
    id: '17',
    type: 'incident-report',
    title: '경미한 화학물질 누출 사고 보고서',
    status: 'completed',
    author: '박대응',
    authorId: 'user-10',
    department: '안전관리팀',
    departmentId: 'dept-safety',
    metadata: {
      version: 2,
      isAiGenerated: false,
      tags: ['사고보고', '화학물질', '경미사고'],
      category: '사고 및 대응'
    },
    attachments: [],
    createdAt: '2025-01-12T14:30:00Z',
    updatedAt: '2025-01-13T10:00:00Z'
  },
  {
    id: '18',
    type: 'emergency-plan',
    title: '화재 대응 비상계획서 개정안',
    status: 'draft',
    author: '박대응',
    authorId: 'user-10',
    department: '안전관리팀',
    departmentId: 'dept-safety',
    metadata: {
      version: 4,
      isAiGenerated: false,
      tags: ['비상계획', '화재', '개정중'],
      category: '비상 대응'
    },
    attachments: [],
    createdAt: '2025-01-19T09:00:00Z',
    updatedAt: '2025-01-21T14:00:00Z'
  },
  
  // AI 안전 관련 문서들
  {
    id: '19',
    type: 'ai-safety-assessment',
    title: 'AI 기반 안전 모니터링 시스템 평가서',
    status: 'completed',
    author: '강혁신',
    authorId: 'user-6',
    department: 'IT팀',
    departmentId: 'dept-it',
    metadata: {
      version: 1,
      isAiGenerated: true,
      tags: ['AI평가', '모니터링', '시스템평가'],
      category: 'AI 안전 관리'
    },
    attachments: [],
    createdAt: '2025-01-14T11:00:00Z',
    updatedAt: '2025-01-14T17:00:00Z'
  },
  {
    id: '20',
    type: 'ai-requirements-spec',
    title: 'AI 안전 예측 시스템 요구사항 명세서',
    status: 'draft',
    author: '강혁신',
    authorId: 'user-6',
    department: 'IT팀',
    departmentId: 'dept-it',
    metadata: {
      version: 2,
      isAiGenerated: false,
      tags: ['AI개발', '요구사항', '시스템설계'],
      category: 'AI 안전 관리'
    },
    attachments: [],
    createdAt: '2025-01-18T13:00:00Z',
    updatedAt: '2025-01-21T10:00:00Z'
  },
  {
    id: '21',
    type: 'ai-compliance-checklist',
    title: 'AI 시스템 규정 준수 체크리스트',
    status: 'completed',
    author: '윤규정',
    authorId: 'user-11',
    department: '법무팀',
    departmentId: 'dept-legal',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['AI규정', '컴플라이언스', '체크리스트'],
      category: 'AI 안전 관리'
    },
    attachments: [],
    createdAt: '2025-01-11T10:00:00Z',
    updatedAt: '2025-01-11T16:00:00Z'
  },
  
  // 실험 및 연구 관련 문서들
  {
    id: '22',
    type: 'experiment-log',
    title: '신소재 합성 실험 안전 기록',
    status: 'completed',
    author: '이연구',
    authorId: 'user-2',
    department: '연구개발팀',
    departmentId: 'dept-rd',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['실험기록', '신소재', '안전절차'],
      category: '실험 안전'
    },
    attachments: [],
    createdAt: '2025-01-20T09:00:00Z',
    updatedAt: '2025-01-20T18:00:00Z'
  },
  {
    id: '23',
    type: 'experiment-log',
    title: '고온 반응 실험 프로토콜 및 안전 조치',
    status: 'draft',
    author: '이연구',
    authorId: 'user-2',
    department: '연구개발팀',
    departmentId: 'dept-rd',
    metadata: {
      version: 3,
      isAiGenerated: false,
      tags: ['실험계획', '고온반응', '안전프로토콜'],
      category: '실험 안전'
    },
    attachments: [],
    createdAt: '2025-01-21T08:00:00Z',
    updatedAt: '2025-01-21T15:00:00Z'
  },
  
  // 기타 부서별 문서들
  {
    id: '24',
    type: 'safety-inspection',
    title: '생산라인 A 안전장치 점검 보고서',
    status: 'completed',
    author: '조생산',
    authorId: 'user-12',
    department: '생산팀',
    departmentId: 'dept-production',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['생산안전', '장비점검', '정기점검'],
      category: '안전 점검'
    },
    attachments: [],
    createdAt: '2025-01-13T08:00:00Z',
    updatedAt: '2025-01-13T12:00:00Z'
  },
  {
    id: '25',
    type: 'risk-assessment',
    title: '신규 생산설비 도입 위험성 평가',
    status: 'overdue',
    author: '조생산',
    authorId: 'user-12',
    department: '생산팀',
    departmentId: 'dept-production',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['설비도입', '위험평가', '지연'],
      category: '위험 평가 및 대응'
    },
    attachments: [],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z'
  },
  {
    id: '26',
    type: 'ai-monitoring-dashboard',
    title: 'AI 안전 모니터링 대시보드 월간 리포트',
    status: 'completed',
    author: '강혁신',
    authorId: 'user-6',
    department: 'IT팀',
    departmentId: 'dept-it',
    metadata: {
      version: 1,
      isAiGenerated: true,
      tags: ['AI모니터링', '월간리포트', '대시보드'],
      category: 'AI 안전 관리'
    },
    attachments: [],
    createdAt: '2025-01-20T17:00:00Z',
    updatedAt: '2025-01-20T17:30:00Z'
  },
  {
    id: '27',
    type: 'education-log',
    title: '협력업체 안전교육 실시 확인서',
    status: 'draft',
    author: '한협력',
    authorId: 'user-13',
    department: '구매팀',
    departmentId: 'dept-purchase',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['협력업체', '안전교육', '외부교육'],
      category: '교육 및 훈련'
    },
    attachments: [],
    createdAt: '2025-01-21T11:00:00Z',
    updatedAt: '2025-01-21T11:30:00Z'
  },
  {
    id: '28',
    type: 'safety-inspection',
    title: '전기설비 정기 안전점검 결과',
    status: 'completed',
    author: '최점검',
    authorId: 'user-9',
    department: '시설관리팀',
    departmentId: 'dept-facility',
    metadata: {
      version: 1,
      isAiGenerated: false,
      tags: ['전기안전', '정기점검', '시설물'],
      category: '안전 점검'
    },
    attachments: [],
    createdAt: '2025-01-09T09:00:00Z',
    updatedAt: '2025-01-09T16:00:00Z'
  }
];

export class MockDocumentService {
  
  /**
   * 문서 목록 조회
   */
  async getDocuments(params: DocumentSearchParams) {
    // 딜레이 시뮬레이션
    await this.simulateDelay();
    
    let filteredDocs = [...mockDocuments];
    
    // 검색어 필터링
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.author.toLowerCase().includes(query) ||
        doc.department.toLowerCase().includes(query)
      );
    }
    
    // 문서 타입 필터링
    if (params.type && params.type.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        params.type!.includes(doc.type)
      );
    }
    
    // 상태 필터링
    if (params.status && params.status.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        params.status!.includes(doc.status as any)
      );
    }
    
    // 부서 필터링
    if (params.department && params.department.length > 0) {
      filteredDocs = filteredDocs.filter(doc => 
        params.department!.includes(doc.department)
      );
    }
    
    // 정렬
    filteredDocs.sort((a, b) => {
      const field = params.sortBy || 'createdAt';
      const order = params.sortOrder || 'desc';
      
      let aVal = a[field as keyof BaseDocument];
      let bVal = b[field as keyof BaseDocument];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return 0;
    });
    
    // 페이지네이션
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const paginatedDocs = filteredDocs.slice(start, start + limit);
    
    return {
      documents: paginatedDocs,
      totalCount: filteredDocs.length,
      totalPages: Math.ceil(filteredDocs.length / limit),
      currentPage: page,
      limit
    };
  }

  /**
   * 개별 문서 조회
   */
  async getDocumentById(id: string): Promise<BaseDocument> {
    await this.simulateDelay();
    
    const doc = mockDocuments.find(d => d.id === id);
    if (!doc) {
      throw new AppError({
        message: '문서를 찾을 수 없습니다.',
        code: ApiErrorCode.RESOURCE_NOT_FOUND,
        context: { metadata: { documentId: id } }
      });
    }
    
    return { ...doc };
  }

  /**
   * 새 문서 생성
   */
  async createDocument(request: CreateDocumentRequest, userId: string): Promise<BaseDocument> {
    await this.simulateDelay();
    
    // 유효성 검증
    this.validateCreateRequest(request);
    
    const newDoc: BaseDocument = {
      id: `mock-${Date.now()}`,
      type: request.type,
      title: request.title,
      status: request.isDraft ? 'draft' : 'draft',
      author: '테스트 사용자',
      authorId: userId,
      department: request.department,
      metadata: {
        version: 1,
        isAiGenerated: request.aiOptions ? true : false,
        templateId: request.templateId,
        tags: [],
        category: DOCUMENT_CATEGORIES[DOCUMENT_TYPE_CATEGORY_MAP[request.type]]
      },
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockDocuments.unshift(newDoc);
    
    return newDoc;
  }

  /**
   * 문서 수정
   */
  async updateDocument(request: UpdateDocumentRequest, userId: string): Promise<BaseDocument> {
    await this.simulateDelay();
    
    const index = mockDocuments.findIndex(d => d.id === request.id);
    if (index === -1) {
      throw new AppError({
        message: '문서를 찾을 수 없습니다.',
        code: ApiErrorCode.RESOURCE_NOT_FOUND,
        context: { metadata: { documentId: request.id } }
      });
    }
    
    const existingDoc = mockDocuments[index];
    const updatedDoc = {
      ...existingDoc,
      ...request.updates,
      metadata: {
        ...existingDoc.metadata,
        ...request.updates.metadata,
        version: (existingDoc.metadata?.version || 1) + 1
      },
      updatedAt: new Date().toISOString()
    };
    
    mockDocuments[index] = updatedDoc;
    
    return updatedDoc;
  }

  /**
   * 문서 삭제
   */
  async deleteDocument(id: string): Promise<void> {
    await this.simulateDelay();
    
    const index = mockDocuments.findIndex(d => d.id === id);
    if (index === -1) {
      throw new AppError({
        message: '문서를 찾을 수 없습니다.',
        code: ApiErrorCode.RESOURCE_NOT_FOUND,
        context: { metadata: { documentId: id } }
      });
    }
    
    mockDocuments.splice(index, 1);
  }

  /**
   * 문서 통계 조회
   */
  async getDocumentStatistics(): Promise<DocumentStatistics> {
    await this.simulateDelay();
    
    const totalCount = mockDocuments.length;
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    
    mockDocuments.forEach(doc => {
      // 타입별 통계
      byType[doc.type] = (byType[doc.type] || 0) + 1;
      
      // 상태별 통계
      byStatus[doc.status] = (byStatus[doc.status] || 0) + 1;
      
      // 부서별 통계
      byDepartment[doc.department] = (byDepartment[doc.department] || 0) + 1;
    });
    
    const aiGeneratedCount = mockDocuments.filter(d => d.metadata?.isAiGenerated).length;
    
    return {
      totalCount,
      byType,
      byStatus,
      byDepartment,
      byPeriod: {
        daily: 5,
        weekly: 20,
        monthly: 80,
        quarterly: 240,
        annual: 960
      },
      aiGenerated: {
        count: aiGeneratedCount,
        percentage: totalCount ? (aiGeneratedCount / totalCount) * 100 : 0
      },
      recentActivity: {
        created: 10,
        updated: 15,
        approved: 8
      }
    };
  }

  /**
   * 문서 검색
   */
  async searchDocuments(query: string, filters: Partial<DocumentSearchParams> = {}) {
    const searchParams: DocumentSearchParams = {
      query,
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 20,
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc'
    };
    
    return await this.getDocuments(searchParams);
  }

  /**
   * 태그별 문서 조회
   */
  async getDocumentsByTags(tags: string[], limit: number = 20) {
    await this.simulateDelay();
    
    const filtered = mockDocuments.filter(doc => 
      tags.some(tag => doc.metadata?.tags?.includes(tag))
    );
    
    return filtered.slice(0, limit);
  }

  /**
   * 부서별 문서 조회
   */
  async getDocumentsByDepartment(department: string, limit: number = 20) {
    await this.simulateDelay();
    
    const filtered = mockDocuments.filter(doc => doc.department === department);
    
    return filtered.slice(0, limit);
  }

  // Private 헬퍼 메서드들
  
  private async simulateDelay() {
    // 네트워크 지연 시뮬레이션 (50-200ms)
    const delay = Math.random() * 150 + 50;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  private validateCreateRequest(request: CreateDocumentRequest): void {
    const errors: Array<{ field: string; message: string; value?: unknown }> = [];
    
    if (!request.type) {
      errors.push({ field: 'type', message: '문서 타입은 필수입니다.' });
    }
    
    if (!request.title) {
      errors.push({ field: 'title', message: '문서 제목은 필수입니다.' });
    }
    
    if (!request.department) {
      errors.push({ field: 'department', message: '부서는 필수입니다.' });
    }
    
    if (errors.length > 0) {
      throw new ValidationError('필수 필드가 누락되었습니다.', errors);
    }
  }
}

// 싱글톤 인스턴스
export const mockDocumentService = new MockDocumentService();