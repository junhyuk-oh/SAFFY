"use client"

import React from 'react'
import { Progress } from '@/components/ui/feedback'
import { cn } from '@/lib/utils'

export interface GenerationStep {
  id: string
  label: string
  status: 'pending' | 'in-progress' | 'completed' | 'error'
  progress?: number
}

interface GenerationProgressProps {
  steps: GenerationStep[]
  currentStep: number
  className?: string
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  steps,
  currentStep,
  className
}) => {
  // 전체 진행률 계산
  const totalProgress = Math.round((currentStep / steps.length) * 100)

  return (
    <div className={cn("space-y-6", className)}>
      {/* 전체 진행률 표시 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-text-primary">
            AI 문서 생성 중...
          </h3>
          <span className="text-sm text-text-secondary">{totalProgress}%</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </div>

      {/* 단계별 진행 상태 */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isPending = index > currentStep

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center space-x-3 transition-all duration-300",
                isActive && "animate-pulse"
              )}
            >
              {/* 단계 인디케이터 */}
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                    {
                      "bg-primary text-text-inverse": isCompleted,
                      "bg-primary-light text-primary animate-pulse": isActive,
                      "bg-background-secondary text-text-tertiary": isPending,
                      "bg-error-bg text-error": step.status === 'error'
                    }
                  )}
                >
                  {step.status === 'completed' ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : step.status === 'error' ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : step.status === 'in-progress' ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>

              {/* 단계 정보 */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    {
                      "text-text-primary": isActive || isCompleted,
                      "text-text-tertiary": isPending,
                      "text-error": step.status === 'error'
                    }
                  )}
                >
                  {step.label}
                </p>
                {isActive && step.progress !== undefined && (
                  <div className="mt-1">
                    <Progress value={step.progress} className="h-1" />
                  </div>
                )}
              </div>

              {/* 상태 표시 */}
              {isActive && (
                <div className="flex items-center space-x-1 text-primary">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 현재 단계 설명 */}
      {steps[currentStep] && (
        <div className="mt-4 p-4 bg-background-secondary rounded-notion-md border border-border">
          <p className="text-sm text-text-secondary">
            {getStepDescription(steps[currentStep].id)}
          </p>
        </div>
      )}
    </div>
  )
}

// 단계별 설명 제공
function getStepDescription(stepId: string): string {
  const descriptions: Record<string, string> = {
    'analyze': '입력하신 정보를 분석하고 문서 구조를 설계하고 있습니다...',
    'generate': 'AI가 안전 관련 내용을 생성하고 있습니다. 잠시만 기다려주세요...',
    'review': '생성된 내용의 정확성과 완전성을 검토하고 있습니다...',
    'format': '문서 형식을 정리하고 최종 마무리 작업을 진행하고 있습니다...',
    'complete': '문서 생성이 완료되었습니다!'
  }
  return descriptions[stepId] || '처리 중입니다...'
}

export default GenerationProgress