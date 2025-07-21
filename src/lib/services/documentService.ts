/**
 * 통합 문서 서비스
 * Supabase와 연동하여 문서 CRUD 작업을 처리합니다.
 */

import { supabase, Database } from '@/lib/db/supabase';
import { 
  BaseDocument, 
  UnifiedDocumentType, 
  DocumentSearchParams,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  DocumentStatistics,
  DocumentTemplate,
  DocumentVersion,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPE_CATEGORY_MAP
} from '@/lib/types';
import { AppError, ValidationError } from '@/lib/types/error';
import { ApiErrorCode } from '@/lib/types/api';

type DocumentRow = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

export class DocumentService {
  
  /**
   * 문서 목록 조회 (필터링, 페이지네이션, 정렬)
   */
  async getDocuments(params: DocumentSearchParams) {
    try {
      // Supabase 쿼리 구성
      let query = supabase
        .from('documents')
        .select('*', { count: 'exact' });

      // 검색어 필터링
      if (params.query) {
        query = query.or(`title.ilike.%${params.query}%,content->>'description'.ilike.%${params.query}%`);
      }

      // 문서 타입 필터링
      if (params.type) {
        const types = Array.isArray(params.type) ? params.type : [params.type];
        query = query.in('content->type', types);
      }

      // 상태 필터링
      if (params.status) {
        const statuses = Array.isArray(params.status) ? params.status : [params.status];
        query = query.in('status', statuses);
      }

      // 부서 필터링
      if (params.department) {
        const departments = Array.isArray(params.department) ? params.department : [params.department];
        query = query.in('content->department', departments);
      }

      // 작성자 필터링
      if (params.author) {
        query = query.eq('user_id', params.author);
      }

      // 날짜 범위 필터링
      if (params.dateRange) {
        query = query
          .gte('created_at', params.dateRange.start)
          .lte('created_at', params.dateRange.end);
      }

      // 태그 필터링
      if (params.tags && params.tags.length > 0) {
        query = query.contains('content->metadata->tags', params.tags);
      }

      // AI 생성 여부 필터링
      if (params.isAiGenerated !== undefined) {
        query = query.eq('content->metadata->isAiGenerated', params.isAiGenerated);
      }

      // 정렬 적용
      const sortColumn = this.getSortColumn(params.sortBy || 'createdAt');
      query = query.order(sortColumn, { ascending: params.sortOrder === 'asc' });

      // 페이지네이션 적용
      const page = params.page || 1;
      const limit = params.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // 쿼리 실행
      const { data, error, count } = await query;

      if (error) {
        throw new AppError({
          message: '문서 조회 중 데이터베이스 오류가 발생했습니다.',
          code: ApiErrorCode.DATABASE_ERROR,
          context: { metadata: { error: error.message } }
        });
      }

      // 데이터 변환
      const documents = (data || []).map(this.mapToBaseDocument);

      return {
        documents,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
        limit
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        message: '문서 조회 중 오류가 발생했습니다.',
        code: ApiErrorCode.INTERNAL_ERROR,
        context: { metadata: { originalError: error } }
      });
    }
  }

  /**
   * 개별 문서 조회
   */
  async getDocumentById(id: string): Promise<BaseDocument> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError({
            message: '문서를 찾을 수 없습니다.',
            code: ApiErrorCode.RESOURCE_NOT_FOUND,
            context: { metadata: { documentId: id } }
          });
        }
        throw new AppError({
          message: '문서 조회 중 데이터베이스 오류가 발생했습니다.',
          code: ApiErrorCode.DATABASE_ERROR,
          context: { metadata: { error: error.message, documentId: id } }
        });
      }

      return this.mapToBaseDocument(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        message: '문서 조회 중 오류가 발생했습니다.',
        code: ApiErrorCode.INTERNAL_ERROR,
        context: { metadata: { documentId: id, originalError: error } }
      });
    }
  }

  /**
   * 새 문서 생성
   */
  async createDocument(request: CreateDocumentRequest, userId: string): Promise<BaseDocument> {
    try {
      // 유효성 검증
      this.validateCreateRequest(request);

      // BaseDocument 구조로 content 생성
      const content = {
        type: request.type,
        author: 'Current User', // TODO: 실제 사용자 이름으로 교체
        department: request.department,
        metadata: {
          version: 1,
          isAiGenerated: request.aiOptions ? true : false,
          templateId: request.templateId,
          tags: [],
          category: DOCUMENT_CATEGORIES[DOCUMENT_TYPE_CATEGORY_MAP[request.type]],
          period: request.data?.period,
          periodDate: request.data?.periodDate || new Date().toISOString().split('T')[0]
        },
        attachments: [],
        ...request.data // 문서 타입별 특정 데이터
      };

      // Supabase에 저장
      const { data, error } = await supabase
        .from('documents')
        .insert({
          template_id: request.templateId || null,
          user_id: userId,
          title: request.title,
          content: content,
          file_path: null,
          status: request.isDraft ? 'draft' : 'pending'
        })
        .select()
        .single();

      if (error) {
        throw new AppError({
          message: '문서 생성 중 데이터베이스 오류가 발생했습니다.',
          code: ApiErrorCode.DATABASE_ERROR,
          context: { metadata: { error: error.message } }
        });
      }

      return this.mapToBaseDocument(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        message: '문서 생성 중 오류가 발생했습니다.',
        code: ApiErrorCode.INTERNAL_ERROR,
        context: { metadata: { originalError: error } }
      });
    }
  }

  /**
   * 문서 수정
   */
  async updateDocument(request: UpdateDocumentRequest, userId: string): Promise<BaseDocument> {
    try {
      // 기존 문서 조회
      const existingDocument = await this.getDocumentById(request.id);

      // 업데이트할 content 생성
      const updatedContent = {
        ...existingDocument,
        ...request.updates,
        metadata: {
          ...existingDocument.metadata,
          ...request.updates.metadata,
          version: (existingDocument.metadata?.version || 1) + 1
        },
        updatedAt: new Date().toISOString()
      };

      // Supabase 업데이트
      const { data, error } = await supabase
        .from('documents')
        .update({
          title: request.updates.title || existingDocument.title,
          content: updatedContent,
          status: request.updates.status || existingDocument.status
        })
        .eq('id', request.id)
        .select()
        .single();

      if (error) {
        throw new AppError({
          message: '문서 수정 중 데이터베이스 오류가 발생했습니다.',
          code: ApiErrorCode.DATABASE_ERROR,
          context: { metadata: { error: error.message, documentId: request.id } }
        });
      }

      // 변경 이력 저장
      await this.saveDocumentHistory(request.id, existingDocument, updatedContent, userId, request.reason);

      return this.mapToBaseDocument(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        message: '문서 수정 중 오류가 발생했습니다.',
        code: ApiErrorCode.INTERNAL_ERROR,
        context: { metadata: { documentId: request.id, originalError: error } }
      });
    }
  }

  /**
   * 문서 삭제
   */
  async deleteDocument(id: string): Promise<void> {
    try {
      // 문서 존재 확인
      await this.getDocumentById(id);

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        throw new AppError({
          message: '문서 삭제 중 데이터베이스 오류가 발생했습니다.',
          code: ApiErrorCode.DATABASE_ERROR,
          context: { metadata: { error: error.message, documentId: id } }
        });
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        message: '문서 삭제 중 오류가 발생했습니다.',
        code: ApiErrorCode.INTERNAL_ERROR,
        context: { metadata: { documentId: id, originalError: error } }
      });
    }
  }

  /**
   * 문서 통계 조회
   */
  async getDocumentStatistics(): Promise<DocumentStatistics> {
    try {
      // 전체 문서 수
      const { count: totalCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      // 모든 문서 데이터를 가져와서 클라이언트에서 집계
      const { data: allDocs } = await supabase
        .from('documents')
        .select('content, status');

      // AI 생성 문서 통계
      const { count: aiGeneratedCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('content->metadata->isAiGenerated', true);

      // 최근 활동 통계 (지난 7일)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: recentCreated } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      const { count: recentUpdated } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', weekAgo.toISOString());

      const { count: recentApproved } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('updated_at', weekAgo.toISOString());

      // 클라이언트 사이드에서 통계 계산
      const typeStats = this.calculateTypeStats(allDocs || []);
      const statusStats = this.calculateStatusStats(allDocs || []);
      const departmentStats = this.calculateDepartmentStats(allDocs || []);

      // 통계 객체 생성
      const statistics: DocumentStatistics = {
        totalCount: totalCount || 0,
        byType: typeStats,
        byStatus: statusStats,
        byDepartment: departmentStats,
        byPeriod: {
          daily: 0, // TODO: 구현 필요
          weekly: 0,
          monthly: 0,
          quarterly: 0,
          annual: 0
        },
        aiGenerated: {
          count: aiGeneratedCount || 0,
          percentage: totalCount ? ((aiGeneratedCount || 0) / totalCount) * 100 : 0
        },
        recentActivity: {
          created: recentCreated || 0,
          updated: recentUpdated || 0,
          approved: recentApproved || 0
        }
      };

      return statistics;
    } catch (error) {
      throw new AppError({
        message: '문서 통계 조회 중 오류가 발생했습니다.',
        code: ApiErrorCode.INTERNAL_ERROR,
        context: { metadata: { originalError: error } }
      });
    }
  }

  /**
   * 문서 검색 (고급)
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
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .contains('content->metadata->tags', tags)
        .limit(limit);

      if (error) {
        throw new AppError({
          message: '태그별 문서 조회 중 데이터베이스 오류가 발생했습니다.',
          code: ApiErrorCode.DATABASE_ERROR,
          context: { metadata: { error: error.message, tags } }
        });
      }

      return (data || []).map(this.mapToBaseDocument);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        message: '태그별 문서 조회 중 오류가 발생했습니다.',
        code: ApiErrorCode.INTERNAL_ERROR,
        context: { metadata: { tags, originalError: error } }
      });
    }
  }

  /**
   * 부서별 문서 조회
   */
  async getDocumentsByDepartment(department: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('content->department', department)
        .limit(limit);

      if (error) {
        throw new AppError({
          message: '부서별 문서 조회 중 데이터베이스 오류가 발생했습니다.',
          code: ApiErrorCode.DATABASE_ERROR,
          context: { metadata: { error: error.message, department } }
        });
      }

      return (data || []).map(this.mapToBaseDocument);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        message: '부서별 문서 조회 중 오류가 발생했습니다.',
        code: ApiErrorCode.INTERNAL_ERROR,
        context: { metadata: { department, originalError: error } }
      });
    }
  }

  // Private 헬퍼 메서드들

  /**
   * Supabase 문서 row를 BaseDocument로 변환
   */
  private mapToBaseDocument(doc: DocumentRow): BaseDocument {
    return {
      id: doc.id,
      type: doc.content?.type || 'daily-checklist' as any,
      title: doc.title,
      status: doc.status as any,
      author: doc.content?.author || 'Unknown',
      authorId: doc.user_id,
      department: doc.content?.department || '안전관리팀',
      departmentId: doc.content?.departmentId,
      metadata: {
        version: doc.content?.metadata?.version || 1,
        isAiGenerated: doc.content?.metadata?.isAiGenerated || false,
        templateId: doc.template_id || undefined,
        parentDocumentId: doc.content?.metadata?.parentDocumentId,
        tags: doc.content?.metadata?.tags || [],
        category: doc.content?.metadata?.category,
        period: doc.content?.metadata?.period,
        periodDate: doc.content?.metadata?.periodDate
      },
      review: doc.content?.review,
      approval: doc.content?.approval,
      attachments: doc.content?.attachments || [],
      permissions: doc.content?.permissions,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
      signature: doc.content?.signature,
      signedAt: doc.content?.signedAt
    };
  }

  /**
   * 정렬 컬럼 매핑
   */
  private getSortColumn(sortBy: string): string {
    switch (sortBy) {
      case 'createdAt': return 'created_at';
      case 'updatedAt': return 'updated_at';
      case 'title': return 'title';
      case 'status': return 'status';
      default: return 'created_at';
    }
  }

  /**
   * 문서 생성 요청 유효성 검증
   */
  private validateCreateRequest(request: CreateDocumentRequest): void {
    const errors: Array<{ field: string; message: string; value?: any }> = [];

    if (!request.type) {
      errors.push({ field: 'type', message: '문서 타입은 필수입니다.' });
    } else {
      // 문서 타입 유효성 검사를 위한 값들 배열
      const validTypes = [
        'daily-checklist', 'experiment-log', 'weekly-checklist', 'chemical-usage-report',
        'safety-inspection', 'education-log', 'risk-assessment', 'quarterly-report',
        'annual-safety-plan', 'ai-safety-assessment', 'ai-requirements-spec',
        'ai-implementation-plan', 'ai-test-scenarios', 'ai-training-program',
        'ai-compliance-checklist', 'ai-ethical-framework', 'ai-incident-response',
        'ai-monitoring-dashboard', 'ai-risk-mitigation', 'jha', 'chemical-inventory',
        'emergency-plan', 'incident-report', 'msds-summary'
      ];
      
      if (!validTypes.includes(request.type as string)) {
        errors.push({ 
          field: 'type', 
          message: '유효하지 않은 문서 타입입니다.',
          value: request.type 
        });
      }
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

  /**
   * 문서 변경 이력 저장
   */
  private async saveDocumentHistory(
    documentId: string, 
    oldData: any, 
    newData: any, 
    changedBy: string, 
    reason?: string
  ): Promise<void> {
    try {
      const changes = this.calculateChanges(oldData, newData);
      
      const { error } = await supabase
        .from('document_history')
        .insert({
          document_id: documentId,
          version: newData.metadata?.version || 1,
          changes: changes,
          changed_by: changedBy
        });

      if (error) {
        console.error('Failed to save document history:', error);
        // 이력 저장 실패는 메인 로직을 방해하지 않음
      }
    } catch (error) {
      console.error('Error saving document history:', error);
      // 이력 저장 실패는 메인 로직을 방해하지 않음
    }
  }

  /**
   * 변경사항 계산
   */
  private calculateChanges(oldData: any, newData: any): any[] {
    const changes: any[] = [];
    
    // 간단한 변경사항 감지 로직
    if (oldData.title !== newData.title) {
      changes.push({
        field: 'title',
        oldValue: oldData.title,
        newValue: newData.title
      });
    }

    if (oldData.status !== newData.status) {
      changes.push({
        field: 'status',
        oldValue: oldData.status,
        newValue: newData.status
      });
    }

    // TODO: 더 세밀한 변경사항 감지 로직 추가

    return changes;
  }

  /**
   * 타입별 통계 계산
   */
  private calculateTypeStats(docs: any[]): Record<string, number> {
    const result: Record<string, number> = {};
    
    docs.forEach(doc => {
      const type = doc.content?.type;
      if (type) {
        result[type] = (result[type] || 0) + 1;
      }
    });

    return result;
  }

  /**
   * 상태별 통계 계산
   */
  private calculateStatusStats(docs: any[]): Record<string, number> {
    const result: Record<string, number> = {};
    
    docs.forEach(doc => {
      const status = doc.status;
      if (status) {
        result[status] = (result[status] || 0) + 1;
      }
    });

    return result;
  }

  /**
   * 부서별 통계 계산
   */
  private calculateDepartmentStats(docs: any[]): Record<string, number> {
    const result: Record<string, number> = {};
    
    docs.forEach(doc => {
      const department = doc.content?.department;
      if (department) {
        result[department] = (result[department] || 0) + 1;
      }
    });

    return result;
  }
}

// 싱글톤 인스턴스 내보내기
export const documentService = new DocumentService();