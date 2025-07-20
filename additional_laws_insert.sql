-- 추가 법률 데이터 삽입 (산업안전보건법, 소방법, 건축법, 환경보건법, 원자력안전법, 고압가스안전관리법 + 4개 특별법)

-- 4. 산업안전보건법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('산업안전보건법', 'Occupational Safety and Health Act', '법률 제18426호', '1981-12-31', '1982-07-01', '2022-08-18', '고용노동부', '노동법', '산업안전·보건에 관한 기준을 확립하고 그 책임의 소재를 명확하게 하여 산업재해를 예방하고 쾌적한 작업환경을 조성함으로써 근로자의 안전과 보건을 유지·증진', '근로자의 안전과 보건을 보호하기 위해 사업주의 의무, 안전보건관리체제, 유해·위험 방지 조치, 근로자의 권리와 의무 등을 규정');

-- 5. 화재의 예방 및 안전관리에 관한 법률
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('화재의 예방 및 안전관리에 관한 법률', 'Act on Prevention of Fires and Safety Management', '법률 제19590호', '2021-11-30', '2022-12-01', '2024-05-17', '소방청', '소방안전법', '화재의 예방과 안전관리에 필요한 사항을 규정', '화재로부터 국민의 생명·신체 및 재산을 보호하고 공공의 안전과 복리 증진에 이바지');

-- 6. 소방시설 설치 및 관리에 관한 법률
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('소방시설 설치 및 관리에 관한 법률', 'Act on Installation and Management of Fire-Fighting Facilities', '법률 제18661호', '2021-11-30', '2022-12-01', '2021-12-28', '소방청', '소방안전법', '소방시설의 설치·유지 및 효율적인 안전관리 체계를 구축', '소방시설의 적정한 설치·관리로 화재 등 재난으로부터 국민의 생명·신체 및 재산 보호');

-- 7. 건축법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('건축법', 'Building Act', '법률 제20424호', '1962-01-20', '2024-06-27', '2024-03-26', '국토교통부', '건설법', '건축물의 대지·구조·설비 기준 및 용도 등을 정하여 건축물의 안전·기능·환경 및 미관을 향상', '건축물의 안전·기능·환경 및 미관을 향상시킴으로써 공공복리의 증진에 이바지');

-- 8. 환경보건법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('환경보건법', 'Environmental Health Act', '법률 제17855호', '2008-03-21', '2021-07-06', '2021-01-05', '환경부', '환경보건', '환경오염과 유해화학물질 등이 국민건강 및 생태계에 미치는 영향 및 피해를 조사·규명·감시', '환경오염과 유해화학물질 등이 국민건강 및 생태계에 미치는 영향 및 피해를 조사·규명·감시하여 국민건강에 대한 위협을 예방');

-- 9. 원자력안전법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('원자력안전법', 'Nuclear Safety Act', '법률 제20533호', '2011-07-25', '2011-10-26', '2025-04-22', '원자력안전위원회', '원자력안전법', '원자력의 연구·개발·생산·이용에 따른 안전관리에 관한 사항을 규정', '방사선에 의한 재해의 방지와 공공의 안전을 도모함을 목적으로 함');

-- 10. 고압가스 안전관리법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('고압가스 안전관리법', 'High-Pressure Gas Safety Control Act', '법률 제19325호', '1973-02-07', '1973-02-07', '2023-12-31', '산업통상자원부', '산업안전법', '고압가스의 제조·저장·판매·운반·사용과 가스의 용기·기기·기구 등의 제조·수리 및 검사 등을 규정', '고압가스로 인한 위해를 방지하고 공공의 안전을 기함');

-- 11. 시설물의 안전 및 유지관리에 관한 특별법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('시설물의 안전 및 유지관리에 관한 특별법', 'Special Act on the Safety Control and Maintenance of Establishments', '법률 제20553호', '1995-01-05', '1995-04-06', '2024-12-03', '국토교통부', '시설안전', '시설물의 안전점검과 적정한 유지관리를 통하여 재해 및 재난을 예방하고 시설물의 효용성을 증진', '시설물의 안전관리를 위한 정기점검, 정밀안전진단, 성능평가 등의 체계를 규정');

-- 12. 다중이용업소의 안전관리에 관한 특별법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('다중이용업소의 안전관리에 관한 특별법', 'Special Act on the Safety Management of Multi-use Businesses', '법률 제7906호', '2006-03-24', '2007-03-25', '2024-01-04', '소방청', '소방안전법', '다중이용업소의 안전시설등의 설치·유지 및 안전관리와 화재위험평가, 다중이용업주의 화재배상책임보험에 필요한 사항을 정함', '화재 등 재난으로부터 국민의 생명·신체 및 재산을 보호');

-- 13. 어린이놀이시설 안전관리법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('어린이놀이시설 안전관리법', 'Children''s Play Facility Safety Management Act', '법률 제8286호', '2007-01-26', '2008-01-27', '2023-03-28', '행정안전부', '시설안전', '어린이놀이시설의 설치·유지 및 효율적인 안전관리 체계를 구축', '안전사고를 미연에 방지함');

-- 14. 승강기 안전관리법
INSERT INTO laws (law_name, law_name_eng, law_number, enactment_date, enforcement_date, last_amended_date, administering_agency, law_category, summary, purpose) VALUES
('승강기 안전관리법', 'Elevator Safety Management Act', '법률 제15526호', '2018-03-27', '2019-03-28', '2024-07-26', '행정안전부', '시설안전', '승강기 안전관리에 관한 사항들을 통일적이고 종합적으로 운영', '승강기 사고 등으로 인한 위해로부터 승강기 이용자를 보호함');

-- 추가 조문 삽입
-- 산업안전보건법 주요 조항
INSERT INTO law_articles (law_id, chapter_number, chapter_title, article_number, article_title, article_content) VALUES
(4, 1, '총칙', 5, '사업주 등의 의무', '사업주는 이 법과 이 법에 따른 명령으로 정하는 산업재해 예방을 위한 기준을 지켜야 하며, 근로자의 안전과 보건을 유지·증진하기 위하여 해야 할 일을 하여야 한다.'),
(4, 3, '안전보건관리체제', 15, '안전보건관리책임자', '사업주는 사업장에서 안전·보건에 관한 업무를 총괄하여 관리하는 안전보건관리책임자를 두어야 한다.'),
(4, 4, '유해·위험 방지 조치 등', 38, '안전조치', '사업주는 근로자가 추락할 위험이 있는 장소, 토사·구축물 등이 붕괴할 우려가 있는 장소 등에서 근로자의 작업을 금지하여야 한다.');

-- 처벌조항 삽입
INSERT INTO penalty_provisions (law_id, violation_type, penalty_type, penalty_amount_min, penalty_amount_max, imprisonment_min, imprisonment_max, penalty_description) VALUES
(4, '안전·보건조치 위반으로 사망 발생', '형사처벌', 0, 100000000, 0, 84, '7년 이하 징역 또는 1억원 이하 벌금'),
(4, '안전·보건조치 위반', '형사처벌', 0, 50000000, 0, 60, '5년 이하 징역 또는 5천만원 이하 벌금'),
(5, '화재안전관리자 미선임', '형사처벌', 0, 10000000, 0, 12, '1년 이하 징역 또는 1천만원 이하 벌금'),
(7, '건축허가 위반', '형사처벌', 0, 500000000, 0, 36, '3년 이하 징역 또는 5억원 이하 벌금');

-- 안전관리 의무사항 추가
INSERT INTO safety_obligations (law_id, obligation_category, target_entity, obligation_description, deadline_period, frequency) VALUES
(4, '안전보건관리체제 구축', '사업주', '안전보건관리책임자, 안전관리자, 보건관리자 선임', '사업 개시 시', '상시'),
(4, '안전보건교육', '사업주', '근로자에 대한 정기 안전보건교육 실시', '분기별', '정기'),
(5, '화재안전관리자 선임', '특정소방대상물 관계인', '화재안전관리자 선임 및 교육', '시설 운영 시', '상시'),
(6, '소방시설 설치', '특정소방대상물 관계인', '법정 소방시설 설치 및 유지관리', '시설 운영 시', '상시'),
(9, '원자력안전종합계획 수립', '원자력안전위원회', '원자력 안전관리를 위한 종합계획 수립', '5년마다', '정기'),
(11, '안전점검 실시', '시설물 관리주체', '정기점검, 정밀점검, 정밀안전진단 실시', '법정 주기별', '정기');

-- 적용범위 추가
INSERT INTO application_scope (law_id, scope_category, scope_description, minimum_threshold, effective_date) VALUES
(4, '사업장', '근로자를 사용하는 모든 사업 또는 사업장', '근로자 1명 이상', '1982-07-01'),
(5, '특정소방대상물', '연면적 1,000㎡ 이상의 특정소방대상물', '연면적 1,000㎡ 이상', '2022-12-01'),
(7, '건축물', '토지에 정착하는 공작물 중 지붕과 기둥 또는 벽이 있는 것', '모든 건축물', '1962-01-20'),
(9, '원자력시설', '발전용원자로, 연구용원자로, 핵연료주기시설', '원자력 관련 모든 시설', '2011-10-26'),
(11, '시설물', '제1종·제2종·제3종 시설물', '법정 시설물', '1995-04-06');

-- 키워드 추가
INSERT INTO law_keywords (law_id, keyword, keyword_type) VALUES
(4, '산업안전', '주제어'), (4, '산업보건', '주제어'), (4, '근로자보호', '주제어'), (4, '사업주의무', '주체'),
(5, '화재예방', '주제어'), (5, '화재안전관리자', '주체'), (5, '특정소방대상물', '적용대상'),
(6, '소방시설', '주제어'), (6, '소화설비', '의무사항'), (6, '경보설비', '의무사항'),
(7, '건축허가', '주제어'), (7, '건축신고', '주제어'), (7, '사용승인', '의무사항'),
(8, '환경보건', '주제어'), (8, '환경유해인자', '주제어'), (8, '위해성평가', '의무사항'),
(9, '원자력안전', '주제어'), (9, '방사선안전', '주제어'), (9, '원자로', '적용대상'),
(10, '고압가스', '주제어'), (10, '가스안전', '주제어'), (10, '압력용기', '적용대상'),
(11, '시설물안전', '주제어'), (11, '안전점검', '의무사항'), (11, '정밀안전진단', '의무사항'),
(12, '다중이용업소', '적용대상'), (12, '화재배상책임보험', '의무사항'),
(13, '어린이놀이시설', '적용대상'), (13, '설치검사', '의무사항'), (13, '정기시설검사', '의무사항'),
(14, '승강기', '적용대상'), (14, '자체점검', '의무사항'), (14, '정기검사', '의무사항');