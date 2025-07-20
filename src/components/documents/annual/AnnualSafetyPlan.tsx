"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Download, 
  Save, 
  Target, 
  Calendar,
  DollarSign,
  BookOpen,
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  TrendingUp,
  Award,
  Briefcase,
  Clock,
  BarChart
} from 'lucide-react'
import type { 
  AnnualSafetyPlan as AnnualSafetyPlanType, 
  AnnualGoal, 
  AnnualBudgetItem,
  AnnualEducationPlan,
  AnnualInspectionSchedule 
} from '@/lib/types/documents'

export function AnnualSafetyPlan() {
  const currentYear = new Date().getFullYear()
  
  const [plan, setPlan] = useState<Partial<AnnualSafetyPlanType>>({
    year: currentYear + 1, // 차년도 계획
    department: '',
    preparedBy: '',
    approvedBy: '',
    previousYearAnalysis: {
      achievements: [],
      challenges: [],
      incidentTrend: {
        total: 0,
        byType: {},
        reduction: 0
      },
      complianceRate: 0
    },
    annualGoals: [],
    budgetPlan: {
      totalBudget: 0,
      breakdown: {
        safetyEquipment: 0,
        education: 0,
        inspection: 0,
        consulting: 0,
        emergency: 0,
        other: 0
      },
      details: [],
      contingency: 0
    },
    educationPlan: {
      mandatoryPrograms: [],
      developmentPrograms: [],
      totalHours: 0,
      totalBudget: 0
    },
    inspectionPlan: {
      schedule: [],
      externalInspections: []
    },
    riskAssessmentPlan: {
      regularAssessment: {
        frequency: 'monthly',
        scope: [],
        methodology: ''
      },
      specialAssessment: {
        trigger: [],
        process: ''
      },
      targetRiskReduction: 0
    },
    emergencyResponsePlan: {
      drills: [],
      equipmentMaintenance: [],
      trainingRequired: []
    },
    managementSystem: {
      certifications: [],
      internalAudits: [],
      managementReview: {
        frequency: '',
        participants: [],
        agenda: []
      }
    },
    kpiTargets: [],
    implementationPlan: []
  })

  const [activeSection, setActiveSection] = useState<string>('overview')

  const sections = [
    { id: 'overview', label: '개요', icon: FileText },
    { id: 'previous-year', label: '전년도 분석', icon: BarChart },
    { id: 'goals', label: '연간 목표', icon: Target },
    { id: 'budget', label: '예산 계획', icon: DollarSign },
    { id: 'education', label: '교육 계획', icon: BookOpen },
    { id: 'inspection', label: '점검 일정', icon: CheckCircle },
    { id: 'risk', label: '위험성 평가', icon: Shield },
    { id: 'emergency', label: '비상대응', icon: AlertTriangle },
    { id: 'management', label: '경영시스템', icon: Award },
    { id: 'kpi', label: '성과 지표', icon: TrendingUp },
    { id: 'implementation', label: '이행 계획', icon: Calendar }
  ]

  const goalCategories = [
    { value: 'incident-reduction', label: '사고 감소' },
    { value: 'education', label: '교육 훈련' },
    { value: 'compliance', label: '법규 준수' },
    { value: 'culture', label: '안전 문화' },
    { value: 'system-improvement', label: '시스템 개선' }
  ]

  const handleSave = async () => {
    // API 호출 로직
    console.log('Saving annual safety plan:', plan)
  }

  const handleExport = () => {
    // PDF 내보내기 로직
    console.log('Exporting annual safety plan as PDF')
  }

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="year">계획 연도</Label>
          <Input
            id="year"
            type="number"
            value={plan.year}
            onChange={(e) => setPlan({ ...plan, year: parseInt(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="department">부서</Label>
          <Input
            id="department"
            value={plan.department}
            onChange={(e) => setPlan({ ...plan, department: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="preparedBy">작성자</Label>
          <Input
            id="preparedBy"
            value={plan.preparedBy}
            onChange={(e) => setPlan({ ...plan, preparedBy: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="approvedBy">승인자</Label>
          <Input
            id="approvedBy"
            value={plan.approvedBy}
            onChange={(e) => setPlan({ ...plan, approvedBy: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      {/* 연간 계획 요약 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">연간 안전보건 계획 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">목표 사고율 감소</p>
                <p className="text-2xl font-bold">50%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 예산</p>
                <p className="text-2xl font-bold">10억원</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">교육 시간</p>
                <p className="text-2xl font-bold">480시간</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">점검 횟수</p>
                <p className="text-2xl font-bold">156회</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderPreviousYearSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">전년도 성과 분석</h3>

      {/* 주요 성과 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">주요 성과</h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">사고율 30% 감소 달성</p>
              <p className="text-sm text-gray-600">전년 대비 중대사고 없음, 경미사고 30% 감소</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">ISO 45001 인증 획득</p>
              <p className="text-sm text-gray-600">안전보건경영시스템 국제 표준 인증</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">전 직원 안전교육 100% 이수</p>
              <p className="text-sm text-gray-600">법정 의무교육 및 직무별 전문교육 완료</p>
            </div>
          </div>
        </div>
        <Button size="sm" className="mt-4">
          성과 추가
        </Button>
      </Card>

      {/* 도전 과제 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">도전 과제 및 교훈</h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">화학물질 관리 체계 미흡</p>
              <p className="text-sm text-gray-600">근본 원인: 통합 관리 시스템 부재</p>
              <p className="text-sm text-gray-600">교훈: 디지털 시스템 도입 필요성 확인</p>
            </div>
          </div>
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">비상대응 훈련 참여율 저조</p>
              <p className="text-sm text-gray-600">근본 원인: 업무 일정 조율 어려움</p>
              <p className="text-sm text-gray-600">교훈: 부서별 맞춤형 훈련 일정 필요</p>
            </div>
          </div>
        </div>
        <Button size="sm" className="mt-4">
          과제 추가
        </Button>
      </Card>

      {/* 사고 동향 분석 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">사고 동향 분석</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">사고 유형별 현황</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">화학물질 관련</span>
                <div className="flex items-center">
                  <Progress value={40} className="w-24 h-2 mr-2" />
                  <span className="text-sm font-medium">8건</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">기계 장비</span>
                <div className="flex items-center">
                  <Progress value={30} className="w-24 h-2 mr-2" />
                  <span className="text-sm font-medium">6건</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">전기 안전</span>
                <div className="flex items-center">
                  <Progress value={20} className="w-24 h-2 mr-2" />
                  <span className="text-sm font-medium">4건</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">기타</span>
                <div className="flex items-center">
                  <Progress value={10} className="w-24 h-2 mr-2" />
                  <span className="text-sm font-medium">2건</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">전체 현황</p>
            <div className="text-center py-4">
              <p className="text-4xl font-bold">20건</p>
              <p className="text-sm text-gray-600">총 사고 건수</p>
              <p className="text-lg font-semibold text-green-600 mt-2">↓ 30%</p>
              <p className="text-sm text-gray-600">전년 대비 감소</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 법규 준수율 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">법규 준수율</h4>
        <div className="text-center">
          <p className="text-4xl font-bold">98.5%</p>
          <Progress value={98.5} className="mt-4 h-3" />
          <p className="text-sm text-gray-600 mt-2">2건의 경미한 미준수 사항 시정 완료</p>
        </div>
      </Card>
    </div>
  )

  const renderGoalsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">연간 안전보건 목표</h3>
        <Button size="sm">
          목표 추가
        </Button>
      </div>

      {/* 목표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="destructive">중요</Badge>
              <h4 className="font-semibold mt-2">무재해 사업장 달성</h4>
            </div>
            <Target className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">카테고리: 사고 감소</p>
            <p className="text-sm text-gray-600">목표: 중대재해 0건, 경미사고 50% 감소</p>
            <p className="text-sm text-gray-600">측정 지표: 사고 발생률</p>
            <p className="text-sm text-gray-600">기준값: 20건 → 목표값: 10건</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="warning">높음</Badge>
              <h4 className="font-semibold mt-2">안전문화 정착</h4>
            </div>
            <Users className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">카테고리: 안전 문화</p>
            <p className="text-sm text-gray-600">목표: 자율 안전관리 체계 구축</p>
            <p className="text-sm text-gray-600">측정 지표: 안전문화 성숙도</p>
            <p className="text-sm text-gray-600">기준값: Level 2 → 목표값: Level 4</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="warning">높음</Badge>
              <h4 className="font-semibold mt-2">교육 효과성 향상</h4>
            </div>
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">카테고리: 교육</p>
            <p className="text-sm text-gray-600">목표: 실무 중심 교육 강화</p>
            <p className="text-sm text-gray-600">측정 지표: 교육 만족도 및 현장 적용률</p>
            <p className="text-sm text-gray-600">기준값: 75% → 목표값: 90%</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="secondary">중간</Badge>
              <h4 className="font-semibold mt-2">디지털 전환</h4>
            </div>
            <BarChart className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">카테고리: 시스템 개선</p>
            <p className="text-sm text-gray-600">목표: 스마트 안전관리 시스템 구축</p>
            <p className="text-sm text-gray-600">측정 지표: 디지털화율</p>
            <p className="text-sm text-gray-600">기준값: 30% → 목표값: 80%</p>
          </div>
        </Card>
      </div>

      {/* 목표 달성 전략 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">목표 달성 전략</h4>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-medium">예방 중심 관리</h5>
            <p className="text-sm text-gray-600">위험성평가 강화, 예방정비 체계화</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h5 className="font-medium">전원 참여</h5>
            <p className="text-sm text-gray-600">안전 제안 제도 활성화, 부서별 안전 리더 육성</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h5 className="font-medium">시스템 혁신</h5>
            <p className="text-sm text-gray-600">IoT 기반 실시간 모니터링, AI 예측 분석 도입</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h5 className="font-medium">지속적 개선</h5>
            <p className="text-sm text-gray-600">PDCA 사이클 적용, 정기 성과 검토</p>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderBudgetSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">예산 계획</h3>

      {/* 전체 예산 개요 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">전체 예산 개요</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">총 예산</p>
            <p className="text-3xl font-bold">10억원</p>
            <p className="text-sm text-gray-600 mt-1">전년 대비 25% 증액</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-3">부문별 배분</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>안전장비</span>
                <span className="font-medium">4억원 (40%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>교육훈련</span>
                <span className="font-medium">2억원 (20%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>점검/검사</span>
                <span className="font-medium">1.5억원 (15%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>컨설팅</span>
                <span className="font-medium">1억원 (10%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>비상대응</span>
                <span className="font-medium">1억원 (10%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>예비비</span>
                <span className="font-medium">0.5억원 (5%)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 주요 투자 계획 */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold">주요 투자 계획</h4>
          <Button size="sm">
            항목 추가
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">항목</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">수량</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">단가</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">총액</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">시기</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm">안전장비</td>
                <td className="px-4 py-2 text-sm">가스 감지기</td>
                <td className="px-4 py-2 text-sm">50대</td>
                <td className="px-4 py-2 text-sm">200만원</td>
                <td className="px-4 py-2 text-sm font-medium">1억원</td>
                <td className="px-4 py-2 text-sm">1분기</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">시스템</td>
                <td className="px-4 py-2 text-sm">통합관제시스템</td>
                <td className="px-4 py-2 text-sm">1식</td>
                <td className="px-4 py-2 text-sm">2억원</td>
                <td className="px-4 py-2 text-sm font-medium">2억원</td>
                <td className="px-4 py-2 text-sm">2분기</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">교육</td>
                <td className="px-4 py-2 text-sm">VR 교육 시스템</td>
                <td className="px-4 py-2 text-sm">1식</td>
                <td className="px-4 py-2 text-sm">5천만원</td>
                <td className="px-4 py-2 text-sm font-medium">5천만원</td>
                <td className="px-4 py-2 text-sm">1분기</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 분기별 집행 계획 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">분기별 집행 계획</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">1분기</span>
              <span className="text-sm font-medium">3.5억원 (35%)</span>
            </div>
            <Progress value={35} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">2분기</span>
              <span className="text-sm font-medium">3억원 (30%)</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">3분기</span>
              <span className="text-sm font-medium">2억원 (20%)</span>
            </div>
            <Progress value={20} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">4분기</span>
              <span className="text-sm font-medium">1.5억원 (15%)</span>
            </div>
            <Progress value={15} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  )

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">교육 훈련 계획</h3>
        <Button size="sm">
          교육 추가
        </Button>
      </div>

      {/* 교육 개요 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">총 교육 시간</p>
          <p className="text-2xl font-bold">480시간</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">법정 의무교육</p>
          <p className="text-2xl font-bold">12개 과정</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">전문교육</p>
          <p className="text-2xl font-bold">8개 과정</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">교육 예산</p>
          <p className="text-2xl font-bold">2억원</p>
        </Card>
      </div>

      {/* 법정 의무교육 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">법정 의무교육 프로그램</h4>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">정기 안전보건교육</h5>
                <p className="text-sm text-gray-600 mt-1">대상: 전 직원</p>
                <p className="text-sm text-gray-600">주기: 분기별 (연 4회)</p>
                <p className="text-sm text-gray-600">시간: 회당 6시간</p>
              </div>
              <Badge>의무</Badge>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium">교육 내용</p>
              <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                <li>산업안전보건법 주요 내용</li>
                <li>작업장 안전 수칙</li>
                <li>위험물질 취급 방법</li>
                <li>응급처치 및 대피 요령</li>
              </ul>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">관리감독자 교육</h5>
                <p className="text-sm text-gray-600 mt-1">대상: 부서장 및 팀장</p>
                <p className="text-sm text-gray-600">주기: 연 1회</p>
                <p className="text-sm text-gray-600">시간: 16시간</p>
              </div>
              <Badge>의무</Badge>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium">교육 내용</p>
              <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                <li>안전보건 관리체계 구축</li>
                <li>위험성평가 실무</li>
                <li>사고 조사 및 대책 수립</li>
                <li>안전 리더십</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* 전문 개발교육 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">전문 개발교육 프로그램</h4>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">스마트 안전관리 시스템 교육</h5>
                <p className="text-sm text-gray-600 mt-1">대상: 안전관리자 및 현장 책임자</p>
                <p className="text-sm text-gray-600">주기: 상반기 1회</p>
                <p className="text-sm text-gray-600">시간: 24시간 (3일)</p>
              </div>
              <Badge variant="secondary">전문</Badge>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium">목표</p>
              <p className="text-sm text-gray-600">IoT 센서 활용, 데이터 분석, 예측 모델링 역량 강화</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">안전문화 리더 양성</h5>
                <p className="text-sm text-gray-600 mt-1">대상: 부서별 안전 담당자</p>
                <p className="text-sm text-gray-600">주기: 분기별</p>
                <p className="text-sm text-gray-600">시간: 8시간</p>
              </div>
              <Badge variant="secondary">전문</Badge>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium">목표</p>
              <p className="text-sm text-gray-600">현장 중심 안전문화 확산, 동료 코칭 스킬 개발</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 교육 일정 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">연간 교육 일정</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="font-medium">1분기</p>
            <p className="text-2xl font-bold my-2">8개</p>
            <p className="text-sm text-gray-600">교육 과정</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="font-medium">2분기</p>
            <p className="text-2xl font-bold my-2">6개</p>
            <p className="text-sm text-gray-600">교육 과정</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="font-medium">3분기</p>
            <p className="text-2xl font-bold my-2">5개</p>
            <p className="text-sm text-gray-600">교육 과정</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="font-medium">4분기</p>
            <p className="text-2xl font-bold my-2">7개</p>
            <p className="text-sm text-gray-600">교육 과정</p>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderInspectionSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">점검 및 검사 일정</h3>
        <Button size="sm">
          일정 추가
        </Button>
      </div>

      {/* 점검 주기별 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <p className="text-sm text-gray-600">일일점검</p>
          <p className="text-xl font-bold">365회</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <p className="text-sm text-gray-600">주간점검</p>
          <p className="text-xl font-bold">52회</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
          <p className="text-sm text-gray-600">월간점검</p>
          <p className="text-xl font-bold">12회</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
          <p className="text-sm text-gray-600">분기점검</p>
          <p className="text-xl font-bold">4회</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <p className="text-sm text-gray-600">연간점검</p>
          <p className="text-xl font-bold">1회</p>
        </Card>
      </div>

      {/* 정기 점검 일정 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">정기 점검 일정</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">점검 항목</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">구역/장비</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">주기</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">담당자</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">일정</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm">화학물질 보관시설</td>
                <td className="px-4 py-2 text-sm">전 실험실</td>
                <td className="px-4 py-2 text-sm">
                  <Badge variant="secondary">월간</Badge>
                </td>
                <td className="px-4 py-2 text-sm">안전관리팀</td>
                <td className="px-4 py-2 text-sm">매월 첫째주 월요일</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">소방시설</td>
                <td className="px-4 py-2 text-sm">전 건물</td>
                <td className="px-4 py-2 text-sm">
                  <Badge variant="secondary">월간</Badge>
                </td>
                <td className="px-4 py-2 text-sm">시설관리팀</td>
                <td className="px-4 py-2 text-sm">매월 15일</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">전기설비</td>
                <td className="px-4 py-2 text-sm">변전실, 분전반</td>
                <td className="px-4 py-2 text-sm">
                  <Badge variant="warning">분기</Badge>
                </td>
                <td className="px-4 py-2 text-sm">전기안전관리자</td>
                <td className="px-4 py-2 text-sm">3, 6, 9, 12월</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">압력용기</td>
                <td className="px-4 py-2 text-sm">오토클레이브 외</td>
                <td className="px-4 py-2 text-sm">
                  <Badge variant="destructive">연간</Badge>
                </td>
                <td className="px-4 py-2 text-sm">외부 전문기관</td>
                <td className="px-4 py-2 text-sm">5월 중</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 외부 검사 일정 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">법정 외부 검사</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded">
            <div>
              <p className="font-medium">작업환경측정</p>
              <p className="text-sm text-gray-600">한국산업보건공단</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">3월, 9월</p>
              <p className="text-sm text-gray-600">연 2회</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
            <div>
              <p className="font-medium">안전보건진단</p>
              <p className="text-sm text-gray-600">안전보건진단기관</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">7월</p>
              <p className="text-sm text-gray-600">연 1회</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <div>
              <p className="font-medium">PSM 이행상태평가</p>
              <p className="text-sm text-gray-600">한국가스안전공사</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">10월</p>
              <p className="text-sm text-gray-600">4년 주기</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderRiskSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">위험성평가 계획</h3>

      {/* 평가 전략 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">위험성평가 전략</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-3">정기 평가</h5>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">주기:</span> 월 1회
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">범위:</span> 전 작업장 순환 평가
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">방법론:</span> 4M 기법 + HAZOP
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">평가 대상</p>
                <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                  <li>신규 도입 장비 및 공정</li>
                  <li>사고 발생 작업장</li>
                  <li>법규 변경 사항</li>
                  <li>작업자 변경 구역</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-medium mb-3">수시 평가</h5>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">발동 조건:</span>
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>중대 사고 발생 시</li>
                <li>아차사고 3건 이상 발생 시</li>
                <li>신규 화학물질 도입 시</li>
                <li>작업 방법 변경 시</li>
                <li>법규 개정 시</li>
              </ul>
              <div className="mt-3 p-3 bg-yellow-50 rounded">
                <p className="text-sm font-medium">평가 프로세스</p>
                <p className="text-sm text-gray-600 mt-1">
                  위험 인지 → 24시간 내 초기평가 → 72시간 내 정밀평가 → 개선조치 → 효과성 검증
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 목표 지표 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">위험 감소 목표</h4>
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-green-600">70%</p>
          <p className="text-sm text-gray-600">목표 위험 감소율</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">중대 위험 제거</span>
            <div className="flex items-center">
              <Progress value={100} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">100%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">높은 위험 감소</span>
            <div className="flex items-center">
              <Progress value={80} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">80%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">중간 위험 관리</span>
            <div className="flex items-center">
              <Progress value={60} className="w-32 h-2 mr-2" />
              <span className="text-sm font-medium">60%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 중점 관리 분야 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">중점 관리 분야</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 border-red-200 bg-red-50">
            <h5 className="font-medium text-red-700">화학물질 취급</h5>
            <p className="text-sm text-gray-600 mt-2">
              발암물질, 변이원성 물질 등 CMR 물질 중점 관리
            </p>
            <div className="mt-3">
              <p className="text-xs text-gray-500">주요 조치</p>
              <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                <li>대체물질 검토</li>
                <li>밀폐 시스템 구축</li>
                <li>개인보호구 고도화</li>
              </ul>
            </div>
          </div>
          <div className="border rounded-lg p-4 border-yellow-200 bg-yellow-50">
            <h5 className="font-medium text-yellow-700">중량물 취급</h5>
            <p className="text-sm text-gray-600 mt-2">
              근골격계 질환 예방을 위한 인간공학적 개선
            </p>
            <div className="mt-3">
              <p className="text-xs text-gray-500">주요 조치</p>
              <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                <li>자동화 장비 도입</li>
                <li>작업 자세 개선</li>
                <li>스트레칭 프로그램</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderEmergencySection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">비상대응 계획</h3>

      {/* 비상 훈련 계획 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">비상 훈련 일정</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h5 className="font-medium">화재 대피 훈련</h5>
            </div>
            <p className="text-sm text-gray-600">빈도: 분기별 (연 4회)</p>
            <p className="text-sm text-gray-600">참가: 전 직원</p>
            <p className="text-sm text-gray-600">소요시간: 30분</p>
            <div className="mt-2">
              <p className="text-xs font-medium">훈련 목표</p>
              <p className="text-xs text-gray-600">5분 내 전원 대피 완료</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              <h5 className="font-medium">화학물질 누출 대응</h5>
            </div>
            <p className="text-sm text-gray-600">빈도: 반기별 (연 2회)</p>
            <p className="text-sm text-gray-600">참가: 실험실 근무자</p>
            <p className="text-sm text-gray-600">소요시간: 2시간</p>
            <div className="mt-2">
              <p className="text-xs font-medium">훈련 목표</p>
              <p className="text-xs text-gray-600">초기 대응 3분 내 완료</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-blue-500 mr-2" />
              <h5 className="font-medium">지진 대응 훈련</h5>
            </div>
            <p className="text-sm text-gray-600">빈도: 연 1회</p>
            <p className="text-sm text-gray-600">참가: 전 직원</p>
            <p className="text-sm text-gray-600">소요시간: 1시간</p>
            <div className="mt-2">
              <p className="text-xs font-medium">훈련 목표</p>
              <p className="text-xs text-gray-600">Drop-Cover-Hold 숙달</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 비상장비 관리 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">비상장비 유지관리</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">장비명</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">점검 주기</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">담당자</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">점검 내용</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm">소화기</td>
                <td className="px-4 py-2 text-sm">월 1회</td>
                <td className="px-4 py-2 text-sm">안전관리팀</td>
                <td className="px-4 py-2 text-sm">압력 게이지, 안전핀 확인</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">비상샤워/세안기</td>
                <td className="px-4 py-2 text-sm">주 1회</td>
                <td className="px-4 py-2 text-sm">실험실 안전담당자</td>
                <td className="px-4 py-2 text-sm">작동 상태, 수압 확인</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">AED</td>
                <td className="px-4 py-2 text-sm">일 1회</td>
                <td className="px-4 py-2 text-sm">보건관리자</td>
                <td className="px-4 py-2 text-sm">배터리, 패드 상태 확인</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">화학물질 방제키트</td>
                <td className="px-4 py-2 text-sm">월 1회</td>
                <td className="px-4 py-2 text-sm">화학물질관리자</td>
                <td className="px-4 py-2 text-sm">흡착재, 중화제 재고 확인</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 비상연락망 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">비상대응 체계</h4>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded">
            <p className="font-medium text-red-700">비상상황 발생 시 대응 절차</p>
            <div className="mt-2 flex items-center space-x-2 text-sm">
              <span className="px-2 py-1 bg-red-100 rounded">1. 발견</span>
              <span>→</span>
              <span className="px-2 py-1 bg-red-100 rounded">2. 신고</span>
              <span>→</span>
              <span className="px-2 py-1 bg-red-100 rounded">3. 초기대응</span>
              <span>→</span>
              <span className="px-2 py-1 bg-red-100 rounded">4. 대피</span>
              <span>→</span>
              <span className="px-2 py-1 bg-red-100 rounded">5. 집결</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <p className="text-sm font-medium">사내 비상연락처</p>
              <p className="text-sm text-gray-600">비상대책본부: 내선 119</p>
              <p className="text-sm text-gray-600">안전관리팀: 내선 2119</p>
              <p className="text-sm text-gray-600">보건실: 내선 3119</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm font-medium">외부 비상연락처</p>
              <p className="text-sm text-gray-600">소방서: 119</p>
              <p className="text-sm text-gray-600">응급의료센터: 1339</p>
              <p className="text-sm text-gray-600">가스안전공사: 1544-4500</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderManagementSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">안전보건 경영시스템</h3>

      {/* 인증 현황 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">인증 현황 및 계획</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded">
            <div className="flex items-center">
              <Award className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium">ISO 45001:2018</p>
                <p className="text-sm text-gray-600">안전보건경영시스템</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="success">유지</Badge>
              <p className="text-sm text-gray-600 mt-1">갱신: 2025.08</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded">
            <div className="flex items-center">
              <Award className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">KOSHA-MS</p>
                <p className="text-sm text-gray-600">안전보건경영시스템</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="warning">신규</Badge>
              <p className="text-sm text-gray-600 mt-1">목표: 2025.06</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 내부 심사 계획 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">내부 심사 계획</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded">
            <p className="text-2xl font-bold text-blue-600">1Q</p>
            <p className="text-sm font-medium mt-1">3월</p>
            <p className="text-xs text-gray-600">범위: 전사</p>
            <p className="text-xs text-gray-600">심사원: 외부</p>
          </div>
          <div className="text-center p-4 border rounded">
            <p className="text-2xl font-bold text-green-600">2Q</p>
            <p className="text-sm font-medium mt-1">6월</p>
            <p className="text-xs text-gray-600">범위: 생산부</p>
            <p className="text-xs text-gray-600">심사원: 내부</p>
          </div>
          <div className="text-center p-4 border rounded">
            <p className="text-2xl font-bold text-yellow-600">3Q</p>
            <p className="text-sm font-medium mt-1">9월</p>
            <p className="text-xs text-gray-600">범위: 연구소</p>
            <p className="text-xs text-gray-600">심사원: 내부</p>
          </div>
          <div className="text-center p-4 border rounded">
            <p className="text-2xl font-bold text-red-600">4Q</p>
            <p className="text-sm font-medium mt-1">12월</p>
            <p className="text-xs text-gray-600">범위: 전사</p>
            <p className="text-xs text-gray-600">심사원: 내부</p>
          </div>
        </div>
      </Card>

      {/* 경영검토 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">경영검토 회의</h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">개최 주기</p>
            <p className="text-sm text-gray-600">반기 1회 (6월, 12월)</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">참석 대상</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline">대표이사</Badge>
              <Badge variant="outline">안전보건책임자</Badge>
              <Badge variant="outline">부서장</Badge>
              <Badge variant="outline">안전관리자</Badge>
              <Badge variant="outline">보건관리자</Badge>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">주요 안건</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>안전보건 정책 및 목표 검토</li>
              <li>안전보건 성과 분석</li>
              <li>법규 준수 사항 검토</li>
              <li>자원 배분 및 투자 계획</li>
              <li>개선 기회 발굴 및 조치 계획</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderKPISection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">성과 지표 (KPI)</h3>

      {/* KPI 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-3">사고율 지표</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">재해율</span>
              <span className="text-sm font-medium">0.1% 이하</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">도수율</span>
              <span className="text-sm font-medium">0.5 이하</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">강도율</span>
              <span className="text-sm font-medium">0.02 이하</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-3">활동 지표</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">위험성평가 실시율</span>
              <span className="text-sm font-medium">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">개선조치 완료율</span>
              <span className="text-sm font-medium">95% 이상</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">교육 이수율</span>
              <span className="text-sm font-medium">100%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-3">선행 지표</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">안전관찰 건수</span>
              <span className="text-sm font-medium">월 100건</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">아차사고 보고</span>
              <span className="text-sm font-medium">월 20건</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">개선제안 건수</span>
              <span className="text-sm font-medium">월 30건</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 세부 KPI 목표 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">세부 성과 지표</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">지표명</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">단위</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">기준값</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">목표값</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">측정방법</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">검토주기</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm">중대재해 발생</td>
                <td className="px-4 py-2 text-sm">건</td>
                <td className="px-4 py-2 text-sm">0</td>
                <td className="px-4 py-2 text-sm font-medium text-green-600">0</td>
                <td className="px-4 py-2 text-sm">사고보고서</td>
                <td className="px-4 py-2 text-sm">월별</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">안전점검 적합률</td>
                <td className="px-4 py-2 text-sm">%</td>
                <td className="px-4 py-2 text-sm">85</td>
                <td className="px-4 py-2 text-sm font-medium text-green-600">95</td>
                <td className="px-4 py-2 text-sm">점검 체크리스트</td>
                <td className="px-4 py-2 text-sm">월별</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">비상훈련 참여율</td>
                <td className="px-4 py-2 text-sm">%</td>
                <td className="px-4 py-2 text-sm">80</td>
                <td className="px-4 py-2 text-sm font-medium text-green-600">95</td>
                <td className="px-4 py-2 text-sm">참가자 명단</td>
                <td className="px-4 py-2 text-sm">분기별</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 모니터링 계획 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">성과 모니터링 계획</h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <p className="font-medium">월간 보고</p>
              <p className="text-sm text-gray-600">매월 5일 전월 실적 집계 및 분석</p>
            </div>
          </div>
          <div className="flex items-center">
            <BarChart className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium">분기별 검토</p>
              <p className="text-sm text-gray-600">분기 종료 후 2주 내 종합 분석 및 개선 계획 수립</p>
            </div>
          </div>
          <div className="flex items-center">
            <Target className="w-5 h-5 text-purple-500 mr-3" />
            <div>
              <p className="font-medium">연간 평가</p>
              <p className="text-sm text-gray-600">연말 종합 평가 및 차년도 목표 설정</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderImplementationSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">이행 계획</h3>

      {/* 분기별 이행 계획 */}
      <div className="space-y-4">
        {/* 1분기 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold">1분기 (1-3월)</h4>
            <Badge variant="secondary">준비 단계</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">안전보건 경영시스템 점검</p>
                <p className="text-sm text-gray-600">담당: 안전관리팀 | 기한: 1월 31일</p>
                <p className="text-sm text-gray-600">예상 성과: 시스템 개선사항 도출</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">전 직원 안전교육 실시</p>
                <p className="text-sm text-gray-600">담당: 교육팀 | 기한: 2월 28일</p>
                <p className="text-sm text-gray-600">예상 성과: 안전 의식 향상</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">위험성평가 전면 실시</p>
                <p className="text-sm text-gray-600">담당: 각 부서 | 기한: 3월 31일</p>
                <p className="text-sm text-gray-600">예상 성과: 위험요인 100% 파악</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 2분기 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold">2분기 (4-6월)</h4>
            <Badge variant="warning">실행 단계</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">스마트 안전관리 시스템 구축</p>
                <p className="text-sm text-gray-600">담당: IT팀 | 기한: 5월 31일</p>
                <p className="text-sm text-gray-600">예상 성과: 실시간 모니터링 체계 구축</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">안전장비 전면 교체</p>
                <p className="text-sm text-gray-600">담당: 구매팀 | 기한: 6월 15일</p>
                <p className="text-sm text-gray-600">예상 성과: 장비 성능 50% 향상</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">KOSHA-MS 인증 준비</p>
                <p className="text-sm text-gray-600">담당: 품질관리팀 | 기한: 6월 30일</p>
                <p className="text-sm text-gray-600">예상 성과: 인증 준비 완료</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 3분기 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold">3분기 (7-9월)</h4>
            <Badge variant="success">정착 단계</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">안전문화 캠페인 전개</p>
                <p className="text-sm text-gray-600">담당: 홍보팀 | 기한: 8월 31일</p>
                <p className="text-sm text-gray-600">예상 성과: 참여율 90% 달성</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">중간 성과 평가</p>
                <p className="text-sm text-gray-600">담당: 경영기획팀 | 기한: 9월 15일</p>
                <p className="text-sm text-gray-600">예상 성과: 목표 달성률 70%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 4분기 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold">4분기 (10-12월)</h4>
            <Badge variant="destructive">평가 단계</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">연간 성과 종합 평가</p>
                <p className="text-sm text-gray-600">담당: 안전관리팀 | 기한: 11월 30일</p>
                <p className="text-sm text-gray-600">예상 성과: 개선사항 도출</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-3"></div>
              <div className="flex-1">
                <p className="font-medium">차년도 계획 수립</p>
                <p className="text-sm text-gray-600">담당: 전 부서 | 기한: 12월 15일</p>
                <p className="text-sm text-gray-600">예상 성과: 2026년 계획 완성</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 주요 마일스톤 */}
      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">주요 마일스톤</h4>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                Q1
              </div>
              <div className="ml-4">
                <p className="font-medium">기반 구축 완료</p>
                <p className="text-sm text-gray-600">시스템 점검, 교육, 위험성평가</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                Q2
              </div>
              <div className="ml-4">
                <p className="font-medium">핵심 시스템 도입</p>
                <p className="text-sm text-gray-600">스마트 시스템, 장비 교체, 인증 준비</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                Q3
              </div>
              <div className="ml-4">
                <p className="font-medium">문화 정착</p>
                <p className="text-sm text-gray-600">캠페인 전개, 중간 평가</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                Q4
              </div>
              <div className="ml-4">
                <p className="font-medium">성과 평가 및 계획</p>
                <p className="text-sm text-gray-600">종합 평가, 차년도 계획</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewSection()
      case 'previous-year':
        return renderPreviousYearSection()
      case 'goals':
        return renderGoalsSection()
      case 'budget':
        return renderBudgetSection()
      case 'education':
        return renderEducationSection()
      case 'inspection':
        return renderInspectionSection()
      case 'risk':
        return renderRiskSection()
      case 'emergency':
        return renderEmergencySection()
      case 'management':
        return renderManagementSection()
      case 'kpi':
        return renderKPISection()
      case 'implementation':
        return renderImplementationSection()
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">연간 안전보건 관리계획서</h1>
            <p className="text-gray-600 mt-1">
              {plan.year}년도 안전보건 목표 및 실행 계획
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