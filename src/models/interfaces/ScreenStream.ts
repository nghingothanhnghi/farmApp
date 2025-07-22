export interface ScreenshotResponse {
  status: string;
  device_serial: string;
  image: string; // Base64 encoded image
}

export interface StreamFrame {
  device_serial: string;
  client_id: string;
  image: string; // Base64 encoded image
  timestamp: number;
}

export interface StreamStatusResponse {
  status: string;
  active_streams: Record<string, number>; // device_serial -> number of connected clients
}