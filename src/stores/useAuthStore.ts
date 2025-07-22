/**
 * 인증 상태 관리 스토어
 * 사용자 인증 및 세션 관리
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '@/lib/types/store';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string, refreshToken?: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: undefined,
      refreshToken: undefined,
      expiresAt: undefined,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: API 호출로 교체
          const response = await mockLogin(email, password);
          
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            expiresAt: response.expiresAt,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Login failed'),
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: undefined,
          refreshToken: undefined,
          expiresAt: undefined,
          error: null,
        });
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: API 호출로 교체
          const response = await mockRegister(email, password, name);
          
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            expiresAt: response.expiresAt,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Registration failed'),
            isLoading: false,
          });
          throw error;
        }
      },

      refreshSession: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        set({ isLoading: true });

        try {
          // TODO: API 호출로 교체
          const response = await mockRefreshToken(refreshToken);
          
          set({
            token: response.token,
            expiresAt: response.expiresAt,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Session refresh failed'),
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        
        if (!currentUser) {
          return;
        }

        set({
          user: {
            ...currentUser,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setToken: (token: string, refreshToken?: string) => {
        set({
          token,
          refreshToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24시간
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    }
  )
);

// Mock functions (임시)
async function mockLogin(email: string, password: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'admin@example.com' && password === 'password') {
    return {
      user: {
        id: 'user-001',
        email,
        name: '관리자',
        role: 'admin' as const,
        department: 'IT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
  
  throw new Error('Invalid credentials');
}

async function mockRegister(email: string, password: string, name: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    user: {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'viewer' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

async function mockRefreshToken(refreshToken: string) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (refreshToken === 'mock-refresh-token') {
    return {
      token: 'new-mock-jwt-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
  
  throw new Error('Invalid refresh token');
}