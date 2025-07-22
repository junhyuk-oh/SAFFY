"use client"

import { useState } from "react"
import { Button } from "@/components/ui/forms/button"
import { Input } from '@/components/ui/forms'
import { Label } from '@/components/ui/forms'
import { Select } from '@/components/ui/forms'
import { Textarea } from '@/components/ui/forms'
import { Checkbox } from '@/components/ui/forms'
import { Card } from "@/components/ui/display"
import { Badge } from '@/components/ui/display'
import { Progress } from '@/components/ui/feedback'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/display'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/display'
import { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmModal } from '@/components/ui/layout'
import { ToastContainer, useToast } from '@/components/ui/feedback'
import { LoadingSpinner } from "@/components/common"
import { Skeleton, CardSkeleton, LoadingPage } from "@/components/ui/feedback"
import { ErrorMessage, EmptyState } from "@/components/ui/feedback"
import { FormField, FormGroup, FormSection, FormActions, FormHelperText } from '@/components/ui/forms'
import { PageTransition } from '@/components/ui/layout'

export default function UIDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* 헤더 */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">UI 컴포넌트 데모</h1>
            <p className="text-text-secondary">AI Safety SaaS의 모든 UI 컴포넌트를 확인하세요</p>
          </div>

          {/* 색상 팔레트 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">색상 시스템</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="h-24 bg-primary rounded-notion-sm mb-2"></div>
                  <p className="text-sm">Primary</p>
                </div>
                <div>
                  <div className="h-24 bg-success rounded-notion-sm mb-2"></div>
                  <p className="text-sm">Success</p>
                </div>
                <div>
                  <div className="h-24 bg-warning rounded-notion-sm mb-2"></div>
                  <p className="text-sm">Warning</p>
                </div>
                <div>
                  <div className="h-24 bg-error rounded-notion-sm mb-2"></div>
                  <p className="text-sm">Error</p>
                </div>
              </div>
            </div>
          </Card>

          {/* 버튼 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">버튼</h2>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🔔</Button>
              </div>
            </div>
          </Card>

          {/* 폼 요소 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">폼 컴포넌트</h2>
              <FormSection title="기본 정보" description="실험실 기본 정보를 입력하세요">
                <FormGroup>
                  <FormField>
                    <Label htmlFor="lab-name">실험실명</Label>
                    <Input id="lab-name" placeholder="실험실명을 입력하세요" />
                    <FormHelperText>공식 실험실명을 입력해주세요</FormHelperText>
                  </FormField>
                  <FormField>
                    <Label htmlFor="lab-code">실험실 코드</Label>
                    <Input id="lab-code" placeholder="LAB-001" />
                    <ErrorMessage message="이미 사용 중인 코드입니다" />
                  </FormField>
                </FormGroup>
                <FormField>
                  <Label htmlFor="description">설명</Label>
                  <Textarea id="description" placeholder="실험실 설명을 입력하세요" rows={4} />
                </FormField>
                <FormField>
                  <Label htmlFor="category">카테고리</Label>
                  <Select>
                    <option>화학 실험실</option>
                    <option>생물 실험실</option>
                    <option>물리 실험실</option>
                  </Select>
                </FormField>
                <FormField>
                  <div className="flex items-center gap-2">
                    <Checkbox id="active" />
                    <Label htmlFor="active" className="font-normal cursor-pointer">
                      실험실 활성화
                    </Label>
                  </div>
                </FormField>
              </FormSection>
              <FormActions>
                <Button variant="outline">취소</Button>
                <Button>저장</Button>
              </FormActions>
            </div>
          </Card>

          {/* 배지 & 진행바 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">배지 & 진행 표시</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge>기본</Badge>
                  <Badge variant="secondary">보조</Badge>
                  <Badge variant="outline">아웃라인</Badge>
                  <Badge variant="destructive">위험</Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={30} />
                  <Progress value={60} />
                  <Progress value={90} />
                </div>
              </div>
            </div>
          </Card>

          {/* 탭 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">탭</h2>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">개요</TabsTrigger>
                  <TabsTrigger value="details">상세정보</TabsTrigger>
                  <TabsTrigger value="history">이력</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <p className="text-text-secondary">개요 내용이 여기에 표시됩니다.</p>
                </TabsContent>
                <TabsContent value="details" className="mt-4">
                  <p className="text-text-secondary">상세정보 내용이 여기에 표시됩니다.</p>
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <p className="text-text-secondary">이력 내용이 여기에 표시됩니다.</p>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* 테이블 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">테이블</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>문서명</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작성일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024년 1분기 안전점검</TableCell>
                    <TableCell>점검일지</TableCell>
                    <TableCell><Badge>완료</Badge></TableCell>
                    <TableCell>2024-03-15</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>화학물질 위험성평가</TableCell>
                    <TableCell>위험성평가</TableCell>
                    <TableCell><Badge variant="secondary">진행중</Badge></TableCell>
                    <TableCell>2024-03-10</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* 로딩 상태 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">로딩 상태</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <LoadingSpinner size="sm" />
                  <LoadingSpinner size="md" />
                  <LoadingSpinner size="lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <CardSkeleton />
                <Button 
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => setIsLoading(false), 3000)
                  }}
                >
                  로딩 페이지 보기
                </Button>
              </div>
            </div>
          </Card>

          {/* 에러 & 빈 상태 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">에러 & 빈 상태</h2>
              <div className="space-y-6">
                <ErrorMessage message="입력값이 올바르지 않습니다" />
                <EmptyState
                  icon="📁"
                  title="문서가 없습니다"
                  message="새로운 문서를 생성하여 시작하세요"
                  action={{
                    label: "문서 생성",
                    onClick: () => showToast({ type: "info", title: "문서 생성 클릭됨" })
                  }}
                />
              </div>
            </div>
          </Card>

          {/* 모달 & 토스트 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">모달 & 알림</h2>
              <div className="flex gap-3">
                <Button onClick={() => setIsModalOpen(true)}>모달 열기</Button>
                <Button onClick={() => setIsConfirmOpen(true)}>확인 모달</Button>
                <Button 
                  onClick={() => showToast({ 
                    type: "success", 
                    title: "저장 완료", 
                    message: "문서가 성공적으로 저장되었습니다" 
                  })}
                >
                  성공 토스트
                </Button>
                <Button 
                  onClick={() => showToast({ 
                    type: "error", 
                    title: "오류 발생", 
                    message: "문서 저장 중 오류가 발생했습니다" 
                  })}
                >
                  에러 토스트
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 모달 */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalHeader title="문서 정보" onClose={() => setIsModalOpen(false)} />
          <ModalBody>
            <p className="text-text-secondary">
              이것은 모달 예시입니다. 모달은 사용자의 주의가 필요한 중요한 정보나 
              작업을 표시할 때 사용됩니다.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              닫기
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              확인
            </Button>
          </ModalFooter>
        </Modal>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => showToast({ type: "success", title: "삭제되었습니다" })}
          title="문서 삭제"
          message="정말로 이 문서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          type="danger"
          confirmText="삭제"
          cancelText="취소"
        />

        {/* 토스트 컨테이너 */}
        <ToastContainer toasts={toasts} onClose={removeToast} />

        {/* 로딩 페이지 */}
        {isLoading && (
          <div className="fixed inset-0 bg-background z-50">
            <LoadingPage message="데이터를 처리하는 중입니다..." />
          </div>
        )}
      </div>
    </PageTransition>
  )
}