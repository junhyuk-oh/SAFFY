"use client";

import { useState, useEffect } from 'react';
import { FacilityAlert } from '@/lib/types/facility';
import { 
  Bell, AlertTriangle, CheckCircle, Clock, TrendingUp, 
  Activity, Shield, Settings, Users, BarChart3, 
  AlertCircle, Zap, PieChart, ArrowUp, ArrowDown
} from 'lucide-react';

interface AlertDashboardProps {
  alerts: FacilityAlert[];
  refreshInterval?: number; // in seconds
  onRefresh?: () => void;
}

const severityColors = {
  emergency: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  critical: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  high: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
};

const categoryIcons = {
  safety: Shield,
  equipment: Settings,
  environmental: Activity,
  security: AlertCircle,
  operational: Settings,
  compliance: CheckCircle
} as const;

export function AlertDashboard({ alerts, refreshInterval = 30, onRefresh }: AlertDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh
  useEffect(() => {
    if (onRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        onRefresh();
        setLastRefresh(new Date());
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [onRefresh, refreshInterval]);

  // Calculate statistics
  const calculateStats = () => {
    const now = new Date();
    const timeRanges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    const rangeMs = timeRanges[selectedTimeRange];
    const startTime = new Date(now.getTime() - rangeMs);

    // Filter alerts within time range
    const recentAlerts = alerts.filter(alert => 
      new Date(alert.detectedDate) >= startTime
    );

    // Active alerts
    const activeAlerts = alerts.filter(alert => 
      alert.status === 'active' || alert.status === 'acknowledged'
    );

    // Statistics by severity
    const bySeverity = recentAlerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Statistics by category
    const byCategory = recentAlerts.reduce((acc, alert) => {
      acc[alert.category] = (acc[alert.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Response time statistics
    const resolvedAlerts = recentAlerts.filter(alert => 
      alert.status === 'resolved' && alert.resolvedDate
    );
    
    const responseTimes = resolvedAlerts.map(alert => {
      const detected = new Date(alert.detectedDate);
      const resolved = new Date(alert.resolvedDate!);
      return (resolved.getTime() - detected.getTime()) / (1000 * 60); // in minutes
    });

    const avgResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    const minResponseTime = responseTimes.length > 0
      ? Math.round(Math.min(...responseTimes))
      : 0;

    const maxResponseTime = responseTimes.length > 0
      ? Math.round(Math.max(...responseTimes))
      : 0;

    // Trend calculation (compare with previous period)
    const previousRangeStart = new Date(startTime.getTime() - rangeMs);
    const previousAlerts = alerts.filter(alert => 
      new Date(alert.detectedDate) >= previousRangeStart &&
      new Date(alert.detectedDate) < startTime
    );

    const trend = {
      total: ((recentAlerts.length - previousAlerts.length) / (previousAlerts.length || 1)) * 100,
      critical: ((recentAlerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length -
                 previousAlerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length) /
                 (previousAlerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length || 1)) * 100
    };

    // AI-generated alerts
    const aiAlerts = recentAlerts.filter(alert => alert.source === 'ai_system');
    const aiAccuracy = aiAlerts.filter(alert => 
      alert.status !== 'false_positive'
    ).length / (aiAlerts.length || 1) * 100;

    return {
      total: recentAlerts.length,
      active: activeAlerts.length,
      resolved: resolvedAlerts.length,
      bySeverity,
      byCategory,
      avgResponseTime,
      minResponseTime,
      maxResponseTime,
      trend,
      aiAlerts: aiAlerts.length,
      aiAccuracy
    };
  };

  const stats = calculateStats();

  // Get top affected locations
  const getTopLocations = () => {
    const locationCounts = alerts.reduce((acc, alert) => {
      const key = `${alert.location}${alert.subLocation ? ` - ${alert.subLocation}` : ''}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const topLocations = getTopLocations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Bell className="w-7 h-7" />
            알림 대시보드
          </h2>
          <p className="text-text-secondary mt-1">
            실시간 알림 현황 및 통계
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-text-tertiary">
            마지막 업데이트: {lastRefresh.toLocaleTimeString('ko-KR')}
          </div>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as '24h' | '7d' | '30d')}
            className="px-3 py-1.5 rounded-notion-sm border border-border bg-background text-sm"
          >
            <option value="24h">최근 24시간</option>
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background-secondary rounded-notion-md p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-primary-light rounded-notion-sm">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              stats.trend.total > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {stats.trend.total > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(stats.trend.total).toFixed(1)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
          <div className="text-sm text-text-secondary">총 알림</div>
        </div>

        <div className="bg-background-secondary rounded-notion-md p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-100 rounded-notion-sm">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              stats.trend.critical > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {stats.trend.critical > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(stats.trend.critical).toFixed(1)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.active}</div>
          <div className="text-sm text-text-secondary">활성 알림</div>
        </div>

        <div className="bg-background-secondary rounded-notion-md p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-notion-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-green-600">
              {stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-text-secondary">해결됨</div>
        </div>

        <div className="bg-background-secondary rounded-notion-md p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-100 rounded-notion-sm">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-text-primary">{stats.avgResponseTime}분</div>
          <div className="text-sm text-text-secondary">평균 응답시간</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Severity Distribution */}
        <div className="bg-background-secondary rounded-notion-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-text-secondary" />
            <h3 className="font-semibold text-text-primary">심각도별 분포</h3>
          </div>
          <div className="space-y-3">
            {['emergency', 'critical', 'high', 'medium', 'low'].map(severity => {
              const count = stats.bySeverity[severity] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const config = severityColors[severity as keyof typeof severityColors];
              
              return (
                <div key={severity} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-text-secondary">{severity}</span>
                    <span className="font-medium text-text-primary">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${config.bg}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-background-secondary rounded-notion-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-text-secondary" />
            <h3 className="font-semibold text-text-primary">카테고리별 현황</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.byCategory)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([category, count]) => {
                const Icon = categoryIcons[category] || AlertCircle;
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm text-text-secondary capitalize">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary w-10 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-background-secondary rounded-notion-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-text-secondary" />
            <h3 className="font-semibold text-text-primary">주요 발생 위치</h3>
          </div>
          <div className="space-y-3">
            {topLocations.map(([location, count], index) => (
              <div key={location} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-tertiary">#{index + 1}</span>
                  <span className="text-sm text-text-primary truncate" title={location}>
                    {location}
                  </span>
                </div>
                <span className="text-sm font-medium text-text-primary">{count}건</span>
              </div>
            ))}
            {topLocations.length === 0 && (
              <p className="text-sm text-text-tertiary text-center py-4">
                데이터가 없습니다
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Performance */}
      <div className="bg-background-secondary rounded-notion-md p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text-primary">AI 성능 지표</h3>
          </div>
          <span className="text-sm text-text-secondary">
            AI 생성 알림: {stats.aiAlerts}건
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background rounded-notion-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">정확도</span>
              <span className={`text-sm font-medium ${
                stats.aiAccuracy >= 90 ? 'text-green-600' : 
                stats.aiAccuracy >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stats.aiAccuracy.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  stats.aiAccuracy >= 90 ? 'bg-green-500' : 
                  stats.aiAccuracy >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${stats.aiAccuracy}%` }}
              />
            </div>
          </div>

          <div className="bg-background rounded-notion-sm p-4">
            <div className="text-sm text-text-secondary mb-1">응답 시간</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-text-primary">{stats.minResponseTime}</span>
              <span className="text-sm text-text-tertiary">-</span>
              <span className="text-lg font-bold text-text-primary">{stats.maxResponseTime}</span>
              <span className="text-sm text-text-secondary">분</span>
            </div>
          </div>

          <div className="bg-background rounded-notion-sm p-4">
            <div className="text-sm text-text-secondary mb-1">예측 정확도</div>
            <div className="text-lg font-bold text-primary">
              {stats.aiAlerts > 0 ? 
                `${((stats.aiAlerts - stats.total * 0.1) / stats.aiAlerts * 100).toFixed(1)}%` : 
                'N/A'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-background-secondary rounded-notion-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-text-secondary" />
          <h3 className="font-semibold text-text-primary">실시간 활동</h3>
        </div>
        
        <div className="space-y-3">
          {alerts
            .sort((a, b) => new Date(b.detectedDate).getTime() - new Date(a.detectedDate).getTime())
            .slice(0, 5)
            .map(alert => {
              const config = severityColors[alert.severity];
              const timeDiff = Date.now() - new Date(alert.detectedDate).getTime();
              const minutes = Math.floor(timeDiff / (1000 * 60));
              const hours = Math.floor(minutes / 60);
              const timeAgo = hours > 0 ? `${hours}시간 전` : `${minutes}분 전`;
              
              return (
                <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-notion-sm border ${config.border} ${config.bg}`}>
                  <AlertTriangle className={`w-4 h-4 ${config.text}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${config.text}`}>{alert.title}</p>
                    <p className="text-xs text-text-secondary">
                      {alert.location} • {timeAgo}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.text} border ${config.border}`}>
                    {alert.status}
                  </span>
                </div>
              );
            })}
          
          {alerts.length === 0 && (
            <p className="text-sm text-text-tertiary text-center py-4">
              최근 활동이 없습니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}