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
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpen, Clock, MapPin, Plus, Save, Star, Trash2, Upload, Users } from 'lucide-react'
import type { EducationLog, EducationParticipant } from '@/lib/types'

interface EducationLogProps {
  onSave?: (data: Partial<EducationLog>) => void
  initialData?: Partial<EducationLog>
}

export function EducationLog({ onSave, initialData }: EducationLogProps) {
  const [formData, setFormData] = useState<Partial<EducationLog>>(
    initialData || {
      month: new Date().toISOString().slice(0, 7),
      educationDate: new Date().toISOString().split('T')[0],
      title: '',
      type: 'regular',
      instructor: '',
      duration: 60,
      location: '',
      objectives: [],
      content: [],
      participants: [],
      materials: [],
      evaluation: {
        understanding: 0,
        usefulness: 0,
        satisfaction: 0,
        feedback: []
      },
      attachments: []
    }
  )

  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'participants' | 'evaluation'>('basic')

  const calculateProgress = () => {
    const fields = [
      formData.title,
      formData.instructor,
      formData.location,
      formData.objectives?.length,
      formData.content?.length,
      formData.participants?.length,
      formData.evaluation?.understanding
    ]
    const filled = fields.filter(Boolean).length
    return (filled / fields.length) * 100
  }

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...(prev.objectives || []), '']
    }))
  }

  const addContent = () => {
    setFormData(prev => ({
      ...prev,
      content: [...(prev.content || []), {
        section: '',
        details: '',
        duration: 0
      }]
    }))
  }

  const addParticipant = () => {
    const newParticipant: EducationParticipant = {
      id: Date.now().toString(),
      name: '',
      department: '',
      position: '',
      attended: false,
      testScore: undefined
    }
    setFormData(prev => ({
      ...prev,
      participants: [...(prev.participants || []), newParticipant]
    }))
  }

  const updateParticipant = (id: string, field: keyof EducationParticipant, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }))
  }

  const removeParticipant = (id: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.filter(p => p.id !== id)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave(formData)
    }
  }

  React.useEffect(() => {
    setProgress(calculateProgress())
  }, [formData])

  const educationTypes = {
    regular: '정기교육',
    special: '특별교육',
    emergency: '비상교육',
    'new-employee': '신입교육'
  }

  const renderStars = (rating: number, onChange: (value: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>교육일지</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">작성 진행률</span>
              <Progress value={progress} className="w-32" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 탭 네비게이션 */}
          <div className="flex gap-2 border-b">
            <Button
              type="button"
              variant={activeTab === 'basic' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('basic')}
              className="rounded-b-none"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              기본정보
            </Button>
            <Button
              type="button"
              variant={activeTab === 'content' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('content')}
              className="rounded-b-none"
            >
              교육내용
            </Button>
            <Button
              type="button"
              variant={activeTab === 'participants' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('participants')}
              className="rounded-b-none"
            >
              <Users className="h-4 w-4 mr-2" />
              참석자
              {formData.participants && formData.participants.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {formData.participants.length}
                </Badge>
              )}
            </Button>
            <Button
              type="button"
              variant={activeTab === 'evaluation' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('evaluation')}
              className="rounded-b-none"
            >
              평가결과
            </Button>
          </div>

          {/* 기본정보 탭 */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="month">교육 월</Label>
                  <Input
                    id="month"
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="educationDate">교육일</Label>
                  <Input
                    id="educationDate"
                    type="date"
                    value={formData.educationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, educationDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="title">교육 제목</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="예: 월간 안전교육 - 화학물질 취급 안전"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">교육 유형</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'regular' | 'special' | 'new-employee' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(educationTypes).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="instructor">강사</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                    placeholder="강사명"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">교육 시간 (분)</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Input
                      id="duration"
                      type="number"
                      min="0"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      required
                    />
                    <span className="text-sm text-gray-500">분</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">교육 장소</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="교육 장소"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 교육 목표 */}
              <div>
                <Label>교육 목표</Label>
                {formData.objectives?.map((objective, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={objective}
                      onChange={(e) => {
                        const newObjectives = [...(formData.objectives || [])]
                        newObjectives[index] = e.target.value
                        setFormData(prev => ({ ...prev, objectives: newObjectives }))
                      }}
                      placeholder="교육 목표 입력"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newObjectives = formData.objectives?.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, objectives: newObjectives }))
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
                  onClick={addObjective}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  목표 추가
                </Button>
              </div>

              {/* 교육 자료 */}
              <div>
                <Label>교육 자료</Label>
                {formData.materials?.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={material}
                      onChange={(e) => {
                        const newMaterials = [...(formData.materials || [])]
                        newMaterials[index] = e.target.value
                        setFormData(prev => ({ ...prev, materials: newMaterials }))
                      }}
                      placeholder="교육 자료명"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newMaterials = formData.materials?.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, materials: newMaterials }))
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
                    materials: [...(prev.materials || []), '']
                  }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  자료 추가
                </Button>
              </div>
            </div>
          )}

          {/* 교육내용 탭 */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              {formData.content?.map((section, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label>섹션 제목</Label>
                      <Input
                        value={section.section}
                        onChange={(e) => {
                          const newContent = [...(formData.content || [])]
                          newContent[index] = { ...section, section: e.target.value }
                          setFormData(prev => ({ ...prev, content: newContent }))
                        }}
                        placeholder="예: 화학물질 안전 관리"
                      />
                    </div>
                    <div>
                      <Label>상세 내용</Label>
                      <Textarea
                        value={section.details}
                        onChange={(e) => {
                          const newContent = [...(formData.content || [])]
                          newContent[index] = { ...section, details: e.target.value }
                          setFormData(prev => ({ ...prev, content: newContent }))
                        }}
                        placeholder="교육 내용을 상세히 입력하세요"
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label>소요 시간</Label>
                        <Input
                          type="number"
                          min="0"
                          value={section.duration}
                          onChange={(e) => {
                            const newContent = [...(formData.content || [])]
                            newContent[index] = { ...section, duration: parseInt(e.target.value) || 0 }
                            setFormData(prev => ({ ...prev, content: newContent }))
                          }}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-500">분</span>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newContent = formData.content?.filter((_, i) => i !== index)
                          setFormData(prev => ({ ...prev, content: newContent }))
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
                onClick={addContent}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                교육 내용 추가
              </Button>
            </div>
          )}

          {/* 참석자 탭 */}
          {activeTab === 'participants' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">참석자 명단</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addParticipant}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  참석자 추가
                </Button>
              </div>
              
              {formData.participants && formData.participants.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>부서</TableHead>
                      <TableHead>직급</TableHead>
                      <TableHead className="text-center">출석</TableHead>
                      <TableHead className="text-center">평가점수</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>
                          <Input
                            value={participant.name}
                            onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                            placeholder="이름"
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={participant.department}
                            onChange={(e) => updateParticipant(participant.id, 'department', e.target.value)}
                            placeholder="부서"
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={participant.position}
                            onChange={(e) => updateParticipant(participant.id, 'position', e.target.value)}
                            placeholder="직급"
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={participant.attended}
                            onCheckedChange={(checked) => updateParticipant(participant.id, 'attended', checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={participant.testScore || ''}
                            onChange={(e) => updateParticipant(participant.id, 'testScore', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="-"
                            className="w-20 mx-auto"
                            disabled={!participant.attended}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeParticipant(participant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  참석자를 추가하세요
                </div>
              )}

              {/* 출석 통계 */}
              {formData.participants && formData.participants.length > 0 && (
                <Card className="p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {formData.participants.length}
                      </div>
                      <div className="text-sm text-gray-600">전체 인원</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {formData.participants.filter(p => p.attended).length}
                      </div>
                      <div className="text-sm text-gray-600">출석 인원</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {formData.participants.filter(p => p.attended).length > 0
                          ? Math.round((formData.participants.filter(p => p.attended).length / formData.participants.length) * 100)
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-600">출석률</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* 평가결과 탭 */}
          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>내용 이해도</Label>
                  <div className="mt-2">
                    {renderStars(
                      formData.evaluation?.understanding || 0,
                      (value) => setFormData(prev => ({
                        ...prev,
                        evaluation: { ...prev.evaluation!, understanding: value }
                      }))
                    )}
                  </div>
                </div>
                <div>
                  <Label>유용성</Label>
                  <div className="mt-2">
                    {renderStars(
                      formData.evaluation?.usefulness || 0,
                      (value) => setFormData(prev => ({
                        ...prev,
                        evaluation: { ...prev.evaluation!, usefulness: value }
                      }))
                    )}
                  </div>
                </div>
                <div>
                  <Label>만족도</Label>
                  <div className="mt-2">
                    {renderStars(
                      formData.evaluation?.satisfaction || 0,
                      (value) => setFormData(prev => ({
                        ...prev,
                        evaluation: { ...prev.evaluation!, satisfaction: value }
                      }))
                    )}
                  </div>
                </div>
              </div>

              {/* 피드백 */}
              <div>
                <Label>참석자 피드백</Label>
                {formData.evaluation?.feedback?.map((feedback, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Textarea
                      value={feedback}
                      onChange={(e) => {
                        const newFeedback = [...(formData.evaluation?.feedback || [])]
                        newFeedback[index] = e.target.value
                        setFormData(prev => ({
                          ...prev,
                          evaluation: { ...prev.evaluation!, feedback: newFeedback }
                        }))
                      }}
                      placeholder="피드백 내용"
                      rows={2}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newFeedback = formData.evaluation?.feedback?.filter((_, i) => i !== index)
                        setFormData(prev => ({
                          ...prev,
                          evaluation: { ...prev.evaluation!, feedback: newFeedback || [] }
                        }))
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
                    evaluation: {
                      ...prev.evaluation!,
                      feedback: [...(prev.evaluation?.feedback || []), '']
                    }
                  }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  피드백 추가
                </Button>
              </div>

              {/* 개선사항 */}
              <div>
                <Label htmlFor="improvements">개선사항</Label>
                <Textarea
                  id="improvements"
                  value={formData.improvements || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
                  placeholder="다음 교육 시 개선할 사항을 입력하세요"
                  rows={3}
                />
              </div>

              {/* 다음 교육 계획 */}
              <div>
                <Label htmlFor="nextEducationPlan">다음 교육 계획</Label>
                <Textarea
                  id="nextEducationPlan"
                  value={formData.nextEducationPlan || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nextEducationPlan: e.target.value }))}
                  placeholder="다음 교육 계획을 입력하세요"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* 첨부파일 */}
          <div>
            <Label>첨부파일</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-gray-500 mt-1">교육자료, 사진, 출석부 등 (최대 10MB)</p>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              임시 저장
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              교육일지 저장
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}