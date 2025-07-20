"use client"

import { useState } from "react"

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

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCheckboxChange = (item: keyof typeof formData.includeItems) => {
    setFormData({
      ...formData,
      includeItems: {
        ...formData.includeItems,
        [item]: !formData.includeItems[item]
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">AI 분기 보고서 자동 생성</h3>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">보고서 연도</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 2024"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">분기 선택</label>
            <select
              className="form-input"
              value={formData.quarter}
              onChange={(e) => setFormData({...formData, quarter: e.target.value})}
            >
              <option value="1">1분기 (1월 - 3월)</option>
              <option value="2">2분기 (4월 - 6월)</option>
              <option value="3">3분기 (7월 - 9월)</option>
              <option value="4">4분기 (10월 - 12월)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">포함할 항목</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.includeItems.safetyInspection}
                  onChange={() => handleCheckboxChange("safetyInspection")}
                />
                <span>안전점검 실시 현황</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.includeItems.chemicalUsage}
                  onChange={() => handleCheckboxChange("chemicalUsage")}
                />
                <span>화학물질 사용 현황</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.includeItems.educationStatus}
                  onChange={() => handleCheckboxChange("educationStatus")}
                />
                <span>안전교육 실시 현황</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.includeItems.incidentReport}
                  onChange={() => handleCheckboxChange("incidentReport")}
                />
                <span>사고/아차사고 보고</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.includeItems.equipmentMaintenance}
                  onChange={() => handleCheckboxChange("equipmentMaintenance")}
                />
                <span>장비 유지보수 현황</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.includeItems.wasteManagement}
                  onChange={() => handleCheckboxChange("wasteManagement")}
                />
                <span>폐기물 처리 현황</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.includeItems.improvements}
                  onChange={() => handleCheckboxChange("improvements")}
                />
                <span>개선사항 및 계획</span>
              </label>
            </div>
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
              <li>분기별 데이터 자동 집계 및 분석</li>
              <li>주요 성과 및 개선점 자동 도출</li>
              <li>통계 차트 및 그래프 자동 생성</li>
              <li>예상 소요시간: 5분</li>
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