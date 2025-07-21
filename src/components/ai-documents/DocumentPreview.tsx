"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

export interface DocumentPreviewProps {
  title: string
  content: string
  documentType: string
  className?: string
  onSave?: (content: string) => Promise<void>
  onDownload?: () => void
  onEdit?: () => void
  isEditable?: boolean
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  title,
  content,
  documentType,
  className,
  onSave,
  onDownload,
  onEdit,
  isEditable = true
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { showToast } = useToast()

  const handleSave = async () => {
    if (!onSave) return

    setIsSaving(true)
    try {
      await onSave(content)
      showToast({
        type: "success",
        title: "저장 완료",
        message: "문서가 성공적으로 저장되었습니다."
      })
    } catch (error) {
      showToast({
        type: "error",
        title: "저장 실패",
        message: "문서 저장 중 오류가 발생했습니다."
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!onDownload) return

    setIsDownloading(true)
    try {
      await onDownload()
      showToast({
        type: "info",
        title: "다운로드 시작",
        message: "문서 다운로드가 시작되었습니다."
      })
    } catch (error) {
      showToast({
        type: "error",
        title: "다운로드 실패",
        message: "문서 다운로드 중 오류가 발생했습니다."
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* 헤더 영역 */}
      <div className="flex-shrink-0 border-b border-border bg-background-secondary px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            <p className="text-sm text-text-secondary mt-1">{documentType}</p>
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-3">
            {isEditable && onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:shadow-notion-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                수정
              </Button>
            )}
            
            {onDownload && (
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                disabled={isDownloading}
                className="transition-all duration-200 hover:shadow-notion-sm"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                다운로드
              </Button>
            )}
            
            {onSave && (
              <Button
                onClick={handleSave}
                size="sm"
                disabled={isSaving}
                className="transition-all duration-200 hover:shadow-notion-sm"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2"
                    />
                  </svg>
                )}
                저장
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 문서 내용 영역 */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="prose prose-sm max-w-none">
            {/* 문서 내용 렌더링 */}
            <div 
              className="document-content"
              dangerouslySetInnerHTML={{ __html: formatContent(content) }}
            />
          </div>
        </div>
      </div>

      {/* 하단 정보 영역 */}
      <div className="flex-shrink-0 border-t border-border bg-background-secondary px-6 py-3">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <div className="flex items-center space-x-4">
            <span>AI로 생성됨</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('ko-KR')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>생성된 내용을 검토 후 사용하세요</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 콘텐츠 포맷팅 함수
function formatContent(content: string): string {
  // 기본적인 마크다운 스타일 변환
  let formatted = content
    // 헤더
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-text-primary">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-8 mb-4 text-text-primary">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-10 mb-5 text-text-primary">$1</h1>')
    // 강조
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // 리스트
    .replace(/^- (.*?)$/gm, '<li class="ml-4 mb-2">$1</li>')
    .replace(/^(\d+)\. (.*?)$/gm, '<li class="ml-4 mb-2" value="$1">$2</li>')
    // 단락
    .replace(/\n\n/g, '</p><p class="mb-4 text-text-primary leading-relaxed">')
    
  // 리스트 래핑
  formatted = formatted
    .replace(/(<li.*?<\/li>\n?)+/g, (match) => {
      if (match.includes('value=')) {
        return `<ol class="list-decimal mb-4">${match}</ol>`
      }
      return `<ul class="list-disc mb-4">${match}</ul>`
    })
  
  // 최종 래핑
  return `<p class="mb-4 text-text-primary leading-relaxed">${formatted}</p>`
}

export default DocumentPreview