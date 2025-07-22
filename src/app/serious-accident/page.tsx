"use client"

import { useEffect, useState } from "react"
import { getLawInfo, getArticlesByLaw, type LawData, type LawArticle } from "@/lib/laws/lawDatabase"
import { FileText, Scale, AlertTriangle, BookOpen, ExternalLink } from "lucide-react"

export default function SeriousAccidentLawPage() {
  const [lawInfo, setLawInfo] = useState<LawData | null>(null)
  const [articles, setArticles] = useState<LawArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)

  useEffect(() => {
    const info = getLawInfo("serious-accident")
    const lawArticles = getArticlesByLaw("serious-accident")
    
    setLawInfo(info || null)
    setArticles(lawArticles)
    
    // URL 해시가 있으면 해당 조문으로 스크롤
    if (window.location.hash) {
      const articleId = window.location.hash.replace('#', '')
      setSelectedArticle(articleId)
      setTimeout(() => {
        document.getElementById(articleId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])

  if (!lawInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">법률 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-red-100 rounded-notion-lg">
              <Scale className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                  {lawInfo.category}
                </span>
                <span className="text-sm text-red-700">{lawInfo.lawNumber}</span>
              </div>
              <h1 className="text-3xl font-bold text-red-900 mb-3">{lawInfo.lawName}</h1>
              {lawInfo.lawNameEng && (
                <p className="text-lg text-red-700 mb-4">{lawInfo.lawNameEng}</p>
              )}
              <p className="text-red-800 leading-relaxed max-w-4xl">{lawInfo.summary}</p>
              
              <div className="flex items-center gap-6 mt-4 text-sm text-red-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>제정: {lawInfo.enactmentDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>최종개정: {lawInfo.lastAmended}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>소관: {lawInfo.administeredBy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 목차 사이드바 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-background-secondary rounded-notion-lg p-6">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  목차
                </h3>
                <nav className="space-y-2">
                  {articles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => {
                        setSelectedArticle(article.id)
                        document.getElementById(article.id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className={`w-full text-left px-3 py-2 rounded-notion-sm text-sm transition-colors ${
                        selectedArticle === article.id
                          ? 'bg-primary-light text-primary font-medium'
                          : 'text-text-secondary hover:bg-background-hover hover:text-text-primary'
                      }`}
                    >
                      제{article.articleNumber}조 {article.articleTitle}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {articles.map((article) => (
                <div
                  key={article.id}
                  id={article.id}
                  className={`bg-background-secondary rounded-notion-lg p-6 transition-all ${
                    selectedArticle === article.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-red-100 rounded-notion-md">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-text-primary mb-2">
                        제{article.articleNumber}조 {article.articleTitle}
                      </h2>
                      <div className="prose max-w-none">
                        <div className="text-text-primary leading-relaxed whitespace-pre-line">
                          {article.articleContent}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 조문별 추가 정보 */}
                  {article.articleNumber === 4 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-notion-md border-l-4 border-blue-400">
                      <h4 className="font-medium text-blue-900 mb-2">💡 실무 포인트</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• 안전보건관리체계 구축은 조직 규모에 관계없이 필수</li>
                        <li>• 재해 발생 시 즉시 재발방지 대책을 수립해야 함</li>
                        <li>• 관련 법령 위반 시 경영책임자도 처벌 대상</li>
                      </ul>
                    </div>
                  )}

                  {article.articleNumber === 6 && (
                    <div className="mt-6 p-4 bg-red-50 rounded-notion-md border-l-4 border-red-400">
                      <h4 className="font-medium text-red-900 mb-2">⚠️ 처벌 기준</h4>
                      <div className="text-sm text-red-800 space-y-2">
                        <div className="font-medium">중대산업재해 발생 시:</div>
                        <ul className="space-y-1 ml-4">
                          <li>• 1년 이상 유기징역 또는 10억원 이하 벌금</li>
                          <li>• 경영책임자 개인도 처벌 대상</li>
                          <li>• 법인과 개인 모두 처벌 가능 (양벌규정)</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* 관련 문서 링크 */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="font-medium text-text-primary mb-3">관련 기능</h4>
                    <div className="flex flex-wrap gap-2">
                      {article.articleNumber === 4 && (
                        <>
                          <a 
                            href="/risk-assessment" 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            위험성평가 작성
                          </a>
                          <a 
                            href="/documents" 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                          >
                            <BookOpen className="w-3 h-3" />
                            안전관리 문서
                          </a>
                        </>
                      )}
                      {article.articleNumber === 6 && (
                        <a 
                          href="/education" 
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          안전교육 관리
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 안내 */}
            <div className="mt-12 p-6 bg-gray-50 rounded-notion-lg">
              <h3 className="font-semibold text-text-primary mb-3">📋 중대재해처벌법 준수를 위한 체크포인트</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">필수 이행사항</h4>
                  <ul className="text-text-secondary space-y-1">
                    <li>✓ 안전보건관리체계 구축</li>
                    <li>✓ 위험성평가 정기 실시</li>
                    <li>✓ 안전교육 체계 운영</li>
                    <li>✓ 사고 발생 시 즉시 대응체계</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-2">관련 문서 관리</h4>
                  <ul className="text-text-secondary space-y-1">
                    <li>✓ 위험성평가서 작성/보관</li>
                    <li>✓ 안전교육 기록 관리</li>
                    <li>✓ 사고조사 보고서</li>
                    <li>✓ 개선조치 이행 확인</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}