// src/components/HydroponicSystemPage/components/ActivityLog.tsx
import React from 'react';
import type { ControlAction } from '../../../models/interfaces/HydroSystem';

interface ActivityLogProps {
  actions: ControlAction[];
  className?: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ actions, className }) => {
  const getActionIcon = (action: string, success: boolean) => {
    if (!success) return '❌';

    if (action.includes('Pump')) {
      return action.includes('ON') ? '🟢' : '🔴';
    }
    if (action.includes('Scheduler')) return '⏰';
    if (action.includes('Threshold')) return '⚙️';
    return '📝';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-100 p-6 ${className}`}
    >
      <h2 className="text-base font-semibold text-gray-800 mb-4">Activity Log</h2>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {actions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>No recent activity</p>
            <p className="text-sm">System actions will appear here</p>
          </div>
        ) : (
          actions.map((action, index) => (
            <div
              key={`${action.timestamp}-${index}`}
              className={`p-3 rounded-lg border transition-all duration-200 ${action.success
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
                }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg">
                  {getActionIcon(action.action, action.success)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {action.action}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${action.success
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {action.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  {action.message && (
                    <p className="text-xs text-gray-600 mt-1">
                      {action.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(action.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {actions.length > 0 && (
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-gray-500">
            Showing last {Math.min(actions.length, 10)} actions
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;