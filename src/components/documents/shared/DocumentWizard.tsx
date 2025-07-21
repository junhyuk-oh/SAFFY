"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface WizardStep {
  id: string
  title: string
  description: string
  icon: string
}

interface DocumentWizardProps {
  onComplete: () => void
}

const wizardSteps: WizardStep[] = [
  {
    id: "type",
    title: "문서 타입 선택",
    description: "생성할 문서의 타입을 선택하세요",
    icon: "📄"
  },
  {
    id: "info",
    title: "기본 정보 입력",
    description: "문서의 기본 정보를 입력하세요",
    icon: "✏️"
  },
  {
    id: "details",
    title: "상세 내용 입력",
    description: "문서의 상세 내용을 입력하세요",
    icon: "📝"
  },
  {
    id: "review",
    title: "검토 및 생성",
    description: "입력한 내용을 확인하고 문서를 생성합니다",
    icon: "✅"
  }
]

const documentTypes = [
  { id: "risk-assessment", name: "위험성평가서", icon: "⚠️", description: "실험실 위험 요소 분석 및 평가" },
  { id: "jha", name: "작업위험성평가", icon: "🔍", description: "특정 작업의 위험성 분석" },
  { id: "experiment-plan", name: "실험계획서", icon: "📝", description: "실험 계획 및 안전 수칙" },
  { id: "education-log", name: "교육일지", icon: "🎓", description: "안전 교육 기록 및 관리" },
  { id: "inspection-log", name: "점검일지", icon: "✅", description: "정기 점검 기록" },
  { id: "accident-report", name: "사고보고서", icon: "🚨", description: "사고 발생 및 대응 기록" }
]

export function DocumentWizard({ onComplete }: DocumentWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<{
    type: string;
    title: string;
    description: string;
    author: string;
    department: string;
    tags: string[];
    details: Record<string, unknown>;
  }>({
    type: "",
    title: "",
    description: "",
    author: "",
    department: "",
    tags: [],
    details: {}
  })

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
    router.push("/documents")
  }

  const updateFormData = (field: string, value: string | string[] | Record<string, unknown>) => {
    setFormData({ ...formData, [field]: value })
  }

  const renderStepContent = () => {
    switch (wizardSteps[currentStep].id) {
      case "type":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => updateFormData("type", type.id)}
                className={`p-4 border rounded-notion-md cursor-pointer transition-all duration-200 ${
                  formData.type === type.id
                    ? "border-primary bg-primary-light"
                    : "border-border hover:border-border-hover hover:shadow-notion-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary">{type.name}</h3>
                    <p className="text-sm text-text-secondary mt-1">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case "info":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                문서 제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                placeholder="문서 제목을 입력하세요"
                className="w-full px-4 py-2.5 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="문서에 대한 간단한 설명을 입력하세요"
                rows={3}
                className="w-full px-4 py-2.5 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  작성자
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => updateFormData("author", e.target.value)}
                  placeholder="작성자 이름"
                  className="w-full px-4 py-2.5 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  부서/팀
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => updateFormData("department", e.target.value)}
                  placeholder="소속 부서 또는 팀"
                  className="w-full px-4 py-2.5 bg-background rounded-notion-sm border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )

      case "details":
        return (
          <div className="bg-background-hover rounded-notion-md p-6">
            <div className="text-center py-8">
              <span className="text-4xl mb-3 block">🤖</span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                AI가 내용을 자동으로 생성합니다
              </h3>
              <p className="text-sm text-text-secondary">
                입력하신 정보를 바탕으로 AI가 문서 내용을 자동으로 생성합니다.
              </p>
            </div>
          </div>
        )

      case "review":
        return (
          <div className="space-y-4">
            <div className="bg-success-bg border border-success text-success-text rounded-notion-md p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">✅</span>
                <div>
                  <h4 className="font-semibold">문서 생성 준비 완료</h4>
                  <p className="text-sm mt-1">입력하신 정보를 확인하고 문서를 생성하세요.</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-notion-md p-4 border border-border">
              <h4 className="font-semibold text-text-primary mb-3">문서 정보 요약</h4>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="text-sm text-text-secondary w-24">문서 타입:</dt>
                  <dd className="text-sm text-text-primary">
                    {documentTypes.find(t => t.id === formData.type)?.name || "-"}
                  </dd>
                </div>
                <div className="flex">
                  <dt className="text-sm text-text-secondary w-24">제목:</dt>
                  <dd className="text-sm text-text-primary">{formData.title || "-"}</dd>
                </div>
                <div className="flex">
                  <dt className="text-sm text-text-secondary w-24">작성자:</dt>
                  <dd className="text-sm text-text-primary">{formData.author || "-"}</dd>
                </div>
                <div className="flex">
                  <dt className="text-sm text-text-secondary w-24">부서:</dt>
                  <dd className="text-sm text-text-primary">{formData.department || "-"}</dd>
                </div>
              </dl>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {wizardSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index <= currentStep
                    ? "bg-primary text-text-inverse"
                    : "bg-background-hover text-text-tertiary"
                }`}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>
              {index < wizardSteps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-2 transition-colors ${
                    index < currentStep ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary">
            {wizardSteps[currentStep].title}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {wizardSteps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-background-secondary rounded-notion-lg p-6 border border-border mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-2.5 bg-background rounded-notion-sm border border-border hover:bg-background-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === 0 && !formData.type}
          className="px-6 py-2.5 bg-primary text-text-inverse rounded-notion-sm hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === wizardSteps.length - 1 ? "생성하기" : "다음"}
        </button>
      </div>
    </div>
  )
}