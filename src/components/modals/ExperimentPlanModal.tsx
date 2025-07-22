"use client"

import { useState } from "react"
import { BaseModal } from "@/components/ui/layout"

interface ExperimentPlanModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExperimentPlanModal({ isOpen, onClose }: ExperimentPlanModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    purpose: "",
    method: "",
    duration: "",
    equipment: "",
    chemicals: "",
    safetyRules: ""
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
      title="AI 실험계획서 자동 생성"
      footer={footer}
      size="xl"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            실험 제목
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            placeholder="예: 나노입자 합성 및 특성 분석"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            실험 목적
          </label>
          <textarea
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="실험의 목적과 기대 결과를 간략히 설명해주세요."
            value={formData.purpose}
            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            실험 방법 (간략히)
          </label>
          <textarea
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="주요 실험 절차와 방법을 간단히 기술해주세요."
            value={formData.method}
            onChange={(e) => setFormData({...formData, method: e.target.value})}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              예상 실험 기간
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              placeholder="예: 3개월"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              주요 장비 (쉼표로 구분)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              placeholder="예: UV-Vis 분광기, SEM, XRD"
              value={formData.equipment}
              onChange={(e) => setFormData({...formData, equipment: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            사용 화학물질 (쉼표로 구분)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            placeholder="예: 염화철, 수산화나트륨, 에탄올"
            value={formData.chemicals}
            onChange={(e) => setFormData({...formData, chemicals: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            특별 안전수칙
          </label>
          <textarea
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="실험 시 주의해야 할 특별한 안전사항이 있다면 기입해주세요."
            value={formData.safetyRules}
            onChange={(e) => setFormData({...formData, safetyRules: e.target.value})}
            rows={2}
          />
        </div>

        {/* AI 생성 정보 */}
        <div className="bg-primary-light border border-primary rounded-notion-md p-4 mt-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="font-medium text-primary">AI가 자동으로 생성합니다</span>
          </div>
          <ul className="ml-6 space-y-1 text-sm text-primary-dark">
            <li>• 상세 실험 절차 자동 작성</li>
            <li>• 필요 안전장비 및 보호구 자동 추천</li>
            <li>• 비상 대응 절차 자동 포함</li>
            <li>• 예상 소요시간: 3분</li>
          </ul>
        </div>
      </div>
    </BaseModal>
  )
}