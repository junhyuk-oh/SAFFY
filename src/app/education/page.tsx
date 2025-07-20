import EducationDashboard from '@/components/education/EducationDashboard'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function EducationPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: '홈', href: '/' },
            { label: '교육 관리' }
          ]}
          className="mb-4"
        />
        <h1 className="text-3xl font-bold">안전교육 관리</h1>
        <p className="text-muted-foreground mt-2">
          안전교육 현황을 한눈에 확인하고 관리하세요
        </p>
      </div>
      <EducationDashboard />
    </div>
  )
}