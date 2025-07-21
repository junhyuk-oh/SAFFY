"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EquipmentGrid } from '@/components/facility';
import { Equipment } from '@/lib/types/facility';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function EquipmentPage() {
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/facility/equipment');
      const data = await response.json();
      setEquipment(data.equipment);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = () => {
    router.push('/facility/equipment/create');
  };

  const handleMaintenanceRequest = async (id: string) => {
    try {
      const response = await fetch('/api/facility/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId: id,
          title: `정비 요청 - ${equipment.find(e => e.id === id)?.name}`,
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
      // Optionally refresh the equipment list
      fetchEquipment();
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      alert('정비 요청 생성 중 오류가 발생했습니다.');
    }
  };

  const handleStatusChange = async (id: string, status: Equipment['status']) => {
    try {
      const response = await fetch(`/api/facility/equipment/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update equipment status');
      
      // Update local state
      setEquipment(prev => prev.map(eq => 
        eq.id === id ? { ...eq, status } : eq
      ));
      
      alert('장비 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating equipment status:', error);
      alert('상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background-primary min-h-screen">
      <Breadcrumb 
        items={[
          { label: '홈', href: '/' },
          { label: '시설관리', href: '/facility' },
          { label: '장비관리', href: '/facility/equipment' }
        ]} 
      />
      
      <EquipmentGrid 
        equipment={equipment}
        loading={loading}
        onAddEquipment={handleAddEquipment}
        onMaintenanceRequest={handleMaintenanceRequest}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}