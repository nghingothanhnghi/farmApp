import type { SystemThresholds } from '../models/interfaces/HydroSystem';

export const defaultThresholds: SystemThresholds = {
  moisture_min: 30,
  light_min: 300,
  temperature_max: 28,
  water_level_min: 5,
  water_level_critical: 2
};
