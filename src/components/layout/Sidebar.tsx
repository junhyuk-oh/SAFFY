"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface SidebarItem {
  title: string
  href: string
  icon: string
  subItems?: SidebarItem[]
}

interface SidebarSection {
  title: string
  items: SidebarItem[]
}

const sidebarSections: SidebarSection[] = [
  {
    title: "빠른 접근",
    items: [
      { title: "종합 대시보드", href: "/", icon: "📊" },
      { title: "문서 관리", href: "/documents", icon: "📁" },
      { title: "AI 문서 생성", href: "/ai-documents", icon: "⚡" },
      { title: "OCR 문서 스캔", href: "/ocr-scan", icon: "📸" },
      { title: "일정 관리", href: "/schedule", icon: "📅" },
    ]
  },
  {
    title: "문서 카테고리",
    items: [
      { title: "위험성평가", href: "/risk-assessment", icon: "⚠️" },
      { title: "작업위험성평가", href: "/jha", icon: "🔍" },
      { title: "실험계획서", href: "/experiment-plan", icon: "📝" },
      { 
        title: "안전교육 관리", 
        href: "/education", 
        icon: "🎓",
        subItems: [
          { title: "대시보드", href: "/education", icon: "📊" },
          { title: "카테고리 관리", href: "/education/categories", icon: "📚" },
          { title: "대상자 관리", href: "/education/requirements", icon: "👥" },
          { title: "이수 기록", href: "/education/records", icon: "✅" },
        ]
      },
    ]
  },
  {
    title: "법령 준수",
    items: [
      { title: "중대재해처벌법", href: "/serious-accident", icon: "⚖️" },
      { title: "연구실안전법", href: "/lab-safety", icon: "🏛️" },
      { title: "화학물질관리법", href: "/chemical-management", icon: "🧪" },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // 현재 경로에 해당하는 메뉴를 자동으로 펼치기
  useEffect(() => {
    const menuItemsWithSubs = sidebarSections.flatMap(section => 
      section.items.filter(item => item.subItems && item.subItems.length > 0)
    )
    
    menuItemsWithSubs.forEach(item => {
      if (item.subItems?.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/'))) {
        setExpandedMenus(prev => {
          if (!prev.includes(item.href)) {
            return [...prev, item.href]
          }
          return prev
        })
      }
    })
  }, [pathname])

  const toggleMenu = (href: string) => {
    setExpandedMenus(prev => 
      prev.includes(href) 
        ? prev.filter(h => h !== href)
        : [...prev, href]
    )
  }

  // 경로 매칭 헬퍼 함수
  const isPathActive = (itemHref: string): boolean => {
    if (itemHref === '/') {
      return pathname === '/'
    }
    return pathname === itemHref || pathname.startsWith(itemHref + '/')
  }

  return (
    <>
      {sidebarSections.map((section) => (
        <div key={section.title} className="mb-6">
          <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">{section.title}</div>
          {section.items.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = expandedMenus.includes(item.href)
            
            // 메인 메뉴가 정확히 활성화되어 있는지 확인
            const isMainActive = isPathActive(item.href) && (!hasSubItems || pathname === item.href)
            
            // 서브메뉴 중 하나가 활성화되어 있는지 확인
            const isSubMenuActive = hasSubItems && item.subItems.some(sub => isPathActive(sub.href))
            
            // 전체적으로 활성화 상태인지
            const isActive = isMainActive || isSubMenuActive
            
            return (
              <div key={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-notion-sm text-sm transition-all duration-200 cursor-pointer relative ${
                    isActive 
                      ? "bg-primary-light text-primary font-medium" 
                      : "text-text-secondary hover:bg-background-hover hover:text-text-primary"
                  }`}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.href)
                    }
                  }}
                >
                  {/* 활성 상태 인디케이터 */}
                  {isMainActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                  
                  <span className={`text-base transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  
                  <Link 
                    href={item.href} 
                    className="flex-1"
                    onClick={(e) => {
                      if (hasSubItems) {
                        e.stopPropagation()
                      }
                    }}
                  >
                    {item.title}
                  </Link>
                  
                  {hasSubItems && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
                
                {hasSubItems && (
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? "max-h-64" : "max-h-0"
                    }`}
                  >
                    <div className="ml-7 mt-1 pb-1 border-l-2 border-background-hover">
                      {item.subItems.map((subItem) => {
                        const isSubActive = isPathActive(subItem.href)
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center gap-2 px-3 py-2 mb-0.5 ml-3 rounded-notion-sm text-sm transition-all duration-200 relative group ${
                              isSubActive 
                                ? "bg-primary-light text-primary font-medium" 
                                : "text-text-tertiary hover:bg-background-hover hover:text-text-secondary"
                            }`}
                          >
                            {/* 서브메뉴 활성 인디케이터 */}
                            <div className={`absolute -left-[14px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-200 ${
                              isSubActive 
                                ? "bg-primary scale-100" 
                                : "bg-text-tertiary scale-0 group-hover:scale-75"
                            }`} />
                            
                            <span className={`text-xs transition-transform duration-200 ${isSubActive ? 'scale-110' : ''}`}>
                              {subItem.icon}
                            </span>
                            <span className="text-xs">{subItem.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}