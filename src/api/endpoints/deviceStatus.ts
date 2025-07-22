import apiClient from '../client';

/**
 * Get detailed ADB status information
 * @returns Promise with the ADB status data
 */
export const getAdbStatus = async () => {
  const response = await apiClient.get('/devices/status');
  return response.data;
};

/**
 * Restart ADB server
 * @returns Promise with the restart result
 */
export const restartAdb = async () => {
  const response = await apiClient.post('/devices/restart-adb');
  return response.data;
};