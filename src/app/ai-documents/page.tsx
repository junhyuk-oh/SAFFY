"use client"

import { useState } from "react"
import { AiDocumentModal } from "@/components/modals/AiDocumentModal"
import { 
  JhaModal, 
  ExperimentPlanModal, 
  QuarterlyReportModal, 
  EducationMaterialModal 
} from "@/components/modals"

interface DocumentType {
  id: string
  title: string
  description: string
  icon: string
  estimatedTime: string
  badge: string
  modalType: string
}

const documentTypes: DocumentType[] = [
  {
    id: "risk-assessment",
    title: "위험성평가서",
    description: "실험실 및 작업장의 위험요소를 식별하고 안전조치를 제시하는 공식 문서",
    icon: "⚠️",
    estimatedTime: "3분 내 생성",
    badge: "AI 자동화",
    modalType: "risk"
  },
  {
    id: "jha",
    title: "작업위험성평가(JHA)",
    description: "특정 작업의 단계별 위험요소를 분석하고 통제 방안을 수립하는 문서",
    icon: "🔍",
    estimatedTime: "5분 내 생성",
    badge: "AI 지원",
    modalType: "jha"
  },
  {
    id: "experiment-plan",
    title: "실험계획서",
    description: "실험 목적, 절차, 안전사항을 체계적으로 정리한 연구 계획 문서",
    icon: "🧪",
    estimatedTime: "7분 내 생성",
    badge: "AI 작성",
    modalType: "experiment"
  },
  {
    id: "quarterly-report",
    title: "분기 보고서",
    description: "분기별 안전관리 활동 및 성과를 종합한 공식 보고서",
    icon: "📊",
    estimatedTime: "10분 내 생성",
    badge: "AI 분석",
    modalType: "quarterly"
  },
  {
    id: "education-materials",
    title: "교육 자료",
    description: "맞춤형 안전교육 콘텐츠 및 프레젠테이션 자료 생성",
    icon: "📚",
    estimatedTime: "5분 내 생성",
    badge: "AI 맞춤형",
    modalType: "education"
  }
]

export default function AiDocumentsPage() {
  const [selectedModal, setSelectedModal] = useState<string | null>(null)

  const handleCardClick = (modalType: string) => {
    setSelectedModal(modalType)
  }

  const handleCloseModal = () => {
    setSelectedModal(null)
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-text-primary">AI 문서 생성</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-light to-blue-50 rounded-full">
              <span className="text-xl">🤖</span>
              <span className="text-sm font-semibold text-primary">AI가 모든 문서를 자동으로 작성합니다</span>
            </div>
          </div>
          <p className="text-text-secondary">필요한 정보만 입력하면 AI가 전문적인 안전관리 문서를 즉시 생성합니다</p>
        </div>

        {/* Document Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {documentTypes.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleCardClick(doc.modalType)}
              className="group relative bg-background-secondary rounded-notion-md p-6 text-left transition-all duration-300 hover:shadow-notion-lg hover:-translate-y-2 hover:bg-background-primary border border-border-subtle hover:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary active:scale-98"
            >
              {/* AI Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-light text-primary text-xs font-medium rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="text-[10px]">🤖</span>
                  <span>{doc.badge}</span>
                </span>
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {doc.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                {doc.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {doc.description}
              </p>

              {/* Estimated Time */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl">⏱️</span>
                <span className="font-medium text-primary">{doc.estimatedTime}</span>
              </div>

              {/* Hover Indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* AI Features Section */}
        <div className="mt-12 bg-gradient-to-br from-primary-light via-blue-50 to-purple-50 rounded-notion-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">✨</span>
            <h2 className="text-2xl font-bold text-text-primary">AI 문서 생성의 장점</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background-primary/80 backdrop-blur rounded-notion-md p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold text-text-primary mb-1">초고속 생성</h4>
              <p className="text-sm text-text-secondary">몇 시간 걸리던 작업을 분 단위로 단축</p>
            </div>
            
            <div className="bg-background-primary/80 backdrop-blur rounded-notion-md p-4">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-semibold text-text-primary mb-1">법적 준수</h4>
              <p className="text-sm text-text-secondary">최신 법규와 기준을 자동으로 반영</p>
            </div>
            
            <div className="bg-background-primary/80 backdrop-blur rounded-notion-md p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-text-primary mb-1">맞춤형 내용</h4>
              <p className="text-sm text-text-secondary">실험실별 특성을 반영한 정확한 문서</p>
            </div>
            
            <div className="bg-background-primary/80 backdrop-blur rounded-notion-md p-4">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-semibold text-text-primary mb-1">지속 개선</h4>
              <p className="text-sm text-text-secondary">AI가 학습하며 품질이 계속 향상</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedModal === "risk" && (
        <AiDocumentModal isOpen={true} onClose={handleCloseModal} />
      )}
      
      {selectedModal === "jha" && (
        <JhaModal isOpen={true} onClose={handleCloseModal} />
      )}
      
      {selectedModal === "experiment" && (
        <ExperimentPlanModal isOpen={true} onClose={handleCloseModal} />
      )}
      
      {selectedModal === "quarterly" && (
        <QuarterlyReportModal isOpen={true} onClose={handleCloseModal} />
      )}
      
      {selectedModal === "education" && (
        <EducationMaterialModal isOpen={true} onClose={handleCloseModal} />
      )}
    </>
  )
}