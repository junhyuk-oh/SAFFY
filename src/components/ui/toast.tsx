"use client"

import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps extends Toast {
  onClose: (id: string) => void
}

const toastConfig = {
  success: {
    icon: "✅",
    className: "bg-success-bg border-success text-success-text"
  },
  error: {
    icon: "❌",
    className: "bg-error-bg border-error text-error-text"
  },
  warning: {
    icon: "⚠️",
    className: "bg-warning-bg border-warning text-warning-text"
  },
  info: {
    icon: "ℹ️",
    className: "bg-primary-light border-primary text-primary"
  }
}

function ToastItem({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const config = toastConfig[type]

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 200)
  }, [id, onClose])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, handleClose])

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-notion-md border shadow-notion-md transition-all duration-200",
        config.className,
        isExiting ? "animate-fadeOut translate-x-full" : "animate-slideUp"
      )}
    >
      <span className="text-xl flex-shrink-0">{config.icon}</span>
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
      </div>
      <button
        onClick={handleClose}
        className="text-xl opacity-60 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Toast 상태 관리를 위한 커스텀 훅
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}

// 간단한 toast 함수 (주로 서버 컴포넌트에서 사용)
export const toast = {
  success: (title: string, message?: string) => {
    console.log('[Toast Success]', title, message)
  },
  error: (title: string, message?: string) => {
    console.error('[Toast Error]', title, message)
  },
  warning: (title: string, message?: string) => {
    console.warn('[Toast Warning]', title, message)
  },
  info: (title: string, message?: string) => {
    console.info('[Toast Info]', title, message)
  }
}