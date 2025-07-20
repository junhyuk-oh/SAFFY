"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentDocuments } from "@/components/dashboard/RecentDocuments"
import { AiDocumentModal } from "@/components/modals/AiDocumentModal"

const statsData = [
  {
    title: "문서 완료율",
    value: "87%",
    change: { value: "12% 향상", type: "positive" as const },
    icon: "📄",
    progress: 87
  },
  {
    title: "AI 자동화 절감 시간",
    value: "248시간",
    change: { value: "이번 달 절감", type: "positive" as const },
    icon: "⏱️",
    aiLabel: "AI로 90% 시간 단축"
  },
  {
    title: "법적 준수율",
    value: "100%",
    change: { value: "모든 요건 충족", type: "positive" as const },
    icon: "⚖️",
    progress: 100
  },
  {
    title: "다음 점검일",
    value: "D-7",
    change: { value: "3개 항목 대기", type: "negative" as const },
    icon: "📅"
  }
]

const quickActions = [
  {
    id: "1",
    title: "위험성평가서 생성",
    description: "3분 내 자동 완성",
    icon: "⚡"
  },
  {
    id: "2",
    title: "문서 스캔 & 분류",
    description: "OCR 자동 인식",
    icon: "📸"
  },
  {
    id: "3",
    title: "분기 보고서 생성",
    description: "원클릭 자동 생성",
    icon: "📊"
  },
  {
    id: "4",
    title: "교육 일정 관리",
    description: "맞춤형 교육 추천",
    icon: "🎓"
  }
]

const recentDocuments = [
  {
    id: "1",
    name: "2024년 4분기 화학물질 위험성평가",
    type: "위험성평가서",
    createdDate: "2024.12.15",
    status: "completed" as const,
    author: "김연구원",
    isAiGenerated: true
  },
  {
    id: "2",
    name: "나노소재 실험 JHA",
    type: "작업위험성평가",
    createdDate: "2024.12.14",
    status: "pending" as const,
    author: "박교수",
    isAiGenerated: false
  },
  {
    id: "3",
    name: "월간 안전교육 일지",
    type: "교육일지",
    createdDate: "2024.12.13",
    status: "overdue" as const,
    author: "이안전관리자",
    isAiGenerated: true
  }
]

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleActionClick = (actionId: string) => {
    if (actionId === "1") {
      setIsModalOpen(true)
    }
  }

  const actionsWithHandlers = quickActions.map(action => ({
    ...action,
    onClick: () => handleActionClick(action.id)
  }))

  return (
    <>
      <Header />
      
      <div className="max-w-[1400px] mx-auto p-5">
        <div className="flex gap-6 mt-6">
          {/* Sidebar */}
          <aside className="w-60 bg-background-secondary rounded-notion-md p-4 h-fit sticky top-24">
            <Sidebar />
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              {statsData.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <QuickActions actions={actionsWithHandlers} />

            {/* Recent Documents */}
            <RecentDocuments documents={recentDocuments} />
          </main>
        </div>
      </div>

      <AiDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}