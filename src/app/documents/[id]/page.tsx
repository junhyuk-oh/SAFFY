"use client"

import { useState } from "react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BackButton } from "@/components/ui/back-button"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Mock data - 실제로는 API에서 가져올 데이터
const mockDocument = {
  id: "1",
  title: "2024년 4분기 화학물질 위험성평가",
  type: "위험성평가",
  status: "completed" as const,
  createdDate: "2024.12.15",
  author: "김연구원",
  department: "안전관리팀",
  description: "유기용매 및 산/염기 시약 사용에 대한 종합적인 위험성 평가",
  lastModified: "2024.12.16",
  tags: ["화학물질", "4분기", "완료"],
  content: {
    summary: "본 평가서는 2024년 4분기 동안 사용된 화학물질에 대한 종합적인 위험성 평가를 포함합니다.",
    sections: [
      {
        title: "1. 평가 대상 화학물질",
        content: "• 아세톤 (Acetone)\n• 메탄올 (Methanol)\n• 염산 (HCl)\n• 수산화나트륨 (NaOH)"
      },
      {
        title: "2. 위험성 분석",
        content: "각 화학물질의 물리·화학적 특성, 건강 위험성, 환경 영향을 분석하였습니다."
      },
      {
        title: "3. 안전 대책",
        content: "• 개인보호구 착용 의무화\n• 환기 시스템 강화\n• 비상 세척 시설 설치\n• 정기 안전교육 실시"
      }
    ],
    attachments: [
      { name: "MSDS_모음.pdf", size: "2.3MB" },
      { name: "위험성평가_체크리스트.xlsx", size: "156KB" }
    ]
  },
  history: [
    { date: "2024.12.16 14:30", user: "김연구원", action: "문서 수정" },
    { date: "2024.12.15 16:45", user: "박팀장", action: "검토 완료" },
    { date: "2024.12.15 10:20", user: "김연구원", action: "초안 생성" }
  ]
}

const statusConfig = {
  draft: {
    label: "초안",
    color: "text-text-secondary",
    bg: "bg-background-hover"
  },
  pending: {
    label: "검토 중",
    color: "text-warning-text",
    bg: "bg-warning-bg"
  },
  completed: {
    label: "완료",
    color: "text-success-text",
    bg: "bg-success-bg"
  },
  overdue: {
    label: "기한 초과",
    color: "text-error-text",
    bg: "bg-error-bg"
  }
}

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"content" | "history" | "comments">("content")
  const [isEditing, setIsEditing] = useState(false)

  const statusInfo = statusConfig[mockDocument.status]

  const handleEdit = () => {
    setIsEditing(true)
    // 편집 모드로 전환
  }

  const handleDelete = () => {
    if (confirm("정말로 이 문서를 삭제하시겠습니까?")) {
      // API 호출로 문서 삭제
      router.push("/documents")
    }
  }

  const handleDownload = () => {
    // 문서 다운로드 로직
    alert("문서를 다운로드합니다.")
  }

  return (
    <>
            {/* Breadcrumb */}
            <Breadcrumb 
              items={[
                { label: '홈', href: '/' },
                { label: '문서 관리', href: '/documents' },
                { label: mockDocument.title }
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
                      {mockDocument.title}
                    </h1>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-4">{mockDocument.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">작성자:</span>
                      <span className="text-text-primary">{mockDocument.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">부서:</span>
                      <span className="text-text-primary">{mockDocument.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">생성일:</span>
                      <span className="text-text-primary">{mockDocument.createdDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary">수정일:</span>
                      <span className="text-text-primary">{mockDocument.lastModified}</span>
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
                {mockDocument.tags.map((tag, index) => (
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
                {/* Summary */}
                <div className="bg-primary-light rounded-notion-md p-4 border border-primary">
                  <h3 className="font-semibold text-primary mb-2">요약</h3>
                  <p className="text-sm text-text-primary">{mockDocument.content.summary}</p>
                </div>

                {/* Sections */}
                {mockDocument.content.sections.map((section, index) => (
                  <div key={index} className="bg-background-secondary rounded-notion-md p-5 border border-border">
                    <h3 className="font-semibold text-text-primary mb-3">{section.title}</h3>
                    <div className="text-text-secondary whitespace-pre-line">{section.content}</div>
                  </div>
                ))}

                {/* Attachments */}
                <div className="bg-background-secondary rounded-notion-md p-5 border border-border">
                  <h3 className="font-semibold text-text-primary mb-3">📎 첨부파일</h3>
                  <div className="space-y-2">
                    {mockDocument.content.attachments.map((file, index) => (
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
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-background-secondary rounded-notion-md p-5 border border-border">
                <div className="space-y-4">
                  {mockDocument.history.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-text-primary">{item.user}</span>
                          <span className="text-sm text-text-tertiary">{item.date}</span>
                        </div>
                        <p className="text-sm text-text-secondary">{item.action}</p>
                      </div>
                    </div>
                  ))}
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