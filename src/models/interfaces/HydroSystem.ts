// src/models/interfaces/HydroSystem.ts
export interface HydroDevice {
  id: number;
  name: string;
  device_id: string;
  location: string;
  type: string;
  is_active: boolean;
  client_id: string;
  user_id: number;
  thresholds: Record<string, any>;
  created_at: string;
  updated_at: string | null;
}

export interface SensorReading {
  id: number;
  temperature: number;
  humidity: number;
  light: number;
  moisture: number;
  water_level: number;
  created_at: string;
}
export interface DeviceActuatorState {
  pump: boolean;
  light: boolean;
  fan: boolean;
  water_pump: boolean | null;
}

export interface SchedulerState {
  scheduler_state: boolean;
}
export interface WaterStatus {
  status: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  current_level: number;
  min_threshold: number;
  critical_threshold: number;
}
export interface AutomationRulesResult {
  actions: {
    pump: boolean;
    light: boolean;
    fan: boolean;
    water_refill: boolean;
  };
  alerts: string[];
  water_status: WaterStatus;
}

export interface AutomationConfig {
  rules_result: AutomationRulesResult;
  thresholds: SystemThresholds;
}
export interface SystemStatusPerDevice {
  device_id: number;
  device_name: string;
  sensors: Omit<SensorReading, 'id' | 'created_at'>;
  actuators: DeviceActuatorState;
  system: SchedulerState;
  automation: AutomationConfig;
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