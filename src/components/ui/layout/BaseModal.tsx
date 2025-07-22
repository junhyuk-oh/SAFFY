"use client"

import { ReactNode, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  showAiInfo?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full mx-4"
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showAiInfo = false,
  size = "lg",
  className,
  closeOnOverlayClick = true,
  closeOnEsc = true
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose, closeOnEsc])

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 백그라운드 오버레이 */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50 animate-fadeIn"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />

        {/* 모달 정렬을 위한 더미 요소 */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* 모달 컨테이너 */}
        <div
          ref={modalRef}
          className={cn(
            "inline-block align-bottom bg-background rounded-notion-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full animate-scaleIn",
            sizeClasses[size],
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* 헤더 */}
          <div className="bg-background-secondary px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="modal-title" className="text-lg font-semibold text-text-primary">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-notion-sm hover:bg-background-hover"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI 정보 박스 */}
          {showAiInfo && (
            <div className="bg-primary-light border-b border-primary px-6 py-3">
              <div className="flex items-center gap-2 text-sm text-primary">
                <span className="text-lg">🤖</span>
                <span className="font-medium">AI가 문서 내용을 자동으로 생성합니다</span>
              </div>
            </div>
          )}

          {/* 본문 */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* 푸터 */}
          {footer && (
            <div className="bg-background-secondary px-6 py-4 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // 포털을 사용하여 body에 직접 렌더링
  return createPortal(modalContent, document.body)
}

// 헤더, 바디, 푸터 컴포넌트 export (필요시 사용)
export interface ModalHeaderProps {
  children: ReactNode
  className?: string
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div className={cn("px-6 py-4 border-b border-border", className)}>
      {children}
    </div>
  )
}

export interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  )
}

export interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-border bg-background-secondary", className)}>
      {children}
    </div>
  )
}

// 확인 모달 컴포넌트
export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  type = "info"
}: ConfirmModalProps) {
  const icons = {
    danger: "⚠️",
    warning: "⚡",
    info: "ℹ️"
  }

  const buttonClasses = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
    info: "bg-primary hover:bg-primary-hover text-text-inverse"
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-background rounded-notion-sm border border-border hover:bg-background-hover transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-notion-sm transition-colors font-medium",
              buttonClasses[type]
            )}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="flex gap-4">
        <span className="text-3xl">{icons[type]}</span>
        <p className="text-text-secondary">{message}</p>
      </div>
    </BaseModal>
  )
}