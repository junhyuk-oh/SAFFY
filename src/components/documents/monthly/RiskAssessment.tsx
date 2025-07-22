"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display'
import { Button } from '@/components/ui/forms/button'
import { Input } from '@/components/ui/forms'
import { Label } from '@/components/ui/forms'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms'
import { Textarea } from '@/components/ui/forms'
import { Progress } from '@/components/ui/feedback'
import { Badge } from '@/components/ui/display'
import { AlertTriangle, ChevronDown, ChevronUp, FileText, Plus, Shield, Trash2, Upload } from 'lucide-react'
import type { RiskAssessment, RiskAssessmentItem, RiskMatrix } from '@/lib/types'
import { LawReferenceSection } from '@/components/laws/LawReferenceSection'

interface RiskAssessmentProps {
  onSave?: (data: Partial<RiskAssessment>) => void
  initialData?: Partial<RiskAssessment>
}

export function RiskAssessment({ onSave, initialData }: RiskAssessmentProps) {
  const [formData, setFormData] = useState<Partial<RiskAssessment>>(
    initialData || {
      month: new Date().toISOString().slice(0, 7),
      department: '',
      assessor: '',
      assessmentDate: new Date().toISOString().split('T')[0],
      scope: '',
      participants: [],
      riskItems: [],
      summary: {
        totalHazards: 0,
        criticalRisks: 0,
        highRisks: 0,
        mediumRisks: 0,
        lowRisks: 0,
        completedMeasures: 0
      },
      recommendations: [],
      reviewDate: '',
      approver: '',
      attachments: []
    }
  )

  const [progress, setProgress] = useState(0)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const calculateProgress = useCallback(() => {
    const fields = [
      formData.department,
      formData.assessor,
      formData.scope,
      formData.participants?.length,
      formData.riskItems?.length,
      formData.reviewDate,
      formData.approver
    ]
    const filled = fields.filter(Boolean).length
    return (filled / fields.length) * 100
  }, [formData.department, formData.assessor, formData.scope, formData.participants?.length, formData.riskItems?.length, formData.reviewDate, formData.approver])

  const calculateRiskGrade = (frequency: number, severity: number): RiskMatrix['riskGrade'] => {
    const riskLevel = frequency * severity
    if (riskLevel >= 20) return 'critical'
    if (riskLevel >= 12) return 'high'
    if (riskLevel >= 6) return 'medium'
    return 'low'
  }

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...(prev.participants || []), { name: '', role: '' }]
    }))
  }

  const addRiskItem = () => {
    const newItem: RiskAssessmentItem = {
      id: Date.now().toString(),
      process: '',
      task: '',
      hazard: '',
      hazardType: 'physical',
      possibleAccident: '',
      currentControl: '',
      riskBefore: {
        frequency: 1,
        severity: 1,
        riskLevel: 1,
        riskGrade: 'low'
      },
      controlMeasures: {
        engineering: [],
        administrative: [],
        ppe: []
      },
      riskAfter: {
        frequency: 1,
        severity: 1,
        riskLevel: 1,
        riskGrade: 'low'
      },
      residualRisk: '',
      responsible: '',
      implementationDate: '',
      status: 'planned'
    }
    setFormData(prev => ({
      ...prev,
      riskItems: [...(prev.riskItems || []), newItem]
    }))
  }

  const updateRiskItem = (id: string, updates: Partial<RiskAssessmentItem>) => {
    setFormData(prev => ({
      ...prev,
      riskItems: prev.riskItems?.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }))
  }

  const removeRiskItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      riskItems: prev.riskItems?.filter(item => item.id !== id)
    }))
  }

  const updateRiskMatrix = (
    itemId: string,
    matrixType: 'riskBefore' | 'riskAfter',
    field: 'frequency' | 'severity',
    value: number
  ) => {
    setFormData(prev => {
      const updatedItems = prev.riskItems?.map(item => {
        if (item.id === itemId) {
          const updatedMatrix = { ...item[matrixType] }
          updatedMatrix[field] = value as 1 | 2 | 3 | 4 | 5
          updatedMatrix.riskLevel = updatedMatrix.frequency * updatedMatrix.severity
          updatedMatrix.riskGrade = calculateRiskGrade(updatedMatrix.frequency, updatedMatrix.severity)
          return { ...item, [matrixType]: updatedMatrix }
        }
        return item
      })
      return { ...prev, riskItems: updatedItems }
    })
  }

  const updateSummary = useCallback(() => {
    const items = formData.riskItems || []
    const summary = {
      totalHazards: items.length,
      criticalRisks: items.filter(item => item.riskBefore.riskGrade === 'critical').length,
      highRisks: items.filter(item => item.riskBefore.riskGrade === 'high').length,
      mediumRisks: items.filter(item => item.riskBefore.riskGrade === 'medium').length,
      lowRisks: items.filter(item => item.riskBefore.riskGrade === 'low').length,
      completedMeasures: items.filter(item => item.status === 'completed').length
    }
    setFormData(prev => ({ ...prev, summary }))
  }, [formData.riskItems])

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSummary()
    if (onSave) {
      onSave(formData)
    }
  }

  React.useEffect(() => {
    setProgress(calculateProgress())
    updateSummary()
  }, [calculateProgress, updateSummary])

  const riskGradeColors = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300'
  }

  const riskGradeLabels = {
    critical: '매우 높음',
    high: '높음',
    medium: '보통',
    low: '낮음'
  }

  const hazardTypeLabels = {
    physical: '물리적',
    chemical: '화학적',
    biological: '생물학적',
    ergonomic: '인체공학적',
    psychological: '심리적'
  }

  const statusLabels = {
    planned: '계획됨',
    'in-progress': '진행중',
    completed: '완료'
  }

  const statusColors = {
    planned: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>위험성평가서</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">작성 진행률</span>
              <Progress value={progress} className="w-32" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="month">평가 월</Label>
              <Input
                id="month"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="assessmentDate">평가일</Label>
              <Input
                id="assessmentDate"
                type="date"
                value={formData.assessmentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, assessmentDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="department">부서</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="부서명 입력"
                required
              />
            </div>
            <div>
              <Label htmlFor="assessor">평가자</Label>
              <Input
                id="assessor"
                value={formData.assessor}
                onChange={(e) => setFormData(prev => ({ ...prev, assessor: e.target.value }))}
                placeholder="평가자 이름"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="scope">평가 범위</Label>
              <Textarea
                id="scope"
                value={formData.scope}
                onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value }))}
                placeholder="위험성평가 대상 작업, 공정, 장소 등을 명시"
                rows={3}
                required
              />
            </div>
          </div>

          {/* 참여자 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>평가 참여자</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParticipant}
              >
                <Plus className="h-4 w-4 mr-2" />
                참여자 추가
              </Button>
            </div>
            <div className="space-y-2">
              {formData.participants?.map((participant, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={participant.name}
                    onChange={(e) => {
                      const newParticipants = [...(formData.participants || [])]
                      newParticipants[index] = { ...participant, name: e.target.value }
                      setFormData(prev => ({ ...prev, participants: newParticipants }))
                    }}
                    placeholder="이름"
                  />
                  <Input
                    value={participant.role}
                    onChange={(e) => {
                      const newParticipants = [...(formData.participants || [])]
                      newParticipants[index] = { ...participant, role: e.target.value }
                      setFormData(prev => ({ ...prev, participants: newParticipants }))
                    }}
                    placeholder="역할 (예: 안전관리자, 작업자)"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newParticipants = formData.participants?.filter((_, i) => i !== index)
                      setFormData(prev => ({ ...prev, participants: newParticipants }))
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 위험 요인 평가 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">위험 요인 평가</h3>
              <Button
                type="button"
                variant="outline"
                onClick={addRiskItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                위험 요인 추가
              </Button>
            </div>

            {/* 요약 통계 */}
            {formData.riskItems && formData.riskItems.length > 0 && (
              <Card className="p-4 mb-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{formData.summary?.totalHazards}</div>
                    <div className="text-sm text-gray-600">전체 위험요인</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{formData.summary?.criticalRisks}</div>
                    <div className="text-sm text-gray-600">매우 높음</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{formData.summary?.highRisks}</div>
                    <div className="text-sm text-gray-600">높음</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{formData.summary?.mediumRisks}</div>
                    <div className="text-sm text-gray-600">보통</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{formData.summary?.lowRisks}</div>
                    <div className="text-sm text-gray-600">낮음</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{formData.summary?.completedMeasures}</div>
                    <div className="text-sm text-gray-600">조치 완료</div>
                  </div>
                </div>
              </Card>
            )}

            {/* 위험 요인 목록 */}
            <div className="space-y-4">
              {formData.riskItems?.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <h4 className="font-semibold">{item.process || '프로세스 미입력'} - {item.task || '작업 미입력'}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={riskGradeColors[item.riskBefore.riskGrade]}>
                            개선 전: {riskGradeLabels[item.riskBefore.riskGrade]}
                          </Badge>
                          <Badge className={riskGradeColors[item.riskAfter.riskGrade]}>
                            개선 후: {riskGradeLabels[item.riskAfter.riskGrade]}
                          </Badge>
                          <Badge variant="outline">
                            {hazardTypeLabels[item.hazardType]}
                          </Badge>
                          <Badge className={statusColors[item.status]}>
                            {statusLabels[item.status]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItemExpansion(item.id)}
                        >
                          {expandedItems.includes(item.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeRiskItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* 기본 정보 (항상 표시) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>프로세스/공정</Label>
                        <Input
                          value={item.process}
                          onChange={(e) => updateRiskItem(item.id, { process: e.target.value })}
                          placeholder="예: 화학물질 혼합"
                        />
                      </div>
                      <div>
                        <Label>작업/활동</Label>
                        <Input
                          value={item.task}
                          onChange={(e) => updateRiskItem(item.id, { task: e.target.value })}
                          placeholder="예: 용매 투입 작업"
                        />
                      </div>
                    </div>

                    {/* 상세 정보 (확장 시 표시) */}
                    {expandedItems.includes(item.id) && (
                      <div className="space-y-4 mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>위험요인</Label>
                            <Textarea
                              value={item.hazard}
                              onChange={(e) => updateRiskItem(item.id, { hazard: e.target.value })}
                              placeholder="예: 유기용매 증기 노출"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>발생 가능한 사고</Label>
                            <Textarea
                              value={item.possibleAccident}
                              onChange={(e) => updateRiskItem(item.id, { possibleAccident: e.target.value })}
                              placeholder="예: 급성 중독, 화재"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>위험 유형</Label>
                            <Select
                              value={item.hazardType}
                              onValueChange={(value) => updateRiskItem(item.id, { hazardType: value as 'physical' | 'chemical' | 'biological' | 'ergonomic' | 'psychological' })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(hazardTypeLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>현재 관리대책</Label>
                            <Input
                              value={item.currentControl}
                              onChange={(e) => updateRiskItem(item.id, { currentControl: e.target.value })}
                              placeholder="예: 국소배기장치 운영"
                            />
                          </div>
                        </div>

                        {/* 위험성 평가 매트릭스 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="p-4 bg-red-50">
                            <h5 className="font-semibold mb-3 flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              개선 전 위험성
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>빈도 (1-5)</Label>
                                <Select
                                  value={item.riskBefore.frequency.toString()}
                                  onValueChange={(value) => updateRiskMatrix(item.id, 'riskBefore', 'frequency', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map(n => (
                                      <SelectItem key={n} value={n.toString()}>
                                        {n} - {n === 1 ? '매우 낮음' : n === 2 ? '낮음' : n === 3 ? '보통' : n === 4 ? '높음' : '매우 높음'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>심각도 (1-5)</Label>
                                <Select
                                  value={item.riskBefore.severity.toString()}
                                  onValueChange={(value) => updateRiskMatrix(item.id, 'riskBefore', 'severity', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map(n => (
                                      <SelectItem key={n} value={n.toString()}>
                                        {n} - {n === 1 ? '매우 낮음' : n === 2 ? '낮음' : n === 3 ? '보통' : n === 4 ? '높음' : '매우 높음'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="mt-3 text-center">
                              <div className="text-2xl font-bold">{item.riskBefore.riskLevel}</div>
                              <Badge className={`${riskGradeColors[item.riskBefore.riskGrade]} mt-1`}>
                                {riskGradeLabels[item.riskBefore.riskGrade]}
                              </Badge>
                            </div>
                          </Card>

                          <Card className="p-4 bg-green-50">
                            <h5 className="font-semibold mb-3 flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              개선 후 위험성
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>빈도 (1-5)</Label>
                                <Select
                                  value={item.riskAfter.frequency.toString()}
                                  onValueChange={(value) => updateRiskMatrix(item.id, 'riskAfter', 'frequency', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map(n => (
                                      <SelectItem key={n} value={n.toString()}>
                                        {n} - {n === 1 ? '매우 낮음' : n === 2 ? '낮음' : n === 3 ? '보통' : n === 4 ? '높음' : '매우 높음'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>심각도 (1-5)</Label>
                                <Select
                                  value={item.riskAfter.severity.toString()}
                                  onValueChange={(value) => updateRiskMatrix(item.id, 'riskAfter', 'severity', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map(n => (
                                      <SelectItem key={n} value={n.toString()}>
                                        {n} - {n === 1 ? '매우 낮음' : n === 2 ? '낮음' : n === 3 ? '보통' : n === 4 ? '높음' : '매우 높음'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="mt-3 text-center">
                              <div className="text-2xl font-bold">{item.riskAfter.riskLevel}</div>
                              <Badge className={`${riskGradeColors[item.riskAfter.riskGrade]} mt-1`}>
                                {riskGradeLabels[item.riskAfter.riskGrade]}
                              </Badge>
                            </div>
                          </Card>
                        </div>

                        {/* 관리 대책 */}
                        <div>
                          <h5 className="font-semibold mb-3">위험 감소 대책</h5>
                          <div className="space-y-3">
                            <div>
                              <Label>공학적 대책</Label>
                              {item.controlMeasures.engineering.map((measure, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                  <Input
                                    value={measure}
                                    onChange={(e) => {
                                      const newMeasures = [...item.controlMeasures.engineering]
                                      newMeasures[index] = e.target.value
                                      updateRiskItem(item.id, {
                                        controlMeasures: { ...item.controlMeasures, engineering: newMeasures }
                                      })
                                    }}
                                    placeholder="예: 밀폐설비 설치"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const newMeasures = item.controlMeasures.engineering.filter((_, i) => i !== index)
                                      updateRiskItem(item.id, {
                                        controlMeasures: { ...item.controlMeasures, engineering: newMeasures }
                                      })
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  updateRiskItem(item.id, {
                                    controlMeasures: {
                                      ...item.controlMeasures,
                                      engineering: [...item.controlMeasures.engineering, '']
                                    }
                                  })
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                대책 추가
                              </Button>
                            </div>

                            <div>
                              <Label>관리적 대책</Label>
                              {item.controlMeasures.administrative.map((measure, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                  <Input
                                    value={measure}
                                    onChange={(e) => {
                                      const newMeasures = [...item.controlMeasures.administrative]
                                      newMeasures[index] = e.target.value
                                      updateRiskItem(item.id, {
                                        controlMeasures: { ...item.controlMeasures, administrative: newMeasures }
                                      })
                                    }}
                                    placeholder="예: 작업절차서 개정"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const newMeasures = item.controlMeasures.administrative.filter((_, i) => i !== index)
                                      updateRiskItem(item.id, {
                                        controlMeasures: { ...item.controlMeasures, administrative: newMeasures }
                                      })
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  updateRiskItem(item.id, {
                                    controlMeasures: {
                                      ...item.controlMeasures,
                                      administrative: [...item.controlMeasures.administrative, '']
                                    }
                                  })
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                대책 추가
                              </Button>
                            </div>

                            <div>
                              <Label>개인보호구</Label>
                              {item.controlMeasures.ppe.map((measure, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                  <Input
                                    value={measure}
                                    onChange={(e) => {
                                      const newMeasures = [...item.controlMeasures.ppe]
                                      newMeasures[index] = e.target.value
                                      updateRiskItem(item.id, {
                                        controlMeasures: { ...item.controlMeasures, ppe: newMeasures }
                                      })
                                    }}
                                    placeholder="예: 방독마스크 착용"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const newMeasures = item.controlMeasures.ppe.filter((_, i) => i !== index)
                                      updateRiskItem(item.id, {
                                        controlMeasures: { ...item.controlMeasures, ppe: newMeasures }
                                      })
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  updateRiskItem(item.id, {
                                    controlMeasures: {
                                      ...item.controlMeasures,
                                      ppe: [...item.controlMeasures.ppe, '']
                                    }
                                  })
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                보호구 추가
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* 이행 계획 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>잔류 위험</Label>
                            <Textarea
                              value={item.residualRisk}
                              onChange={(e) => updateRiskItem(item.id, { residualRisk: e.target.value })}
                              placeholder="대책 적용 후에도 남는 위험"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>책임자</Label>
                            <Input
                              value={item.responsible}
                              onChange={(e) => updateRiskItem(item.id, { responsible: e.target.value })}
                              placeholder="이행 책임자"
                            />
                          </div>
                          <div>
                            <Label>이행 기한</Label>
                            <Input
                              type="date"
                              value={item.implementationDate}
                              onChange={(e) => updateRiskItem(item.id, { implementationDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>이행 상태</Label>
                            <Select
                              value={item.status}
                              onValueChange={(value) => updateRiskItem(item.id, { status: value as 'planned' | 'in-progress' | 'completed' })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {formData.riskItems?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  위험 요인을 추가하여 평가를 시작하세요
                </div>
              )}
            </div>
          </div>

          {/* 권고사항 */}
          <div>
            <Label>종합 권고사항</Label>
            {formData.recommendations?.map((rec, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Textarea
                  value={rec}
                  onChange={(e) => {
                    const newRecs = [...(formData.recommendations || [])]
                    newRecs[index] = e.target.value
                    setFormData(prev => ({ ...prev, recommendations: newRecs }))
                  }}
                  placeholder="권고사항 입력"
                  rows={2}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newRecs = formData.recommendations?.filter((_, i) => i !== index)
                    setFormData(prev => ({ ...prev, recommendations: newRecs }))
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData(prev => ({
                ...prev,
                recommendations: [...(prev.recommendations || []), '']
              }))}
            >
              <Plus className="h-4 w-4 mr-2" />
              권고사항 추가
            </Button>
          </div>

          {/* 검토 및 승인 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reviewDate">검토일</Label>
              <Input
                id="reviewDate"
                type="date"
                value={formData.reviewDate}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="approver">승인자</Label>
              <Input
                id="approver"
                value={formData.approver}
                onChange={(e) => setFormData(prev => ({ ...prev, approver: e.target.value }))}
                placeholder="승인자 이름"
                required
              />
            </div>
          </div>

          {/* 법적 근거 */}
          <LawReferenceSection 
            documentType="risk-assessment"
            title="위험성평가"
            variant="full"
            className="mt-6"
          />

          {/* 첨부파일 */}
          <div>
            <Label>첨부파일</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-gray-500 mt-1">관련 자료, 사진, 도면 등 (최대 10MB)</p>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              임시 저장
            </Button>
            <Button type="submit">
              <FileText className="h-4 w-4 mr-2" />
              평가서 저장
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}