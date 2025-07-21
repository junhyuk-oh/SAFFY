import { documentTemplates, DocumentTemplate, Section, generateSampleData } from './templates';

// 문서 생성 함수 (현재는 Mock 구현)
export async function generateDocument(
  documentType: string,
  inputData: Record<string, any>
): Promise<GeneratedDocument> {
  // 3초 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 3000));

  const template = documentTemplates[documentType];
  if (!template) {
    throw new Error(`Unknown document type: ${documentType}`);
  }

  // Mock 데이터와 입력 데이터 병합
  const sampleData = generateSampleData(documentType);
  const mergedData = { ...sampleData, ...inputData };

  // 템플릿 기반 문서 생성
  const generatedContent = generateContentFromTemplate(template, mergedData);

  return {
    id: generateDocumentId(),
    type: documentType,
    title: template.title,
    content: generatedContent,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      inputData: mergedData,
      aiModel: 'mock-generator-v1'
    }
  };
}

// 템플릿에서 콘텐츠 생성
function generateContentFromTemplate(
  template: DocumentTemplate,
  data: Record<string, any>
): string {
  let content = `# ${template.title}\n\n`;
  content += `생성일: ${new Date().toLocaleString('ko-KR')}\n\n`;

  // 메타데이터가 있으면 추가
  if (data.systemName || data.projectName) {
    content += `**대상 시스템**: ${data.systemName || data.projectName}\n`;
  }
  if (data.version) {
    content += `**버전**: ${data.version}\n`;
  }
  content += '\n---\n\n';

  // 각 섹션 처리
  template.sections.forEach(section => {
    content += generateSectionContent(section, data);
  });

  return content;
}

// 섹션 콘텐츠 생성
function generateSectionContent(
  section: Section,
  data: Record<string, any>,
  level: number = 2
): string {
  const heading = '#'.repeat(level);
  let content = `${heading} ${section.title}\n\n`;

  // 섹션 콘텐츠 처리
  if (section.content) {
    if (typeof section.content === 'string') {
      content += section.content + '\n\n';
    } else if (Array.isArray(section.content)) {
      section.content.forEach((item: string | Record<string, any>) => {
        if (typeof item === 'string') {
          content += `- ${item}\n`;
        } else if (typeof item === 'object') {
          content += formatObject(item) + '\n';
        }
      });
      content += '\n';
    } else if (typeof section.content === 'object') {
      content += formatObject(section.content) + '\n\n';
    }
  }

  // 입력 데이터에서 관련 정보 추가
  if (section.id === 'risk-assessment' && data.highRisks) {
    content += '### 식별된 위험 요소\n\n';
    content += '**높은 위험**:\n';
    data.highRisks.forEach((risk: string) => content += `- ${risk}\n`);
    content += '\n**중간 위험**:\n';
    (data.mediumRisks || []).forEach((risk: string) => content += `- ${risk}\n`);
    content += '\n**낮은 위험**:\n';
    (data.lowRisks || []).forEach((risk: string) => content += `- ${risk}\n`);
    content += '\n';
  }

  if (section.id === 'recommendations' && data.recommendations) {
    content += '### 권장 조치사항\n\n';
    data.recommendations.forEach((rec: string, index: number) => {
      content += `${index + 1}. ${rec}\n`;
    });
    content += '\n';
  }

  // 하위 섹션 처리
  if (section.subsections) {
    section.subsections.forEach((subsection: Section) => {
      content += generateSectionContent(subsection, data, level + 1);
    });
  }

  return content;
}

// 객체를 포맷팅
function formatObject(obj: Record<string, any>): string {
  if (obj.category && Array.isArray(obj.items)) {
    return `\n**${obj.category}**:\n${obj.items.map((item: string) => `  - ${item}`).join('\n')}`;
  } else if (obj.principle && obj.description) {
    return `\n**${obj.principle}**: ${obj.description}`;
  } else if (obj.risk_type && Array.isArray(obj.examples)) {
    return `\n**${obj.risk_type}**: ${obj.examples.join(', ')}`;
  } else {
    return Object.entries(obj)
      .map(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        if (Array.isArray(value)) {
          return `**${formattedKey}**: ${value.join(', ')}`;
        } else if (typeof value === 'object' && value !== null) {
          return `**${formattedKey}**:\n${formatObject(value as Record<string, any>)}`;
        } else {
          return `**${formattedKey}**: ${value}`;
        }
      })
      .join('\n');
  }
}

// 문서 ID 생성
function generateDocumentId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `doc_${timestamp}_${random}`;
}

// 생성된 문서 인터페이스
export interface GeneratedDocument {
  id: string;
  type: string;
  title: string;
  content: string;
  metadata: {
    generatedAt: string;
    version: string;
    inputData: Record<string, any>;
    aiModel: string;
  };
}

// 문서 타입 목록 반환
export function getAvailableDocumentTypes(): string[] {
  return Object.keys(documentTemplates);
}

// 문서 타입별 설명 반환
export function getDocumentTypeInfo(documentType: string): {
  title: string;
  description: string;
  requiredFields: string[];
} {
  const template = documentTemplates[documentType];
  if (!template) {
    throw new Error(`Unknown document type: ${documentType}`);
  }

  // 각 문서 타입별 설명과 필수 필드 정의
  const typeInfo: Record<string, { description: string; requiredFields: string[] }> = {
    'safety-assessment': {
      description: 'AI 시스템의 안전성을 종합적으로 평가하는 보고서',
      requiredFields: ['systemName', 'version']
    },
    'requirements-spec': {
      description: 'AI 안전을 위한 기능적/비기능적 요구사항 명세',
      requiredFields: ['projectName', 'version']
    },
    'implementation-plan': {
      description: 'AI 안전 시스템 구현을 위한 단계별 계획',
      requiredFields: ['projectName', 'timeline']
    },
    'test-scenarios': {
      description: 'AI 시스템의 안전성 검증을 위한 테스트 시나리오',
      requiredFields: ['testSuiteName']
    },
    'training-program': {
      description: 'AI 안전 교육을 위한 커리큘럼과 인증 프로그램',
      requiredFields: ['programName', 'targetAudience']
    },
    'compliance-checklist': {
      description: 'AI 관련 규제 준수를 위한 체크리스트',
      requiredFields: ['companyName', 'systemType']
    },
    'ethical-framework': {
      description: 'AI 개발과 운영을 위한 윤리적 가이드라인',
      requiredFields: ['organizationName']
    },
    'incident-response': {
      description: 'AI 관련 사고 발생 시 대응 절차와 계획',
      requiredFields: ['systemName', 'contactInfo']
    },
    'monitoring-dashboard': {
      description: 'AI 시스템 모니터링을 위한 대시보드 설계',
      requiredFields: ['systemName', 'metrics']
    },
    'risk-mitigation': {
      description: 'AI 시스템의 위험을 식별하고 완화하는 전략',
      requiredFields: ['systemName', 'riskCategories']
    }
  };

  const info = typeInfo[documentType] || {
    description: template.title,
    requiredFields: []
  };

  return {
    title: template.title,
    description: info.description,
    requiredFields: info.requiredFields
  };
}