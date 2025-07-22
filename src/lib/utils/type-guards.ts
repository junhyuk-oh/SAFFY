/**
 * 타입 가드 유틸리티 함수
 * 런타임에서 타입 안전성을 보장하기 위한 함수들
 */

/**
 * 값이 null이나 undefined가 아닌지 확인
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * 값이 빈 문자열이 아닌지 확인
 */
export function isNotEmpty(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.trim() !== ''
}

/**
 * 배열이 비어있지 않은지 확인
 */
export function isNonEmptyArray<T>(array: T[] | null | undefined): array is T[] {
  return array !== null && array !== undefined && array.length > 0
}

/**
 * 객체가 특정 키를 가지고 있는지 확인
 */
export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj
}

/**
 * 날짜 문자열이 유효한지 확인
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * 숫자가 유효한 범위 내에 있는지 확인
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * 이메일 형식이 유효한지 확인
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 전화번호 형식이 유효한지 확인
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
  return phoneRegex.test(phone.replace(/[- ]/g, ''))
}

/**
 * 문자열이 숫자로만 구성되어 있는지 확인
 */
export function isNumericString(value: string): boolean {
  return /^\d+$/.test(value)
}

/**
 * 객체가 에러 객체인지 확인
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * 응답이 성공적인지 확인 (HTTP 상태 코드)
 */
export function isSuccessResponse(status: number): boolean {
  return status >= 200 && status < 300
}

/**
 * 파일 확장자가 이미지인지 확인
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? imageExtensions.includes(extension) : false
}

/**
 * 파일 확장자가 문서인지 확인
 */
export function isDocumentFile(filename: string): boolean {
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? documentExtensions.includes(extension) : false
}

/**
 * 유효한 URL인지 확인
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 객체가 Promise인지 확인
 */
export function isPromise<T = any>(value: any): value is Promise<T> {
  return value && typeof value.then === 'function' && typeof value.catch === 'function'
}

/**
 * 값이 함수인지 확인
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

/**
 * 안전한 JSON 파싱
 */
export function safeJsonParse<T = any>(json: string, fallback?: T): T | undefined {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * 타입 가드를 사용한 배열 필터링
 */
export function filterNotNull<T>(array: (T | null | undefined)[]): T[] {
  return array.filter(isNotNull)
}

/**
 * 타입 가드를 사용한 객체 필터링
 */
export function filterObjectValues<T extends Record<string, any>>(
  obj: T,
  predicate: (value: any) => boolean
): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (predicate(value)) {
      acc[key as keyof T] = value
    }
    return acc
  }, {} as Partial<T>)
}