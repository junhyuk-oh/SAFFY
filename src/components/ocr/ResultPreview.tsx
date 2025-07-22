"use client"

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display'
import { Badge } from '@/components/ui/display'
import { Calendar, User, FileText, Hash } from 'lucide-react'

interface Metadata {
  date?: string
  author?: string
  documentId?: string
  [key: string]: string | undefined
}

interface ResultPreviewProps {
  originalImage: string
  extractedText: string
  detectedType: string
  metadata: Metadata
}

function ResultPreview({
  originalImage,
  extractedText,
  detectedType,
  metadata
}: ResultPreviewProps) {
  const metadataIcons = {
    date: Calendar,
    author: User,
    documentId: Hash
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* 원본 이미지 섹션 */}
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">원본 문서</CardTitle>
          <Badge variant="secondary" className="w-fit">
            <FileText className="w-3 h-3 mr-1" />
            {detectedType}
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 relative overflow-hidden">
          <div className="relative w-full h-full min-h-[400px] bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={originalImage}
              alt="원본 문서"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </CardContent>
      </Card>

      {/* 추출된 텍스트 섹션 */}
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">추출된 텍스트</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {/* 메타데이터 표시 */}
          {Object.keys(metadata).length > 0 && (
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">추출된 메타데이터</h3>
              <div className="space-y-2">
                {Object.entries(metadata).map(([key, value]) => {
                  if (!value) return null
                  const Icon = metadataIcons[key as keyof typeof metadataIcons] || FileText
                  
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800 capitalize">
                        {key === 'date' ? '날짜' : 
                         key === 'author' ? '작성자' :
                         key === 'documentId' ? '문서 ID' : key}:
                      </span>
                      <span className="text-blue-700">{value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 텍스트 내용 */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {extractedText || '텍스트를 추출하는 중...'}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResultPreview