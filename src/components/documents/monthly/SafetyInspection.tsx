"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, FileText, Plus, Trash2, Upload } from 'lucide-react'
import type { SafetyInspection, InspectionItem } from '@/lib/types'

interface SafetyInspectionProps {
  onSave?: (data: Partial<SafetyInspection>) => void
  initialData?: Partial<SafetyInspection>
}

export function SafetyInspection({ onSave, initialData }: SafetyInspectionProps) {
  const [formData, setFormData] = useState<Partial<SafetyInspection>>(
    initialData || {
      month: new Date().toISOString().slice(0, 7),
      department: '',
      inspector: '',
      inspectionDate: new Date().toISOString().split('T')[0],
      sections: {
        equipment: [],
        environment: [],
        process: [],
        emergency: []
      },
      totalScore: 0,
      grade: 'A',
      majorFindings: [],
      improvementPlan: [],
      attachments: []
    }
  )

  const [currentSection, setCurrentSection] = useState<'equipment' | 'environment' | 'process' | 'emergency'>('equipment')
  const [progress, setProgress] = useState(0)

  const calculateProgress = () => {
    const fields = [
      formData.department,
      formData.inspector,
      formData.sections?.equipment?.length,
      formData.sections?.environment?.length,
      formData.sections?.process?.length,
      formData.sections?.emergency?.length
    ]
    const filled = fields.filter(Boolean).length
    return (filled / fields.length) * 100
  }

  const calculateTotalScore = () => {
    const sections = formData.sections
    if (!sections) return 0

    const allItems = [
      ...(sections.equipment || []),
      ...(sections.environment || []),
      ...(sections.process || []),
      ...(sections.emergency || [])
    ]

    if (allItems.length === 0) return 0
    const totalScore = allItems.reduce((sum, item) => sum + (item.score || 0), 0)
    return Math.round(totalScore / allItems.length)
  }

  const getGrade = (score: number): SafetyInspection['grade'] => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  const addInspectionItem = () => {
    const newItem: InspectionItem = {
      id: Date.now().toString(),
      category: currentSection,
      item: '',
      standard: '',
      current: '',
      score: 0,
      priority: 'medium'
    }

    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections!,
        [currentSection]: [...(prev.sections![currentSection] || []), newItem]
      }
    }))
  }

  const updateInspectionItem = (itemId: string, field: keyof InspectionItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections!,
        [currentSection]: prev.sections![currentSection].map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      }
    }))
  }

  const removeInspectionItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections!,
        [currentSection]: prev.sections![currentSection].filter(item => item.id !== itemId)
      }
    }))
  }

  const addImprovementPlan = () => {
    setFormData(prev => ({
      ...prev,
      improvementPlan: [
        ...(prev.improvementPlan || []),
        {
          item: '',
          deadline: '',
          responsible: '',
          status: 'pending'
        }
      ]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalScore = calculateTotalScore()
    const grade = getGrade(totalScore)
    
    if (onSave) {
      onSave({
        ...formData,
        totalScore,
        grade
      })
    }
  }

  React.useEffect(() => {
    setProgress(calculateProgress())
  }, [formData])

  const sectionTitles = {
    equipment: '장비 안전',
    environment: '작업환경',
    process: '작업절차',
    emergency: '비상대응'
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>월간 정밀안전진단</span>
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
              <Label htmlFor="month">진단 월</Label>
              <Input
                id="month"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="inspectionDate">진단일</Label>
              <Input
                id="inspectionDate"
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
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
              <Label htmlFor="inspector">진단자</Label>
              <Input
                id="inspector"
                value={formData.inspector}
                onChange={(e) => setFormData(prev => ({ ...prev, inspector: e.target.value }))}
                placeholder="진단자 이름"
                required
              />
            </div>
          </div>

          {/* 점검 섹션 탭 */}
          <div>
            <div className="flex gap-2 mb-4 border-b">
              {(Object.keys(sectionTitles) as Array<keyof typeof sectionTitles>).map(section => (
                <Button
                  key={section}
                  type="button"
                  variant={currentSection === section ? 'default' : 'ghost'}
                  onClick={() => setCurrentSection(section)}
                  className="rounded-b-none"
                >
                  {sectionTitles[section]}
                  {formData.sections?.[section]?.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {formData.sections[section].length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* 점검 항목 */}
            <div className="space-y-4">
              {formData.sections?.[currentSection]?.map((item, index) => (
                <Card key={item.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>점검 항목</Label>
                      <Input
                        value={item.item}
                        onChange={(e) => updateInspectionItem(item.id, 'item', e.target.value)}
                        placeholder="점검 항목 입력"
                      />
                    </div>
                    <div>
                      <Label>기준</Label>
                      <Input
                        value={item.standard}
                        onChange={(e) => updateInspectionItem(item.id, 'standard', e.target.value)}
                        placeholder="평가 기준"
                      />
                    </div>
                    <div>
                      <Label>현재 상태</Label>
                      <Input
                        value={item.current}
                        onChange={(e) => updateInspectionItem(item.id, 'current', e.target.value)}
                        placeholder="현재 상태"
                      />
                    </div>
                    <div>
                      <Label>점수 (0-100)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.score}
                        onChange={(e) => updateInspectionItem(item.id, 'score', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>우선순위</Label>
                      <Select
                        value={item.priority}
                        onValueChange={(value) => updateInspectionItem(item.id, 'priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">높음</SelectItem>
                          <SelectItem value="medium">보통</SelectItem>
                          <SelectItem value="low">낮음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>개선사항</Label>
                      <Textarea
                        value={item.improvement || ''}
                        onChange={(e) => updateInspectionItem(item.id, 'improvement', e.target.value)}
                        placeholder="개선이 필요한 사항"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeInspectionItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge className={priorityColors[item.priority]}>
                      우선순위: {item.priority === 'high' ? '높음' : item.priority === 'medium' ? '보통' : '낮음'}
                    </Badge>
                  </div>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addInspectionItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {sectionTitles[currentSection]} 항목 추가
              </Button>
            </div>
          </div>

          {/* 종합 점수 및 등급 */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">종합 평가</h3>
                <p className="text-sm text-gray-600">모든 섹션의 평균 점수</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{calculateTotalScore()}점</div>
                <Badge className={`text-lg ${
                  getGrade(calculateTotalScore()) === 'A' ? 'bg-green-500' :
                  getGrade(calculateTotalScore()) === 'B' ? 'bg-blue-500' :
                  getGrade(calculateTotalScore()) === 'C' ? 'bg-yellow-500' :
                  getGrade(calculateTotalScore()) === 'D' ? 'bg-orange-500' :
                  'bg-red-500'
                }`}>
                  {getGrade(calculateTotalScore())}등급
                </Badge>
              </div>
            </div>
          </Card>

          {/* 주요 발견사항 */}
          <div>
            <Label>주요 발견사항</Label>
            {formData.majorFindings?.map((finding, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={finding}
                  onChange={(e) => {
                    const newFindings = [...(formData.majorFindings || [])]
                    newFindings[index] = e.target.value
                    setFormData(prev => ({ ...prev, majorFindings: newFindings }))
                  }}
                  placeholder="주요 발견사항 입력"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newFindings = formData.majorFindings?.filter((_, i) => i !== index)
                    setFormData(prev => ({ ...prev, majorFindings: newFindings }))
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
                majorFindings: [...(prev.majorFindings || []), '']
              }))}
            >
              <Plus className="h-4 w-4 mr-2" />
              발견사항 추가
            </Button>
          </div>

          {/* 개선 계획 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">개선 계획</h3>
            {formData.improvementPlan?.map((plan, index) => (
              <Card key={index} className="p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>개선 항목</Label>
                    <Input
                      value={plan.item}
                      onChange={(e) => {
                        const newPlans = [...(formData.improvementPlan || [])]
                        newPlans[index] = { ...plan, item: e.target.value }
                        setFormData(prev => ({ ...prev, improvementPlan: newPlans }))
                      }}
                      placeholder="개선이 필요한 항목"
                    />
                  </div>
                  <div>
                    <Label>마감일</Label>
                    <Input
                      type="date"
                      value={plan.deadline}
                      onChange={(e) => {
                        const newPlans = [...(formData.improvementPlan || [])]
                        newPlans[index] = { ...plan, deadline: e.target.value }
                        setFormData(prev => ({ ...prev, improvementPlan: newPlans }))
                      }}
                    />
                  </div>
                  <div>
                    <Label>담당자</Label>
                    <Input
                      value={plan.responsible}
                      onChange={(e) => {
                        const newPlans = [...(formData.improvementPlan || [])]
                        newPlans[index] = { ...plan, responsible: e.target.value }
                        setFormData(prev => ({ ...prev, improvementPlan: newPlans }))
                      }}
                      placeholder="담당자 이름"
                    />
                  </div>
                  <div>
                    <Label>상태</Label>
                    <Select
                      value={plan.status}
                      onValueChange={(value) => {
                        const newPlans = [...(formData.improvementPlan || [])]
                        newPlans[index] = { ...plan, status: value as any }
                        setFormData(prev => ({ ...prev, improvementPlan: newPlans }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">대기중</SelectItem>
                        <SelectItem value="in-progress">진행중</SelectItem>
                        <SelectItem value="completed">완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newPlans = formData.improvementPlan?.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, improvementPlan: newPlans }))
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addImprovementPlan}
            >
              <Plus className="h-4 w-4 mr-2" />
              개선 계획 추가
            </Button>
          </div>

          {/* 첨부파일 */}
          <div>
            <Label>첨부파일</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-gray-500 mt-1">PDF, 이미지 파일 (최대 10MB)</p>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              임시 저장
            </Button>
            <Button type="submit">
              <FileText className="h-4 w-4 mr-2" />
              진단서 저장
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}