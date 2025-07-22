/**
 * 일정 관리 관련 React Query 훅
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { ScheduleEvent } from '@/lib/types/schedule';
import { invalidateQueries } from '@/lib/react-query/client';
import { useNotificationStore } from '@/stores/useNotificationStore';

// 일정 목록 조회
export function useScheduleEvents(params?: {
  startDate?: string;
  endDate?: string;
  type?: string;
  userId?: string;
}) {
  return useQuery({
    queryKey: ['schedule', params],
    queryFn: () => api.get<{ events: ScheduleEvent[] }>('/schedule', { params }),
    staleTime: 5 * 60 * 1000,
  });
}

// 단일 일정 조회
export function useScheduleEvent(id: string) {
  return useQuery({
    queryKey: ['schedule', id],
    queryFn: () => api.get<ScheduleEvent>(`/schedule/${id}`),
    enabled: !!id,
  });
}

// 일정 생성
export function useCreateScheduleEvent() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: Partial<ScheduleEvent>) =>
      api.post<ScheduleEvent>('/schedule', data),
    onSuccess: () => {
      invalidateQueries.schedule();
      showNotification({
        type: 'success',
        title: '일정 생성',
        message: '일정이 성공적으로 생성되었습니다.',
      });
    },
    onError: (error: any) => {
      showNotification({
        type: 'error',
        title: '일정 생성 실패',
        message: error.response?.data?.message || '일정 생성 중 오류가 발생했습니다.',
      });
    },
  });
}

// 일정 수정
export function useUpdateScheduleEvent() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ScheduleEvent> }) =>
      api.patch<ScheduleEvent>(`/schedule/${id}`, data),
    onSuccess: () => {
      invalidateQueries.schedule();
      showNotification({
        type: 'success',
        title: '일정 수정',
        message: '일정이 성공적으로 수정되었습니다.',
      });
    },
  });
}

// 일정 삭제
export function useDeleteScheduleEvent() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (id: string) => api.delete(`/schedule/${id}`),
    onSuccess: () => {
      invalidateQueries.schedule();
      showNotification({
        type: 'success',
        title: '일정 삭제',
        message: '일정이 성공적으로 삭제되었습니다.',
      });
    },
  });
}

// 반복 일정 생성
export function useCreateRecurringEvent() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: {
      event: Partial<ScheduleEvent>;
      recurrence: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
        interval: number;
        endDate: string;
        daysOfWeek?: number[];
      };
    }) => api.post('/schedule/recurring', data),
    onSuccess: () => {
      invalidateQueries.schedule();
      showNotification({
        type: 'success',
        title: '반복 일정 생성',
        message: '반복 일정이 성공적으로 생성되었습니다.',
      });
    },
  });
}

// 일정 알림 설정
export function useSetEventReminder() {
  const showNotification = useNotificationStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ eventId, reminder }: { 
      eventId: string; 
      reminder: { minutes: number; enabled: boolean } 
    }) => api.post(`/schedule/${eventId}/reminder`, reminder),
    onSuccess: () => {
      invalidateQueries.schedule();
      showNotification({
        type: 'info',
        title: '알림 설정',
        message: '일정 알림이 설정되었습니다.',
      });
    },
  });
}

// 오늘의 일정 조회 (대시보드용)
export function useTodaySchedule() {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDate = startDate;

  return useQuery({
    queryKey: ['schedule', 'today'],
    queryFn: () => api.get<{ events: ScheduleEvent[] }>('/schedule', {
      params: { startDate, endDate },
    }),
    staleTime: 1 * 60 * 1000, // 1분
    refetchInterval: 5 * 60 * 1000, // 5분마다 갱신
  });
}

// 월간 일정 요약 조회
export function useMonthlyScheduleSummary(year: number, month: number) {
  return useQuery({
    queryKey: ['schedule', 'summary', year, month],
    queryFn: () => api.get(`/schedule/summary/${year}/${month}`),
    staleTime: 10 * 60 * 1000,
  });
}