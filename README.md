# AI Safety SaaS Platform (SafeLab AI)

## 🚀 프로젝트 소개

SafeLab AI는 연구실 및 실험실의 안전관리를 AI로 자동화하는 SaaS 플랫폼입니다.

### 주요 기능
- 🤖 **AI 문서 자동 생성**: 위험성평가서, JHA 등을 3분 내 자동 완성
- 📸 **OCR 문서 스캔**: 기존 문서를 스캔하여 자동으로 분류 및 저장
- 📊 **통합 대시보드**: 안전관리 현황을 한눈에 파악
- ⚖️ **법적 준수 관리**: 중대재해처벌법, 연구실안전법 등 자동 체크
- 📱 **모바일 최적화**: 언제 어디서나 안전관리 가능

## 🛠 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **State Management**: React Hooks
- **Styling**: Tailwind CSS + CSS Modules

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
├── components/         
│   ├── layout/         # 레이아웃 컴포넌트
│   ├── dashboard/      # 대시보드 컴포넌트
│   └── modals/         # 모달 컴포넌트
├── lib/                # 유틸리티 함수
└── types/              # TypeScript 타입 정의
```

## 🎨 주요 컴포넌트

### Layout Components
- **Header**: 메인 네비게이션 바
- **Sidebar**: 사이드 메뉴 네비게이션

### Dashboard Components
- **StatsCard**: 통계 정보 표시 카드
- **QuickActions**: 빠른 작업 버튼 그리드
- **RecentDocuments**: 최근 문서 테이블

### Modal Components
- **AiDocumentModal**: AI 문서 생성 모달

## 🔧 개발 가이드

### 컴포넌트 추가
```tsx
// 새 컴포넌트는 "use client" 지시자와 함께 시작
"use client"

import { ComponentProps } from "@/types"

export function NewComponent({ prop }: ComponentProps) {
  return <div>Component Content</div>
}
```

### 스타일링 규칙
- Tailwind CSS 클래스 우선 사용
- 복잡한 스타일은 cn() 유틸리티 활용
- 반응형 디자인 필수

## 📈 향후 계획

- [ ] 사용자 인증 시스템
- [ ] 실시간 알림 기능
- [ ] 데이터 분석 대시보드
- [ ] API 연동
- [ ] 다국어 지원

## 📝 라이센스

Copyright © 2024 SafeLab AI. All rights reserved.
