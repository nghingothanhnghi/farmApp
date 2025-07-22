// src/api/endpoints/hydroSystemApi.ts
import apiClient from '../client';
import type { 
  SensorReading, 
  SystemStatus,
  SystemThresholds as Thresholds, // You can alias if needed
} from '../../models/interfaces/HydroSystem';

// Optional: Define this here if not already in HydroSystem.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Get Hydro System Status
export const getSystemStatus = async (): Promise<SystemStatus> => {
  const response = await apiClient.get<SystemStatus>('/hydro/status');
  return response.data;
};

// Pump Controls
export const turnPumpOn = async (): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/pump/on');
  return response.data;
};

export const turnPumpOff = async (): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/pump/off');
  return response.data;
};

// Light Controls
export const turnLightOn = async (): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/light/on');
  return response.data;
};

export const turnLightOff = async (): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/light/off');
  return response.data;
};

// Scheduler Controls
export const startScheduler = async (): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/scheduler/start');
  return response.data;
};

export const stopScheduler = async (): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/hydro/scheduler/stop');
  return response.data;
};

export const restartScheduler = async (): Promise<{ status: string }> => {
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
  thresholds: Partial<Thresholds>
): Promise<ApiResponse<Thresholds>> => {
  const response = await apiClient.post<ApiResponse<Thresholds>>('/sensor/thresholds', thresholds);
  return response.data;
};