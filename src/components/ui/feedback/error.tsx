"use client"

import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={cn("text-error text-sm", className)}>
      {message}
    </div>
  )
}

interface ErrorPageProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorPage({ 
  title = "오류가 발생했습니다", 
  message = "잠시 후 다시 시도해 주세요.",
  onRetry,
  className 
}: ErrorPageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] text-center", className)}>
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          다시 시도
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  icon?: string
  title: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  icon = "📁", 
  title, 
  message, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[300px] text-center", className)}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {message && (
        <p className="text-text-secondary mb-6 max-w-md">{message}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// ErrorDisplay alias for ErrorPage
export const ErrorDisplay = ErrorPage