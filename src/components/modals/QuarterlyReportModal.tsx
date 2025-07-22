"use client"

import { useState } from "react"
import { BaseModal } from "@/components/ui/layout"

interface QuarterlyReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuarterlyReportModal({ isOpen, onClose }: QuarterlyReportModalProps) {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    quarter: "1",
    includeItems: {
      safetyInspection: true,
      chemicalUsage: true,
      educationStatus: true,
      incidentReport: true,
      equipmentMaintenance: true,
      wasteManagement: true,
      improvements: true
    }
  })

  const handleCheckboxChange = (item: keyof typeof formData.includeItems) => {
    setFormData({
      ...formData,
      includeItems: {
        ...formData.includeItems,
        [item]: !formData.includeItems[item]
      }
    })
  }

  const handleSubmit = () => {
    // AI 문서 생성 로직
    console.log("AI 문서 생성 시작:", formData)
    onClose()
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <button 
        className="px-4 py-2 bg-background rounded-notion-sm border border-border hover:bg-background-hover transition-colors"
        onClick={onClose}
      >
        취소
      </button>
      <button 
        className="px-6 py-2 bg-primary text-text-inverse rounded-notion-sm hover:bg-primary-hover transition-colors font-medium"
        onClick={handleSubmit}
      >
        AI 문서 생성 시작
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="AI 분기 보고서 자동 생성"
      footer={footer}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              보고서 연도
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              placeholder="예: 2024"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              분기 선택
            </label>
            <select
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              value={formData.quarter}
              onChange={(e) => setFormData({...formData, quarter: e.target.value})}
            >
              <option value="1">1분기 (1월 - 3월)</option>
              <option value="2">2분기 (4월 - 6월)</option>
              <option value="3">3분기 (7월 - 9월)</option>
              <option value="4">4분기 (10월 - 12월)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            포함할 항목
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                checked={formData.includeItems.safetyInspection}
                onChange={() => handleCheckboxChange("safetyInspection")}
              />
              <span className="text-sm text-text-primary">안전점검 실시 현황</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                checked={formData.includeItems.chemicalUsage}
                onChange={() => handleCheckboxChange("chemicalUsage")}
              />
              <span className="text-sm text-text-primary">화학물질 사용 현황</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                checked={formData.includeItems.educationStatus}
                onChange={() => handleCheckboxChange("educationStatus")}
              />
              <span className="text-sm text-text-primary">안전교육 실시 현황</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                checked={formData.includeItems.incidentReport}
                onChange={() => handleCheckboxChange("incidentReport")}
              />
              <span className="text-sm text-text-primary">사고/아차사고 보고</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                checked={formData.includeItems.equipmentMaintenance}
                onChange={() => handleCheckboxChange("equipmentMaintenance")}
              />
              <span className="text-sm text-text-primary">장비 유지보수 현황</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                checked={formData.includeItems.wasteManagement}
                onChange={() => handleCheckboxChange("wasteManagement")}
              />
              <span className="text-sm text-text-primary">폐기물 처리 현황</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                checked={formData.includeItems.improvements}
                onChange={() => handleCheckboxChange("improvements")}
              />
              <span className="text-sm text-text-primary">개선사항 및 계획</span>
            </label>
          </div>
        </div>

        {/* AI 생성 정보 */}
        <div className="bg-primary-light border border-primary rounded-notion-md p-4 mt-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="font-medium text-primary">AI가 자동으로 생성합니다</span>
          </div>
          <ul className="ml-6 space-y-1 text-sm text-primary-dark">
            <li>• 분기별 데이터 자동 집계 및 분석</li>
            <li>• 주요 성과 및 개선점 자동 도출</li>
            <li>• 통계 차트 및 그래프 자동 생성</li>
            <li>• 예상 소요시간: 5분</li>
          </ul>
        </div>
      </div>
    </BaseModal>
  )
}