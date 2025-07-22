/**
 * 시설관리 관련 React Query 훅
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Equipment, Alert, MaintenanceRequest, WorkPermit } from '@/lib/types/facility';
import { invalidateQueries } from '@/lib/react-query/client';
import { useNotificationStore } from '@/stores/useNotificationStore';

// 장비 목록 조회
export function useEquipment(params?: {
  status?: string;
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['equipment', params],
    queryFn: () => api.get<{ equipment: Equipment[] }>('/facility/equipment', { params }),
    staleTime: 5 * 60 * 1000,
  });
}

// 단일 장비 조회
export function useEquipmentDetail(id: string) {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => api.get<Equipment>(`/facility/equipment/${id}`),
    enabled: !!id,
  });
}

// 장비 상태 업데이트
export function useUpdateEquipmentStatus() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Equipment['status'] }) =>
      api.patch(`/facility/equipment/${id}`, { status }),
    onSuccess: () => {
      invalidateQueries.equipment();
      showNotification({
        type: 'success',
        title: '장비 상태 업데이트',
        message: '장비 상태가 성공적으로 업데이트되었습니다.',
      });
    },
  });
}

// 알림 목록 조회
export function useAlerts(params?: {
  priority?: string;
  status?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => api.get<{ alerts: Alert[] }>('/facility/alerts', { params }),
    staleTime: 1 * 60 * 1000, // 1분 (알림은 더 자주 갱신)
    refetchInterval: 30 * 1000, // 30초마다 자동 갱신
  });
}

// 알림 처리
export function useHandleAlert() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'acknowledge' | 'resolve' | 'dismiss' }) =>
      api.post(`/facility/alerts/${id}/handle`, { action }),
    onSuccess: (_, variables) => {
      invalidateQueries.alerts();
      
      const actionText = {
        acknowledge: '확인',
        resolve: '해결',
        dismiss: '무시',
      };
      
      showNotification({
        type: 'success',
        title: '알림 처리 완료',
        message: `알림이 ${actionText[variables.action]} 처리되었습니다.`,
      });
    },
  });
}

// 정비 요청 목록 조회
export function useMaintenance(params?: {
  status?: string;
  priority?: string;
  equipmentId?: string;
}) {
  return useQuery({
    queryKey: ['maintenance', params],
    queryFn: () => api.get<{ maintenance: MaintenanceRequest[] }>('/facility/maintenance', { params }),
    staleTime: 5 * 60 * 1000,
  });
}

// 정비 요청 생성
export function useCreateMaintenanceRequest() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: Partial<MaintenanceRequest>) =>
      api.post<MaintenanceRequest>('/facility/maintenance', data),
    onSuccess: () => {
      invalidateQueries.maintenance();
      invalidateQueries.equipment(); // 장비 상태도 업데이트
      
      showNotification({
        type: 'success',
        title: '정비 요청 생성',
        message: '정비 요청이 성공적으로 생성되었습니다.',
      });
    },
  });
}

// 정비 요청 상태 업데이트
export function useUpdateMaintenanceStatus() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MaintenanceRequest['status'] }) =>
      api.patch(`/facility/maintenance/${id}`, { status }),
    onSuccess: () => {
      invalidateQueries.maintenance();
      
      showNotification({
        type: 'success',
        title: '정비 상태 업데이트',
        message: '정비 요청 상태가 업데이트되었습니다.',
      });
    },
  });
}

// 작업 허가서 목록 조회
export function usePermits(params?: {
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['permits', params],
    queryFn: () => api.get<{ permits: WorkPermit[] }>('/facility/permits', { params }),
    staleTime: 5 * 60 * 1000,
  });
}

// 작업 허가서 생성
export function useCreatePermit() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: Partial<WorkPermit>) =>
      api.post<WorkPermit>('/facility/permits', data),
    onSuccess: () => {
      invalidateQueries.permits();
      
      showNotification({
        type: 'success',
        title: '작업 허가서 생성',
        message: '작업 허가서가 성공적으로 생성되었습니다.',
      });
    },
  });
}

// 작업 허가서 승인
export function useApprovePermit() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, approved, reason }: { id: string; approved: boolean; reason?: string }) =>
      api.post(`/facility/permits/${id}/approve`, { approved, reason }),
    onSuccess: (_, variables) => {
      invalidateQueries.permits();
      
      showNotification({
        type: 'success',
        title: variables.approved ? '작업 허가서 승인' : '작업 허가서 반려',
        message: variables.approved 
          ? '작업 허가서가 승인되었습니다.' 
          : '작업 허가서가 반려되었습니다.',
      });
    },
  });
}