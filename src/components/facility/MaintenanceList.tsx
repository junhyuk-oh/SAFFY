"use client";

import { useState } from 'react';
import { MaintenanceTask } from '@/lib/types/facility';
import { MaintenanceCard } from './MaintenanceCard';
import { Grid3X3, List, Search, Filter, Plus } from 'lucide-react';

interface MaintenanceListProps {
  tasks: MaintenanceTask[];
  onTaskClick?: (task: MaintenanceTask) => void;
  onCreateClick?: () => void;
}

export function MaintenanceList({ tasks, onTaskClick, onCreateClick }: MaintenanceListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">유지보수 작업 관리</h1>
        <button
          onClick={onCreateClick}
          className="px-4 py-2 bg-primary text-white rounded-notion-sm hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 작업 생성
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-background-secondary rounded-notion-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
              <input
                type="text"
                placeholder="작업 검색..."
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
              <option value="scheduled">예정됨</option>
              <option value="in_progress">진행중</option>
              <option value="completed">완료</option>
              <option value="overdue">지연</option>
              <option value="cancelled">취소됨</option>
              <option value="on_hold">보류</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 rounded-notion-sm border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">모든 우선순위</option>
              <option value="critical">긴급</option>
              <option value="high">높음</option>
              <option value="medium">중간</option>
              <option value="low">낮음</option>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background-secondary rounded-notion-md p-4">
          <div className="text-2xl font-bold text-text-primary">{tasks.length}</div>
          <div className="text-sm text-text-secondary">전체 작업</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {tasks.filter(t => t.status === 'in_progress').length}
          </div>
          <div className="text-sm text-text-secondary">진행중</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4">
          <div className="text-2xl font-bold text-red-600">
            {tasks.filter(t => t.status === 'overdue').length}
          </div>
          <div className="text-sm text-text-secondary">지연</div>
        </div>
        <div className="bg-background-secondary rounded-notion-md p-4">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
          <div className="text-sm text-text-secondary">완료</div>
        </div>
      </div>

      {/* Task List/Grid */}
      {filteredTasks.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredTasks.map(task => (
            <MaintenanceCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary">일치하는 작업이 없습니다.</p>
        </div>
      )}
    </div>
  );
}