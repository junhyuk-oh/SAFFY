/**
 * 교육 관리 관련 React Query 훅
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { 
  EducationCategory, 
  EducationRecord, 
  EducationRequirement,
  EducationMaterial 
} from '@/lib/types/education';
import { invalidateQueries } from '@/lib/react-query/client';
import { useNotificationStore } from '@/stores/useNotificationStore';

// 교육 카테고리 목록 조회
export function useEducationCategories() {
  return useQuery({
    queryKey: ['education', 'categories'],
    queryFn: () => api.get<{ categories: EducationCategory[] }>('/education/categories'),
    staleTime: 10 * 60 * 1000, // 10분
  });
}

// 교육 카테고리 생성
export function useCreateCategory() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: Partial<EducationCategory>) =>
      api.post<EducationCategory>('/education/categories', data),
    onSuccess: () => {
      invalidateQueries.education();
      showNotification({
        type: 'success',
        title: '카테고리 생성',
        message: '교육 카테고리가 생성되었습니다.',
      });
    },
  });
}

// 교육 기록 조회
export function useEducationRecords(params?: {
  userId?: string;
  categoryId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['education', 'records', params],
    queryFn: () => api.get<{ records: EducationRecord[] }>('/education/records', { params }),
    staleTime: 5 * 60 * 1000,
  });
}

// 교육 기록 생성
export function useCreateEducationRecord() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: Partial<EducationRecord>) =>
      api.post<EducationRecord>('/education/records', data),
    onSuccess: () => {
      invalidateQueries.education();
      showNotification({
        type: 'success',
        title: '교육 기록 등록',
        message: '교육 기록이 성공적으로 등록되었습니다.',
      });
    },
  });
}

// 교육 이수증 업로드
export function useUploadCertificate() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ recordId, file }: { recordId: string; file: File }) => {
      const formData = new FormData();
      formData.append('certificate', file);
      return api.post(`/education/records/${recordId}/certificate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      invalidateQueries.education();
      showNotification({
        type: 'success',
        title: '이수증 업로드',
        message: '이수증이 성공적으로 업로드되었습니다.',
      });
    },
  });
}

// 교육 요구사항 조회
export function useEducationRequirements(departmentId?: string) {
  return useQuery({
    queryKey: ['education', 'requirements', departmentId],
    queryFn: () => api.get<{ requirements: EducationRequirement[] }>('/education/requirements', {
      params: { departmentId },
    }),
    staleTime: 10 * 60 * 1000,
  });
}

// 교육 요구사항 업데이트
export function useUpdateRequirement() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EducationRequirement> }) =>
      api.patch(`/education/requirements/${id}`, data),
    onSuccess: () => {
      invalidateQueries.education();
      showNotification({
        type: 'success',
        title: '요구사항 업데이트',
        message: '교육 요구사항이 업데이트되었습니다.',
      });
    },
  });
}

// 교육 자료 조회
export function useEducationMaterials(categoryId?: string) {
  return useQuery({
    queryKey: ['education', 'materials', categoryId],
    queryFn: () => api.get<{ materials: EducationMaterial[] }>('/education/materials', {
      params: { categoryId },
    }),
    staleTime: 10 * 60 * 1000,
  });
}

// 교육 자료 업로드
export function useUploadMaterial() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ categoryId, file, metadata }: { 
      categoryId: string; 
      file: File; 
      metadata: { title: string; description?: string } 
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('categoryId', categoryId);
      formData.append('title', metadata.title);
      if (metadata.description) {
        formData.append('description', metadata.description);
      }
      
      return api.post('/education/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      invalidateQueries.education();
      showNotification({
        type: 'success',
        title: '자료 업로드',
        message: '교육 자료가 성공적으로 업로드되었습니다.',
      });
    },
  });
}

// 교육 통계 조회
export function useEducationStats(params?: {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
}) {
  return useQuery({
    queryKey: ['education', 'stats', params],
    queryFn: () => api.get('/education/stats', { params }),
    staleTime: 5 * 60 * 1000,
  });
}