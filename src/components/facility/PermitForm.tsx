"use client"

import { useState, useEffect } from "react"
import { CreateWorkPermitRequest, UpdateWorkPermitRequest, WorkPermit, PermitType, FacilityArea, Priority } from "@/lib/types/facility"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PermitFormProps {
  permit?: WorkPermit // 수정 시 기존 허가서 데이터
  onSubmit: (data: CreateWorkPermitRequest | UpdateWorkPermitRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: 'create' | 'edit'
}

const permitTypes: { value: PermitType; label: string; icon: string; description: string }[] = [
  { value: 'Hot Work', label: '화기작업', icon: '🔥', description: '용접, 절단, 연삭 등' },
  { value: 'Confined Space', label: '밀폐공간', icon: '🕳️', description: '탱크, 관로, 저장고 등' },
  { value: 'Electrical Work', label: '전기작업', icon: '⚡', description: '전기설비 설치 및 수리' },
  { value: 'Chemical Work', label: '화학작업', icon: '🧪', description: '화학물질 취급 작업' },
  { value: 'Height Work', label: '고소작업', icon: '🏗️', description: '2m 이상 높이 작업' },
  { value: 'Excavation', label: '굴착작업', icon: '⛏️', description: '땅 파기 및 굴착' },
  { value: 'Welding', label: '용접작업', icon: '🔗', description: '각종 용접 작업' },
  { value: 'Cutting', label: '절단작업', icon: '✂️', description: '금속 및 재료 절단' },
  { value: 'Radiation Work', label: '방사선작업', icon: '☢️', description: '방사선 물질 취급' },
  { value: 'Crane Operation', label: '크레인작업', icon: '🏗️', description: '크레인 및 중장비 작업' },
  { value: 'Shutdown Work', label: '정지작업', icon: '🔧', description: '설비 정지 후 작업' },
  { value: 'Emergency Work', label: '응급작업', icon: '🚨', description: '긴급 수리 작업' },
  { value: 'Contractor Work', label: '외주작업', icon: '👷', description: '외부 업체 작업' },
  { value: 'Maintenance Work', label: '정비작업', icon: '🔧', description: '일반 정비 작업' },
  { value: 'Construction Work', label: '건설작업', icon: '🏗️', description: '신축 및 개조 작업' }
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
  '화재/폭발 위험', '전기 감전', '화학물질 노출', '질식 위험', '낙하 위험',
  '끼임 위험', '화상 위험', '중독 위험', '방사선 노출', '소음/진동',
  '고온/저온', '압력 위험', '생물학적 위험', '구조물 붕괴'
]

const commonPPE = [
  '안전모', '안전화', '보안경', '장갑', '반사조끼', '호흡보호구',
  '귀마개', '안전벨트', '화학복', '절연장갑', '용접마스크', '방독면',
  '내화복', '절연화', '안전대', '구명조끼'
]

const commonTraining = [
  '일반 안전교육', '화기작업 교육', '밀폐공간 교육', '전기안전 교육',
  '화학물질 취급 교육', '고소작업 교육', '크레인 조작 교육',
  '응급처치 교육', '소방안전 교육', '방사선 안전교육'
]

const commonEquipment = [
  '가스탐지기', '환기팬', '조명장비', '통신장비', '소화기', '비상기구함',
  '구급상자', '안전로프', '사다리', '비계', '크레인', '용접기',
  '절단기', '측정장비', '보호장구'
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

  // 기존 허가서 데이터로 폼 초기화
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
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {mode === 'create' ? '새 작업허가서' : '허가서 수정'}
            </h2>
            <p className="text-text-secondary mt-1">
              {mode === 'create' ? '새로운 작업허가서를 신청합니다' : '기존 허가서의 정보를 수정합니다'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : (mode === 'create' ? '허가서 신청' : '변경 저장')}
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
                placeholder="예: 보일러 #1 정기점검을 위한 화기작업"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">작업 설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
                placeholder="작업에 대한 개요를 입력하세요..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">상세 작업 내용</label>
              <textarea
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
                placeholder="구체적인 작업 내용과 절차를 상세히 기술하세요..."
              />
            </div>
          </div>
        </div>

        {/* 작업 유형 및 우선순위 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">작업 유형 및 우선순위</h3>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              작업 유형 <span className="text-error-text">*</span>
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
              우선순위 <span className="text-error-text">*</span>
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

        {/* 위치 및 일정 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">위치 및 일정</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                작업 위치 <span className="text-error-text">*</span>
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
                placeholder="예: A동 2층 동쪽 구역"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                작업 시작일시 <span className="text-error-text">*</span>
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
                작업 완료일시 <span className="text-error-text">*</span>
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
                예상 작업시간 (시간)
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

        {/* 신청자 정보 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">신청자 정보</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                신청자 이름 <span className="text-error-text">*</span>
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
                부서 <span className="text-error-text">*</span>
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
                연락처 <span className="text-error-text">*</span>
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

        {/* 외주업체 정보 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-text-primary">외주업체 정보</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contractor.hasContractor}
                onChange={(e) => setContractor(prev => ({ ...prev, hasContractor: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm text-text-secondary">외주업체 작업</span>
            </label>
          </div>

          {contractor.hasContractor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  업체명 <span className="text-error-text">*</span>
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
                  담당자 <span className="text-error-text">*</span>
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
                  연락처 <span className="text-error-text">*</span>
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
                  <span className="text-sm text-text-primary">보험 가입</span>
                </label>
                
                {contractor.insurance && (
                  <div className="flex-1">
                    <input
                      type="date"
                      value={contractor.insuranceExpiry}
                      onChange={(e) => setContractor(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                      className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background text-sm"
                      placeholder="보험 만료일"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 위험요소 및 안전조치 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">위험요소 및 안전조치</h3>

          {/* 위험요소 식별 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">식별된 위험요소</label>
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
                placeholder="기타 위험요소 추가"
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
                추가
              </Button>
            </div>
          </div>

          {/* 위험도 평가 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">위험도 평가</label>
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

          {/* 저감 방안 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">위험 저감 방안</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customInputs.mitigation}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, mitigation: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none text-sm"
                placeholder="저감 방안을 입력하세요"
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
                추가
              </Button>
            </div>
            {hazards.mitigation.length > 0 && (
              <div className="space-y-2">
                {hazards.mitigation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-success-bg rounded-notion-sm">
                    <span className="text-sm text-success-text">✓ {item}</span>
                    <button
                      type="button"
                      onClick={() => setHazards(prev => ({
                        ...prev,
                        mitigation: prev.mitigation.filter((_, i) => i !== index)
                      }))}
                      className="text-error-text hover:text-error"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 안전 요구사항 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safety.fireWatchRequired}
                onChange={(e) => setSafety(prev => ({ ...prev, fireWatchRequired: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                🔥 화재감시자 필요
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
                🧪 가스측정 필요
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
                🔒 격리조치 필요
              </span>
            </label>
          </div>
        </div>

        {/* 필요 교육 및 보호구 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">필요 교육 및 보호구</h3>

          {/* 필요한 교육 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">필요한 교육</label>
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

          {/* 필요한 보호구 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">필요한 보호구 (PPE)</label>
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

          {/* 비상절차 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">비상절차</label>
            <textarea
              value={safety.emergencyProcedure}
              onChange={(e) => setSafety(prev => ({ ...prev, emergencyProcedure: e.target.value }))}
              className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
              placeholder="비상상황 발생 시 절차를 상세히 기술하세요..."
            />
          </div>
        </div>

        {/* 연락처 및 소통 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">연락처 및 소통</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                현장 담당자 <span className="text-error-text">*</span>
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
                비상 연락처 <span className="text-error-text">*</span>
              </label>
              <input
                type="tel"
                value={communication.emergencyContact}
                onChange={(e) => setCommunication(prev => ({ ...prev, emergencyContact: e.target.value }))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="119, 사내 비상연락처 등"
                required
              />
            </div>
          </div>
        </div>

        {/* 추가 메모 */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">추가 메모</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
            placeholder="기타 특별 지시사항이나 참고사항을 입력하세요..."
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
              {loading ? '저장 중...' : (mode === 'create' ? '허가서 신청' : '변경 저장')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}