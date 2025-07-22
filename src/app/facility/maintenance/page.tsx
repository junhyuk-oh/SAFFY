"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaintenanceList } from '@/components/facility';
import { MaintenanceTask } from '@/lib/types/facility';
import { Breadcrumb } from '@/components/ui/display';

export default function MaintenancePage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceTasks();
  }, []);

  const fetchMaintenanceTasks = async () => {
    try {
      const response = await fetch('/api/facility/maintenance');
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to fetch maintenance tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: MaintenanceTask) => {
    router.push(`/facility/maintenance/${task.id}`);
  };

  const handleCreateClick = () => {
    // TODO: Implement create modal or navigate to create page
    console.log('Create new maintenance task');
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
          { label: '유지보수', href: '/facility/maintenance' }
        ]} 
      />
      
      <MaintenanceList 
        tasks={tasks} 
        onTaskClick={handleTaskClick}
        onCreateClick={handleCreateClick}
      />
    </div>
  );
}