/**
 * React Query 클라이언트 설정
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 stale time: 5분
      staleTime: 5 * 60 * 1000,
      // 기본 cache time: 10분
      gcTime: 10 * 60 * 1000,
      // 기본 재시도: 3회
      retry: 3,
      // 재시도 지연
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 포커스 시 재검증
      refetchOnWindowFocus: false,
      // 마운트 시 재검증
      refetchOnMount: true,
    },
    mutations: {
      // mutation 재시도: 실패 시 재시도하지 않음
      retry: 0,
    },
  },
});

// 전역 에러 핸들러
queryClient.setMutationDefaults(['createDocument', 'updateDocument', 'deleteDocument'], {
  onError: (error: any) => {
    console.error('Document mutation error:', error);
    // 여기서 전역 알림 표시 가능
  },
});

// 쿼리 무효화 헬퍼
export const invalidateQueries = {
  all: () => queryClient.invalidateQueries(),
  documents: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  document: (id: string) => queryClient.invalidateQueries({ queryKey: ['document', id] }),
  facilities: () => queryClient.invalidateQueries({ queryKey: ['facilities'] }),
  equipment: () => queryClient.invalidateQueries({ queryKey: ['equipment'] }),
  alerts: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  maintenance: () => queryClient.invalidateQueries({ queryKey: ['maintenance'] }),
  permits: () => queryClient.invalidateQueries({ queryKey: ['permits'] }),
  education: () => queryClient.invalidateQueries({ queryKey: ['education'] }),
  schedule: () => queryClient.invalidateQueries({ queryKey: ['schedule'] }),
};