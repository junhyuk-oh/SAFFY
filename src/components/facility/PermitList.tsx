"use client";

import { useState } from 'react';
import { WorkPermit } from '@/lib/types/facility';
import { PermitCard } from './PermitCard';
import { Grid3X3, List, Search, Filter, Plus, Shield, Clock, AlertTriangle } from 'lucide-react';

interface PermitListProps {
  permits: WorkPermit[];
  onPermitClick?: (permit: WorkPermit) => void;
  onCreateClick?: () => void;
}

export function PermitList({ permits, onPermitClick, onCreateClick }: PermitListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  // Filter permits
  const filteredPermits = permits.filter(permit => {
    const matchesSearch = permit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permit.permitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || permit.status === selectedStatus;
    const matchesType = selectedType === 'all' || permit.type === selectedType;
    const matchesRisk = selectedRisk === 'all' || permit.hazards.riskLevel === selectedRisk;
    
    return matchesSearch && matchesStatus && matchesType && matchesRisk;
  });

  // 통계 계산
  const stats = {
    total: permits.length,
    pending: permits.filter(p => p.status === 'submitted' || p.status === 'under_review').length,
    active: permits.filter(p => p.status === 'active').length,
    expiringSoon: permits.filter(p => {
      if (p.status !== 'active') return false;
      const endDate = new Date(p.endDate);
      const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
    }).length
  };

  // 허가서 타입 목록 추출
  const permitTypes = Array.from(new Set(permits.map(p => p.type))).sort();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">작업허가서 관리</h1>
        <button
          onClick={onCreateClick}
          className="px-4 py-2 bg-primary text-white rounded-notion-sm hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 허가서 신청
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background-secondary rounded-notion-md p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm text-text-secondary">전체</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{stats.total}건</div>
        </div>
        
        <div className="bg-background-secondary rounded-notion-md p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-text-secondary">승인 대기</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}건</div>
        </div>
        
        <div className="bg-background-secondary rounded-notion-md p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-text-secondary">진행중</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.active}건</div>
        </div>
        
        <div className="bg-background-secondary rounded-notion-md p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-text-secondary">곧 만료</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}건</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-background-secondary rounded-notion-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
              <input
                type="text"
                placeholder="허가서 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-notion-sm border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-notion-sm border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">모든 상태</option>
              <option value="draft">초안</option>
              <option value="submitted">제출됨</option>
              <option value="under_review">검토중</option>
              <option value="approved">승인됨</option>
              <option value="rejected">거부됨</option>
              <option value="active">진행중</option>
              <option value="completed">완료</option>
              <option value="expired">만료됨</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-notion-sm border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">모든 작업 유형</option>
              {permitTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-4 py-2 rounded-notion-sm border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">모든 위험도</option>
              <option value="low">낮음</option>
              <option value="medium">중간</option>
              <option value="high">높음</option>
              <option value="critical">매우높음</option>
            </select>

            <div className="flex gap-1 bg-background rounded-notion-sm p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-notion-sm transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-background-hover'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-notion-sm transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-background-hover'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Permit List/Grid */}
      {filteredPermits.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredPermits.map(permit => (
            <PermitCard key={permit.id} permit={permit} onClick={onPermitClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary">일치하는 작업허가서가 없습니다.</p>
        </div>
      )}
    </div>
  );
}