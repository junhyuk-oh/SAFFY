"use client"

import { useState } from "react"

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
          <h3 className="modal-title">AI 위험성평가서 자동 생성</h3>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">실험실명</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 나노소재 연구실"
              value={formData.labName}
              onChange={(e) => setFormData({...formData, labName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">실험 유형</label>
            <select
              className="form-input"
              value={formData.experimentType}
              onChange={(e) => setFormData({...formData, experimentType: e.target.value})}
            >
              <option>화학물질 취급 실험</option>
              <option>생물학적 실험</option>
              <option>물리적 위험 실험</option>
              <option>전기/기계 실험</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">주요 화학물질 (쉼표로 구분)</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 황산, 질산, 아세톤"
              value={formData.chemicals}
              onChange={(e) => setFormData({...formData, chemicals: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">실험 개요</label>
            <textarea
              className="form-textarea"
              placeholder="실험의 목적과 주요 절차를 간단히 설명해주세요."
              value={formData.overview}
              onChange={(e) => setFormData({...formData, overview: e.target.value})}
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
              <li>위험요소 자동 식별</li>
              <li>법적 요구사항 자동 반영</li>
              <li>안전조치 사항 자동 제안</li>
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