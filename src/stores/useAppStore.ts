/**
 * 앱 전역 상태 관리 스토어
 * UI 상태, 테마, 모달 등 관리
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, UIState, ThemeMode, ModalConfig } from '@/lib/types/store';

interface AppStore extends AppState, UIState {
  // App actions
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  
  // UI actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => void;
  
  // Modal actions
  openModal: (config: ModalConfig) => void;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial app state
      isInitialized: false,
      isLoading: false,
      error: null,
      version: '1.0.0',
      environment: process.env.NODE_ENV as 'development' | 'staging' | 'production',

      // Initial UI state
      sidebarOpen: true,
      modalStack: [],
      activeModal: null,
      theme: 'system',
      breakpoint: 'desktop',

      // App actions
      initialize: async () => {
        set({ isLoading: true });

        try {
          // 앱 초기화 로직
          // - 사용자 설정 로드
          // - 테마 적용
          // - 브레이크포인트 감지
          
          // 브레이크포인트 감지
          const updateBreakpoint = () => {
            const width = window.innerWidth;
            if (width < 768) {
              get().setBreakpoint('mobile');
            } else if (width < 1024) {
              get().setBreakpoint('tablet');
            } else {
              get().setBreakpoint('desktop');
            }
          };

          updateBreakpoint();
          window.addEventListener('resize', updateBreakpoint);

          // 테마 적용
          applyTheme(get().theme);

          set({ isInitialized: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('App initialization failed'),
            isLoading: false,
          });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      // UI actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      
      setBreakpoint: (breakpoint) => {
        set({ breakpoint });
        
        // 모바일에서는 사이드바 자동 닫기
        if (breakpoint === 'mobile') {
          set({ sidebarOpen: false });
        }
      },

      // Modal actions
      openModal: (config) => {
        set((state) => ({
          modalStack: [...state.modalStack, config],
          activeModal: config.id,
        }));
      },

      closeModal: (id) => {
        if (!id) {
          // 활성 모달 닫기
          set((state) => {
            const newStack = [...state.modalStack];
            newStack.pop();
            return {
              modalStack: newStack,
              activeModal: newStack.length > 0 ? newStack[newStack.length - 1].id : null,
            };
          });
        } else {
          // 특정 모달 닫기
          set((state) => ({
            modalStack: state.modalStack.filter((m) => m.id !== id),
            activeModal: state.activeModal === id 
              ? state.modalStack[state.modalStack.length - 2]?.id || null
              : state.activeModal,
          }));
        }
      },

      closeAllModals: () => {
        set({
          modalStack: [],
          activeModal: null,
        });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// 테마 적용 헬퍼
function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
  
  // 시스템 테마 변경 감지
  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      root.classList.toggle('dark', e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handler);
  }
}