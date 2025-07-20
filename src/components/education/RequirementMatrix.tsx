"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Download,
  User
} from 'lucide-react'

interface Person {
  id: string
  name: string
  department: string
  position: string
  joinDate: string
}

interface EducationRequirement {
  personId: string
  categoryId: string
  categoryName: string
  status: 'completed' | 'pending' | 'overdue'
  completedDate?: string
  dueDate: string
  certificateId?: string
}

export default function RequirementMatrix() {
  const [people] = useState<Person[]>([
    { id: '1', name: '김연구', department: '생명과학부', position: '선임연구원', joinDate: '2022-03-01' },
    { id: '2', name: '이실험', department: '화학과', position: '연구원', joinDate: '2023-01-15' },
    { id: '3', name: '박안전', department: '물리학과', position: '책임연구원', joinDate: '2021-06-01' },
    { id: '4', name: '최신입', department: '생명과학부', position: '연구원', joinDate: '2024-02-01' }
  ])

  const [requirements] = useState<EducationRequirement[]>([
    // 김연구
    { personId: '1', categoryId: '1', categoryName: '정기안전교육', status: 'completed', completedDate: '2024-01-15', dueDate: '2024-03-31' },
    { personId: '1', categoryId: '3', categoryName: '특별안전교육', status: 'pending', dueDate: '2024-03-20' },
    
    // 이실험
    { personId: '2', categoryId: '1', categoryName: '정기안전교육', status: 'overdue', dueDate: '2024-02-28' },
    { personId: '2', categoryId: '2', categoryName: '신규자교육', status: 'completed', completedDate: '2023-01-20', dueDate: '2023-01-31' },
    { personId: '2', categoryId: '3', categoryName: '특별안전교육', status: 'completed', completedDate: '2023-06-15', dueDate: '2024-06-30' },
    
    // 박안전
    { personId: '3', categoryId: '1', categoryName: '정기안전교육', status: 'completed', completedDate: '2024-01-10', dueDate: '2024-03-31' },
    { personId: '3', categoryId: '3', categoryName: '특별안전교육', status: 'completed', completedDate: '2023-12-20', dueDate: '2024-12-31' },
    
    // 최신입
    { personId: '4', categoryId: '1', categoryName: '정기안전교육', status: 'pending', dueDate: '2024-03-31' },
    { personId: '4', categoryId: '2', categoryName: '신규자교육', status: 'overdue', dueDate: '2024-02-15' },
    { personId: '4', categoryId: '3', categoryName: '특별안전교육', status: 'pending', dueDate: '2024-04-30' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'overdue'>('all')

  const educationCategories = ['정기안전교육', '신규자교육', '특별안전교육']

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">이수완료</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500">예정</Badge>
      case 'overdue':
        return <Badge className="bg-red-500">기한초과</Badge>
      default:
        return null
    }
  }

  const calculateDDay = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPersonRequirements = (personId: string) => {
    return requirements.filter(req => req.personId === personId)
  }

  const exportToExcel = () => {
    alert('엑셀 파일로 내보내기 기능은 추후 구현 예정입니다.')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">개인별 교육 이수 현황</h2>
        <Button onClick={exportToExcel}>
          <Download className="h-4 w-4 mr-2" />
          엑셀 다운로드
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름 또는 부서로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
          >
            전체
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('completed')}
          >
            이수완료
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('pending')}
          >
            예정
          </Button>
          <Button
            variant={filterStatus === 'overdue' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('overdue')}
          >
            기한초과
          </Button>
        </div>
      </div>

      {/* 교육 이수 매트릭스 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium sticky left-0 bg-gray-50 z-10">
                    직원 정보
                  </th>
                  {educationCategories.map((category) => (
                    <th key={category} className="text-center p-4 font-medium min-w-[150px]">
                      {category}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPeople.map((person) => {
                  const personReqs = getPersonRequirements(person.id)
                  
                  if (filterStatus !== 'all' && !personReqs.some(req => req.status === filterStatus)) {
                    return null
                  }

                  return (
                    <tr key={person.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{person.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {person.department} • {person.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      {educationCategories.map((category) => {
                        const req = personReqs.find(r => r.categoryName === category)
                        
                        if (!req) {
                          return (
                            <td key={category} className="p-4 text-center">
                              <span className="text-gray-400">-</span>
                            </td>
                          )
                        }

                        const dDay = calculateDDay(req.dueDate)

                        return (
                          <td key={category} className="p-4">
                            <div className="flex flex-col items-center gap-2">
                              {getStatusIcon(req.status)}
                              {req.status === 'completed' ? (
                                <div className="text-center">
                                  <div className="text-sm font-medium text-green-600">
                                    이수완료
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(req.completedDate!).toLocaleDateString('ko-KR')}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div className={`text-sm font-medium ${
                                    req.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                                  }`}>
                                    {dDay < 0 ? `D+${Math.abs(dDay)}` : `D-${dDay}`}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(req.dueDate).toLocaleDateString('ko-KR')}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 범례 */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>이수완료</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-yellow-500" />
          <span>예정</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>기한초과</span>
        </div>
      </div>
    </div>
  )
}