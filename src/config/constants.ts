// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// App Configuration
export const APP_NAME = 'Device Controller';
export const APP_VERSION = '1.0.0';

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
};

// Default Values
export const DEFAULT_TAP_COORDINATES = {
  x: 500,
  y: 500,
};