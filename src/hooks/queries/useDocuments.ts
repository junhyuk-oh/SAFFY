/**
 * 문서 관련 React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Document, DocumentFormData } from '@/lib/types/document';
import { invalidateQueries } from '@/lib/react-query/client';
import { useNotificationStore } from '@/stores/useNotificationStore';

// 문서 목록 조회
export function useDocuments(params?: {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => api.get<{ documents: Document[]; total: number }>('/documents', { params }),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 단일 문서 조회
export function useDocument(id: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => api.get<Document>(`/documents/${id}`),
    enabled: !!id,
  });
}

// 문서 생성
export function useCreateDocument() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: DocumentFormData) => api.post<Document>('/documents', data),
    onSuccess: (data) => {
      // 문서 목록 캐시 무효화
      invalidateQueries.documents();
      
      showNotification({
        type: 'success',
        title: '문서 생성 완료',
        message: `${data.title} 문서가 성공적으로 생성되었습니다.`,
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: '문서 생성 실패',
        message: error.response?.data?.message || '문서 생성 중 오류가 발생했습니다.',
      });
    },
  });
}

// 문서 수정
export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DocumentFormData> }) =>
      api.patch<Document>(`/documents/${id}`, data),
    onSuccess: (data, variables) => {
      // 특정 문서 캐시 무효화
      invalidateQueries.document(variables.id);
      // 문서 목록 캐시도 무효화
      invalidateQueries.documents();
      
      showNotification({
        type: 'success',
        title: '문서 수정 완료',
        message: '문서가 성공적으로 수정되었습니다.',
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: '문서 수정 실패',
        message: error.response?.data?.message || '문서 수정 중 오류가 발생했습니다.',
      });
    },
  });
}

// 문서 삭제
export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: (_, id) => {
      // 문서 캐시에서 제거
      queryClient.removeQueries({ queryKey: ['document', id] });
      // 문서 목록 캐시 무효화
      invalidateQueries.documents();
      
      showNotification({
        type: 'success',
        title: '문서 삭제 완료',
        message: '문서가 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: '문서 삭제 실패',
        message: error.response?.data?.message || '문서 삭제 중 오류가 발생했습니다.',
      });
    },
  });
}

// 문서 승인
export function useApproveDocument() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      api.post(`/documents/${id}/approve`, { approved }),
    onSuccess: (_, variables) => {
      // 특정 문서 캐시 무효화
      invalidateQueries.document(variables.id);
      // 문서 목록 캐시도 무효화
      invalidateQueries.documents();
      
      showNotification({
        type: 'success',
        title: variables.approved ? '문서 승인 완료' : '문서 반려 완료',
        message: variables.approved ? '문서가 승인되었습니다.' : '문서가 반려되었습니다.',
      });
    },
  });
}

// AI 문서 생성
export function useGenerateAIDocument() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (prompt: string) => api.post<{ content: string }>('/documents/generate', { prompt }),
    onSuccess: () => {
      showNotification({
        type: 'success',
        title: 'AI 문서 생성 완료',
        message: 'AI가 문서를 성공적으로 생성했습니다.',
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: 'AI 문서 생성 실패',
        message: error.response?.data?.message || 'AI 문서 생성 중 오류가 발생했습니다.',
      });
    },
  });
}