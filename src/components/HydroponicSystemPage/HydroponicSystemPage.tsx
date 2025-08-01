// src/components/HydroponicSystemPage/HydroponicSystemPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PageTitle from '../common/PageTitle';
import LinearProgress from '../common/LinearProgress';
import DropdownButton from '../common/DropdownButton';
import WaterLevelBucket from '../common/chartCustom/WaterLevelBucket';
import { IconPlus } from '@tabler/icons-react';
import { useHydroSystem } from '../../hooks/useHydroSystem';
import type { SystemStatusPerDevice } from '../../models/interfaces/HydroSystem';

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
    deviceStatusList,
    sensorData,
    thresholds,
    alerts,
    controlActions,
    loading,
    error,
    actions
  } = useHydroSystem();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'settings'>('overview');

  const [activeDeviceId, setActiveDeviceId] = useState<number | null>(null);

  // Automatically select first device on load
  useEffect(() => {
    if (!activeDeviceId && deviceStatusList.length > 0) {
      setActiveDeviceId(deviceStatusList[0].device_id);
    }
  }, [deviceStatusList, activeDeviceId]);

  // Find current device or fallback
  const currentDevice = useMemo<SystemStatusPerDevice | null>(() => {
    if (!deviceStatusList.length) return null;
    return (
      deviceStatusList.find((d) => d.device_id === activeDeviceId) ??
      deviceStatusList[0]
    );
  }, [deviceStatusList, activeDeviceId]);

  const getTemperatureStatus = () => {
    if (!currentDevice) return 'normal';
    const deviceThresholds = currentDevice.automation?.thresholds;
    const temp = currentDevice.sensors?.temperature;
    if (temp === undefined || !deviceThresholds) return 'normal';
    if (temp > deviceThresholds.temperature_max) return 'error';
    if (temp > deviceThresholds.temperature_max * 0.9) return 'warning';
    return 'normal';
  };

  const getMoistureStatus = () => {
    if (!currentDevice) return 'normal';
    const deviceThresholds = currentDevice.automation?.thresholds;
    const moisture = currentDevice.sensors?.moisture;
    if (moisture === undefined || !deviceThresholds) return 'normal';
    if (moisture < deviceThresholds.moisture_min) return 'error';
    if (moisture < deviceThresholds.moisture_min * 1.1) return 'warning';
    return 'normal';
  };

  const getLightStatus = () => {
    if (!currentDevice) return 'normal';
    const deviceThresholds = currentDevice.automation?.thresholds;
    const light = currentDevice.sensors?.light;
    if (light === undefined || !deviceThresholds) return 'normal';
    if (light < deviceThresholds.light_min) return 'error';
    if (light < deviceThresholds.light_min * 1.1) return 'warning';
    return 'normal';
  };

  const getWaterLevelStatus = () => {
    if (!currentDevice) return 'normal';
    const deviceThresholds = currentDevice.automation?.thresholds;
    const waterLevel = currentDevice.sensors?.water_level;
    if (waterLevel === undefined || !deviceThresholds) return 'normal';
    if (waterLevel < deviceThresholds.water_level_critical) return 'error';
    if (waterLevel < deviceThresholds.water_level_min) return 'warning';
    return 'normal';
  };


  if (loading && !deviceStatusList) {
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
        <PageTitle
          title="Hydroponic System Dashboard"
        />
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

  console.log("Device List:", deviceStatusList);
  console.log("Active Device ID:", activeDeviceId);
  console.log("Current Device:", currentDevice);

  return (
    <div className="hydroponic-system-page min-h-screen">
      <PageTitle
        title="Hydroponic System Dashboard"
        subtitle="Monitor and control your hydroponic growing system"
        actions={
          <div className='flex space-x-0.5'>
            {/* Device Selector */}
            <DropdownButton
              label={
                currentDevice
                  ? `Device: ${currentDevice.device_name || `ID ${currentDevice.device_id}`}`
                  : 'Select Device'
              }
              items={deviceStatusList
                .filter((device) => device?.device_id !== undefined)
                .map((device) => ({
                  label: device.device_name || `Device ID ${device.device_id}`,
                  value: device.device_id.toString(),
                }))}
              onSelect={(item) => setActiveDeviceId(Number(item.value))}
              className='bg-transparent'
            />
            <Button
              variant="secondary"
              icon={<IconPlus size={18} />}
              iconOnly
              label="Close"
              className='bg-transparent'
              onClick={() => navigate('/hydro-devices')}
            />
          </div>
        }
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
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='flex-1'>

            </div>
            <div className='lg:w-[350px] space-y-0.5'>
              <LocationPanel title='Location A' description='A location have 3 sensor devices, as: water pump, temperator sensor...' />
              {/* Control Panel */}
              <ControlPanel
                systemStatus={currentDevice}
                onPumpControl={(turnOn) => {
                  if (currentDevice?.device_id) {
                    actions.controlPump(currentDevice.device_id, turnOn);
                  }
                }}
                onLightControl={(turnOn) => {
                  if (currentDevice?.device_id) {
                    actions.controlLight(currentDevice.device_id, turnOn);
                  }
                }}
                onStartScheduler={() => {
                  if (currentDevice?.device_id) {
                    actions.startSystemScheduler(currentDevice.device_id);
                  }
                }}
                onStopScheduler={() => {
                  if (currentDevice?.device_id) {
                    actions.stopSystemScheduler(currentDevice.device_id);
                  }
                }}
                onRestartScheduler={() => {
                  if (currentDevice?.device_id) {
                    actions.restartSystemScheduler(currentDevice.device_id);
                  }
                }}
                loading={loading}
              />
            </div>
          </div>
          {/* Main Dashboard Grid */}
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='flex-1'>
              {/* Status Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 lg:grid-rows-2 gap-6">
                <StatusCard
                  className='row-span-2'
                  title="Water Level"
                  value={currentDevice?.sensors?.water_level?.toFixed(1) || '--'}
                  unit="%"
                  status={getWaterLevelStatus()}
                  icon="🚰">
                  <WaterLevelBucket level={currentDevice?.sensors?.water_level || 0} />
                </StatusCard>

                <StatusCard
                  title="Temperature"
                  value={currentDevice?.sensors?.temperature?.toFixed(1) || '--'}
                  unit="°C"
                  status={getTemperatureStatus()}
                  icon="🌡️"
                />
                <StatusCard
                  title="Humidity"
                  value={currentDevice?.sensors?.humidity?.toFixed(1) || '--'}
                  unit="%"
                  status="normal"
                  icon="💧"
                />
                <StatusCard
                  title="Moisture"
                  value={currentDevice?.sensors?.moisture?.toFixed(1) || '--'}
                  unit="%"
                  status={getMoistureStatus()}
                  icon="🌱"
                />
                <StatusCard
                  title="Light"
                  value={currentDevice?.sensors?.light?.toFixed(0) || '--'}
                  unit="lux"
                  status={getLightStatus()}
                  icon="☀️"
                />
              </div>
            </div>
            <div className='lg:w-[350px] space-y-4'>
              {/* Activity Log */}
              <ActivityLog actions={controlActions} />
              {/* Alerts Panel */}
              <AlertsPanel
                alerts={alerts}
                onResolveAlert={actions.resolveAlert}
              />
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
            thresholds={currentDevice?.automation?.thresholds || null}
            onUpdateThresholds={(newThresholds) => {
              if (!currentDevice) return;
              actions.updateSystemThresholds(currentDevice.device_id, newThresholds);
            }}
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