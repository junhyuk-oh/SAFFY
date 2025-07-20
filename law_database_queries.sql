-- 법률 데이터베이스 조회 쿼리 모음
-- 다양한 검색 및 분석을 위한 SQL 쿼리들

-- 1. 전체 법률 목록 조회
SELECT * FROM law_summary ORDER BY law_name;

-- 2. 특정 법률의 상세 정보 조회
SELECT 
    l.law_name,
    l.law_number,
    l.enactment_date,
    l.enforcement_date,
    l.administering_agency,
    l.summary,
    l.purpose
FROM laws l 
WHERE l.law_name LIKE '%중대재해%';

-- 3. 법률별 조문 수 조회
SELECT 
    l.law_name,
    COUNT(la.id) as article_count,
    COUNT(DISTINCT la.chapter_number) as chapter_count
FROM laws l
LEFT JOIN law_articles la ON l.id = la.law_id
GROUP BY l.id, l.law_name
ORDER BY article_count DESC;

-- 4. 처벌 조항이 있는 법률 조회
SELECT DISTINCT
    l.law_name,
    pp.violation_type,
    pp.penalty_type,
    CASE 
        WHEN pp.penalty_amount_max > 0 THEN CONCAT(COALESCE(pp.penalty_amount_min, 0), '원 ~ ', pp.penalty_amount_max, '원')
        ELSE ''
    END as penalty_amount,
    CASE 
        WHEN pp.imprisonment_max > 0 THEN CONCAT(COALESCE(pp.imprisonment_min, 0), '개월 ~ ', pp.imprisonment_max, '개월')
        WHEN pp.imprisonment_min > 0 THEN CONCAT(pp.imprisonment_min, '개월 이상')
        ELSE ''
    END as imprisonment_period,
    pp.penalty_description
FROM laws l
JOIN penalty_provisions pp ON l.id = pp.law_id
ORDER BY l.law_name, pp.penalty_type;

-- 5. 안전관리 의무사항 조회 (대상별)
SELECT 
    l.law_name,
    so.target_entity,
    so.obligation_category,
    so.obligation_description,
    so.deadline_period,
    so.frequency
FROM laws l
JOIN safety_obligations so ON l.id = so.law_id
ORDER BY l.law_name, so.target_entity, so.obligation_category;

-- 6. 키워드별 법률 검색
SELECT 
    l.law_name,
    lk.keyword,
    lk.keyword_type
FROM laws l
JOIN law_keywords lk ON l.id = lk.law_id
WHERE lk.keyword LIKE '%안전%'
ORDER BY l.law_name, lk.keyword_type;

-- 7. 법률 적용 범위 조회
SELECT 
    l.law_name,
    a.scope_category,
    a.scope_description,
    a.minimum_threshold,
    a.effective_date
FROM laws l
JOIN application_scope a ON l.id = a.law_id
ORDER BY l.law_name, a.scope_category;

-- 8. 연관된 법률 조회
SELECT 
    l1.law_name as primary_law,
    l2.law_name as related_law,
    lr.relationship_type,
    lr.relationship_description
FROM law_relationships lr
JOIN laws l1 ON lr.primary_law_id = l1.id
JOIN laws l2 ON lr.related_law_id = l2.id
ORDER BY l1.law_name;

-- 9. 특정 주체(사업주, 연구책임자 등)의 의무사항 조회
SELECT 
    l.law_name,
    so.obligation_category,
    so.obligation_description,
    so.deadline_period,
    so.frequency
FROM laws l
JOIN safety_obligations so ON l.id = so.law_id
WHERE so.target_entity = '사업주'
ORDER BY l.law_name, so.obligation_category;

-- 10. 법률별 처벌 강도 비교 (최대 벌금액 기준)
SELECT 
    l.law_name,
    MAX(pp.penalty_amount_max) as max_penalty,
    MAX(pp.imprisonment_max) as max_imprisonment_months,
    COUNT(pp.id) as penalty_provision_count
FROM laws l
LEFT JOIN penalty_provisions pp ON l.id = pp.law_id
GROUP BY l.id, l.law_name
ORDER BY max_penalty DESC NULLS LAST;

-- 11. 최근 개정된 법률 조회
SELECT 
    law_name,
    law_number,
    enactment_date,
    last_amended_date,
    CASE 
        WHEN last_amended_date >= CURRENT_DATE - INTERVAL '1 year' THEN '최근 개정'
        WHEN last_amended_date >= CURRENT_DATE - INTERVAL '3 years' THEN '3년 내 개정'
        ELSE '오래된 법률'
    END as amendment_status
FROM laws
ORDER BY last_amended_date DESC NULLS LAST;

-- 12. 법률별 조문 검색 (내용 기준)
SELECT 
    l.law_name,
    la.article_number,
    la.article_title,
    LEFT(la.article_content, 100) as content_preview
FROM laws l
JOIN law_articles la ON l.id = la.law_id
WHERE la.article_content LIKE '%안전관리%'
ORDER BY l.law_name, la.article_number;

-- 13. 사업장 규모별 적용 법률 조회
SELECT 
    a.minimum_threshold,
    GROUP_CONCAT(l.law_name SEPARATOR ', ') as applicable_laws
FROM laws l
JOIN application_scope a ON l.id = a.law_id
WHERE a.scope_category LIKE '%사업장%' OR a.scope_category LIKE '%규모%'
GROUP BY a.minimum_threshold
ORDER BY a.minimum_threshold;

-- 14. 위반 유형별 처벌 현황
SELECT 
    pp.violation_type,
    COUNT(*) as law_count,
    AVG(pp.penalty_amount_max) as avg_max_penalty,
    MAX(pp.penalty_amount_max) as highest_penalty
FROM penalty_provisions pp
GROUP BY pp.violation_type
ORDER BY avg_max_penalty DESC;

-- 15. 관리기관별 법률 분류
SELECT 
    administering_agency,
    law_category,
    COUNT(*) as law_count,
    GROUP_CONCAT(law_name SEPARATOR ', ') as laws
FROM laws
GROUP BY administering_agency, law_category
ORDER BY administering_agency, law_category;