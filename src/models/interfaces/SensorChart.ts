// src/models/interfaces/SensorChart.ts
import type { SensorReading } from './HydroSystem';
import type { ChartTypeOption } from '../types/ChartType';

export interface SensorChartProps {
  data: SensorReading[];
  type: 'temperature' | 'humidity' | 'light' | 'moisture' | 'water_level';
  title: string;
  unit: string;
  color: string;
  chartType?: ChartTypeOption;
}
