# 데이터베이스 설정 가이드

## 개요

AI Safety SaaS는 Supabase를 사용하여 PostgreSQL 데이터베이스를 관리합니다. 이 가이드는 데이터베이스 설정 및 마이그레이션 방법을 설명합니다.

## 1. Supabase 프로젝트 설정

### 1.1 새 프로젝트 생성
1. [Supabase](https://app.supabase.com) 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: ai-safety-saas
   - Database Password: 강력한 비밀번호 설정
   - Region: 한국과 가까운 지역 선택 (예: Northeast Asia)

### 1.2 API 키 확인
프로젝트 생성 후 Settings > API에서 다음 정보 확인:
- Project URL
- anon public key
- service_role key (주의: 절대 공개하지 말 것)

## 2. 환경 변수 설정

### 2.1 환경 파일 생성
```bash
cp .env.local.example .env.local
```

### 2.2 환경 변수 입력
`.env.local` 파일에 Supabase 정보 입력:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. 데이터베이스 마이그레이션

### 3.1 교육 관리 테이블 생성
```sql
-- supabase/migrations/20250120_create_education_tables.sql 실행
```

이 마이그레이션은 다음 테이블을 생성합니다:
- `education_categories`: 교육 카테고리 정의
- `target_rules`: 대상자 매칭 규칙
- `user_education_requirements`: 개인별 교육 요구사항
- `education_records`: 교육 이수 기록
- `daily_education_logs`: 일일 교육 로그 (TBM 등)

### 3.2 Documents 테이블 확장
```sql
-- src/lib/db/migrations/documents_enhanced.sql 실행
```

이 마이그레이션은 documents 테이블에 다음 기능을 추가합니다:
- 문서 타입 및 부서 분류
- 메타데이터 및 태그 시스템
- 우선순위 및 할당자 관리
- 승인 워크플로우
- 버전 관리
- 전문 검색 기능

## 4. 데이터베이스 스키마

### 4.1 확장된 Documents 테이블 구조
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES document_templates(id),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content JSONB,
  file_path TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  
  -- 새로 추가된 필드들
  document_type VARCHAR(50) DEFAULT 'general',
  department VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_to UUID,
  due_date DATE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  version INTEGER DEFAULT 1,
  parent_document_id UUID REFERENCES documents(id),
  is_template BOOLEAN DEFAULT false,
  approval_status VARCHAR(50) DEFAULT 'pending',
  approval_history JSONB DEFAULT '[]',
  file_size BIGINT,
  file_type VARCHAR(50),
  search_vector TSVECTOR,
  comments JSONB DEFAULT '[]',
  feedback_score INTEGER CHECK (feedback_score >= 1 AND feedback_score <= 5),
  feedback_comment TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 주요 인덱스
```sql
-- 검색 성능 향상을 위한 인덱스
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_department ON documents(department);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_documents_metadata ON documents USING GIN(metadata);
CREATE INDEX idx_documents_search_vector ON documents USING GIN(search_vector);
```

## 5. Row Level Security (RLS) 정책

### 5.1 기본 보안 정책
모든 테이블에 RLS가 활성화되어 있으며, 다음 원칙을 따릅니다:
- 사용자는 자신의 데이터만 접근 가능
- 관리자는 모든 데이터 접근 가능
- 부서별 데이터 격리

### 5.2 주요 정책 예시
```sql
-- 부서별 문서 접근 정책
CREATE POLICY "부서별 문서 접근" ON documents
  FOR SELECT USING (
    department IS NULL OR
    department = (SELECT u.department FROM users u WHERE u.id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'safety_manager')
    )
  );
```

## 6. 내장 함수 및 기능

### 6.1 문서 검색 함수
```sql
-- 전문 검색 함수
SELECT * FROM search_documents(
  search_query := '안전점검',
  doc_type := 'safety_inspection',
  dept := '생산부'
);
```

### 6.2 기한 임박 문서 조회
```sql
-- 7일 이내 마감 문서 조회
SELECT * FROM get_due_documents(7);
```

### 6.3 승인 히스토리 추가
```sql
-- 문서 승인 처리
SELECT add_approval_history(
  doc_id := 'document-uuid',
  action := 'approved',
  approver_id := 'user-uuid',
  comment := '검토 완료'
);
```

### 6.4 문서 버전 생성
```sql
-- 새 버전 생성
SELECT create_document_version(
  original_doc_id := 'document-uuid',
  new_content := '{"title": "Updated Document", "content": "..."}',
  editor_id := 'user-uuid'
);
```

## 7. 통계 및 리포팅

### 7.1 부서별 문서 통계
```sql
SELECT * FROM document_stats_by_department
WHERE department = '생산부';
```

### 7.2 월별 문서 생성 현황
```sql
SELECT * FROM monthly_document_stats
WHERE month >= '2024-01-01'
ORDER BY month DESC;
```

## 8. 백업 및 복구

### 8.1 자동 백업
Supabase는 자동으로 데이터베이스 백업을 수행합니다:
- Point-in-time recovery 지원
- 최대 7일간 백업 보관 (Free tier)

### 8.2 수동 백업
```bash
# Supabase CLI를 사용한 백업
supabase db dump -f backup.sql

# 특정 테이블만 백업
supabase db dump -f documents_backup.sql --table documents
```

## 9. 모니터링 및 성능

### 9.1 쿼리 성능 모니터링
Supabase Dashboard에서 확인 가능:
- 느린 쿼리 식별
- 인덱스 사용률
- 데이터베이스 연결 상태

### 9.2 성능 최적화 팁
1. 자주 사용되는 컬럼에 인덱스 추가
2. 전문 검색 시 search_vector 활용
3. JSONB 필드는 GIN 인덱스 사용
4. 대용량 데이터 조회 시 페이지네이션 적용

## 10. 문제 해결

### 10.1 연결 문제
```bash
# 연결 테스트
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     https://YOUR_PROJECT_ID.supabase.co/rest/v1/
```

### 10.2 마이그레이션 실패
1. Supabase Dashboard의 SQL Editor에서 직접 실행
2. 권한 확인 (service_role 키 사용)
3. 테이블 의존성 확인

### 10.3 RLS 정책 문제
1. 정책이 올바르게 설정되었는지 확인
2. 사용자 role이 올바른지 확인
3. auth.uid() 값이 정상인지 확인

## 11. 보안 고려사항

### 11.1 API 키 관리
- anon key: 클라이언트 사이드에서만 사용
- service_role key: 서버 사이드에서만 사용, 절대 노출 금지

### 11.2 RLS 정책 검증
정기적으로 RLS 정책을 검토하여 데이터 유출 방지:
```sql
-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'documents';
```

### 11.3 SQL 인젝션 방지
- 파라미터화된 쿼리 사용
- 사용자 입력 검증
- Supabase 클라이언트 라이브러리 활용

---

## 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)
- [RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [전문 검색 가이드](https://supabase.com/docs/guides/database/full-text-search)