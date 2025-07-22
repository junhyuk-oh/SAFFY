"use client";

import { useRouter } from 'next/navigation';
import { EquipmentGrid } from '@/components/facility';
import { Equipment } from '@/lib/types/facility';
import { Breadcrumb } from '@/components/ui/display';
import { useEquipment, useCreateMaintenanceRequest, useUpdateEquipmentStatus } from '@/hooks/queries';
import { useNotificationStore } from '@/stores/useNotificationStore';

export default function EquipmentPage() {
  const router = useRouter();
  const showNotification = useNotificationStore((state) => state.addNotification);
  
  // React Query 훅 사용
  const { data, isLoading } = useEquipment();
  const createMaintenanceMutation = useCreateMaintenanceRequest();
  const updateStatusMutation = useUpdateEquipmentStatus();
  
  const equipment = data?.equipment || [];

  const handleAddEquipment = () => {
    router.push('/facility/equipment/create');
  };

  const handleMaintenanceRequest = async (id: string) => {
    const targetEquipment = equipment.find(e => e.id === id);
    if (!targetEquipment) return;

    createMaintenanceMutation.mutate({
      equipmentId: id,
      title: `정비 요청 - ${targetEquipment.name}`,
      description: '정기 정비 요청',
      priority: 'medium',
      requestedBy: {
        userId: 'current-user-id',
        name: '현재 사용자',
        department: '시설관리팀',
        contact: '010-1234-5678'
      }
    });
  };

  const handleStatusChange = async (id: string, status: Equipment['status']) => {
    updateStatusMutation.mutate({ id, status });
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
        loading={isLoading}
        onAddEquipment={handleAddEquipment}
        onMaintenanceRequest={handleMaintenanceRequest}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}