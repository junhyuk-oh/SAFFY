-- 문서 테이블 생성
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID,
  user_id TEXT NOT NULL DEFAULT 'temp-user-id',
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'completed', 'overdue', 'pending', 'archived')),
  document_type TEXT DEFAULT 'general',
  department TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  version INTEGER DEFAULT 1,
  parent_document_id UUID,
  is_template BOOLEAN DEFAULT false,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'revision_required')),
  approval_history JSONB[] DEFAULT '{}',
  file_size INTEGER,
  file_type TEXT,
  search_vector tsvector,
  comments JSONB[] DEFAULT '{}',
  feedback_score INTEGER,
  feedback_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_department ON documents(department);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_documents_content_type ON documents((content->>'type'));
CREATE INDEX idx_documents_content_department ON documents((content->>'department'));

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE
    ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 문서 이력 테이블
CREATE TABLE IF NOT EXISTS document_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  changes JSONB NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 문서 이력 인덱스
CREATE INDEX idx_document_history_document_id ON document_history(document_id);
CREATE INDEX idx_document_history_changed_at ON document_history(changed_at DESC);