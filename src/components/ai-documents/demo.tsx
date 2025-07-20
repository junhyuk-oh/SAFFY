"use client"

import React, { useState, useEffect } from 'react'
import { GenerationProgress, GenerationStep } from './GenerationProgress'
import { DocumentPreview } from './DocumentPreview'

// 데모용 컴포넌트
export const AiDocumentDemo: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: 'analyze', label: '입력 정보 분석', status: 'in-progress', progress: 0 },
    { id: 'generate', label: '내용 생성', status: 'pending' },
    { id: 'review', label: '내용 검토', status: 'pending' },
    { id: 'format', label: '문서 포맷팅', status: 'pending' }
  ])

  // 데모: 진행 상태 시뮬레이션
  useEffect(() => {
    if (!isGenerating) return

    const interval = setInterval(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps]
        const current = newSteps[currentStep]
        
        if (current && current.status === 'in-progress') {
          current.progress = Math.min((current.progress || 0) + 20, 100)
          
          if (current.progress === 100) {
            current.status = 'completed'
            
            if (currentStep < newSteps.length - 1) {
              newSteps[currentStep + 1].status = 'in-progress'
              newSteps[currentStep + 1].progress = 0
              setCurrentStep(currentStep + 1)
            } else {
              setIsGenerating(false)
            }
          }
        }
        
        return newSteps
      })
    }, 500)

    return () => clearInterval(interval)
  }, [currentStep, isGenerating])

  const sampleContent = `
# 월간 안전 점검 보고서

## 1. 점검 개요
본 보고서는 2024년 3월 실험실 안전 점검 결과를 포함합니다.

### 점검 일시
- 날짜: 2024년 3월 15일
- 시간: 14:00 ~ 16:00
- 점검자: 홍길동 안전관리자

## 2. 점검 항목

### 2.1 화학물질 관리
- **시약 보관 상태**: 양호
- **MSDS 비치**: 완료
- **라벨링 상태**: 일부 개선 필요

### 2.2 개인보호구
- 실험복 착용률: 95%
- 보안경 착용률: 88%
- 장갑 착용률: 100%

## 3. 개선 필요 사항
1. 일부 시약병의 라벨이 훼손되어 재부착 필요
2. 비상 샤워기 주변 정리 필요
3. 후드 내부 청소 필요

## 4. 조치 계획
- 3월 20일까지 라벨 재부착 완료
- 3월 22일까지 비상 샤워기 주변 정리
- 3월 25일까지 후드 청소 실시
`

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-8">
          AI 문서 생성 데모
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 진행 상태 컴포넌트 */}
          <div className="bg-white rounded-notion-lg shadow-notion-md p-6">
            <h2 className="text-lg font-semibold mb-6">생성 진행 상태</h2>
            <GenerationProgress
              steps={steps}
              currentStep={currentStep}
            />
          </div>

          {/* 문서 미리보기 컴포넌트 */}
          <div className="bg-white rounded-notion-lg shadow-notion-md overflow-hidden">
            <h2 className="text-lg font-semibold p-6 pb-0">문서 미리보기</h2>
            <div className="h-[600px]">
              {!isGenerating && (
                <DocumentPreview
                  title="월간 안전 점검 보고서"
                  content={sampleContent}
                  documentType="안전 점검 문서"
                  onSave={async (content) => {
                    // 실제 저장 로직
                    console.log('Saving document:', content)
                    await new Promise(resolve => setTimeout(resolve, 1000))
                  }}
                  onDownload={async () => {
                    // 실제 다운로드 로직
                    console.log('Downloading document')
                    await new Promise(resolve => setTimeout(resolve, 500))
                  }}
                  onEdit={() => {
                    console.log('Edit clicked')
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* 사용 예시 코드 */}
        <div className="mt-8 bg-background-secondary rounded-notion-md p-6">
          <h3 className="text-lg font-semibold mb-4">사용 예시</h3>
          <pre className="text-sm bg-white p-4 rounded-notion-sm overflow-x-auto">
{`import { GenerationProgress, DocumentPreview } from '@/components/ai-documents'

// 진행 상태 표시
<GenerationProgress
  steps={[
    { id: 'analyze', label: '분석 중...', status: 'in-progress', progress: 50 },
    { id: 'generate', label: '내용 생성 중...', status: 'pending' }
  ]}
  currentStep={0}
/>

// 문서 미리보기
<DocumentPreview
  title="안전 점검 보고서"
  content={generatedContent}
  documentType="월간 보고서"
  onSave={handleSave}
  onDownload={handleDownload}
  onEdit={handleEdit}
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default AiDocumentDemo