"use client"

import React, { useState } from 'react';
import type { ExperimentLog, ChemicalUsage } from '@/lib/types';
import { 
  Calendar, 
  User, 
  Building, 
  Clock, 
  Beaker, 
  Shield, 
  Plus, 
  Trash2,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface ExperimentLogProps {
  initialData?: Partial<ExperimentLog>;
  onSave?: (data: ExperimentLog) => void;
  onCancel?: () => void;
}

export default function ExperimentLog({ initialData, onSave, onCancel }: ExperimentLogProps) {
  const [formData, setFormData] = useState<Partial<ExperimentLog>>({
    date: new Date().toISOString().split('T')[0],
    experimentTitle: '',
    researcher: '',
    department: '',
    purpose: '',
    procedures: '',
    chemicals: [],
    equipment: [],
    safetyMeasures: ['개인보호구 착용', '환기 시설 가동'],
    startTime: '',
    endTime: '',
    results: '',
    incidents: '',
    ...initialData
  });

  const [newChemical, setNewChemical] = useState<ChemicalUsage>({
    name: '',
    casNumber: '',
    amount: '',
    unit: 'g'
  });

  const [newEquipment, setNewEquipment] = useState('');
  const [newSafetyMeasure, setNewSafetyMeasure] = useState('');

  const handleAddChemical = () => {
    if (newChemical.name && newChemical.amount) {
      setFormData(prev => ({
        ...prev,
        chemicals: [...(prev.chemicals || []), { ...newChemical }]
      }));
      setNewChemical({ name: '', casNumber: '', amount: '', unit: 'g' });
    }
  };

  const handleRemoveChemical = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chemicals: prev.chemicals?.filter((_, i) => i !== index)
    }));
  };

  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...(prev.equipment || []), newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const handleRemoveEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.filter((_, i) => i !== index)
    }));
  };

  const handleAddSafetyMeasure = () => {
    if (newSafetyMeasure.trim()) {
      setFormData(prev => ({
        ...prev,
        safetyMeasures: [...(prev.safetyMeasures || []), newSafetyMeasure.trim()]
      }));
      setNewSafetyMeasure('');
    }
  };

  const handleRemoveSafetyMeasure = (index: number) => {
    setFormData(prev => ({
      ...prev,
      safetyMeasures: prev.safetyMeasures?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeData: ExperimentLog = {
      id: Date.now().toString(),
      date: formData.date || new Date().toISOString().split('T')[0],
      experimentTitle: formData.experimentTitle || '',
      researcher: formData.researcher || '',
      department: formData.department || '',
      purpose: formData.purpose || '',
      procedures: formData.procedures || '',
      chemicals: formData.chemicals || [],
      equipment: formData.equipment || [],
      safetyMeasures: formData.safetyMeasures || [],
      startTime: formData.startTime || '',
      endTime: formData.endTime || '',
      results: formData.results,
      incidents: formData.incidents,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSave?.(completeData);
  };

  return (
    <div className="bg-background-secondary rounded-notion-md shadow-notion-md p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">실험일지</h2>
          <p className="text-text-secondary">실험 과정과 안전 조치를 상세히 기록합니다</p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <FileText className="w-4 h-4" />
              실험 제목
            </label>
            <input
              type="text"
              value={formData.experimentTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, experimentTitle: e.target.value }))}
              placeholder="실험 제목을 입력하세요"
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Calendar className="w-4 h-4" />
              실험일자
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
              실험자
            </label>
            <input
              type="text"
              value={formData.researcher}
              onChange={(e) => setFormData(prev => ({ ...prev, researcher: e.target.value }))}
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

        {/* Time Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Clock className="w-4 h-4" />
              시작 시간
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Clock className="w-4 h-4" />
              종료 시간
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            실험 목적
          </label>
          <textarea
            value={formData.purpose}
            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            placeholder="실험의 목적을 입력하세요"
            rows={3}
            className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
              focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 
              resize-none"
            required
          />
        </div>

        {/* Chemicals */}
        <div className="bg-background rounded-notion-sm border border-border p-4">
          <h3 className="flex items-center gap-2 text-lg font-medium text-text-primary mb-4">
            <Beaker className="w-5 h-5" />
            사용 화학물질
          </h3>
          
          {/* Chemical List */}
          {formData.chemicals && formData.chemicals.length > 0 && (
            <div className="mb-4 space-y-2">
              {formData.chemicals.map((chemical, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-background-secondary 
                  rounded-notion-sm">
                  <span className="flex-1 text-text-primary">
                    {chemical.name} {chemical.casNumber && `(CAS: ${chemical.casNumber})`} - 
                    {chemical.amount}{chemical.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChemical(index)}
                    className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Chemical Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              type="text"
              placeholder="화학물질명"
              value={newChemical.name}
              onChange={(e) => setNewChemical(prev => ({ ...prev, name: e.target.value }))}
              className="md:col-span-2 px-3 py-2 rounded-notion-sm border border-border 
                bg-background focus:ring-2 focus:ring-primary focus:border-transparent 
                transition-all duration-200"
            />
            <input
              type="text"
              placeholder="CAS 번호 (선택)"
              value={newChemical.casNumber}
              onChange={(e) => setNewChemical(prev => ({ ...prev, casNumber: e.target.value }))}
              className="px-3 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="사용량"
                value={newChemical.amount}
                onChange={(e) => setNewChemical(prev => ({ ...prev, amount: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background 
                  focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <select
                value={newChemical.unit}
                onChange={(e) => setNewChemical(prev => ({ ...prev, unit: e.target.value }))}
                className="px-3 py-2 rounded-notion-sm border border-border bg-background 
                  focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                <option value="g">g</option>
                <option value="mg">mg</option>
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="mL">mL</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddChemical}
              className="px-3 py-2 bg-primary text-white rounded-notion-sm 
                transition-all duration-200 hover:bg-primary-dark hover:shadow-md 
                hover:-translate-y-0.5 focus:ring-2 focus:ring-primary focus:ring-offset-2 
                active:scale-95"
            >
              <Plus className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-background rounded-notion-sm border border-border p-4">
          <h3 className="text-lg font-medium text-text-primary mb-4">사용 장비</h3>
          
          {formData.equipment && formData.equipment.length > 0 && (
            <div className="mb-4 space-y-2">
              {formData.equipment.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-background-secondary 
                  rounded-notion-sm">
                  <span className="flex-1 text-text-primary">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEquipment(index)}
                    className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="장비명을 입력하세요"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={handleAddEquipment}
              className="px-3 py-2 bg-primary text-white rounded-notion-sm 
                transition-all duration-200 hover:bg-primary-dark hover:shadow-md 
                hover:-translate-y-0.5 focus:ring-2 focus:ring-primary focus:ring-offset-2 
                active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Safety Measures */}
        <div className="bg-background rounded-notion-sm border border-border p-4">
          <h3 className="flex items-center gap-2 text-lg font-medium text-text-primary mb-4">
            <Shield className="w-5 h-5" />
            안전 조치사항
          </h3>
          
          {formData.safetyMeasures && formData.safetyMeasures.length > 0 && (
            <div className="mb-4 space-y-2">
              {formData.safetyMeasures.map((measure, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-background-secondary 
                  rounded-notion-sm">
                  <span className="flex-1 text-text-primary">{measure}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSafetyMeasure(index)}
                    className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="안전 조치사항을 입력하세요"
              value={newSafetyMeasure}
              onChange={(e) => setNewSafetyMeasure(e.target.value)}
              className="flex-1 px-3 py-2 rounded-notion-sm border border-border bg-background 
                focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={handleAddSafetyMeasure}
              className="px-3 py-2 bg-primary text-white rounded-notion-sm 
                transition-all duration-200 hover:bg-primary-dark hover:shadow-md 
                hover:-translate-y-0.5 focus:ring-2 focus:ring-primary focus:ring-offset-2 
                active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Procedures */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            실험 절차
          </label>
          <textarea
            value={formData.procedures}
            onChange={(e) => setFormData(prev => ({ ...prev, procedures: e.target.value }))}
            placeholder="실험 절차를 상세히 입력하세요"
            rows={6}
            className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
              focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 
              resize-none"
            required
          />
        </div>

        {/* Results */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            실험 결과
          </label>
          <textarea
            value={formData.results}
            onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
            placeholder="실험 결과를 입력하세요"
            rows={4}
            className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
              focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 
              resize-none"
          />
        </div>

        {/* Incidents */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <AlertTriangle className="w-4 h-4" />
            사고/특이사항
          </label>
          <textarea
            value={formData.incidents}
            onChange={(e) => setFormData(prev => ({ ...prev, incidents: e.target.value }))}
            placeholder="사고나 특이사항이 있었다면 기록하세요"
            rows={3}
            className="w-full px-4 py-2 rounded-notion-sm border border-border bg-background 
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
            작성 완료
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