"use client"

import { useEffect, useState } from "react"
import { getLawInfo, getArticlesByLaw, type LawData, type LawArticle } from "@/lib/laws/lawDatabase"
import { FlaskConical, Shield, FileText, BookOpen, ExternalLink } from "lucide-react"

export default function LabSafetyLawPage() {
  const [lawInfo, setLawInfo] = useState<LawData | null>(null)
  const [articles, setArticles] = useState<LawArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)

  useEffect(() => {
    const info = getLawInfo("lab-safety")
    const lawArticles = getArticlesByLaw("lab-safety")
    
    setLawInfo(info || null)
    setArticles(lawArticles)
    
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
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-purple-100 rounded-notion-lg">
              <FlaskConical className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-full">
                  {lawInfo.category}
                </span>
                <span className="text-sm text-purple-700">{lawInfo.lawNumber}</span>
              </div>
              <h1 className="text-3xl font-bold text-purple-900 mb-3">{lawInfo.lawName}</h1>
              {lawInfo.lawNameEng && (
                <p className="text-lg text-purple-700 mb-4">{lawInfo.lawNameEng}</p>
              )}
              <p className="text-purple-800 leading-relaxed max-w-4xl">{lawInfo.summary}</p>
              
              <div className="flex items-center gap-6 mt-4 text-sm text-purple-700">
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
                    <div className="p-2 bg-purple-100 rounded-notion-md">
                      <FlaskConical className="w-5 h-5 text-purple-600" />
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

                  {/* 관련 문서 링크 */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="font-medium text-text-primary mb-3">관련 기능</h4>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href="/experiment-plan" 
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                      >
                        <FlaskConical className="w-3 h-3" />
                        실험계획서 작성
                      </a>
                      <a 
                        href="/education" 
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-notion-sm text-sm hover:bg-primary hover:text-white transition-colors"
                      >
                        <Shield className="w-3 h-3" />
                        연구실 안전교육
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}