"use client"

import React, { useState } from 'react';
import type { DailyCheckList, DailyCheckItem } from '@/lib/types';
import { Calendar, User, Building, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface DailyCheckListProps {
  initialData?: Partial<DailyCheckList>;
  onSave?: (data: DailyCheckList) => void;
  onCancel?: () => void;
}

const defaultCheckItems: Omit<DailyCheckItem, 'id' | 'checked'>[] = [
  { category: '화학물질 관리', description: '화학물질 보관 상태 확인' },
  { category: '화학물질 관리', description: 'MSDS 비치 및 최신화 확인' },
  { category: '화학물질 관리', description: '폐기물 적정 보관 확인' },
  { category: '안전장비', description: '개인보호구 착용 상태' },
  { category: '안전장비', description: '비상샤워/세안기 작동 확인' },
  { category: '안전장비', description: '소화기 위치 및 압력 확인' },
  { category: '실험실 환경', description: '환기시설 정상 작동' },
  { category: '실험실 환경', description: '비상구 통로 확보' },
  { category: '실험실 환경', description: '전기설비 안전 상태' },
  { category: '일반 안전', description: '실험실 정리정돈 상태' },
  { category: '일반 안전', description: '위험 표지판 부착 상태' },
  { category: '일반 안전', description: '사고 대응 절차 숙지' },
];

export default function DailyCheckList({ initialData, onSave, onCancel }: DailyCheckListProps) {
  const [formData, setFormData] = useState<Partial<DailyCheckList>>({
    date: new Date().toISOString().split('T')[0],
    inspectorName: '',
    department: '',
    checkItems: defaultCheckItems.map((item, index) => ({
      ...item,
      id: `item-${index}`,
      checked: false,
      notes: ''
    })),
    overallStatus: 'safe',
    ...initialData
  });

  const handleCheckChange = (itemId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      checkItems: prev.checkItems?.map(item =>
        item.id === itemId ? { ...item, checked } : item
      )
    }));
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    setFormData(prev => ({
      ...prev,
      checkItems: prev.checkItems?.map(item =>
        item.id === itemId ? { ...item, notes } : item
      )
    }));
  };

  const calculateOverallStatus = () => {
    const items = formData.checkItems || [];
    const checkedCount = items.filter(item => item.checked).length;
    const percentage = (checkedCount / items.length) * 100;

    if (percentage === 100) return 'safe';
    if (percentage >= 80) return 'warning';
    return 'danger';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status = calculateOverallStatus();
    const completeData: DailyCheckList = {
      id: Date.now().toString(),
      date: formData.date || new Date().toISOString().split('T')[0],
      inspectorName: formData.inspectorName || '',
      department: formData.department || '',
      checkItems: formData.checkItems || [],
      overallStatus: status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSave?.(completeData);
  };

  const getStatusIcon = () => {
    const status = calculateOverallStatus();
    switch (status) {
      case 'safe':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'danger':
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getStatusText = () => {
    const status = calculateOverallStatus();
    switch (status) {
      case 'safe':
        return '안전';
      case 'warning':
        return '주의';
      case 'danger':
        return '위험';
    }
  };

  const groupedItems = formData.checkItems?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, DailyCheckItem[]>);

  return (
    <div className="bg-background-secondary rounded-notion-md shadow-notion-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">일일 안전점검표</h2>
          <p className="text-text-secondary">실험실 안전 상태를 매일 점검하고 기록합니다</p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Calendar className="w-4 h-4" />
              점검일자
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <User className="w-4 h-4" />
              점검자
            </label>
            <input
              type="text"
              value={formData.inspectorName}
              onChange={(e) => setFormData(prev => ({ ...prev, inspectorName: e.target.value }))}
              placeholder="이름을 입력하세요"
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
        </div>

        {/* Status Overview */}
        <div className="bg-background rounded-notion-sm border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-text-primary">전체 상태</h3>
              <p className="text-sm text-text-secondary mt-1">
                {formData.checkItems?.filter(item => item.checked).length} / {formData.checkItems?.length} 항목 완료
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-lg font-medium text-text-primary">{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* Check Items */}
        <div className="space-y-6">
          {Object.entries(groupedItems || {}).map(([category, items]) => (
            <div key={category} className="bg-background rounded-notion-sm border border-border p-4">
              <h3 className="text-lg font-medium text-text-primary mb-4">{category}</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={item.checked}
                        onChange={(e) => handleCheckChange(item.id, e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-border text-primary 
                          focus:ring-2 focus:ring-primary focus:ring-offset-2 
                          transition-all duration-200 cursor-pointer"
                      />
                      <label 
                        htmlFor={item.id} 
                        className="flex-1 text-text-primary cursor-pointer select-none"
                      >
                        {item.description}
                      </label>
                    </div>
                    {!item.checked && (
                      <div className="ml-8">
                        <input
                          type="text"
                          placeholder="미완료 사유 또는 특이사항"
                          value={item.notes || ''}
                          onChange={(e) => handleNotesChange(item.id, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded-notion-sm border border-border 
                            bg-background focus:ring-2 focus:ring-primary focus:border-transparent 
                            transition-all duration-200"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
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
            점검 완료
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