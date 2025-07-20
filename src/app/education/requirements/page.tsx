import RequirementMatrix from '@/components/education/RequirementMatrix'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BackButton } from '@/components/ui/back-button'

export default function RequirementsPage() {
  return (
    <main className="container mx-auto p-6">
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: '홈', href: '/' },
            { label: '교육 관리', href: '/education' },
            { label: '대상자 관리' }
          ]}
          className="mb-4"
        />
        <BackButton href="/education" label="교육 관리로 돌아가기" className="mb-4" />
        <h1 className="text-3xl font-bold">교육 대상자 관리</h1>
        <p className="text-muted-foreground mt-2">
          개인별 교육 이수 현황을 확인하고 관리하세요
        </p>
      </div>
      <RequirementMatrix />
    </main>
  )
}