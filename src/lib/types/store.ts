/**
 * 스토어 관련 타입 정의
 * Zustand 상태 관리를 위한 타입들
 */

/**
 * 사용자 정보
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

/**
 * 사용자 역할
 */
export type UserRole = 
  | 'admin'
  | 'manager'
  | 'safety_manager'
  | 'technical_manager'
  | 'facility_manager'
  | 'plant_manager'
  | 'operator'
  | 'viewer';

/**
 * 사용자 환경설정
 */
export interface UserPreferences {
  theme: ThemeMode;
  language: 'ko' | 'en';
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

/**
 * 테마 모드
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * 알림 설정
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sound: boolean;
  desktop: boolean;
  alertTypes: {
    safety: boolean;
    equipment: boolean;
    maintenance: boolean;
    permit: boolean;
  };
}

/**
 * 대시보드 설정
 */
export interface DashboardPreferences {
  defaultView: 'grid' | 'list';
  refreshInterval: number; // seconds
  widgetLayout?: WidgetLayout[];
}

/**
 * 위젯 레이아웃
 */
export interface WidgetLayout {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config?: Record<string, any>;
}

/**
 * 알림 메시지
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // milliseconds
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: string;
}

/**
 * 앱 상태
 */
export interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  version: string;
  environment: 'development' | 'staging' | 'production';
}

/**
 * 인증 상태
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
}

/**
 * 알림 상태
 */
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isVisible: boolean;
}

/**
 * UI 상태
 */
export interface UIState {
  sidebarOpen: boolean;
  modalStack: ModalConfig[];
  activeModal: string | null;
  theme: ThemeMode;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}

/**
 * 모달 설정
 */
export interface ModalConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  options?: {
    closeOnEscape?: boolean;
    closeOnBackdrop?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  };
}

/**
 * 스토어 액션 타입
 */
export interface StoreActions {
  reset: () => void;
  hydrate?: (state: any) => void;
}

/**
 * 미들웨어 설정
 */
export interface StoreMiddleware {
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

/**
 * 스토어 설정
 */
export interface StoreConfig {
  persist?: {
    enabled: boolean;
    whitelist?: string[];
    blacklist?: string[];
    version?: number;
  };
  middleware?: StoreMiddleware[];
  devtools?: boolean;
}