import EducationDashboard from '@/components/education/EducationDashboard'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function EducationPage() {
  return (
    <>
      <Header />
      
      <div className="max-w-[1400px] mx-auto p-5">
        <div className="flex gap-6 mt-6">
          {/* Sidebar */}
          <aside className="w-60 bg-background-secondary rounded-notion-md p-4 h-fit sticky top-24">
            <Sidebar />
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
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
          </main>
        </div>
      </div>
    </>
  )
}