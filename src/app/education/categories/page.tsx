import CategoryManager from '@/components/education/CategoryManager'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BackButton } from '@/components/ui/back-button'

export default function CategoriesPage() {
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
                  { label: '교육 관리', href: '/education' },
                  { label: '카테고리 관리' }
                ]}
                className="mb-4"
              />
              <BackButton href="/education" label="교육 관리로 돌아가기" className="mb-4" />
              <h1 className="text-3xl font-bold">교육 카테고리 관리</h1>
              <p className="text-muted-foreground mt-2">
                교육 카테고리를 생성하고 관리하세요
              </p>
            </div>
            <CategoryManager />
          </main>
        </div>
      </div>
    </>
  )
}