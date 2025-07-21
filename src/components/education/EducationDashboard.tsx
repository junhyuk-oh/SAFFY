"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  BookOpen,
  AlertTriangle
} from 'lucide-react'

interface EducationStat {
  category: string
  total: number
  completed: number
  pending: number
  overdue: number
}

interface UpcomingEducation {
  id: string
  name: string
  category: string
  dueDate: string
  participants: number
  status: 'upcoming' | 'imminent' | 'overdue'
}

export default function EducationDashboard() {
  const [stats] = useState<EducationStat[]>([
    {
      category: '정기안전교육',
      total: 24,
      completed: 18,
      pending: 4,
      overdue: 2
    },
    {
      category: '신규자교육',
      total: 8,
      completed: 6,
      pending: 2,
      overdue: 0
    },
    {
      category: '특별안전교육',
      total: 12,
      completed: 10,
      pending: 1,
      overdue: 1
    }
  ])

  const [upcomingEducations] = useState<UpcomingEducation[]>([
    {
      id: '1',
      name: '2024년 1분기 정기안전교육',
      category: '정기안전교육',
      dueDate: '2024-03-15',
      participants: 15,
      status: 'imminent'
    },
    {
      id: '2',
      name: '화학물질 취급 안전교육',
      category: '특별안전교육',
      dueDate: '2024-03-20',
      participants: 8,
      status: 'upcoming'
    },
    {
      id: '3',
      name: '신입연구원 안전교육',
      category: '신규자교육',
      dueDate: '2024-02-28',
      participants: 3,
      status: 'overdue'
    }
  ])

  const calculateDDay = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500">예정</Badge>
      case 'imminent':
        return <Badge className="bg-yellow-500">임박</Badge>
      case 'overdue':
        return <Badge className="bg-red-500">초과</Badge>
      default:
        return null
    }
  }

  const totalStats = stats.reduce(
    (acc, stat) => ({
      total: acc.total + stat.total,
      completed: acc.completed + stat.completed,
      pending: acc.pending + stat.pending,
      overdue: acc.overdue + stat.overdue
    }),
    { total: 0, completed: 0, pending: 0, overdue: 0 }
  )

  const completionRate = Math.round((totalStats.completed / totalStats.total) * 100)

  return (
    <div className="space-y-6">
      {/* 전체 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              전체 교육
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.total}</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              이수율 {completionRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              이수 완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalStats.completed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              전체의 {Math.round((totalStats.completed / totalStats.total) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              진행 예정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {totalStats.pending}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              30일 이내 예정
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              기한 초과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalStats.overdue}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              즉시 조치 필요
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 카테고리별 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리별 교육 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{stat.category}</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{stat.total}건</Badge>
                    {stat.overdue > 0 && (
                      <Badge variant="destructive">{stat.overdue}건 초과</Badge>
                    )}
                  </div>
                </div>
                <Progress 
                  value={(stat.completed / stat.total) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>이수: {stat.completed}건</span>
                  <span>예정: {stat.pending}건</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 긴급 알림 및 예정 교육 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            교육 일정 알림
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEducations.map((education) => {
              const dDay = calculateDDay(education.dueDate)
              return (
                <div
                  key={education.id}
                  className={`p-4 rounded-lg border ${
                    education.status === 'overdue' 
                      ? 'border-red-200 bg-red-50' 
                      : education.status === 'imminent'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{education.name}</h4>
                        {getStatusBadge(education.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {education.category} • 대상자 {education.participants}명
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        dDay < 0 ? 'text-red-600' : dDay <= 7 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {dDay < 0 ? `D+${Math.abs(dDay)}` : `D-${dDay}`}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(education.dueDate).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}