"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PermitList } from '@/components/facility';
import { WorkPermit } from '@/lib/types/facility';
import { Breadcrumb } from '@/components/ui/display';

export default function PermitsPage() {
  const router = useRouter();
  const [permits, setPermits] = useState<WorkPermit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      const response = await fetch('/api/facility/permits');
      const data = await response.json();
      setPermits(data.permits);
    } catch (error) {
      console.error('Failed to fetch permits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermitClick = (permit: WorkPermit) => {
    router.push(`/facility/permits/${permit.id}`);
  };

  const handleCreateClick = () => {
    router.push('/facility/permits/create');
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
          { label: '작업허가서', href: '/facility/permits' }
        ]} 
      />
      
      <PermitList 
        permits={permits} 
        onPermitClick={handlePermitClick}
        onCreateClick={handleCreateClick}
      />
    </div>
  );
}