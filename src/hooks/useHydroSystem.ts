// src/hooks/useHydroSystem.ts
import { useState, useEffect, useCallback } from 'react';
import {
  getSystemStatus,
  getLatestSensorData,
  getThresholds,
  updateThresholds,
  turnPumpOn,
  turnPumpOff,
  turnLightOn,
  turnLightOff,
  startScheduler,
  stopScheduler,
  restartScheduler
} from '../api/endpoints/hydroSystemApi';
import type {
  SystemAlert,
  ControlAction,
  SensorReading,
  SystemStatusPerDevice,
  SystemThresholds as Thresholds
} from '../models/interfaces/HydroSystem';

export const useHydroSystem = () => {
  const [deviceStatusList, setDeviceStatusList] = useState<SystemStatusPerDevice[]>([]);
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [controlActions, setControlActions] = useState<ControlAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get thresholds for a specific device
  const getDeviceThresholds = useCallback((device_id: number): Thresholds | null => {
    const device = deviceStatusList.find(d => d.device_id === device_id);
    return device?.automation?.thresholds || null;
  }, [deviceStatusList]);

  // Fetch system status
  const fetchSystemStatusPerDevice = useCallback(async () => {
    try {
      const statusList = await getSystemStatus(); // API now returns array
      setDeviceStatusList(statusList); // Direct assignment
      checkForAlerts(statusList);      // Direct assignment
    } catch (err) {
      setError('Failed to fetch system status');
      console.error('Error fetching system status:', err);
    }
  }, []);

  // Fetch sensor data
  const fetchSensorData = useCallback(async () => {
    try {
      const data = await getLatestSensorData();
      setSensorData(data);
    } catch (err) {
      setError('Failed to fetch sensor data');
      console.error('Error fetching sensor data:', err);
    }
  }, []);

  // Fetch thresholds - now extracted from device data
  const fetchThresholds = useCallback(async () => {
    try {
      const thresholdData = await getThresholds();
      setThresholds(thresholdData);
    } catch (err) {
      setError('Failed to fetch thresholds');
      console.error('Error fetching thresholds:', err);
    }
  }, []);

  // Check for alerts based on current status and device-specific thresholds
  const checkForAlerts = useCallback((statuses: SystemStatusPerDevice[]) => {
    const newAlerts: SystemAlert[] = [];

    statuses.forEach(status => {
      const { sensors, device_id, device_name, automation } = status;
      const deviceThresholds = automation?.thresholds;
      
      if (!deviceThresholds) return; // Skip if no thresholds for this device

      if (sensors.temperature > deviceThresholds.temperature_max) {
        newAlerts.push({
          id: `temp-${device_id}-${Date.now()}`,
          type: 'warning',
          message: `${device_name}: Temperature too high: ${sensors.temperature}°C (max: ${deviceThresholds.temperature_max}°C)`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      if (sensors.moisture < deviceThresholds.moisture_min) {
        newAlerts.push({
          id: `moisture-${device_id}-${Date.now()}`,
          type: 'warning',
          message: `${device_name}: Soil moisture too low: ${sensors.moisture}% (min: ${deviceThresholds.moisture_min}%)`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      if (sensors.light < deviceThresholds.light_min) {
        newAlerts.push({
          id: `light-${device_id}-${Date.now()}`,
          type: 'info',
          message: `${device_name}: Light intensity low: ${sensors.light} lx (min: ${deviceThresholds.light_min} lx)`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      if (sensors.water_level < deviceThresholds.water_level_critical) {
        newAlerts.push({
          id: `water-critical-${device_id}-${Date.now()}`,
          type: 'error',
          message: `${device_name}: Critical water level: ${sensors.water_level}% (critical: ${deviceThresholds.water_level_critical}%)`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      } else if (sensors.water_level < deviceThresholds.water_level_min) {
        newAlerts.push({
          id: `water-low-${device_id}-${Date.now()}`,
          type: 'warning',
          message: `${device_name}: Low water level: ${sensors.water_level}% (min: ${deviceThresholds.water_level_min}%)`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }
    });

    setAlerts(prev => [...prev.filter(alert => !alert.resolved), ...newAlerts]);
  }, []);

  // Control actions per device
  const controlPump = useCallback(async (device_id: number, turnOn: boolean) => {
    try {
      const result = turnOn ? await turnPumpOn(device_id) : await turnPumpOff(device_id);
      const action: ControlAction = {
        action: `Pump ${turnOn ? 'ON' : 'OFF'}`,
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      await fetchSystemStatusPerDevice(); // optionally pass device_id if fetch is per-device
    } catch (err) {
      const action: ControlAction = {
        action: `Pump ${turnOn ? 'ON' : 'OFF'}`,
        timestamp: new Date().toISOString(),
        success: false,
        message: 'Failed to control pump'
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      setError('Failed to control pump');
    }
  }, [fetchSystemStatusPerDevice]);


  const controlLight = useCallback(async (device_id: number, turnOn: boolean) => {
    try {
      const result = turnOn ? await turnLightOn(device_id) : await turnLightOff(device_id);
      const action: ControlAction = {
        action: `Light ${turnOn ? 'ON' : 'OFF'}`,
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]); // Keep last 10 actions
      await fetchSystemStatusPerDevice(); // Refresh status
    } catch (err) {
      const action: ControlAction = {
        action: `Light ${turnOn ? 'ON' : 'OFF'}`,
        timestamp: new Date().toISOString(),
        success: false,
        message: 'Failed to control light'
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      setError('Failed to control light');
    }
  }, [fetchSystemStatusPerDevice]);

  const startSystemScheduler = useCallback(async (device_id: number) => {
    try {
      const result = await startScheduler(device_id);
      const action: ControlAction = {
        action: 'Start Scheduler',
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      await fetchSystemStatusPerDevice();
    } catch (err) {
      const action: ControlAction = {
        action: 'Start Scheduler',
        timestamp: new Date().toISOString(),
        success: false,
        message: 'Failed to start scheduler'
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      setError('Failed to start scheduler');
    }
  }, [fetchSystemStatusPerDevice]);


  const stopSystemScheduler = useCallback(async (device_id: number) => {
    try {
      const result = await stopScheduler(device_id);
      const action: ControlAction = {
        action: 'Stop Scheduler',
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      await fetchSystemStatusPerDevice();
    } catch (err) {
      const action: ControlAction = {
        action: 'Stop Scheduler',
        timestamp: new Date().toISOString(),
        success: false,
        message: 'Failed to stop scheduler'
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      setError('Failed to stop scheduler');
    }
  }, [fetchSystemStatusPerDevice]);

  const restartSystemScheduler = useCallback(async (device_id: number) => {
    try {
      const result = await restartScheduler(device_id);
      const action: ControlAction = {
        action: 'Restart Scheduler',
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      await fetchSystemStatusPerDevice();
    } catch (err) {
      const action: ControlAction = {
        action: 'Restart Scheduler',
        timestamp: new Date().toISOString(),
        success: false,
        message: 'Failed to restart scheduler'
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      setError('Failed to restart scheduler');
    }
  }, [fetchSystemStatusPerDevice]);


  const updateSystemThresholds = useCallback(async (device_id: number, newThresholds: Partial<Thresholds>) => {
    try {
      const result = await updateThresholds(device_id, newThresholds);
      setThresholds(result.data);
      const action: ControlAction = {
        action: `Update Thresholds (Device ${device_id})`,
        timestamp: new Date().toISOString(),
        success: true,
        message: 'Thresholds updated successfully'
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
      await fetchSystemStatusPerDevice();
    } catch (err) {
      setError('Failed to update thresholds');
    }
  }, [fetchSystemStatusPerDevice]);

  // Resolve alert
  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSystemStatusPerDevice(),
          fetchSensorData(),
          fetchThresholds()
        ]);
      } catch (err) {
        setError('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchSystemStatusPerDevice, fetchSensorData, fetchThresholds]);

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSystemStatusPerDevice();
      fetchSensorData();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchSystemStatusPerDevice, fetchSensorData]);

  return {
    deviceStatusList,     // Devices and their current sensor/control states
    sensorData,           // Latest readings
    thresholds,           // Thresholds (global or per device)
    alerts,               // Active system alerts
    controlActions,       // Log of control actions
    loading, error,       // For UI feedback
    actions: {
      controlPump,
      controlLight,
      startSystemScheduler,
      stopSystemScheduler,
      restartSystemScheduler,
      updateSystemThresholds,
      resolveAlert,
      getDeviceThresholds,
      refreshData: () => {
        fetchSystemStatusPerDevice();
        fetchSensorData();
        fetchThresholds();
      }
    }
  };
};