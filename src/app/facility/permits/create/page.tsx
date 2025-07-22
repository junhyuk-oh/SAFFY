"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PermitForm } from '@/components/facility/PermitForm';
import { CreateWorkPermitRequest } from '@/lib/types/facility';
import { Breadcrumb } from '@/components/ui/display';

export default function CreatePermitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateWorkPermitRequest) => {
    setLoading(true);
    try {
      const response = await fetch('/api/facility/permits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create permit');
      }

      const result = await response.json();
      
      // Show success message and redirect
      alert('작업허가서가 성공적으로 신청되었습니다.');
      router.push(`/facility/permits/${result.permit.id}`);
    } catch (error) {
      console.error('Error creating permit:', error);
      alert('작업허가서 신청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/facility/permits');
  };

  return (
    <div className="p-6 space-y-6 bg-background-primary min-h-screen">
      <Breadcrumb 
        items={[
          { label: '홈', href: '/' },
          { label: '시설관리', href: '/facility' },
          { label: '작업허가서', href: '/facility/permits' },
          { label: '새 허가서 신청', href: '/facility/permits/create' }
        ]} 
      />
      
      <PermitForm 
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}