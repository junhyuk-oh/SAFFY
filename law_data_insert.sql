-- 법률 데이터 삽입 스크립트
-- 중대재해처벌법, 실험실안전관리법, 화학물질관리법 데이터

-- 1. 중대재해처벌법 기본 정보 삽입
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('중대재해 처벌 등에 관한 법률', 'Serious Accidents Punishment Act', '법률 제17907호', '2021-01-26', '2022-01-27', '2024-01-27', '고용노동부', '안전보건법', '사업 또는 공중이용시설의 안전관리 소홀로 인한 중대재해 발생 시 사업주, 경영책임자, 공무원 및 법인의 처벌에 관한 사항을 규정', '중대재해를 예방하고 시민과 종사자의 생명과 신체를 보호함을 목적으로 함');

-- 2. 실험실 안전환경 조성에 관한 법률 기본 정보 삽입  
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('연구실 안전환경 조성에 관한 법률', 'Act on the Creation of Safe Laboratory Environment', '법률 제7732호', '2005-12-29', '2006-06-30', '2024-05-01', '과학기술정보통신부', '연구안전법', '연구실의 안전환경 조성을 통하여 연구활동 종사자의 안전과 건강을 확보하고 연구개발활동을 원활하게 하기 위한 사항을 규정', '연구실 안전환경 조성을 통해 연구활동 종사자의 안전과 건강 확보');

-- 3. 화학물질관리법 기본 정보 삽입
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('화학물질관리법', 'Chemical Substances Management Act', '법률 제11690호', '2013-03-23', '2015-01-01', '2025-08-07', '환경부', '화학물질관리법', '화학물질의 체계적 관리와 화학사고 예방을 통하여 국민의 건강과 환경을 보호하기 위한 사항을 규정', '화학물질로 인한 국민건강 및 환경상의 위해를 예방하고 화학물질을 적절히 관리');

-- 중대재해처벌법 주요 조항 삽입
INSERT INTO law_articles (law_id, chapter_number, chapter_title, article_number, article_title, article_content) VALUES
(1, 1, '총칙', 1, '목적', '이 법은 사업 또는 공중이용시설의 안전관리 소홀로 중대재해가 발생한 경우 사업주, 경영책임자, 공무원 및 법인의 처벌 등에 관하여 규정함으로써 중대재해를 예방하고 시민과 종사자의 생명과 신체를 보호함을 목적으로 한다.'),
(1, 1, '총칙', 2, '정의', '이 법에서 사용하는 용어의 뜻은 다음과 같다. 1. "중대재해"란 다음 각 목의 어느 하나에 해당하는 결과를 야기한 재해를 말한다. 가. 사망자가 1명 이상 발생 나. 동일한 사고로 6개월 이상 치료가 필요한 부상자가 2명 이상 발생 다. 동일한 사고로 급성중독 등 대통령령으로 정하는 직업성 질병자가 1명 이상 발생'),
(1, 2, '사업주 등의 안전보건 확보의무', 4, '사업주 등의 안전 및 보건 확보의무', '사업주나 경영책임자는 사업장, 공중이용시설 또는 공중교통수단의 안전 및 보건 확보의무를 이행하여야 한다.');

-- 중대재해처벌법 처벌조항 삽입
INSERT INTO penalty_provisions (law_id, violation_type, penalty_type, penalty_amount_min, penalty_amount_max, imprisonment_min, imprisonment_max, penalty_description) VALUES
(1, '중대재해 발생', '형사처벌', 0, 100000000000, 12, NULL, '1년 이상의 징역 또는 10억원 이하의 벌금'),
(1, '안전보건관리체계 구축 의무 위반', '과태료', 100000000, 150000000, NULL, NULL, '1억원 이상 1억5천만원 이하의 과태료');

-- 실험실안전법 주요 조항 삽입
INSERT INTO law_articles (law_id, chapter_number, chapter_title, article_number, article_title, article_content) VALUES
(2, 1, '총칙', 1, '목적', '이 법은 연구실의 안전환경 조성을 통하여 연구활동 종사자의 안전과 건강을 확보하고 연구개발활동을 원활하게 하기 위한 사항을 규정함을 목적으로 한다.'),
(2, 1, '총칙', 2, '정의', '이 법에서 사용하는 용어의 뜻은 다음과 같다. 1. "연구실"이란 대학, 정부출연연구기관, 국공립연구기관 등에서 과학기술분야 연구개발활동을 위하여 시설·장비·연구재료등을 갖추어 설치한 장소를 말한다.'),
(2, 3, '연구실 안전관리', 14, '연구실 안전관리규정의 수립·시행', '연구주체의 장은 소속 연구실의 안전관리를 위하여 연구실 안전관리규정을 수립·시행하여야 한다.');

-- 안전관리 의무사항 삽입
INSERT INTO safety_obligations (law_id, obligation_category, target_entity, obligation_description, deadline_period, frequency) VALUES
(1, '안전관리체계 구축', '사업주', '안전 및 보건 확보의무를 이행하기 위한 인력·예산·점검 등 안전관리체계 구축 및 이행', '즉시', '상시'),
(1, '안전보건교육', '사업주', '중대재해 발생 시 안전보건교육 이수 의무', '중대재해 발생 후 3개월 이내', '1회'),
(2, '안전관리규정 수립', '연구주체의 장', '연구실 안전관리규정 수립 및 시행', '연구실 설치 후 즉시', '상시'),
(2, '안전점검', '연구주체의 장', '연구실 안전점검 실시', '정기점검: 반기별 1회, 정밀안전진단: 2년마다 1회', '정기'),
(3, '유해화학물질 취급시설 설치신고', '사업자', '유해화학물질 취급시설 설치 전 환경부장관에게 신고', '시설 설치 30일 전', '1회');

-- 적용 범위 삽입
INSERT INTO application_scope (law_id, scope_category, scope_description, minimum_threshold, effective_date) VALUES
(1, '사업장 규모', '상시근로자 5인 이상 사업장', '상시근로자 5명 이상', '2024-01-27'),
(1, '건설업', '건설공사 금액에 관계없이 상시근로자 5인 이상', '상시근로자 5명 이상', '2024-01-27'),
(2, '연구기관', '대학, 정부출연연구기관, 국공립연구기관의 과학기술분야 연구실', '과학기술분야 연구실', '2006-06-30'),
(3, '화학물질 취급', '유해화학물질을 제조, 수입, 사용, 보관, 운반하는 자', '유해화학물질 취급', '2015-01-01');

-- 키워드 삽입
INSERT INTO law_keywords (law_id, keyword, keyword_type) VALUES
(1, '중대재해', '주제어'), (1, '사업주', '주체'), (1, '경영책임자', '주체'), (1, '안전관리체계', '의무사항'),
(1, '사망', '처벌사유'), (1, '부상', '처벌사유'), (1, '징역', '처벌유형'), (1, '벌금', '처벌유형'),
(2, '연구실안전', '주제어'), (2, '연구활동종사자', '주체'), (2, '안전점검', '의무사항'), (2, '안전교육', '의무사항'),
(2, '안전관리규정', '의무사항'), (2, '연구주체', '주체'),
(3, '화학물질', '주제어'), (3, '유해화학물질', '주제어'), (3, '화학사고', '주제어'), (3, '취급기준', '의무사항'),
(3, '설치신고', '의무사항'), (3, '안전관리계획', '의무사항');

-- 법률 간 연관관계 삽입
INSERT INTO law_relationships (primary_law_id, related_law_id, relationship_type, relationship_description) VALUES
(1, 2, '관련법', '연구실에서의 중대재해 발생 시 양법 모두 적용 가능'),
(2, 3, '관련법', '연구실에서 화학물질 취급 시 양법 모두 적용'),
(1, 3, '관련법', '화학물질 관련 사업장에서 중대재해 발생 시 양법 모두 적용 가능');