"use client"

import { useEffect, useState } from "react"
import { getLawInfo, getArticlesByLaw, type LawData, type LawArticle } from "@/lib/laws/lawDatabase"
import { Shield, HardHat, AlertCircle, BookOpen, ExternalLink } from "lucide-react"

export default function IndustrialSafetyLawPage() {
  const [lawInfo, setLawInfo] = useState<LawData | null>(null)
  const [articles, setArticles] = useState<LawArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)

  useEffect(() => {
    const info = getLawInfo("industrial-safety")
    const lawArticles = getArticlesByLaw("industrial-safety")
    
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
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-blue-100 rounded-notion-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {lawInfo.category}
                </span>
                <span className="text-sm text-blue-700">{lawInfo.lawNumber}</span>
              </div>
              <h1 className="text-3xl font-bold text-blue-900 mb-3">{lawInfo.lawName}</h1>
              {lawInfo.lawNameEng && (
                <p className="text-lg text-blue-700 mb-4">{lawInfo.lawNameEng}</p>
              )}
              <p className="text-blue-800 leading-relaxed max-w-4xl">{lawInfo.summary}</p>
              
              <div className="flex items-center gap-6 mt-4 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>제정: {lawInfo.enactmentDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>최종개정: {lawInfo.lastAmended}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardHat className="w-4 h-4" />
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
                    <div className="p-2 bg-blue-100 rounded-notion-md">
                      {article.articleNumber === 36 ? (
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Shield className="w-5 h-5 text-blue-600" />
                      )}
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
                  {article.articleNumber === 36 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-notion-md border-l-4 border-green-400">
                      <h4 className="font-medium text-green-900 mb-2">🎯 위험성평가 실무 가이드</h4>
                      <div className="text-sm text-green-800 space-y-2">
                        <div><strong>평가 주기:</strong> 최초 1회, 매년 정기평가, 변경사항 발생 시</div>
                        <div><strong>평가 대상:</strong> 기계·설비, 작업환경, 작업방법 등 모든 위험요소</div>
                        <div><strong>평가 방법:</strong> 빈도×강도, 정성적 평가, 정량적 평가 등</div>
                        <div><strong>개선조치:</strong> 평가 결과에 따른 위험도 감소 조치 필수</div>
                      </div>
                    </div>
                  )}

                  {article.articleNumber === 41 && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-notion-md border-l-4 border-orange-400">
                      <h4 className="font-medium text-orange-900 mb-2">🔥 작업허가 대상 작업</h4>
                      <div className="text-sm text-orange-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <div className="font-medium mb-1">화기작업:</div>
                            <ul className="space-y-1 text-xs">
                              <li>• 용접, 절단, 연삭</li>
                              <li>• 화염 사용 작업</li>
                              <li>• 고온 발생 작업</li>
                            </ul>
                          </div>
                          <div>
                            <div className="font-medium mb-1">밀폐공간 작업:</div>
                            <ul className="space-y-1 text-xs">
                              <li>• 탱크, 반응기 내부</li>
                              <li>• 맨홀, 피트 작업</li>
                              <li>• 지하공간 작업</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 관련 문서 링크 */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="font-medium text-text-primary mb-3">관련 기능</h4>
                    <div className="flex flex-wrap gap-2">
                      {article.articleNumber === 36 && (
                        <>
                          <a 
                            href="/risk-assessment" 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                          >
                            <AlertCircle className="w-3 h-3" />
                            위험성평가 작성
                          </a>
                          <a 
                            href="/jha" 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                          >
                            <Shield className="w-3 h-3" />
                            작업위험성평가
                          </a>
                        </>
                      )}
                      {article.articleNumber === 41 && (
                        <>
                          <a 
                            href="/facility/permits" 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                          >
                            <Shield className="w-3 h-3" />
                            작업허가서 작성
                          </a>
                          <a 
                            href="/facility/permits/create" 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                          >
                            <HardHat className="w-3 h-3" />
                            화기작업 허가
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 안내 */}
            <div className="mt-12 p-6 bg-gray-50 rounded-notion-lg">
              <h3 className="font-semibold text-text-primary mb-3">📋 산업안전보건법 준수를 위한 체크포인트</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">위험성평가 관련</h4>
                  <ul className="text-text-secondary space-y-1">
                    <li>✓ 연 1회 이상 정기평가 실시</li>
                    <li>✓ 시설·작업 변경 시 수시평가</li>
                    <li>✓ 평가 결과에 따른 개선조치</li>
                    <li>✓ 근로자 의견 수렴 및 교육</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-2">작업허가 관련</h4>
                  <ul className="text-text-secondary space-y-1">
                    <li>✓ 작업허가서 사전 작성</li>
                    <li>✓ 안전조치 사항 확인</li>
                    <li>✓ 작업 감시자 지정</li>
                    <li>✓ 허가서 보관 관리</li>
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