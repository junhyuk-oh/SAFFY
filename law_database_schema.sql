-- 법률 데이터베이스 스키마 설계
-- 중대재해처벌법, 실험실안전관리법, 화학물질관리법 등을 저장하기 위한 테이블 구조

-- 1. 법률 기본 정보 테이블
CREATE TABLE laws (
    id SERIAL PRIMARY KEY,
    law_name VARCHAR(200) NOT NULL,
    law_name_eng VARCHAR(200),
    law_number VARCHAR(50),
    enactment_date DATE,
    enforcement_date DATE,
    last_amended_date DATE,
    administering_agency VARCHAR(100),
    law_category VARCHAR(50),
    summary TEXT,
    purpose TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 법조문 테이블
CREATE TABLE law_articles (
    id SERIAL PRIMARY KEY,
    law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    chapter_number INTEGER,
    chapter_title VARCHAR(200),
    section_number INTEGER,
    section_title VARCHAR(200),
    article_number INTEGER NOT NULL,
    article_title VARCHAR(200),
    article_content TEXT NOT NULL,
    paragraph_number INTEGER,
    item_number INTEGER,
    sub_item_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 법률 개정 이력 테이블
CREATE TABLE law_amendments (
    id SERIAL PRIMARY KEY,
    law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    amendment_date DATE NOT NULL,
    amendment_number VARCHAR(50),
    amendment_reason TEXT,
    amendment_content TEXT,
    effective_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 벌칙 및 처벌 조항 테이블
CREATE TABLE penalty_provisions (
    id SERIAL PRIMARY KEY,
    law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    article_id INTEGER REFERENCES law_articles(id) ON DELETE CASCADE,
    violation_type VARCHAR(100),
    penalty_type VARCHAR(50), -- 형사처벌, 과태료, 과징금 등
    penalty_amount_min BIGINT,
    penalty_amount_max BIGINT,
    imprisonment_min INTEGER, -- 개월 단위
    imprisonment_max INTEGER,
    penalty_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 안전관리 의무사항 테이블
CREATE TABLE safety_obligations (
    id SERIAL PRIMARY KEY,
    law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    article_id INTEGER REFERENCES law_articles(id) ON DELETE CASCADE,
    obligation_category VARCHAR(100), -- 안전관리체계, 교육, 점검 등
    target_entity VARCHAR(100), -- 사업주, 연구책임자, 취급자 등
    obligation_description TEXT NOT NULL,
    deadline_period VARCHAR(100), -- 의무 이행 기한
    frequency VARCHAR(50), -- 정기, 수시, 연간 등
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 적용 대상 및 범위 테이블
CREATE TABLE application_scope (
    id SERIAL PRIMARY KEY,
    law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    scope_category VARCHAR(100), -- 사업장규모, 업종, 물질종류 등
    scope_description TEXT NOT NULL,
    minimum_threshold VARCHAR(100), -- 최소 적용 기준
    exclusion_criteria TEXT, -- 적용 제외 기준
    effective_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 관련 시행령/시행규칙 테이블
CREATE TABLE related_regulations (
    id SERIAL PRIMARY KEY,
    law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    regulation_type VARCHAR(50), -- 시행령, 시행규칙, 고시 등
    regulation_name VARCHAR(200) NOT NULL,
    regulation_number VARCHAR(50),
    enactment_date DATE,
    content_summary TEXT,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. 키워드 및 태그 테이블
CREATE TABLE law_keywords (
    id SERIAL PRIMARY KEY,
    law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    keyword_type VARCHAR(50), -- 주제어, 처벌유형, 의무사항 등
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. 법률 간 연관관계 테이블
CREATE TABLE law_relationships (
    id SERIAL PRIMARY KEY,
    primary_law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    related_law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50), -- 상위법, 하위법, 관련법, 개정법 등
    relationship_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_laws_category ON laws(law_category);
CREATE INDEX idx_laws_name ON laws(law_name);
CREATE INDEX idx_articles_law_id ON law_articles(law_id);
CREATE INDEX idx_articles_number ON law_articles(article_number);
CREATE INDEX idx_keywords_law_id ON law_keywords(law_id);
CREATE INDEX idx_keywords_keyword ON law_keywords(keyword);
CREATE INDEX idx_safety_obligations_category ON safety_obligations(obligation_category);
CREATE INDEX idx_penalty_type ON penalty_provisions(penalty_type);

-- 뷰 생성: 법률별 전체 정보 조회
CREATE VIEW law_summary AS
SELECT 
    l.id,
    l.law_name,
    l.law_number,
    l.enactment_date,
    l.enforcement_date,
    l.administering_agency,
    l.law_category,
    l.summary,
    COUNT(DISTINCT la.id) as total_articles,
    COUNT(DISTINCT pp.id) as penalty_provisions_count,
    COUNT(DISTINCT so.id) as safety_obligations_count
FROM laws l
LEFT JOIN law_articles la ON l.id = la.law_id
LEFT JOIN penalty_provisions pp ON l.id = pp.law_id  
LEFT JOIN safety_obligations so ON l.id = so.law_id
GROUP BY l.id, l.law_name, l.law_number, l.enactment_date, l.enforcement_date, 
         l.administering_agency, l.law_category, l.summary;