// src/services/schedulerService.ts
import apiClient from '../api/client';
import type { SchedulerHealth } from '../models/interfaces/Scheduler';

export const getSchedulerHealth = async (): Promise<SchedulerHealth> => {
  const response = await apiClient.get<SchedulerHealth>("/scheduler/health");
  return response.data;
};