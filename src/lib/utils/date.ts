/**
 * 날짜 관련 유틸리티 함수
 */

// 날짜 포맷 옵션 타입
interface DateFormatOptions {
  includeTime?: boolean
  includeSeconds?: boolean
  separator?: string
}

/**
 * Date 객체를 한국어 날짜 문자열로 변환
 */
export function formatKoreanDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('ko-KR')
}

/**
 * Date 객체를 상세 한국어 날짜 시간 문자열로 변환
 */
export function formatKoreanDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * YYYY-MM 형식으로 월 문자열 생성
 */
export function formatMonth(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString().substring(0, 7)
}

/**
 * YYYY-MM-DD 형식으로 날짜 문자열 생성
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString().substring(0, 10)
}

/**
 * 상대적 시간 표시 (예: 3시간 전, 2일 전)
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return '방금 전'
  } else if (diffMin < 60) {
    return `${diffMin}분 전`
  } else if (diffHour < 24) {
    return `${diffHour}시간 전`
  } else if (diffDay < 30) {
    return `${diffDay}일 전`
  } else {
    return formatKoreanDate(dateObj)
  }
}

/**
 * 분기 정보 생성
 */
export function getQuarter(date: Date | string): { year: number; quarter: 1 | 2 | 3 | 4 } {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const month = dateObj.getMonth()
  const quarter = Math.floor(month / 3) + 1 as 1 | 2 | 3 | 4
  
  return {
    year: dateObj.getFullYear(),
    quarter
  }
}

/**
 * 주차 정보 계산
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * YYYY년 MM월 DD일 형식으로 변환
 */
export function formatKoreanFullDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

/**
 * 날짜와 시간 포맷 (YYYY.MM.DD HH:mm 형식)
 */
export function formatDateTime(date: Date | string, options: DateFormatOptions = {}): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const { includeTime = true, includeSeconds = false, separator = '.' } = options
  
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  
  let result = `${year}${separator}${month}${separator}${day}`
  
  if (includeTime) {
    const hours = String(dateObj.getHours()).padStart(2, '0')
    const minutes = String(dateObj.getMinutes()).padStart(2, '0')
    result += ` ${hours}:${minutes}`
    
    if (includeSeconds) {
      const seconds = String(dateObj.getSeconds()).padStart(2, '0')
      result += `:${seconds}`
    }
  }
  
  return result
}

/**
 * 두 날짜 사이의 일수 차이 계산
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 날짜가 오늘인지 확인
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return dateObj.toDateString() === today.toDateString()
}

/**
 * 날짜가 과거인지 확인
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj < new Date()
}

/**
 * 월의 시작일과 종료일 구하기
 */
export function getMonthRange(date: Date | string): { start: Date, end: Date } {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()
  
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  
  return { start, end }
}

/**
 * 주의 시작일(월요일)과 종료일(일요일) 구하기
 */
export function getWeekRange(date: Date | string): { start: Date, end: Date } {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const day = dateObj.getDay()
  const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1) // 월요일로 조정
  
  const start = new Date(dateObj.setDate(diff))
  const end = new Date(dateObj.setDate(diff + 6))
  
  return { start, end }
}