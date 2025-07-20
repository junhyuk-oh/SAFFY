"use client"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "positive" | "negative" | "neutral"
  }
  icon: string
  progress?: number
  aiLabel?: string
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  progress,
  aiLabel 
}: StatsCardProps) {
  return (
    <div className="bg-background-secondary rounded-notion-md p-5 transition-all duration-200 hover:shadow-notion-md hover:-translate-y-0.5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-text-secondary text-sm font-medium mb-2">{title}</div>
          <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              change.type === "positive" ? "text-success" : 
              change.type === "negative" ? "text-warning" : 
              "text-text-secondary"
            }`}>
              <span>
                {change.type === "positive" && "↑"}
                {change.type === "negative" && "!"}
                {change.type === "neutral" && "✓"}
              </span>
              <span>{change.value}</span>
            </div>
          )}
        </div>
        <div className="text-3xl p-3 bg-background-hover rounded-notion-sm">{icon}</div>
      </div>

      {progress !== undefined && (
        <div className="w-full h-2 bg-background-hover rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {aiLabel && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full">
          <span>⚡</span>
          <span>{aiLabel}</span>
        </div>
      )}
    </div>
  )
}