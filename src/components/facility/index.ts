/**
 * Facility 모듈 통합 export
 */

// 대시보드 컴포넌트
export { FacilityDashboard } from './FacilityDashboard';
export { FacilityStats } from './FacilityStats';

// 하위 모듈 re-export
export * from './alerts';
export * from './equipment';
export * from './maintenance';
export * from './permits';

// 타입 재export (필요한 경우)
export type {
  // 기본 타입들은 lib/types/facility.ts에서 직접 import 권장
  MaintenanceTask,
  WorkPermit,
  Equipment,
  FacilityAlert,
  FacilityStatistics,
  MaintenancePriority,
  MaintenanceStatus
} from '@/lib/types/facility';