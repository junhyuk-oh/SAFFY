"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppStore, useAuthStore, useNotificationStore } from "@/stores"
import { Bell, Moon, Sun, Menu, LogOut, User } from "lucide-react"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme, toggleSidebar, breakpoint } = useAppStore()
  const { user, logout } = useAuthStore()
  const { unreadCount, setVisibility } = useNotificationStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  return (
    <header className="bg-background-secondary border-b border-border sticky top-0 z-[100] shadow-notion-sm">
      <div className="flex justify-between items-center px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          {/* 사이드바 토글 버튼 */}
          {breakpoint !== 'mobile' && (
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-notion-sm hover:bg-background-hover transition-all duration-200 active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <Link href="/" className="flex items-center gap-3 font-semibold text-lg">
            <div className="w-8 h-8 bg-primary rounded-notion-sm flex items-center justify-center text-text-inverse font-bold">S</div>
            <span className="hidden sm:inline">SafeLab AI</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex gap-8 items-center">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname === "/" ? "text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            대시보드
          </Link>
          <Link 
            href="/documents" 
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname.startsWith("/documents") ? "text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            문서관리
          </Link>
          <Link 
            href="/safety-check" 
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname.startsWith("/safety-check") ? "text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            안전점검
          </Link>
          <Link 
            href="/education" 
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname.startsWith("/education") ? "text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            교육관리
          </Link>
          <Link 
            href="/reports" 
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname.startsWith("/reports") ? "text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            보고서
          </Link>
          <Link 
            href="/settings" 
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname.startsWith("/settings") ? "text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            설정
          </Link>
        </nav>
        
        <div className="flex gap-2 md:gap-4 items-center">
          {/* 테마 토글 */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-notion-sm bg-background-hover flex items-center justify-center transition-all duration-200 hover:bg-background-selected active:scale-95"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* 알림 버튼 */}
          <button 
            onClick={() => setVisibility(true)}
            className="relative w-10 h-10 rounded-notion-sm bg-background-hover flex items-center justify-center transition-all duration-200 hover:bg-background-selected active:scale-95"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <div className="absolute top-2 right-2 min-w-[16px] h-4 px-1 bg-error rounded-full border-2 border-background-secondary flex items-center justify-center">
                <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </div>
            )}
          </button>
          
          {/* 사용자 메뉴 */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-background-hover rounded-notion-sm transition-all duration-200 hover:bg-background-selected active:scale-95"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-text-inverse font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:inline">{user?.name || '사용자'}</span>
              <span className="text-text-secondary text-xs">▼</span>
            </button>

            {/* 드롭다운 메뉴 */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-background rounded-notion-md shadow-lg border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                </div>
                <Link 
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background-hover"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  프로필
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setShowUserMenu(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background-hover w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}