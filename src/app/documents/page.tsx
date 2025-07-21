"use client"

import { useState, useMemo } from "react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { DocumentSearch, DocumentList } from "@/components/documents/shared"
import Link from "next/link"

// Mock data - 실제로는 API에서 가져올 데이터
const mockDocuments = [
  {
    id: "1",
    title: "2024년 4분기 화학물질 위험성평가",
    type: "위험성평가",
    status: "completed" as const,
    createdDate: "2024.12.15",
    author: "김연구원",
    description: "유기용매 및 산/염기 시약 사용에 대한 종합적인 위험성 평가",
    lastModified: "2024.12.16",
    tags: ["화학물질", "4분기", "완료"],
    icon: "⚠️"
  },
  {
    id: "2",
    title: "나노소재 실험 JHA",
    type: "작업위험성평가",
    status: "pending" as const,
    createdDate: "2024.12.14",
    author: "박교수",
    description: "나노입자 합성 실험의 단계별 위험성 분석",
    lastModified: "2024.12.14",
    tags: ["나노소재", "JHA", "검토중"],
    icon: "🔍"
  },
  {
    id: "3",
    title: "월간 안전교육 일지 - 12월",
    type: "교육일지",
    status: "overdue" as const,
    createdDate: "2024.12.01",
    author: "이안전관리자",
    description: "12월 정기 안전교육 진행 현황 및 참석자 명단",
    tags: ["교육", "12월", "기한초과"],
    icon: "🎓"
  },
  {
    id: "4",
    title: "레이저 장비 실험계획서",
    type: "실험계획서",
    status: "draft" as const,
    createdDate: "2024.12.13",
    author: "최연구원",
    description: "고출력 레이저를 이용한 재료 가공 실험 계획",
    tags: ["레이저", "실험계획", "초안"],
    icon: "📝"
  },
  {
    id: "5",
    title: "정기 점검일지 - 흄후드",
    type: "점검일지",
    status: "completed" as const,
    createdDate: "2024.12.10",
    author: "정기술원",
    description: "실험실 흄후드 정기 점검 및 성능 테스트 결과",
    lastModified: "2024.12.11",
    tags: ["점검", "흄후드", "완료"],
    icon: "✅"
  },
  {
    id: "6",
    title: "화학물질 유출 사고보고서",
    type: "사고보고서",
    status: "completed" as const,
    createdDate: "2024.12.05",
    author: "김안전팀장",
    description: "소량 화학물질 유출 사고 대응 및 개선사항",
    lastModified: "2024.12.07",
    tags: ["사고", "화학물질", "완료"],
    icon: "🚨"
  }
]

const documentTypes = [
  "위험성평가",
  "작업위험성평가",
  "실험계획서",
  "교육일지",
  "점검일지",
  "사고보고서"
]

interface FilterOptions {
  type: string
  status: string
  dateRange: string
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    type: "all",
    status: "all",
    dateRange: "all"
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // 필터링된 문서 목록
  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      // 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          doc.title.toLowerCase().includes(query) ||
          doc.author.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.tags?.some(tag => tag.toLowerCase().includes(query))
        
        if (!matchesSearch) return false
      }

      // 타입 필터
      if (filters.type !== "all" && doc.type !== filters.type) {
        return false
      }

      // 상태 필터 (선택된 상태 카드 우선)
      if (selectedStatus && doc.status !== selectedStatus) {
        return false
      }
      if (!selectedStatus && filters.status !== "all" && doc.status !== filters.status) {
        return false
      }

      // 날짜 필터
      if (filters.dateRange !== "all") {
        const docDate = new Date(doc.createdDate.replace(/\./g, "-"))
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (filters.dateRange) {
          case "today":
            if (daysDiff > 0) return false
            break
          case "week":
            if (daysDiff > 7) return false
            break
          case "month":
            if (daysDiff > 30) return false
            break
          case "quarter":
            if (daysDiff > 90) return false
            break
        }
      }

      return true
    })
  }, [searchQuery, filters, selectedStatus])

  // 상태별 문서 개수
  const statusCounts = useMemo(() => {
    return {
      total: mockDocuments.length,
      draft: mockDocuments.filter(doc => doc.status === "draft").length,
      pending: mockDocuments.filter(doc => doc.status === "pending").length,
      completed: mockDocuments.filter(doc => doc.status === "completed").length,
      overdue: mockDocuments.filter(doc => doc.status === "overdue").length
    }
  }, [])

  // 상태 카드 클릭 핸들러
  const handleStatusCardClick = (status: string | null) => {
    setSelectedStatus(status)
    // 필터도 초기화
    setFilters(prev => ({ ...prev, status: "all" }))
  }

  // 자주 사용하는 템플릿
  const favoriteTemplates = [
    {
      id: "template-1",
      icon: "⚠️",
      title: "위험성평가",
      description: "화학물질 및 실험 위험성 평가"
    },
    {
      id: "template-2",
      icon: "📝",
      title: "실험계획서",
      description: "연구 실험 계획 및 안전 대책"
    },
    {
      id: "template-3",
      icon: "🎓",
      title: "교육일지",
      description: "안전교육 진행 및 참석 기록"
    },
    {
      id: "template-4",
      icon: "✅",
      title: "점검일지",
      description: "정기 안전 점검 기록"
    }
  ]

  return (
    <>
            {/* Page Header */}
            <div className="mb-6">
              <Breadcrumb 
                items={[
                  { label: '홈', href: '/' },
                  { label: '문서 관리' }
                ]}
                className="mb-4"
              />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">문서 관리</h1>
                  <p className="text-text-secondary mt-1">모든 안전 관련 문서를 한곳에서 관리하세요</p>
                </div>
                <Link
                  href="/documents/create"
                  className="px-6 py-2.5 bg-primary text-text-inverse rounded-notion-sm hover:bg-primary-hover transition-colors font-medium flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>새 문서 만들기</span>
                </Link>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div 
                  onClick={() => handleStatusCardClick(null)}
                  className={`bg-background-secondary rounded-notion-md p-4 border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                    selectedStatus === null ? 'border-primary shadow-md' : 'border-border'
                  }`}
                >
                  <div className="text-2xl font-bold text-text-primary">{statusCounts.total}</div>
                  <div className="text-sm text-text-secondary">전체 문서</div>
                </div>
                <div 
                  onClick={() => handleStatusCardClick('draft')}
                  className={`bg-background-secondary rounded-notion-md p-4 border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                    selectedStatus === 'draft' ? 'border-primary shadow-md' : 'border-border'
                  }`}
                >
                  <div className="text-2xl font-bold text-text-primary">{statusCounts.draft}</div>
                  <div className="text-sm text-text-secondary">초안</div>
                </div>
                <div 
                  onClick={() => handleStatusCardClick('pending')}
                  className={`bg-warning-bg rounded-notion-md p-4 border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                    selectedStatus === 'pending' ? 'border-primary shadow-md' : 'border-warning'
                  }`}
                >
                  <div className="text-2xl font-bold text-warning-text">{statusCounts.pending}</div>
                  <div className="text-sm text-warning-text">검토 중</div>
                </div>
                <div 
                  onClick={() => handleStatusCardClick('completed')}
                  className={`bg-success-bg rounded-notion-md p-4 border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                    selectedStatus === 'completed' ? 'border-primary shadow-md' : 'border-success'
                  }`}
                >
                  <div className="text-2xl font-bold text-success-text">{statusCounts.completed}</div>
                  <div className="text-sm text-success-text">완료</div>
                </div>
                <div 
                  onClick={() => handleStatusCardClick('overdue')}
                  className={`bg-error-bg rounded-notion-md p-4 border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                    selectedStatus === 'overdue' ? 'border-primary shadow-md' : 'border-error'
                  }`}
                >
                  <div className="text-2xl font-bold text-error-text">{statusCounts.overdue}</div>
                  <div className="text-sm text-error-text">기한 초과</div>
                </div>
              </div>

              {/* Favorite Templates */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-3">자주 사용하는 템플릿</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {favoriteTemplates.map((template) => (
                    <Link
                      key={template.id}
                      href={`/documents/create?template=${template.title}`}
                      className="bg-background-secondary rounded-notion-md p-4 border border-border hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                            {template.title}
                          </h3>
                          <p className="text-xs text-text-secondary mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <DocumentSearch
              onSearch={setSearchQuery}
              onFilterChange={setFilters}
              documentTypes={documentTypes}
            />

            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-text-secondary">
                  {filteredDocuments.length}개의 문서를 찾았습니다
                </div>
                {selectedStatus && (
                  <button
                    onClick={() => handleStatusCardClick(null)}
                    className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                  >
                    <span>필터 해제</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-notion-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-text-inverse"
                      : "bg-background border border-border hover:bg-background-hover"
                  }`}
                  title="그리드 보기"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-notion-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-text-inverse"
                      : "bg-background border border-border hover:bg-background-hover"
                  }`}
                  title="리스트 보기"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Document List */}
            <DocumentList
              documents={filteredDocuments}
              viewMode={viewMode}
              emptyMessage={
                searchQuery || filters.type !== "all" || filters.status !== "all" || filters.dateRange !== "all"
                  ? "검색 조건에 맞는 문서가 없습니다."
                  : "아직 생성된 문서가 없습니다."
              }
            />
    </>
  )
}