// 일별 문서 관련 타입 정의

export interface DailyCheckItem {
  id: string;
  category: string;
  description: string;
  checked: boolean;
  notes?: string;
}

export interface DailyCheckList {
  id: string;
  date: string;
  inspectorName: string;
  department: string;
  checkItems: DailyCheckItem[];
  overallStatus: 'safe' | 'warning' | 'danger';
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChemicalUsage {
  name: string;
  casNumber?: string;
  amount: string;
  unit: string;
}

export interface ExperimentLog {
  id: string;
  date: string;
  experimentTitle: string;
  researcher: string;
  department: string;
  purpose: string;
  procedures: string;
  chemicals: ChemicalUsage[];
  equipment: string[];
  safetyMeasures: string[];
  startTime: string;
  endTime: string;
  results?: string;
  incidents?: string;
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'checklist' | 'experiment-log' | 'weekly-checklist' | 'chemical-usage-report' | 'safety-inspection' | 'education-log' | 'risk-assessment' | 'quarterly-report' | 'annual-safety-plan';

export interface DocumentMetadata {
  id: string;
  type: DocumentType;
  title: string;
  date: string;
  creator: string;
  status: 'draft' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// 주별 문서 관련 타입 정의

export interface WeeklyCheckSummary {
  date: string;
  completionRate: number;
  issues: string[];
  status: 'safe' | 'warning' | 'danger';
}

export interface WeeklyCheckList {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  department: string;
  managerName: string;
  dailySummaries: WeeklyCheckSummary[];
  majorIssues: string[];
  correctiveActions: string[];
  overallStatus: 'safe' | 'warning' | 'danger';
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChemicalInventory {
  name: string;
  casNumber?: string;
  initialStock: number;
  used: number;
  disposed: number;
  currentStock: number;
  unit: string;
}

export interface ChemicalUsageTrend {
  date: string;
  amount: number;
}

export interface ChemicalUsageReport {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  department: string;
  reporterName: string;
  chemicals: ChemicalInventory[];
  usageTrends: Record<string, ChemicalUsageTrend[]>; // 화학물질명을 키로 하는 사용량 추이
  totalDisposalAmount: number;
  disposalMethod: string;
  specialNotes?: string;
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 월별 문서 관련 타입 정의

// 월간 정밀안전진단 타입
export interface InspectionItem {
  id: string;
  category: string;
  item: string;
  standard: string;
  current: string;
  score: number; // 0-100
  priority: 'high' | 'medium' | 'low';
  improvement?: string;
}

export interface SafetyInspection {
  id: string;
  month: string; // YYYY-MM 형식
  department: string;
  inspector: string;
  inspectionDate: string;
  sections: {
    equipment: InspectionItem[];
    environment: InspectionItem[];
    process: InspectionItem[];
    emergency: InspectionItem[];
  };
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  majorFindings: string[];
  improvementPlan: {
    item: string;
    deadline: string;
    responsible: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 교육일지 타입
export interface EducationParticipant {
  id: string;
  name: string;
  department: string;
  position: string;
  attended: boolean;
  testScore?: number;
}

export interface EducationLog {
  id: string;
  month: string; // YYYY-MM 형식
  educationDate: string;
  title: string;
  type: 'regular' | 'special' | 'emergency' | 'new-employee';
  instructor: string;
  duration: number; // 분 단위
  location: string;
  objectives: string[];
  content: {
    section: string;
    details: string;
    duration: number;
  }[];
  participants: EducationParticipant[];
  materials: string[];
  evaluation: {
    understanding: number; // 1-5
    usefulness: number; // 1-5
    satisfaction: number; // 1-5
    feedback: string[];
  };
  improvements?: string;
  nextEducationPlan?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 위험성평가서 타입
export interface HazardIdentification {
  id: string;
  process: string;
  task: string;
  hazard: string;
  hazardType: 'physical' | 'chemical' | 'biological' | 'ergonomic' | 'psychological';
  possibleAccident: string;
  currentControl: string;
}

export interface RiskMatrix {
  frequency: 1 | 2 | 3 | 4 | 5; // 빈도
  severity: 1 | 2 | 3 | 4 | 5; // 심각도
  riskLevel: number; // frequency * severity
  riskGrade: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskAssessmentItem extends HazardIdentification {
  riskBefore: RiskMatrix;
  controlMeasures: {
    engineering: string[];
    administrative: string[];
    ppe: string[];
  };
  riskAfter: RiskMatrix;
  residualRisk: string;
  responsible: string;
  implementationDate: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface RiskAssessment {
  id: string;
  month: string; // YYYY-MM 형식
  department: string;
  assessor: string;
  assessmentDate: string;
  scope: string;
  participants: {
    name: string;
    role: string;
  }[];
  riskItems: RiskAssessmentItem[];
  summary: {
    totalHazards: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    completedMeasures: number;
  };
  recommendations: string[];
  reviewDate: string;
  approver: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 분기별 문서 관련 타입 정의

export interface QuarterlySafetyMetrics {
  month: string;
  incidents: number;
  nearMisses: number;
  safetyScore: number;
  inspectionCount: number;
  educationHours: number;
  participationRate: number;
}

export interface QuarterlyImprovement {
  id: string;
  category: 'equipment' | 'process' | 'training' | 'environment';
  description: string;
  implementationDate: string;
  status: 'planned' | 'in-progress' | 'completed';
  impact: 'high' | 'medium' | 'low';
  cost: number;
  responsible: string;
}

export interface QuarterlyReport {
  id: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  period: {
    start: string;
    end: string;
  };
  department: string;
  preparedBy: string;
  reviewedBy: string;
  
  // 안전 성과 지표
  performanceMetrics: {
    monthly: QuarterlySafetyMetrics[];
    quarterly: {
      totalIncidents: number;
      totalNearMisses: number;
      averageSafetyScore: number;
      totalInspections: number;
      totalEducationHours: number;
      averageParticipationRate: number;
      kpiAchievement: number; // KPI 달성률 (%)
    };
    comparison: {
      previousQuarter: {
        incidents: number;
        improvement: number; // 개선율 (%)
      };
      previousYear: {
        incidents: number;
        improvement: number; // 개선율 (%)
      };
    };
  };
  
  // 주요 사고 및 조치사항
  majorIncidents: {
    date: string;
    type: string;
    description: string;
    rootCause: string;
    correctiveActions: string[];
    preventiveMeasures: string[];
    status: 'open' | 'closed';
  }[];
  
  // 개선 활동
  improvements: QuarterlyImprovement[];
  
  // 교육 및 훈련
  educationSummary: {
    totalSessions: number;
    totalParticipants: number;
    topics: string[];
    effectiveness: number; // 1-100
    feedback: string[];
  };
  
  // 위험성 평가 요약
  riskAssessmentSummary: {
    totalAssessments: number;
    newHazardsIdentified: number;
    resolvedHazards: number;
    criticalRisks: number;
    riskReductionRate: number; // %
  };
  
  // 예산 집행
  budgetExecution: {
    allocated: number;
    spent: number;
    categories: {
      equipment: number;
      training: number;
      consulting: number;
      other: number;
    };
    executionRate: number; // %
  };
  
  // 차기 분기 계획
  nextQuarterPlan: {
    focusAreas: string[];
    plannedActivities: {
      activity: string;
      timeline: string;
      expectedOutcome: string;
    }[];
    budgetRequest: number;
  };
  
  // 결론 및 제언
  conclusions: string[];
  recommendations: string[];
  
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 연간 문서 관련 타입 정의

export interface AnnualGoal {
  id: string;
  category: 'incident-reduction' | 'education' | 'compliance' | 'culture' | 'system-improvement';
  description: string;
  target: string;
  metric: string;
  baseline: number;
  targetValue: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface AnnualBudgetItem {
  category: string;
  subcategory: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  quarter: 1 | 2 | 3 | 4 | 'yearly';
  justification: string;
}

export interface AnnualEducationPlan {
  id: string;
  type: 'legal-requirement' | 'skill-development' | 'safety-culture' | 'emergency-response';
  title: string;
  targetAudience: string[];
  frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'as-needed';
  duration: number; // 시간
  objectives: string[];
  content: string[];
  instructor: 'internal' | 'external';
  scheduledDates: string[];
  expectedParticipants: number;
  budget: number;
}

export interface AnnualInspectionSchedule {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  area: string;
  equipment?: string;
  responsible: string;
  schedule: {
    month: number;
    dates?: number[];
  }[];
  checklistReference: string;
  lastInspectionDate?: string;
  nextDueDate: string;
}

export interface AnnualSafetyPlan {
  id: string;
  year: number;
  department: string;
  preparedBy: string;
  approvedBy: string;
  approvalDate?: string;
  
  // 전년도 성과 분석
  previousYearAnalysis: {
    achievements: {
      description: string;
      impact: string;
    }[];
    challenges: {
      description: string;
      rootCause: string;
      lessonsLearned: string;
    }[];
    incidentTrend: {
      total: number;
      byType: Record<string, number>;
      reduction: number; // % compared to previous year
    };
    complianceRate: number; // %
  };
  
  // 연간 목표
  annualGoals: AnnualGoal[];
  
  // 예산 계획
  budgetPlan: {
    totalBudget: number;
    breakdown: {
      safetyEquipment: number;
      education: number;
      inspection: number;
      consulting: number;
      emergency: number;
      other: number;
    };
    details: AnnualBudgetItem[];
    contingency: number; // 예비비
  };
  
  // 교육 계획
  educationPlan: {
    mandatoryPrograms: AnnualEducationPlan[];
    developmentPrograms: AnnualEducationPlan[];
    totalHours: number;
    totalBudget: number;
  };
  
  // 점검 및 검사 일정
  inspectionPlan: {
    schedule: AnnualInspectionSchedule[];
    externalInspections: {
      type: string;
      agency: string;
      scheduledDate: string;
      preparationRequired: string[];
    }[];
  };
  
  // 위험성 평가 계획
  riskAssessmentPlan: {
    regularAssessment: {
      frequency: 'monthly' | 'quarterly';
      scope: string[];
      methodology: string;
    };
    specialAssessment: {
      trigger: string[];
      process: string;
    };
    targetRiskReduction: number; // %
  };
  
  // 비상대응 계획
  emergencyResponsePlan: {
    drills: {
      type: string;
      frequency: string;
      participants: string[];
      objectives: string[];
    }[];
    equipmentMaintenance: {
      item: string;
      schedule: string;
      responsible: string;
    }[];
    trainingRequired: string[];
  };
  
  // 안전보건 경영시스템
  managementSystem: {
    certifications: {
      type: string;
      currentStatus: string;
      expiryDate?: string;
      renewalPlan?: string;
    }[];
    internalAudits: {
      quarter: number;
      scope: string[];
      auditor: string;
    }[];
    managementReview: {
      frequency: string;
      participants: string[];
      agenda: string[];
    };
  };
  
  // 성과 지표 (KPI)
  kpiTargets: {
    indicator: string;
    unit: string;
    baseline: number;
    target: number;
    measurementMethod: string;
    reviewFrequency: string;
  }[];
  
  // 이행 계획
  implementationPlan: {
    quarter: 1 | 2 | 3 | 4;
    activities: {
      activity: string;
      responsible: string;
      deadline: string;
      resources: string[];
      expectedOutcome: string;
    }[];
  }[];
  
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  signature?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}