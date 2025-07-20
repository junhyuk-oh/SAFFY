"use client"

export function Header() {
  return (
    <header className="bg-background-secondary border-b border-border sticky top-0 z-[100] shadow-notion-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3 font-semibold text-lg">
          <div className="w-8 h-8 bg-primary rounded-notion-sm flex items-center justify-center text-text-inverse font-bold">S</div>
          <span>SafeLab AI</span>
        </div>
        
        <nav className="hidden md:flex gap-8 items-center">
          <a href="#" className="text-primary text-sm font-medium transition-colors duration-200">대시보드</a>
          <a href="#" className="text-text-secondary text-sm font-medium transition-colors duration-200 hover:text-text-primary">문서관리</a>
          <a href="#" className="text-text-secondary text-sm font-medium transition-colors duration-200 hover:text-text-primary">안전점검</a>
          <a href="#" className="text-text-secondary text-sm font-medium transition-colors duration-200 hover:text-text-primary">교육관리</a>
          <a href="#" className="text-text-secondary text-sm font-medium transition-colors duration-200 hover:text-text-primary">보고서</a>
          <a href="#" className="text-text-secondary text-sm font-medium transition-colors duration-200 hover:text-text-primary">설정</a>
        </nav>
        
        <div className="flex gap-4 items-center">
          <div className="relative w-10 h-10 rounded-notion-sm bg-background-hover flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-background-selected">
            <span className="text-xl">🔔</span>
            <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background-secondary"></div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-background-hover rounded-notion-sm cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-text-inverse font-medium">김</div>
            <span>김안전 관리자</span>
            <span className="text-text-secondary">▼</span>
          </div>
        </div>
      </div>
    </header>
  )
}