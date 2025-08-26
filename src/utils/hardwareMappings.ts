// src/utils/hardwareMappings.ts
import type { HardwareType } from '../models/interfaces/HardwareDetection';

// Shared mapping from detection class → hardware type
export const classToHardwareType: Record<string, HardwareType> = {
  pump: 'pump',
  water_pump: 'water_pump',
  light: 'light',
  fan: 'fan',
  valve: 'valve',
  sensor: 'sensor',
  relay: 'relay',
  controller: 'controller',
  tank: 'tank',
  pipe: 'pipe',
  cable: 'cable',
  other: 'other',
};

// Centralized color palettes for hardware types
export const hardwareColors = {
  canvas: {
    pump: '#3B82F6',      // blue
    light: '#F59E0B',     // amber
    sensor: '#10B981',    // emerald
    fan: '#8B5CF6',       // violet
    valve: '#EF4444',     // red
    other: '#6B7280',     // gray
  },
  tailwind: {
    pump: 'bg-blue-100 text-blue-800',
    light: 'bg-amber-100 text-amber-800',
    sensor: 'bg-emerald-100 text-emerald-800',
    fan: 'bg-violet-100 text-violet-800',
    valve: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800',
  },
};
