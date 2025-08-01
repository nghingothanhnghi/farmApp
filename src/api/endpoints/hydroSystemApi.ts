// src/api/endpoints/hydroSystemApi.ts
import apiClient from '../client';
import type { 
  SensorReading, 
  SystemStatusPerDevice,
  SystemThresholds as Thresholds, // You can alias if needed
} from '../../models/interfaces/HydroSystem';

// Optional: Define this here if not already in HydroSystem.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
// Get Hydro System Status - returns array of devices or single device
export const getSystemStatus = async (device_id?: number): Promise<SystemStatusPerDevice[]> => {
  const response = await apiClient.get<SystemStatusPerDevice[]>('/hydro/status', {
    params: device_id ? { device_id } : {},
  });
  return response.data;
};

// Pump Controls
export const turnPumpOn = async (device_id?: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(
    '/hydro/pump/on',
    null,
    { params: { device_id } }
  );
  return response.data;
};

export const turnPumpOff = async (device_id?: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(
    '/hydro/pump/off',
    null,
    { params: { device_id } }
  );
  return response.data;
};

// Light Controls
export const turnLightOn = async (device_id?: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(
    '/hydro/light/on',
    null,
    { params: { device_id } }
  );
  return response.data;
};

export const turnLightOff = async (device_id?: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(
    '/hydro/light/off',
    null,
    { params: { device_id } }
  );
  return response.data;
};

// Fan Controls
export const turnFanOn = async (device_id?: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(
    '/hydro/fan/on',
    null,
    { params: { device_id } }
  );
  return response.data;
};

export const turnFanOff = async (device_id?: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(
    '/hydro/fan/off',
    null,
    { params: { device_id } }
  );
  return response.data;
};

// Water Pump Controls
export const turnWaterPumpOn = async (device_id?: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(
    '/hydro/water-pump/on',
    null,
    { params: { device_id } }
  );
  return response.data;
};

export const turnWaterPumpOff = async (device_id?: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>(
    '/hydro/water-pump/off',
    null,
    { params: { device_id } }
  );
  return response.data;
};

// Scheduler Controls
export const startScheduler = async (device_id: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/scheduler/start');
  return response.data;
};

export const stopScheduler = async (device_id: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/scheduler/stop');
  return response.data;
};

export const restartScheduler = async (device_id: number): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/scheduler/restart');
  return response.data;
};

// Get Latest Sensor Data
export const getLatestSensorData = async (): Promise<SensorReading[]> => {
  const response = await apiClient.get<SensorReading[]>('/sensor/data');
  return response.data;
};

// Get Thresholds
export const getThresholds = async (): Promise<Thresholds> => {
  const response = await apiClient.get<Thresholds>('/sensor/thresholds');
  return response.data;
};

// Update Thresholds
export const updateThresholds = async (
device_id: number, thresholds: Partial<Thresholds>): Promise<ApiResponse<Thresholds>> => {
  const response = await apiClient.post<ApiResponse<Thresholds>>('/sensor/thresholds', thresholds);
  return response.data;
};