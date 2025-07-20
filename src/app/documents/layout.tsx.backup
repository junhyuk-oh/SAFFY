import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
            {children}
          </main>
        </div>
      </div>
    </>
  )
}