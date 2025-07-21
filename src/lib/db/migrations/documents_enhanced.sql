-- Documents 테이블 확장 마이그레이션
-- 문서 관리 기능 개선을 위한 새로운 컬럼 및 인덱스 추가

-- 1. 새로운 컬럼 추가
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS document_type VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS assigned_to UUID,
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approval_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- 2. document_type 에 대한 체크 제약조건 추가
ALTER TABLE documents 
ADD CONSTRAINT check_document_type 
CHECK (document_type IN (
  'daily_checklist', 'experiment_log', 'safety_inspection', 
  'risk_assessment', 'education_log', 'chemical_usage_report', 
  'weekly_checklist', 'quarterly_report', 'annual_safety_plan',
  'jha', 'safety_meeting', 'incident_report', 'audit_report',
  'policy', 'procedure', 'general'
));

-- 3. priority 에 대한 체크 제약조건 추가
ALTER TABLE documents 
ADD CONSTRAINT check_priority 
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- 4. approval_status 에 대한 체크 제약조건 추가
ALTER TABLE documents 
ADD CONSTRAINT check_approval_status 
CHECK (approval_status IN ('pending', 'approved', 'rejected', 'revision_required'));

-- 5. 검색 성능을 위한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_department ON documents(department);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_priority ON documents(priority);
CREATE INDEX IF NOT EXISTS idx_documents_assigned_to ON documents(assigned_to);
CREATE INDEX IF NOT EXISTS idx_documents_due_date ON documents(due_date);
CREATE INDEX IF NOT EXISTS idx_documents_approval_status ON documents(approval_status);
CREATE INDEX IF NOT EXISTS idx_documents_is_template ON documents(is_template);
CREATE INDEX IF NOT EXISTS idx_documents_parent_id ON documents(parent_document_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at);

-- 6. 태그 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);

-- 7. 메타데이터 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_documents_metadata ON documents USING GIN(metadata);

-- 8. 전문 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_documents_search_vector ON documents USING GIN(search_vector);

-- 9. 복합 인덱스 (자주 사용되는 조합)
CREATE INDEX IF NOT EXISTS idx_documents_type_status ON documents(document_type, status);
CREATE INDEX IF NOT EXISTS idx_documents_user_type ON documents(user_id, document_type);
CREATE INDEX IF NOT EXISTS idx_documents_dept_status ON documents(department, status);

-- 10. 검색 벡터 업데이트 함수
CREATE OR REPLACE FUNCTION update_document_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('korean', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('korean', COALESCE(NEW.content::text, '')), 'B') ||
    setweight(to_tsvector('korean', COALESCE(NEW.department, '')), 'C') ||
    setweight(to_tsvector('korean', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. 검색 벡터 업데이트 트리거
DROP TRIGGER IF EXISTS trigger_update_document_search_vector ON documents;
CREATE TRIGGER trigger_update_document_search_vector
  BEFORE INSERT OR UPDATE OF title, content, department, tags
  ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_search_vector();

-- 12. 기존 데이터의 검색 벡터 업데이트
UPDATE documents SET 
  search_vector = 
    setweight(to_tsvector('korean', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('korean', COALESCE(content::text, '')), 'B') ||
    setweight(to_tsvector('korean', COALESCE(department, '')), 'C') ||
    setweight(to_tsvector('korean', COALESCE(array_to_string(tags, ' '), '')), 'D')
WHERE search_vector IS NULL;

-- 13. 문서 승인 히스토리 추가 함수
CREATE OR REPLACE FUNCTION add_approval_history(
  doc_id UUID,
  action VARCHAR(50),
  approver_id UUID,
  comment TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  history_entry JSONB;
BEGIN
  history_entry := jsonb_build_object(
    'action', action,
    'approver_id', approver_id,
    'timestamp', NOW(),
    'comment', comment
  );
  
  UPDATE documents 
  SET approval_history = approval_history || history_entry
  WHERE id = doc_id;
END;
$$ LANGUAGE plpgsql;

-- 14. 문서 버전 관리 함수
CREATE OR REPLACE FUNCTION create_document_version(
  original_doc_id UUID,
  new_content JSONB,
  editor_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_doc_id UUID;
  current_version INTEGER;
BEGIN
  -- 현재 최대 버전 번호 확인
  SELECT COALESCE(MAX(version), 0) + 1 
  INTO current_version
  FROM documents 
  WHERE parent_document_id = original_doc_id OR id = original_doc_id;
  
  -- 새 버전 생성
  INSERT INTO documents (
    template_id, user_id, title, content, document_type, 
    department, metadata, tags, priority, assigned_to, 
    due_date, version, parent_document_id, approval_status
  )
  SELECT 
    template_id, editor_id, title || ' (v' || current_version || ')', 
    new_content, document_type, department, metadata, tags, 
    priority, assigned_to, due_date, current_version, original_doc_id,
    'pending'
  FROM documents 
  WHERE id = original_doc_id
  RETURNING id INTO new_doc_id;
  
  RETURN new_doc_id;
END;
$$ LANGUAGE plpgsql;

-- 15. 기한 임박 문서 알림 함수
CREATE OR REPLACE FUNCTION get_due_documents(days_ahead INTEGER DEFAULT 7)
RETURNS TABLE (
  id UUID,
  title TEXT,
  document_type VARCHAR(50),
  department VARCHAR(100),
  assigned_to UUID,
  due_date DATE,
  days_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.document_type,
    d.department,
    d.assigned_to,
    d.due_date,
    (d.due_date - CURRENT_DATE)::INTEGER as days_remaining
  FROM documents d
  WHERE d.due_date IS NOT NULL
    AND d.due_date <= CURRENT_DATE + INTERVAL '%d days'
    AND d.status != 'completed'
  ORDER BY d.due_date ASC;
END;
$$ LANGUAGE plpgsql;

-- 16. 부서별 문서 통계 뷰
CREATE OR REPLACE VIEW document_stats_by_department AS
SELECT 
  department,
  document_type,
  status,
  COUNT(*) as document_count,
  AVG(EXTRACT(DAY FROM (updated_at - created_at))) as avg_completion_days
FROM documents
WHERE department IS NOT NULL
GROUP BY department, document_type, status;

-- 17. 월별 문서 생성 통계 뷰
CREATE OR REPLACE VIEW monthly_document_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  document_type,
  department,
  COUNT(*) as created_count,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
  ROUND(
    COUNT(CASE WHEN status = 'completed' THEN 1 END)::NUMERIC / 
    COUNT(*)::NUMERIC * 100, 2
  ) as completion_rate
FROM documents
GROUP BY DATE_TRUNC('month', created_at), document_type, department
ORDER BY month DESC;

-- 18. 권한 정책 업데이트 (기존 RLS 정책이 있다면)
-- 부서별 접근 권한 추가
CREATE POLICY IF NOT EXISTS "부서별 문서 접근" ON documents
  FOR SELECT USING (
    department IS NULL OR
    department = (
      SELECT u.department 
      FROM users u 
      WHERE u.id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'safety_manager')
    )
  );

-- 19. 문서 검색 함수 (전문 검색)
CREATE OR REPLACE FUNCTION search_documents(
  search_query TEXT,
  doc_type VARCHAR(50) DEFAULT NULL,
  dept VARCHAR(100) DEFAULT NULL,
  status_filter VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  document_type VARCHAR(50),
  department VARCHAR(100),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.document_type,
    d.department,
    d.status,
    d.created_at,
    ts_rank(d.search_vector, plainto_tsquery('korean', search_query)) as rank
  FROM documents d
  WHERE d.search_vector @@ plainto_tsquery('korean', search_query)
    AND (doc_type IS NULL OR d.document_type = doc_type)
    AND (dept IS NULL OR d.department = dept)
    AND (status_filter IS NULL OR d.status = status_filter)
  ORDER BY rank DESC, d.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 20. 댓글 및 피드백 저장을 위한 컬럼 추가
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS feedback_score INTEGER CHECK (feedback_score >= 1 AND feedback_score <= 5),
ADD COLUMN IF NOT EXISTS feedback_comment TEXT;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Documents 테이블 확장 마이그레이션이 완료되었습니다.';
  RAISE NOTICE '추가된 기능:';
  RAISE NOTICE '- 문서 타입 및 부서 분류';
  RAISE NOTICE '- 메타데이터 및 태그 시스템';
  RAISE NOTICE '- 우선순위 및 할당자 관리';
  RAISE NOTICE '- 승인 워크플로우';
  RAISE NOTICE '- 버전 관리';
  RAISE NOTICE '- 전문 검색';
  RAISE NOTICE '- 통계 및 리포팅 뷰';
END $$;