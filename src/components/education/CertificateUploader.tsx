"use client"

import { useState, useRef, DragEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/display'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/forms'
import { Label } from '@/components/ui/forms'
import { Badge } from '@/components/ui/display'
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Trash2
} from 'lucide-react'

interface Certificate {
  id: string
  fileName: string
  fileSize: number
  uploadDate: string
  personName: string
  educationName: string
  educationDate: string
  status: 'pending' | 'verified' | 'rejected'
  rejectionReason?: string
}

export default function CertificateUploader() {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      fileName: '김연구_정기안전교육_수료증.pdf',
      fileSize: 1024000,
      uploadDate: '2024-03-10',
      personName: '김연구',
      educationName: '2024년 1분기 정기안전교육',
      educationDate: '2024-03-08',
      status: 'verified'
    },
    {
      id: '2',
      fileName: '이실험_특별안전교육.pdf',
      fileSize: 2048000,
      uploadDate: '2024-03-09',
      personName: '이실험',
      educationName: '화학물질 취급 안전교육',
      educationDate: '2024-03-05',
      status: 'pending'
    },
    {
      id: '3',
      fileName: '박안전_신규자교육.jpg',
      fileSize: 512000,
      uploadDate: '2024-03-07',
      personName: '박안전',
      educationName: '신규자 안전교육',
      educationDate: '2024-03-01',
      status: 'rejected',
      rejectionReason: '이미지가 흐려서 내용 확인 불가'
    }
  ])

  const [isDragging, setIsDragging] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    personName: '',
    educationName: '',
    educationDate: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        const newCertificate: Certificate = {
          id: Date.now().toString(),
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          personName: uploadForm.personName || '미지정',
          educationName: uploadForm.educationName || '미지정',
          educationDate: uploadForm.educationDate || new Date().toISOString().split('T')[0],
          status: 'pending'
        }
        setCertificates(prev => [...prev, newCertificate])
      } else {
        alert('PDF 또는 이미지 파일만 업로드 가능합니다.')
      }
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500">확인완료</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500">검토중</Badge>
      case 'rejected':
        return <Badge className="bg-red-500">반려</Badge>
      default:
        return null
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('이 수료증을 삭제하시겠습니까?')) {
      setCertificates(certificates.filter(cert => cert.id !== id))
    }
  }

  const handleVerify = (id: string) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? { ...cert, status: 'verified' } : cert
    ))
  }

  const handleReject = (id: string) => {
    const reason = prompt('반려 사유를 입력하세요:')
    if (reason) {
      setCertificates(certificates.map(cert => 
        cert.id === id ? { ...cert, status: 'rejected', rejectionReason: reason } : cert
      ))
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">교육 수료증 관리</h2>

      {/* 업로드 정보 입력 */}
      <Card>
        <CardHeader>
          <CardTitle>수료증 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personName">이수자 이름</Label>
              <Input
                id="personName"
                value={uploadForm.personName}
                onChange={(e) => setUploadForm({ ...uploadForm, personName: e.target.value })}
                placeholder="예: 김연구"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="educationName">교육명</Label>
              <Input
                id="educationName"
                value={uploadForm.educationName}
                onChange={(e) => setUploadForm({ ...uploadForm, educationName: e.target.value })}
                placeholder="예: 2024년 1분기 정기안전교육"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="educationDate">교육일자</Label>
              <Input
                id="educationDate"
                type="date"
                value={uploadForm.educationDate}
                onChange={(e) => setUploadForm({ ...uploadForm, educationDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 파일 업로드 영역 */}
      <Card>
        <CardContent className="p-0">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              수료증 파일을 드래그하여 업로드
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              또는 파일을 선택하세요 (PDF, JPG, PNG)
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,image/*"
              multiple
              onChange={handleFileSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* 업로드된 수료증 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>업로드된 수료증</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className={`p-4 rounded-lg border ${
                  cert.status === 'rejected' 
                    ? 'border-red-200 bg-red-50' 
                    : cert.status === 'verified'
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="h-8 w-8 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">{cert.fileName}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {cert.personName} • {cert.educationName}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        교육일: {new Date(cert.educationDate).toLocaleDateString('ko-KR')} • 
                        업로드: {new Date(cert.uploadDate).toLocaleDateString('ko-KR')} • 
                        크기: {formatFileSize(cert.fileSize)}
                      </div>
                      {cert.status === 'rejected' && cert.rejectionReason && (
                        <div className="flex items-center gap-2 mt-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600">{cert.rejectionReason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(cert.status)}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {cert.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleVerify(cert.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReject(cert.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(cert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}