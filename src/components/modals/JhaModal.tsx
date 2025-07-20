"use client"

import { useState } from "react"

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
          <h3 className="modal-title">AI 작업위험성평가서 자동 생성</h3>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">작업명</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 화학물질 보관용기 이동 작업"
              value={formData.workName}
              onChange={(e) => setFormData({...formData, workName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">작업 단계 (줄바꿈으로 구분)</label>
            <textarea
              className="form-textarea"
              placeholder="1. 보호장비 착용&#10;2. 용기 상태 확인&#10;3. 이동 경로 확보&#10;4. 안전하게 이동"
              value={formData.workSteps}
              onChange={(e) => setFormData({...formData, workSteps: e.target.value})}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">예상 위험요소</label>
            <textarea
              className="form-textarea"
              placeholder="화학물질 누출, 중량물 취급, 미끄러짐 위험 등"
              value={formData.hazards}
              onChange={(e) => setFormData({...formData, hazards: e.target.value})}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">작업자 수</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 2명"
              value={formData.workers}
              onChange={(e) => setFormData({...formData, workers: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">작업 구역</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 화학물질 보관실"
              value={formData.workArea}
              onChange={(e) => setFormData({...formData, workArea: e.target.value})}
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
              <li>작업 단계별 위험요소 자동 분석</li>
              <li>위험성 평가 및 등급 자동 산정</li>
              <li>안전대책 및 예방조치 자동 제안</li>
              <li>예상 소요시간: 2분</li>
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