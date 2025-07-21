"use client"

import { useState, useEffect } from "react"
import { CreateMaintenanceTaskRequest, UpdateMaintenanceTaskRequest, MaintenanceTask, MaintenanceCategory, FacilityArea, Priority } from "@/lib/types/facility"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MaintenanceFormProps {
  task?: MaintenanceTask // 수정 시 기존 작업 데이터
  onSubmit: (data: CreateMaintenanceTaskRequest | UpdateMaintenanceTaskRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: 'create' | 'edit'
}

const categories: { value: MaintenanceCategory; label: string; icon: string }[] = [
  { value: 'Electrical', label: '전기', icon: '⚡' },
  { value: 'HVAC', label: 'HVAC', icon: '🌡️' },
  { value: 'Plumbing', label: '배관', icon: '🔧' },
  { value: 'Fire Safety', label: '화재안전', icon: '🔥' },
  { value: 'Security', label: '보안', icon: '🛡️' },
  { value: 'Structural', label: '구조', icon: '🏗️' },
  { value: 'Equipment', label: '장비', icon: '⚙️' },
  { value: 'Cleaning', label: '청소', icon: '🧹' },
  { value: 'Preventive', label: '예방정비', icon: '🔄' },
  { value: 'Corrective', label: '교정정비', icon: '🔧' },
  { value: 'Emergency', label: '응급', icon: '🚨' },
  { value: 'Inspection', label: '점검', icon: '🔍' },
  { value: 'Calibration', label: '교정', icon: '📏' },
  { value: 'Software Update', label: '소프트웨어 업데이트', icon: '💻' },
  { value: 'Safety Check', label: '안전점검', icon: '✅' }
]

const locations: { value: FacilityArea; label: string }[] = [
  { value: 'Production Floor', label: '생산층' },
  { value: 'Lab Building', label: '실험동' },
  { value: 'Warehouse', label: '창고' },
  { value: 'Office Building', label: '사무동' },
  { value: 'Utility Room', label: '유틸리티룸' },
  { value: 'Chemical Storage', label: '화학물질 저장소' },
  { value: 'Electrical Room', label: '전기실' },
  { value: 'HVAC Room', label: 'HVAC실' },
  { value: 'Emergency Exit', label: '비상구' },
  { value: 'Parking Area', label: '주차장' },
  { value: 'Loading Dock', label: '하역장' },
  { value: 'Server Room', label: '서버실' }
]

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: '낮음', color: 'text-success-text bg-success-bg' },
  { value: 'medium', label: '보통', color: 'text-warning-text bg-warning-bg' },
  { value: 'high', label: '높음', color: 'text-error-text bg-error-bg' },
  { value: 'critical', label: '긴급', color: 'text-white bg-red-600' }
]

const commonHazards = [
  '전기 위험', '화학물질 노출', '높은 곳 작업', '밀폐공간', '화재 위험',
  '기계 위험', '소음', '진동', '고온', '저온', '방사선', '생물학적 위험'
]

const commonPPE = [
  '안전모', '안전화', '보안경', '장갑', '반사조끼', '호흡보호구',
  '귀마개', '안전벨트', '화학복', '절연장갑', '용접마스크'
]

const commonPrecautions = [
  'LOTO 절차 수행', '가스 측정', '환기 확인', '화기 금지', '접근 통제',
  '응급연락처 확인', '작업도구 점검', '날씨 조건 확인'
]

export function MaintenanceForm({
  task,
  onSubmit,
  onCancel,
  loading = false,
  mode
}: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Equipment' as MaintenanceCategory,
    priority: 'medium' as Priority,
    equipmentId: '',
    location: 'Production Floor' as FacilityArea,
    subLocation: '',
    scheduledDate: '',
    dueDate: '',
    estimatedDuration: 60,
    assignedToId: '',
    workOrder: '',
    notes: ''
  })

  const [safetyData, setSafetyData] = useState({
    hazards: [] as string[],
    precautions: [] as string[],
    requiredPPE: [] as string[],
    lockoutTagout: false,
    permitRequired: false
  })

  const [materials, setMaterials] = useState<Array<{
    name: string
    quantity: number
    unit: string
    cost: number
  }>>([])

  const [customHazard, setCustomHazard] = useState('')
  const [customPPE, setCustomPPE] = useState('')
  const [customPrecaution, setCustomPrecaution] = useState('')

  // 기존 작업 데이터로 폼 초기화
  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        equipmentId: task.equipmentId || '',
        location: task.location,
        subLocation: task.subLocation || '',
        scheduledDate: new Date(task.scheduledDate).toISOString().slice(0, 16),
        dueDate: new Date(task.dueDate).toISOString().slice(0, 16),
        estimatedDuration: task.estimatedDuration,
        assignedToId: task.assignedTo.userId,
        workOrder: task.workOrder || '',
        notes: task.notes || ''
      })

      setSafetyData({
        hazards: task.safety.hazards,
        precautions: task.safety.precautions,
        requiredPPE: task.safety.requiredPPE,
        lockoutTagout: task.safety.lockoutTagout,
        permitRequired: task.safety.permitRequired
      })

      setMaterials(task.materials?.map(m => ({
        name: m.name,
        quantity: m.quantity,
        unit: m.unit,
        cost: m.cost || 0
      })) || [])
    }
  }, [task, mode])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSafetyChange = (field: string, value: any) => {
    setSafetyData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (array: string[], item: string, field: keyof typeof safetyData) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
    setSafetyData(prev => ({ ...prev, [field]: newArray }))
  }

  const addCustomItem = (item: string, field: keyof typeof safetyData, setCustom: (value: string) => void) => {
    if (item.trim() && !safetyData[field].includes(item.trim())) {
      setSafetyData(prev => ({
        ...prev,
        [field]: [...prev[field], item.trim()]
      }))
      setCustom('')
    }
  }

  const addMaterial = () => {
    setMaterials(prev => [...prev, { name: '', quantity: 1, unit: '개', cost: 0 }])
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    setMaterials(prev => prev.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    ))
  }

  const removeMaterial = (index: number) => {
    setMaterials(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const submitData: CreateMaintenanceTaskRequest | UpdateMaintenanceTaskRequest = mode === 'create' ? {
        ...formData,
        safety: safetyData,
        materials: materials.filter(m => m.name.trim()),
        attachments: []
      } : {
        id: task!.id,
        updates: {
          ...formData,
          safety: safetyData,
          materials: materials.filter(m => m.name.trim())
        }
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const selectedCategory = categories.find(c => c.value === formData.category)
  const selectedPriority = priorities.find(p => p.value === formData.priority)

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {mode === 'create' ? '새 유지보수 작업' : '작업 수정'}
            </h2>
            <p className="text-text-secondary mt-1">
              {mode === 'create' ? '새로운 유지보수 작업을 등록합니다' : '기존 작업의 정보를 수정합니다'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : (mode === 'create' ? '작업 생성' : '변경 저장')}
            </Button>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">기본 정보</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                작업 제목 <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="예: 펌프 P-101 정기점검"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
                placeholder="작업에 대한 자세한 설명을 입력하세요..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                카테고리 <span className="text-error-text">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.slice(0, 6).map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleInputChange('category', category.value)}
                    className={`p-3 rounded-notion-sm border text-center transition-all ${
                      formData.category === category.value
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border bg-background hover:border-border-hover'
                    }`}
                  >
                    <div className="text-lg mb-1">{category.icon}</div>
                    <div className="text-xs font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-notion-sm border border-border bg-background text-sm"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                우선순위 <span className="text-error-text">*</span>
              </label>
              <div className="space-y-2">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handleInputChange('priority', priority.value)}
                    className={`w-full p-3 rounded-notion-sm border text-left transition-all ${
                      formData.priority === priority.value
                        ? 'border-primary bg-primary-light'
                        : 'border-border bg-background hover:border-border-hover'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{priority.label}</span>
                      <Badge className={priority.color}>{priority.label}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 위치 및 일정 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">위치 및 일정</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                위치 <span className="text-error-text">*</span>
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background"
                required
              >
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">상세 위치</label>
              <input
                type="text"
                value={formData.subLocation}
                onChange={(e) => handleInputChange('subLocation', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="예: 2층 동쪽 구역"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                예정일 <span className="text-error-text">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                마감일 <span className="text-error-text">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                예상 소요시간 (분)
              </label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">작업지시서 번호</label>
              <input
                type="text"
                value={formData.workOrder}
                onChange={(e) => handleInputChange('workOrder', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="예: WO-2024-001"
              />
            </div>
          </div>
        </div>

        {/* 안전 정보 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">안전 정보</h3>

          {/* 안전 옵션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safetyData.lockoutTagout}
                onChange={(e) => handleSafetyChange('lockoutTagout', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                🔒 LOTO (잠금표시) 필요
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safetyData.permitRequired}
                onChange={(e) => handleSafetyChange('permitRequired', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                📋 작업허가서 필요
              </span>
            </label>
          </div>

          {/* 위험요소 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">위험요소</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {commonHazards.map((hazard) => (
                <button
                  key={hazard}
                  type="button"
                  onClick={() => handleArrayToggle(safetyData.hazards, hazard, 'hazards')}
                  className={`p-2 rounded-notion-sm border text-sm transition-all ${
                    safetyData.hazards.includes(hazard)
                      ? 'border-warning bg-warning-bg text-warning-text'
                      : 'border-border bg-background hover:border-border-hover'
                  }`}
                >
                  {hazard}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customHazard}
                onChange={(e) => setCustomHazard(e.target.value)}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none text-sm"
                placeholder="기타 위험요소 추가"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customHazard, 'hazards', setCustomHazard)}
              >
                추가
              </Button>
            </div>
          </div>

          {/* 예방조치 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">예방조치</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {commonPrecautions.map((precaution) => (
                <button
                  key={precaution}
                  type="button"
                  onClick={() => handleArrayToggle(safetyData.precautions, precaution, 'precautions')}
                  className={`p-2 rounded-notion-sm border text-sm transition-all ${
                    safetyData.precautions.includes(precaution)
                      ? 'border-success bg-success-bg text-success-text'
                      : 'border-border bg-background hover:border-border-hover'
                  }`}
                >
                  {precaution}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrecaution}
                onChange={(e) => setCustomPrecaution(e.target.value)}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none text-sm"
                placeholder="기타 예방조치 추가"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customPrecaution, 'precautions', setCustomPrecaution)}
              >
                추가
              </Button>
            </div>
          </div>

          {/* 필요한 PPE */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">필요한 보호구 (PPE)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              {commonPPE.map((ppe) => (
                <button
                  key={ppe}
                  type="button"
                  onClick={() => handleArrayToggle(safetyData.requiredPPE, ppe, 'requiredPPE')}
                  className={`p-2 rounded-notion-sm border text-sm transition-all ${
                    safetyData.requiredPPE.includes(ppe)
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border bg-background hover:border-border-hover'
                  }`}
                >
                  {ppe}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPPE}
                onChange={(e) => setCustomPPE(e.target.value)}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none text-sm"
                placeholder="기타 보호구 추가"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customPPE, 'requiredPPE', setCustomPPE)}
              >
                추가
              </Button>
            </div>
          </div>
        </div>

        {/* 자재 및 도구 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">필요 자재 및 도구</h3>
            <Button type="button" size="sm" onClick={addMaterial}>
              <span className="mr-1">➕</span>
              자재 추가
            </Button>
          </div>

          {materials.length > 0 ? (
            <div className="space-y-3">
              {materials.map((material, index) => (
                <div key={index} className="flex gap-3 items-center p-3 bg-background rounded-notion-sm">
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 rounded border border-border bg-background-secondary text-sm"
                    placeholder="자재명"
                  />
                  <input
                    type="number"
                    value={material.quantity}
                    onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value))}
                    className="w-20 px-3 py-2 rounded border border-border bg-background-secondary text-sm"
                    min="1"
                  />
                  <input
                    type="text"
                    value={material.unit}
                    onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                    className="w-16 px-3 py-2 rounded border border-border bg-background-secondary text-sm"
                    placeholder="단위"
                  />
                  <input
                    type="number"
                    value={material.cost}
                    onChange={(e) => updateMaterial(index, 'cost', parseFloat(e.target.value))}
                    className="w-24 px-3 py-2 rounded border border-border bg-background-secondary text-sm"
                    placeholder="비용"
                    step="0.01"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeMaterial(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <div className="text-4xl mb-2">📦</div>
              <p>필요한 자재나 도구를 추가해보세요</p>
            </div>
          )}
        </div>

        {/* 추가 메모 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">추가 메모</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
            placeholder="추가적인 주의사항이나 특별한 지시사항을 입력하세요..."
          />
        </div>

        {/* 폼 버튼 */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-sm text-text-secondary">
            <span className="text-error-text">*</span> 필수 입력 항목
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : (mode === 'create' ? '작업 생성' : '변경 저장')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}