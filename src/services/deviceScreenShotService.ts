import apiClient from '../api/client';
import { API_BASE_URL } from '../config/constants';

export const deviceScreenShotService = {
  /**
   * Get a single screenshot from a device
   * @param deviceSerial The device serial number
   * @returns Promise with the screenshot data
   */
  async getScreenshot(deviceSerial: string) {
    const response = await apiClient.get(`/screen/devices/${deviceSerial}/screenshot`);
    return response.data;
  },

  /**
   * Get the status of all active screen streams
   * @returns Promise with the stream status data
   */
  async getStreamStatus() {
    const response = await apiClient.get('/screen/stream/status');
    return response.data;
  },

  /**
   * Create a WebSocket connection for screen streaming
   * @param deviceSerial The device serial number
   * @param onMessage Callback function for received messages
   * @param onError Callback function for errors
   * @param onClose Callback function for connection close
   * @returns WebSocket instance
   */
  createScreenStreamConnection(
    deviceSerial: string,
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void
  ): WebSocket {
    // Convert http/https to ws/wss
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = API_BASE_URL.replace(/^https?:\/\//, '');
    const wsUrl = `${protocol}//${host}/screen/stream/${deviceSerial}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    if (onError) ws.onerror = onError;
    if (onClose) ws.onclose = onClose;

    return ws;
  },
};
