// 법률 데이터베이스 연동 유틸리티
// 현재는 SQL 파일의 데이터를 JavaScript 객체로 변환하여 사용
// 향후 실제 데이터베이스 연결로 대체 가능

export interface LawData {
  id: string
  lawName: string
  lawNameEng?: string
  lawNumber?: string
  administeredBy: string
  category: string
  summary?: string
  enactmentDate?: string
  lastAmended?: string
}

export interface LawArticle {
  id: string
  lawId: string
  chapterNumber?: number
  chapterTitle?: string
  sectionNumber?: number
  sectionTitle?: string
  articleNumber: number
  articleTitle: string
  articleContent: string
  paragraphNumber?: number
  itemNumber?: number
  subItemNumber?: number
}

export interface PenaltyProvision {
  id: string
  lawId: string
  violationType: string
  penaltyType: 'fine' | 'imprisonment' | 'both'
  fineAmount?: string
  imprisonmentTerm?: string
  description: string
}

export interface SafetyObligation {
  id: string
  lawId: string
  obligationType: string
  targetEntity: string
  description: string
  penaltyReference?: string
}

// 법률 기본 데이터 (law_data_insert.sql 기반)
const LAWS_DATA: LawData[] = [
  {
    id: "serious-accident",
    lawName: "중대재해 처벌 등에 관한 법률",
    lawNameEng: "Serious Accidents Punishment Act",
    lawNumber: "법률 제17905호",
    administeredBy: "고용노동부",
    category: "중처법",
    summary: "중대재해를 발생시킨 사업주, 경영책임자, 공무원 또는 법인의 처벌 등에 관하여 규정함으로써 중대재해를 예방하고 시민과 종사자의 생명과 신체를 보호하는 것을 목적으로 한다.",
    enactmentDate: "2021-01-26",
    lastAmended: "2022-04-20"
  },
  {
    id: "industrial-safety",
    lawName: "산업안전보건법",
    lawNameEng: "Occupational Safety and Health Act",
    lawNumber: "법률 제16272호",
    administeredBy: "고용노동부",
    category: "산안법",
    summary: "산업안전보건에 관한 기준을 확립하고 그 책임의 소재를 명확하게 하여 산업재해를 예방하고 쾌적한 작업환경을 조성함으로써 근로자의 안전과 보건을 유지·증진함을 목적으로 한다.",
    enactmentDate: "1981-12-31",
    lastAmended: "2023-05-26"
  },
  {
    id: "chemical-management",
    lawName: "화학물질관리법",
    lawNameEng: "Chemicals Control Act",
    lawNumber: "법률 제16613호",
    administeredBy: "환경부",
    category: "화관법",
    summary: "화학물질로 인한 국민건강 및 환경상의 위해를 예방하고 화학물질을 적절하게 관리함으로써 국민건강과 환경을 보호함을 목적으로 한다.",
    enactmentDate: "2013-05-22",
    lastAmended: "2023-06-13"
  },
  {
    id: "lab-safety",
    lawName: "연구실 안전환경 조성에 관한 법률",
    lawNameEng: "Laboratory Safety Environment Creation Act",
    lawNumber: "법률 제18298호",
    administeredBy: "과학기술정보통신부",
    category: "연안법",
    summary: "연구실의 안전환경 조성에 필요한 사항을 규정함으로써 연구활동종사자의 안전과 건강을 보호하고 연구활동에 있어서의 안전사고를 방지함을 목적으로 한다.",
    enactmentDate: "2005-03-24",
    lastAmended: "2021-06-08"
  }
]

// 법조문 데이터 (주요 조문들만 포함)
const LAW_ARTICLES_DATA: LawArticle[] = [
  // 중대재해처벌법
  {
    id: "serious-accident-art4",
    lawId: "serious-accident",
    articleNumber: 4,
    articleTitle: "사업주 등의 안전·보건 확보의무",
    articleContent: "사업주 또는 경영책임자는 사업장, 공중이용시설 또는 공중교통수단의 안전·보건 확보를 위하여 다음 각 호의 조치를 하여야 한다.\n1. 재해예방에 필요한 안전·보건에 관한 인력 및 예산 등 안전보건관리체계의 구축 및 그 이행에 관한 조치\n2. 재해 발생 시 재발방지 대책의 수립 및 그 이행에 관한 조치\n3. 중앙행정기관·지방자치단체가 관계 법령에 따라 개선, 시정 등을 명한 사항의 이행에 관한 조치\n4. 안전·보건 관계 법령에 따른 의무이행에 필요한 관리상의 조치"
  },
  {
    id: "serious-accident-art6",
    lawId: "serious-accident",
    articleNumber: 6,
    articleTitle: "사업주 등에 대한 처벌",
    articleContent: "사업주 또는 경영책임자가 안전·보건 확보의무를 위반하여 중대산업재해를 발생시킨 때에는 1년 이상의 유기징역 또는 10억원 이하의 벌금에 처한다."
  },

  // 산업안전보건법
  {
    id: "industrial-safety-art36",
    lawId: "industrial-safety",
    articleNumber: 36,
    articleTitle: "위험성평가의 실시",
    articleContent: "사업주는 건설물, 기계·기구·설비 또는 원료·가스·증기·분진·산소결핍·병원체 등에 의한 위험을 방지하기 위하여 다음 각 호의 조치를 하여야 한다.\n1. 위험성평가의 실시\n2. 위험성평가 결과에 따른 개선조치\n3. 위험성평가 및 조치사항에 대한 근로자 교육·훈련"
  },
  {
    id: "industrial-safety-art41",
    lawId: "industrial-safety",
    articleNumber: 41,
    articleTitle: "작업허가",
    articleContent: "사업주는 화재·폭발이나 질식 등으로 인하여 중대한 위험이 발생할 우려가 있는 작업으로서 고용노동부령으로 정하는 작업을 하는 경우에는 작업허가서를 작성하여 안전조치 및 보건조치 상황을 확인한 후 작업을 시작하도록 하여야 한다."
  },

  // 화학물질관리법
  {
    id: "chemical-management-art23",
    lawId: "chemical-management",
    articleNumber: 23,
    articleTitle: "화학물질의 취급기준",
    articleContent: "화학물질을 제조·수입·판매 또는 사용하려는 자는 환경부령으로 정하는 화학물질의 분류·표시 및 안전보건자료 작성 등에 관한 기준을 준수하여야 한다."
  },
  {
    id: "chemical-management-art25",
    lawId: "chemical-management", 
    articleNumber: 25,
    articleTitle: "화학사고 대응",
    articleContent: "화학물질을 취급하는 자는 화학사고가 발생한 경우 즉시 응급조치를 하고 관할 지방환경관서의 장과 관할 소방서장에게 신고하여야 한다."
  },

  // 연구실안전법
  {
    id: "lab-safety-art8",
    lawId: "lab-safety",
    articleNumber: 8,
    articleTitle: "연구실 안전환경 조성",
    articleContent: "연구주체의 장은 연구실의 안전환경 조성을 위하여 다음 각 호의 조치를 하여야 한다.\n1. 연구실 안전관리 계획의 수립·시행\n2. 연구실 안전점검 및 정밀안전진단의 실시\n3. 연구활동종사자에 대한 교육·훈련\n4. 보험 가입"
  }
]

// 키워드 매핑 데이터
const KEYWORD_MAPPINGS = {
  // 작업 관련
  "화기작업": ["industrial-safety-art41", "serious-accident-art4"],
  "화기": ["industrial-safety-art41"],
  "용접": ["industrial-safety-art41"],
  "절단": ["industrial-safety-art41"],
  "고소작업": ["industrial-safety-art41"],
  "밀폐공간": ["industrial-safety-art41"],
  "작업허가": ["industrial-safety-art41"],
  
  // 위험성평가 관련
  "위험성평가": ["industrial-safety-art36", "serious-accident-art4"],
  "위험": ["industrial-safety-art36", "serious-accident-art4"],
  "안전관리": ["serious-accident-art4", "industrial-safety-art36"],
  
  // 화학물질 관련  
  "화학물질": ["chemical-management-art23", "chemical-management-art25", "lab-safety-art8"],
  "화학": ["chemical-management-art23", "chemical-management-art25"],
  "안전보건자료": ["chemical-management-art23"],
  "화학사고": ["chemical-management-art25"],
  
  // 연구실 관련
  "연구실": ["lab-safety-art8"],
  "실험": ["lab-safety-art8"],
  "연구": ["lab-safety-art8"],
  
  // 처벌 관련
  "처벌": ["serious-accident-art6"],
  "벌금": ["serious-accident-art6"],
  "징역": ["serious-accident-art6"],
  "중대재해": ["serious-accident-art6", "serious-accident-art4"],
  
  // 교육 관련
  "교육": ["industrial-safety-art36", "lab-safety-art8"],
  "훈련": ["industrial-safety-art36", "lab-safety-art8"]
}

// 법률 검색 함수
export function searchLaws(query: string): LawArticle[] {
  if (!query.trim()) return []
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/)
  const results = new Set<LawArticle>()
  
  // 키워드 매핑 기반 검색
  for (const term of searchTerms) {
    for (const [keyword, articleIds] of Object.entries(KEYWORD_MAPPINGS)) {
      if (keyword.includes(term) || term.includes(keyword)) {
        articleIds.forEach(articleId => {
          const article = LAW_ARTICLES_DATA.find(a => a.id === articleId)
          if (article) results.add(article)
        })
      }
    }
  }
  
  // 직접 텍스트 검색
  LAW_ARTICLES_DATA.forEach(article => {
    const searchTargets = [
      article.articleTitle,
      article.articleContent,
      LAWS_DATA.find(law => law.id === article.lawId)?.lawName || ""
    ].join(" ").toLowerCase()
    
    if (searchTerms.some(term => searchTargets.includes(term))) {
      results.add(article)
    }
  })
  
  return Array.from(results).slice(0, 10) // 최대 10개 결과
}

// 법률 정보 조회
export function getLawInfo(lawId: string): LawData | undefined {
  return LAWS_DATA.find(law => law.id === lawId)
}

// 조문 상세 정보 조회  
export function getArticleById(articleId: string): LawArticle | undefined {
  return LAW_ARTICLES_DATA.find(article => article.id === articleId)
}

// 특정 법률의 모든 조문 조회
export function getArticlesByLaw(lawId: string): LawArticle[] {
  return LAW_ARTICLES_DATA.filter(article => article.lawId === lawId)
}

// 카테고리별 법률 목록
export function getLawsByCategory(category?: string): LawData[] {
  if (!category) return LAWS_DATA
  return LAWS_DATA.filter(law => law.category === category)
}