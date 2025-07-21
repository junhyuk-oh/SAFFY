// 날짜 계산 헬퍼 함수들
function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

function differenceInDays(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.floor((date1.getTime() - date2.getTime()) / oneDay)
}

// 교육 주기에 따른 다음 교육일 계산
export function calculateNextDueDate(frequency: string, lastCompletionDate: Date): Date {
  const baseDate = lastCompletionDate || new Date()
  
  switch (frequency.toLowerCase()) {
    case "연 1회":
    case "매년":
      return addYears(baseDate, 1)
    case "반기 1회":
    case "6개월":
      return addMonths(baseDate, 6)
    case "분기 1회":
    case "3개월":
      return addMonths(baseDate, 3)
    case "월 1회":
    case "매월":
      return addMonths(baseDate, 1)
    case "2년 1회":
      return addYears(baseDate, 2)
    default:
      // 기본값: 1년
      return addYears(baseDate, 1)
  }
}

// 교육 상태 결정
export function determineTrainingStatus(dueDate: Date, completionDate?: Date): string {
  if (completionDate) {
    return "completed"
  }
  
  const today = new Date()
  const daysUntilDue = differenceInDays(dueDate, today)
  
  if (daysUntilDue < 0) {
    return "overdue"
  } else if (daysUntilDue <= 30) {
    return "in-progress" // 마감 30일 전부터는 진행중으로 표시
  } else {
    return "not-started"
  }
}

// 교육 이수율 계산
export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

// D-Day 계산
export function calculateDDay(targetDate: Date): string {
  const today = new Date()
  const days = differenceInDays(targetDate, today)
  
  if (days === 0) return "D-Day"
  if (days > 0) return `D-${days}`
  return `D+${Math.abs(days)}`
}

// 교육 시간 포맷팅
export function formatTrainingDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}분`
  }
  return `${hours}시간`
}

// 날짜 포맷팅 (한국어)
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}년 ${month}월 ${day}일`
}

// 교육 요구사항 자동 생성
export function generateTrainingRequirements(
  userRole: string,
  department: string,
  isNewEmployee: boolean
): string[] {
  const requirements: string[] = []
  
  // 모든 직원 필수
  requirements.push("정기 안전교육")
  
  // 신규 직원
  if (isNewEmployee) {
    requirements.push("연구실 신규 안전교육")
  }
  
  // 부서별 교육
  if (department.includes("화학")) {
    requirements.push("화학물질 취급 안전교육")
    requirements.push("MSDS 교육")
  }
  
  if (department.includes("생명") || department.includes("생물")) {
    requirements.push("생물안전교육")
    requirements.push("LMO 안전교육")
  }
  
  if (department.includes("물리") || department.includes("방사")) {
    requirements.push("방사선 안전교육")
  }
  
  // 직급별 교육
  if (userRole.includes("관리") || userRole.includes("책임")) {
    requirements.push("관리감독자 안전교육")
  }
  
  return requirements
}

// 교육 알림 메시지 생성
export function generateNotificationMessage(
  type: string,
  trainingName: string,
  daysRemaining?: number
): string {
  switch (type) {
    case "deadline_reminder":
      return `"${trainingName}" 교육 마감이 ${daysRemaining}일 남았습니다.`
    case "new_assignment":
      return `새로운 교육 "${trainingName}"이 배정되었습니다.`
    case "completion_congratulation":
      return `"${trainingName}" 교육을 완료하셨습니다. 수고하셨습니다!`
    case "overdue_alert":
      return `"${trainingName}" 교육이 기한을 초과했습니다. 즉시 이수해주세요.`
    default:
      return `"${trainingName}" 관련 알림입니다.`
  }
}

// 수료증 번호 생성
export function generateCertificateNumber(
  trainingCode: string,
  date: Date = new Date()
): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  
  return `${trainingCode}-${year}${month}${day}-${random}`
}

// 교육 훈련 인터페이스
interface UserTraining {
  status: 'completed' | 'in-progress' | 'not-started' | 'overdue'
  duration?: number
}

// 교육 통계 계산
export function calculateTrainingStats(userTrainings: UserTraining[]): {
  completed: number
  inProgress: number
  notStarted: number
  overdue: number
  totalHours: number
} {
  const stats = {
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    overdue: 0,
    totalHours: 0
  }
  
  userTrainings.forEach(training => {
    switch (training.status) {
      case "completed":
        stats.completed++
        stats.totalHours += training.duration || 0
        break
      case "in-progress":
        stats.inProgress++
        break
      case "not-started":
        stats.notStarted++
        break
      case "overdue":
        stats.overdue++
        break
    }
  })
  
  return stats
}