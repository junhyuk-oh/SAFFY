/**
 * 스토어 통합 export
 * 모든 Zustand 스토어를 하나의 파일에서 관리
 */

export { useAuthStore } from './useAuthStore';
export { useNotificationStore, notify } from './useNotificationStore';
export { useAppStore } from './useAppStore';

// 스토어 초기화 함수
export async function initializeStores() {
  const { initialize } = useAppStore.getState();
  await initialize();
}

// 모든 스토어 리셋 함수
export function resetAllStores() {
  useAuthStore.getState().logout();
  useNotificationStore.getState().clearNotifications();
  useAppStore.setState({
    isInitialized: false,
    isLoading: false,
    error: null,
    modalStack: [],
    activeModal: null,
  });
}