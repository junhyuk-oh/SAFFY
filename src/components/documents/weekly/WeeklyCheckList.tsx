"use client"

import React, { useState, useMemo } from 'react';
import type { WeeklyCheckList, WeeklyCheckSummary } from '@/lib/types';
import { Calendar, User, Building, AlertCircle, CheckCircle, XCircle, TrendingUp, FileText } from 'lucide-react';

interface WeeklyCheckListProps {
  initialData?: Partial<WeeklyCheckList>;
  onSave?: (data: WeeklyCheckList) => void;
  onCancel?: () => void;
}

// 더미 데이터 생성 함수
const generateDummySummaries = (startDate: string): WeeklyCheckSummary[] => {
  const summaries: WeeklyCheckSummary[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    
    const completionRate = 85 + Math.random() * 15;
    const hasIssues = Math.random() > 0.7;
    
    summaries.push({
      date: date.toISOString().split('T')[0],
      completionRate: Math.round(completionRate),
      issues: hasIssues ? ['화학물질 보관 상태 불량', '환기시설 점검 필요'] : [],
      status: completionRate >= 95 ? 'safe' : completionRate >= 80 ? 'warning' : 'danger'
    });
  }
  
  return summaries;
};

export default function WeeklyCheckList({ initialData, onSave, onCancel }: WeeklyCheckListProps) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const [formData, setFormData] = useState<Partial<WeeklyCheckList>>({
    weekStartDate: monday.toISOString().split('T')[0],
    weekEndDate: sunday.toISOString().split('T')[0],
    department: '',
    managerName: '',
    dailySummaries: generateDummySummaries(monday.toISOString().split('T')[0]),
    majorIssues: [],
    correctiveActions: [],
    overallStatus: 'safe',
    ...initialData
  });

  const [newIssue, setNewIssue] = useState('');
  const [newAction, setNewAction] = useState('');

  // 전체 상태 계산
  const overallStatus = useMemo(() => {
    const summaries = formData.dailySummaries || [];
    const avgCompletionRate = summaries.reduce((sum, s) => sum + s.completionRate, 0) / summaries.length;
    const hasWarnings = summaries.some(s => s.status === 'warning');
    const hasDangers = summaries.some(s => s.status === 'danger');
    
    if (hasDangers || avgCompletionRate < 80) return 'danger';
    if (hasWarnings || avgCompletionRate < 90) return 'warning';
    return 'safe';
  }, [formData.dailySummaries]);

  const handleAddIssue = () => {
    if (newIssue.trim()) {
      setFormData(prev => ({
        ...prev,
        majorIssues: [...(prev.majorIssues || []), newIssue.trim()]
      }));
      setNewIssue('');
    }
  };

  const handleAddAction = () => {
    if (newAction.trim()) {
      setFormData(prev => ({
        ...prev,
        correctiveActions: [...(prev.correctiveActions || []), newAction.trim()]
      }));
      setNewAction('');
    }
  };

  const handleRemoveIssue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      majorIssues: prev.majorIssues?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      correctiveActions: prev.correctiveActions?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeData: WeeklyCheckList = {
      id: Date.now().toString(),
      weekStartDate: formData.weekStartDate || monday.toISOString().split('T')[0],
      weekEndDate: formData.weekEndDate || sunday.toISOString().split('T')[0],
      department: formData.department || '',
      managerName: formData.managerName || '',
      dailySummaries: formData.dailySummaries || [],
      majorIssues: formData.majorIssues || [],
      correctiveActions: formData.correctiveActions || [],
      overallStatus: overallStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSave?.(completeData);
  };

  const getStatusIcon = (status: 'safe' | 'warning' | 'danger') => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'danger':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: 'safe' | 'warning' | 'danger') => {
    switch (status) {
      case 'safe':
        return '안전';
      case 'warning':
        return '주의';
      case 'danger':
        return '위험';
    }
  };

  const getDayName = (dateStr: string) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  return (
    <div className="bg-background-secondary rounded-notion-md shadow-notion-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">주간 안전점검 요약</h2>
          <p className="text-text-secondary">일주일간의 안전점검 결과를 종합하여 보고합니다</p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Calendar className="w-4 h-4" />
              시작일
            </label>
            <input
              type="date"
              value={formData.weekStartDate}
              onChange={(e) => setFormData(prev => ({ ...prev, weekStartDate: e.target.value }))}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Calendar className="w-4 h-4" />
              종료일
            </label>
            <input
              type="date"
              value={formData.weekEndDate}
              onChange={(e) => setFormData(prev => ({ ...prev, weekEndDate: e.target.value }))}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Building className="w-4 h-4" />
              부서/실험실
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              placeholder="부서명을 입력하세요"
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <User className="w-4 h-4" />
              관리자
            </label>
            <input
              type="text"
              value={formData.managerName}
              onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-background rounded-notion-sm border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-text-primary">주간 전체 상태</h3>
              <p className="text-sm text-text-secondary mt-1">
                평균 완료율: {Math.round((formData.dailySummaries?.reduce((sum, s) => sum + s.completionRate, 0) || 0) / (formData.dailySummaries?.length || 1))}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(overallStatus)}
              <span className="text-lg font-medium text-text-primary">{getStatusText(overallStatus)}</span>
            </div>
          </div>
        </div>

        {/* Daily Summaries */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            일별 점검 현황
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
            {formData.dailySummaries?.map((summary) => (
              <div 
                key={summary.date} 
                className="bg-background rounded-notion-sm border border-border p-4 
                  transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">
                    {summary.date.split('-').slice(1).join('/')} ({getDayName(summary.date)})
                  </span>
                  {getStatusIcon(summary.status)}
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {summary.completionRate}%
                </div>
                {summary.issues.length > 0 && (
                  <div className="text-xs text-text-secondary">
                    이슈 {summary.issues.length}건
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Major Issues */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            주요 이슈사항
          </h3>
          <div className="bg-background rounded-notion-sm border border-border p-4">
            <div className="space-y-2 mb-3">
              {formData.majorIssues?.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background-secondary rounded-notion-sm">
                  <span className="text-text-primary">{issue}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIssue(index)}
                    className="text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIssue())}
                placeholder="새 이슈를 입력하세요"
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background 
                  focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleAddIssue}
                className="px-4 py-2 bg-primary text-white rounded-notion-sm font-medium 
                  transition-all duration-200 hover:bg-primary-dark hover:shadow-md"
              >
                추가
              </button>
            </div>
          </div>
        </div>

        {/* Corrective Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5" />
            시정조치 사항
          </h3>
          <div className="bg-background rounded-notion-sm border border-border p-4">
            <div className="space-y-2 mb-3">
              {formData.correctiveActions?.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background-secondary rounded-notion-sm">
                  <span className="text-text-primary">{action}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAction(index)}
                    className="text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAction())}
                placeholder="시정조치 사항을 입력하세요"
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background 
                  focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleAddAction}
                className="px-4 py-2 bg-primary text-white rounded-notion-sm font-medium 
                  transition-all duration-200 hover:bg-primary-dark hover:shadow-md"
              >
                추가
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <button
            type="submit"
            className="flex-1 sm:flex-initial px-6 py-3 bg-primary text-white rounded-notion-sm 
              font-medium transition-all duration-200 hover:bg-primary-dark hover:shadow-md 
              hover:-translate-y-0.5 focus:ring-2 focus:ring-primary focus:ring-offset-2 
              active:scale-95"
          >
            보고서 저장
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial px-6 py-3 bg-background border border-border 
                text-text-primary rounded-notion-sm font-medium transition-all duration-200 
                hover:bg-background-secondary hover:shadow-md hover:-translate-y-0.5 
                focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
}