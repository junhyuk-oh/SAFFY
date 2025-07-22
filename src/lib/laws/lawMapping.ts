// 문서 타입과 관련 법률 조문 매핑 데이터

export interface DocumentLawMapping {
  documentType: string
  relatedLaws: Array<{
    lawId: string
    articleId: string
    lawName: string
    articleNumber: string
    articleTitle: string
    relevance: 'primary' | 'secondary' | 'reference'
    complianceType: 'mandatory' | 'recommended' | 'guideline'
    description: string
  }>
}

// 문서별 관련 법률 매핑
export const DOCUMENT_LAW_MAPPINGS: DocumentLawMapping[] = [
  // 위험성평가
  {
    documentType: "risk-assessment",
    relatedLaws: [
      {
        lawId: "industrial-safety",
        articleId: "industrial-safety-art36",
        lawName: "산업안전보건법",
        articleNumber: "제36조",
        articleTitle: "위험성평가의 실시",
        relevance: "primary",
        complianceType: "mandatory",
        description: "위험성평가는 산업안전보건법에 따른 사업주의 법정 의무사항입니다."
      },
      {
        lawId: "serious-accident",
        articleId: "serious-accident-art4",
        lawName: "중대재해 처벌 등에 관한 법률",
        articleNumber: "제4조",
        articleTitle: "사업주 등의 안전·보건 확보의무",
        relevance: "primary",
        complianceType: "mandatory",
        description: "안전보건관리체계 구축의 일환으로 위험성평가가 필수입니다."
      }
    ]
  },

  // 작업위험성평가 (JHA)
  {
    documentType: "jha",
    relatedLaws: [
      {
        lawId: "industrial-safety",
        articleId: "industrial-safety-art36",
        lawName: "산업안전보건법",
        articleNumber: "제36조",
        articleTitle: "위험성평가의 실시",
        relevance: "primary",
        complianceType: "mandatory",
        description: "작업별 위험성평가는 위험성평가 실시 의무에 포함됩니다."
      }
    ]
  },

  // 작업허가서
  {
    documentType: "work-permit",
    relatedLaws: [
      {
        lawId: "industrial-safety",
        articleId: "industrial-safety-art41",
        lawName: "산업안전보건법",
        articleNumber: "제41조",
        articleTitle: "작업허가",
        relevance: "primary",
        complianceType: "mandatory",
        description: "화재·폭발·질식 등 위험작업 시 작업허가서 작성이 법적 의무입니다."
      },
      {
        lawId: "serious-accident",
        articleId: "serious-accident-art4",
        lawName: "중대재해 처벌 등에 관한 법률",
        articleNumber: "제4조",
        articleTitle: "사업주 등의 안전·보건 확보의무",
        relevance: "secondary",
        complianceType: "mandatory",
        description: "안전보건관리체계의 일환으로 작업허가 체계가 포함됩니다."
      }
    ]
  },

  // 실험계획서
  {
    documentType: "experiment-plan",
    relatedLaws: [
      {
        lawId: "lab-safety",
        articleId: "lab-safety-art8",
        lawName: "연구실 안전환경 조성에 관한 법률",
        articleNumber: "제8조",
        articleTitle: "연구실 안전환경 조성",
        relevance: "primary",
        complianceType: "mandatory",
        description: "연구실에서의 실험 계획 수립 시 안전관리 계획이 필수입니다."
      },
      {
        lawId: "chemical-management",
        articleId: "chemical-management-art23",
        lawName: "화학물질관리법",
        articleNumber: "제23조",
        articleTitle: "화학물질의 취급기준",
        relevance: "secondary",
        complianceType: "mandatory",
        description: "화학물질 사용 실험 시 취급기준 준수가 필요합니다."
      }
    ]
  },

  // 안전교육
  {
    documentType: "safety-education",
    relatedLaws: [
      {
        lawId: "industrial-safety",
        articleId: "industrial-safety-art36",
        lawName: "산업안전보건법",
        articleNumber: "제36조",
        articleTitle: "위험성평가의 실시",
        relevance: "secondary",
        complianceType: "mandatory",
        description: "위험성평가 결과에 따른 근로자 교육·훈련이 필요합니다."
      },
      {
        lawId: "lab-safety",
        articleId: "lab-safety-art8",
        lawName: "연구실 안전환경 조성에 관한 법률",
        articleNumber: "제8조",
        articleTitle: "연구실 안전환경 조성",
        relevance: "primary",
        complianceType: "mandatory",
        description: "연구활동종사자에 대한 교육·훈련이 법정 의무입니다."
      },
      {
        lawId: "serious-accident",
        articleId: "serious-accident-art4",
        lawName: "중대재해 처벌 등에 관한 법률",
        articleNumber: "제4조",
        articleTitle: "사업주 등의 안전·보건 확보의무",
        relevance: "secondary",
        complianceType: "mandatory",
        description: "안전보건관리체계에는 교육 체계도 포함됩니다."
      }
    ]
  },

  // 시설관리
  {
    documentType: "facility-management",
    relatedLaws: [
      {
        lawId: "serious-accident",
        articleId: "serious-accident-art4",
        lawName: "중대재해 처벌 등에 관한 법률",
        articleNumber: "제4조",
        articleTitle: "사업주 등의 안전·보건 확보의무",
        relevance: "primary",
        complianceType: "mandatory",
        description: "시설의 안전보건 확보는 경영책임자의 법적 의무입니다."
      }
    ]
  },

  // 화학물질 관련 문서
  {
    documentType: "chemical-safety",
    relatedLaws: [
      {
        lawId: "chemical-management",
        articleId: "chemical-management-art23",
        lawName: "화학물질관리법",
        articleNumber: "제23조",
        articleTitle: "화학물질의 취급기준",
        relevance: "primary",
        complianceType: "mandatory",
        description: "화학물질 취급 시 분류·표시 및 안전보건자료 작성이 필수입니다."
      },
      {
        lawId: "chemical-management",
        articleId: "chemical-management-art25",
        lawName: "화학물질관리법",
        articleNumber: "제25조",
        articleTitle: "화학사고 대응",
        relevance: "secondary",
        complianceType: "mandatory",
        description: "화학사고 발생 시 즉시 응급조치 및 신고 의무가 있습니다."
      }
    ]
  }
]

// 문서 타입별 관련 법률 조회
export function getRelatedLaws(documentType: string) {
  const mapping = DOCUMENT_LAW_MAPPINGS.find(m => m.documentType === documentType)
  return mapping?.relatedLaws || []
}

// 법률별 관련 문서 타입 조회 (역방향)
export function getRelatedDocuments(lawId: string) {
  const relatedDocs: Array<{
    documentType: string
    relevance: string
    complianceType: string
  }> = []

  DOCUMENT_LAW_MAPPINGS.forEach(mapping => {
    const hasLaw = mapping.relatedLaws.some(law => law.lawId === lawId)
    if (hasLaw) {
      const lawInfo = mapping.relatedLaws.find(law => law.lawId === lawId)
      if (lawInfo) {
        relatedDocs.push({
          documentType: mapping.documentType,
          relevance: lawInfo.relevance,
          complianceType: lawInfo.complianceType
        })
      }
    }
  })

  return relatedDocs
}

// 문서 타입별 한글 이름 매핑
export const DOCUMENT_TYPE_NAMES: Record<string, string> = {
  "risk-assessment": "위험성평가",
  "jha": "작업위험성평가",
  "work-permit": "작업허가서",
  "experiment-plan": "실험계획서",
  "safety-education": "안전교육",
  "facility-management": "시설관리",
  "chemical-safety": "화학물질안전"
}