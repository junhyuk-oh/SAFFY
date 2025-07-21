/**
 * 날짜 관련 유틸리티 함수
 */

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