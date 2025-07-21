"use client"

import React, { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalTemplateProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  showAiInfo?: boolean
  className?: string
}

export function ModalTemplate({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showAiInfo = false,
  className = ''
}: ModalTemplateProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 백그라운드 오버레이 */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

        {/* 모달 컨테이너 */}
        <div className="inline-block w-full align-bottom bg-background rounded-notion-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl">
          {/* 헤더 */}
          <div className="bg-background-secondary px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
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
                className="text-text-tertiary hover:text-text-primary transition-colors"
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
          <div className={`px-6 py-4 ${className}`}>
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
}

export default ModalTemplate