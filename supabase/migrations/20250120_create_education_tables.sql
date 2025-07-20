-- 교육 카테고리 정의 테이블
CREATE TABLE education_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_mandatory BOOLEAN DEFAULT false,
  required_hours INTEGER DEFAULT 0,
  validity_months INTEGER, -- 유효기간(월)
  parent_id UUID REFERENCES education_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 대상자 매칭 규칙 테이블
CREATE TABLE target_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES education_categories(id) ON DELETE CASCADE,
  rule_type VARCHAR(50) NOT NULL, -- 'department', 'position', 'role', 'work_type', 'custom'
  rule_value JSONB NOT NULL, -- 규칙 조건 (부서, 직급, 역할 등)
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 개인별 교육 요구사항 테이블
CREATE TABLE user_education_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID REFERENCES education_categories(id) ON DELETE CASCADE,
  required_date DATE NOT NULL, -- 교육 필요 시작일
  due_date DATE NOT NULL, -- 교육 완료 기한
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'overdue'
  completion_date DATE,
  exemption_reason TEXT,
  is_exempted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, required_date)
);

-- 교육 이수 기록 테이블
CREATE TABLE education_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID REFERENCES education_categories(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES user_education_requirements(id) ON DELETE SET NULL,
  education_date DATE NOT NULL,
  education_hours DECIMAL(4,2) DEFAULT 0,
  provider VARCHAR(200), -- 교육 제공자/기관
  certificate_number VARCHAR(100),
  certificate_url TEXT,
  certificate_file_path TEXT,
  expiry_date DATE, -- 수료증 만료일
  verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verification_date TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TBM 등 일일 교육 기록 테이블
CREATE TABLE daily_education_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  education_date DATE NOT NULL,
  education_type VARCHAR(50) NOT NULL, -- 'tbm', 'safety_moment', 'special'
  topic VARCHAR(500) NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  instructor_id UUID,
  location VARCHAR(200),
  attendance_status VARCHAR(50) DEFAULT 'present', -- 'present', 'absent', 'excused'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, education_date, education_type)
);

-- 인덱스 생성
CREATE INDEX idx_target_rules_category ON target_rules(category_id);
CREATE INDEX idx_target_rules_type ON target_rules(rule_type);
CREATE INDEX idx_requirements_user ON user_education_requirements(user_id);
CREATE INDEX idx_requirements_status ON user_education_requirements(status);
CREATE INDEX idx_requirements_due_date ON user_education_requirements(due_date);
CREATE INDEX idx_records_user ON education_records(user_id);
CREATE INDEX idx_records_category ON education_records(category_id);
CREATE INDEX idx_records_date ON education_records(education_date);
CREATE INDEX idx_records_verification ON education_records(verification_status);
CREATE INDEX idx_daily_logs_user ON daily_education_logs(user_id);
CREATE INDEX idx_daily_logs_date ON daily_education_logs(education_date);
CREATE INDEX idx_daily_logs_type ON daily_education_logs(education_type);

-- RLS 정책 설정
ALTER TABLE education_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_education_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_education_logs ENABLE ROW LEVEL SECURITY;

-- 교육 카테고리는 모든 사용자가 조회 가능
CREATE POLICY "교육 카테고리 조회" ON education_categories
  FOR SELECT USING (true);

-- 관리자만 교육 카테고리 수정 가능
CREATE POLICY "교육 카테고리 관리" ON education_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager')
    )
  );

-- 대상자 규칙은 관리자만 관리 가능
CREATE POLICY "대상자 규칙 관리" ON target_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager')
    )
  );

-- 본인의 교육 요구사항 조회 가능
CREATE POLICY "교육 요구사항 조회" ON user_education_requirements
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager', 'manager')
    )
  );

-- 교육 요구사항 관리는 관리자만 가능
CREATE POLICY "교육 요구사항 관리" ON user_education_requirements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager')
    )
  );

-- 본인의 교육 기록 조회 가능
CREATE POLICY "교육 기록 조회" ON education_records
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager', 'manager')
    )
  );

-- 교육 기록 등록은 본인 또는 관리자만 가능
CREATE POLICY "교육 기록 등록" ON education_records
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager')
    )
  );

-- 교육 기록 수정은 관리자만 가능
CREATE POLICY "교육 기록 수정" ON education_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager')
    )
  );

-- 일일 교육 로그는 본인 것만 조회 가능
CREATE POLICY "일일 교육 로그 조회" ON daily_education_logs
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager', 'manager')
    )
  );

-- 일일 교육 로그 관리
CREATE POLICY "일일 교육 로그 관리" ON daily_education_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'safety_manager', 'manager')
    )
  );

-- 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_education_categories_updated_at BEFORE UPDATE ON education_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_target_rules_updated_at BEFORE UPDATE ON target_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_education_requirements_updated_at BEFORE UPDATE ON user_education_requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_records_updated_at BEFORE UPDATE ON education_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_education_logs_updated_at BEFORE UPDATE ON daily_education_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 교육 요구사항 상태 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_requirement_status()
RETURNS TRIGGER AS $$
BEGIN
  -- 교육 기록이 추가되면 해당 요구사항 상태를 완료로 변경
  IF NEW.verification_status = 'verified' THEN
    UPDATE user_education_requirements
    SET 
      status = 'completed',
      completion_date = NEW.education_date
    WHERE id = NEW.requirement_id
    AND status != 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_requirement_on_record_verified
  AFTER INSERT OR UPDATE OF verification_status ON education_records
  FOR EACH ROW
  WHEN (NEW.verification_status = 'verified')
  EXECUTE FUNCTION update_requirement_status();

-- 만료된 교육 요구사항 상태 업데이트 함수 (스케줄러로 실행)
CREATE OR REPLACE FUNCTION check_overdue_requirements()
RETURNS void AS $$
BEGIN
  UPDATE user_education_requirements
  SET status = 'overdue'
  WHERE status IN ('pending', 'in_progress')
  AND due_date < CURRENT_DATE;
END;
$$ language 'plpgsql';