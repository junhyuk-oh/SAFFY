"use client"

import { useState } from 'react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BackButton } from '@/components/ui/back-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CertificateUploader from '@/components/education/CertificateUploader'
import EducationStats from '@/components/education/EducationStats'

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState('certificates')

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: '홈', href: '/' },
            { label: '교육 관리', href: '/education' },
            { label: '이수 기록' }
          ]}
          className="mb-4"
        />
        <BackButton href="/education" label="교육 관리로 돌아가기" className="mb-4" />
        <h1 className="text-3xl font-bold">교육 이수 기록</h1>
        <p className="text-muted-foreground mt-2">
          교육 수료증을 관리하고 통계를 확인하세요
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="certificates">수료증 관리</TabsTrigger>
          <TabsTrigger value="stats">통계 분석</TabsTrigger>
        </TabsList>
        
        <TabsContent value="certificates" className="mt-6">
          <CertificateUploader />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <EducationStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}