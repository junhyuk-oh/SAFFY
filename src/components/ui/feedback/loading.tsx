import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-border border-t-primary", sizeClasses[size], className)} />
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-background-hover rounded-notion-sm", className)} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-background-secondary rounded-notion-md p-5 border border-border">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="h-8 w-8 rounded-notion-sm" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-background-secondary rounded-notion-md border border-border overflow-hidden">
      <div className="border-b border-border p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border p-4 last:border-b-0">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = "데이터를 불러오는 중입니다..." }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-text-secondary">{message}</p>
    </div>
  )
}