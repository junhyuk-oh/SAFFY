"use client"

import { useState } from "react"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { LawReferenceSection } from "@/components/laws/LawReferenceSection"

interface PermitFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  mode?: 'create' | 'edit'
  equipmentList?: Array<{ id: string; name: string; code: string }>
}

const permitTypes = [
  { value: 'Hot Work', label: '화기작업', icon: '🔥', description: '용접, 절단, 연삭 등' },
  { value: 'Confined Space', label: '밀폐공간', icon: '🔒', description: '탱크, 맨홀, 파이프 내부 작업' },
  { value: 'Working at Height', label: '고소작업', icon: '🪜', description: '2m 이상 높이에서 작업' },
  { value: 'Electrical Work', label: '전기작업', icon: '⚡', description: '전기 시설 설치, 수리' },
  { value: 'Chemical Handling', label: '화학물질취급', icon: '🧪', description: '위험 화학물질 사용' },
  { value: 'Heavy Lifting', label: '중량물취급', icon: '🏋️', description: '크레인, 지게차 사용' },
  { value: 'Excavation', label: '굴착작업', icon: '🚧', description: '토굴, 굴착 작업' },
  { value: 'Radiation Work', label: '방사선작업', icon: '☢️', description: '방사선 취급 작업' }
]

const locations = [
  { value: 'Production Floor', label: '생산층' },
  { value: 'Lab Building', label: '실험동' },
  { value: 'Warehouse', label: '창고' },
  { value: 'Utility Room', label: '유틸리티룸' },
  { value: 'Chemical Storage', label: '화학물질저장소' },
  { value: 'Electrical Room', label: '전기실' },
  { value: 'HVAC Room', label: 'HVAC실' },
  { value: 'Server Room', label: '서버실' },
  { value: 'Rooftop', label: '옥상' },
  { value: 'Basement', label: '지하실' }
]

const priorities = [
  { value: 'low', label: '낮음', color: 'bg-success-bg text-success-text' },
  { value: 'medium', label: '보통', color: 'bg-warning-bg text-warning-text' },
  { value: 'high', label: '높음', color: 'bg-error-bg text-error-text' },
  { value: 'critical', label: '긴급', color: 'bg-red-600 text-white' }
]

export function PermitForm({
  initialData,
  onSubmit,
  onCancel,
  mode = 'create',
  equipmentList = []
}: PermitFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'Hot Work',
    location: initialData?.location || '',
    sublocation: initialData?.sublocation || '',
    priority: initialData?.priority || 'medium',
    description: initialData?.description || '',
    validFrom: initialData?.validFrom || '',
    validTo: initialData?.validTo || '',
    equipmentIds: initialData?.equipmentIds || [],
    hazards: initialData?.hazards || [''],
    safetyMeasures: initialData?.safetyMeasures || [''],
    workers: initialData?.workers || [{ name: '', role: '', certifications: [''] }],
    emergencyContacts: initialData?.emergencyContacts || [{ name: '', phone: '', role: '' }],
    requiredPPE: initialData?.requiredPPE || [''],
    specialRequirements: initialData?.specialRequirements || ''
  })

  const selectedType = permitTypes.find(t => t.value === formData.type)
  const selectedPriority = priorities.find(p => p.value === formData.priority)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 빈 배열 항목 제거
    const cleanedData = {
      ...formData,
      hazards: formData.hazards.filter(item => item.trim()),
      safetyMeasures: formData.safetyMeasures.filter(item => item.trim()),
      workers: formData.workers.filter(worker => worker.name.trim()).map(worker => ({
        ...worker,
        certifications: worker.certifications.filter(cert => cert.trim())
      })),
      emergencyContacts: formData.emergencyContacts.filter(contact => contact.name.trim()),
      requiredPPE: formData.requiredPPE.filter(item => item.trim())
    }
    
    onSubmit(cleanedData)
  }

  const handleArrayAdd = (field: keyof typeof formData) => {
    const currentArray = formData[field] as any[]
    if (field === 'workers') {
      setFormData({ 
        ...formData, 
        [field]: [...currentArray, { name: '', role: '', certifications: [''] }] 
      })
    } else if (field === 'emergencyContacts') {
      setFormData({ 
        ...formData, 
        [field]: [...currentArray, { name: '', phone: '', role: '' }] 
      })
    } else {
      setFormData({ ...formData, [field]: [...currentArray, ''] })
    }
  }

  const handleArrayRemove = (field: keyof typeof formData, index: number) => {
    const currentArray = formData[field] as any[]
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index)
    })
  }

  const handleArrayChange = (field: keyof typeof formData, index: number, value: any) => {
    const currentArray = [...(formData[field] as any[])]
    currentArray[index] = value
    setFormData({ ...formData, [field]: currentArray })
  }

  const handleWorkerCertificationAdd = (workerIndex: number) => {
    const newWorkers = [...formData.workers]
    newWorkers[workerIndex].certifications.push('')
    setFormData({ ...formData, workers: newWorkers })
  }

  const handleWorkerCertificationRemove = (workerIndex: number, certIndex: number) => {
    const newWorkers = [...formData.workers]
    newWorkers[workerIndex].certifications = newWorkers[workerIndex].certifications.filter((_, i) => i !== certIndex)
    setFormData({ ...formData, workers: newWorkers })
  }

  const handleWorkerCertificationChange = (workerIndex: number, certIndex: number, value: string) => {
    const newWorkers = [...formData.workers]
    newWorkers[workerIndex].certifications[certIndex] = value
    setFormData({ ...formData, workers: newWorkers })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">기본 정보</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              허가명 <span className="text-error-text">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              placeholder="화기작업 허가 - 배관 용접"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              작업 유형 <span className="text-error-text">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              required
            >
              {permitTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            {selectedType && (
              <div className="mt-2 p-2 bg-background rounded-notion-sm">
                <Badge variant="secondary" className="mb-2">
                  <span className="mr-1">{selectedType.icon}</span>
                  {selectedType.label}
                </Badge>
                <p className="text-sm text-text-secondary">{selectedType.description}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              우선순위 <span className="text-error-text">*</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              required
            >
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
            {selectedPriority && (
              <div className="mt-2">
                <Badge className={selectedPriority.color}>
                  {selectedPriority.label}
                </Badge>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              위치 <span className="text-error-text">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              required
            >
              <option value="">선택하세요</option>
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              상세 위치
            </label>
            <input
              type="text"
              value={formData.sublocation}
              onChange={(e) => setFormData({ ...formData, sublocation: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              placeholder="예: A동 2층 배관실"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              작업 시작일 <span className="text-error-text">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              작업 종료일 <span className="text-error-text">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.validTo}
              onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              작업 설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
              placeholder="작업에 대한 상세 설명을 입력하세요..."
            />
          </div>
        </div>
      </div>

      {/* 관련 장비 */}
      {equipmentList.length > 0 && (
        <div className="bg-background-secondary rounded-notion-md p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">관련 장비</h3>
          <div className="space-y-2">
            {equipmentList.map((equipment) => (
              <label key={equipment.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.equipmentIds.includes(equipment.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ 
                        ...formData, 
                        equipmentIds: [...formData.equipmentIds, equipment.id] 
                      })
                    } else {
                      setFormData({ 
                        ...formData, 
                        equipmentIds: formData.equipmentIds.filter(id => id !== equipment.id) 
                      })
                    }
                  }}
                  className="rounded border-border"
                />
                <span className="text-sm text-text-primary">
                  {equipment.name} (#{equipment.code})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 위험 요소 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">위험 요소</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('hazards')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.hazards.map((hazard, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-error-text">⚠️</span>
              <input
                type="text"
                value={hazard}
                onChange={(e) => handleArrayChange('hazards', index, e.target.value)}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="위험 요소를 입력하세요"
              />
              {formData.hazards.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleArrayRemove('hazards', index)}
                >
                  삭제
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 안전 조치 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">안전 조치</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('safetyMeasures')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.safetyMeasures.map((measure, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-success-text">✅</span>
              <input
                type="text"
                value={measure}
                onChange={(e) => handleArrayChange('safetyMeasures', index, e.target.value)}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="안전 조치를 입력하세요"
              />
              {formData.safetyMeasures.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleArrayRemove('safetyMeasures', index)}
                >
                  삭제
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 작업자 정보 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">작업자 정보</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('workers')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.workers.map((worker, workerIndex) => (
            <div key={workerIndex} className="p-4 bg-background rounded-notion-md border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    이름 <span className="text-error-text">*</span>
                  </label>
                  <input
                    type="text"
                    value={worker.name}
                    onChange={(e) => handleArrayChange('workers', workerIndex, { ...worker, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none"
                    placeholder="작업자 이름"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    역할
                  </label>
                  <input
                    type="text"
                    value={worker.role}
                    onChange={(e) => handleArrayChange('workers', workerIndex, { ...worker, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none"
                    placeholder="예: 용접사, 보조작업자"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text-primary">
                    자격증/교육이수
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleWorkerCertificationAdd(workerIndex)}
                  >
                    자격증 추가
                  </Button>
                </div>
                <div className="space-y-1">
                  {worker.certifications.map((cert, certIndex) => (
                    <div key={certIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleWorkerCertificationChange(workerIndex, certIndex, e.target.value)}
                        className="flex-1 px-3 py-1 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none text-sm"
                        placeholder="자격증명"
                      />
                      {worker.certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleWorkerCertificationRemove(workerIndex, certIndex)}
                          className="text-error-text hover:text-error text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {formData.workers.length > 1 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleArrayRemove('workers', workerIndex)}
                  >
                    작업자 삭제
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 비상 연락처 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">비상 연락처</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('emergencyContacts')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="space-y-3">
          {formData.emergencyContacts.map((contact, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={contact.name}
                onChange={(e) => handleArrayChange('emergencyContacts', index, { ...contact, name: e.target.value })}
                className="px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="이름"
              />
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => handleArrayChange('emergencyContacts', index, { ...contact, phone: e.target.value })}
                className="px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="전화번호"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={contact.role}
                  onChange={(e) => handleArrayChange('emergencyContacts', index, { ...contact, role: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                  placeholder="역할"
                />
                {formData.emergencyContacts.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleArrayRemove('emergencyContacts', index)}
                  >
                    삭제
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 보호장비 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">필수 보호장비(PPE)</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('requiredPPE')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.requiredPPE.map((ppe, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>🦺</span>
              <input
                type="text"
                value={ppe}
                onChange={(e) => handleArrayChange('requiredPPE', index, e.target.value)}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="보호장비 (예: 안전모, 안전화, 용접면)"
              />
              {formData.requiredPPE.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleArrayRemove('requiredPPE', index)}
                >
                  삭제
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 법적 근거 */}
      <LawReferenceSection 
        documentType="work-permit"
        title="작업허가서"
        variant="compact"
        className="mb-6"
      />

      {/* 특수 요구사항 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">특수 요구사항</h3>
        <textarea
          value={formData.specialRequirements}
          onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
          className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
          placeholder="특별한 요구사항이나 주의사항을 입력하세요..."
        />
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          취소
        </Button>
        <Button type="submit">
          {mode === 'create' ? '작업허가 신청' : '허가정보 수정'}
        </Button>
      </div>
    </form>
  )
}