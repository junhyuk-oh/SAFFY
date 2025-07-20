"use client"

import { useState } from "react"

interface DocumentSearchProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: FilterOptions) => void
  documentTypes: string[]
}

interface FilterOptions {
  type: string
  status: string
  dateRange: string
}

export function DocumentSearch({ onSearch, onFilterChange, documentTypes }: DocumentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    type: "all",
    status: "all",
    dateRange: "all"
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const statuses = [
    { value: "all", label: "모든 상태" },
    { value: "draft", label: "초안" },
    { value: "pending", label: "검토 중" },
    { value: "completed", label: "완료" },
    { value: "overdue", label: "기한 초과" }
  ]

  const dateRanges = [
    { value: "all", label: "전체 기간" },
    { value: "today", label: "오늘" },
    { value: "week", label: "최근 7일" },
    { value: "month", label: "최근 30일" },
    { value: "quarter", label: "최근 3개월" }
  ]

  return (
    <div className="bg-background-secondary rounded-notion-md p-4 border border-border mb-6">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="문서 제목, 작성자, 태그로 검색..."
              className="w-full px-4 py-2.5 pl-10 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              🔍
            </span>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-text-inverse rounded-notion-sm hover:bg-primary-hover transition-colors font-medium"
          >
            검색
          </button>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2.5 bg-background rounded-notion-sm border border-border hover:bg-background-hover transition-colors flex items-center gap-2"
          >
            <span>🎯</span>
            <span>필터</span>
            {(filters.type !== "all" || filters.status !== "all" || filters.dateRange !== "all") && (
              <span className="ml-1 w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>
        </div>
      </form>

      {isFilterOpen && (
        <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              문서 타입
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors text-sm"
            >
              <option value="all">모든 타입</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              상태
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors text-sm"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              기간
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors text-sm"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}