"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Award, Calendar } from 'lucide-react'

interface MonthlyData {
  month: string
  completed: number
  pending: number
  overdue: number
}

interface DepartmentData {
  department: string
  completionRate: number
  totalPeople: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

export default function EducationStats() {
  const [monthlyData] = useState<MonthlyData[]>([
    { month: '1월', completed: 45, pending: 10, overdue: 5 },
    { month: '2월', completed: 52, pending: 8, overdue: 3 },
    { month: '3월', completed: 38, pending: 15, overdue: 7 },
    { month: '4월', completed: 60, pending: 5, overdue: 2 },
    { month: '5월', completed: 55, pending: 12, overdue: 4 },
    { month: '6월', completed: 48, pending: 18, overdue: 6 }
  ])

  const [departmentData] = useState<DepartmentData[]>([
    { department: '생명과학부', completionRate: 85, totalPeople: 20 },
    { department: '화학과', completionRate: 92, totalPeople: 15 },
    { department: '물리학과', completionRate: 78, totalPeople: 18 },
    { department: '의학과', completionRate: 95, totalPeople: 25 },
    { department: '공학부', completionRate: 88, totalPeople: 22 }
  ])

  const [categoryData] = useState<CategoryData[]>([
    { name: '정기안전교육', value: 45, color: '#3B82F6' },
    { name: '신규자교육', value: 20, color: '#10B981' },
    { name: '특별안전교육', value: 25, color: '#F59E0B' },
    { name: '기타교육', value: 10, color: '#8B5CF6' }
  ])

  const totalEducations = monthlyData.reduce((acc, month) => 
    acc + month.completed + month.pending + month.overdue, 0
  )
  const totalCompleted = monthlyData.reduce((acc, month) => acc + month.completed, 0)
  const overallCompletionRate = Math.round((totalCompleted / totalEducations) * 100)

  const currentMonthData = monthlyData[monthlyData.length - 1]
  const previousMonthData = monthlyData[monthlyData.length - 2]
  const completionTrend = currentMonthData.completed - previousMonthData.completed

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">교육 통계 및 분석</h2>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              전체 이수율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallCompletionRate}%</div>
            <Progress value={overallCompletionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              목표: 95% 이상
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              이번 달 이수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthData.completed}건</div>
            <div className="flex items-center gap-1 mt-1">
              {completionTrend > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+{completionTrend}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{completionTrend}</span>
                </>
              )}
              <span className="text-xs text-muted-foreground">전월 대비</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              교육 대상자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departmentData.reduce((acc, dept) => acc + dept.totalPeople, 0)}명
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {departmentData.length}개 부서
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 이수 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5시간</div>
            <p className="text-xs text-muted-foreground mt-1">
              교육당 평균
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 월별 교육 현황 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 교육 이수 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10B981" name="이수완료" />
              <Bar dataKey="pending" fill="#F59E0B" name="진행예정" />
              <Bar dataKey="overdue" fill="#EF4444" name="기한초과" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 부서별 이수율 */}
        <Card>
          <CardHeader>
            <CardTitle>부서별 교육 이수율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.completionRate}% ({dept.totalPeople}명)
                    </span>
                  </div>
                  <Progress 
                    value={dept.completionRate} 
                    className={`h-2 ${
                      dept.completionRate >= 90 ? 'bg-green-100' : 
                      dept.completionRate >= 80 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 교육 카테고리별 분포 */}
        <Card>
          <CardHeader>
            <CardTitle>교육 카테고리별 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 연간 이수율 추이 */}
      <Card>
        <CardHeader>
          <CardTitle>연간 교육 이수율 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={2}
                name="이수 건수"
              />
              <Line 
                type="monotone" 
                dataKey="overdue" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="초과 건수"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}