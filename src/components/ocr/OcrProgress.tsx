"use client"

import React, { useEffect, useState } from 'react'

interface OcrProgressProps {
  progress: number
  currentStep: 'uploading' | 'extracting' | 'analyzing' | 'complete'
  startTime?: Date
}

const steps = {
  uploading: { label: '파일 업로드 중...', value: 25 },
  extracting: { label: '텍스트 추출 중...', value: 50 },
  analyzing: { label: '문서 분석 중...', value: 75 },
  complete: { label: '완료!', value: 100 }
}

export function OcrProgress({ progress, currentStep, startTime }: OcrProgressProps) {
  const currentStepInfo = steps[currentStep]
  const [estimatedTime, setEstimatedTime] = useState<string>('')

  useEffect(() => {
    if (startTime && progress > 0 && progress < 100) {
      const elapsedTime = Date.now() - startTime.getTime()
      const estimatedTotal = (elapsedTime / progress) * 100
      const remainingTime = estimatedTotal - elapsedTime
      
      if (remainingTime > 0) {
        const seconds = Math.ceil(remainingTime / 1000)
        if (seconds < 60) {
          setEstimatedTime(`약 ${seconds}초`)
        } else {
          const minutes = Math.ceil(seconds / 60)
          setEstimatedTime(`약 ${minutes}분`)
        }
      }
    } else if (progress === 100) {
      setEstimatedTime('')
    }
  }, [progress, startTime])

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* 현재 단계 표시 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {currentStepInfo.label}
          </h3>
          {estimatedTime && (
            <p className="text-sm text-gray-500 mt-1">{estimatedTime}</p>
          )}
        </div>
        <span className="text-sm font-medium text-gray-600">
          {progress}%
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>

      {/* 단계별 인디케이터 */}
      <div className="flex justify-between mt-6">
        {Object.entries(steps).map(([key, step], index) => {
          const isActive = key === currentStep
          const isCompleted = step.value <= progress
          
          return (
            <div
              key={key}
              className="flex flex-col items-center"
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 transform
                  ${isCompleted 
                    ? 'bg-blue-500 text-white scale-110' 
                    : 'bg-gray-300 text-gray-600 scale-100'
                  }
                  ${isActive && 'animate-bounce'}
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center max-w-[80px]
                  ${isActive ? 'text-blue-600' : 'text-gray-500'}
                `}
              >
                {step.label.replace('...', '').replace('!', '')}
              </span>
            </div>
          )
        })}
      </div>

      {/* 로딩 애니메이션 */}
      {currentStep !== 'complete' && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 완료 메시지 */}
      {currentStep === 'complete' && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-green-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-green-700 font-medium">
              OCR 처리가 완료되었습니다!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default OcrProgress