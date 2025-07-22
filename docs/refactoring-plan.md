# AI Safety SaaS 리팩토링 계획

## 🎯 리팩토링 목표
- 코드 일관성 향상
- 유지보수성 개선
- 확장성 확보
- 성능 최적화

---

## 📅 단계별 리팩토링 계획

### 🔴 Phase 1: 긴급 작업 (1주 이내)

#### Day 1-2: 모달 시스템 통합
**목표**: 모든 모달이 공통 BaseModal을 사용하도록 통합

**작업 내용**:
1. `src/components/ui/BaseModal.tsx` 생성
2. 기존 모달들을 BaseModal 기반으로 리팩토링
3. 모달 관련 공통 유틸리티 추출

**영향받는 파일**:
- `src/components/modals/*.tsx`
- `src/components/ui/modal.tsx`

**체크리스트**:
- [ ] BaseModal 컴포넌트 작성
- [ ] AiDocumentModal 마이그레이션
- [ ] JhaModal 마이그레이션
- [ ] ExperimentPlanModal 마이그레이션
- [ ] QuarterlyReportModal 마이그레이션
- [ ] EducationMaterialModal 마이그레이션

---

#### Day 3-4: any 타입 제거
**목표**: 타입 안정성 확보를 위한 모든 any 타입 제거

**작업 내용**:
1. 에러 핸들링 타입 개선
2. 이벤트 핸들러 타입 명시
3. API 응답 타입 구체화

**주요 수정 위치**:
- 에러 핸들링: `catch (error: any)` → `catch (error)`
- 이벤트 핸들러: `onChange={(e) => ...}` → 구체적 타입 지정
- 시설관리 타입: `[key: string]: any` → 구체적 인터페이스

**체크리스트**:
- [ ] 전체 프로젝트에서 any 검색 및 목록화
- [ ] 에러 핸들링 패턴 통일
- [ ] 이벤트 타입 정의
- [ ] 동적 객체 타입 구체화

---

#### Day 5: 중복 파일명 해결
**목표**: 파일명 충돌 해결 및 명확한 네이밍

**작업 내용**:
1. `ai-documents/DocumentCard.tsx` → `AiDocumentCard.tsx`로 변경
2. import 경로 업데이트
3. 관련 테스트 수정

**체크리스트**:
- [ ] 파일명 변경
- [ ] import 문 수정
- [ ] 동작 테스트

---

### 🟡 Phase 2: 중요 작업 (2-3주)

#### Week 2: 공통 유틸리티 추출
**목표**: 중복 코드 제거 및 재사용성 향상

**작업 내용**:
1. 날짜 포맷팅 유틸리티 통합
2. 상태 설정 상수 중앙화
3. 공통 타입 가드 추가

**생성할 파일**:
- `src/lib/utils/date.ts` - 날짜 관련 유틸리티
- `src/lib/constants/status.ts` - 상태 상수
- `src/lib/utils/typeGuards.ts` - 타입 가드 함수

**체크리스트**:
- [ ] 날짜 포맷팅 함수 통합
- [ ] 상태 관련 상수 추출
- [ ] 공통 validation 로직 추출
- [ ] 기존 코드 마이그레이션

---

#### Week 2-3: 전역 상태 관리 도입
**목표**: Zustand를 사용한 전역 상태 관리 구축

**작업 내용**:
1. Zustand 설치 및 설정
2. 전역 스토어 구조 설계
3. 기존 prop drilling 제거

**생성할 파일**:
- `src/stores/index.ts` - 스토어 통합 export
- `src/stores/useAppStore.ts` - 앱 전역 상태
- `src/stores/useAuthStore.ts` - 인증 관련 상태
- `src/stores/useNotificationStore.ts` - 알림 상태

**체크리스트**:
- [ ] Zustand 설치
- [ ] 스토어 구조 설계
- [ ] 사용자 상태 마이그레이션
- [ ] 알림 시스템 구축
- [ ] 테마 상태 관리

---

#### Week 3: 컴포넌트 구조 개선
**목표**: 논리적이고 확장 가능한 컴포넌트 구조

**작업 내용**:
1. facility 컴포넌트 세분화
2. ui 컴포넌트 카테고리화
3. index.ts 파일 추가

**새로운 폴더 구조**:
```
components/
├── facility/
│   ├── equipment/
│   ├── maintenance/
│   ├── permits/
│   ├── alerts/
│   └── index.ts
├── ui/
│   ├── forms/
│   ├── display/
│   ├── feedback/
│   ├── layout/
│   └── index.ts
└── common/
    ├── ErrorBoundary.tsx
    ├── LoadingSpinner.tsx
    └── index.ts
```

**체크리스트**:
- [ ] 폴더 구조 생성
- [ ] 컴포넌트 이동
- [ ] import 경로 업데이트
- [ ] index.ts 파일 생성

---

### 🟢 Phase 3: 개선 작업 (1개월)

#### Week 4: React Query 도입
**목표**: 데이터 페칭 최적화 및 캐싱

**작업 내용**:
1. React Query 설치 및 설정
2. API 훅 마이그레이션
3. 캐싱 전략 구현

**생성할 파일**:
- `src/lib/queryClient.ts` - Query Client 설정
- `src/hooks/queries/useDocumentsQuery.ts`
- `src/hooks/mutations/useDocumentMutation.ts`

**체크리스트**:
- [ ] React Query 설치
- [ ] QueryClient 설정
- [ ] 기존 hooks 마이그레이션
- [ ] 캐싱 정책 정의
- [ ] 낙관적 업데이트 구현

---

#### Week 5: 폼 관리 개선
**목표**: React Hook Form을 사용한 폼 관리

**작업 내용**:
1. React Hook Form 도입
2. 유효성 검증 스키마 정의
3. 폼 컴포넌트 리팩토링

**체크리스트**:
- [ ] React Hook Form 설치
- [ ] 폼 스키마 정의 (Zod/Yup)
- [ ] 기존 폼 마이그레이션
- [ ] 에러 메시지 통합

---

#### Week 6: 성능 최적화
**목표**: 렌더링 최적화 및 번들 크기 감소

**작업 내용**:
1. 컴포넌트 메모이제이션
2. 코드 분할 구현
3. 번들 분석 및 최적화

**체크리스트**:
- [ ] React.memo 적용
- [ ] useMemo/useCallback 최적화
- [ ] 동적 import 구현
- [ ] 번들 크기 분석
- [ ] 이미지 최적화

---

## 📊 진행 상황 추적

### 완료율
- Phase 1: 0% (0/3 작업)
- Phase 2: 0% (0/3 작업)
- Phase 3: 0% (0/3 작업)

### 주요 마일스톤
- [ ] 모달 시스템 통합 완료
- [ ] 타입 안정성 100% 달성
- [ ] 전역 상태 관리 구현
- [ ] 성능 최적화 완료

---

## 🚨 리스크 관리

### 잠재적 리스크
1. **대규모 리팩토링으로 인한 버그**: 단계별 테스트 필수
2. **팀원 학습 곡선**: 새로운 라이브러리 도입 시 문서화 필요
3. **일정 지연**: 버퍼 시간 확보 필요

### 롤백 계획
- 각 단계별 Git 브랜치 생성
- 단계 완료 시 태그 생성
- 문제 발생 시 이전 단계로 롤백

---

## 📝 참고 사항

### 작업 원칙
1. **점진적 개선**: 한 번에 하나씩 개선
2. **하위 호환성**: 기존 기능 유지
3. **테스트 우선**: 변경 전 테스트 작성
4. **문서화**: 변경사항 즉시 문서화

### 커밋 메시지 규칙
- `refactor: [Phase X] 작업 내용`
- `fix: 리팩토링 중 발견된 버그 수정`
- `docs: 리팩토링 관련 문서 업데이트`

---

## 🔄 업데이트 이력

### 2025-01-21
- 초기 리팩토링 계획 수립
- Phase 1-3 상세 계획 작성