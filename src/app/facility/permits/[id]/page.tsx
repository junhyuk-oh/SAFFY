"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkPermit } from '@/lib/types/facility';
import { Breadcrumb } from '@/components/ui/display';
import { 
  Shield, Clock, Calendar, MapPin, User, AlertTriangle, 
  CheckCircle, XCircle, FileText, Edit, Trash2, Send,
  Download, Print, ChevronRight, Activity, Users
} from 'lucide-react';

const statusConfig = {
  draft: { 
    label: '초안', 
    color: 'text-gray-600', 
    bg: 'bg-gray-50', 
    icon: Clock 
  },
  submitted: { 
    label: '제출됨', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    icon: Send 
  },
  under_review: { 
    label: '검토중', 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50', 
    icon: Clock 
  },
  approved: { 
    label: '승인됨', 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    icon: CheckCircle 
  },
  rejected: { 
    label: '거부됨', 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    icon: XCircle 
  },
  active: { 
    label: '진행중', 
    color: 'text-primary', 
    bg: 'bg-primary-light', 
    icon: Activity 
  },
  completed: { 
    label: '완료', 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    icon: CheckCircle 
  },
  expired: { 
    label: '만료됨', 
    color: 'text-gray-600', 
    bg: 'bg-gray-50', 
    icon: Clock 
  }
};

const riskLevelConfig = {
  low: { label: '낮음', color: 'text-green-600', bg: 'bg-green-100' },
  medium: { label: '중간', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  high: { label: '높음', color: 'text-orange-600', bg: 'bg-orange-100' },
  critical: { label: '매우높음', color: 'text-red-600', bg: 'bg-red-100' }
};

export default function PermitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [permit, setPermit] = useState<WorkPermit | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'approvals' | 'history'>('details');

  useEffect(() => {
    if (params.id) {
      fetchPermit(params.id as string);
    }
  }, [params.id]);

  const fetchPermit = async (id: string) => {
    try {
      const response = await fetch(`/api/facility/permits/${id}`);
      if (!response.ok) throw new Error('Failed to fetch permit');
      const data = await response.json();
      setPermit(data.permit);
    } catch (error) {
      console.error('Error fetching permit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/facility/permits/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 작업허가서를 삭제하시겠습니까?')) return;
    
    try {
      const response = await fetch(`/api/facility/permits/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete permit');
      
      alert('작업허가서가 삭제되었습니다.');
      router.push('/facility/permits');
    } catch (error) {
      console.error('Error deleting permit:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/facility/permits/${params.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approverId: 'current-user-id', // In real app, get from auth context
          comments: '승인합니다.'
        }),
      });
      
      if (!response.ok) throw new Error('Failed to approve permit');
      
      alert('작업허가서가 승인되었습니다.');
      fetchPermit(params.id as string);
    } catch (error) {
      console.error('Error approving permit:', error);
      alert('승인 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async () => {
    const reason = prompt('거부 사유를 입력해주세요:');
    if (!reason) return;
    
    try {
      const response = await fetch(`/api/facility/permits/${params.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approverId: 'current-user-id', // In real app, get from auth context
          reason
        }),
      });
      
      if (!response.ok) throw new Error('Failed to reject permit');
      
      alert('작업허가서가 거부되었습니다.');
      fetchPermit(params.id as string);
    } catch (error) {
      console.error('Error rejecting permit:', error);
      alert('거부 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-background-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="p-6 bg-background-primary min-h-screen">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
          <p className="text-text-secondary">작업허가서를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[permit.status];
  const StatusIcon = status.icon;
  const riskLevel = riskLevelConfig[permit.hazards.riskLevel];

  return (
    <div className="p-6 space-y-6 bg-background-primary min-h-screen">
      <Breadcrumb 
        items={[
          { label: '홈', href: '/' },
          { label: '시설관리', href: '/facility' },
          { label: '작업허가서', href: '/facility/permits' },
          { label: permit.permitNumber, href: `/facility/permits/${permit.id}` }
        ]} 
      />

      {/* Header */}
      <div className="bg-background-secondary rounded-notion-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text-primary">{permit.title}</h1>
              <span className={`px-3 py-1 text-sm rounded-full ${status.bg} ${status.color} font-medium flex items-center gap-1`}>
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>
            </div>
            <p className="text-text-secondary">허가번호: {permit.permitNumber}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-background-hover rounded-notion-sm transition-colors"
              title="인쇄"
            >
              <Print className="w-5 h-5 text-text-secondary" />
            </button>
            <button
              onClick={() => {/* Handle download */}}
              className="p-2 hover:bg-background-hover rounded-notion-sm transition-colors"
              title="다운로드"
            >
              <Download className="w-5 h-5 text-text-secondary" />
            </button>
            {permit.status === 'draft' && (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-primary text-white rounded-notion-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-notion-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </>
            )}
            {permit.status === 'submitted' && (
              <>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-notion-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  승인
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-notion-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  거부
                </button>
              </>
            )}
          </div>
        </div>

        {/* Key Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-text-tertiary" />
            <div>
              <p className="text-xs text-text-tertiary">작업 유형</p>
              <p className="text-sm font-medium text-text-primary">{permit.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-text-tertiary" />
            <div>
              <p className="text-xs text-text-tertiary">작업 위치</p>
              <p className="text-sm font-medium text-text-primary">
                {permit.location} {permit.subLocation && `• ${permit.subLocation}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-text-tertiary" />
            <div>
              <p className="text-xs text-text-tertiary">작업 기간</p>
              <p className="text-sm font-medium text-text-primary">
                {new Date(permit.startDate).toLocaleDateString('ko-KR')} ~ {new Date(permit.endDate).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-text-tertiary" />
            <div>
              <p className="text-xs text-text-tertiary">위험도</p>
              <span className={`text-sm font-medium ${riskLevel.color}`}>{riskLevel.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-background-secondary rounded-notion-md">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            상세 정보
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'approvals'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            승인 현황
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            변경 이력
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Work Description */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">작업 내용</h3>
                <p className="text-text-secondary whitespace-pre-wrap">{permit.description}</p>
              </div>

              {/* Requester Info */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">신청자 정보</h3>
                <div className="bg-background rounded-notion-sm p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">이름:</span>
                    <span className="text-sm font-medium text-text-primary">{permit.requestedBy.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">부서:</span>
                    <span className="text-sm font-medium text-text-primary">{permit.requestedBy.department}</span>
                  </div>
                </div>
              </div>

              {/* Contractor Info */}
              {permit.contractor && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">계약업체 정보</h3>
                  <div className="bg-background rounded-notion-sm p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-text-secondary">업체명</p>
                        <p className="text-sm font-medium text-text-primary">{permit.contractor.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">담당자</p>
                        <p className="text-sm font-medium text-text-primary">{permit.contractor.supervisorName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">연락처</p>
                        <p className="text-sm font-medium text-text-primary">{permit.contractor.supervisorPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">작업인원</p>
                        <p className="text-sm font-medium text-text-primary">{permit.contractor.workerCount}명</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hazards */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">위험요소 및 안전조치</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-2">식별된 위험요소</p>
                    <div className="flex flex-wrap gap-2">
                      {permit.hazards.identified.map((hazard, index) => (
                        <span key={index} className="px-3 py-1 bg-warning-bg text-warning-text rounded-full text-sm">
                          {hazard}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-2">위험 저감 조치</p>
                    <ul className="list-disc list-inside space-y-1">
                      {permit.hazards.controlMeasures.map((measure, index) => (
                        <li key={index} className="text-sm text-text-primary">{measure}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-2">안전 요구사항</p>
                    <div className="flex items-center gap-4">
                      {permit.safety.fireWatchRequired && (
                        <span className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-full">
                          🔥 화기감시자 필요
                        </span>
                      )}
                      {permit.safety.gasTestRequired && (
                        <span className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                          🌫️ 가스측정 필요
                        </span>
                      )}
                      {permit.safety.isolationRequired && (
                        <span className="text-sm px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full">
                          ⚡ 차단조치 필요
                        </span>
                      )}
                      {permit.safety.ventilationRequired && (
                        <span className="text-sm px-3 py-1 bg-green-50 text-green-600 rounded-full">
                          💨 환기장치 필요
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mb-3">승인 진행 현황</h3>
              {permit.approvals.map((approval, index) => (
                <div key={approval.id} className="bg-background rounded-notion-sm p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        approval.status === 'approved' ? 'bg-green-100' :
                        approval.status === 'rejected' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        {approval.status === 'approved' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : approval.status === 'rejected' ? (
                          <XCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{approval.role}</p>
                        <p className="text-sm text-text-secondary">
                          {approval.approverId ? `승인자: ${approval.approverId}` : '승인 대기중'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        approval.status === 'approved' ? 'text-green-600' :
                        approval.status === 'rejected' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {approval.status === 'approved' ? '승인됨' :
                         approval.status === 'rejected' ? '거부됨' :
                         '대기중'}
                      </p>
                      {approval.approvedAt && (
                        <p className="text-xs text-text-tertiary">
                          {new Date(approval.approvedAt).toLocaleString('ko-KR')}
                        </p>
                      )}
                    </div>
                  </div>
                  {approval.comments && (
                    <p className="mt-2 text-sm text-text-secondary bg-background-hover p-2 rounded">
                      {approval.comments}
                    </p>
                  )}
                </div>
              ))}
              
              {/* Approval Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">승인 진행률</span>
                  <span className="text-text-primary font-medium">
                    {permit.approvals.filter(a => a.status !== 'pending').length}/{permit.approvals.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${(permit.approvals.filter(a => a.status !== 'pending').length / permit.approvals.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mb-3">변경 이력</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-background rounded-notion-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">작업허가서 생성됨</p>
                    <p className="text-xs text-text-tertiary">
                      {new Date(permit.createdAt).toLocaleString('ko-KR')} • {permit.requestedBy.name}
                    </p>
                  </div>
                </div>
                
                {permit.approvals
                  .filter(a => a.status !== 'pending')
                  .map((approval, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-notion-sm">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        approval.status === 'approved' ? 'bg-green-600' : 'bg-red-600'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {approval.role} {approval.status === 'approved' ? '승인' : '거부'}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {approval.approvedAt && new Date(approval.approvedAt).toLocaleString('ko-KR')} • {approval.approverId}
                        </p>
                        {approval.comments && (
                          <p className="text-sm text-text-secondary mt-1">{approval.comments}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}