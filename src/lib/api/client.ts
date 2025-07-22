/**
 * API 클라이언트 설정
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

// API 베이스 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 인증 토큰 추가
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 요청 로깅 (개발 환경)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 로깅 (개발 환경)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const { response } = error;
    const showNotification = useNotificationStore.getState().addNotification;
    
    if (response) {
      switch (response.status) {
        case 401:
          // 인증 오류 - 로그아웃 처리
          useAuthStore.getState().logout();
          showNotification({
            type: 'error',
            title: '인증 오류',
            message: '다시 로그인해주세요.',
          });
          break;
          
        case 403:
          showNotification({
            type: 'error',
            title: '권한 없음',
            message: '해당 작업을 수행할 권한이 없습니다.',
          });
          break;
          
        case 404:
          showNotification({
            type: 'error',
            title: '찾을 수 없음',
            message: '요청한 리소스를 찾을 수 없습니다.',
          });
          break;
          
        case 500:
          showNotification({
            type: 'error',
            title: '서버 오류',
            message: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          });
          break;
          
        default:
          showNotification({
            type: 'error',
            title: '오류 발생',
            message: response.data?.message || '알 수 없는 오류가 발생했습니다.',
          });
      }
    } else if (error.request) {
      // 네트워크 오류
      showNotification({
        type: 'error',
        title: '네트워크 오류',
        message: '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.',
      });
    }
    
    return Promise.reject(error);
  }
);

// API 메서드 래퍼
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config).then(res => res.data),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config).then(res => res.data),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config).then(res => res.data),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config).then(res => res.data),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config).then(res => res.data),
};

// 파일 업로드용 클라이언트
export const uploadFile = async (url: string, file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};