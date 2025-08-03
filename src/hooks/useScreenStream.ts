import { useState, useEffect, useCallback, useRef } from 'react';
import { deviceScreenShotService } from '../services/deviceScreenShotService';
import type { StreamFrame } from '../models/interfaces/ScreenStream';

export const useScreenStream = (deviceSerial: string) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Take a single screenshot
  const takeScreenshot = useCallback(async () => {
    if (!deviceSerial) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await deviceScreenShotService.getScreenshot(deviceSerial);
      if (response && response.status === 'ok') {
        setCurrentFrame(response.image);
        return response.image;
      } else {
        setError('Failed to get screenshot');
        return null;
      }
    } catch (err) {
      setError('Error taking screenshot');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [deviceSerial]);

  // Start streaming
  const startStream = useCallback(() => {
    if (!deviceSerial || isStreaming) return;
    
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Create new WebSocket connection
      const ws = deviceScreenShotService.createScreenStreamConnection(
        deviceSerial,
        (data: StreamFrame) => {
          if (data && data.image) {
            setCurrentFrame(data.image);
          }
        },
        (error: Event) => {
          console.error('WebSocket error:', error);
          setError('Connection error');
          setIsStreaming(false);
        },
        () => {
          setIsStreaming(false);
          wsRef.current = null;
        }
      );
      
      ws.onopen = () => {
        setIsStreaming(true);
        setError(null);
      };
      
      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to start stream:', err);
      setError('Failed to start stream');
    }
  }, [deviceSerial, isStreaming]);

  // Stop streaming
  const stopStream = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    currentFrame,
    isStreaming,
    loading,
    error,
    takeScreenshot,
    startStream,
    stopStream
  };
};