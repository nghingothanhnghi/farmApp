// src/components/HydroponicSystemPage/HydroponicSystemPage.tsx
import React, { useState } from 'react';
import PageTitle from '../common/PageTitle';
import LinearProgress from '../common/LinearProgress';
import { useHydroSystem } from '../../hooks/useHydroSystem';

// Import dashboard components
import LocationPanel from './components/LocationPanel';
import StatusCard from './components/StatusCard';
import ControlPanel from './components/ControlPanel';
import SensorChart from './components/SensorChart';
import AlertsPanel from './components/AlertsPanel';
import SettingsPanel from './components/SettingsPanel';
import ActivityLog from './components/ActivityLog';
import Button from '../common/Button';

import './HydroponicSystemPage.css';

const HydroponicSystemPage: React.FC = () => {
  const {
    systemStatus,
    sensorData,
    thresholds,
    alerts,
    controlActions,
    loading,
    error,
    actions
  } = useHydroSystem();

  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'settings'>('overview');

  const getTemperatureStatus = () => {
    if (!systemStatus || !thresholds) return 'normal';
    if (systemStatus.sensors.temperature > thresholds.temperature_max) return 'error';
    if (systemStatus.sensors.temperature > thresholds.temperature_max * 0.9) return 'warning';
    return 'normal';
  };

  const getMoistureStatus = () => {
    if (!sensorData.length || !thresholds) return 'normal';
    const latestMoisture = sensorData[sensorData.length - 1]?.moisture;
    if (!latestMoisture) return 'normal';
    if (latestMoisture < thresholds.moisture_min) return 'error';
    if (latestMoisture < thresholds.moisture_min * 1.1) return 'warning';
    return 'normal';
  };

  const getLightStatus = () => {
    if (!sensorData.length || !thresholds) return 'normal';
    const latestLight = sensorData[sensorData.length - 1]?.light;
    if (!latestLight) return 'normal';
    if (latestLight < thresholds.light_min) return 'error';
    if (latestLight < thresholds.light_min * 1.1) return 'warning';
    return 'normal';
  };

  if (loading && !systemStatus) {
    return (
      <div className="hydroponic-system-page min-h-screen">
        <PageTitle title="Hydroponic System Dashboard" />
        <LinearProgress
          position='absolute'
          thickness="h-1"
          duration={3000}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hydroponic-system-page min-h-screen">
        <PageTitle title="Hydroponic System Dashboard" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            label='Retry Connection'
            onClick={actions.refreshData}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="hydroponic-system-page min-h-screen">
      <PageTitle
        title="Hydroponic System Dashboard"
        subtitle="Monitor and control your hydroponic growing system"
      />
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'charts', label: 'Charts', icon: '📈' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className='flex gap-6'>
            <div className='w-full lg:w-[800px]'>
              {/* Status Cards */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <StatusCard
                  title="Temperature"
                  value={systemStatus?.sensors?.temperature?.toFixed(1) || '--'}
                  unit="°C"
                  status={getTemperatureStatus()}
                  icon="🌡️"
                />
                <StatusCard
                  title="Humidity"
                  value={systemStatus?.sensors?.humidity?.toFixed(1) || '--'}
                  unit="%"
                  status="normal"
                  icon="💧"
                />
                <StatusCard
                  title="Moisture"
                  value={sensorData[sensorData.length - 1]?.moisture?.toFixed(1) || '--'}
                  unit="%"
                  status={getMoistureStatus()}
                  icon="🌱"
                />
                <StatusCard
                  title="Light"
                  value={sensorData[sensorData.length - 1]?.light?.toFixed(0) || '--'}
                  unit="lux"
                  status={getLightStatus()}
                  icon="☀️"
                />
              </div>
            </div>
            <div className='flex-1'>
              <LocationPanel/>
              {/* Control Panel */}
              <ControlPanel
                systemStatus={systemStatus}
                onPumpControl={actions.controlPump}
                onLightControl={actions.controlLight}
                onStartScheduler={actions.startSystemScheduler}
                onStopScheduler={actions.stopSystemScheduler}
                onRestartScheduler={actions.restartSystemScheduler}

                loading={loading}
              />
            </div>
          </div>


          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1 lg:order-1">
              <ControlPanel
                systemStatus={systemStatus}
                onPumpControl={actions.controlPump}
                onLightControl={actions.controlLight}
                onStartScheduler={actions.startSystemScheduler}
                onStopScheduler={actions.stopSystemScheduler}
                onRestartScheduler={actions.restartSystemScheduler}

                loading={loading}
              />
            </div>

            {/* Alerts Panel */}
            <div className="lg:col-span-1">
              <AlertsPanel
                alerts={alerts}
                onResolveAlert={actions.resolveAlert}
              />
            </div>

            {/* Activity Log */}
            <div className="lg:col-span-1">
              <ActivityLog actions={controlActions} />
            </div>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          <SensorChart
            data={sensorData}
            type="water_level"
            title="Water Level"
            unit="cm"
            color="#6366f1" // Indigo
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SensorChart
              data={sensorData}
              type="temperature"
              title="Temperature"
              unit="°C"
              color="#ef4444"
            />
            <SensorChart
              data={sensorData}
              type="humidity"
              title="Humidity"
              unit="%"
              color="#3b82f6"
            />
            <SensorChart
              data={sensorData}
              type="moisture"
              title="Soil Moisture"
              unit="%"
              color="#10b981"
            />
            <SensorChart
              data={sensorData}
              type="light"
              title="Light Level"
              unit="lux"
              color="#f59e0b"
            />
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <SettingsPanel
            thresholds={thresholds}
            onUpdateThresholds={actions.updateSystemThresholds}
            loading={loading}
          />
        </div>
      )}

      {/* Refresh Button */}
      <div className="fixed bottom-50 lg:bottom-6 right-6">
        <Button
          variant='secondary'
          label={loading ? '⟳' : '🔄'}
          onClick={actions.refreshData}
          disabled={loading}
        />
      </div>

    </div>
  );
};

export default HydroponicSystemPage;