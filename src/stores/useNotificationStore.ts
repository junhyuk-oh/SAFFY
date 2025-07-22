/**
 * 알림 상태 관리 스토어
 * 앱 전체 알림 메시지 관리
 */

import { create } from 'zustand';
import { Notification, NotificationState } from '@/lib/types/store';

interface NotificationStore extends NotificationState {
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setVisibility: (visible: boolean) => void;
  
  // Helper actions
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
}

const DEFAULT_DURATION = 5000; // 5초

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isVisible: false,

  // Actions
  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // 자동 제거 설정
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || DEFAULT_DURATION);
    }

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  markAsRead: (id) => {
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set({ unreadCount: 0 });
  },

  setVisibility: (visible) => {
    set({ isVisible: visible });
    
    // 알림창을 열 때 모두 읽음으로 표시
    if (visible) {
      get().markAllAsRead();
    }
  },

  // Helper actions
  success: (title, message, duration) => {
    return get().addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  },

  error: (title, message, duration) => {
    return get().addNotification({
      type: 'error',
      title,
      message,
      duration: duration || 0, // 에러는 기본적으로 자동 제거 안함
    });
  },

  warning: (title, message, duration) => {
    return get().addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  },

  info: (title, message, duration) => {
    return get().addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  },
}));

// 알림 표시를 위한 헬퍼 함수들
export const notify = {
  success: (title: string, message?: string, duration?: number) => 
    useNotificationStore.getState().success(title, message, duration),
    
  error: (title: string, message?: string, duration?: number) => 
    useNotificationStore.getState().error(title, message, duration),
    
  warning: (title: string, message?: string, duration?: number) => 
    useNotificationStore.getState().warning(title, message, duration),
    
  info: (title: string, message?: string, duration?: number) => 
    useNotificationStore.getState().info(title, message, duration),
};