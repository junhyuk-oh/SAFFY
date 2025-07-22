/**
 * 알림 컨테이너 컴포넌트
 * 전역 알림 메시지를 표시
 */

"use client"

import { useEffect } from 'react';
import { useNotificationStore } from '@/stores';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          const bgColor = colorMap[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-sm">
                <div className={`h-1 ${bgColor}`} />
                <div className="p-4">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 ${colorMap[notification.type].replace('bg-', 'text-')}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>
                      )}
                      {notification.action && (
                        <button
                          onClick={notification.action.onClick}
                          className="mt-2 text-sm font-medium text-primary hover:underline"
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}