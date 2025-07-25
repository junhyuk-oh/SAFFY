# AI Safety SaaS 개발 가이드라인 (리팩토링 완료 버전)

## 🚨 필수 작업 환경 설정

### 윈도우 네이티브 프로젝트 경로 규칙
- **유일한 작업 경로**: `C:\Users\오준혁\ai-safety-saas\`
- **절대 사용 금지**: WSL 경로 (`/mnt/c/` 등)
- **프로젝트 단일화**: AI Safety SaaS 프로젝트는 오직 하나만 존재

### 윈도우 환경 설정
1. 모든 파일 수정은 `C:\Users\오준혁\ai-safety-saas\`에서 수행
2. 윈도우 네이티브 Claude Code 사용
3. PowerShell 또는 Command Prompt에서 명령어 실행

---

## 🛠 개발 환경 (2025년 리팩토링 완료)

### 핵심 기술 스택
- **Framework**: Next.js 15.4.1 (App Router + Turbopack)
- **Language**: TypeScript 5.x (엄격 모드, any 금지)
- **Styling**: Tailwind CSS v3.4.17
- **상태 관리**: Zustand (전역 상태)
- **서버 상태**: React Query v5 (@tanstack/react-query)
- **애니메이션**: Framer Motion
- **UI 라이브러리**: Radix UI
- **Package Manager**: npm
- **Runtime**: Node.js 18.x+

### 개발 서버 관리
```cmd
# 기본 서버 시작
cd C:\Users\오준혁\ai-safety-saas
npm run dev

# Turbopack 사용 (더 빠른 개발)
npm run dev:turbo

# 번들 분석
npm run analyze

# 타입 체크
npm run typecheck

# 서버 상태 확인
curl http://localhost:3000
```

---

## 📁 최신 프로젝트 구조 (리팩토링 완료)

```
C:\Users\오준혁\ai-safety-saas\
├── src\
│   ├── app\                    # Next.js App Router
│   │   ├── (dashboard)\        # 대시보드 라우트 그룹
│   │   ├── (documents)\        # 문서 관련 라우트 그룹
│   │   ├── (facility)\         # 시설관리 라우트 그룹
│   │   └── api\               # API 라우트
│   │
│   ├── components\            # React 컴포넌트 (카테고리별 정리)
│   │   ├── ui\               # 재사용 가능한 UI 컴포넌트
│   │   │   ├── display\      # badge, card, table, tabs, breadcrumb
│   │   │   ├── forms\        # button, input, select, form, checkbox
│   │   │   ├── feedback\     # loading, error, toast, progress
│   │   │   └── layout\       # BaseModal, modal, page-transition
│   │   │
│   │   ├── common\           # 공통 컴포넌트
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── NotificationContainer.tsx
│   │   │
│   │   ├── facility\         # 시설관리 (세분화)
│   │   │   ├── equipment\    # EquipmentCard, EquipmentDetail, EquipmentGrid
│   │   │   ├── maintenance\  # MaintenanceCard, MaintenanceDetail 등
│   │   │   ├── permits\      # PermitApproval, PermitCard 등
│   │   │   └── alerts\       # AlertCenter, AlertDashboard, AlertItem
│   │   │
│   │   ├── documents\        # 문서 관리
│   │   │   ├── shared\       # DocumentCard, DocumentList 등
│   │   │   ├── daily\        # 일일 문서
│   │   │   ├── monthly\      # 월간 문서
│   │   │   └── quarterly\    # 분기 문서
│   │   │
│   │   ├── education\        # 교육 관리
│   │   ├── ai-documents\     # AI 문서 생성
│   │   ├── schedule\         # 일정 관리
│   │   ├── modals\          # 모달 컴포넌트들
│   │   └── layout\          # 레이아웃 컴포넌트
│   │
│   ├── hooks\               # 커스텀 훅
│   │   ├── queries\         # React Query 훅들
│   │   │   ├── useDocuments.ts
│   │   │   ├── useFacility.ts
│   │   │   ├── useEducation.ts
│   │   │   └── useSchedule.ts
│   │   └── useAsync.ts      # 비동기 처리 훅
│   │
│   ├── stores\              # Zustand 스토어
│   │   ├── useAppStore.ts   # 앱 전역 상태
│   │   ├── useAuthStore.ts  # 인증 상태
│   │   └── useNotificationStore.ts # 알림 상태
│   │
│   ├── lib\                # 유틸리티 및 설정
│   │   ├── utils\          # 공통 유틸리티 함수
│   │   │   ├── date.ts     # 날짜 관련 유틸리티
│   │   │   ├── formatting.ts # 포맷팅 함수
│   │   │   ├── validation.ts # 유효성 검사
│   │   │   └── type-guards.ts # 타입 가드
│   │   │
│   │   ├── constants\      # 상수 정의
│   │   │   └── status.ts   # 상태 관련 상수 (중앙화)
│   │   │
│   │   ├── types\         # 타입 정의 (강화됨)
│   │   │   ├── utility-types.ts    # 고급 타입 유틸리티
│   │   │   ├── form-types.ts       # 폼 관련 타입
│   │   │   ├── inference-helpers.ts # 타입 추론 헬퍼
│   │   │   └── [기존 타입들...]
│   │   │
│   │   ├── api\           # API 설정
│   │   │   ├── client.ts  # Axios 인스턴스
│   │   │   └── response.ts # API 응답 타입
│   │   │
│   │   ├── react-query\   # React Query 설정
│   │   │   ├── client.ts  # QueryClient 설정
│   │   │   └── providers.tsx # Provider 컴포넌트
│   │   │
│   │   └── db\           # 데이터베이스
│   │       └── supabase.ts
│   │
│   └── styles\           # 글로벌 스타일
│
├── docs\                 # 프로젝트 문서
│   ├── refactoring-plan.md        # 리팩토링 계획 (완료)
│   ├── virtualization-implementation.md # 가상화 구현 가이드
│   ├── code-splitting-guide.md    # 코드 분할 가이드
│   └── [기타 문서들...]
│
├── logs\                 # 작업 로그
│   ├── 작업로그.md        # 전체 작업 로그
│   └── 작업로그-템플릿.md
│
├── public\              # 정적 파일
├── supabase\            # Supabase 설정
└── [설정 파일들...]
```

---

## 💻 코딩 표준 (2025년 업데이트)

### 1. TypeScript 엄격 규칙 (any 금지)
```typescript
// ✅ 올바른 방법
interface ApiResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
}

const handleApiCall = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  // 구현
}

// ❌ 금지된 방법
const handleApiCall = async (endpoint: any): Promise<any> => {
  // any 사용 금지!
}
```

### 2. 성능 최적화 패턴 (필수)

#### React.memo 사용 패턴
```typescript
// ✅ 리스트 아이템 컴포넌트는 반드시 memo 적용
export const EquipmentCard = memo(function EquipmentCard({
  equipment,
  onStatusChange,
  onMaintenanceRequest
}: EquipmentCardProps) {
  // 컴포넌트 로직
})

// ✅ 자주 사용되는 UI 컴포넌트도 memo 적용
export const Badge = memo(function Badge({ variant, children }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }))}>{children}</div>
})
```

#### useMemo/useCallback 최적화
```typescript
// ✅ 복잡한 계산은 useMemo
const filteredAndSortedData = useMemo(() => {
  return data
    .filter(item => item.status === selectedStatus)
    .sort((a, b) => a.name.localeCompare(b.name))
}, [data, selectedStatus])

// ✅ 자식 컴포넌트로 전달되는 콜백은 useCallback
const handleItemClick = useCallback((id: string) => {
  onItemSelect(id)
  setSelectedItem(id)
}, [onItemSelect])

// ✅ 날짜/시간 계산도 메모이제이션
const operatingTime = useMemo(() => {
  const installDate = new Date(equipment.installDate)
  const now = new Date()
  const diffTime = now.getTime() - installDate.getTime()
  // 계산 로직...
  return formatDuration(diffTime)
}, [equipment.installDate])
```

### 3. 컴포넌트 구조 표준
```typescript
"use client" // 필요한 경우만

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { ExternalComponent } from '@/components/ui'
import type { ComponentProps } from './types'

export const ComponentName = memo(function ComponentName({ 
  prop1, 
  prop2 
}: ComponentProps) {
  // 1. Hooks (상태)
  const [state, setState] = useState()
  
  // 2. 스토어 (Zustand)
  const { user, updateUser } = useAuthStore()
  
  // 3. 쿼리 (React Query)
  const { data, loading, error } = useDocuments()
  
  // 4. Derived state (useMemo)
  const derivedValue = useMemo(() => {
    return computeExpensiveValue(data)
  }, [data])
  
  // 5. Effects
  useEffect(() => {
    // 부수 효과
  }, [])
  
  // 6. Handlers (useCallback)
  const handleClick = useCallback(() => {
    // 이벤트 처리
  }, [])
  
  // 7. Render
  return <div>...</div>
})
```

### 4. 상태 관리 패턴

#### Zustand 사용
```typescript
// ✅ 전역 상태는 Zustand
const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  sidebar: { collapsed: false },
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ 
    sidebar: { ...state.sidebar, collapsed: !state.sidebar.collapsed }
  }))
}))
```

#### React Query 사용
```typescript
// ✅ 서버 데이터는 React Query
export function useDocuments(filters?: DocumentFilters) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => documentService.getDocuments(filters),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000    // 10분
  })
}
```

### 5. 에러 처리 패턴
```typescript
// ✅ 타입 안전한 에러 처리
try {
  const data = await api.fetchData()
} catch (error) {
  if (error instanceof ApiError) {
    showNotification({
      type: 'error',
      message: error.message
    })
  } else if (error instanceof NetworkError) {
    showNotification({
      type: 'error', 
      message: '네트워크 오류가 발생했습니다'
    })
  } else {
    console.error('Unexpected error:', error)
    showNotification({
      type: 'error',
      message: '예상치 못한 오류가 발생했습니다'
    })
  }
}
```

### 6. 컴포넌트 import 패턴
```typescript
// ✅ Barrel export 활용
import { Button, Input, Select } from '@/components/ui/forms'
import { Badge, Card } from '@/components/ui/display'
import { LoadingSpinner, ErrorBoundary } from '@/components/common'

// ✅ Tree shaking 최적화
import { Wrench, Clock, AlertCircle } from 'lucide-react'
```

---

## 🚀 성능 최적화 가이드

### 1. 메모이제이션 적용 기준
- **React.memo**: 리스트 아이템, 자주 사용되는 UI 컴포넌트
- **useMemo**: 복잡한 계산, 배열 변환, 객체 생성
- **useCallback**: 자식 컴포넌트로 전달되는 콜백 함수

### 2. 가상화 적용 기준
- 50개 이상의 아이템: 가상화 고려
- 100개 이상의 아이템: 가상화 필수

```typescript
// ✅ 가상화 적용 예시
{items.length > 50 ? (
  <VirtualizedList items={items} />
) : (
  <RegularList items={items} />
)}
```

### 3. 코드 분할 패턴
```typescript
// ✅ 모달 지연 로딩
const HeavyModal = dynamic(() => import('./HeavyModal'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

// ✅ 차트 라이브러리 지연 로딩
const Chart = dynamic(() => import('react-chartjs-2'), {
  loading: () => <div>차트 로딩 중...</div>,
  ssr: false
})
```

### 4. 번들 분석 및 최적화
```bash
# 번들 분석 실행
npm run analyze

# 결과 확인
npm run bundle-analyzer
```

---

## 🗂️ Git 버전 관리 (중요!)

### 리팩토링 작업시 커밋 규칙
```cmd
# 1. 작업 전 백업
git add .
git commit -m "🔄 리팩토링 시작 전 백업: [작업 설명]"

# 2. 단계별 커밋
git commit -m "♻️ 컴포넌트 구조 개선: facility 폴더 재구성"
git commit -m "⚡ 성능 최적화: React.memo 적용"
git commit -m "🔧 상태 관리: Zustand 도입"

# 3. 최종 커밋
git commit -m "✨ 리팩토링 완료: 성능 및 구조 개선"
```

---

## 📋 작업 로그 관리

### 작업 로그 시스템
- **위치**: `C:\Users\오준혁\ai-safety-saas\logs\작업로그.md`
- **목적**: 모든 리팩토링 및 개발 작업 추적

### 필수 기록 사항
- 성능 최적화 작업
- 컴포넌트 구조 변경
- 새로운 라이브러리 도입
- 타입 시스템 개선
- 상태 관리 패턴 변경

---

## 🔧 개발 도구 및 스크립트

### 새로 추가된 스크립트
```bash
# 개발 서버 (기본)
npm run dev

# 개발 서버 (Turbopack)
npm run dev:turbo

# 타입 체크
npm run typecheck

# 번들 분석
npm run analyze
npm run bundle-analyzer

# 빌드 및 시작
npm run build
npm run start
```

### 성능 모니터링
```typescript
// Web Vitals 측정
export function reportWebVitals(metric: any) {
  console.log(metric)
  
  // 성능 지표 분석 서비스로 전송
  if (metric.label === 'web-vital') {
    analytics.send({
      name: metric.name,
      value: metric.value,
    })
  }
}
```

---

## 🎯 개발 체크리스트

### 새 컴포넌트 작성시
- [ ] TypeScript 인터페이스 정의
- [ ] React.memo 적용 검토 (리스트 아이템인가?)
- [ ] useMemo/useCallback 최적화
- [ ] 에러 바운더리 적용
- [ ] 접근성 고려 (ARIA 라벨)

### 성능 최적화 체크리스트
- [ ] 불필요한 리렌더링 방지 (React.memo)
- [ ] 복잡한 계산 메모이제이션 (useMemo)
- [ ] 콜백 함수 메모이제이션 (useCallback)
- [ ] 큰 리스트 가상화 검토
- [ ] 번들 크기 분석 및 코드 분할

### 코드 품질 체크리스트
- [ ] any 타입 사용 금지
- [ ] 에러 처리 구현
- [ ] 타입 가드 활용
- [ ] 공통 유틸리티 재사용

---

## 🔧 개발 서버 및 문제 해결

### 개발 서버 문제 해결
1. **포트 3000 사용 중일 때**: `netstat -ano | findstr :3000`으로 프로세스 확인
2. **Node.js 버전 확인**: `node --version` (18.x 이상 권장)
3. **캐시 정리**: `npm run build` 후 `.next` 폴더 삭제

### TypeScript 에러 해결
```cmd
# 타입 체크
npm run typecheck

# ESLint 실행
npm run lint

# 빌드 테스트
npm run build
```

---

## 🖥️ 윈도우 특화 설정

### Node.js 설치 확인
```cmd
# Node.js 버전 확인 (18.x 이상 권장)
node --version
npm --version

# 필요시 Node.js 재설치
# https://nodejs.org에서 LTS 버전 다운로드
```

### PowerShell 실행 정책 (필요시)
```powershell
# PowerShell 스크립트 실행 허용
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 윈도우 Defender 예외 설정 (권장)
- `C:\Users\오준혁\ai-safety-saas\node_modules` 폴더를 스캔 제외 목록에 추가
- 빌드 속도 향상을 위해 권장

### Git 설정 확인
```cmd
# Git 사용자 정보 확인
git config --global user.name
git config --global user.email

# 필요시 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📦 의존성 관리

### 주요 의존성 (업데이트됨)
- **Next.js**: 15.4.1
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.4.17
- **Zustand**: 최신 버전 (전역 상태)
- **React Query**: v5 (서버 상태)
- **Framer Motion**: 최신 버전 (애니메이션)
- **Supabase**: 최신 버전

### 의존성 설치 및 업데이트
```cmd
# 의존성 설치
npm install

# 의존성 업데이트 확인
npm outdated

# 보안 취약점 검사
npm audit
npm audit fix
```

---

## 🚀 배포 준비

### 프로덕션 빌드
```cmd
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm run start

# 번들 분석 (성능 최적화용)
npm run analyze
```

### 환경 변수 설정
- `.env.local` 파일에 환경별 설정 저장
- Supabase 연결 정보 등 민감한 정보 관리
- **중요**: 환경 변수 파일은 Git에 커밋하지 말고 `.gitignore`에 포함

---

## 🌍 언어 설정
**모든 응답은 한국어로 작성합니다.**

---

## 📚 추가 참고 자료

### 프로젝트 문서
- `docs/refactoring-plan.md`: 완료된 리팩토링 계획
- `docs/virtualization-implementation.md`: 가상화 구현 가이드  
- `docs/code-splitting-guide.md`: 코드 분할 가이드

### 성능 최적화 가이드
- React.memo 적용 패턴
- useMemo/useCallback 최적화
- 가상화 구현 방법
- 코드 분할 전략

**💡 중요**: 이 가이드라인은 2025년 대규모 리팩토링을 반영한 최신 버전입니다. 모든 새 작업은 이 기준을 따라주세요!