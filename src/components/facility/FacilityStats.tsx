"use client";

import { FacilityStatistics } from '@/lib/types/facility';
import { 
  Wrench, Shield, AlertTriangle, Settings, 
  CheckCircle, Clock, AlertCircle, XCircle,
  TrendingUp, DollarSign, Users, Calendar
} from 'lucide-react';

interface FacilityStatsProps {
  statistics: FacilityStatistics;
}

export function FacilityStats({ statistics }: FacilityStatsProps) {
  const maintenanceCompletionRate = statistics.maintenance.totalTasks > 0 
    ? Math.round((statistics.maintenance.completedThisMonth / statistics.maintenance.totalTasks) * 100)
    : 0;

  const permitApprovalRate = statistics.permits.issuedThisMonth > 0
    ? Math.round(((statistics.permits.issuedThisMonth - statistics.permits.pendingApprovals) / statistics.permits.issuedThisMonth) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Maintenance Stats */}
      <div className="bg-background-secondary rounded-notion-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 rounded-notion-sm">
            <Wrench className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm text-text-secondary">유지보수</span>
        </div>
        <div className="text-2xl font-bold text-text-primary mb-1">
          {statistics.maintenance.totalTasks}건
        </div>
        <div className="text-sm text-text-secondary mb-3">전체 작업</div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">이번달 완료</span>
            <span className="font-medium text-green-600">{statistics.maintenance.completedThisMonth}건</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">지연</span>
            <span className="font-medium text-red-600">{statistics.maintenance.overdue}건</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">예정</span>
            <span className="font-medium text-blue-600">{statistics.maintenance.upcomingTasks}건</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">완료율</span>
            <span className="text-sm font-medium">{maintenanceCompletionRate}%</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${maintenanceCompletionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Work Permits Stats */}
      <div className="bg-background-secondary rounded-notion-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-50 rounded-notion-sm">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm text-text-secondary">작업허가서</span>
        </div>
        <div className="text-2xl font-bold text-text-primary mb-1">
          {statistics.permits.totalActive}건
        </div>
        <div className="text-sm text-text-secondary mb-3">활성 허가서</div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">승인 대기</span>
            <span className="font-medium text-yellow-600">{statistics.permits.pendingApprovals}건</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">이번달 발급</span>
            <span className="font-medium text-green-600">{statistics.permits.issuedThisMonth}건</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">곧 만료</span>
            <span className="font-medium text-orange-600">{statistics.permits.expiringThisWeek}건</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">승인율</span>
            <span className="text-sm font-medium">{permitApprovalRate}%</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${permitApprovalRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alerts Stats */}
      <div className="bg-background-secondary rounded-notion-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-red-50 rounded-notion-sm">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <span className="text-sm text-text-secondary">알림</span>
        </div>
        <div className="text-2xl font-bold text-text-primary mb-1">
          {statistics.alerts.totalActive}건
        </div>
        <div className="text-sm text-text-secondary mb-3">활성 알림</div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">미확인</span>
            <span className="font-medium text-red-600">{statistics.alerts.unacknowledged}건</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">AI 생성</span>
            <span className="font-medium text-blue-600">{statistics.alerts.aiGenerated}건</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">에스컬레이션</span>
            <span className="font-medium text-orange-600">{statistics.alerts.escalated}건</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span className="text-text-secondary">평균 해결시간</span>
            <span className="font-medium">{statistics.alerts.averageResolutionTime}분</span>
          </div>
        </div>
      </div>

      {/* Equipment Stats */}
      <div className="bg-background-secondary rounded-notion-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-50 rounded-notion-sm">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm text-text-secondary">장비</span>
        </div>
        <div className="text-2xl font-bold text-text-primary mb-1">
          {statistics.equipment.totalCount}개
        </div>
        <div className="text-sm text-text-secondary mb-3">전체 장비</div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">정상 운영</span>
            <span className="font-medium text-green-600">{statistics.equipment.byStatus.operational || 0}개</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">점검 필요</span>
            <span className="font-medium text-yellow-600">{statistics.equipment.dueForMaintenance}개</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">서비스 중단</span>
            <span className="font-medium text-red-600">{statistics.equipment.outOfService}개</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">가동률</span>
            <span className="text-sm font-medium text-green-600">{statistics.equipment.averageUptime}%</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${statistics.equipment.averageUptime}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}