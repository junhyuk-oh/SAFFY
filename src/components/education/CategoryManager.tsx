"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display'
import { Button } from '@/components/ui/forms/button'
import { Input } from '@/components/ui/forms'
import { Label } from '@/components/ui/forms'
import { Badge } from '@/components/ui/display'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  X,
  Calendar,
  Users,
  Clock
} from 'lucide-react'

interface EducationCategory {
  id: string
  name: string
  description: string
  frequency: string
  duration: number
  targetAudience: string[]
  mandatory: boolean
  createdAt: string
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<EducationCategory[]>([
    {
      id: '1',
      name: '정기안전교육',
      description: '전 직원 대상 정기 안전교육',
      frequency: '분기별',
      duration: 2,
      targetAudience: ['전체 직원'],
      mandatory: true,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: '신규자교육',
      description: '신입 직원 및 연구원 대상 기초 안전교육',
      frequency: '입사시',
      duration: 8,
      targetAudience: ['신규 입사자'],
      mandatory: true,
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      name: '특별안전교육',
      description: '특정 위험 작업 종사자 대상 교육',
      frequency: '연간',
      duration: 4,
      targetAudience: ['화학물질 취급자', '고압가스 취급자', '방사선 작업자'],
      mandatory: true,
      createdAt: '2024-01-15'
    }
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<EducationCategory>>({
    name: '',
    description: '',
    frequency: '',
    duration: 0,
    targetAudience: [],
    mandatory: true
  })

  const frequencies = ['매일', '주간', '월간', '분기별', '반기별', '연간', '입사시', '필요시']

  const handleAddNew = () => {
    setIsAddingNew(true)
    setFormData({
      name: '',
      description: '',
      frequency: '',
      duration: 0,
      targetAudience: [],
      mandatory: true
    })
  }

  const handleEdit = (category: EducationCategory) => {
    setEditingId(category.id)
    setFormData(category)
  }

  const handleSave = () => {
    if (isAddingNew) {
      const newCategory: EducationCategory = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        frequency: formData.frequency || '',
        duration: formData.duration || 0,
        targetAudience: formData.targetAudience || [],
        mandatory: formData.mandatory ?? true,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setCategories([...categories, newCategory])
      setIsAddingNew(false)
    } else if (editingId) {
      setCategories(categories.map(cat => 
        cat.id === editingId ? { ...cat, ...formData } : cat
      ))
      setEditingId(null)
    }
    setFormData({})
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
    setFormData({})
  }

  const handleDelete = (id: string) => {
    if (confirm('이 교육 카테고리를 삭제하시겠습니까?')) {
      setCategories(categories.filter(cat => cat.id !== id))
    }
  }

  const handleTargetAudienceChange = (value: string) => {
    const audiences = value.split(',').map(a => a.trim()).filter(a => a)
    setFormData({ ...formData, targetAudience: audiences })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">교육 카테고리 관리</h2>
        <Button onClick={handleAddNew} disabled={isAddingNew}>
          <Plus className="h-4 w-4 mr-2" />
          새 카테고리 추가
        </Button>
      </div>

      {/* 새 카테고리 추가 폼 */}
      {isAddingNew && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-lg">새 교육 카테고리 추가</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">카테고리명*</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 정기안전교육"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">교육 주기*</Label>
                <select
                  id="frequency"
                  className="w-full h-10 px-3 border rounded-md"
                  value={formData.frequency || ''}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="교육 내용에 대한 간단한 설명"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">교육 시간 (시간)*</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="예: 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">대상자 (쉼표로 구분)</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience?.join(', ') || ''}
                  onChange={(e) => handleTargetAudienceChange(e.target.value)}
                  placeholder="예: 전체 직원, 신규 입사자"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.mandatory ?? true}
                    onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                  />
                  필수 교육
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 카테고리 목록 */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            {editingId === category.id ? (
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${category.id}`}>카테고리명</Label>
                    <Input
                      id={`name-${category.id}`}
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`frequency-${category.id}`}>교육 주기</Label>
                    <select
                      id={`frequency-${category.id}`}
                      className="w-full h-10 px-3 border rounded-md"
                      value={formData.frequency || ''}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    >
                      {frequencies.map(freq => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`description-${category.id}`}>설명</Label>
                    <Input
                      id={`description-${category.id}`}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`duration-${category.id}`}>교육 시간</Label>
                    <Input
                      id={`duration-${category.id}`}
                      type="number"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`targetAudience-${category.id}`}>대상자</Label>
                    <Input
                      id={`targetAudience-${category.id}`}
                      value={formData.targetAudience?.join(', ') || ''}
                      onChange={(e) => handleTargetAudienceChange(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    취소
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category.name}
                        {category.mandatory && (
                          <Badge variant="destructive" className="text-xs">필수</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>주기: {category.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>교육시간: {category.duration}시간</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>대상: {category.targetAudience.length}개 그룹</span>
                    </div>
                  </div>
                  {category.targetAudience.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {category.targetAudience.map((audience, idx) => (
                        <Badge key={idx} variant="secondary">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}