/**
 * 유틸리티 타입 정의
 * 프로젝트 전체에서 재사용 가능한 제네릭 타입들
 */

/**
 * 객체의 모든 프로퍼티를 선택적으로 만들되, 중첩된 객체도 재귀적으로 적용
 */
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 * 객체의 모든 프로퍼티를 읽기 전용으로 만들되, 중첩된 객체도 재귀적으로 적용
 */
export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

/**
 * 특정 키를 제외한 타입 생성
 */
export type ExcludeKeys<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * 특정 키만 선택적으로 만드는 타입
 */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 특정 키만 필수로 만드는 타입
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * nullable 타입 (null 또는 undefined 허용)
 */
export type Nullable<T> = T | null | undefined;

/**
 * 배열 요소의 타입 추출
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Promise의 반환 타입 추출
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * 함수의 반환 타입 추출 (비동기 함수 포함)
 */
export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> =
  T extends (...args: any[]) => Promise<infer R> ? R : never;

/**
 * 객체의 값 타입들의 유니온 타입
 */
export type ValueOf<T> = T[keyof T];

/**
 * 문자열 리터럴 유니온 타입 생성 헬퍼
 */
export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never;

/**
 * API 응답 타입
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

/**
 * API 에러 타입
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 페이지네이션 요청 파라미터
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 검색 파라미터
 */
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, any>;
}

/**
 * 타임스탬프를 가진 엔티티
 */
export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

/**
 * ID를 가진 엔티티
 */
export interface WithId {
  id: string;
}

/**
 * 기본 엔티티 타입 (ID + 타임스탬프)
 */
export type BaseEntity = WithId & Timestamped;

/**
 * 폼 필드 에러 타입
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * 폼 상태 타입
 */
export interface FormState<T> {
  values: T;
  errors: FormErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * 액션 타입 생성 헬퍼
 */
export interface Action<T = any> {
  type: string;
  payload?: T;
  error?: boolean;
  meta?: any;
}

/**
 * 액션 크리에이터 타입
 */
export type ActionCreator<T = any> = (payload?: T) => Action<T>;

/**
 * 리듀서 타입
 */
export type Reducer<S = any, A extends Action = Action> = (
  state: S | undefined,
  action: A
) => S;

/**
 * 이벤트 핸들러 타입들
 */
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type KeyboardHandler = (event: React.KeyboardEvent) => void;

/**
 * 컴포넌트 Props with children
 */
export interface PropsWithChildren {
  children: React.ReactNode;
}

/**
 * 선택 가능한 아이템
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/**
 * 트리 구조 아이템
 */
export interface TreeNode<T = any> {
  id: string;
  data: T;
  children?: TreeNode<T>[];
  parent?: string;
}

/**
 * 로딩 상태를 가진 데이터
 */
export interface LoadableData<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 비동기 작업 상태
 */
export interface AsyncState<T> {
  idle: boolean;
  loading: boolean;
  success: boolean;
  error: Error | null;
  data: T | null;
}

/**
 * 필터 설정
 */
export interface FilterConfig<T = any> {
  field: keyof T;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

/**
 * 정렬 설정
 */
export interface SortConfig<T = any> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

/**
 * 키-값 쌍
 */
export interface KeyValue<T = any> {
  key: string;
  value: T;
}

/**
 * 범위 타입
 */
export interface Range<T = number> {
  min: T;
  max: T;
}

/**
 * 좌표 타입
 */
export interface Coordinates {
  x: number;
  y: number;
  z?: number;
}

/**
 * 크기 타입
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * 직사각형 영역
 */
export interface Rectangle extends Coordinates, Size {}

/**
 * 색상 타입
 */
export type Color = `#${string}` | `rgb(${string})` | `rgba(${string})` | `hsl(${string})` | `hsla(${string})`;

/**
 * 테마 타입
 */
export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: Color;
  [key: string]: any;
}