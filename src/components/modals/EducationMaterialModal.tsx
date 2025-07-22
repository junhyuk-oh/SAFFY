"use client"

import { useState } from "react"
import { BaseModal } from "@/components/ui/BaseModal"

interface EducationMaterialModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EducationMaterialModal({ isOpen, onClose }: EducationMaterialModalProps) {
  const [formData, setFormData] = useState({
    target: "신규 연구원",
    topic: "실험실 기본 안전수칙",
    format: "PPT",
    duration: "30분",
    level: "기초",
    keyPoints: "",
    includeTest: true
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
      title="AI 교육 자료 자동 생성"
      footer={footer}
      size="xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              교육 대상
            </label>
            <select
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              value={formData.target}
              onChange={(e) => setFormData({...formData, target: e.target.value})}
            >
              <option>신규 연구원</option>
              <option>기존 연구원</option>
              <option>대학원생</option>
              <option>학부생</option>
              <option>외부 방문자</option>
              <option>안전관리자</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              교육 주제
            </label>
            <select
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
            >
              <option>실험실 기본 안전수칙</option>
              <option>화학물질 안전 취급</option>
              <option>개인보호구 착용법</option>
              <option>비상대응 절차</option>
              <option>폐기물 처리 방법</option>
              <option>실험장비 안전 사용법</option>
              <option>생물안전 수칙</option>
              <option>방사선 안전관리</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              교육 자료 형식
            </label>
            <select
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              value={formData.format}
              onChange={(e) => setFormData({...formData, format: e.target.value})}
            >
              <option value="PPT">PPT 프레젠테이션</option>
              <option value="DOC">문서 자료</option>
              <option value="VIDEO">동영상 스크립트</option>
              <option value="POSTER">포스터/인포그래픽</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              교육 시간
            </label>
            <select
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
            >
              <option>15분</option>
              <option>30분</option>
              <option>1시간</option>
              <option>2시간</option>
              <option>반일 (4시간)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              난이도
            </label>
            <select
              className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option>기초</option>
              <option>중급</option>
              <option>고급</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            강조하고 싶은 핵심 내용
          </label>
          <textarea
            className="w-full px-3 py-2 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="특별히 강조하고 싶은 내용이나 포함되어야 할 사항을 입력해주세요."
            value={formData.keyPoints}
            onChange={(e) => setFormData({...formData, keyPoints: e.target.value})}
            rows={3}
          />
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              checked={formData.includeTest}
              onChange={(e) => setFormData({...formData, includeTest: e.target.checked})}
            />
            <span className="text-sm text-text-primary">평가 문제 포함 (10문항)</span>
          </label>
        </div>

        {/* AI 생성 정보 */}
        <div className="bg-primary-light border border-primary rounded-notion-md p-4 mt-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="font-medium text-primary">AI가 자동으로 생성합니다</span>
          </div>
          <ul className="ml-6 space-y-1 text-sm text-primary-dark">
            <li>• 대상별 맞춤형 교육 내용 구성</li>
            <li>• 시각적 자료 및 예시 자동 포함</li>
            <li>• 법규 및 최신 가이드라인 반영</li>
            <li>• 예상 소요시간: 4분</li>
          </ul>
        </div>
      </div>
    </BaseModal>
  )
}