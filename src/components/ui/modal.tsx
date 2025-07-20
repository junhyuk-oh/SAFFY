"use client"

import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className={cn(
        "relative bg-background-secondary rounded-notion-lg shadow-notion-lg max-w-lg w-full mx-4 animate-scaleIn",
        className
      )}>
        {children}
      </div>
    </div>,
    document.body
  )
}

interface ModalHeaderProps {
  title: string
  onClose?: () => void
  className?: string
}

export function ModalHeader({ title, onClose, className }: ModalHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between p-6 border-b border-border", className)}>
      <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-notion-sm flex items-center justify-center hover:bg-background-hover transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  )
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3 p-6 border-t border-border", className)}>
      {children}
    </div>
  )
}

interface ConfirmModalProps {
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

  const buttonVariants = {
    danger: "destructive",
    warning: "default",
    info: "default"
  } as const

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        <div className="flex gap-4">
          <span className="text-3xl">{icons[type]}</span>
          <p className="text-text-secondary">{message}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          {cancelText}
        </Button>
        <Button 
          variant={buttonVariants[type]} 
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}