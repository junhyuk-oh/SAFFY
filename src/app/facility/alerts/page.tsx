"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCenter, AlertDashboard } from '@/components/facility';
import { FacilityAlert } from '@/lib/types/facility';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<FacilityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/facility/alerts');
      const data = await response.json();
      setAlerts(data.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string, notes?: string) => {
    try {
      const response = await fetch(`/api/facility/alerts/${id}/acknowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acknowledgedBy: {
            userId: 'current-user-id',
            name: '현재 사용자',
            department: '시설관리팀'
          },
          notes
        }),
      });

      if (!response.ok) throw new Error('Failed to acknowledge alert');
      
      // Update local state
      setAlerts(prev => prev.map(alert => 
        alert.id === id 
          ? { 
              ...alert, 
              status: 'acknowledged' as const,
              acknowledgedDate: new Date().toISOString(),
              acknowledgedBy: {
                userId: 'current-user-id',
                name: '현재 사용자',
                department: '시설관리팀'
              }
            } 
          : alert
      ));
      
      alert('알림이 확인되었습니다.');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      alert('알림 확인 중 오류가 발생했습니다.');
    }
  };

  const handleResolve = async (id: string, resolution: string, actionsTaken: string[]) => {
    try {
      const response = await fetch(`/api/facility/alerts/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolvedBy: {
            userId: 'current-user-id',
            name: '현재 사용자',
            department: '시설관리팀'
          },
          resolution,
          actionsTaken
        }),
      });

      if (!response.ok) throw new Error('Failed to resolve alert');
      
      // Update local state
      setAlerts(prev => prev.map(alert => 
        alert.id === id 
          ? { 
              ...alert, 
              status: 'resolved' as const,
              resolvedDate: new Date().toISOString(),
              resolvedBy: {
                userId: 'current-user-id',
                name: '현재 사용자',
                department: '시설관리팀'
              },
              resolution: {
                description: resolution,
                actionsTaken,
                rootCause: '',
                preventiveMeasures: []
              }
            } 
          : alert
      ));
      
      alert('알림이 해결되었습니다.');
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('알림 해결 중 오류가 발생했습니다.');
    }
  };

  const handleEscalate = async (id: string) => {
    try {
      const response = await fetch(`/api/facility/alerts/${id}/escalate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          escalatedBy: {
            userId: 'current-user-id',
            name: '현재 사용자',
            department: '시설관리팀'
          },
          reason: '긴급 대응 필요'
        }),
      });

      if (!response.ok) throw new Error('Failed to escalate alert');
      
      // Update local state
      setAlerts(prev => prev.map(alert => 
        alert.id === id 
          ? { ...alert, status: 'escalated' as const } 
          : alert
      ));
      
      alert('알림이 상급 보고되었습니다.');
    } catch (error) {
      console.error('Error escalating alert:', error);
      alert('상급 보고 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-background-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background-primary min-h-screen">
      <Breadcrumb 
        items={[
          { label: '홈', href: '/' },
          { label: '시설관리', href: '/facility' },
          { label: '알림센터', href: '/facility/alerts' }
        ]} 
      />
      
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">알림센터</h1>
        <div className="flex items-center gap-2 bg-background-secondary rounded-notion-sm p-1">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-2 rounded-notion-sm transition-colors ${
              viewMode === 'dashboard'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-background-hover'
            }`}
          >
            대시보드
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-notion-sm transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-background-hover'
            }`}
          >
            목록 보기
          </button>
        </div>
      </div>
      
      {viewMode === 'dashboard' ? (
        <AlertDashboard 
          alerts={alerts}
          refreshInterval={30}
          onRefresh={fetchAlerts}
        />
      ) : (
        <AlertCenter 
          alerts={alerts}
          loading={loading}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          onEscalate={handleEscalate}
          canAcknowledge={true}
          canResolve={true}
          canEscalate={true}
          showBulkActions={true}
        />
      )}
    </div>
  );
}