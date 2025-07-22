/**
 * 에러 바운더리 컴포넌트
 * React 컴포넌트 트리의 에러를 포착하고 폴백 UI를 표시
 */

"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 외부 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // 커스텀 폴백이 제공되면 사용
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-error-text" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              문제가 발생했습니다
            </h2>
            
            <p className="text-text-secondary mb-6">
              예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-text-tertiary hover:text-text-secondary">
                  오류 상세 정보
                </summary>
                <pre className="mt-2 p-3 bg-background-hover rounded-notion-sm text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                페이지 새로고침
              </Button>
              <Button
                onClick={this.handleReset}
              >
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}