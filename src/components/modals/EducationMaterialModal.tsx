"use client"

import { useState } from "react"

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
          <h3 className="modal-title">AI 교육 자료 자동 생성</h3>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">교육 대상</label>
            <select
              className="form-input"
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

          <div className="form-group">
            <label className="form-label">교육 주제</label>
            <select
              className="form-input"
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

          <div className="form-group">
            <label className="form-label">교육 자료 형식</label>
            <select
              className="form-input"
              value={formData.format}
              onChange={(e) => setFormData({...formData, format: e.target.value})}
            >
              <option value="PPT">PPT 프레젠테이션</option>
              <option value="DOC">문서 자료</option>
              <option value="VIDEO">동영상 스크립트</option>
              <option value="POSTER">포스터/인포그래픽</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">교육 시간</label>
            <select
              className="form-input"
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

          <div className="form-group">
            <label className="form-label">난이도</label>
            <select
              className="form-input"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option>기초</option>
              <option>중급</option>
              <option>고급</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">강조하고 싶은 핵심 내용</label>
            <textarea
              className="form-textarea"
              placeholder="특별히 강조하고 싶은 내용이나 포함되어야 할 사항을 입력해주세요."
              value={formData.keyPoints}
              onChange={(e) => setFormData({...formData, keyPoints: e.target.value})}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={formData.includeTest}
                onChange={(e) => setFormData({...formData, includeTest: e.target.checked})}
              />
              <span>평가 문제 포함 (10문항)</span>
            </label>
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
              <li>대상별 맞춤형 교육 내용 구성</li>
              <li>시각적 자료 및 예시 자동 포함</li>
              <li>법규 및 최신 가이드라인 반영</li>
              <li>예상 소요시간: 4분</li>
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