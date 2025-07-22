"use client"

import { useState, useEffect } from "react"
import { CreateWorkPermitRequest, UpdateWorkPermitRequest, WorkPermit, PermitType, FacilityArea, Priority } from "@/lib/types/facility"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/display"

interface PermitFormProps {
  permit?: WorkPermit // ?˜ì • ??ê¸°ì¡´ ?ˆê????°ì´??
  onSubmit: (data: CreateWorkPermitRequest | UpdateWorkPermitRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: 'create' | 'edit'
}

const permitTypes: { value: PermitType; label: string; icon: string; description: string }[] = [
  { value: 'Hot Work', label: '?”ê¸°?‘ì—…', icon: '?”¥', description: '?©ì ‘, ?ˆë‹¨, ?°ì‚­ ?? },
  { value: 'Confined Space', label: 'ë°€?ê³µê°?, icon: '?•³ï¸?, description: '?±í¬, ê´€ë¡? ?€?¥ê³  ?? },
  { value: 'Electrical Work', label: '?„ê¸°?‘ì—…', icon: '??, description: '?„ê¸°?¤ë¹„ ?¤ì¹˜ ë°??˜ë¦¬' },
  { value: 'Chemical Work', label: '?”í•™?‘ì—…', icon: '?§ª', description: '?”í•™ë¬¼ì§ˆ ì·¨ê¸‰ ?‘ì—…' },
  { value: 'Height Work', label: 'ê³ ì†Œ?‘ì—…', icon: '?—ï¸?, description: '2m ?´ìƒ ?’ì´ ?‘ì—…' },
  { value: 'Excavation', label: 'êµ´ì°©?‘ì—…', icon: '?ï¸', description: '???Œê¸° ë°?êµ´ì°©' },
  { value: 'Welding', label: '?©ì ‘?‘ì—…', icon: '?”—', description: 'ê°ì¢… ?©ì ‘ ?‘ì—…' },
  { value: 'Cutting', label: '?ˆë‹¨?‘ì—…', icon: '?‚ï¸', description: 'ê¸ˆì† ë°??¬ë£Œ ?ˆë‹¨' },
  { value: 'Radiation Work', label: 'ë°©ì‚¬? ì‘??, icon: '??¸', description: 'ë°©ì‚¬??ë¬¼ì§ˆ ì·¨ê¸‰' },
  { value: 'Crane Operation', label: '?¬ë ˆ?¸ì‘??, icon: '?—ï¸?, description: '?¬ë ˆ??ë°?ì¤‘ì¥ë¹??‘ì—…' },
  { value: 'Shutdown Work', label: '?•ì??‘ì—…', icon: '?”§', description: '?¤ë¹„ ?•ì? ???‘ì—…' },
  { value: 'Emergency Work', label: '?‘ê¸‰?‘ì—…', icon: '?š¨', description: 'ê¸´ê¸‰ ?˜ë¦¬ ?‘ì—…' },
  { value: 'Contractor Work', label: '?¸ì£¼?‘ì—…', icon: '?‘·', description: '?¸ë? ?…ì²´ ?‘ì—…' },
  { value: 'Maintenance Work', label: '?•ë¹„?‘ì—…', icon: '?”§', description: '?¼ë°˜ ?•ë¹„ ?‘ì—…' },
  { value: 'Construction Work', label: 'ê±´ì„¤?‘ì—…', icon: '?—ï¸?, description: '? ì¶• ë°?ê°œì¡° ?‘ì—…' }
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
  '?”ì¬/??°œ ?„í—˜', '?„ê¸° ê°ì „', '?”í•™ë¬¼ì§ˆ ?¸ì¶œ', 'ì§ˆì‹ ?„í—˜', '?™í•˜ ?„í—˜',
  '?¼ì„ ?„í—˜', '?”ìƒ ?„í—˜', 'ì¤‘ë… ?„í—˜', 'ë°©ì‚¬???¸ì¶œ', '?ŒìŒ/ì§„ë™',
  'ê³ ì˜¨/?€??, '?•ë ¥ ?„í—˜', '?ë¬¼?™ì  ?„í—˜', 'êµ¬ì¡°ë¬?ë¶•ê´´'
]

const commonPPE = [
  '?ˆì „ëª?, '?ˆì „??, 'ë³´ì•ˆê²?, '?¥ê°‘', 'ë°˜ì‚¬ì¡°ë¼', '?¸í¡ë³´í˜¸êµ?,
  'ê·€ë§ˆê°œ', '?ˆì „ë²¨íŠ¸', '?”í•™ë³?, '?ˆì—°?¥ê°‘', '?©ì ‘ë§ˆìŠ¤??, 'ë°©ë…ë©?,
  '?´í™”ë³?, '?ˆì—°??, '?ˆì „?€', 'êµ¬ëª…ì¡°ë¼'
]

const commonTraining = [
  '?¼ë°˜ ?ˆì „êµìœ¡', '?”ê¸°?‘ì—… êµìœ¡', 'ë°€?ê³µê°?êµìœ¡', '?„ê¸°?ˆì „ êµìœ¡',
  '?”í•™ë¬¼ì§ˆ ì·¨ê¸‰ êµìœ¡', 'ê³ ì†Œ?‘ì—… êµìœ¡', '?¬ë ˆ??ì¡°ì‘ êµìœ¡',
  '?‘ê¸‰ì²˜ì¹˜ êµìœ¡', '?Œë°©?ˆì „ êµìœ¡', 'ë°©ì‚¬???ˆì „êµìœ¡'
]

const commonEquipment = [
  'ê°€?¤íƒì§€ê¸?, '?˜ê¸°??, 'ì¡°ëª…?¥ë¹„', '?µì‹ ?¥ë¹„', '?Œí™”ê¸?, 'ë¹„ìƒê¸°êµ¬??,
  'êµ¬ê¸‰?ì', '?ˆì „ë¡œí”„', '?¬ë‹¤ë¦?, 'ë¹„ê³„', '?¬ë ˆ??, '?©ì ‘ê¸?,
  '?ˆë‹¨ê¸?, 'ì¸¡ì •?¥ë¹„', 'ë³´í˜¸?¥êµ¬'
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

  // ê¸°ì¡´ ?ˆê????°ì´?°ë¡œ ??ì´ˆê¸°??
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
        {/* ?¤ë” */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {mode === 'create' ? '???‘ì—…?ˆê??? : '?ˆê????˜ì •'}
            </h2>
            <p className="text-text-secondary mt-1">
              {mode === 'create' ? '?ˆë¡œ???‘ì—…?ˆê??œë? ? ì²­?©ë‹ˆ?? : 'ê¸°ì¡´ ?ˆê??œì˜ ?•ë³´ë¥??˜ì •?©ë‹ˆ??}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              ì·¨ì†Œ
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '?€??ì¤?..' : (mode === 'create' ? '?ˆê???? ì²­' : 'ë³€ê²??€??)}
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
                placeholder="?? ë³´ì¼??#1 ?•ê¸°?ê????„í•œ ?”ê¸°?‘ì—…"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">?‘ì—… ?¤ëª…</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
                placeholder="?‘ì—…???€??ê°œìš”ë¥??…ë ¥?˜ì„¸??.."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">?ì„¸ ?‘ì—… ?´ìš©</label>
              <textarea
                value={formData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
                placeholder="êµ¬ì²´?ì¸ ?‘ì—… ?´ìš©ê³??ˆì°¨ë¥??ì„¸??ê¸°ìˆ ?˜ì„¸??.."
              />
            </div>
          </div>
        </div>

        {/* ?‘ì—… ? í˜• ë°??°ì„ ?œìœ„ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?‘ì—… ? í˜• ë°??°ì„ ?œìœ„</h3>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              ?‘ì—… ? í˜• <span className="text-error-text">*</span>
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
              ?°ì„ ?œìœ„ <span className="text-error-text">*</span>
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

        {/* ?„ì¹˜ ë°??¼ì • */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?„ì¹˜ ë°??¼ì •</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?‘ì—… ?„ì¹˜ <span className="text-error-text">*</span>
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
                placeholder="?? A??2ì¸??™ìª½ êµ¬ì—­"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?‘ì—… ?œì‘?¼ì‹œ <span className="text-error-text">*</span>
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
                ?‘ì—… ?„ë£Œ?¼ì‹œ <span className="text-error-text">*</span>
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
                ?ˆìƒ ?‘ì—…?œê°„ (?œê°„)
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

        {/* ? ì²­???•ë³´ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">? ì²­???•ë³´</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ? ì²­???´ë¦„ <span className="text-error-text">*</span>
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
                ë¶€??<span className="text-error-text">*</span>
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
                ?°ë½ì²?<span className="text-error-text">*</span>
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

        {/* ?¸ì£¼?…ì²´ ?•ë³´ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-text-primary">?¸ì£¼?…ì²´ ?•ë³´</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={contractor.hasContractor}
                onChange={(e) => setContractor(prev => ({ ...prev, hasContractor: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm text-text-secondary">?¸ì£¼?…ì²´ ?‘ì—…</span>
            </label>
          </div>

          {contractor.hasContractor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ?…ì²´ëª?<span className="text-error-text">*</span>
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
                  ?´ë‹¹??<span className="text-error-text">*</span>
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
                  ?°ë½ì²?<span className="text-error-text">*</span>
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
                <label className="block text-sm font-medium text-text-primary mb-2">ë©´í—ˆë²ˆí˜¸</label>
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
                  <span className="text-sm text-text-primary">ë³´í—˜ ê°€??/span>
                </label>
                
                {contractor.insurance && (
                  <div className="flex-1">
                    <input
                      type="date"
                      value={contractor.insuranceExpiry}
                      onChange={(e) => setContractor(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                      className="w-full px-3 py-2 rounded-notion-sm border border-border bg-background text-sm"
                      placeholder="ë³´í—˜ ë§Œë£Œ??
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ?„í—˜?”ì†Œ ë°??ˆì „ì¡°ì¹˜ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">?„í—˜?”ì†Œ ë°??ˆì „ì¡°ì¹˜</h3>

          {/* ?„í—˜?”ì†Œ ?ë³„ */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?ë³„???„í—˜?”ì†Œ</label>
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
                placeholder="ê¸°í? ?„í—˜?”ì†Œ ì¶”ê?"
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
                ì¶”ê?
              </Button>
            </div>
          </div>

          {/* ?„í—˜???‰ê? */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?„í—˜???‰ê?</label>
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

          {/* ?€ê°?ë°©ì•ˆ */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?„í—˜ ?€ê°?ë°©ì•ˆ</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customInputs.mitigation}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, mitigation: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none text-sm"
                placeholder="?€ê°?ë°©ì•ˆ???…ë ¥?˜ì„¸??
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
                ì¶”ê?
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

          {/* ?ˆì „ ?”êµ¬?¬í•­ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={safety.fireWatchRequired}
                onChange={(e) => setSafety(prev => ({ ...prev, fireWatchRequired: e.target.checked }))}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">
                ?”¥ ?”ì¬ê°ì‹œ???„ìš”
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
                ?§ª ê°€?¤ì¸¡???„ìš”
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
                ?”’ ê²©ë¦¬ì¡°ì¹˜ ?„ìš”
              </span>
            </label>
          </div>
        </div>

        {/* ?„ìš” êµìœ¡ ë°?ë³´í˜¸êµ?*/}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">?„ìš” êµìœ¡ ë°?ë³´í˜¸êµ?/h3>

          {/* ?„ìš”??êµìœ¡ */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?„ìš”??êµìœ¡</label>
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

          {/* ?„ìš”??ë³´í˜¸êµ?*/}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">?„ìš”??ë³´í˜¸êµ?(PPE)</label>
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

          {/* ë¹„ìƒ?ˆì°¨ */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">ë¹„ìƒ?ˆì°¨</label>
            <textarea
              value={safety.emergencyProcedure}
              onChange={(e) => setSafety(prev => ({ ...prev, emergencyProcedure: e.target.value }))}
              className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-24 resize-none"
              placeholder="ë¹„ìƒ?í™© ë°œìƒ ???ˆì°¨ë¥??ì„¸??ê¸°ìˆ ?˜ì„¸??.."
            />
          </div>
        </div>

        {/* ?°ë½ì²?ë°??Œí†µ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">?°ë½ì²?ë°??Œí†µ</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                ?„ì¥ ?´ë‹¹??<span className="text-error-text">*</span>
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
                ë¹„ìƒ ?°ë½ì²?<span className="text-error-text">*</span>
              </label>
              <input
                type="tel"
                value={communication.emergencyContact}
                onChange={(e) => setCommunication(prev => ({ ...prev, emergencyContact: e.target.value }))}
                className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none"
                placeholder="119, ?¬ë‚´ ë¹„ìƒ?°ë½ì²???
                required
              />
            </div>
          </div>
        </div>

        {/* ì¶”ê? ë©”ëª¨ */}
        <div className="bg-background-secondary rounded-notion-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">ì¶”ê? ë©”ëª¨</h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background focus:border-border-focus focus:outline-none h-32 resize-none"
            placeholder="ê¸°í? ?¹ë³„ ì§€?œì‚¬??´??ì°¸ê³ ?¬í•­???…ë ¥?˜ì„¸??.."
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
              {loading ? '?€??ì¤?..' : (mode === 'create' ? '?ˆê???? ì²­' : 'ë³€ê²??€??)}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}