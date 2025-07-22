/**
 * 폼 관련 타입 정의
 * 타입 안전한 폼 처리를 위한 제네릭 타입들
 */

import { ChangeEvent, FormEvent } from 'react';

/**
 * 폼 필드 타입
 */
export type FormFieldValue = string | number | boolean | Date | null | undefined;

/**
 * 폼 데이터 타입 (객체의 모든 값이 폼 필드 타입이어야 함)
 */
export type FormData = Record<string, FormFieldValue | FormFieldValue[]>;

/**
 * 폼 필드 설정
 */
export interface FormFieldConfig<T = FormFieldValue> {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 
        'date' | 'time' | 'datetime-local' | 'checkbox' | 'radio' | 
        'select' | 'textarea' | 'file' | 'hidden';
  defaultValue?: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  pattern?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  minLength?: number;
  maxLength?: number;
  multiple?: boolean;
  accept?: string; // for file input
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  validation?: FormFieldValidation<T>;
}

/**
 * 폼 필드 유효성 검증
 */
export interface FormFieldValidation<T = FormFieldValue> {
  required?: boolean | { value: boolean; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: T) => boolean | string | Promise<boolean | string>;
  custom?: Array<{
    test: (value: T) => boolean | Promise<boolean>;
    message: string;
  }>;
}

/**
 * 폼 에러 타입
 */
export interface FormError {
  message: string;
  type?: string;
  ref?: any;
}

/**
 * 폼 상태 타입
 */
export interface FormState<T extends FormData = FormData> {
  values: T;
  errors: Partial<Record<keyof T, FormError>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValidating: boolean;
  isValid: boolean;
  isDirty: boolean;
  submitCount: number;
}

/**
 * 폼 액션 타입
 */
export type FormAction<T extends FormData = FormData> =
  | { type: 'SET_VALUE'; field: keyof T; value: T[keyof T] }
  | { type: 'SET_VALUES'; values: Partial<T> }
  | { type: 'SET_ERROR'; field: keyof T; error: FormError }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, FormError>> }
  | { type: 'CLEAR_ERROR'; field: keyof T }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_TOUCHED'; field: keyof T; touched: boolean }
  | { type: 'SET_TOUCHED_MULTIPLE'; fields: Partial<Record<keyof T, boolean>> }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_VALIDATING'; isValidating: boolean }
  | { type: 'SUBMIT_ATTEMPT' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_FAILURE' }
  | { type: 'RESET' };

/**
 * 폼 핸들러 타입
 */
export interface FormHandlers<T extends FormData = FormData> {
  handleChange: (field: keyof T) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (event: FormEvent<HTMLFormElement>) => void;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  reset: () => void;
  validate: () => Promise<boolean>;
  validateField: (field: keyof T) => Promise<boolean>;
}

/**
 * 폼 훅 반환 타입
 */
export interface UseFormReturn<T extends FormData = FormData> extends FormState<T>, FormHandlers<T> {
  register: (field: keyof T, config?: FormFieldConfig) => {
    name: keyof T;
    value: T[keyof T];
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    error?: FormError;
  };
  watch: (field: keyof T) => T[keyof T];
  watchAll: () => T;
}

/**
 * 폼 제출 핸들러 타입
 */
export type FormSubmitHandler<T extends FormData = FormData> = (
  values: T,
  formHelpers: {
    setSubmitting: (isSubmitting: boolean) => void;
    setErrors: (errors: Partial<Record<keyof T, string>>) => void;
    setFieldError: (field: keyof T, error: string) => void;
    reset: () => void;
  }
) => void | Promise<void>;

/**
 * 폼 초기값 타입
 */
export type FormInitialValues<T extends FormData = FormData> = Partial<T> | (() => Partial<T>);

/**
 * 폼 설정 타입
 */
export interface FormConfig<T extends FormData = FormData> {
  initialValues?: FormInitialValues<T>;
  validationSchema?: FormValidationSchema<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  enableReinitialize?: boolean;
  onSubmit: FormSubmitHandler<T>;
  onReset?: () => void;
}

/**
 * 폼 유효성 검증 스키마
 */
export type FormValidationSchema<T extends FormData = FormData> = {
  [K in keyof T]?: FormFieldValidation<T[K]>;
};

/**
 * 폼 필드 렌더 프롭 타입
 */
export interface FormFieldRenderProps<T = FormFieldValue> {
  field: {
    name: string;
    value: T;
    onChange: (event: ChangeEvent<any>) => void;
    onBlur: () => void;
  };
  meta: {
    error?: FormError;
    touched: boolean;
    isValidating: boolean;
  };
  helpers: {
    setValue: (value: T) => void;
    setError: (error: string) => void;
    setTouched: (touched: boolean) => void;
  };
}

/**
 * 동적 폼 필드 배열 타입
 */
export interface FormFieldArray<T = any> {
  fields: T[];
  append: (value: T) => void;
  prepend: (value: T) => void;
  remove: (index: number) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: T) => void;
  update: (index: number, value: T) => void;
  replace: (values: T[]) => void;
}

/**
 * 조건부 폼 필드 타입
 */
export interface ConditionalField<T extends FormData = FormData> {
  when: keyof T | Array<keyof T>;
  is?: T[keyof T] | ((value: T[keyof T]) => boolean);
  then?: (values: T) => FormFieldConfig | null;
  otherwise?: (values: T) => FormFieldConfig | null;
}

/**
 * 폼 스텝 (다단계 폼용)
 */
export interface FormStep<T extends FormData = FormData> {
  id: string;
  title: string;
  description?: string;
  fields: Array<keyof T>;
  validation?: FormValidationSchema<Pick<T, keyof T>>;
  canSkip?: boolean;
  isComplete?: (values: T) => boolean;
}