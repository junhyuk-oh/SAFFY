"use client"

interface ActionItem {
  id: string
  title: string
  description: string
  icon: string
  onClick?: () => void
}

interface QuickActionsProps {
  actions: ActionItem[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">AI 자동화 작업</h2>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full">
          <span>🤖</span>
          <span>AI 지원</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="p-6 bg-background-secondary rounded-notion-md text-center transition-all duration-200 hover:shadow-notion-md hover:-translate-y-1 hover:bg-primary-light focus:ring-2 focus:ring-primary active:scale-95"
          >
            <div className="text-4xl mb-3">{action.icon}</div>
            <div className="text-sm font-semibold text-text-primary mb-1">{action.title}</div>
            <div className="text-xs text-text-secondary">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}