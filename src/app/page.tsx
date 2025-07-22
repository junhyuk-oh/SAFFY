"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentDocuments } from "@/components/dashboard/RecentDocuments"
import { AiDocumentModal } from "@/components/modals/AiDocumentModal"
import { ComplianceIndicator } from "@/components/laws/ComplianceIndicator"

const statsData = [
  {
    title: "문서 완료율",
    value: "87%",
    change: { value: "12% 향상", type: "positive" as const },
    icon: "📄",
    progress: 87
  },
  {
    title: "다음 점검일",
    value: "D-7",
    change: { value: "3개 항목 대기", type: "negative" as const },
    icon: "📅"
  },
  {
    title: "교육 이수율",
    value: "75%",
    change: { value: "5명 미이수", type: "negative" as const },
    icon: "🎓",
    progress: 75
  },
  {
    title: "시설 건강도",
    value: "85%",
    change: { value: "정상 운영", type: "positive" as const },
    icon: "🏢",
    progress: 85
  },
  {
    title: "긴급 작업",
    value: "2건",
    change: { value: "즉시 확인 필요", type: "negative" as const },
    icon: "🚨"
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
    title: "문서 관리",
    description: "일/주/월/연간 문서",
    icon: "📁"
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
  },
  {
    id: "5",
    title: "수료증 업로드",
    description: "교육 이수 증명 등록",
    icon: "📎"
  },
  {
    id: "6",
    title: "유지보수 작업 생성",
    description: "시설 유지보수 계획",
    icon: "🔧"
  },
  {
    id: "7",
    title: "작업허가서 신청",
    description: "안전 작업 승인",
    icon: "🛡️"
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
  const router = useRouter()

  const handleActionClick = (actionId: string) => {
    if (actionId === "1") {
      setIsModalOpen(true)
    } else if (actionId === "2") {
      router.push("/documents")
    } else if (actionId === "3") {
      router.push("/documents/create?type=quarterly")
    } else if (actionId === "4") {
      router.push("/education/manage")
    } else if (actionId === "5") {
      router.push("/education/status?action=upload")
    }
  }

  const actionsWithHandlers = quickActions.map(action => ({
    ...action,
    onClick: () => handleActionClick(action.id)
  }))

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">종합 대시보드</h1>
          <p className="text-text-secondary">안전관리 현황을 한눈에 확인하세요</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
          {/* 법률 준수 현황 */}
          <ComplianceIndicator variant="card" />
        </div>

        {/* Quick Actions */}
        <QuickActions actions={actionsWithHandlers} />

        {/* Recent Documents */}
        <RecentDocuments documents={recentDocuments} />
      </div>

      <AiDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}