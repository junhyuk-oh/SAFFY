"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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

  return (
    <>
      {sidebarSections.map((section) => (
        <div key={section.title} className="mb-6">
          <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">{section.title}</div>
          {section.items.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === "/documents" && pathname.startsWith("/documents")) ||
              (item.href === "/education" && pathname.startsWith("/education"))
            const hasSubItems = item.subItems && item.subItems.length > 0
            
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-notion-sm text-sm transition-all duration-200 ${
                    isActive 
                      ? "bg-primary-light text-primary font-medium" 
                      : "text-text-secondary hover:bg-background-hover hover:text-text-primary"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
                
                {hasSubItems && (
                  <div className="ml-8 mt-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-2 px-3 py-2 mb-0.5 rounded-notion-sm text-sm transition-all duration-200 ${
                            isSubActive 
                              ? "bg-primary-light text-primary font-medium" 
                              : "text-text-tertiary hover:bg-background-hover hover:text-text-secondary"
                          }`}
                        >
                          <span className="text-xs">{subItem.icon}</span>
                          <span className="text-xs">{subItem.title}</span>
                        </Link>
                      )
                    })}
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