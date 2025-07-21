// 기존 컴포넌트
export { MaintenanceScheduler, type MaintenanceTask, type MaintenancePriority, type MaintenanceStatus } from './MaintenanceScheduler'

// 유지보수 관련 컴포넌트
export { MaintenanceList } from './MaintenanceList'
export { MaintenanceCard } from './MaintenanceCard'
export { MaintenanceForm } from './MaintenanceForm'
export { MaintenanceDetail } from './MaintenanceDetail'

// 작업허가서 관련 컴포넌트
export { PermitList } from './PermitList'
export { PermitCard } from './PermitCard'
export { PermitForm } from './PermitForm'
export { PermitApproval } from './PermitApproval'

// 장비 관련 컴포넌트
export { EquipmentGrid } from './EquipmentGrid'
export { EquipmentCard } from './EquipmentCard'
export { EquipmentDetail } from './EquipmentDetail'

// 알림 관련 컴포넌트
export { AlertCenter } from './AlertCenter'
export { AlertItem } from './AlertItem'
export { AlertDashboard } from './AlertDashboard'

// 대시보드 컴포넌트
export { FacilityDashboard } from './FacilityDashboard'
export { FacilityStats } from './FacilityStats'

// 타입 재export (필요한 경우)
export type {
  // 기본 타입들은 lib/types/facility.ts에서 직접 import 권장
  MaintenanceTask,
  WorkPermit,
  Equipment,
  FacilityAlert,
  FacilityStatistics
} from '@/lib/types/facility'