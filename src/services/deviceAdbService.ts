// src/services/deviceAdbService.ts

import apiClient from '../api/client';

export const deviceAdbService = {
  /**
   * Get detailed ADB status information
   * @returns Promise with the ADB status data
   */
  async getAdbStatus() {
    const response = await apiClient.get('/devices/status');
    return response.data;
  },

  /**
   * Restart ADB server
   * @returns Promise with the restart result
   */
  async restartAdb() {
    const response = await apiClient.post('/devices/restart-adb');
    return response.data;
  },
};
