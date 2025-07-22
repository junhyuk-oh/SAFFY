"use client";

import { WorkPermit } from '@/lib/types/facility';
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle, User, Calendar, MapPin } from 'lucide-react';
import { PERMIT_STATUS, PRIORITY_CONFIG } from '@/lib/constants/status';
import { formatDateTime } from '@/lib/utils/date';

interface PermitCardProps {
  permit: WorkPermit;
  onClick?: (permit: WorkPermit) => void;
}


const permitTypeIcons: Record<string, string> = {
  'Hot Work': '🔥',
  'Confined Space': '🚪',
  'Electrical Work': '⚡',
  'Chemical Work': '🧪',
  'Height Work': '🏗️',
  'Excavation': '🚧',
  'Welding': '🔧',
  'Cutting': '✂️',
  'Radiation Work': '☢️',
  'Crane Operation': '🏗️',
  'Shutdown Work': '🛑',
  'Emergency Work': '🚨',
  'Contractor Work': '👷',
  'Maintenance Work': '🔧',
  'Construction Work': '🏗️'
};

const riskLevelConfig = {
  low: { label: '낮음', color: 'text-green-600', bg: 'bg-green-100' },
  medium: { label: '중간', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  high: { label: '높음', color: 'text-orange-600', bg: 'bg-orange-100' },
  critical: { label: '매우높음', color: 'text-red-600', bg: 'bg-red-100' }
};

export function PermitCard({ permit, onClick }: PermitCardProps) {
  const status = PERMIT_STATUS[permit.status];
  const StatusIcon = status.icon;
  const riskLevel = riskLevelConfig[permit.hazards.riskLevel];
  const typeIcon = permitTypeIcons[permit.type] || '📋';

  // 승인 진행률 계산
  const totalApprovals = permit.approvals.length;
  const completedApprovals = permit.approvals.filter(a => a.status !== 'pending').length;
  const approvalProgress = totalApprovals > 0 ? (completedApprovals / totalApprovals) * 100 : 0;

  // 작업 기간 계산
  const startDate = new Date(permit.startDate);
  const endDate = new Date(permit.endDate);
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div
      className={`bg-background-secondary rounded-notion-md p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border-l-4 ${status.border}`}
      onClick={() => onClick?.(permit)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-notion-sm ${status.bg} text-2xl`}>
            {typeIcon}
          </div>
          <div>
            <h3 className="font-medium text-text-primary flex items-center gap-2">
              {permit.title}
              <span className="text-xs text-text-tertiary">#{permit.permitNumber}</span>
            </h3>
            <p className="text-sm text-text-secondary mt-1">{permit.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${status.bg} ${status.color} font-medium flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${riskLevel.bg} ${riskLevel.color} font-medium`}>
            위험도: {riskLevel.label}
          </span>
        </div>
      </div>

      {/* Work Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{permit.location}</span>
            {permit.subLocation && <span className="text-text-tertiary">• {permit.subLocation}</span>}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDateTime(startDate, { includeTime: false })}</span>
            <span className="text-text-tertiary">({durationDays}일간)</span>
          </div>
        </div>
        
        {permit.contractor && (
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <User className="w-4 h-4" />
            <span>계약업체: {permit.contractor.companyName}</span>
          </div>
        )}
      </div>

      {/* Hazards */}
      {permit.hazards.identified.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-text-primary">주요 위험요소</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {permit.hazards.identified.slice(0, 3).map((hazard, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-warning-bg text-warning-text rounded-full">
                {hazard}
              </span>
            ))}
            {permit.hazards.identified.length > 3 && (
              <span className="text-xs px-2 py-1 bg-background-hover text-text-tertiary rounded-full">
                +{permit.hazards.identified.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Approval Progress */}
      {permit.status !== 'draft' && totalApprovals > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-text-secondary">승인 진행률</span>
            <span className="text-text-primary font-medium">{completedApprovals}/{totalApprovals}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${approvalProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-text-tertiary" />
          <span className="text-text-secondary">신청자: {permit.requestedBy.name}</span>
        </div>
        
        {/* Safety Requirements */}
        <div className="flex items-center gap-2">
          {permit.safety.fireWatchRequired && (
            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full" title="화기감시자 필요">
              🔥감시
            </span>
          )}
          {permit.safety.gasTestRequired && (
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full" title="가스측정 필요">
              🌫️측정
            </span>
          )}
          {permit.safety.isolationRequired && (
            <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full" title="차단조치 필요">
              ⚡차단
            </span>
          )}
        </div>
      </div>
    </div>
  );
}