/**
 * 시설 관리 시스템 타입 정의
 * 유지보수, 작업허가서, 알림, 장비 관리에 관련된 모든 타입들
 */

import { Timestamps, Status, Priority, User, Attachment } from './common';

// === 기본 상태 및 우선순위 타입 ===
export type MaintenanceStatus = 
  | 'scheduled' 
  | 'in_progress' 
  | 'completed' 
  | 'overdue' 
  | 'cancelled' 
  | 'on_hold';

export type PermitStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'expired' 
  | 'active' 
  | 'completed';

export type Priority = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'critical' 
  | 'emergency';

export type AlertSeverity = Priority;

export type AlertStatus = 
  | 'active' 
  | 'acknowledged' 
  | 'resolved' 
  | 'false_positive' 
  | 'escalated';

export type EquipmentStatus = 
  | 'operational' 
  | 'maintenance' 
  | 'repair' 
  | 'out_of_service' 
  | 'decommissioned';

// === 시설 영역 및 카테고리 ===
export type FacilityArea = 
  | 'Production Floor' 
  | 'Lab Building' 
  | 'Warehouse' 
  | 'Office Building' 
  | 'Utility Room' 
  | 'Chemical Storage' 
  | 'Electrical Room' 
  | 'HVAC Room' 
  | 'Emergency Exit' 
  | 'Parking Area' 
  | 'Loading Dock' 
  | 'Cafeteria' 
  | 'Server Room' 
  | 'Conference Room' 
  | 'Bathroom' 
  | 'Corridor' 
  | 'Stairwell' 
  | 'Elevator' 
  | 'Reception' 
  | 'Storage Room';

export type MaintenanceCategory = 
  | 'Electrical' 
  | 'HVAC' 
  | 'Plumbing' 
  | 'Fire Safety' 
  | 'Security' 
  | 'Structural' 
  | 'Equipment' 
  | 'Cleaning' 
  | 'Preventive' 
  | 'Corrective' 
  | 'Emergency' 
  | 'Inspection' 
  | 'Calibration' 
  | 'Software Update' 
  | 'Safety Check';

export type PermitType = 
  | 'Hot Work' 
  | 'Confined Space' 
  | 'Electrical Work' 
  | 'Chemical Work' 
  | 'Height Work' 
  | 'Excavation' 
  | 'Welding' 
  | 'Cutting' 
  | 'Radiation Work' 
  | 'Crane Operation' 
  | 'Shutdown Work' 
  | 'Emergency Work' 
  | 'Contractor Work' 
  | 'Maintenance Work' 
  | 'Construction Work';

// === 장비 관련 타입 ===
export interface Equipment extends Timestamps {
  id: string;
  name: string;
  code: string; // Equipment identifier code
  type: string; // Pump, Valve, Motor, Sensor, etc.
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: FacilityArea;
  subLocation?: string; // More specific location within area
  status: EquipmentStatus;
  criticality: Priority;
  installDate: string;
  warrantyExpiry?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  specifications: Record<string, any>;
  operatingParameters: {
    temperature?: { min: number; max: number; unit: string };
    pressure?: { min: number; max: number; unit: string };
    voltage?: { min: number; max: number; unit: string };
    power?: { min: number; max: number; unit: string };
    flow?: { min: number; max: number; unit: string };
    [key: string]: any;
  };
  alertThresholds: {
    temperature?: { warning: number; critical: number };
    pressure?: { warning: number; critical: number };
    vibration?: { warning: number; critical: number };
    [key: string]: any;
  };
  attachments: Attachment[];
  notes?: string;
}

// === 유지보수 작업 타입 ===
export interface MaintenanceTask extends Timestamps {
  id: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  status: MaintenanceStatus;
  priority: Priority;
  equipmentId?: string; // Reference to Equipment
  equipmentName?: string;
  location: FacilityArea;
  subLocation?: string;
  scheduledDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  assignedTo: {
    userId: string;
    name: string;
    role: string;
  };
  reportedBy: {
    userId: string;
    name: string;
    role: string;
  };
  approvedBy?: {
    userId: string;
    name: string;
    role: string;
    date: string;
  };
  workOrder?: string; // External work order number
  cost?: {
    labor: number;
    materials: number;
    external: number;
    total: number;
    currency: string;
  };
  materials?: Array<{
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
  }>;
  safety: {
    hazards: string[];
    precautions: string[];
    requiredPPE: string[];
    lockoutTagout: boolean;
    permitRequired: boolean;
    permitId?: string;
  };
  checklist?: Array<{
    item: string;
    completed: boolean;
    completedBy?: string;
    completedDate?: string;
    notes?: string;
  }>;
  attachments: Attachment[];
  photos?: Array<{
    id: string;
    url: string;
    description: string;
    takenBy: string;
    takenDate: string;
    type: 'before' | 'during' | 'after' | 'issue' | 'repair';
  }>;
  notes?: string;
  feedback?: {
    rating: number; // 1-5
    comment: string;
    submittedBy: string;
    submittedDate: string;
  };
}

// === 작업 허가서 타입 ===
export interface WorkPermit extends Timestamps {
  id: string;
  permitNumber: string; // Auto-generated permit number
  title: string;
  description: string;
  type: PermitType;
  status: PermitStatus;
  priority: Priority;
  location: FacilityArea;
  subLocation?: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  estimatedDuration: number; // in hours
  workDescription: string;
  requestedBy: {
    userId: string;
    name: string;
    department: string;
    contact: string;
  };
  contractor?: {
    companyName: string;
    contactPerson: string;
    contact: string;
    license: string;
    insurance: boolean;
    insuranceExpiry?: string;
  };
  approvals: Array<{
    stage: string;
    approverRole: string;
    approverId?: string;
    approverName?: string;
    status: 'pending' | 'approved' | 'rejected';
    date?: string;
    comments?: string;
    conditions?: string[];
  }>;
  hazards: {
    identified: string[];
    riskLevel: Priority;
    mitigation: string[];
  };
  safety: {
    requiredTraining: string[];
    requiredPPE: string[];
    emergencyProcedure: string;
    fireWatchRequired: boolean;
    gasTestRequired: boolean;
    isolationRequired: boolean;
    escapeRoutes: string[];
  };
  environmental: {
    noiseLevel?: string;
    dustControl?: string;
    wasteDisposal?: string;
    chemicalsUsed?: Array<{
      name: string;
      quantity: string;
      msdsAvailable: boolean;
    }>;
  };
  equipment: {
    required: string[];
    inspectionDate?: string;
    certificationValid: boolean;
  };
  communication: {
    affectedAreas: string[];
    notificationSent: boolean;
    contactPerson: string;
    emergencyContact: string;
  };
  closeOut: {
    workCompleted: boolean;
    finalInspection: boolean;
    inspectedBy?: string;
    inspectionDate?: string;
    deficiencies?: string[];
    lessons: string[];
  };
  extensions?: Array<{
    requestedBy: string;
    requestDate: string;
    newEndDate: string;
    reason: string;
    approved: boolean;
    approvedBy?: string;
    approvalDate?: string;
  }>;
  attachments: Attachment[];
  photos?: Array<{
    id: string;
    url: string;
    description: string;
    takenBy: string;
    takenDate: string;
    type: 'site_condition' | 'hazard' | 'equipment' | 'completion' | 'issue';
  }>;
  notes?: string;
}

// === AI 알림 타입 ===
export interface FacilityAlert extends Timestamps {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  priority: Priority;
  source: 'ai_system' | 'sensor' | 'manual' | 'inspection' | 'maintenance' | 'external';
  category: 'safety' | 'equipment' | 'environmental' | 'security' | 'operational' | 'compliance';
  equipmentId?: string;
  equipmentName?: string;
  location: FacilityArea;
  subLocation?: string;
  detectedDate: string;
  acknowledgedDate?: string;
  resolvedDate?: string;
  acknowledgedBy?: {
    userId: string;
    name: string;
    role: string;
  };
  resolvedBy?: {
    userId: string;
    name: string;
    role: string;
  };
  assignedTo?: {
    userId: string;
    name: string;
    role: string;
  };
  sensorData?: {
    sensorId: string;
    sensorName: string;
    currentValue: number;
    thresholdValue: number;
    unit: string;
    timestamp: string;
    trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  };
  aiAnalysis?: {
    confidence: number; // 0-100%
    prediction: string;
    recommendations: string[];
    relatedAlerts: string[];
    historicalPattern?: {
      frequency: string;
      lastOccurrence: string;
      averageResolutionTime: number;
    };
  };
  impact: {
    safetyRisk: Priority;
    operationalImpact: Priority;
    estimatedDowntime?: number; // in minutes
    affectedSystems: string[];
    potentialCost?: number;
  };
  response: {
    immediateActions: string[];
    longTermActions?: string[];
    escalationRequired: boolean;
    escalatedTo?: string[];
    estimatedResolutionTime?: number; // in minutes
  };
  history: Array<{
    action: string;
    performedBy: string;
    performedDate: string;
    details: string;
    attachments?: string[];
  }>;
  relatedItems: {
    maintenanceTasks: string[];
    workPermits: string[];
    incidents: string[];
    inspections: string[];
  };
  attachments: Attachment[];
  notes?: string;
}

// === 검색 및 필터링 파라미터 ===
export interface FacilitySearchParams {
  query?: string;
  type?: string[];
  status?: string[];
  priority?: Priority[];
  location?: FacilityArea[];
  assignedTo?: string[];
  dateRange?: {
    field: 'createdAt' | 'scheduledDate' | 'dueDate' | 'completedDate' | 'startDate' | 'endDate';
    start: string;
    end: string;
  };
  category?: string[];
  severity?: AlertSeverity[];
  equipmentId?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'scheduledDate' | 'dueDate' | 'priority' | 'title' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// === 요청/응답 타입 ===
export interface CreateMaintenanceTaskRequest {
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: Priority;
  equipmentId?: string;
  location: FacilityArea;
  subLocation?: string;
  scheduledDate: string;
  dueDate: string;
  estimatedDuration: number;
  assignedToId: string;
  workOrder?: string;
  safety: {
    hazards: string[];
    precautions: string[];
    requiredPPE: string[];
    lockoutTagout: boolean;
    permitRequired: boolean;
  };
  materials?: Array<{
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
  }>;
  attachments?: Attachment[];
  notes?: string;
}

export interface UpdateMaintenanceTaskRequest {
  id: string;
  updates: Partial<MaintenanceTask>;
  completionData?: {
    actualDuration: number;
    checklist: Array<{
      item: string;
      completed: boolean;
      notes?: string;
    }>;
    photos?: Array<{
      url: string;
      description: string;
      type: 'before' | 'during' | 'after' | 'issue' | 'repair';
    }>;
    cost?: {
      labor: number;
      materials: number;
      external: number;
    };
    notes?: string;
    feedback?: {
      rating: number;
      comment: string;
    };
  };
}

export interface CreateWorkPermitRequest {
  title: string;
  description: string;
  type: PermitType;
  priority: Priority;
  location: FacilityArea;
  subLocation?: string;
  startDate: string;
  endDate: string;
  estimatedDuration: number;
  workDescription: string;
  contractor?: {
    companyName: string;
    contactPerson: string;
    contact: string;
    license: string;
    insurance: boolean;
    insuranceExpiry?: string;
  };
  hazards: {
    identified: string[];
    riskLevel: Priority;
    mitigation: string[];
  };
  safety: {
    requiredTraining: string[];
    requiredPPE: string[];
    emergencyProcedure: string;
    fireWatchRequired: boolean;
    gasTestRequired: boolean;
    isolationRequired: boolean;
    escapeRoutes: string[];
  };
  environmental?: {
    noiseLevel?: string;
    dustControl?: string;
    wasteDisposal?: string;
    chemicalsUsed?: Array<{
      name: string;
      quantity: string;
      msdsAvailable: boolean;
    }>;
  };
  equipment: {
    required: string[];
    inspectionDate?: string;
    certificationValid: boolean;
  };
  communication: {
    affectedAreas: string[];
    contactPerson: string;
    emergencyContact: string;
  };
  attachments?: Attachment[];
  notes?: string;
}

export interface UpdateWorkPermitRequest {
  id: string;
  updates: Partial<WorkPermit>;
  approvalAction?: {
    stage: string;
    status: 'approved' | 'rejected';
    comments?: string;
    conditions?: string[];
  };
  extensionRequest?: {
    newEndDate: string;
    reason: string;
  };
  closeOutData?: {
    workCompleted: boolean;
    deficiencies?: string[];
    lessons: string[];
    photos?: Array<{
      url: string;
      description: string;
      type: 'completion' | 'issue';
    }>;
  };
}

export interface CreateEquipmentRequest {
  name: string;
  code: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: FacilityArea;
  subLocation?: string;
  criticality: Priority;
  installDate: string;
  warrantyExpiry?: string;
  specifications: Record<string, any>;
  operatingParameters: Record<string, any>;
  alertThresholds: Record<string, any>;
  attachments?: Attachment[];
  notes?: string;
}

export interface UpdateEquipmentRequest {
  id: string;
  updates: Partial<Equipment>;
}

export interface FacilityAlertAcknowledgeRequest {
  id: string;
  acknowledgedBy: string;
  notes?: string;
}

export interface FacilityAlertResolveRequest {
  id: string;
  resolvedBy: string;
  resolution: string;
  actionsTaken: string[];
  preventiveMeasures?: string[];
  attachments?: Attachment[];
  notes?: string;
}

// === 통계 및 대시보드 타입 ===
export interface FacilityStatistics {
  maintenance: {
    totalTasks: number;
    byStatus: Record<MaintenanceStatus, number>;
    byPriority: Record<Priority, number>;
    byCategory: Record<MaintenanceCategory, number>;
    overdue: number;
    completedThisMonth: number;
    averageCompletionTime: number; // in hours
    upcomingTasks: number;
    costThisMonth: number;
  };
  permits: {
    totalActive: number;
    byStatus: Record<PermitStatus, number>;
    byType: Record<PermitType, number>;
    pendingApprovals: number;
    expiringThisWeek: number;
    issuedThisMonth: number;
    averageApprovalTime: number; // in hours
  };
  alerts: {
    totalActive: number;
    bySeverity: Record<AlertSeverity, number>;
    byCategory: Record<string, number>;
    unacknowledged: number;
    resolvedThisWeek: number;
    averageResolutionTime: number; // in minutes
    escalated: number;
    aiGenerated: number;
  };
  equipment: {
    totalCount: number;
    byStatus: Record<EquipmentStatus, number>;
    byCriticality: Record<Priority, number>;
    dueForMaintenance: number;
    outOfService: number;
    averageUptime: number; // percentage
    maintenanceCosts: number;
  };
  overall: {
    facilityHealthScore: number; // 0-100
    riskLevel: Priority;
    complianceScore: number; // 0-100
    monthlyTrends: {
      maintenance: Array<{ month: string; completed: number; overdue: number }>;
      alerts: Array<{ month: string; total: number; critical: number }>;
      permits: Array<{ month: string; issued: number; expired: number }>;
    };
  };
}

// === 파일 업로드 타입 ===
export interface FileUploadRequest {
  type: 'maintenance_photo' | 'permit_document' | 'equipment_manual' | 'alert_evidence' | 'inspection_report';
  relatedId: string; // ID of related maintenance/permit/equipment/alert
  description?: string;
  category?: string;
}

export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedBy: string;
  uploadedDate: string;
}

