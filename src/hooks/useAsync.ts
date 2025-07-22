/**
 * 비동기 작업을 위한 제네릭 훅
 * 로딩, 에러, 데이터 상태를 타입 안전하게 관리
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AsyncState } from '@/lib/types/utility-types';

export interface UseAsyncOptions {
  immediate?: boolean; // 컴포넌트 마운트 시 즉시 실행
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * 비동기 함수 실행과 상태 관리를 위한 훅
 */
export function useAsync<T = any>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
): AsyncState<T> & {
  execute: () => Promise<T | null>;
  reset: () => void;
} {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    idle: true,
    loading: false,
    success: false,
    error: null,
    data: null,
  });

  // 언마운트 상태 추적
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState({
      idle: false,
      loading: true,
      success: false,
      error: null,
      data: null,
    });

    try {
      const result = await asyncFunction();
      
      if (isMountedRef.current) {
        setState({
          idle: false,
          loading: false,
          success: true,
          error: null,
          data: result,
        });
        
        onSuccess?.(result);
      }
      
      return result;
    } catch (error) {
      if (isMountedRef.current) {
        const errorObject = error instanceof Error ? error : new Error(String(error));
        
        setState({
          idle: false,
          loading: false,
          success: false,
          error: errorObject,
          data: null,
        });
        
        onError?.(errorObject);
      }
      
      return null;
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      idle: true,
      loading: false,
      success: false,
      error: null,
      data: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]); // execute를 의존성에서 제외하여 무한 루프 방지

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * 여러 비동기 작업을 병렬로 실행하는 훅
 */
export function useAsyncParallel<T extends Record<string, () => Promise<any>>>(
  asyncFunctions: T,
  options: UseAsyncOptions = {}
): {
  states: { [K in keyof T]: AsyncState<Awaited<ReturnType<T[K]>>> };
  execute: () => Promise<{ [K in keyof T]: Awaited<ReturnType<T[K]>> | null }>;
  reset: () => void;
  isLoading: boolean;
  hasError: boolean;
  allSuccess: boolean;
} {
  type ResultType = { [K in keyof T]: Awaited<ReturnType<T[K]>> | null };
  type StatesType = { [K in keyof T]: AsyncState<Awaited<ReturnType<T[K]>>> };

  const [states, setStates] = useState<StatesType>(() => {
    const initialStates = {} as StatesType;
    
    for (const key in asyncFunctions) {
      initialStates[key] = {
        idle: true,
        loading: false,
        success: false,
        error: null,
        data: null,
      };
    }
    
    return initialStates;
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    // 모든 상태를 loading으로 설정
    setStates((prevStates) => {
      const newStates = {} as StatesType;
      
      for (const key in asyncFunctions) {
        newStates[key] = {
          idle: false,
          loading: true,
          success: false,
          error: null,
          data: null,
        };
      }
      
      return newStates;
    });

    const results = {} as ResultType;
    const promises = Object.entries(asyncFunctions).map(async ([key, fn]) => {
      try {
        const result = await fn();
        results[key as keyof T] = result;
        
        if (isMountedRef.current) {
          setStates((prev) => ({
            ...prev,
            [key]: {
              idle: false,
              loading: false,
              success: true,
              error: null,
              data: result,
            },
          }));
        }
        
        return result;
      } catch (error) {
        const errorObject = error instanceof Error ? error : new Error(String(error));
        results[key as keyof T] = null;
        
        if (isMountedRef.current) {
          setStates((prev) => ({
            ...prev,
            [key]: {
              idle: false,
              loading: false,
              success: false,
              error: errorObject,
              data: null,
            },
          }));
        }
        
        throw error;
      }
    });

    try {
      await Promise.all(promises);
      options.onSuccess?.(results);
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error(String(error));
      options.onError?.(errorObject);
    }

    return results;
  }, [asyncFunctions, options]);

  const reset = useCallback(() => {
    setStates(() => {
      const resetStates = {} as StatesType;
      
      for (const key in asyncFunctions) {
        resetStates[key] = {
          idle: true,
          loading: false,
          success: false,
          error: null,
          data: null,
        };
      }
      
      return resetStates;
    });
  }, [asyncFunctions]);

  const isLoading = Object.values(states).some((state) => state.loading);
  const hasError = Object.values(states).some((state) => state.error !== null);
  const allSuccess = Object.values(states).every((state) => state.success);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [options.immediate]);

  return {
    states,
    execute,
    reset,
    isLoading,
    hasError,
    allSuccess,
  };
}

/**
 * 디바운스된 비동기 작업을 위한 훅
 */
export function useDebouncedAsync<T = any>(
  asyncFunction: () => Promise<T>,
  delay: number = 500,
  options: UseAsyncOptions = {}
): AsyncState<T> & {
  execute: () => void;
  reset: () => void;
  cancel: () => void;
} {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const asyncState = useAsync(asyncFunction, { ...options, immediate: false });

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const execute = useCallback(() => {
    cancel();
    
    timeoutRef.current = setTimeout(() => {
      asyncState.execute();
    }, delay);
  }, [asyncState.execute, cancel, delay]);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return {
    ...asyncState,
    execute,
    cancel,
  };
}