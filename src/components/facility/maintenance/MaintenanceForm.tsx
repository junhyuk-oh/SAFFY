"use client"

import { useState, useEffect } from "react"
import { CreateMaintenanceTaskRequest, UpdateMaintenanceTaskRequest, MaintenanceTask, MaintenanceCategory, FacilityArea, Priority } from "@/lib/types/facility"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"

interface MaintenanceFormProps {
  task?: MaintenanceTask // ?�정 ??기존 ?�업 ?�이??
  onSubmit: (data: CreateMaintenanceTaskRequest | UpdateMaintenanceTaskRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: 'create' | 'edit'
}

const categories: { value: MaintenanceCategory; label: string; icon: string }[] = [
  { value: 'Electrical', label: '?�기', icon: '?? },
  { value: 'HVAC', label: 'HVAC', icon: '?���? },
  { value: 'Plumbing', label: '배�?', icon: '?��' },
  { value: 'Fire Safety', label: '?�재?�전', icon: '?��' },
  { value: 'Security', label: '보안', icon: '?���? },
  { value: 'Structural', label: '구조', icon: '?���? },
  { value: 'Equipment', label: '?�비', icon: '?�️' },
  { value: 'Cleaning', label: '�?��', icon: '?��' },
  { value: 'Preventive', label: '?�방?�비', icon: '?��' },
  { value: 'Corrective', label: '교정?�비', icon: '?��' },
  { value: 'Emergency', label: '?�급', icon: '?��' },
  { value: 'Inspection', label: '?��?', icon: '?��' },
  { value: 'Calibration', label: '교정', icon: '?��' },
  { value: 'Software Update', label: '?�프?�웨???�데?�트', icon: '?��' },
  { value: 'Safety Check', label: '?�전?��?', icon: '?? }
]

const locations: { value: FacilityArea; label: string }[] = [
  { value: 'Production Floor', label: '?�산�? },
  { value: 'Lab Building', label: '?�험?? },
  { value: 'Warehouse', label: '창고' },
  { value: 'Office Building', label: '?�무?? },
  { value: 'Utility Room', label: '?�틸리티�? },
  { value: 'Chemical Storage', label: '?�학물질 ?�?�소' },
  { value: 'Electrical Room', label: '?�기?? },
  { value: 'HVAC Room', label: 'HVAC?? },
  { value: 'Emergency Exit', label: '비상�? },
  { value: 'Parking Area', label: '주차?? },
  { value: 'Loading Dock', label: '?�역?? },
  { value: 'Server Room', label: '?�버?? }
]

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: '??��', color: 'text-success-text bg-success-bg' },
  { value: 'medium', label: '보통', color: 'text-warning-text bg-warning-bg' },
  { value: 'high', label: '?�음', color: 'text-error-text bg-error-bg' },
  { value: 'critical', label: '긴급', color: 'text-white bg-red-600' }
]

const commonHazards = [
  '?�기 ?�험', '?�학물질 ?�출', '?��? �??�업', '밀?�공�?, '?�재 ?�험',
  '기계 ?�험', '?�음', '진동', '고온', '?�??, '방사??, '?�물?�적 ?�험'
]

const commonPPE = [
  '?�전�?, '?�전??, '보안�?, '?�갑', '반사조끼', '?�흡보호�?,
  '귀마개', '?�전벨트', '?�학�?, '?�연?�갑', '?�접마스??
]

const commonPrecautions = [
  'LOTO ?�차 ?�행', '가??측정', '?�기 ?�인', '?�기 금�?', '?�근 ?�제',
  '?�급?�락�??�인', '?�업?�구 ?��?', '?�씨 조건 ?�인'
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

  // 기존 ?�업 ?�이?�로 ??초기??
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
    setMaterials(prev => [...prev, { name: '', quantity: 1, unit: '�?, cost: 0 }])
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
        {/* ?�더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {mode === 'create' ? '???��?보수 ?�업' : '?�업 ?�정'}
            </h2>
            <p className="text-text-secondary mt-1">
              {mode === 'create' ? '?�로???��?보수 ?�업???�록?�니?? : '기존 ?�업???�보�??�정?�니??}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '?�??�?..' : (mode === 'create' ? '?�업 ?�성' : '변�??�??)}
            </Button>
          </div>
        </div>

        {/* 기본 ?�보 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">기본 ?�보</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�업 ?�목 <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="?? ?�프 P-101 ?�기?��?"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">?�명</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
                placeholder="?�업???�???�세???�명???�력?�세??.."
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
                ?�선?�위 <span className="text-error-text">*</span>
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

        {/* ?�치 �??�정 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?�치 �??�정</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�치 <span className="text-error-text">*</span>
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
              <label className="block text-sm font-medium text-text-primary mb-2">?�세 ?�치</label>
              <input
                type="text"
                value={formData.subLocation}
                onChange={(e) => handleInputChange('subLocation', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="?? 2�??�쪽 구역"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�정??<span className="text-error-text">*</span>
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
                마감??<span className="text-error-text">*</span>
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
                ?�상 ?�요?�간 (�?
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
              <label className="block text-sm font-medium text-text-primary mb-2">?�업지?�서 번호</label>
              <input
                type="text"
                value={formData.workOrder}
                onChange={(e) => handleInputChange('workOrder', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="?? WO-2024-001"
              />
            </div>
          </div>
        </div>

        {/* ?�전 ?�보 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?�전 ?�보</h3>

          {/* ?�전 ?�션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safetyData.lockoutTagout}
                onChange={(e) => handleSafetyChange('lockoutTagout', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                ?�� LOTO (?�금?�시) ?�요
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
                ?�� ?�업?��????�요
              </span>
            </label>
          </div>

          {/* ?�험?�소 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?�험?�소</label>
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
                placeholder="기�? ?�험?�소 추�?"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customHazard, 'hazards', setCustomHazard)}
              >
                추�?
              </Button>
            </div>
          </div>

          {/* ?�방조치 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?�방조치</label>
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
                placeholder="기�? ?�방조치 추�?"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customPrecaution, 'precautions', setCustomPrecaution)}
              >
                추�?
              </Button>
            </div>
          </div>

          {/* ?�요??PPE */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?�요??보호�?(PPE)</label>
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
                placeholder="기�? 보호�?추�?"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customPPE, 'requiredPPE', setCustomPPE)}
              >
                추�?
              </Button>
            </div>
          </div>
        </div>

        {/* ?�재 �??�구 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">?�요 ?�재 �??�구</h3>
            <Button type="button" size="sm" onClick={addMaterial}>
              <span className="mr-1">??/span>
              ?�재 추�?
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
                    placeholder="?�재�?
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
                    placeholder="?�위"
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
                    ??
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <div className="text-4xl mb-2">?��</div>
              <p>?�요???�재???�구�?추�??�보?�요</p>
            </div>
          )}
        </div>

        {/* 추�? 메모 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">추�? 메모</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
            placeholder="추�??�인 주의?�항?�나 ?�별??지?�사??�� ?�력?�세??.."
          />
        </div>

        {/* ??버튼 */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-sm text-text-secondary">
            <span className="text-error-text">*</span> ?�수 ?�력 ??��
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '?�??�?..' : (mode === 'create' ? '?�업 ?�성' : '변�??�??)}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}