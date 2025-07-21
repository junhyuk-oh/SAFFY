"use client";

import { useEffect, useState } from 'react';
import { FacilityStatistics } from '@/lib/types/facility';
import { 
  Wrench, Shield, AlertTriangle, Settings, 
  TrendingUp, TrendingDown, Activity, Users,
  CheckCircle, Clock, AlertCircle, XCircle
} from 'lucide-react';
import { FacilityStats } from './FacilityStats';

export function FacilityDashboard() {
  const [stats, setStats] = useState<FacilityStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/facility/statistics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">통계를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const healthScoreColor = stats.overall.facilityHealthScore >= 80 ? 'text-green-600' : 
                          stats.overall.facilityHealthScore >= 60 ? 'text-yellow-600' : 'text-red-600';

  const riskLevelConfig = {
    low: { color: 'text-green-600', bg: 'bg-green-50', label: '낮음' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', label: '중간' },
    high: { color: 'text-orange-600', bg: 'bg-orange-50', label: '높음' },
    critical: { color: 'text-red-600', bg: 'bg-red-50', label: '위험' }
  };

  const riskLevel = riskLevelConfig[stats.overall.riskLevel];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">시설관리 대시보드</h1>
        <p className="text-text-secondary">실시간 시설 현황 및 성과 지표</p>
      </div>

      {/* Overall Health Score */}
      <div className="bg-background-secondary rounded-notion-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-5xl font-bold ${healthScoreColor}`}>
              {stats.overall.facilityHealthScore}%
            </div>
            <div className="text-text-secondary mt-2">시설 건강도</div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskLevel.bg} ${riskLevel.color}`}>
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">위험도: {riskLevel.label}</span>
            </div>
            <div className="text-text-secondary mt-2">전체 위험 수준</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">
              {stats.overall.complianceScore}%
            </div>
            <div className="text-text-secondary mt-2">규정 준수율</div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <FacilityStats statistics={stats} />

      {/* Active Alerts Summary */}
      <div className="bg-background-secondary rounded-notion-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-warning" />
          활성 알림 현황
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.alerts.bySeverity.emergency || 0}</div>
            <div className="text-sm text-text-secondary">긴급</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.alerts.bySeverity.critical || 0}</div>
            <div className="text-sm text-text-secondary">위험</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.alerts.bySeverity.high || 0}</div>
            <div className="text-sm text-text-secondary">높음</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.alerts.bySeverity.medium || 0}</div>
            <div className="text-sm text-text-secondary">중간</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.alerts.bySeverity.low || 0}</div>
            <div className="text-sm text-text-secondary">낮음</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Trends */}
        <div className="bg-background-secondary rounded-notion-md p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">유지보수 추세</h3>
          <div className="space-y-3">
            {stats.overall.monthlyTrends.maintenance.map(trend => (
              <div key={trend.month} className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{trend.month}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{trend.completed}건 완료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm">{trend.overdue}건 지연</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Status Distribution */}
        <div className="bg-background-secondary rounded-notion-md p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">장비 상태 분포</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">정상 운영</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(stats.equipment.byStatus.operational / stats.equipment.totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.equipment.byStatus.operational || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">유지보수 중</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${(stats.equipment.byStatus.maintenance / stats.equipment.totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.equipment.byStatus.maintenance || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">수리 중</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${(stats.equipment.byStatus.repair / stats.equipment.totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.equipment.byStatus.repair || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">서비스 중단</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${(stats.equipment.byStatus.out_of_service / stats.equipment.totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.equipment.byStatus.out_of_service || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}