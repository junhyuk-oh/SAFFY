import { FacilityDashboard } from '@/components/facility';
import { Breadcrumb } from '@/components/ui/display';

export default function FacilityPage() {
  return (
    <div className="p-6 space-y-6 bg-background-primary min-h-screen">
      <Breadcrumb 
        items={[
          { label: '홈', href: '/' },
          { label: '시설관리', href: '/facility' }
        ]} 
      />
      
      <FacilityDashboard />
    </div>
  );
}