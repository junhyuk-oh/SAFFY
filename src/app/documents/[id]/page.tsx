"use client"

import { useState } from "react"
import { Breadcrumb } from "@/components/ui/display"
import { BackButton } from "@/components/ui/layout"
import { useParams, useRouter } from "next/navigation"
import { useDocument } from "@/lib/hooks/use-documents"
import { BaseDocument, Status } from "@/lib/types"
import { DOCUMENT_STATUS } from "@/lib/constants/status"
import { formatKoreanDate } from "@/lib/utils/date"



export default function DocumentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string
  const [activeTab, setActiveTab] = useState<"content" | "history" | "comments">("content")
  
  const { document, loading, error } = useDocument(documentId)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">문서를 불러오는 중...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-semibold text-text-primary mb-2">문서를 불러올 수 없습니다</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => router.push('/documents')}
            className="px-4 py-2 bg-primary text-text-inverse rounded-notion-sm hover:bg-primary-hover transition-colors"
          >
            문서 목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }
  
  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="text-4xl mb-4 block">📄</span>
          <h2 className="text-xl font-semibold text-text-primary mb-2">문서를 찾을 수 없습니다</h2>
          <p className="text-text-secondary mb-4">요청한 문서가 존재하지 않거나 삭제되었습니다.</p>
          <button
            onClick={() => router.push('/documents')}
            className="px-4 py-2 bg-primary text-text-inverse rounded-notion-sm hover:bg-primary-hover transition-colors"
          >
            문서 목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = DOCUMENT_STATUS[document.status as Status] || {
    label: '알 수 없음',
    color: 'text-text-secondary',
    bg: 'bg-background-hover'
  }

  const handleEdit = () => {
    // 편집 모드로 전환
    router.push(`/documents/${document.id}/edit`)
  }

  const handleDelete = async () => {
    if (confirm("정말로 이 문서를 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/documents/${document.id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          router.push("/documents")
        } else {
          throw new Error('삭제 실패')
        }
      } catch {
        alert("문서 삭제에 실패했습니다.")
      }
    }
  }

  const handleDownload = () => {
    // 문서 다운로드 로직
    alert("문서를 다운로드합니다.")
  }
  
  // 문서 내용 파싱
  interface DocumentContent {
    summary?: string;
    sections?: Array<{ title: string; content: string }>;
    attachments?: Array<{ name: string; size?: number }>;
  }
  const content = (document as BaseDocument & { content?: DocumentContent }).content || null
  const tags: string[] = document.metadata?.tags || []
  const createdDate = formatKoreanDate(document.createdAt)
  const lastModified = document.updatedAt ? formatKoreanDate(document.updatedAt) : createdDate

  return (
    <>
            {/* Breadcrumb */}
            <Breadcrumb 
              items={[
                { label: '홈', href: '/' },
                { label: '문서 관리', href: '/documents' },
                { label: document.title }
              ]}
              className="mb-4"
            />
            <BackButton href="/documents" label="문서 관리로 돌아가기" className="mb-4" />

            {/* Document Header */}
            <div className="bg-background-secondary rounded-notion-lg p-6 border border-border mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {document.title}
                    </h1>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-4">{'문서 설명이 없습니다.'}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">작성자:</span>
                      <span className="text-text-primary">{document.author || '알 수 없음'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">부서:</span>
                      <span className="text-text-primary">{document.department || '미지정'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">생성일:</span>
                      <span className="text-text-primary">{createdDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">수정일:</span>
                      <span className="text-text-primary">{lastModified}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-background rounded-notion-sm border border-border hover:bg-background-hover transition-colors flex items-center gap-2"
                  >
                    <span>✏️</span>
                    <span>편집</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-background rounded-notion-sm border border-border hover:bg-background-hover transition-colors flex items-center gap-2"
                  >
                    <span>📥</span>
                    <span>다운로드</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-background rounded-notion-sm border border-error text-error hover:bg-error-bg transition-colors flex items-center gap-2"
                  >
                    <span>🗑️</span>
                    <span>삭제</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-background text-text-secondary text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === "content"
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  문서 내용
                  {activeTab === "content" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === "history"
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  변경 이력
                  {activeTab === "history" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === "comments"
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  코멘트 (3)
                  {activeTab === "comments" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "content" && (
              <div className="space-y-6">
                {content ? (
                  <>
                    {/* Summary */}
                    {content.summary && (
                      <div className="bg-primary-light rounded-notion-md p-4 border border-primary">
                        <h3 className="font-semibold text-primary mb-2">요약</h3>
                        <p className="text-sm text-text-primary">{content.summary}</p>
                      </div>
                    )}

                    {/* Sections */}
                    {content.sections && content.sections.map((section: { title: string; content: string }, index: number) => (
                      <div key={index} className="bg-background-secondary rounded-notion-md p-5 border border-border">
                        <h3 className="font-semibold text-text-primary mb-3">{section.title}</h3>
                        <div className="text-text-secondary whitespace-pre-line">{section.content}</div>
                      </div>
                    ))}

                    {/* Attachments */}
                    {content.attachments && content.attachments.length > 0 && (
                      <div className="bg-background-secondary rounded-notion-md p-5 border border-border">
                        <h3 className="font-semibold text-text-primary mb-3">📎 첨부파일</h3>
                        <div className="space-y-2">
                          {content.attachments.map((file: { name: string; size?: number }, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-background rounded-notion-sm border border-border hover:border-border-hover transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <span>📄</span>
                                <span className="text-sm text-text-primary">{file.name}</span>
                                <span className="text-xs text-text-tertiary">{file.size}</span>
                              </div>
                              <button className="text-primary hover:text-primary-hover transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-background-secondary rounded-notion-md p-8 border border-border text-center">
                    <span className="text-4xl mb-4 block">📝</span>
                    <h3 className="font-semibold text-text-primary mb-2">문서 내용이 없습니다</h3>
                    <p className="text-text-secondary">이 문서에는 아직 내용이 작성되지 않았습니다.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-background-secondary rounded-notion-md p-5 border border-border">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-text-primary">{document.author || '알 수 없음'}</span>
                        <span className="text-sm text-text-tertiary">{createdDate}</span>
                      </div>
                      <p className="text-sm text-text-secondary">문서 생성</p>
                    </div>
                  </div>
                  {document.updatedAt && document.updatedAt !== document.createdAt && (
                    <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-text-primary">{document.author || '알 수 없음'}</span>
                          <span className="text-sm text-text-tertiary">{lastModified}</span>
                        </div>
                        <p className="text-sm text-text-secondary">문서 수정</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-4">
                <div className="bg-background-secondary rounded-notion-md p-5 border border-border">
                  <div className="text-center py-8">
                    <span className="text-4xl mb-3 block">💬</span>
                    <p className="text-text-secondary">아직 코멘트가 없습니다.</p>
                    <p className="text-sm text-text-tertiary mt-1">첫 번째 코멘트를 남겨보세요!</p>
                  </div>
                </div>
                
                {/* Comment Input */}
                <div className="bg-background-secondary rounded-notion-md p-5 border border-border">
                  <textarea
                    placeholder="코멘트를 입력하세요..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <button className="px-6 py-2.5 bg-primary text-text-inverse rounded-notion-sm hover:bg-primary-hover transition-colors font-medium">
                      코멘트 남기기
                    </button>
                  </div>
                </div>
              </div>
            )}
    </>
  )
}