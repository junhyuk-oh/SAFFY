"use client"

import { useState, useEffect } from "react"
import { CreateWorkPermitRequest, UpdateWorkPermitRequest, WorkPermit, PermitType, FacilityArea, Priority } from "@/lib/types/facility"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"

interface PermitFormProps {
  permit?: WorkPermit // ?�정 ??기존 ?��????�이??
  onSubmit: (data: CreateWorkPermitRequest | UpdateWorkPermitRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: 'create' | 'edit'
}

const permitTypes: { value: PermitType; label: string; icon: string; description: string }[] = [
  { value: 'Hot Work', label: '?�기?�업', icon: '?��', description: '?�접, ?�단, ?�삭 ?? },
  { value: 'Confined Space', label: '밀?�공�?, icon: '?���?, description: '?�크, 관�? ?�?�고 ?? },
  { value: 'Electrical Work', label: '?�기?�업', icon: '??, description: '?�기?�비 ?�치 �??�리' },
  { value: 'Chemical Work', label: '?�학?�업', icon: '?��', description: '?�학물질 취급 ?�업' },
  { value: 'Height Work', label: '고소?�업', icon: '?���?, description: '2m ?�상 ?�이 ?�업' },
  { value: 'Excavation', label: '굴착?�업', icon: '?�️', description: '???�기 �?굴착' },
  { value: 'Welding', label: '?�접?�업', icon: '?��', description: '각종 ?�접 ?�업' },
  { value: 'Cutting', label: '?�단?�업', icon: '?�️', description: '금속 �??�료 ?�단' },
  { value: 'Radiation Work', label: '방사?�작??, icon: '??��', description: '방사??물질 취급' },
  { value: 'Crane Operation', label: '?�레?�작??, icon: '?���?, description: '?�레??�?중장�??�업' },
  { value: 'Shutdown Work', label: '?��??�업', icon: '?��', description: '?�비 ?��? ???�업' },
  { value: 'Emergency Work', label: '?�급?�업', icon: '?��', description: '긴급 ?�리 ?�업' },
  { value: 'Contractor Work', label: '?�주?�업', icon: '?��', description: '?��? ?�체 ?�업' },
  { value: 'Maintenance Work', label: '?�비?�업', icon: '?��', description: '?�반 ?�비 ?�업' },
  { value: 'Construction Work', label: '건설?�업', icon: '?���?, description: '?�축 �?개조 ?�업' }
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
  '?�재/??�� ?�험', '?�기 감전', '?�학물질 ?�출', '질식 ?�험', '?�하 ?�험',
  '?�임 ?�험', '?�상 ?�험', '중독 ?�험', '방사???�출', '?�음/진동',
  '고온/?�??, '?�력 ?�험', '?�물?�적 ?�험', '구조�?붕괴'
]

const commonPPE = [
  '?�전�?, '?�전??, '보안�?, '?�갑', '반사조끼', '?�흡보호�?,
  '귀마개', '?�전벨트', '?�학�?, '?�연?�갑', '?�접마스??, '방독�?,
  '?�화�?, '?�연??, '?�전?�', '구명조끼'
]

const commonTraining = [
  '?�반 ?�전교육', '?�기?�업 교육', '밀?�공�?교육', '?�기?�전 교육',
  '?�학물질 취급 교육', '고소?�업 교육', '?�레??조작 교육',
  '?�급처치 교육', '?�방?�전 교육', '방사???�전교육'
]

const commonEquipment = [
  '가?�탐지�?, '?�기??, '조명?�비', '?�신?�비', '?�화�?, '비상기구??,
  '구급?�자', '?�전로프', '?�다�?, '비계', '?�레??, '?�접�?,
  '?�단�?, '측정?�비', '보호?�구'
]

export function PermitForm({
  permit,
  onSubmit,
  onCancel,
  loading = false,
  mode
}: PermitFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Hot Work' as PermitType,
    priority: 'medium' as Priority,
    location: 'Production Floor' as FacilityArea,
    subLocation: '',
    startDate: '',
    endDate: '',
    estimatedDuration: 8,
    workDescription: '',
    notes: ''
  })

  const [requestedBy, setRequestedBy] = useState({
    userId: '',
    name: '',
    department: '',
    contact: ''
  })

  const [contractor, setContractor] = useState({
    hasContractor: false,
    companyName: '',
    contactPerson: '',
    contact: '',
    license: '',
    insurance: false,
    insuranceExpiry: ''
  })

  const [hazards, setHazards] = useState({
    identified: [] as string[],
    riskLevel: 'medium' as Priority,
    mitigation: [] as string[]
  })

  const [safety, setSafety] = useState({
    requiredTraining: [] as string[],
    requiredPPE: [] as string[],
    emergencyProcedure: '',
    fireWatchRequired: false,
    gasTestRequired: false,
    isolationRequired: false,
    escapeRoutes: [] as string[]
  })

  const [environmental, setEnvironmental] = useState({
    noiseLevel: '',
    dustControl: '',
    wasteDisposal: '',
    chemicalsUsed: [] as Array<{
      name: string
      quantity: string
      msdsAvailable: boolean
    }>
  })

  const [equipment, setEquipment] = useState({
    required: [] as string[],
    inspectionDate: '',
    certificationValid: false
  })

  const [communication, setCommunication] = useState({
    affectedAreas: [] as string[],
    contactPerson: '',
    emergencyContact: ''
  })

  const [customInputs, setCustomInputs] = useState({
    hazard: '',
    ppe: '',
    training: '',
    equipment: '',
    mitigation: '',
    escapeRoute: '',
    chemical: { name: '', quantity: '', msdsAvailable: false }
  })

  // 기존 ?��????�이?�로 ??초기??
  useEffect(() => {
    if (permit && mode === 'edit') {
      setFormData({
        title: permit.title,
        description: permit.description,
        type: permit.type,
        priority: permit.priority,
        location: permit.location,
        subLocation: permit.subLocation || '',
        startDate: new Date(permit.startDate).toISOString().slice(0, 16),
        endDate: new Date(permit.endDate).toISOString().slice(0, 16),
        estimatedDuration: permit.estimatedDuration,
        workDescription: permit.workDescription,
        notes: permit.notes || ''
      })

      setRequestedBy(permit.requestedBy)

      if (permit.contractor) {
        setContractor({
          hasContractor: true,
          ...permit.contractor
        })
      }

      setHazards(permit.hazards)
      setSafety(permit.safety)
      
      if (permit.environmental) {
        setEnvironmental({
          noiseLevel: permit.environmental.noiseLevel || '',
          dustControl: permit.environmental.dustControl || '',
          wasteDisposal: permit.environmental.wasteDisposal || '',
          chemicalsUsed: permit.environmental.chemicalsUsed || []
        })
      }

      setEquipment(permit.equipment)
      setCommunication(permit.communication)
    }
  }, [permit, mode])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (array: string[], item: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
    setter((prev: any) => ({ ...prev, [Array.isArray(prev) ? 'length' : Object.keys(prev).find(key => Array.isArray(prev[key]))!]: newArray }))
  }

  const addCustomItem = (item: string, field: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    if (item.trim()) {
      setter((prev: any) => ({
        ...prev,
        [field]: [...(prev[field] || []), item.trim()]
      }))
    }
  }

  const addChemical = () => {
    if (customInputs.chemical.name.trim()) {
      setEnvironmental(prev => ({
        ...prev,
        chemicalsUsed: [...prev.chemicalsUsed, { ...customInputs.chemical }]
      }))
      setCustomInputs(prev => ({
        ...prev,
        chemical: { name: '', quantity: '', msdsAvailable: false }
      }))
    }
  }

  const removeChemical = (index: number) => {
    setEnvironmental(prev => ({
      ...prev,
      chemicalsUsed: prev.chemicalsUsed.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const submitData: CreateWorkPermitRequest | UpdateWorkPermitRequest = mode === 'create' ? {
        ...formData,
        requestedBy,
        contractor: contractor.hasContractor ? {
          companyName: contractor.companyName,
          contactPerson: contractor.contactPerson,
          contact: contractor.contact,
          license: contractor.license,
          insurance: contractor.insurance,
          insuranceExpiry: contractor.insuranceExpiry || undefined
        } : undefined,
        hazards,
        safety,
        environmental,
        equipment,
        communication,
        attachments: []
      } : {
        id: permit!.id,
        updates: {
          ...formData,
          requestedBy,
          contractor: contractor.hasContractor ? {
            companyName: contractor.companyName,
            contactPerson: contractor.contactPerson,
            contact: contractor.contact,
            license: contractor.license,
            insurance: contractor.insurance,
            insuranceExpiry: contractor.insuranceExpiry || undefined
          } : undefined,
          hazards,
          safety,
          environmental,
          equipment,
          communication
        }
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const selectedType = permitTypes.find(t => t.value === formData.type)
  const selectedPriority = priorities.find(p => p.value === formData.priority)

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ?�더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {mode === 'create' ? '???�업?��??? : '?��????�정'}
            </h2>
            <p className="text-text-secondary mt-1">
              {mode === 'create' ? '?�로???�업?��??��? ?�청?�니?? : '기존 ?��??�의 ?�보�??�정?�니??}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '?�??�?..' : (mode === 'create' ? '?��????�청' : '변�??�??)}
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
                placeholder="?? 보일??#1 ?�기?��????�한 ?�기?�업"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">?�업 ?�명</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
                placeholder="?�업???�??개요�??�력?�세??.."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">?�세 ?�업 ?�용</label>
              <textarea
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
                placeholder="구체?�인 ?�업 ?�용�??�차�??�세??기술?�세??.."
              />
            </div>
          </div>
        </div>

        {/* ?�업 ?�형 �??�선?�위 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?�업 ?�형 �??�선?�위</h3>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              ?�업 ?�형 <span className="text-error-text">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {permitTypes.slice(0, 8).map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`p-4 rounded-notion-md border text-center transition-all ${
                    formData.type === type.value
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border bg-background hover:border-border-hover'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium mb-1">{type.label}</div>
                  <div className="text-xs text-text-secondary">{type.description}</div>
                </button>
              ))}
            </div>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background"
              required
            >
              {permitTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              ?�선?�위 <span className="text-error-text">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handleInputChange('priority', priority.value)}
                  className={`p-4 rounded-notion-md border text-center transition-all ${
                    formData.priority === priority.value
                      ? 'border-primary bg-primary-light'
                      : 'border-border bg-background hover:border-border-hover'
                  }`}
                >
                  <Badge className={priority.color}>{priority.label}</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ?�치 �??�정 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?�치 �??�정</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�업 ?�치 <span className="text-error-text">*</span>
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
                placeholder="?? A??2�??�쪽 구역"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�업 ?�작?�시 <span className="text-error-text">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�업 ?�료?�시 <span className="text-error-text">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�상 ?�업?�간 (?�간)
              </label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                min="1"
                max="168"
              />
            </div>
          </div>
        </div>

        {/* ?�청???�보 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?�청???�보</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�청???�름 <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                value={requestedBy.name}
                onChange={(e) => setRequestedBy(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                부??<span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                value={requestedBy.department}
                onChange={(e) => setRequestedBy(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�락�?<span className="text-error-text">*</span>
              </label>
              <input
                type="tel"
                value={requestedBy.contact}
                onChange={(e) => setRequestedBy(prev => ({ ...prev, contact: e.target.value }))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="010-1234-5678"
                required
              />
            </div>
          </div>
        </div>

        {/* ?�주?�체 ?�보 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-text-primary">?�주?�체 ?�보</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contractor.hasContractor}
                onChange={(e) => setContractor(prev => ({ ...prev, hasContractor: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm text-text-secondary">?�주?�체 ?�업</span>
            </label>
          </div>

          {contractor.hasContractor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?�체�?<span className="text-error-text">*</span>
                </label>
                <input
                  type="text"
                  value={contractor.companyName}
                  onChange={(e) => setContractor(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                  required={contractor.hasContractor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?�당??<span className="text-error-text">*</span>
                </label>
                <input
                  type="text"
                  value={contractor.contactPerson}
                  onChange={(e) => setContractor(prev => ({ ...prev, contactPerson: e.target.value }))}
                  className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                  required={contractor.hasContractor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?�락�?<span className="text-error-text">*</span>
                </label>
                <input
                  type="tel"
                  value={contractor.contact}
                  onChange={(e) => setContractor(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                  required={contractor.hasContractor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">면허번호</label>
                <input
                  type="text"
                  value={contractor.license}
                  onChange={(e) => setContractor(prev => ({ ...prev, license: e.target.value }))}
                  className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={contractor.insurance}
                    onChange={(e) => setContractor(prev => ({ ...prev, insurance: e.target.checked }))}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-text-primary">보험 가??/span>
                </label>
                
                {contractor.insurance && (
                  <div className="flex-1">
                    <input
                      type="date"
                      value={contractor.insuranceExpiry}
                      onChange={(e) => setContractor(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                      className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background text-sm"
                      placeholder="보험 만료??
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ?�험?�소 �??�전조치 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">?�험?�소 �??�전조치</h3>

          {/* ?�험?�소 ?�별 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?�별???�험?�소</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {commonHazards.map((hazard) => (
                <button
                  key={hazard}
                  type="button"
                  onClick={() => {
                    const newHazards = hazards.identified.includes(hazard)
                      ? hazards.identified.filter(h => h !== hazard)
                      : [...hazards.identified, hazard]
                    setHazards(prev => ({ ...prev, identified: newHazards }))
                  }}
                  className={`p-2 rounded-notion-sm border text-sm transition-all ${
                    hazards.identified.includes(hazard)
                      ? 'border-error bg-error-bg text-error-text'
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
                value={customInputs.hazard}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, hazard: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none text-sm"
                placeholder="기�? ?�험?�소 추�?"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (customInputs.hazard.trim()) {
                    setHazards(prev => ({
                      ...prev,
                      identified: [...prev.identified, customInputs.hazard.trim()]
                    }))
                    setCustomInputs(prev => ({ ...prev, hazard: '' }))
                  }
                }}
              >
                추�?
              </Button>
            </div>
          </div>

          {/* ?�험???��? */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?�험???��?</label>
            <div className="grid grid-cols-4 gap-3">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setHazards(prev => ({ ...prev, riskLevel: priority.value }))}
                  className={`p-3 rounded-notion-sm border text-center transition-all ${
                    hazards.riskLevel === priority.value
                      ? 'border-primary bg-primary-light'
                      : 'border-border bg-background hover:border-border-hover'
                  }`}
                >
                  <Badge className={priority.color}>{priority.label}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* ?��?방안 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?�험 ?��?방안</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customInputs.mitigation}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, mitigation: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none text-sm"
                placeholder="?��?방안???�력?�세??
              />
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (customInputs.mitigation.trim()) {
                    setHazards(prev => ({
                      ...prev,
                      mitigation: [...prev.mitigation, customInputs.mitigation.trim()]
                    }))
                    setCustomInputs(prev => ({ ...prev, mitigation: '' }))
                  }
                }}
              >
                추�?
              </Button>
            </div>
            {hazards.mitigation.length > 0 && (
              <div className="space-y-2">
                {hazards.mitigation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-success-bg rounded-notion-sm">
                    <span className="text-sm text-success-text">??{item}</span>
                    <button
                      type="button"
                      onClick={() => setHazards(prev => ({
                        ...prev,
                        mitigation: prev.mitigation.filter((_, i) => i !== index)
                      }))}
                      className="text-error-text hover:text-error"
                    >
                      ??
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ?�전 ?�구?�항 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safety.fireWatchRequired}
                onChange={(e) => setSafety(prev => ({ ...prev, fireWatchRequired: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                ?�� ?�재감시???�요
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safety.gasTestRequired}
                onChange={(e) => setSafety(prev => ({ ...prev, gasTestRequired: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                ?�� 가?�측???�요
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safety.isolationRequired}
                onChange={(e) => setSafety(prev => ({ ...prev, isolationRequired: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                ?�� 격리조치 ?�요
              </span>
            </label>
          </div>
        </div>

        {/* ?�요 교육 �?보호�?*/}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">?�요 교육 �?보호�?/h3>

          {/* ?�요??교육 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?�요??교육</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {commonTraining.map((training) => (
                <button
                  key={training}
                  type="button"
                  onClick={() => {
                    const newTraining = safety.requiredTraining.includes(training)
                      ? safety.requiredTraining.filter(t => t !== training)
                      : [...safety.requiredTraining, training]
                    setSafety(prev => ({ ...prev, requiredTraining: newTraining }))
                  }}
                  className={`p-2 rounded-notion-sm border text-sm transition-all ${
                    safety.requiredTraining.includes(training)
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border bg-background hover:border-border-hover'
                  }`}
                >
                  {training}
                </button>
              ))}
            </div>
          </div>

          {/* ?�요??보호�?*/}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?�요??보호�?(PPE)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              {commonPPE.map((ppe) => (
                <button
                  key={ppe}
                  type="button"
                  onClick={() => {
                    const newPPE = safety.requiredPPE.includes(ppe)
                      ? safety.requiredPPE.filter(p => p !== ppe)
                      : [...safety.requiredPPE, ppe]
                    setSafety(prev => ({ ...prev, requiredPPE: newPPE }))
                  }}
                  className={`p-2 rounded-notion-sm border text-sm transition-all ${
                    safety.requiredPPE.includes(ppe)
                      ? 'border-success bg-success-bg text-success-text'
                      : 'border-border bg-background hover:border-border-hover'
                  }`}
                >
                  {ppe}
                </button>
              ))}
            </div>
          </div>

          {/* 비상?�차 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">비상?�차</label>
            <textarea
              value={safety.emergencyProcedure}
              onChange={(e) => setSafety(prev => ({ ...prev, emergencyProcedure: e.target.value }))}
              className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
              placeholder="비상?�황 발생 ???�차�??�세??기술?�세??.."
            />
          </div>
        </div>

        {/* ?�락�?�??�통 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?�락�?�??�통</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?�장 ?�당??<span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                value={communication.contactPerson}
                onChange={(e) => setCommunication(prev => ({ ...prev, contactPerson: e.target.value }))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                비상 ?�락�?<span className="text-error-text">*</span>
              </label>
              <input
                type="tel"
                value={communication.emergencyContact}
                onChange={(e) => setCommunication(prev => ({ ...prev, emergencyContact: e.target.value }))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="119, ?�내 비상?�락�???
                required
              />
            </div>
          </div>
        </div>

        {/* 추�? 메모 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">추�? 메모</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
            placeholder="기�? ?�별 지?�사??��??참고?�항???�력?�세??.."
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
              {loading ? '?�??�?..' : (mode === 'create' ? '?��????�청' : '변�??�??)}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}