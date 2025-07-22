"use client"

import { useState } from "react"
import { MaintenanceCategory } from "@/lib/types/facility"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"

interface MaintenanceFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  equipmentList?: Array<{ id: string; name: string; code: string }>
  staffList?: Array<{ id: string; name: string; role: string }>
}

const categories: { value: MaintenanceCategory; label: string; icon: string }[] = [
  { value: 'Electrical', label: '전기', icon: '⚡' },
  { value: 'HVAC', label: 'HVAC', icon: '🌡️' },
  { value: 'Plumbing', label: '배관', icon: '🚰' },
  { value: 'Fire Safety', label: '소방안전', icon: '🔥' },
  { value: 'Security', label: '보안', icon: '🔒' },
  { value: 'Structural', label: '구조물', icon: '🏗️' },
  { value: 'Equipment', label: '장비', icon: '⚙️' },
  { value: 'Cleaning', label: '청소', icon: '🧹' },
  { value: 'Preventive', label: '예방정비', icon: '🔧' },
  { value: 'Corrective', label: '수정정비', icon: '🔨' },
  { value: 'Emergency', label: '긴급정비', icon: '🆘' },
  { value: 'Inspection', label: '점검', icon: '🔍' },
  { value: 'Calibration', label: '교정', icon: '📊' },
  { value: 'Software Update', label: '소프트웨어 업데이트', icon: '💻' },
  { value: 'Safety Check', label: '안전점검', icon: '✅' }
]

const frequencies = [
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'biweekly', label: '격주' },
  { value: 'monthly', label: '매월' },
  { value: 'quarterly', label: '분기별' },
  { value: 'semiannual', label: '반기별' },
  { value: 'annual', label: '연간' },
  { value: 'as_needed', label: '필요시' }
]

const priorities = [
  { value: 'low', label: '낮음', color: 'text-success-text bg-success-bg' },
  { value: 'medium', label: '보통', color: 'text-warning-text bg-warning-bg' },
  { value: 'high', label: '높음', color: 'text-error-text bg-error-bg' },
  { value: 'critical', label: '긴급', color: 'text-white bg-red-600' }
]

export function MaintenanceForm({
  initialData,
  onSubmit,
  onCancel,
  equipmentList = [],
  staffList = []
}: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'Preventive',
    priority: initialData?.priority || 'medium',
    description: initialData?.description || '',
    location: initialData?.location || '',
    equipmentId: initialData?.equipmentId || '',
    assignedToId: initialData?.assignedToId || '',
    dueDate: initialData?.dueDate || '',
    frequency: initialData?.frequency || 'monthly',
    estimatedDuration: initialData?.estimatedDuration || 60,
    cost: initialData?.cost || 0,
    safetyPrecautions: initialData?.safetyPrecautions || [''],
    requiredTools: initialData?.requiredTools || [''],
    checklist: initialData?.checklist || [{ item: '', notes: '' }],
    tags: initialData?.tags || ['']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 빈 배열 항목 제거
    const cleanedData = {
      ...formData,
      safetyPrecautions: formData.safetyPrecautions.filter(item => item.trim()),
      requiredTools: formData.requiredTools.filter(item => item.trim()),
      checklist: formData.checklist.filter(item => item.item.trim()),
      tags: formData.tags.filter(item => item.trim())
    }
    
    onSubmit(cleanedData)
  }

  const handleArrayAdd = (field: keyof typeof formData) => {
    const currentArray = formData[field] as any[]
    if (field === 'checklist') {
      setFormData({ ...formData, [field]: [...currentArray, { item: '', notes: '' }] })
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

  const selectedCategory = categories.find(c => c.value === formData.category)
  const selectedPriority = priorities.find(p => p.value === formData.priority)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">기본 정보</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              작업명 <span className="text-error-text">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              placeholder="정기 안전 점검"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              카테고리 <span className="text-error-text">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as MaintenanceCategory })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              required
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <div className="mt-2">
                <Badge variant="secondary">
                  <span className="mr-1">{selectedCategory.icon}</span>
                  {selectedCategory.label}
                </Badge>
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
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              placeholder="생산동 2층"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              관련 장비
            </label>
            <select
              value={formData.equipmentId}
              onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
            >
              <option value="">선택하세요</option>
              {equipmentList.map((equipment) => (
                <option key={equipment.id} value={equipment.id}>
                  {equipment.name} (#{equipment.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              담당자 <span className="text-error-text">*</span>
            </label>
            <select
              value={formData.assignedToId}
              onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              required
            >
              <option value="">선택하세요</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} ({staff.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              마감일 <span className="text-error-text">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              주기
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
            >
              {frequencies.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
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

      {/* 작업 상세 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">작업 상세</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              예상 소요시간 (분)
            </label>
            <input
              type="number"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              min="0"
              step="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              예상 비용
            </label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
              min="0"
              step="1000"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* 안전 주의사항 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">안전 주의사항</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('safetyPrecautions')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.safetyPrecautions.map((precaution, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-warning-text">⚠️</span>
              <input
                type="text"
                value={precaution}
                onChange={(e) => handleArrayChange('safetyPrecautions', index, e.target.value)}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="안전 주의사항을 입력하세요"
              />
              {formData.safetyPrecautions.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleArrayRemove('safetyPrecautions', index)}
                >
                  삭제
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 필요 도구 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">필요 도구</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('requiredTools')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.requiredTools.map((tool, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>🔧</span>
              <input
                type="text"
                value={tool}
                onChange={(e) => handleArrayChange('requiredTools', index, e.target.value)}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="도구명을 입력하세요"
              />
              {formData.requiredTools.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleArrayRemove('requiredTools', index)}
                >
                  삭제
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 체크리스트 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">체크리스트</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('checklist')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="space-y-3">
          {formData.checklist.map((item, index) => (
            <div key={index} className="p-3 bg-background rounded-notion-sm border border-border">
              <div className="flex items-start gap-2">
                <span className="mt-2">☐</span>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleArrayChange('checklist', index, { ...item, item: e.target.value })}
                    className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none"
                    placeholder="체크리스트 항목"
                  />
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => handleArrayChange('checklist', index, { ...item, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background-secondary focus:border-border-focus focus:outline-none text-sm"
                    placeholder="참고사항 (선택)"
                  />
                </div>
                {formData.checklist.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleArrayRemove('checklist', index)}
                  >
                    삭제
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 태그 */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">태그</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleArrayAdd('tags')}
          >
            <span className="mr-1">➕</span>
            추가
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-1">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                className="px-3 py-1 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none text-sm"
                placeholder="태그"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleArrayRemove('tags', index)}
                  className="text-error-text hover:text-error text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
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
          {initialData ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  )
}