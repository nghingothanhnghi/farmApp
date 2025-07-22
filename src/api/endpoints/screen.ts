import apiClient from '../client';
import { API_BASE_URL } from '../../config/constants';

/**
 * Get a single screenshot from a device
 * @param deviceSerial The device serial number
 * @returns Promise with the screenshot data
 */
export const getScreenshot = async (deviceSerial: string) => {
  const response = await apiClient.get(`/screen/devices/${deviceSerial}/screenshot`);
  return response.data;
};

/**
 * Get the status of all active screen streams
 * @returns Promise with the stream status data
 */
export const getStreamStatus = async () => {
  const response = await apiClient.get('/screen/stream/status');
  return response.data;
};

/**
 * Create a WebSocket connection for screen streaming
 * @param deviceSerial The device serial number
 * @param onMessage Callback function for received messages
 * @param onError Callback function for errors
 * @param onClose Callback function for connection close
 * @returns WebSocket instance
 */
export const createScreenStreamConnection = (
  deviceSerial: string,
  onMessage: (data: any) => void,
  onError?: (error: Event) => void,
  onClose?: (event: CloseEvent) => void
): WebSocket => {
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
  
  if (onError) {
    ws.onerror = onError;
  }
  
  if (onClose) {
    ws.onclose = onClose;
  }
  
  return ws;
};