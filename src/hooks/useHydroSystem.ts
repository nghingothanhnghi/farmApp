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
  SystemStatus,
  SystemThresholds as Thresholds
} from '../models/interfaces/HydroSystem';

export const useHydroSystem = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [controlActions, setControlActions] = useState<ControlAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch system status
  const fetchSystemStatus = useCallback(async () => {
    try {
      const status = await getSystemStatus();
      setSystemStatus(status);
      checkForAlerts(status);
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

  // Fetch thresholds
  const fetchThresholds = useCallback(async () => {
    try {
      const thresholdData = await getThresholds();
      setThresholds(thresholdData);
    } catch (err) {
      setError('Failed to fetch thresholds');
      console.error('Error fetching thresholds:', err);
    }
  }, []);

  // Check for alerts based on current status and thresholds
  const checkForAlerts = useCallback((status: SystemStatus) => {
    if (!thresholds) return;

    const newAlerts: SystemAlert[] = [];
    const { sensors } = status;

    if (sensors.temperature > thresholds.temperature_max) {
      newAlerts.push({
        id: `temp-${Date.now()}`,
        type: 'warning',
        message: `Temperature too high: ${status.sensors.temperature}°C (max: ${thresholds.temperature_max}°C)`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }

    if (sensors.moisture < thresholds.moisture_min) {
      newAlerts.push({
        id: `moisture-${Date.now()}`,
        type: 'warning',
        message: `Soil moisture too low: ${sensors.moisture}% (min: ${thresholds.moisture_min}%)`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }

    if (sensors.light < thresholds.light_min) {
      newAlerts.push({
        id: `light-${Date.now()}`,
        type: 'info',
        message: `Light intensity low: ${sensors.light} lx (min: ${thresholds.light_min} lx)`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }

    if (sensors.water_level < thresholds.water_level_critical) {
      newAlerts.push({
        id: `water-critical-${Date.now()}`,
        type: 'error',
        message: `Critical water level: ${sensors.water_level}% (critical: ${thresholds.water_level_critical}%)`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    } else if (sensors.water_level < thresholds.water_level_min) {
      newAlerts.push({
        id: `water-low-${Date.now()}`,
        type: 'warning',
        message: `Low water level: ${sensors.water_level}% (min: ${thresholds.water_level_min}%)`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }



    // Add more alert conditions as needed
    setAlerts(prev => [...prev.filter(alert => !alert.resolved), ...newAlerts]);
  }, [thresholds]);

  // Control actions
  const controlPump = useCallback(async (turnOn: boolean) => {
    try {
      const result = turnOn ? await turnPumpOn() : await turnPumpOff();
      const action: ControlAction = {
        action: `Pump ${turnOn ? 'ON' : 'OFF'}`,
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]); // Keep last 10 actions
      await fetchSystemStatus(); // Refresh status
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
  }, [fetchSystemStatus]);

  const controlLight = useCallback(async (turnOn: boolean) => {
    try {
      const result = turnOn ? await turnLightOn() : await turnLightOff();
      const action: ControlAction = {
        action: `Light ${turnOn ? 'ON' : 'OFF'}`,
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]); // Keep last 10 actions
      await fetchSystemStatus(); // Refresh status
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
  }, [fetchSystemStatus]);

  const startSystemScheduler = useCallback(async () => {
    try {
      const result = await startScheduler();
      const action: ControlAction = {
        action: 'Start Scheduler',
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
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
  }, []);


  const stopSystemScheduler = useCallback(async () => {
    try {
      const result = await stopScheduler();
      const action: ControlAction = {
        action: 'Stop Scheduler',
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
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
  }, []);

  const restartSystemScheduler = useCallback(async () => {
    try {
      const result = await restartScheduler();
      const action: ControlAction = {
        action: 'Restart Scheduler',
        timestamp: new Date().toISOString(),
        success: true,
        message: result.status
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
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
  }, []);


  const updateSystemThresholds = useCallback(async (newThresholds: Partial<Thresholds>) => {
    try {
      const result = await updateThresholds(newThresholds);
      setThresholds(result.data);
      const action: ControlAction = {
        action: 'Update Thresholds',
        timestamp: new Date().toISOString(),
        success: true,
        message: 'Thresholds updated successfully'
      };
      setControlActions(prev => [action, ...prev.slice(0, 9)]);
    } catch (err) {
      setError('Failed to update thresholds');
    }
  }, []);

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
          fetchSystemStatus(),
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
  }, [fetchSystemStatus, fetchSensorData, fetchThresholds]);

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSystemStatus();
      fetchSensorData();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchSystemStatus, fetchSensorData]);

  return {
    systemStatus,
    sensorData,
    thresholds,
    alerts,
    controlActions,
    loading,
    error,
    actions: {
      controlPump,
      controlLight,
      startSystemScheduler,
      stopSystemScheduler,
      restartSystemScheduler,
      updateSystemThresholds,
      resolveAlert,
      refreshData: () => {
        fetchSystemStatus();
        fetchSensorData();
        fetchThresholds();
      }
    }
  };
};