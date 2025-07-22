// src/models/interfaces/HydroSystem.ts

export interface SensorReading {
  id: number;
  temperature: number;
  humidity: number;
  light: number;
  moisture: number;
  water_level: number;
  created_at: string;
}
export interface SystemStatus {
  sensors: {
    temperature: number;
    humidity: number;
    light: number;
    moisture: number;
    water_level: number;
  };
  devices: {
    pump_state: boolean;
    light_state: boolean;
    fan_state: boolean;
    water_pump_state: boolean | null;
  };
  system: {
    scheduler_state: boolean;
  };
  automation: {
    rules_result: {
      actions: {
        pump: boolean;
        light: boolean;
        fan: boolean;
        water_refill: boolean;
      };
      alerts: string[];
      water_status: {
        status: string;
        message: string;
        priority: 'low' | 'medium' | 'high';
        current_level: number;
        min_threshold: number;
        critical_threshold: number;
      };
    };
    thresholds: {
      moisture_min: number;
      light_min: number;
      temperature_max: number;
      water_level_min: number;
      water_level_critical: number;
    };
  };
}


export interface SystemThresholds {
  moisture_min: number;
  light_min: number;
  temperature_max: number;
  water_level_min: number;
  water_level_critical: number;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
}

export interface SensorChartData {
  temperature: ChartDataPoint[];
  humidity: ChartDataPoint[];
  light: ChartDataPoint[];
  moisture: ChartDataPoint[];
  water_level: ChartDataPoint[];
}

export interface ControlAction {
  action: string;
  timestamp: string;
  success: boolean;
  message?: string;
}