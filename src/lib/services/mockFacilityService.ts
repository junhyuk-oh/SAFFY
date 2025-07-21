import { 
  MaintenanceTask, 
  WorkPermit, 
  Equipment, 
  FacilityAlert,
  MaintenanceStatus,
  PermitStatus,
  EquipmentStatus,
  AlertSeverity,
  AlertStatus,
  Priority,
  FacilityArea,
  MaintenanceCategory,
  PermitType,
  CreateMaintenanceTaskRequest,
  UpdateMaintenanceTaskRequest,
  CreateWorkPermitRequest,
  UpdateWorkPermitRequest,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  FacilityAlertAcknowledgeRequest,
  FacilityAlertResolveRequest,
  FacilityStatistics,
  FacilitySearchParams
} from '@/lib/types/facility';
import { AppError, ValidationError } from '@/lib/types/error';

// Mock 데이터 저장소
const maintenanceTasks: MaintenanceTask[] = [];
const workPermits: WorkPermit[] = [];
const equipments: Equipment[] = [];
const facilityAlerts: FacilityAlert[] = [];

// 초기 Mock 데이터 생성
function initializeMockData() {
  // 유지보수 작업 데이터
  const mockMaintenanceTasks: MaintenanceTask[] = [
    {
      id: 'maint-001',
      title: '보일러 정기점검',
      description: '1호 보일러 연간 정기점검 및 청소',
      category: 'HVAC',
      status: 'scheduled',
      priority: 'high',
      equipmentId: 'equip-001',
      equipmentName: '보일러 #1',
      location: 'Utility Room',
      subLocation: 'B1층 기계실',
      scheduledDate: '2025-01-25T09:00:00Z',
      dueDate: '2025-01-25T17:00:00Z',
      estimatedDuration: 480,
      assignedTo: {
        userId: 'user-101',
        name: '김기술',
        role: '시설관리팀'
      },
      reportedBy: {
        userId: 'user-102',
        name: '박관리',
        role: '시설관리팀장'
      },
      workOrder: 'WO-2025-001',
      safety: {
        hazards: ['고온 표면', '밀폐공간'],
        precautions: ['보호장구 착용', '작업 전 가스 측정'],
        requiredPPE: ['안전모', '안전화', '내열장갑'],
        lockoutTagout: true,
        permitRequired: true,
        permitId: 'permit-001'
      },
      attachments: [],
      notes: '작년 점검 시 열교환기 스케일 제거 필요 확인',
      createdAt: '2025-01-20T08:00:00Z',
      updatedAt: '2025-01-20T08:00:00Z'
    },
    {
      id: 'maint-002',
      title: '화재경보기 배터리 교체',
      description: '전 층 화재경보기 배터리 일괄 교체',
      category: 'Fire Safety',
      status: 'in_progress',
      priority: 'critical',
      location: 'Office Building',
      scheduledDate: '2025-01-21T08:00:00Z',
      dueDate: '2025-01-21T18:00:00Z',
      estimatedDuration: 600,
      assignedTo: {
        userId: 'user-103',
        name: '이안전',
        role: '안전관리자'
      },
      reportedBy: {
        userId: 'user-102',
        name: '박관리',
        role: '시설관리팀장'
      },
      safety: {
        hazards: ['고소작업'],
        precautions: ['사다리 안전 확인'],
        requiredPPE: ['안전모', '안전화'],
        lockoutTagout: false,
        permitRequired: false
      },
      checklist: [
        { item: '1층 경보기 점검', completed: true, completedBy: '이안전', completedDate: '2025-01-21T09:00:00Z' },
        { item: '2층 경보기 점검', completed: true, completedBy: '이안전', completedDate: '2025-01-21T10:30:00Z' },
        { item: '3층 경보기 점검', completed: false }
      ],
      attachments: [],
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-21T10:30:00Z'
    },
    {
      id: 'maint-003',
      title: 'HVAC 필터 교체',
      description: '공조기 전체 필터 교체 작업',
      category: 'HVAC',
      status: 'completed',
      priority: 'medium',
      location: 'Lab Building',
      scheduledDate: '2025-01-19T08:00:00Z',
      dueDate: '2025-01-19T12:00:00Z',
      completedDate: '2025-01-19T11:30:00Z',
      estimatedDuration: 240,
      actualDuration: 210,
      assignedTo: {
        userId: 'user-104',
        name: '최정비',
        role: '시설관리팀'
      },
      reportedBy: {
        userId: 'user-102',
        name: '박관리',
        role: '시설관리팀장'
      },
      cost: {
        labor: 200000,
        materials: 500000,
        external: 0,
        total: 700000,
        currency: 'KRW'
      },
      materials: [
        { name: 'HEPA 필터', quantity: 20, unit: 'EA', cost: 25000 }
      ],
      safety: {
        hazards: ['분진'],
        precautions: ['마스크 착용'],
        requiredPPE: ['방진마스크', '안전안경'],
        lockoutTagout: false,
        permitRequired: false
      },
      attachments: [],
      feedback: {
        rating: 5,
        comment: '신속하고 깔끔한 작업 감사합니다',
        submittedBy: '연구소장',
        submittedDate: '2025-01-19T14:00:00Z'
      },
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-19T14:00:00Z'
    },
    {
      id: 'maint-004',
      title: '전기패널 절연저항 측정',
      description: '주 전기실 배전반 절연저항 측정',
      category: 'Electrical',
      status: 'overdue',
      priority: 'high',
      location: 'Electrical Room',
      scheduledDate: '2025-01-20T09:00:00Z',
      dueDate: '2025-01-20T17:00:00Z',
      estimatedDuration: 480,
      assignedTo: {
        userId: 'user-105',
        name: '강전기',
        role: '전기기사'
      },
      reportedBy: {
        userId: 'user-102',
        name: '박관리',
        role: '시설관리팀장'
      },
      safety: {
        hazards: ['고압전기', '감전위험'],
        precautions: ['전원차단 확인', '접지 확인'],
        requiredPPE: ['절연장갑', '절연화', '안전모'],
        lockoutTagout: true,
        permitRequired: true
      },
      attachments: [],
      notes: '정전 작업 필요 - 사전 공지 완료',
      createdAt: '2025-01-18T15:00:00Z',
      updatedAt: '2025-01-21T08:00:00Z'
    },
    {
      id: 'maint-005',
      title: '냉각탑 청소',
      description: 'A동 냉각탑 스케일 제거 및 청소',
      category: 'HVAC',
      status: 'cancelled',
      priority: 'low',
      location: 'Lab Building',
      subLocation: '옥상',
      scheduledDate: '2025-01-22T08:00:00Z',
      dueDate: '2025-01-22T17:00:00Z',
      estimatedDuration: 540,
      assignedTo: {
        userId: 'user-101',
        name: '김기술',
        role: '시설관리팀'
      },
      reportedBy: {
        userId: 'user-102',
        name: '박관리',
        role: '시설관리팀장'
      },
      safety: {
        hazards: ['고소작업', '화학물질'],
        precautions: ['안전난간 설치', '보호구 착용'],
        requiredPPE: ['안전대', '안전모', '화학물질용 장갑'],
        lockoutTagout: true,
        permitRequired: true
      },
      attachments: [],
      notes: '날씨 악화로 연기',
      createdAt: '2025-01-17T14:00:00Z',
      updatedAt: '2025-01-21T16:00:00Z'
    }
  ];

  // 작업허가서 데이터
  const mockWorkPermits: WorkPermit[] = [
    {
      id: 'permit-001',
      permitNumber: 'PTW-2025-001',
      title: '보일러실 용접작업',
      description: '보일러 배관 용접 보수 작업',
      type: 'Hot Work',
      status: 'active',
      priority: 'high',
      location: 'Utility Room',
      subLocation: 'B1층 기계실',
      startDate: '2025-01-25T09:00:00Z',
      endDate: '2025-01-25T17:00:00Z',
      estimatedDuration: 8,
      workDescription: '누수 배관 용접 보수',
      requestedBy: {
        userId: 'user-102',
        name: '박관리',
        department: '시설관리팀',
        contact: '010-1234-5678'
      },
      contractor: {
        companyName: '한국용접(주)',
        contactPerson: '정용접',
        contact: '010-9876-5432',
        license: 'WLD-2024-123',
        insurance: true,
        insuranceExpiry: '2025-12-31'
      },
      approvals: [
        {
          stage: '안전관리자',
          approverRole: '안전관리자',
          approverId: 'user-103',
          approverName: '이안전',
          status: 'approved',
          date: '2025-01-20T14:00:00Z',
          conditions: ['소화기 비치', '화기감시자 배치']
        }
      ],
      hazards: {
        identified: ['화재', '화상', '가스중독'],
        riskLevel: 'high',
        mitigation: ['소화기 비치', '환기 실시', '가연물 제거']
      },
      safety: {
        requiredTraining: ['용접안전교육'],
        requiredPPE: ['용접면', '가죽장갑', '안전화'],
        emergencyProcedure: '화재 시 소화기 사용 후 대피',
        fireWatchRequired: true,
        gasTestRequired: false,
        isolationRequired: true,
        escapeRoutes: ['비상구 #1', '비상구 #2']
      },
      attachments: [],
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T14:00:00Z'
    },
    {
      id: 'permit-002',
      permitNumber: 'PTW-2025-002',
      title: '전기작업 허가서',
      description: '주 배전반 차단기 교체',
      type: 'Electrical Work',
      status: 'submitted',
      priority: 'critical',
      location: 'Electrical Room',
      startDate: '2025-01-26T08:00:00Z',
      endDate: '2025-01-26T18:00:00Z',
      estimatedDuration: 10,
      workDescription: '노후 차단기 교체 작업',
      requestedBy: {
        userId: 'user-105',
        name: '강전기',
        department: '시설관리팀',
        contact: '010-2222-3333'
      },
      approvals: [
        {
          stage: '안전관리자',
          approverRole: '안전관리자',
          status: 'pending'
        }
      ],
      hazards: {
        identified: ['감전', '아크 플래시'],
        riskLevel: 'critical',
        mitigation: ['전원 차단', 'LOTO 실시', '절연 도구 사용']
      },
      safety: {
        requiredTraining: ['전기안전교육', 'LOTO교육'],
        requiredPPE: ['절연장갑', '절연화', '안면보호구'],
        emergencyProcedure: '감전 시 전원차단 후 CPR',
        fireWatchRequired: false,
        gasTestRequired: false,
        isolationRequired: true,
        escapeRoutes: ['주 출입구']
      },
      attachments: [],
      createdAt: '2025-01-21T09:00:00Z',
      updatedAt: '2025-01-21T09:00:00Z'
    }
  ];

  // 장비 데이터
  const mockEquipments: Equipment[] = [
    {
      id: 'equip-001',
      name: '보일러 #1',
      code: 'BLR-001',
      type: 'Boiler',
      manufacturer: '한국보일러',
      model: 'KB-5000',
      serialNumber: 'KB2023001',
      location: 'Utility Room',
      subLocation: 'B1층 기계실',
      status: 'operational',
      criticality: 'high',
      installDate: '2020-03-15',
      warrantyExpiry: '2025-03-14',
      lastMaintenanceDate: '2024-12-20',
      nextMaintenanceDate: '2025-01-25',
      specifications: {
        capacity: '5000 kcal/h',
        pressure: '10 bar',
        fuel: 'LNG'
      },
      operatingParameters: {
        temperature: { min: 60, max: 90, unit: '°C' },
        pressure: { min: 5, max: 10, unit: 'bar' }
      },
      alertThresholds: {
        temperature: { warning: 85, critical: 95 },
        pressure: { warning: 9, critical: 10.5 }
      },
      attachments: [],
      createdAt: '2020-03-15T10:00:00Z',
      updatedAt: '2024-12-20T15:00:00Z'
    },
    {
      id: 'equip-002',
      name: '냉각탑 A동',
      code: 'CT-A-001',
      type: 'Cooling Tower',
      manufacturer: '쿨링시스템',
      model: 'CS-3000',
      serialNumber: 'CS2021A001',
      location: 'Lab Building',
      subLocation: '옥상',
      status: 'maintenance',
      criticality: 'medium',
      installDate: '2021-05-20',
      warrantyExpiry: '2024-05-19',
      lastMaintenanceDate: '2024-11-15',
      nextMaintenanceDate: '2025-02-15',
      specifications: {
        capacity: '3000 RT',
        type: '개방형'
      },
      operatingParameters: {
        temperature: { min: 20, max: 35, unit: '°C' },
        flow: { min: 100, max: 300, unit: 'm³/h' }
      },
      alertThresholds: {
        temperature: { warning: 33, critical: 35 }
      },
      attachments: [],
      createdAt: '2021-05-20T09:00:00Z',
      updatedAt: '2025-01-21T08:00:00Z'
    },
    {
      id: 'equip-003',
      name: '화재감지기 #101',
      code: 'FD-101',
      type: 'Fire Detector',
      manufacturer: '안전테크',
      model: 'ST-FD-2000',
      serialNumber: 'FD2024101',
      location: 'Office Building',
      subLocation: '1층 로비',
      status: 'operational',
      criticality: 'critical',
      installDate: '2024-01-10',
      warrantyExpiry: '2026-01-09',
      lastMaintenanceDate: '2025-01-21',
      nextMaintenanceDate: '2025-04-21',
      specifications: {
        type: '광전식',
        coverage: '50㎡'
      },
      operatingParameters: {},
      alertThresholds: {},
      attachments: [],
      createdAt: '2024-01-10T14:00:00Z',
      updatedAt: '2025-01-21T10:00:00Z'
    }
  ];

  // AI 알림 데이터
  const mockAlerts: FacilityAlert[] = [
    {
      id: 'alert-001',
      title: '보일러 온도 이상 감지',
      message: '보일러 #1의 온도가 경고 수준에 도달했습니다.',
      type: 'temperature_anomaly',
      severity: 'high',
      status: 'active',
      priority: 'high',
      source: 'ai_system',
      category: 'equipment',
      equipmentId: 'equip-001',
      equipmentName: '보일러 #1',
      location: 'Utility Room',
      subLocation: 'B1층 기계실',
      detectedDate: '2025-01-21T14:30:00Z',
      sensorData: {
        sensorId: 'TEMP-BLR-001',
        sensorName: '보일러 온도센서',
        currentValue: 88,
        thresholdValue: 85,
        unit: '°C',
        timestamp: '2025-01-21T14:30:00Z',
        trend: 'increasing'
      },
      aiAnalysis: {
        confidence: 92,
        prediction: '30분 내 임계값 초과 예상',
        recommendations: ['냉각수 유량 증가', '부하 감소 고려', '긴급 점검 실시'],
        relatedAlerts: []
      },
      impact: {
        safetyRisk: 'medium',
        operationalImpact: 'high',
        estimatedDowntime: 120,
        affectedSystems: ['난방 시스템'],
        potentialCost: 500000
      },
      response: {
        immediateActions: ['운전원 확인', '온도 모니터링 강화'],
        escalationRequired: true,
        escalatedTo: ['시설관리팀장']
      },
      history: [],
      relatedItems: {
        maintenanceTasks: ['maint-001'],
        workPermits: ['permit-001'],
        incidents: [],
        inspections: []
      },
      attachments: [],
      createdAt: '2025-01-21T14:30:00Z',
      updatedAt: '2025-01-21T14:30:00Z'
    },
    {
      id: 'alert-002',
      title: '진동 수준 증가 감지',
      message: '냉각탑 팬 모터의 진동이 정상 범위를 초과했습니다.',
      type: 'vibration_anomaly',
      severity: 'medium',
      status: 'acknowledged',
      priority: 'medium',
      source: 'sensor',
      category: 'equipment',
      equipmentId: 'equip-002',
      equipmentName: '냉각탑 A동',
      location: 'Lab Building',
      subLocation: '옥상',
      detectedDate: '2025-01-20T10:15:00Z',
      acknowledgedDate: '2025-01-20T10:30:00Z',
      acknowledgedBy: {
        userId: 'user-101',
        name: '김기술',
        role: '시설관리팀'
      },
      sensorData: {
        sensorId: 'VIB-CT-A-001',
        sensorName: '팬 진동센서',
        currentValue: 7.5,
        thresholdValue: 5.0,
        unit: 'mm/s',
        timestamp: '2025-01-20T10:15:00Z',
        trend: 'fluctuating'
      },
      impact: {
        safetyRisk: 'low',
        operationalImpact: 'medium',
        affectedSystems: ['냉각 시스템']
      },
      response: {
        immediateActions: ['베어링 점검', '윤활 상태 확인'],
        escalationRequired: false
      },
      history: [
        {
          action: '알림 확인',
          performedBy: '김기술',
          performedDate: '2025-01-20T10:30:00Z',
          details: '현장 점검 예정'
        }
      ],
      relatedItems: {
        maintenanceTasks: [],
        workPermits: [],
        incidents: [],
        inspections: []
      },
      attachments: [],
      createdAt: '2025-01-20T10:15:00Z',
      updatedAt: '2025-01-20T10:30:00Z'
    }
  ];

  // 초기 데이터 설정
  maintenanceTasks.push(...mockMaintenanceTasks);
  workPermits.push(...mockWorkPermits);
  equipments.push(...mockEquipments);
  facilityAlerts.push(...mockAlerts);
}

// 초기화 실행
initializeMockData();

// Mock 서비스 클래스
export class MockFacilityService {
  // 네트워크 지연 시뮬레이션
  private async simulateDelay() {
    const delay = Math.floor(Math.random() * 150) + 50;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // === Maintenance Task Methods ===
  async createMaintenanceTask(request: CreateMaintenanceTaskRequest, userId: string): Promise<MaintenanceTask> {
    await this.simulateDelay();

    const newTask: MaintenanceTask = {
      id: `maint-${Date.now()}`,
      ...request,
      status: 'scheduled',
      reportedBy: {
        userId,
        name: '현재 사용자',
        role: '시설관리팀'
      },
      attachments: request.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    maintenanceTasks.push(newTask);
    return newTask;
  }

  async updateMaintenanceTask(request: UpdateMaintenanceTaskRequest, userId: string): Promise<MaintenanceTask> {
    await this.simulateDelay();

    const index = maintenanceTasks.findIndex(task => task.id === request.id);
    if (index === -1) {
      throw new AppError('Maintenance task not found', 404);
    }

    const updatedTask = {
      ...maintenanceTasks[index],
      ...request.updates,
      updatedAt: new Date().toISOString()
    };

    if (request.completionData) {
      updatedTask.status = 'completed';
      updatedTask.completedDate = new Date().toISOString();
      updatedTask.actualDuration = request.completionData.actualDuration;
      updatedTask.checklist = request.completionData.checklist;
      updatedTask.photos = request.completionData.photos;
      updatedTask.cost = request.completionData.cost;
      updatedTask.feedback = request.completionData.feedback;
    }

    maintenanceTasks[index] = updatedTask;
    return updatedTask;
  }

  async deleteMaintenanceTask(id: string): Promise<void> {
    await this.simulateDelay();

    const index = maintenanceTasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new AppError('Maintenance task not found', 404);
    }

    maintenanceTasks.splice(index, 1);
  }

  async getMaintenanceTask(id: string): Promise<MaintenanceTask> {
    await this.simulateDelay();

    const task = maintenanceTasks.find(task => task.id === id);
    if (!task) {
      throw new AppError('Maintenance task not found', 404);
    }

    return task;
  }

  async getMaintenanceTasks(params?: FacilitySearchParams): Promise<{ tasks: MaintenanceTask[]; total: number }> {
    await this.simulateDelay();

    let filtered = [...maintenanceTasks];

    // 필터링
    if (params?.status) {
      filtered = filtered.filter(task => params.status!.includes(task.status));
    }
    if (params?.priority) {
      filtered = filtered.filter(task => params.priority!.includes(task.priority));
    }
    if (params?.location) {
      filtered = filtered.filter(task => params.location!.includes(task.location));
    }
    if (params?.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // 정렬
    if (params?.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[params.sortBy as keyof MaintenanceTask];
        const bVal = b[params.sortBy as keyof MaintenanceTask];
        const order = params.sortOrder === 'desc' ? -1 : 1;
        return aVal > bVal ? order : -order;
      });
    }

    // 페이징
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return { tasks: paged, total: filtered.length };
  }

  async getMaintenanceStats(): Promise<any> {
    await this.simulateDelay();

    const stats = {
      total: maintenanceTasks.length,
      byStatus: maintenanceTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<MaintenanceStatus, number>),
      byPriority: maintenanceTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {} as Record<Priority, number>),
      overdue: maintenanceTasks.filter(task => task.status === 'overdue').length,
      completedThisMonth: maintenanceTasks.filter(task => {
        if (!task.completedDate) return false;
        const completed = new Date(task.completedDate);
        const now = new Date();
        return completed.getMonth() === now.getMonth() && completed.getFullYear() === now.getFullYear();
      }).length
    };

    return stats;
  }

  // === Work Permit Methods ===
  async createWorkPermit(request: CreateWorkPermitRequest, userId: string): Promise<WorkPermit> {
    await this.simulateDelay();

    const newPermit: WorkPermit = {
      id: `permit-${Date.now()}`,
      permitNumber: `PTW-${new Date().getFullYear()}-${String(workPermits.length + 1).padStart(3, '0')}`,
      ...request,
      status: 'draft',
      requestedBy: {
        userId,
        name: '현재 사용자',
        department: '시설관리팀',
        contact: '010-0000-0000'
      },
      approvals: [
        {
          stage: '안전관리자',
          approverRole: '안전관리자',
          status: 'pending'
        }
      ],
      communication: {
        ...request.communication,
        notificationSent: false
      },
      closeOut: {
        workCompleted: false,
        finalInspection: false,
        lessons: []
      },
      attachments: request.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    workPermits.push(newPermit);
    return newPermit;
  }

  async updateWorkPermit(request: UpdateWorkPermitRequest, userId: string): Promise<WorkPermit> {
    await this.simulateDelay();

    const index = workPermits.findIndex(permit => permit.id === request.id);
    if (index === -1) {
      throw new AppError('Work permit not found', 404);
    }

    let updatedPermit = {
      ...workPermits[index],
      ...request.updates,
      updatedAt: new Date().toISOString()
    };

    // 승인 처리
    if (request.approvalAction) {
      const approvalIndex = updatedPermit.approvals.findIndex(
        approval => approval.stage === request.approvalAction!.stage
      );
      
      if (approvalIndex !== -1) {
        updatedPermit.approvals[approvalIndex] = {
          ...updatedPermit.approvals[approvalIndex],
          approverId: userId,
          approverName: '현재 사용자',
          status: request.approvalAction.status,
          date: new Date().toISOString(),
          comments: request.approvalAction.comments,
          conditions: request.approvalAction.conditions
        };

        // 모든 승인이 완료되면 active 상태로 변경
        const allApproved = updatedPermit.approvals.every(a => a.status === 'approved');
        if (allApproved) {
          updatedPermit.status = 'approved';
        }
      }
    }

    workPermits[index] = updatedPermit;
    return updatedPermit;
  }

  async deleteWorkPermit(id: string): Promise<void> {
    await this.simulateDelay();

    const index = workPermits.findIndex(permit => permit.id === id);
    if (index === -1) {
      throw new AppError('Work permit not found', 404);
    }

    workPermits.splice(index, 1);
  }

  async getWorkPermit(id: string): Promise<WorkPermit> {
    await this.simulateDelay();

    const permit = workPermits.find(permit => permit.id === id);
    if (!permit) {
      throw new AppError('Work permit not found', 404);
    }

    return permit;
  }

  async getWorkPermits(params?: FacilitySearchParams): Promise<{ permits: WorkPermit[]; total: number }> {
    await this.simulateDelay();

    let filtered = [...workPermits];

    // 필터링
    if (params?.status) {
      filtered = filtered.filter(permit => params.status!.includes(permit.status));
    }
    if (params?.priority) {
      filtered = filtered.filter(permit => params.priority!.includes(permit.priority));
    }
    if (params?.type) {
      filtered = filtered.filter(permit => params.type!.includes(permit.type));
    }

    // 정렬
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 페이징
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return { permits: paged, total: filtered.length };
  }

  async approveWorkPermit(id: string, approverId: string, comments?: string): Promise<WorkPermit> {
    return this.updateWorkPermit({
      id,
      updates: {},
      approvalAction: {
        stage: '안전관리자',
        status: 'approved',
        comments
      }
    }, approverId);
  }

  async rejectWorkPermit(id: string, approverId: string, comments?: string): Promise<WorkPermit> {
    return this.updateWorkPermit({
      id,
      updates: { status: 'rejected' },
      approvalAction: {
        stage: '안전관리자',
        status: 'rejected',
        comments
      }
    }, approverId);
  }

  // === Equipment Methods ===
  async createEquipment(request: CreateEquipmentRequest, userId: string): Promise<Equipment> {
    await this.simulateDelay();

    const newEquipment: Equipment = {
      id: `equip-${Date.now()}`,
      ...request,
      status: 'operational',
      attachments: request.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    equipments.push(newEquipment);
    return newEquipment;
  }

  async updateEquipment(request: UpdateEquipmentRequest, userId: string): Promise<Equipment> {
    await this.simulateDelay();

    const index = equipments.findIndex(equip => equip.id === request.id);
    if (index === -1) {
      throw new AppError('Equipment not found', 404);
    }

    const updatedEquipment = {
      ...equipments[index],
      ...request.updates,
      updatedAt: new Date().toISOString()
    };

    equipments[index] = updatedEquipment;
    return updatedEquipment;
  }

  async deleteEquipment(id: string): Promise<void> {
    await this.simulateDelay();

    const index = equipments.findIndex(equip => equip.id === id);
    if (index === -1) {
      throw new AppError('Equipment not found', 404);
    }

    equipments.splice(index, 1);
  }

  async getEquipment(id: string): Promise<Equipment> {
    await this.simulateDelay();

    const equipment = equipments.find(equip => equip.id === id);
    if (!equipment) {
      throw new AppError('Equipment not found', 404);
    }

    return equipment;
  }

  async getEquipments(params?: FacilitySearchParams): Promise<{ equipments: Equipment[]; total: number }> {
    await this.simulateDelay();

    let filtered = [...equipments];

    // 필터링
    if (params?.status) {
      filtered = filtered.filter(equip => params.status!.includes(equip.status));
    }
    if (params?.location) {
      filtered = filtered.filter(equip => params.location!.includes(equip.location));
    }

    // 정렬
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    // 페이징
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return { equipments: paged, total: filtered.length };
  }

  async updateEquipmentStatus(id: string, status: EquipmentStatus, userId: string): Promise<Equipment> {
    return this.updateEquipment({
      id,
      updates: { status }
    }, userId);
  }

  // === Alert Methods ===
  async createAlert(alert: Partial<FacilityAlert>, userId: string): Promise<FacilityAlert> {
    await this.simulateDelay();

    const newAlert: FacilityAlert = {
      id: `alert-${Date.now()}`,
      title: alert.title || 'New Alert',
      message: alert.message || '',
      type: alert.type || 'manual',
      severity: alert.severity || 'medium',
      status: 'active',
      priority: alert.priority || 'medium',
      source: alert.source || 'manual',
      category: alert.category || 'operational',
      location: alert.location || 'Office Building',
      detectedDate: new Date().toISOString(),
      history: [],
      relatedItems: {
        maintenanceTasks: [],
        workPermits: [],
        incidents: [],
        inspections: []
      },
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...alert
    };

    facilityAlerts.push(newAlert);
    return newAlert;
  }

  async acknowledgeAlert(request: FacilityAlertAcknowledgeRequest): Promise<FacilityAlert> {
    await this.simulateDelay();

    const index = facilityAlerts.findIndex(alert => alert.id === request.id);
    if (index === -1) {
      throw new AppError('Alert not found', 404);
    }

    const updatedAlert = {
      ...facilityAlerts[index],
      status: 'acknowledged' as AlertStatus,
      acknowledgedDate: new Date().toISOString(),
      acknowledgedBy: {
        userId: request.acknowledgedBy,
        name: '현재 사용자',
        role: '시설관리팀'
      },
      updatedAt: new Date().toISOString()
    };

    updatedAlert.history.push({
      action: '알림 확인',
      performedBy: request.acknowledgedBy,
      performedDate: new Date().toISOString(),
      details: request.notes || '알림을 확인했습니다'
    });

    facilityAlerts[index] = updatedAlert;
    return updatedAlert;
  }

  async resolveAlert(request: FacilityAlertResolveRequest): Promise<FacilityAlert> {
    await this.simulateDelay();

    const index = facilityAlerts.findIndex(alert => alert.id === request.id);
    if (index === -1) {
      throw new AppError('Alert not found', 404);
    }

    const updatedAlert = {
      ...facilityAlerts[index],
      status: 'resolved' as AlertStatus,
      resolvedDate: new Date().toISOString(),
      resolvedBy: {
        userId: request.resolvedBy,
        name: '현재 사용자',
        role: '시설관리팀'
      },
      updatedAt: new Date().toISOString()
    };

    updatedAlert.history.push({
      action: '알림 해결',
      performedBy: request.resolvedBy,
      performedDate: new Date().toISOString(),
      details: request.resolution,
      attachments: request.attachments?.map(a => a.id)
    });

    facilityAlerts[index] = updatedAlert;
    return updatedAlert;
  }

  async getAlert(id: string): Promise<FacilityAlert> {
    await this.simulateDelay();

    const alert = facilityAlerts.find(alert => alert.id === id);
    if (!alert) {
      throw new AppError('Alert not found', 404);
    }

    return alert;
  }

  async getAlerts(params?: FacilitySearchParams): Promise<{ alerts: FacilityAlert[]; total: number }> {
    await this.simulateDelay();

    let filtered = [...facilityAlerts];

    // 필터링
    if (params?.status) {
      filtered = filtered.filter(alert => params.status!.includes(alert.status));
    }
    if (params?.severity) {
      filtered = filtered.filter(alert => params.severity!.includes(alert.severity));
    }

    // 정렬 (최신순)
    filtered.sort((a, b) => new Date(b.detectedDate).getTime() - new Date(a.detectedDate).getTime());

    // 페이징
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return { alerts: paged, total: filtered.length };
  }

  async getActiveAlerts(): Promise<FacilityAlert[]> {
    await this.simulateDelay();
    return facilityAlerts.filter(alert => alert.status === 'active');
  }

  // === Statistics Methods ===
  async getFacilityStatistics(): Promise<FacilityStatistics> {
    await this.simulateDelay();

    return {
      maintenance: {
        totalTasks: maintenanceTasks.length,
        byStatus: maintenanceTasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {} as Record<MaintenanceStatus, number>),
        byPriority: maintenanceTasks.reduce((acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        }, {} as Record<Priority, number>),
        byCategory: maintenanceTasks.reduce((acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        }, {} as Record<MaintenanceCategory, number>),
        overdue: maintenanceTasks.filter(task => task.status === 'overdue').length,
        completedThisMonth: maintenanceTasks.filter(task => {
          if (!task.completedDate) return false;
          const completed = new Date(task.completedDate);
          const now = new Date();
          return completed.getMonth() === now.getMonth() && completed.getFullYear() === now.getFullYear();
        }).length,
        averageCompletionTime: 6,
        upcomingTasks: maintenanceTasks.filter(task => task.status === 'scheduled').length,
        costThisMonth: 700000
      },
      permits: {
        totalActive: workPermits.filter(p => p.status === 'active').length,
        byStatus: workPermits.reduce((acc, permit) => {
          acc[permit.status] = (acc[permit.status] || 0) + 1;
          return acc;
        }, {} as Record<PermitStatus, number>),
        byType: workPermits.reduce((acc, permit) => {
          acc[permit.type] = (acc[permit.type] || 0) + 1;
          return acc;
        }, {} as Record<PermitType, number>),
        pendingApprovals: workPermits.filter(p => p.status === 'submitted').length,
        expiringThisWeek: 0,
        issuedThisMonth: workPermits.filter(permit => {
          const created = new Date(permit.createdAt);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length,
        averageApprovalTime: 4
      },
      alerts: {
        totalActive: facilityAlerts.filter(a => a.status === 'active').length,
        bySeverity: facilityAlerts.reduce((acc, alert) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1;
          return acc;
        }, {} as Record<AlertSeverity, number>),
        byCategory: facilityAlerts.reduce((acc, alert) => {
          acc[alert.category] = (acc[alert.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        unacknowledged: facilityAlerts.filter(a => a.status === 'active').length,
        resolvedThisWeek: 0,
        averageResolutionTime: 30,
        escalated: facilityAlerts.filter(a => a.response?.escalationRequired).length,
        aiGenerated: facilityAlerts.filter(a => a.source === 'ai_system').length
      },
      equipment: {
        totalCount: equipments.length,
        byStatus: equipments.reduce((acc, equip) => {
          acc[equip.status] = (acc[equip.status] || 0) + 1;
          return acc;
        }, {} as Record<EquipmentStatus, number>),
        byCriticality: equipments.reduce((acc, equip) => {
          acc[equip.criticality] = (acc[equip.criticality] || 0) + 1;
          return acc;
        }, {} as Record<Priority, number>),
        dueForMaintenance: equipments.filter(e => {
          if (!e.nextMaintenanceDate) return false;
          return new Date(e.nextMaintenanceDate) <= new Date();
        }).length,
        outOfService: equipments.filter(e => e.status === 'out_of_service').length,
        averageUptime: 95,
        maintenanceCosts: 700000
      },
      overall: {
        facilityHealthScore: 85,
        riskLevel: 'medium',
        complianceScore: 92,
        monthlyTrends: {
          maintenance: [
            { month: '2024-11', completed: 12, overdue: 1 },
            { month: '2024-12', completed: 15, overdue: 2 },
            { month: '2025-01', completed: 8, overdue: 1 }
          ],
          alerts: [
            { month: '2024-11', total: 5, critical: 1 },
            { month: '2024-12', total: 8, critical: 2 },
            { month: '2025-01', total: 4, critical: 0 }
          ],
          permits: [
            { month: '2024-11', issued: 3, expired: 1 },
            { month: '2024-12', issued: 5, expired: 2 },
            { month: '2025-01', issued: 2, expired: 0 }
          ]
        }
      }
    };
  }
}

// Export singleton instance
export const mockFacilityService = new MockFacilityService();