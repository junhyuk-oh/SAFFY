"use client"

import React, { useState, useMemo } from 'react';
import { ChemicalUsageReport, ChemicalInventory, ChemicalUsageTrend } from '@/lib/types/documents';
import { Calendar, User, Building, Beaker, TrendingUp, Trash2, AlertCircle, BarChart3, Package } from 'lucide-react';

interface ChemicalUsageReportProps {
  initialData?: Partial<ChemicalUsageReport>;
  onSave?: (data: ChemicalUsageReport) => void;
  onCancel?: () => void;
}

// 더미 데이터 생성
const defaultChemicals: ChemicalInventory[] = [
  { name: '황산 (H₂SO₄)', casNumber: '7664-93-9', initialStock: 500, used: 50, disposed: 10, currentStock: 440, unit: 'mL' },
  { name: '에탄올', casNumber: '64-17-5', initialStock: 1000, used: 200, disposed: 50, currentStock: 750, unit: 'mL' },
  { name: '아세톤', casNumber: '67-64-1', initialStock: 800, used: 150, disposed: 20, currentStock: 630, unit: 'mL' },
  { name: '염산 (HCl)', casNumber: '7647-01-0', initialStock: 300, used: 80, disposed: 15, currentStock: 205, unit: 'mL' },
];

const generateUsageTrends = (weekStart: string): Record<string, ChemicalUsageTrend[]> => {
  const trends: Record<string, ChemicalUsageTrend[]> = {};
  const chemicals = ['황산 (H₂SO₄)', '에탄올', '아세톤', '염산 (HCl)'];
  
  chemicals.forEach(chemical => {
    trends[chemical] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      trends[chemical].push({
        date: date.toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 30 + 5)
      });
    }
  });
  
  return trends;
};

export default function ChemicalUsageReport({ initialData, onSave, onCancel }: ChemicalUsageReportProps) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const [formData, setFormData] = useState<Partial<ChemicalUsageReport>>({
    weekStartDate: monday.toISOString().split('T')[0],
    weekEndDate: sunday.toISOString().split('T')[0],
    department: '',
    reporterName: '',
    chemicals: defaultChemicals,
    usageTrends: generateUsageTrends(monday.toISOString().split('T')[0]),
    totalDisposalAmount: defaultChemicals.reduce((sum, c) => sum + c.disposed, 0),
    disposalMethod: '전문업체 위탁처리',
    specialNotes: '',
    ...initialData
  });

  const [selectedChemical, setSelectedChemical] = useState<string>('황산 (H₂SO₄)');

  // 차트 데이터 준비
  const chartData = useMemo(() => {
    const trends = formData.usageTrends?.[selectedChemical] || [];
    return trends.map(t => ({
      date: new Date(t.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      amount: t.amount
    }));
  }, [formData.usageTrends, selectedChemical]);

  // 최대값 계산 (차트 스케일용)
  const maxAmount = useMemo(() => {
    const trends = formData.usageTrends?.[selectedChemical] || [];
    return Math.max(...trends.map(t => t.amount), 1);
  }, [formData.usageTrends, selectedChemical]);

  const handleChemicalChange = (index: number, field: keyof ChemicalInventory, value: number) => {
    setFormData(prev => {
      const newChemicals = [...(prev.chemicals || [])];
      newChemicals[index] = {
        ...newChemicals[index],
        [field]: value,
        currentStock: field === 'used' || field === 'disposed' 
          ? newChemicals[index].initialStock - (field === 'used' ? value : newChemicals[index].used) - (field === 'disposed' ? value : newChemicals[index].disposed)
          : newChemicals[index].currentStock
      };
      
      // 총 폐기량 재계산
      const totalDisposal = newChemicals.reduce((sum, c) => sum + c.disposed, 0);
      
      return {
        ...prev,
        chemicals: newChemicals,
        totalDisposalAmount: totalDisposal
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeData: ChemicalUsageReport = {
      id: Date.now().toString(),
      weekStartDate: formData.weekStartDate || monday.toISOString().split('T')[0],
      weekEndDate: formData.weekEndDate || sunday.toISOString().split('T')[0],
      department: formData.department || '',
      reporterName: formData.reporterName || '',
      chemicals: formData.chemicals || [],
      usageTrends: formData.usageTrends || {},
      totalDisposalAmount: formData.totalDisposalAmount || 0,
      disposalMethod: formData.disposalMethod || '',
      specialNotes: formData.specialNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSave?.(completeData);
  };

  const getUsageStatus = (chemical: ChemicalInventory) => {
    const usageRate = (chemical.used / chemical.initialStock) * 100;
    if (usageRate > 50) return { color: 'text-red-500', text: '고사용' };
    if (usageRate > 30) return { color: 'text-yellow-500', text: '중사용' };
    return { color: 'text-green-500', text: '저사용' };
  };

  return (
    <div className="bg-background-secondary rounded-notion-md shadow-notion-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">주간 화학물질 사용 현황</h2>
          <p className="text-text-secondary">화학물질 사용량, 재고 및 폐기 현황을 보고합니다</p>
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
              보고자
            </label>
            <input
              type="text"
              value={formData.reporterName}
              onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background rounded-notion-sm border border-border p-4">
            <div className="flex items-center gap-3">
              <Beaker className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-text-secondary">총 사용량</p>
                <p className="text-xl font-semibold text-text-primary">
                  {formData.chemicals?.reduce((sum, c) => sum + c.used, 0)} mL
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-notion-sm border border-border p-4">
            <div className="flex items-center gap-3">
              <Trash2 className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-text-secondary">총 폐기량</p>
                <p className="text-xl font-semibold text-text-primary">
                  {formData.totalDisposalAmount} mL
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-notion-sm border border-border p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-text-secondary">관리 물질 수</p>
                <p className="text-xl font-semibold text-text-primary">
                  {formData.chemicals?.length}종
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chemical Inventory Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
            <Beaker className="w-5 h-5" />
            화학물질 재고 현황
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-background rounded-notion-sm border border-border">
              <thead className="bg-background-secondary border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-text-primary">화학물질명</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-text-primary">CAS No.</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-text-primary">초기재고</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-text-primary">사용량</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-text-primary">폐기량</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-text-primary">현재재고</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-text-primary">상태</th>
                </tr>
              </thead>
              <tbody>
                {formData.chemicals?.map((chemical, index) => {
                  const status = getUsageStatus(chemical);
                  return (
                    <tr key={index} className="border-b border-border hover:bg-background-secondary transition-colors">
                      <td className="px-4 py-3 text-text-primary font-medium">{chemical.name}</td>
                      <td className="px-4 py-3 text-text-secondary text-sm">{chemical.casNumber}</td>
                      <td className="px-4 py-3 text-center text-text-primary">{chemical.initialStock} {chemical.unit}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          value={chemical.used}
                          onChange={(e) => handleChemicalChange(index, 'used', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-center rounded-notion-sm border border-border bg-background 
                            focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          value={chemical.disposed}
                          onChange={(e) => handleChemicalChange(index, 'disposed', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-center rounded-notion-sm border border-border bg-background 
                            focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-center text-text-primary font-medium">
                        {chemical.currentStock} {chemical.unit}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Trends Chart */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            사용량 추이
          </h3>
          <div className="bg-background rounded-notion-sm border border-border p-4">
            {/* Chemical Selector */}
            <div className="mb-4">
              <select
                value={selectedChemical}
                onChange={(e) => setSelectedChemical(e.target.value)}
                className="px-4 py-2 rounded-notion-sm border border-border bg-background 
                  focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                {formData.chemicals?.map((chemical) => (
                  <option key={chemical.name} value={chemical.name}>
                    {chemical.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary w-16">{data.date}</span>
                  <div className="flex-1 bg-background-secondary rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-primary font-medium">
                      {data.amount} mL
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disposal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            폐기물 처리 정보
          </h3>
          <div className="bg-background rounded-notion-sm border border-border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">처리 방법</label>
                <select
                  value={formData.disposalMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, disposalMethod: e.target.value }))}
                  className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                    focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="전문업체 위탁처리">전문업체 위탁처리</option>
                  <option value="자체 처리">자체 처리</option>
                  <option value="재활용">재활용</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">폐기물은 관련 법규에 따라 안전하게 처리되어야 합니다</span>
              </div>
            </div>
          </div>
        </div>

        {/* Special Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">특이사항</h3>
          <textarea
            value={formData.specialNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, specialNotes: e.target.value }))}
            placeholder="특별한 사항이나 주의사항을 입력하세요"
            rows={4}
            className="w-full px-4 py-3 rounded-notion-sm border border-border bg-background 
              focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 
              resize-none"
          />
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