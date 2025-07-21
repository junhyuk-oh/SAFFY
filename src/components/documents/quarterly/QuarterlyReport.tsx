"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Download, 
  Save, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  Users,
  Target,
  BarChart,
  PieChart,
  Activity,
  BookOpen,
  Shield
} from 'lucide-react'
import type { QuarterlyReport as QuarterlyReportType, QuarterlySafetyMetrics, QuarterlyImprovement } from '@/lib/types'

export function QuarterlyReport() {
  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3) as 1 | 2 | 3 | 4
  
  const [report, setReport] = useState<Partial<QuarterlyReportType>>({
    year: currentYear,
    quarter: currentQuarter,
    department: '',
    preparedBy: '',
    reviewedBy: '',
    period: {
      start: '',
      end: ''
    },
    performanceMetrics: {
      monthly: [],
      quarterly: {
        totalIncidents: 0,
        totalNearMisses: 0,
        averageSafetyScore: 0,
        totalInspections: 0,
        totalEducationHours: 0,
        averageParticipationRate: 0,
        kpiAchievement: 0
      },
      comparison: {
        previousQuarter: {
          incidents: 0,
          improvement: 0
        },
        previousYear: {
          incidents: 0,
          improvement: 0
        }
      }
    },
    majorIncidents: [],
    improvements: [],
    educationSummary: {
      totalSessions: 0,
      totalParticipants: 0,
      topics: [],
      effectiveness: 0,
      feedback: []
    },
    riskAssessmentSummary: {
      totalAssessments: 0,
      newHazardsIdentified: 0,
      resolvedHazards: 0,
      criticalRisks: 0,
      riskReductionRate: 0
    },
    budgetExecution: {
      allocated: 0,
      spent: 0,
      categories: {
        equipment: 0,
        training: 0,
        consulting: 0,
        other: 0
      },
      executionRate: 0
    },
    nextQuarterPlan: {
      focusAreas: [],
      plannedActivities: [],
      budgetRequest: 0
    },
    conclusions: [],
    recommendations: []
  })

  const [activeSection, setActiveSection] = useState<string>('overview')

  const sections = [
    { id: 'overview', label: '개요', icon: FileText },
    { id: 'performance', label: '안전 성과', icon: BarChart },
    { id: 'incidents', label: '사고 분석', icon: AlertCircle },
    { id: 'improvements', label: '개선 활동', icon: TrendingUp },
    { id: 'education', label: '교육 훈련', icon: BookOpen },
    { id: 'risk', label: '위험성 평가', icon: Shield },
    { id: 'budget', label: '예산 집행', icon: DollarSign },
    { id: 'next-quarter', label: '차기 계획', icon: Target },
    { id: 'conclusion', label: '결론 및 제언', icon: CheckCircle }
  ]

  const mockMonthlyData: QuarterlySafetyMetrics[] = [
    {
      month: '2024-01',
      incidents: 2,
      nearMisses: 5,
      safetyScore: 85,
      inspectionCount: 12,
      educationHours: 24,
      participationRate: 92
    },
    {
      month: '2024-02',
      incidents: 1,
      nearMisses: 3,
      safetyScore: 88,
      inspectionCount: 10,
      educationHours: 20,
      participationRate: 95
    },
    {
      month: '2024-03',
      incidents: 0,
      nearMisses: 2,
      safetyScore: 92,
      inspectionCount: 14,
      educationHours: 28,
      participationRate: 98
    }
  ]

  const getQuarterString = (quarter: number) => {
    const quarters = ['1분기', '2분기', '3분기', '4분기']
    return quarters[quarter - 1]
  }

  const getStatusColor = (value: number, reverse: boolean = false) => {
    if (reverse) {
      if (value > 10) return 'text-red-600'
      if (value > 5) return 'text-yellow-600'
      return 'text-green-600'
    } else {
      if (value < 50) return 'text-red-600'
      if (value < 80) return 'text-yellow-600'
      return 'text-green-600'
    }
  }

  const handleSave = async () => {
    // API 호출 로직
    console.log('Saving quarterly report:', report)
  }

  const handleExport = () => {
    // PDF 내보내기 로직
    console.log('Exporting quarterly report as PDF')
  }

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="year">연도</Label>
          <Input
            id="year"
            type="number"
            value={report.year}
            onChange={(e) => setReport({ ...report, year: parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="quarter">분기</Label>
          <Select
            value={report.quarter?.toString()}
            onValueChange={(value) => setReport({ ...report, quarter: parseInt(value) as 1 | 2 | 3 | 4 })}
          >
            <option value="1">1분기 (1-3월)</option>
            <option value="2">2분기 (4-6월)</option>
            <option value="3">3분기 (7-9월)</option>
            <option value="4">4분기 (10-12월)</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="department">부서</Label>
          <Input
            id="department"
            value={report.department}
            onChange={(e) => setReport({ ...report, department: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="preparedBy">작성자</Label>
          <Input
            id="preparedBy"
            value={report.preparedBy}
            onChange={(e) => setReport({ ...report, preparedBy: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reviewedBy">검토자</Label>
        <Input
          id="reviewedBy"
          value={report.reviewedBy}
          onChange={(e) => setReport({ ...report, reviewedBy: e.target.value })}
          className="mt-1"
        />
      </div>

      {/* 분기 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 사고 건수</p>
              <p className="text-2xl font-bold">3건</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingDown className="w-3 h-3 mr-1" />
                전분기 대비 25% 감소
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">평균 안전 점수</p>
              <p className="text-2xl font-bold">88.3점</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                전분기 대비 5.2점 상승
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">KPI 달성률</p>
              <p className="text-2xl font-bold">92%</p>
              <Progress value={92} className="mt-2 h-2" />
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">예산 집행률</p>
              <p className="text-2xl font-bold">78.5%</p>
              <Progress value={78.5} className="mt-2 h-2" />
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>
    </div>
  )

  const renderPerformanceSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">월별 안전 성과 지표</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                월
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                아차사고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                안전점수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                점검횟수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                교육시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                참여율
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockMonthlyData.map((month, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {month.month}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(month.incidents, true)}`}>
                  {month.incidents}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(month.nearMisses, true)}`}>
                  {month.nearMisses}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(month.safetyScore)}`}>
                  {month.safetyScore}점
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {month.inspectionCount}회
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {month.educationHours}시간
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(month.participationRate)}`}>
                  {month.participationRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 분기 종합 성과 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">분기 종합 성과</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">총 사고 건수</p>
            <p className="text-xl font-bold">3건</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">총 아차사고</p>
            <p className="text-xl font-bold">10건</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">평균 안전점수</p>
            <p className="text-xl font-bold">88.3점</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">총 점검 횟수</p>
            <p className="text-xl font-bold">36회</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">총 교육시간</p>
            <p className="text-xl font-bold">72시간</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">평균 참여율</p>
            <p className="text-xl font-bold">95%</p>
          </div>
        </div>
      </Card>

      {/* 전기 대비 비교 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">전기 대비 성과 비교</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">전분기 대비</span>
              <span className="text-sm font-semibold text-green-600">25% 개선</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">전년 동기 대비</span>
              <span className="text-sm font-semibold text-green-600">40% 개선</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  )

  const renderIncidentsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">주요 사고 및 조치사항</h3>
        <Button size="sm">
          사고 추가
        </Button>
      </div>

      <div className="space-y-4">
        {/* 사고 카드 예시 */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold">화학물질 누출 사고</h4>
              <p className="text-sm text-gray-600">2024-02-15 | 제2연구동 화학실험실</p>
            </div>
            <Badge variant="destructive">진행중</Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">사고 내용</p>
              <p className="text-sm text-gray-600">염산 용액 보관 용기 파손으로 인한 소량 누출</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">근본 원인</p>
              <p className="text-sm text-gray-600">용기 노후화 및 정기 점검 미흡</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">시정 조치</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>즉시 중화제 처리 및 환기 실시</li>
                <li>모든 화학물질 보관 용기 전수 점검</li>
                <li>노후 용기 전량 교체</li>
              </ul>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">예방 대책</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>화학물질 보관 용기 월별 정기 점검 제도화</li>
                <li>용기 교체 주기 단축 (3년 → 2년)</li>
                <li>화학물질 취급자 재교육 실시</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* 사고 통계 요약 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">사고 유형별 분석</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">화학물질 관련</span>
            <div className="flex items-center">
              <Progress value={40} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">2건</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">기계/장비 관련</span>
            <div className="flex items-center">
              <Progress value={20} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">1건</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">전기 안전</span>
            <div className="flex items-center">
              <Progress value={0} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">0건</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderImprovementsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">개선 활동</h3>
        <Button size="sm">
          개선 활동 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 개선 활동 카드 예시 */}
        <Card className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">비상대응 시스템 개선</h4>
            <Badge variant="success">완료</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">카테고리: 시스템</p>
            <p className="text-sm text-gray-600">영향도: <span className="font-medium text-green-600">높음</span></p>
            <p className="text-sm text-gray-600">비용: 1,200만원</p>
            <p className="text-sm text-gray-600">담당자: 안전관리팀</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">개인보호구 전면 교체</h4>
            <Badge variant="warning">진행중</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">카테고리: 장비</p>
            <p className="text-sm text-gray-600">영향도: <span className="font-medium text-yellow-600">중간</span></p>
            <p className="text-sm text-gray-600">비용: 800만원</p>
            <p className="text-sm text-gray-600">담당자: 구매팀</p>
          </div>
        </Card>
      </div>

      {/* 개선 활동 요약 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">개선 활동 현황</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-600">완료</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">5</p>
            <p className="text-sm text-gray-600">진행중</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">2</p>
            <p className="text-sm text-gray-600">계획</p>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderEducationSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">교육 및 훈련</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">총 교육 횟수</p>
          <p className="text-2xl font-bold">12회</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">총 참가 인원</p>
          <p className="text-2xl font-bold">384명</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">평균 만족도</p>
          <p className="text-2xl font-bold">4.5/5</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">교육 효과성</p>
          <p className="text-2xl font-bold">88%</p>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">주요 교육 주제</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm">화학물질 안전 취급</span>
            <span className="text-sm font-medium">3회 | 96명</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm">비상대응 훈련</span>
            <span className="text-sm font-medium">2회 | 128명</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm">개인보호구 착용법</span>
            <span className="text-sm font-medium">4회 | 80명</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm">위험성평가 실무</span>
            <span className="text-sm font-medium">3회 | 80명</span>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderRiskSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">위험성 평가 요약</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">총 평가 횟수</p>
          <p className="text-2xl font-bold">24회</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">신규 위험요인</p>
          <p className="text-2xl font-bold text-yellow-600">15개</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">해결된 위험요인</p>
          <p className="text-2xl font-bold text-green-600">22개</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">중대 위험</p>
          <p className="text-2xl font-bold text-red-600">3개</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">위험 감소율</p>
          <p className="text-2xl font-bold">68%</p>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">위험 수준별 현황</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">중대 위험</span>
            </div>
            <div className="flex items-center">
              <Progress value={10} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">3개</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm">높은 위험</span>
            </div>
            <div className="flex items-center">
              <Progress value={25} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">8개</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm">중간 위험</span>
            </div>
            <div className="flex items-center">
              <Progress value={40} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">12개</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">낮은 위험</span>
            </div>
            <div className="flex items-center">
              <Progress value={25} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">7개</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderBudgetSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">예산 집행 현황</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="text-md font-semibold mb-4">전체 예산 집행률</h4>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold">78.5%</p>
              <p className="text-sm text-gray-600">15,700만원 / 20,000만원</p>
            </div>
            <Progress value={78.5} className="h-3" />
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-md font-semibold mb-4">카테고리별 집행 현황</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">장비</span>
              <span className="text-sm font-medium">8,500만원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">교육</span>
              <span className="text-sm font-medium">3,200만원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">컨설팅</span>
              <span className="text-sm font-medium">2,000만원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">기타</span>
              <span className="text-sm font-medium">2,000만원</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">주요 집행 내역</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">항목</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">집행일</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">비고</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm">비상대응 시스템 구축</td>
                <td className="px-4 py-2 text-sm font-medium">1,200만원</td>
                <td className="px-4 py-2 text-sm">2024-02-15</td>
                <td className="px-4 py-2 text-sm">완료</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">개인보호구 구매</td>
                <td className="px-4 py-2 text-sm font-medium">800만원</td>
                <td className="px-4 py-2 text-sm">2024-03-10</td>
                <td className="px-4 py-2 text-sm">진행중</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  const renderNextQuarterSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">차기 분기 계획</h3>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">중점 추진 분야</h4>
        <div className="space-y-2">
          <div className="flex items-center p-3 bg-blue-50 rounded">
            <Target className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-sm">화학물질 관리 시스템 전면 개선</span>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded">
            <Target className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-sm">전 직원 비상대응 훈련 실시</span>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded">
            <Target className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-sm">안전문화 개선 프로그램 도입</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">주요 추진 활동</h4>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-medium">화학물질 통합관리 시스템 구축</h5>
            <p className="text-sm text-gray-600 mt-1">일정: 4월 ~ 6월</p>
            <p className="text-sm text-gray-600">예상 성과: 화학물질 사고 50% 감소</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h5 className="font-medium">안전 리더십 교육 프로그램</h5>
            <p className="text-sm text-gray-600 mt-1">일정: 5월 중</p>
            <p className="text-sm text-gray-600">예상 성과: 관리자 안전 인식 향상</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h5 className="font-medium">스마트 안전관리 시스템 도입</h5>
            <p className="text-sm text-gray-600 mt-1">일정: 6월 ~ 7월</p>
            <p className="text-sm text-gray-600">예상 성과: 실시간 모니터링 체계 구축</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">예산 요청</h4>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-2xl font-bold">25,000만원</p>
          <p className="text-sm text-gray-600 mt-1">전분기 대비 25% 증액</p>
        </div>
      </Card>
    </div>
  )

  const renderConclusionSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">결론 및 제언</h3>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">주요 성과</h4>
        <div className="space-y-2">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <p className="text-sm">전분기 대비 사고율 25% 감소 달성</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <p className="text-sm">안전교육 참여율 95% 이상 유지</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <p className="text-sm">위험성평가를 통한 중대위험 요인 3건 제거</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">개선 필요사항</h4>
        <div className="space-y-2">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
            <p className="text-sm">화학물질 관리 체계 전면 개선 필요</p>
          </div>
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
            <p className="text-sm">비상대응 훈련 주기 단축 및 실효성 강화</p>
          </div>
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
            <p className="text-sm">안전문화 정착을 위한 지속적인 캠페인 필요</p>
          </div>
        </div>
      </Card>

      <div>
        <Label htmlFor="recommendations">제언사항</Label>
        <Textarea
          id="recommendations"
          rows={4}
          placeholder="차기 분기 중점 추진사항 및 제언사항을 입력하세요..."
          className="mt-1"
        />
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewSection()
      case 'performance':
        return renderPerformanceSection()
      case 'incidents':
        return renderIncidentsSection()
      case 'improvements':
        return renderImprovementsSection()
      case 'education':
        return renderEducationSection()
      case 'risk':
        return renderRiskSection()
      case 'budget':
        return renderBudgetSection()
      case 'next-quarter':
        return renderNextQuarterSection()
      case 'conclusion':
        return renderConclusionSection()
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">분기별 안전보건 보고서</h1>
            <p className="text-gray-600 mt-1">
              {report.year}년 {getQuarterString(report.quarter || 1)} 종합 보고서
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              PDF 내보내기
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 좌측 네비게이션 */}
        <div className="lg:w-64">
          <Card className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* 우측 컨텐츠 영역 */}
        <div className="flex-1">
          <Card className="p-6">
            {renderSection()}
          </Card>
        </div>
      </div>
    </div>
  )
}