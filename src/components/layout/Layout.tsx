/**
 * 메인 레이아웃 컴포넌트
 * 헤더, 사이드바, 컨텐츠 영역을 포함하는 레이아웃
 */

"use client"

import { useEffect } from 'react';
import { useAppStore, initializeStores } from '@/stores';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { NotificationContainer } from '@/components/common/NotificationContainer';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen, setSidebarOpen, breakpoint, isInitialized } = useAppStore();

  // 앱 초기화
  useEffect(() => {
    if (!isInitialized) {
      initializeStores();
    }
  }, [isInitialized]);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <Header />
      
      {/* 메인 컨텐츠 영역 */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* 사이드바 토글 버튼 (모바일) */}
        {breakpoint === 'mobile' && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-4 left-4 z-40 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        {/* 사이드바 */}
        <aside className={`
          ${breakpoint === 'mobile' ? '' : 'w-64 border-r border-border'}
          ${sidebarOpen || breakpoint !== 'mobile' ? 'block' : 'hidden'}
        `}>
          <Sidebar />
        </aside>
        
        {/* 메인 컨텐츠 */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* 알림 컨테이너 */}
      <NotificationContainer />
    </div>
  );
}