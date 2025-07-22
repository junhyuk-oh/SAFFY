"use client"

import { useState, useMemo } from "react"
import { Breadcrumb } from "@/components/ui/display"
import { DocumentSearch, DocumentList } from "@/components/documents/shared"
import { useDocuments } from "@/hooks/queries"
import { LoadingSpinner } from "@/components/common"
import { ErrorDisplay } from "@/components/ui/feedback"
import Link from "next/link"

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

  // React Query를 사용하여 문서 데이터 가져오기
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useDocuments({
    type: filters.type !== "all" ? filters.type : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    search: searchQuery || undefined,
    limit: 100
  })

  const documents = data?.documents || []

  // 상태별 문서 수 계산
  const statusCounts = useMemo(() => {
    const counts = {
      all: documents.length,
      draft: 0,
      pending: 0,
      completed: 0
    }
    
    documents.forEach(doc => {
      if (doc.status === 'draft') counts.draft++
      else if (doc.status === 'pending') counts.pending++
      else if (doc.status === 'completed') counts.completed++
    })
    
    return counts
  }, [documents])

  // 선택된 상태에 따른 필터링
  const filteredDocuments = useMemo(() => {
    if (selectedStatus === null || selectedStatus === 'all') {
      return documents
    }
    return documents.filter(doc => doc.status === selectedStatus)
  }, [documents, selectedStatus])

  // 문서 유형별 그룹화
  const documentsByType = useMemo(() => {
    return documentTypes.reduce((acc, type) => {
      acc[type] = filteredDocuments.filter(doc => doc.type === type)
      return acc
    }, {} as Record<string, typeof documents>)
  }, [filteredDocuments])

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status === selectedStatus ? null : status)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorDisplay 
          message="문서를 불러오는 중 오류가 발생했습니다." 
          onRetry={() => refetch()} 
        />
      </div>
    )
  }

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
        <h1 className="text-2xl font-bold text-text-primary">문서 관리</h1>
        <p className="text-text-secondary mt-1">안전 문서를 검색하고 관리할 수 있습니다</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => handleStatusClick('all')}
          className={`p-4 rounded-notion-lg border transition-all ${
            selectedStatus === 'all' || selectedStatus === null
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background-secondary hover:border-border-hover'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">전체 문서</span>
            <span className="text-2xl font-bold text-text-primary">{statusCounts.all}</span>
          </div>
        </button>
        
        <button
          onClick={() => handleStatusClick('draft')}
          className={`p-4 rounded-notion-lg border transition-all ${
            selectedStatus === 'draft'
              ? 'border-gray-500 bg-gray-500/5'
              : 'border-border bg-background-secondary hover:border-border-hover'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">작성 중</span>
            <span className="text-2xl font-bold text-gray-600">{statusCounts.draft}</span>
          </div>
        </button>
        
        <button
          onClick={() => handleStatusClick('pending')}
          className={`p-4 rounded-notion-lg border transition-all ${
            selectedStatus === 'pending'
              ? 'border-warning-border bg-warning-bg'
              : 'border-border bg-background-secondary hover:border-border-hover'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">검토 중</span>
            <span className="text-2xl font-bold text-warning-text">{statusCounts.pending}</span>
          </div>
        </button>
        
        <button
          onClick={() => handleStatusClick('completed')}
          className={`p-4 rounded-notion-lg border transition-all ${
            selectedStatus === 'completed'
              ? 'border-success-border bg-success-bg'
              : 'border-border bg-background-secondary hover:border-border-hover'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">승인 완료</span>
            <span className="text-2xl font-bold text-success-text">{statusCounts.completed}</span>
          </div>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6">
        <DocumentSearch 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Document List Section */}
      <div className="bg-background-secondary rounded-notion-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">문서 목록</h2>
          <Link
            href="/documents/create"
            className="px-4 py-2 bg-primary text-white rounded-notion-sm hover:bg-primary-hover transition-colors text-sm"
          >
            새 문서 만들기
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" label="문서를 불러오는 중..." />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">
              {searchQuery 
                ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` 
                : '등록된 문서가 없습니다.'}
            </p>
            {!searchQuery && (
              <Link
                href="/documents/create"
                className="inline-block mt-4 text-primary hover:text-primary-hover"
              >
                첫 번째 문서 만들기 →
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="space-y-8">
            {Object.entries(documentsByType).map(([type, docs]) => {
              if (docs.length === 0) return null
              
              return (
                <div key={type}>
                  <h3 className="text-sm font-medium text-text-secondary mb-3">{type}</h3>
                  <DocumentList documents={docs} viewMode="grid" />
                </div>
              )
            })}
          </div>
        ) : (
          // List View
          <DocumentList documents={filteredDocuments} viewMode="list" />
        )}
      </div>
    </>
  )
}