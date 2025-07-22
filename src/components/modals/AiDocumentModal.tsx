"use client"

import { useState } from "react"
import { BaseModal } from "@/components/ui/BaseModal"

interface AiDocumentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AiDocumentModal({ isOpen, onClose }: AiDocumentModalProps) {
  const [formData, setFormData] = useState({
    labName: "",
    experimentType: "화학물질 취급 실험",
    chemicals: "",
    overview: ""
  })

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
      title="AI 위험성평가서 자동 생성"
      showAiInfo={true}
      footer={footer}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            실험실명
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            placeholder="예: 나노소재 연구실"
            value={formData.labName}
            onChange={(e) => setFormData({...formData, labName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            실험 유형
          </label>
          <select
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            value={formData.experimentType}
            onChange={(e) => setFormData({...formData, experimentType: e.target.value})}
          >
            <option>화학물질 취급 실험</option>
            <option>생물학적 실험</option>
            <option>물리적 위험 실험</option>
            <option>전기/기계 실험</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            주요 화학물질 (쉼표로 구분)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            placeholder="예: 황산, 질산, 아세톤"
            value={formData.chemicals}
            onChange={(e) => setFormData({...formData, chemicals: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            실험 개요
          </label>
          <textarea
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
            rows={4}
            placeholder="실험의 목적과 주요 절차를 간단히 설명해주세요."
            value={formData.overview}
            onChange={(e) => setFormData({...formData, overview: e.target.value})}
          />
        </div>

        {/* AI 생성 정보 */}
        <div className="bg-primary-light border border-primary rounded-notion-md p-4 mt-5">
          <h4 className="font-medium text-primary mb-2">AI가 자동으로 생성하는 내용</h4>
          <ul className="space-y-1 text-sm text-primary-dark">
            <li>• 위험요소 자동 식별</li>
            <li>• 법적 요구사항 자동 반영</li>
            <li>• 안전조치 사항 자동 제안</li>
            <li>• 예상 소요시간: 약 3분</li>
          </ul>
        </div>
      </div>
    </BaseModal>
  )
}