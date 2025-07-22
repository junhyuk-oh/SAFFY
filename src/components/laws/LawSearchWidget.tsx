"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X, FileText, ExternalLink } from "lucide-react"

interface LawSearchResult {
  id: string
  lawId: string
  lawName: string
  lawCategory: string
  articleNumber: string
  articleTitle: string
  articleContent: string
  summary: string
}

interface LawSearchWidgetProps {
  className?: string
}

export function LawSearchWidget({ className = "" }: LawSearchWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<LawSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // API를 통한 법률 검색
  const searchLawsAPI = async (query: string): Promise<LawSearchResult[]> => {
    if (!query.trim()) return []

    try {
      const response = await fetch(`/api/laws/search?q=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error('검색 요청이 실패했습니다.')
      }

      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error('법률 검색 오류:', error)
      return []
    }
  }

  // 검색 실행
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    try {
      const searchResults = await searchLawsAPI(query)
      setResults(searchResults)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('검색 실행 중 오류:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // 검색어 변경 처리
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex])
      }
    }
  }

  // 결과 클릭 처리
  const handleResultClick = (result: LawSearchResult) => {
    // 법률별 상세 페이지로 이동
    let targetPath = ''
    
    switch (result.lawId) {
      case 'serious-accident':
        targetPath = `/serious-accident#${result.id}`
        break
      case 'industrial-safety':
        targetPath = `/industrial-safety#${result.id}`
        break
      case 'chemical-management':
        targetPath = `/chemical-management#${result.id}`
        break
      case 'lab-safety':
        targetPath = `/lab-safety#${result.id}`
        break
      default:
        // 기본적으로 법령 준수 섹션으로 이동
        targetPath = `/serious-accident#${result.id}`
        break
    }
    
    // 페이지 이동
    window.location.href = targetPath
    setIsOpen(false)
    setSearchQuery("")
  }

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 검색 입력창 */}
      <div className={`relative transition-all duration-200 ${
        isOpen ? 'ring-2 ring-primary' : 'ring-1 ring-border hover:ring-border-focus'
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 transition-colors ${
            isOpen ? 'text-primary' : 'text-text-tertiary'
          }`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="법률 검색... (예: 화기작업, 위험성평가)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-background border-0 rounded-notion-sm
                   placeholder-text-tertiary text-text-primary
                   focus:outline-none focus:ring-0"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("")
              setResults([])
              inputRef.current?.focus()
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-notion-md shadow-lg z-50 max-h-96 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-text-secondary">검색 중...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              <div className="p-2 text-xs text-text-tertiary bg-background-secondary border-b border-border">
                {results.length}개 결과 찾음
              </div>
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`p-4 cursor-pointer border-b border-border last:border-b-0 transition-colors ${
                    index === selectedIndex 
                      ? 'bg-primary-light' 
                      : 'hover:bg-background-hover'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          result.lawCategory === '중처법' ? 'bg-red-100 text-red-800' :
                          result.lawCategory === '산안법' ? 'bg-blue-100 text-blue-800' :
                          result.lawCategory === '화관법' ? 'bg-green-100 text-green-800' :
                          result.lawCategory === '연안법' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {result.lawCategory}
                        </span>
                        <span className="text-xs text-text-tertiary">{result.articleNumber}</span>
                      </div>
                      <h4 className="text-sm font-medium text-text-primary mb-1 truncate">
                        {result.articleTitle}
                      </h4>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {result.summary}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {result.lawName}
                      </p>
                    </div>
                    <div className="flex items-center ml-2">
                      <FileText className="h-4 w-4 text-text-tertiary" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-background-secondary border-t border-border">
                <button className="w-full text-center text-sm text-primary hover:text-primary-dark font-medium flex items-center justify-center gap-1">
                  <span>모든 결과 보기</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : searchQuery.trim() && !isLoading ? (
            <div className="p-4 text-center text-text-secondary">
              <div className="text-sm">'{searchQuery}'에 대한 검색 결과가 없습니다.</div>
              <div className="text-xs text-text-tertiary mt-1">
                다른 키워드로 검색해보세요. (예: 화기작업, 위험성평가, 화학물질)
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}