// src/hooks/useStreaming.ts
import { useEffect, useRef } from 'react';
import { objectDetectionService } from '../services/objectDetectionService';
import type { DetectionResult } from '../models/interfaces/Camera';

export const useStreaming = ({
  streamMode,
  captureInterval,
  selectedModel,
  captureFrame,
  isStreaming,
  processDetectionResults,
  setAlert
}: {
  streamMode: string;
  captureInterval: number;
  selectedModel: string;
  captureFrame: () => string | null;
  isStreaming: boolean;
  processDetectionResults: (res: DetectionResult) => void;
  setAlert: (val: any) => void;
}) => {
  const streamIntervalRef = useRef<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isStreaming) return;

    if (streamMode === 'websocket') {
      wsRef.current = objectDetectionService.createWebSocketConnection();

      wsRef.current.onopen = () => {
        streamIntervalRef.current = setInterval(() => {
          const imageBase64 = captureFrame();
          if (imageBase64 && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ image: imageBase64, model_name: selectedModel }));
          }
        }, captureInterval);
      };

      wsRef.current.onmessage = (event) => {
        const data: DetectionResult = JSON.parse(event.data);
        data.error
          ? setAlert({ message: `Detection error: ${data.error}`, type: 'warning' })
          : processDetectionResults(data);
      };

      wsRef.current.onerror = () => setAlert({ message: 'WebSocket connection failed', type: 'error' });
      wsRef.current.onclose = () => console.log('WebSocket closed');
    } else {
      streamIntervalRef.current = setInterval(async () => {
        try {
          const imageBase64 = captureFrame();
          if (imageBase64) {
            const result = await objectDetectionService.detectObjectsBase64(imageBase64, selectedModel);
            processDetectionResults(result);
          }
        } catch {
          setAlert({ message: 'HTTP stream error occurred', type: 'error' });
        }
      }, captureInterval);
    }

    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [isStreaming, streamMode, selectedModel]);
};
