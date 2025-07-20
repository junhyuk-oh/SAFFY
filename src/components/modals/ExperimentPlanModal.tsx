"use client"

import { useState } from "react"

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

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">AI 실험계획서 자동 생성</h3>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">실험 제목</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 나노입자 합성 및 특성 분석"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">실험 목적</label>
            <textarea
              className="form-textarea"
              placeholder="실험의 목적과 기대 결과를 간략히 설명해주세요."
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">실험 방법 (간략히)</label>
            <textarea
              className="form-textarea"
              placeholder="주요 실험 절차와 방법을 간단히 기술해주세요."
              value={formData.method}
              onChange={(e) => setFormData({...formData, method: e.target.value})}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">예상 실험 기간</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 3개월"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">주요 장비 (쉼표로 구분)</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: UV-Vis 분광기, SEM, XRD"
              value={formData.equipment}
              onChange={(e) => setFormData({...formData, equipment: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">사용 화학물질 (쉼표로 구분)</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 염화철, 수산화나트륨, 에탄올"
              value={formData.chemicals}
              onChange={(e) => setFormData({...formData, chemicals: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">특별 안전수칙</label>
            <textarea
              className="form-textarea"
              placeholder="실험 시 주의해야 할 특별한 안전사항이 있다면 기입해주세요."
              value={formData.safetyRules}
              onChange={(e) => setFormData({...formData, safetyRules: e.target.value})}
              rows={2}
            />
          </div>

          <div 
            style={{ 
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "20px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px" }}>🤖</span>
              <span style={{ fontWeight: 600, color: "#0369a1" }}>AI가 자동으로 생성합니다</span>
            </div>
            <ul style={{ marginLeft: "20px", color: "#0369a1", fontSize: "14px" }}>
              <li>상세 실험 절차 자동 작성</li>
              <li>필요 안전장비 및 보호구 자동 추천</li>
              <li>비상 대응 절차 자동 포함</li>
              <li>예상 소요시간: 3분</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            취소
          </button>
          <button className="btn btn-primary">
            <span>AI 문서 생성 시작</span>
          </button>
        </div>
      </div>
    </div>
  )
}