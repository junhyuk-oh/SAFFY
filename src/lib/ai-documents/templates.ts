// AI 문서 템플릿 정의

export interface DocumentTemplate {
  type: string;
  title: string;
  sections: Section[];
  metadata?: Record<string, any>;
}

export interface Section {
  id: string;
  title: string;
  content: string | string[] | Record<string, any>;
  subsections?: Section[];
}

// 문서 타입별 템플릿
export const documentTemplates: Record<string, DocumentTemplate> = {
  'safety-assessment': {
    type: 'safety-assessment',
    title: 'AI 시스템 안전성 평가 보고서',
    sections: [
      {
        id: 'overview',
        title: '1. 개요',
        content: {
          purpose: '본 문서는 AI 시스템의 안전성을 종합적으로 평가합니다.',
          scope: '시스템 아키텍처, 데이터 처리, 알고리즘 동작, 출력 결과를 포함합니다.',
          evaluation_date: new Date().toISOString()
        }
      },
      {
        id: 'system-analysis',
        title: '2. 시스템 분석',
        content: '',
        subsections: [
          {
            id: 'architecture',
            title: '2.1 아키텍처 안전성',
            content: [
              '시스템 구조의 견고성 평가',
              '단일 장애점(SPOF) 분석',
              '보안 취약점 스캔 결과'
            ]
          },
          {
            id: 'data-safety',
            title: '2.2 데이터 안전성',
            content: [
              '데이터 품질 검증',
              '개인정보 보호 수준',
              '데이터 무결성 검사'
            ]
          }
        ]
      },
      {
        id: 'risk-assessment',
        title: '3. 위험 평가',
        content: {
          high_risks: [],
          medium_risks: [],
          low_risks: []
        }
      },
      {
        id: 'recommendations',
        title: '4. 권장사항',
        content: []
      }
    ]
  },

  'requirements-spec': {
    type: 'requirements-spec',
    title: 'AI 안전 요구사항 명세서',
    sections: [
      {
        id: 'functional-requirements',
        title: '1. 기능적 요구사항',
        content: '',
        subsections: [
          {
            id: 'safety-features',
            title: '1.1 안전 기능',
            content: [
              '긴급 정지 메커니즘',
              '자동 모니터링 시스템',
              '이상 탐지 알고리즘'
            ]
          },
          {
            id: 'user-protection',
            title: '1.2 사용자 보호',
            content: [
              '유해 콘텐츠 필터링',
              '프라이버시 보호 기능',
              '투명성 보장 인터페이스'
            ]
          }
        ]
      },
      {
        id: 'non-functional-requirements',
        title: '2. 비기능적 요구사항',
        content: '',
        subsections: [
          {
            id: 'performance',
            title: '2.1 성능 요구사항',
            content: {
              response_time: '< 100ms',
              availability: '99.9%',
              throughput: '10,000 requests/sec'
            }
          },
          {
            id: 'security',
            title: '2.2 보안 요구사항',
            content: [
              '엔드투엔드 암호화',
              '접근 제어 및 인증',
              '감사 로그 관리'
            ]
          }
        ]
      }
    ]
  },

  'implementation-plan': {
    type: 'implementation-plan',
    title: 'AI 안전 시스템 구현 계획',
    sections: [
      {
        id: 'phases',
        title: '1. 구현 단계',
        content: '',
        subsections: [
          {
            id: 'phase1',
            title: '1단계: 기반 구축',
            content: {
              duration: '4주',
              tasks: [
                '개발 환경 설정',
                '기본 아키텍처 구성',
                '핵심 모듈 개발'
              ]
            }
          },
          {
            id: 'phase2',
            title: '2단계: 안전 기능 구현',
            content: {
              duration: '6주',
              tasks: [
                '모니터링 시스템 개발',
                '이상 탐지 알고리즘 구현',
                '안전 제약 조건 적용'
              ]
            }
          },
          {
            id: 'phase3',
            title: '3단계: 테스트 및 검증',
            content: {
              duration: '4주',
              tasks: [
                '단위 테스트 실행',
                '통합 테스트',
                '안전성 검증'
              ]
            }
          }
        ]
      },
      {
        id: 'resources',
        title: '2. 필요 자원',
        content: {
          team: ['AI 엔지니어 3명', '보안 전문가 2명', 'QA 엔지니어 2명'],
          infrastructure: ['GPU 서버', '모니터링 도구', '테스트 환경'],
          budget: '프로젝트 예산 책정 필요'
        }
      }
    ]
  },

  'test-scenarios': {
    type: 'test-scenarios',
    title: 'AI 안전성 테스트 시나리오',
    sections: [
      {
        id: 'test-categories',
        title: '1. 테스트 카테고리',
        content: [
          '기능 안전성 테스트',
          '보안 취약점 테스트',
          '성능 한계 테스트',
          '이상 상황 대응 테스트'
        ]
      },
      {
        id: 'test-cases',
        title: '2. 상세 테스트 케이스',
        content: '',
        subsections: [
          {
            id: 'adversarial-tests',
            title: '2.1 적대적 입력 테스트',
            content: {
              description: '악의적인 입력에 대한 시스템 견고성 검증',
              scenarios: [
                'SQL 인젝션 시도',
                '프롬프트 인젝션',
                '데이터 포이즈닝'
              ]
            }
          },
          {
            id: 'edge-case-tests',
            title: '2.2 엣지 케이스 테스트',
            content: {
              description: '극단적인 상황에서의 시스템 동작 검증',
              scenarios: [
                '대용량 입력 처리',
                '동시 다발적 요청',
                '리소스 부족 상황'
              ]
            }
          }
        ]
      }
    ]
  },

  'training-program': {
    type: 'training-program',
    title: 'AI 안전 교육 프로그램',
    sections: [
      {
        id: 'curriculum',
        title: '1. 교육 과정',
        content: '',
        subsections: [
          {
            id: 'basic-course',
            title: '1.1 기초 과정',
            content: {
              duration: '2일',
              topics: [
                'AI 안전의 중요성',
                '기본 안전 원칙',
                '위험 인식 및 평가'
              ]
            }
          },
          {
            id: 'advanced-course',
            title: '1.2 심화 과정',
            content: {
              duration: '3일',
              topics: [
                '안전 시스템 설계',
                '모니터링 및 대응',
                '사례 연구'
              ]
            }
          }
        ]
      },
      {
        id: 'certification',
        title: '2. 인증 프로그램',
        content: {
          levels: ['기초 인증', '전문가 인증', '마스터 인증'],
          requirements: '각 레벨별 시험 통과 및 실습 완료',
          validity: '2년'
        }
      }
    ]
  },

  'compliance-checklist': {
    type: 'compliance-checklist',
    title: 'AI 규제 준수 체크리스트',
    sections: [
      {
        id: 'regulations',
        title: '1. 주요 규제 항목',
        content: [
          {
            category: '데이터 보호',
            items: [
              '개인정보 수집 최소화',
              '명시적 동의 획득',
              '데이터 보관 기간 준수'
            ]
          },
          {
            category: '알고리즘 투명성',
            items: [
              '의사결정 과정 설명 가능',
              '편향성 검증 완료',
              '감사 추적 기능 구현'
            ]
          },
          {
            category: '안전성 보장',
            items: [
              '위험 평가 수행',
              '안전 메커니즘 구현',
              '사고 대응 절차 수립'
            ]
          }
        ]
      },
      {
        id: 'documentation',
        title: '2. 필수 문서',
        content: [
          '데이터 처리 방침',
          '알고리즘 영향 평가서',
          '안전성 인증서',
          '감사 보고서'
        ]
      }
    ]
  },

  'ethical-framework': {
    type: 'ethical-framework',
    title: 'AI 윤리 프레임워크',
    sections: [
      {
        id: 'principles',
        title: '1. 핵심 윤리 원칙',
        content: [
          {
            principle: '인간 중심성',
            description: 'AI는 인간의 존엄성과 권리를 최우선으로 고려해야 합니다.'
          },
          {
            principle: '공정성',
            description: '모든 사용자에게 차별 없는 서비스를 제공해야 합니다.'
          },
          {
            principle: '투명성',
            description: 'AI의 작동 방식과 의사결정 과정을 이해할 수 있어야 합니다.'
          },
          {
            principle: '책임성',
            description: 'AI 시스템의 결과에 대한 명확한 책임 체계가 있어야 합니다.'
          }
        ]
      },
      {
        id: 'implementation',
        title: '2. 윤리 원칙 구현 방안',
        content: {
          governance: '윤리 위원회 설립 및 정기 검토',
          monitoring: '윤리적 위험 모니터링 시스템',
          training: '전 직원 대상 AI 윤리 교육'
        }
      }
    ]
  },

  'incident-response': {
    type: 'incident-response',
    title: 'AI 사고 대응 계획',
    sections: [
      {
        id: 'incident-types',
        title: '1. 사고 유형 분류',
        content: [
          {
            level: '심각',
            examples: ['데이터 유출', '시스템 전체 장애', '안전 위협'],
            response_time: '즉시'
          },
          {
            level: '높음',
            examples: ['서비스 품질 저하', '부분적 기능 장애'],
            response_time: '1시간 이내'
          },
          {
            level: '중간',
            examples: ['예상치 못한 출력', '성능 저하'],
            response_time: '4시간 이내'
          }
        ]
      },
      {
        id: 'response-procedure',
        title: '2. 대응 절차',
        content: '',
        subsections: [
          {
            id: 'immediate-actions',
            title: '2.1 즉시 조치사항',
            content: [
              '사고 탐지 및 격리',
              '영향 범위 파악',
              '임시 조치 실행'
            ]
          },
          {
            id: 'investigation',
            title: '2.2 조사 및 분석',
            content: [
              '근본 원인 분석',
              '피해 규모 산정',
              '증거 보전'
            ]
          },
          {
            id: 'recovery',
            title: '2.3 복구 및 개선',
            content: [
              '시스템 복구',
              '재발 방지 대책',
              '사후 보고서 작성'
            ]
          }
        ]
      }
    ]
  },

  'monitoring-dashboard': {
    type: 'monitoring-dashboard',
    title: 'AI 모니터링 대시보드 설계',
    sections: [
      {
        id: 'metrics',
        title: '1. 핵심 모니터링 지표',
        content: [
          {
            category: '성능 지표',
            metrics: ['응답 시간', '처리량', '정확도', '가용성']
          },
          {
            category: '안전 지표',
            metrics: ['이상 탐지율', '위협 차단율', '안전 점수']
          },
          {
            category: '품질 지표',
            metrics: ['사용자 만족도', '오류율', '편향성 지수']
          }
        ]
      },
      {
        id: 'dashboard-layout',
        title: '2. 대시보드 구성',
        content: {
          realtime_view: '실시간 시스템 상태 표시',
          historical_view: '시계열 트렌드 분석',
          alert_panel: '경고 및 알림 관리',
          detail_view: '상세 로그 및 분석'
        }
      },
      {
        id: 'alert-rules',
        title: '3. 알림 규칙',
        content: [
          {
            condition: '응답 시간 > 500ms',
            action: '성능 경고 발송'
          },
          {
            condition: '오류율 > 1%',
            action: '품질 경고 발송'
          },
          {
            condition: '보안 위협 탐지',
            action: '즉시 알림 및 자동 대응'
          }
        ]
      }
    ]
  },

  'risk-mitigation': {
    type: 'risk-mitigation',
    title: '위험 완화 전략',
    sections: [
      {
        id: 'risk-identification',
        title: '1. 위험 식별',
        content: [
          {
            risk_type: '기술적 위험',
            examples: ['알고리즘 오작동', '시스템 취약점', '데이터 손실']
          },
          {
            risk_type: '운영적 위험',
            examples: ['인력 부족', '프로세스 미비', '의사소통 실패']
          },
          {
            risk_type: '규제적 위험',
            examples: ['법규 위반', '인증 실패', '감사 지적']
          }
        ]
      },
      {
        id: 'mitigation-strategies',
        title: '2. 완화 전략',
        content: '',
        subsections: [
          {
            id: 'preventive-measures',
            title: '2.1 예방적 조치',
            content: [
              '정기적인 보안 점검',
              '자동화된 테스트',
              '직원 교육 강화'
            ]
          },
          {
            id: 'detective-controls',
            title: '2.2 탐지 통제',
            content: [
              '실시간 모니터링',
              '이상 징후 탐지',
              '정기 감사'
            ]
          },
          {
            id: 'corrective-actions',
            title: '2.3 시정 조치',
            content: [
              '신속한 패치 적용',
              '백업 및 복구 절차',
              '사고 대응 팀 운영'
            ]
          }
        ]
      },
      {
        id: 'risk-matrix',
        title: '3. 위험 평가 매트릭스',
        content: {
          high_impact_high_probability: '즉각적인 조치 필요',
          high_impact_low_probability: '대비 계획 수립',
          low_impact_high_probability: '모니터링 강화',
          low_impact_low_probability: '정기 검토'
        }
      }
    ]
  }
};

// 샘플 데이터 생성 함수
export function generateSampleData(documentType: string): Record<string, any> {
  const sampleData: Record<string, Record<string, any>> = {
    'safety-assessment': {
      systemName: 'AI 고객 서비스 챗봇',
      version: '2.0',
      assessmentDate: new Date().toISOString(),
      highRisks: ['개인정보 노출 가능성', '편향된 응답 생성'],
      mediumRisks: ['응답 지연', '컨텍스트 이해 실패'],
      lowRisks: ['UI 렌더링 오류'],
      recommendations: [
        '개인정보 필터링 강화',
        '편향성 검증 주기 단축',
        '응답 캐싱 메커니즘 도입'
      ]
    },
    'requirements-spec': {
      projectName: 'AI 안전 관리 시스템',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      functionalReqs: {
        safety: ['자동 정지 기능', '실시간 모니터링', '위험 알림'],
        security: ['암호화', '접근 제어', '감사 로그']
      },
      nonFunctionalReqs: {
        performance: { responseTime: '100ms', uptime: '99.9%' },
        scalability: '10,000 동시 사용자 지원'
      }
    },
    'test-scenarios': {
      testSuiteName: 'AI 안전성 종합 테스트',
      version: '1.0',
      scenarios: [
        {
          name: '적대적 입력 테스트',
          cases: ['SQL 인젝션', '프롬프트 조작', 'XSS 공격']
        },
        {
          name: '부하 테스트',
          cases: ['1000 RPS', '10000 동시 접속', '100GB 데이터 처리']
        }
      ]
    }
  };

  return sampleData[documentType] || {};
}