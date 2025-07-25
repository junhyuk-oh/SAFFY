# 코드 분할 및 번들 최적화 가이드

## 1. 번들 분석

### 설치
```bash
npm install --save-dev webpack-bundle-analyzer cross-env
```

### 사용법
```bash
# 번들 분석 실행
npm run analyze

# 분석 결과 확인
npm run bundle-analyzer
```

## 2. 동적 임포트를 통한 코드 분할

### 페이지 레벨 코드 분할 (Next.js 자동)
Next.js는 각 페이지를 자동으로 코드 분할합니다.

### 컴포넌트 레벨 동적 임포트

#### 모달 컴포넌트 지연 로딩
```typescript
// src/app/ai-documents/page.tsx
import dynamic from 'next/dynamic'

// 동적 임포트로 모달 지연 로딩
const AiDocumentModal = dynamic(
  () => import('@/components/modals/AiDocumentModal').then(mod => mod.AiDocumentModal),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false // 클라이언트 사이드에서만 렌더링
  }
)

const JhaModal = dynamic(
  () => import('@/components/modals/JhaModal').then(mod => mod.JhaModal),
  { loading: () => <div>Loading...</div> }
)
```

#### 대시보드 위젯 지연 로딩
```typescript
// src/app/page.tsx
import dynamic from 'next/dynamic'

const FacilityStats = dynamic(
  () => import('@/components/facility/FacilityStats'),
  { loading: () => <StatsLoading /> }
)

const EducationStats = dynamic(
  () => import('@/components/education/EducationStats'),
  { loading: () => <StatsLoading /> }
)
```

#### 차트 라이브러리 지연 로딩
```typescript
// src/components/charts/EquipmentChart.tsx
import dynamic from 'next/dynamic'

const Chart = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Line),
  { 
    loading: () => <div>차트 로딩 중...</div>,
    ssr: false 
  }
)
```

### React.lazy 사용 (클라이언트 컴포넌트)
```typescript
// src/components/documents/DocumentViewer.tsx
import { lazy, Suspense } from 'react'

const PDFViewer = lazy(() => import('./PDFViewer'))
const ExcelViewer = lazy(() => import('./ExcelViewer'))
const ImageViewer = lazy(() => import('./ImageViewer'))

export function DocumentViewer({ document }: { document: Document }) {
  const renderViewer = () => {
    switch (document.type) {
      case 'pdf':
        return <PDFViewer document={document} />
      case 'excel':
        return <ExcelViewer document={document} />
      case 'image':
        return <ImageViewer document={document} />
      default:
        return <div>지원하지 않는 형식입니다</div>
    }
  }

  return (
    <Suspense fallback={<div>문서 로딩 중...</div>}>
      {renderViewer()}
    </Suspense>
  )
}
```

## 3. 라이브러리 최적화

### Tree Shaking 최적화
```typescript
// ❌ 잘못된 방법 - 전체 라이브러리 임포트
import * as Icons from 'lucide-react'

// ✅ 올바른 방법 - 필요한 아이콘만 임포트
import { Wrench, Clock, AlertCircle } from 'lucide-react'
```

### Date-fns 최적화
```typescript
// ❌ 잘못된 방법
import { format, parseISO, addDays } from 'date-fns'

// ✅ 올바른 방법 - 개별 함수 임포트
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'
```

## 4. 라우트 그룹별 번들 분할

```typescript
// src/app/layout.tsx
// 공통 레이아웃에서는 필수 컴포넌트만 로드

// src/app/(dashboard)/layout.tsx
// 대시보드 관련 컴포넌트 로드

// src/app/(documents)/layout.tsx
// 문서 관련 컴포넌트 로드

// src/app/(facility)/layout.tsx
// 시설관리 관련 컴포넌트 로드
```

## 5. 조건부 로딩 패턴

### 사용자 권한에 따른 로딩
```typescript
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <div>Loading admin panel...</div>,
})

export function Dashboard() {
  const { user } = useAuthStore()
  
  return (
    <div>
      {/* 일반 대시보드 컴포넌트 */}
      <GeneralDashboard />
      
      {/* 관리자인 경우에만 로드 */}
      {user?.role === 'admin' && <AdminPanel />}
    </div>
  )
}
```

### 디바이스별 컴포넌트 로딩
```typescript
const MobileChart = dynamic(() => import('./MobileChart'))
const DesktopChart = dynamic(() => import('./DesktopChart'))

export function ChartContainer() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return isMobile ? <MobileChart /> : <DesktopChart />
}
```

## 6. 프리페칭 전략

### 링크 프리페치
```typescript
import Link from 'next/link'

// 자동 프리페치 (뷰포트에 들어올 때)
<Link href="/documents" prefetch={true}>
  문서 관리
</Link>

// 수동 프리페치
import { useRouter } from 'next/navigation'

const router = useRouter()

// 사용자가 호버할 때 프리페치
<button 
  onMouseEnter={() => router.prefetch('/heavy-page')}
  onClick={() => router.push('/heavy-page')}
>
  무거운 페이지로 이동
</button>
```

### 컴포넌트 프리로드
```typescript
// 모달을 열기 전에 미리 로드
const preloadModal = () => {
  import('@/components/modals/HeavyModal')
}

<button 
  onMouseEnter={preloadModal}
  onClick={() => setModalOpen(true)}
>
  모달 열기
</button>
```

## 7. 성능 모니터링

### Web Vitals 측정
```typescript
// src/app/layout.tsx
export function reportWebVitals(metric: any) {
  console.log(metric)
  
  // 분석 서비스로 전송
  if (metric.label === 'web-vital') {
    analytics.send({
      name: metric.name,
      value: metric.value,
    })
  }
}
```

## 8. 번들 크기 목표

- 초기 로드: < 200KB (gzipped)
- 페이지별 청크: < 100KB
- 전체 번들: < 1MB

## 9. 체크리스트

- [ ] 모든 모달을 동적 임포트로 변경
- [ ] 차트 라이브러리 지연 로딩 적용
- [ ] 큰 컴포넌트 동적 임포트 적용
- [ ] 사용하지 않는 의존성 제거
- [ ] Tree shaking 최적화
- [ ] 번들 분석 후 큰 청크 분할
- [ ] 프리페치 전략 구현