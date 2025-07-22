"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { QueryProvider } from "@/lib/react-query/providers"

interface LayoutClientProps {
  children: React.ReactNode
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col">
        <Header onMenuToggle={toggleMobileMenu} />
        
        <div className="flex flex-1 relative">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 bg-background-secondary border-r border-border">
            <div className="sticky top-[73px] p-4 h-[calc(100vh-73px)] overflow-y-auto">
              <Sidebar />
            </div>
          </aside>
          
          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {/* Mobile Sidebar */}
          <aside 
            className={`lg:hidden fixed left-0 top-[73px] bottom-0 w-64 bg-background-secondary border-r border-border z-50 transition-transform duration-300 transform ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4 h-full overflow-y-auto">
              <Sidebar />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden">
            <div className="min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </QueryProvider>
  )
}