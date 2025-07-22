// src/components/HydroponicSystemPage/components/AlertsPanel.tsx
import React from 'react';
import type { SystemAlert } from '../../../models/interfaces/HydroSystem';
import Button from '../../common/Button';

interface AlertsPanelProps {
  alerts: SystemAlert[];
  onResolveAlert: (alertId: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onResolveAlert
}) => {
  const activeAlerts = alerts.filter(alert => !alert.resolved);

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'error':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getAlertColor = (type: SystemAlert['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-400 bg-red-50';
      case 'warning':
        return 'border-yellow-400 bg-yellow-50';
      case 'info':
        return 'border-blue-400 bg-blue-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">System Alerts</h2>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            activeAlerts.length > 0 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {activeAlerts.length} Active
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">✅</div>
            <p>No active alerts</p>
            <p className="text-sm">System is running normally</p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertColor(alert.type)} transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getAlertIcon(alert.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                label="Resolve"
                  onClick={() => onResolveAlert(alert.id)}
                  className="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white"
                />
      
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.filter(alert => alert.resolved).length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer hover:text-gray-800">
              View resolved alerts ({alerts.filter(alert => alert.resolved).length})
            </summary>
            <div className="mt-2 space-y-2">
              {alerts
                .filter(alert => alert.resolved)
                .slice(0, 5)
                .map((alert) => (
                  <div key={alert.id} className="p-2 bg-gray-50 rounded text-xs">
                    <span className="text-gray-500">✓</span> {alert.message}
                    <span className="text-gray-400 ml-2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;