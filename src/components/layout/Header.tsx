"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps = {}) {
  const pathname = usePathname()
  return (
    <header className="bg-background-secondary border-b border-border sticky top-0 z-[100] shadow-notion-sm">
      <div className="flex justify-between items-center px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          {/* 모바일 메뉴 버튼 */}
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-notion-sm hover:bg-background-hover transition-all duration-200 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
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
          <button className="relative w-10 h-10 rounded-notion-sm bg-background-hover flex items-center justify-center transition-all duration-200 hover:bg-background-selected active:scale-95">
            <span className="text-xl">🔔</span>
            <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background-secondary"></div>
          </button>
          
          <button className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-background-hover rounded-notion-sm transition-all duration-200 hover:bg-background-selected active:scale-95">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-text-inverse font-medium">김</div>
            <span className="hidden sm:inline">김안전 관리자</span>
            <span className="text-text-secondary text-xs">▼</span>
          </button>
        </div>
      </div>
    </header>
  )
}