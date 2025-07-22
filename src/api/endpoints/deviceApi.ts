// api/deviceApi.ts
import apiClient from '../client';
import type { TapResponse, SwipeResponse } from '../../models/interfaces/Device';

export const deviceApi = {
  /**
   * Get all connected devices
   */
  getDevices: async (): Promise<string[]> => {
    const response = await apiClient.get<{ status: string; message: string; devices: string[] }>('/devices');
    return response.data.devices;
  },

  /**
   * Send tap command to all devices
   */
  tapAll: async (x: number, y: number): Promise<TapResponse> => {
    const response = await apiClient.post('/tap', { x, y });
    // Include x and y in the response
    return { ...response.data, x, y };
  },

  /**
   * Send swipe command to all devices
   */
  swipeAll: async (
    start_x: number, 
    start_y: number, 
    end_x: number, 
    end_y: number, 
    duration_ms: number = 300
  ): Promise<SwipeResponse> => {
    const response = await apiClient.post('/tap/swipe', { 
      start_x, 
      start_y, 
      end_x, 
      end_y, 
      duration_ms 
    });
    return response.data;
  },

  /**
   * Send swipe command to a specific device
   */
  swipeDevice: async (
    deviceSerial: string,
    start_x: number, 
    start_y: number, 
    end_x: number, 
    end_y: number, 
    duration_ms: number = 300
  ): Promise<SwipeResponse> => {
    const response = await apiClient.post(`/tap/swipe/device/${deviceSerial}`, { 
      start_x, 
      start_y, 
      end_x, 
      end_y, 
      duration_ms 
    });
    return response.data;
  },
};