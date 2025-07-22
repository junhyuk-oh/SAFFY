"use client"

import { useState, useEffect } from "react"
import { CreateMaintenanceTaskRequest, UpdateMaintenanceTaskRequest, MaintenanceTask, MaintenanceCategory, FacilityArea, Priority } from "@/lib/types/facility"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/display"

interface MaintenanceFormProps {
  task?: MaintenanceTask // ?˜ì • ??ê¸°ì¡´ ?‘ì—… ?°ì´??
  onSubmit: (data: CreateMaintenanceTaskRequest | UpdateMaintenanceTaskRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: 'create' | 'edit'
}

const categories: { value: MaintenanceCategory; label: string; icon: string }[] = [
  { value: 'Electrical', label: '?„ê¸°', icon: '?? },
  { value: 'HVAC', label: 'HVAC', icon: '?Œ¡ï¸? },
  { value: 'Plumbing', label: 'ë°°ê?', icon: '?”§' },
  { value: 'Fire Safety', label: '?”ì¬?ˆì „', icon: '?”¥' },
  { value: 'Security', label: 'ë³´ì•ˆ', icon: '?›¡ï¸? },
  { value: 'Structural', label: 'êµ¬ì¡°', icon: '?—ï¸? },
  { value: 'Equipment', label: '?¥ë¹„', icon: '?™ï¸' },
  { value: 'Cleaning', label: 'ì²?†Œ', icon: '?§¹' },
  { value: 'Preventive', label: '?ˆë°©?•ë¹„', icon: '?”„' },
  { value: 'Corrective', label: 'êµì •?•ë¹„', icon: '?”§' },
  { value: 'Emergency', label: '?‘ê¸‰', icon: '?š¨' },
  { value: 'Inspection', label: '?ê?', icon: '?”' },
  { value: 'Calibration', label: 'êµì •', icon: '?“' },
  { value: 'Software Update', label: '?Œí”„?¸ì›¨???…ë°?´íŠ¸', icon: '?’»' },
  { value: 'Safety Check', label: '?ˆì „?ê?', icon: '?? }
]

const locations: { value: FacilityArea; label: string }[] = [
  { value: 'Production Floor', label: '?ì‚°ì¸? },
  { value: 'Lab Building', label: '?¤í—˜?? },
  { value: 'Warehouse', label: 'ì°½ê³ ' },
  { value: 'Office Building', label: '?¬ë¬´?? },
  { value: 'Utility Room', label: '? í‹¸ë¦¬í‹°ë£? },
  { value: 'Chemical Storage', label: '?”í•™ë¬¼ì§ˆ ?€?¥ì†Œ' },
  { value: 'Electrical Room', label: '?„ê¸°?? },
  { value: 'HVAC Room', label: 'HVAC?? },
  { value: 'Emergency Exit', label: 'ë¹„ìƒêµ? },
  { value: 'Parking Area', label: 'ì£¼ì°¨?? },
  { value: 'Loading Dock', label: '?˜ì—­?? },
  { value: 'Server Room', label: '?œë²„?? }
]

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: '??Œ', color: 'text-success-text bg-success-bg' },
  { value: 'medium', label: 'ë³´í†µ', color: 'text-warning-text bg-warning-bg' },
  { value: 'high', label: '?’ìŒ', color: 'text-error-text bg-error-bg' },
  { value: 'critical', label: 'ê¸´ê¸‰', color: 'text-white bg-red-600' }
]

const commonHazards = [
  '?„ê¸° ?„í—˜', '?”í•™ë¬¼ì§ˆ ?¸ì¶œ', '?’ì? ê³??‘ì—…', 'ë°€?ê³µê°?, '?”ì¬ ?„í—˜',
  'ê¸°ê³„ ?„í—˜', '?ŒìŒ', 'ì§„ë™', 'ê³ ì˜¨', '?€??, 'ë°©ì‚¬??, '?ë¬¼?™ì  ?„í—˜'
]

const commonPPE = [
  '?ˆì „ëª?, '?ˆì „??, 'ë³´ì•ˆê²?, '?¥ê°‘', 'ë°˜ì‚¬ì¡°ë¼', '?¸í¡ë³´í˜¸êµ?,
  'ê·€ë§ˆê°œ', '?ˆì „ë²¨íŠ¸', '?”í•™ë³?, '?ˆì—°?¥ê°‘', '?©ì ‘ë§ˆìŠ¤??
]

const commonPrecautions = [
  'LOTO ?ˆì°¨ ?˜í–‰', 'ê°€??ì¸¡ì •', '?˜ê¸° ?•ì¸', '?”ê¸° ê¸ˆì?', '?‘ê·¼ ?µì œ',
  '?‘ê¸‰?°ë½ì²??•ì¸', '?‘ì—…?„êµ¬ ?ê?', '? ì”¨ ì¡°ê±´ ?•ì¸'
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

  // ê¸°ì¡´ ?‘ì—… ?°ì´?°ë¡œ ??ì´ˆê¸°??
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
    setMaterials(prev => [...prev, { name: '', quantity: 1, unit: 'ê°?, cost: 0 }])
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
        {/* ?¤ë” */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {mode === 'create' ? '??? ì?ë³´ìˆ˜ ?‘ì—…' : '?‘ì—… ?˜ì •'}
            </h2>
            <p className="text-text-secondary mt-1">
              {mode === 'create' ? '?ˆë¡œ??? ì?ë³´ìˆ˜ ?‘ì—…???±ë¡?©ë‹ˆ?? : 'ê¸°ì¡´ ?‘ì—…???•ë³´ë¥??˜ì •?©ë‹ˆ??}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              ì·¨ì†Œ
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '?€??ì¤?..' : (mode === 'create' ? '?‘ì—… ?ì„±' : 'ë³€ê²??€??)}
            </Button>
          </div>
        </div>

        {/* ê¸°ë³¸ ?•ë³´ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">ê¸°ë³¸ ?•ë³´</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?‘ì—… ?œëª© <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="?? ?Œí”„ P-101 ?•ê¸°?ê?"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">?¤ëª…</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
                placeholder="?‘ì—…???€???ì„¸???¤ëª…???…ë ¥?˜ì„¸??.."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ì¹´í…Œê³ ë¦¬ <span className="text-error-text">*</span>
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
                ?°ì„ ?œìœ„ <span className="text-error-text">*</span>
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

        {/* ?„ì¹˜ ë°??¼ì • */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?„ì¹˜ ë°??¼ì •</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?„ì¹˜ <span className="text-error-text">*</span>
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
              <label className="block text-sm font-medium text-text-primary mb-2">?ì„¸ ?„ì¹˜</label>
              <input
                type="text"
                value={formData.subLocation}
                onChange={(e) => handleInputChange('subLocation', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="?? 2ì¸??™ìª½ êµ¬ì—­"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?ˆì •??<span className="text-error-text">*</span>
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
                ë§ˆê°??<span className="text-error-text">*</span>
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
                ?ˆìƒ ?Œìš”?œê°„ (ë¶?
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
              <label className="block text-sm font-medium text-text-primary mb-2">?‘ì—…ì§€?œì„œ ë²ˆí˜¸</label>
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

        {/* ?ˆì „ ?•ë³´ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?ˆì „ ?•ë³´</h3>

          {/* ?ˆì „ ?µì…˜ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safetyData.lockoutTagout}
                onChange={(e) => handleSafetyChange('lockoutTagout', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                ?”’ LOTO (? ê¸ˆ?œì‹œ) ?„ìš”
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
                ?“‹ ?‘ì—…?ˆê????„ìš”
              </span>
            </label>
          </div>

          {/* ?„í—˜?”ì†Œ */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?„í—˜?”ì†Œ</label>
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
                placeholder="ê¸°í? ?„í—˜?”ì†Œ ì¶”ê?"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customHazard, 'hazards', setCustomHazard)}
              >
                ì¶”ê?
              </Button>
            </div>
          </div>

          {/* ?ˆë°©ì¡°ì¹˜ */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?ˆë°©ì¡°ì¹˜</label>
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
                placeholder="ê¸°í? ?ˆë°©ì¡°ì¹˜ ì¶”ê?"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customPrecaution, 'precautions', setCustomPrecaution)}
              >
                ì¶”ê?
              </Button>
            </div>
          </div>

          {/* ?„ìš”??PPE */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?„ìš”??ë³´í˜¸êµ?(PPE)</label>
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
                placeholder="ê¸°í? ë³´í˜¸êµ?ì¶”ê?"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addCustomItem(customPPE, 'requiredPPE', setCustomPPE)}
              >
                ì¶”ê?
              </Button>
            </div>
          </div>
        </div>

        {/* ?ì¬ ë°??„êµ¬ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">?„ìš” ?ì¬ ë°??„êµ¬</h3>
            <Button type="button" size="sm" onClick={addMaterial}>
              <span className="mr-1">??/span>
              ?ì¬ ì¶”ê?
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
                    placeholder="?ì¬ëª?
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
                    placeholder="?¨ìœ„"
                  />
                  <input
                    type="number"
                    value={material.cost}
                    onChange={(e) => updateMaterial(index, 'cost', parseFloat(e.target.value))}
                    className="w-24 px-3 py-2 rounded border border-border bg-background-secondary text-sm"
                    placeholder="ë¹„ìš©"
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
              <div className="text-4xl mb-2">?“¦</div>
              <p>?„ìš”???ì¬???„êµ¬ë¥?ì¶”ê??´ë³´?¸ìš”</p>
            </div>
          )}
        </div>

        {/* ì¶”ê? ë©”ëª¨ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">ì¶”ê? ë©”ëª¨</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
            placeholder="ì¶”ê??ì¸ ì£¼ì˜?¬í•­?´ë‚˜ ?¹ë³„??ì§€?œì‚¬??„ ?…ë ¥?˜ì„¸??.."
          />
        </div>

        {/* ??ë²„íŠ¼ */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-sm text-text-secondary">
            <span className="text-error-text">*</span> ?„ìˆ˜ ?…ë ¥ ??ª©
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              ì·¨ì†Œ
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '?€??ì¤?..' : (mode === 'create' ? '?‘ì—… ?ì„±' : 'ë³€ê²??€??)}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}