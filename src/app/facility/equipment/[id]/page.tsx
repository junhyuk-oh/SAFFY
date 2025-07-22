"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EquipmentDetail } from '@/components/facility';
import { Equipment } from '@/lib/types/facility';
import { Breadcrumb } from '@/components/ui/display';
import { AlertTriangle } from 'lucide-react';

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchEquipment(params.id as string);
    }
  }, [params.id]);

  const fetchEquipment = async (id: string) => {
    try {
      const response = await fetch(`/api/facility/equipment/${id}`);
      if (!response.ok) throw new Error('Failed to fetch equipment');
      const data = await response.json();
      setEquipment(data.equipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/facility/equipment/${params.id}/edit`);
  };

  const handleStatusChange = async (status: Equipment['status']) => {
    if (!equipment) return;
    
    try {
      const response = await fetch(`/api/facility/equipment/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update equipment status');
      
      // Update local state
      setEquipment(prev => prev ? { ...prev, status } : null);
      
      alert('장비 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating equipment status:', error);
      alert('상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleMaintenanceRequest = async () => {
    if (!equipment) return;
    
    try {
      const response = await fetch('/api/facility/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId: equipment.id,
          title: `정비 요청 - ${equipment.name}`,
          description: '정기 정비 요청',
          priority: 'medium',
          requestedBy: {
            userId: 'current-user-id',
            name: '현재 사용자',
            department: '시설관리팀',
            contact: '010-1234-5678'
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to create maintenance request');
      
      alert('정비 요청이 생성되었습니다.');
      router.push('/facility/maintenance');
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      alert('정비 요청 생성 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 장비를 삭제하시겠습니까?')) return;
    
    try {
      const response = await fetch(`/api/facility/equipment/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete equipment');
      
      alert('장비가 삭제되었습니다.');
      router.push('/facility/equipment');
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('삭제 중 오류가 발생했습니다.');
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

  if (!equipment) {
    return (
      <div className="p-6 bg-background-primary min-h-screen">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
          <p className="text-text-secondary">장비를 찾을 수 없습니다.</p>
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
          { label: '장비관리', href: '/facility/equipment' },
          { label: equipment.name, href: `/facility/equipment/${equipment.id}` }
        ]} 
      />
      
      <EquipmentDetail 
        equipment={equipment}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onMaintenanceRequest={handleMaintenanceRequest}
        onDelete={handleDelete}
        canEdit={true}
        canRequestMaintenance={true}
      />
    </div>
  );
}