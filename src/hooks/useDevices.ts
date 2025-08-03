import { useState, useEffect, useCallback } from 'react';
import { deviceFarmService } from '../services/deviceFarmService';
import type { TapResponse, SwipeResponse } from '../models/interfaces/Device';

export const useDevices = () => {
  const [devices, setDevices] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const deviceList = await deviceFarmService.getDevices();
      if (Array.isArray(deviceList)) {
        setDevices(deviceList);
      } else {
        setDevices([]);
        setError('Unexpected response format');
      }
    } catch (err) {
      setError('Failed to fetch devices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const tapAllDevices = useCallback(async (x: number, y: number): Promise<TapResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await deviceFarmService.tapAll(x, y);
      return response;
    } catch (err) {
      setError('Failed to send tap command');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const swipeAllDevices = useCallback(async (
    start_x: number, 
    start_y: number, 
    end_x: number, 
    end_y: number, 
    duration_ms: number = 300
  ): Promise<SwipeResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await deviceFarmService.swipeAll(start_x, start_y, end_x, end_y, duration_ms);
      return response;
    } catch (err) {
      setError('Failed to send swipe command');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const swipeDevice = useCallback(async (
    deviceSerial: string,
    start_x: number, 
    start_y: number, 
    end_x: number, 
    end_y: number, 
    duration_ms: number = 300
  ): Promise<SwipeResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await deviceFarmService.swipeDevice(deviceSerial, start_x, start_y, end_x, end_y, duration_ms);
      return response;
    } catch (err) {
      setError(`Failed to send swipe command to device ${deviceSerial}`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    fetchDevices,
    tapAllDevices,
    swipeAllDevices,
    swipeDevice,
  };
};
