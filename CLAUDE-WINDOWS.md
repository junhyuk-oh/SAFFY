# AI Safety SaaS 개발 가이드라인 (윈도우 네이티브)

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

## 🛠 개발 환경

### 기술 스택
- **Framework**: Next.js 15.4.1 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4.17
- **Package Manager**: npm
- **Runtime**: Node.js (권장: 18.x 이상)

### 개발 서버 관리
```cmd
# 서버 시작 (PowerShell/CMD)
cd C:\Users\오준혁\ai-safety-saas
npm run dev

# 백그라운드 실행 (PowerShell)
Start-Process npm -ArgumentList "run", "dev" -WindowStyle Hidden

# 서버 상태 확인
curl http://localhost:3000
```

---

## 📁 프로젝트 구조
```
C:\Users\오준혁\ai-safety-saas\
├── src\
│   ├── app\              # Next.js App Router
│   ├── components\       # React 컴포넌트
│   ├── lib\             # 유틸리티 함수
│   └── styles\          # 글로벌 스타일
├── public\              # 정적 파일
├── logs\                # 작업 로그
├── package.json         # 프로젝트 설정
└── tailwind.config.ts   # Tailwind 설정
```

---

## 💻 코딩 표준

### TypeScript 규칙
- 모든 데이터 구조에 인터페이스 정의
- 함수 매개변수와 반환값 타입 명시
- `any` 타입 사용 금지

### React 컴포넌트
- 함수형 컴포넌트와 Hooks 사용
- 이벤트 핸들러가 있는 컴포넌트는 `"use client"` 지시어 필수
- 컴포넌트 파일명: PascalCase (예: `UserProfile.tsx`)

### Tailwind CSS
- 커스텀 CSS 대신 Tailwind 유틸리티 클래스만 사용
- 반응형 디자인: 모바일 우선 접근
- 인터랙티브 요소에 transition 효과 적용

---

## 🔧 일반적인 문제 해결

### 개발 서버 문제 해결
1. 포트 3000 사용 중일 때: `netstat -ano | findstr :3000`으로 프로세스 확인
2. Node.js 버전 확인: `node --version` (18.x 이상 권장)
3. 캐시 정리: `npm run build` 후 `.next` 폴더 삭제

### TypeScript 에러
```cmd
# 타입 체크
npm run typecheck

# ESLint 실행
npm run lint

# 빌드 테스트
npm run build
```

---

## 🗂️ Git 버전 관리 (중요!)

### 수정 작업 전 반드시 실행
```cmd
# 현재 상태 저장 (백업 생성)
git add .
git commit -m "✅ 작업 시작 전 백업: [작업내용 설명]"
```

### 수정 작업 후
```cmd
# 변경사항 확인
git status
git diff

# 성공적인 수정인 경우
git add .
git commit -m "✨ [수정내용]: [변경사항 설명]"

# 잘못된 수정인 경우 (이전 상태로 복원)
git reset --hard HEAD~1
```

### 브랜치로 안전하게 작업
```cmd
# 새 기능 개발 시 브랜치 생성
git checkout -b feature/새기능명

# 작업 완료 후 메인으로 병합
git checkout master
git merge feature/새기능명
```

### 응급 복구 명령어
```cmd
# 최근 커밋으로 되돌리기
git reset --hard HEAD~1

# 특정 파일만 복원
git checkout HEAD -- 파일경로

# 모든 변경사항 취소
git reset --hard HEAD
```

**💡 팁**: 매번 큰 수정 전에 커밋하면 언제든 되돌릴 수 있습니다!

---

## 📋 작업 로그 관리

### 작업 로그 시스템
모든 개발 작업은 `C:\Users\오준혁\ai-safety-saas\logs\작업로그.md`에 기록됩니다.

### 로그 작성 시점
- **필수 기록 작업**:
  - 새로운 기능 추가
  - 버그 수정
  - 파일 구조 변경
  - 중요한 설정 변경
  - 데이터베이스 스키마 변경

### 로그 작성 방법
1. 작업 시작 시 로그에 계획 기록
2. 작업 중 중요한 변경사항 실시간 기록
3. 작업 완료 후 최종 결과 기록

### 로그 업데이트 명령어
```cmd
# PowerShell에서 로그 업데이트 확인
cd C:\Users\오준혁\ai-safety-saas
echo "로그가 업데이트되었습니다: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
```

### 작업 로그 템플릿
작업 로그 작성 시 `C:\Users\오준혁\ai-safety-saas\logs\작업로그-템플릿.md` 참조

**💡 중요**: 클로드 코드가 재시작되어도 작업 내용을 추적할 수 있도록 항상 로그를 최신 상태로 유지하세요!

---

## 🔧 윈도우 특화 설정

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

## 🌍 언어 설정
**모든 응답은 한국어로 작성합니다.**

---

## 📦 의존성 관리

### 주요 의존성
- **Next.js**: 15.4.1
- **React**: 18.x
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.4.17
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
```

### 환경 변수 설정
- `.env.local` 파일에 환경별 설정 저장
- Supabase 연결 정보 등 민감한 정보 관리

**💡 중요**: 환경 변수 파일은 Git에 커밋하지 말고 `.gitignore`에 포함시키세요!