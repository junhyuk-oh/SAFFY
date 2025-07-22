/**
 * 로딩 스피너 컴포넌트
 * 다양한 크기와 스타일의 로딩 인디케이터
 */

"use client"

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export function LoadingSpinner({ 
  size = 'md', 
  className,
  label,
  fullScreen = false
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-border" />
      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {label && (
            <p className="text-sm text-text-secondary animate-pulse">{label}</p>
          )}
        </div>
      </div>
    );
  }

  if (label) {
    return (
      <div className="flex flex-col items-center gap-2">
        {spinner}
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
    );
  }

  return spinner;
}

// 페이지 로딩 컴포넌트
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" label="로딩 중..." />
    </div>
  );
}

// 인라인 로딩 컴포넌트
export function InlineLoading({ text = '로딩 중' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span className="text-sm text-text-secondary">{text}</span>
    </div>
  );
}