/**
 * 타입 추론 헬퍼
 * TypeScript의 타입 추론을 돕고 타입 안전성을 향상시키는 유틸리티
 */

/**
 * const assertion을 위한 헬퍼
 * @example
 * const colors = asConst(['red', 'green', 'blue']);
 * // type: readonly ["red", "green", "blue"]
 */
export function asConst<T extends readonly any[]>(arr: T): T;
export function asConst<T>(obj: T): T;
export function asConst<T>(value: T): T {
  return value;
}

/**
 * 객체의 키를 타입 안전하게 가져오는 헬퍼
 * @example
 * const user = { name: 'John', age: 30 };
 * const keys = objectKeys(user); // ('name' | 'age')[]
 */
export function objectKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * 객체의 값을 타입 안전하게 가져오는 헬퍼
 */
export function objectValues<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj) as Array<T[keyof T]>;
}

/**
 * 객체의 엔트리를 타입 안전하게 가져오는 헬퍼
 */
export function objectEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * 타입 안전한 Object.fromEntries
 */
export function objectFromEntries<K extends PropertyKey, V>(
  entries: ReadonlyArray<readonly [K, V]>
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

/**
 * Enum을 위한 타입 가드 생성
 * @example
 * enum Status { Active = 'active', Inactive = 'inactive' }
 * const isStatus = createEnumChecker(Status);
 * if (isStatus(value)) { // value is Status }
 */
export function createEnumChecker<T extends Record<string, string | number>>(
  enumObj: T
): (value: unknown) => value is T[keyof T] {
  const enumValues = Object.values(enumObj);
  return (value: unknown): value is T[keyof T] => {
    return enumValues.includes(value as any);
  };
}

/**
 * 리터럴 타입을 위한 타입 가드 생성
 * @example
 * const isDirection = createLiteralChecker('up', 'down', 'left', 'right');
 * if (isDirection(value)) { // value is 'up' | 'down' | 'left' | 'right' }
 */
export function createLiteralChecker<T extends readonly string[]>(
  ...literals: T
): (value: unknown) => value is T[number] {
  return (value: unknown): value is T[number] => {
    return literals.includes(value as any);
  };
}

/**
 * 타입 안전한 switch 문
 * @example
 * const result = typedSwitch(status)
 *   .case('active', () => 'User is active')
 *   .case('inactive', () => 'User is inactive')
 *   .default(() => 'Unknown status');
 */
export function typedSwitch<T extends string | number | symbol>(value: T) {
  const cases = new Map<T, () => any>();
  let defaultCase: (() => any) | undefined;

  const switchObject = {
    case<R>(caseValue: T, handler: () => R) {
      cases.set(caseValue, handler);
      return switchObject;
    },
    default<R>(handler: () => R): R {
      defaultCase = handler;
      return this.execute();
    },
    execute<R>(): R {
      const handler = cases.get(value);
      if (handler) {
        return handler();
      }
      if (defaultCase) {
        return defaultCase();
      }
      throw new Error(`No case found for value: ${String(value)}`);
    }
  };

  return switchObject;
}

/**
 * 타입 narrowing을 위한 헬퍼
 * @example
 * if (narrow(value, isString)) {
 *   // value is string
 * }
 */
export function narrow<T, S extends T>(
  value: T,
  guard: (value: T) => value is S
): value is S {
  return guard(value);
}

/**
 * 타입 안전한 pick 함수
 * @example
 * const user = { id: 1, name: 'John', age: 30, email: 'john@example.com' };
 * const picked = pick(user, ['name', 'email']); // { name: string; email: string }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * 타입 안전한 omit 함수
 * @example
 * const user = { id: 1, name: 'John', age: 30 };
 * const omitted = omit(user, ['id']); // { name: string; age: number }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

/**
 * 타입 안전한 groupBy
 * @example
 * const users = [{ id: 1, role: 'admin' }, { id: 2, role: 'user' }];
 * const grouped = groupBy(users, user => user.role);
 * // { admin: User[], user: User[] }
 */
export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keySelector(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

/**
 * 타입 안전한 partition
 * @example
 * const [evens, odds] = partition([1, 2, 3, 4], n => n % 2 === 0);
 */
export function partition<T>(
  items: readonly T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  items.forEach(item => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });
  
  return [truthy, falsy];
}

/**
 * 타입 안전한 unique
 * @example
 * const unique = uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], user => user.id);
 */
export function uniqueBy<T, K>(
  items: readonly T[],
  keySelector: (item: T) => K
): T[] {
  const seen = new Set<K>();
  return items.filter(item => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * exhaustive check를 위한 헬퍼
 * @example
 * switch (status) {
 *   case 'active': return 'Active';
 *   case 'inactive': return 'Inactive';
 *   default: return assertNever(status);
 * }
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}

/**
 * 조건부 타입을 위한 헬퍼
 * @example
 * type Result = If<true, string, number>; // string
 */
export type If<Condition extends boolean, True, False> = 
  Condition extends true ? True : False;

/**
 * 타입 레벨에서 문자열을 대문자로 변환
 */
export type Uppercase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Uppercase<Rest>}`
  : S;

/**
 * 타입 레벨에서 문자열을 소문자로 변환
 */
export type Lowercase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Lowercase<First>}${Lowercase<Rest>}`
  : S;

/**
 * 타입 레벨에서 문자열을 CamelCase로 변환
 */
export type CamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${Capitalize<CamelCase<Rest>>}`
  : S;

/**
 * 함수 파라미터 타입 추출
 */
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

/**
 * 생성자 파라미터 타입 추출
 */
export type ConstructorParameters<T extends abstract new (...args: any) => any> = 
  T extends abstract new (...args: infer P) => any ? P : never;

/**
 * Promise 체인을 위한 타입 헬퍼
 */
export type PromiseChain<T, R> = T extends Promise<infer U>
  ? Promise<R>
  : Promise<R>;

/**
 * 재귀적 Readonly 해제
 */
export type DeepMutable<T> = T extends object ? {
  -readonly [P in keyof T]: DeepMutable<T[P]>;
} : T;