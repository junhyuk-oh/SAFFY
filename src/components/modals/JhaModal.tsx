"use client"

import { useState } from "react"
import { BaseModal } from "@/components/ui/BaseModal"

interface JhaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JhaModal({ isOpen, onClose }: JhaModalProps) {
  const [formData, setFormData] = useState({
    workName: "",
    workSteps: "",
    hazards: "",
    workers: "",
    workArea: ""
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
      title="AI 작업위험성평가서 자동 생성"
      footer={footer}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            작업명
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            placeholder="예: 화학물질 보관용기 이동 작업"
            value={formData.workName}
            onChange={(e) => setFormData({...formData, workName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            작업 단계 (줄바꿈으로 구분)
          </label>
          <textarea
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="1. 보호장비 착용&#10;2. 용기 상태 확인&#10;3. 이동 경로 확보&#10;4. 안전하게 이동"
            value={formData.workSteps}
            onChange={(e) => setFormData({...formData, workSteps: e.target.value})}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            예상 위험요소
          </label>
          <textarea
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="화학물질 누출, 중량물 취급, 미끄러짐 위험 등"
            value={formData.hazards}
            onChange={(e) => setFormData({...formData, hazards: e.target.value})}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            작업자 수
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            placeholder="예: 2명"
            value={formData.workers}
            onChange={(e) => setFormData({...formData, workers: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            작업 구역
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
            placeholder="예: 화학물질 보관실"
            value={formData.workArea}
            onChange={(e) => setFormData({...formData, workArea: e.target.value})}
          />
        </div>

        {/* AI 생성 정보 */}
        <div className="bg-primary-light border border-primary rounded-notion-md p-4 mt-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="font-medium text-primary">AI가 자동으로 생성합니다</span>
          </div>
          <ul className="ml-6 space-y-1 text-sm text-primary-dark">
            <li>• 작업 단계별 위험요소 자동 분석</li>
            <li>• 위험성 평가 및 등급 자동 산정</li>
            <li>• 안전대책 및 예방조치 자동 제안</li>
            <li>• 예상 소요시간: 2분</li>
          </ul>
        </div>
      </div>
    </BaseModal>
  )
}