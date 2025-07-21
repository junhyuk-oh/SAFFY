# AI Safety SaaS 디자인 시스템 가이드

## 1. 디자인 원칙

### 1.1 핵심 가치
- **명확성**: 모든 UI 요소는 즉각적으로 이해 가능해야 함
- **일관성**: 전체 애플리케이션에서 동일한 패턴 사용
- **접근성**: 모든 사용자가 쉽게 접근할 수 있는 디자인
- **효율성**: 최소한의 클릭으로 목표 달성

### 1.2 시각적 계층구조
- 중요도에 따른 명확한 시각적 구분
- 적절한 여백과 그룹핑으로 정보 구조화
- 일관된 타이포그래피 스케일 사용

## 2. 색상 시스템

### 2.1 주요 색상
```css
/* 배경 색상 */
--background: #f8f9fa;              /* 메인 배경 */
--background-secondary: #ffffff;     /* 카드/패널 배경 */
--background-hover: #f3f4f6;        /* 호버 상태 */
--background-selected: #e5e7eb;     /* 선택 상태 */

/* 브랜드 색상 */
--primary: #2563eb;                 /* 주요 액션/링크 */
--primary-hover: #1d4ed8;           /* 호버 상태 */
--primary-light: #eff6ff;           /* 배경 강조 */

/* 텍스트 색상 */
--text-primary: #1a1a1a;            /* 제목/주요 텍스트 */
--text-secondary: #6b7280;          /* 보조 텍스트 */
--text-tertiary: #4b5563;           /* 비활성 텍스트 */
--text-inverse: #ffffff;            /* 반전 텍스트 */

/* 상태 색상 */
--success: #10b981;                 /* 성공 */
--warning: #f59e0b;                 /* 경고 */
--error: #ef4444;                   /* 오류 */
```

### 2.2 색상 사용 가이드
- **Primary**: CTA 버튼, 주요 링크, 활성 상태
- **Success**: 완료 상태, 긍정적 피드백
- **Warning**: 주의 필요, 검토 대기
- **Error**: 오류, 기한 초과, 삭제 액션

## 3. 타이포그래피

### 3.1 폰트 패밀리
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
```

### 3.2 텍스트 스케일
- **제목 1**: 32px / font-bold
- **제목 2**: 24px / font-semibold
- **제목 3**: 20px / font-semibold
- **본문**: 16px / font-normal
- **보조**: 14px / font-normal
- **캡션**: 12px / font-normal

## 4. 간격 시스템

### 4.1 여백 스케일
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### 4.2 컴포넌트 간격
- 섹션 간격: 48px
- 카드 내부 패딩: 20px
- 요소 간 간격: 8-16px

## 5. 컴포넌트 패턴

### 5.1 버튼
```tsx
// Primary 버튼
className="bg-primary text-white hover:bg-primary-hover transition-colors duration-200"

// Secondary 버튼
className="bg-background-hover text-text-primary hover:bg-background-selected transition-colors duration-200"

// Ghost 버튼
className="text-primary hover:bg-primary-light transition-colors duration-200"
```

### 5.2 카드
```tsx
className="bg-background-secondary rounded-notion-md p-5 border border-border transition-all duration-200 hover:shadow-notion-md hover:-translate-y-0.5"
```

### 5.3 입력 필드
```tsx
className="w-full px-3 py-2 border border-border rounded-notion-sm focus:border-primary focus:outline-none transition-colors"
```

## 6. 애니메이션 가이드

### 6.1 트랜지션 시간
- **빠름**: 150ms (호버, 포커스)
- **보통**: 200ms (일반 상태 변경)
- **느림**: 300ms (페이지 전환, 모달)

### 6.2 Easing 함수
```css
/* 기본 easing */
transition-timing-function: ease-in-out;

/* 들어올 때 */
transition-timing-function: ease-out;

/* 나갈 때 */
transition-timing-function: ease-in;
```

### 6.3 페이지 전환 애니메이션
```tsx
// Fade in
className="animate-fadeIn"

// Slide up
className="animate-slideUp"

// Scale
className="animate-scaleIn"
```

## 7. 반응형 디자인

### 7.1 브레이크포인트
- **모바일**: < 640px
- **태블릿**: 640px - 1024px
- **데스크톱**: > 1024px

### 7.2 그리드 시스템
- 데스크톱: 12 컬럼
- 태블릿: 8 컬럼
- 모바일: 4 컬럼

### 7.3 반응형 패턴
```tsx
// 반응형 그리드
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// 반응형 패딩
className="p-4 md:p-6 lg:p-8"

// 반응형 텍스트
className="text-sm md:text-base lg:text-lg"
```

## 8. 상호작용 패턴

### 8.1 호버 효과
- 색상 변경: `hover:bg-*` `hover:text-*`
- 그림자: `hover:shadow-notion-md`
- 변형: `hover:-translate-y-0.5`
- 테두리: `hover:border-border-hover`

### 8.2 포커스 상태
```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
```

### 8.3 액티브 상태
```tsx
className="active:scale-95 transition-transform"
```

## 9. 로딩 상태

### 9.1 스켈레톤 로더
```tsx
className="animate-pulse bg-background-hover rounded-notion-sm"
```

### 9.2 스피너
```tsx
className="animate-spin h-5 w-5 text-primary"
```

### 9.3 프로그레스 바
```tsx
className="h-2 bg-background-hover rounded-full overflow-hidden"
```

## 10. 에러 처리 UI

### 10.1 인라인 에러
```tsx
className="text-error text-sm mt-1"
```

### 10.2 토스트 알림
```tsx
className="fixed bottom-4 right-4 bg-background-secondary shadow-notion-lg rounded-notion-md p-4"
```

### 10.3 빈 상태
```tsx
<div className="text-center py-12">
  <span className="text-4xl mb-4">🔍</span>
  <p className="text-text-secondary">데이터가 없습니다</p>
</div>
```

## 11. 접근성 가이드

### 11.1 키보드 네비게이션
- 모든 인터랙티브 요소는 Tab으로 접근 가능
- 포커스 인디케이터 명확히 표시
- Escape 키로 모달/드롭다운 닫기

### 11.2 스크린 리더
- 의미 있는 alt 텍스트 제공
- aria-label 적절히 사용
- 제목 계층구조 유지

### 11.3 색상 대비
- 텍스트와 배경 간 충분한 대비
- 색상만으로 정보 전달 금지
- 상태 표시에 아이콘 병행 사용

## 12. 구현 예시

### 12.1 일관된 페이지 레이아웃
```tsx
export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <aside className="w-64 bg-background-secondary border-r border-border">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

### 12.2 일관된 카드 컴포넌트
```tsx
export function Card({ title, children }: CardProps) {
  return (
    <div className="bg-background-secondary rounded-notion-md p-5 border border-border transition-all duration-200 hover:shadow-notion-md">
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
```

## 13. 체크리스트

### 개발 시 확인사항
- [ ] 색상 변수 사용 여부
- [ ] 일관된 간격 사용
- [ ] 호버/포커스 상태 구현
- [ ] 반응형 디자인 적용
- [ ] 애니메이션 시간 준수
- [ ] 접근성 요구사항 충족
- [ ] 에러 상태 처리
- [ ] 로딩 상태 표시