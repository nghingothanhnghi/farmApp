/**
 * Formats a device serial number for display
 */
export const formatDeviceSerial = (serial: string): string => {
  // Example formatting logic
  if (serial.length > 10) {
    return `${serial.substring(0, 8)}...`;
  }
  return serial;
};

/**
 * Formats coordinates for display
 */
export const formatCoordinates = (x: number, y: number): string => {
  return `(${x}, ${y})`;
};

export const formatFileSize = (size: number): string => {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} Bytes`;
};


export const formatTimeCountDown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
};

