"use client";

import { MaintenanceTask } from '@/lib/types/facility';
import { Wrench, Clock, AlertCircle, CheckCircle, XCircle, Calendar, MapPin } from 'lucide-react';

interface MaintenanceCardProps {
  task: MaintenanceTask;
  onClick?: (task: MaintenanceTask) => void;
}

const statusConfig = {
  scheduled: { 
    label: '예정됨', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    border: 'border-l-blue-500',
    icon: Calendar 
  },
  in_progress: { 
    label: '진행중', 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50', 
    border: 'border-l-yellow-500',
    icon: Clock 
  },
  completed: { 
    label: '완료', 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    border: 'border-l-green-500',
    icon: CheckCircle 
  },
  overdue: { 
    label: '지연', 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    border: 'border-l-red-500',
    icon: AlertCircle 
  },
  cancelled: { 
    label: '취소됨', 
    color: 'text-gray-600', 
    bg: 'bg-gray-50', 
    border: 'border-l-gray-500',
    icon: XCircle 
  },
  on_hold: { 
    label: '보류', 
    color: 'text-purple-600', 
    bg: 'bg-purple-50', 
    border: 'border-l-purple-500',
    icon: Clock 
  }
};

const priorityConfig = {
  critical: { label: '긴급', color: 'text-red-600', bg: 'bg-red-100' },
  high: { label: '높음', color: 'text-orange-600', bg: 'bg-orange-100' },
  medium: { label: '중간', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  low: { label: '낮음', color: 'text-green-600', bg: 'bg-green-100' }
};

export function MaintenanceCard({ task, onClick }: MaintenanceCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;

  return (
    <div
      className={`bg-background-secondary rounded-notion-md p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border-l-4 ${status.border}`}
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-notion-sm ${status.bg}`}>
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
          </div>
          <div>
            <h3 className="font-medium text-text-primary">{task.title}</h3>
            <p className="text-sm text-text-secondary mt-1">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${priority.bg} ${priority.color} font-medium`}>
            {priority.label}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${status.bg} ${status.color} font-medium`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{task.location}</span>
          {task.subLocation && <span className="text-text-tertiary">• {task.subLocation}</span>}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{new Date(task.scheduledDate).toLocaleDateString('ko-KR')}</span>
        </div>
        {task.equipmentName && (
          <div className="flex items-center gap-1">
            <Wrench className="w-4 h-4" />
            <span>{task.equipmentName}</span>
          </div>
        )}
      </div>

      {task.assignedTo && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">담당자: {task.assignedTo.name}</span>
            {task.workOrder && (
              <span className="text-text-tertiary">작업지시: {task.workOrder}</span>
            )}
          </div>
        </div>
      )}

      {task.safety?.permitRequired && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-warning-text bg-warning-bg px-2 py-1 rounded-full">
            작업허가서 필요
          </span>
          {task.safety.lockoutTagout && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
              LOTO 필요
            </span>
          )}
        </div>
      )}
    </div>
  );
}