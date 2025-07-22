export interface Device {
  serial: string;
}

export interface TapResponse {
  status: string;
  x: number;
  y: number;
  devices: string[];
}

export interface SwipeResponse {
  status: string;
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  duration_ms: number;
  devices: string[];
}