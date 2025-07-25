"use client";

import { memo } from 'react';
import { MaintenanceTask } from '@/lib/types/facility';
import { Wrench, Clock, AlertCircle, CheckCircle, XCircle, Calendar, MapPin } from 'lucide-react';
import { MAINTENANCE_STATUS, PRIORITY_CONFIG } from '@/lib/constants/status';
import { formatDateTime } from '@/lib/utils/date';

interface MaintenanceCardProps {
  task: MaintenanceTask;
  onClick?: (task: MaintenanceTask) => void;
}


export const MaintenanceCard = memo(function MaintenanceCard({ task, onClick }: MaintenanceCardProps) {
  const status = MAINTENANCE_STATUS[task.status];
  const priority = PRIORITY_CONFIG[task.priority];
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
          <span>{formatDateTime(task.scheduledDate, { includeTime: false })}</span>
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
});