// src/hooks/useCamera.ts
import { useRef, useState, useEffect, useCallback } from 'react';
import { objectDetectionService } from '../services/objectDetectionService';
import type { Detection, DetectionResult, ARCameraProps } from '../models/interfaces/Camera';


export const useCamera = ({
  modelName,
  captureInterval,
  streamMode,
  showAnnotatedImage,
  onDetection,
  onError,
}: ARCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamIntervalRef = useRef<number | null>(null);

  const [detections, setDetections] = useState<Detection[]>([]);
  const [annotatedImageSrc, setAnnotatedImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera error:', err);
        onError?.('Could not access camera. Please ensure permissions are granted.');
      }
    };

    setupCamera();

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
      }

      const tracks = videoRef.current?.srcObject instanceof MediaStream
        ? videoRef.current.srcObject.getTracks()
        : [];

      tracks.forEach((track) => track.stop());
    };
  }, [onError]);

  useEffect(() => {
    if (streamMode === 'websocket') {
      initWebSocketStream();
    } else {
      initHttpStream();
    }

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [streamMode, captureInterval, modelName]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!video || !canvas || !context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = canvas.toDataURL('image/jpeg', 0.8).split(',')[1] || null;
  console.log('Captured frame:', frame);
  return frame;
  }, []);

  const processDetectionResults = (results: DetectionResult) => {
    if (results.detections) {
      setDetections(results.detections);
    }
    if (results.annotated_image && showAnnotatedImage) {
      setAnnotatedImageSrc(`data:image/jpeg;base64,${results.annotated_image}`);
       console.log('Updated annotated image:', annotatedImageSrc);
    }
    onDetection?.(results);
  };

  const initWebSocketStream = () => {
    try {
      wsRef.current = objectDetectionService.createWebSocketConnection();

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        streamIntervalRef.current = setInterval(() => {
          const imageBase64 = captureFrame();
          if (imageBase64 && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ image: imageBase64 }));
          }
        }, captureInterval);
      };

      wsRef.current.onmessage = (event) => {
        const data: DetectionResult = JSON.parse(event.data);
        if (data.error) {
          console.error('Detection error:', data.error);
          onError?.(`Detection error: ${data.error}`);
        } else {
          processDetectionResults(data);
        }
      };

      wsRef.current.onerror = (e) => {
        console.error('WebSocket error:', e);
        onError?.('WebSocket connection failed');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
      };
    } catch (err) {
      console.error('WebSocket init failed:', err);
      onError?.('Failed to open WebSocket');
    }
  };

  const initHttpStream = () => {
    streamIntervalRef.current = setInterval(async () => {
      try {
        const imageBase64 = captureFrame();
        if (imageBase64) {
          const results = await objectDetectionService.detectObjectsBase64(imageBase64, modelName);
          processDetectionResults(results);
        }
      } catch (err) {
        console.error('HTTP stream error:', err);
        onError?.('HTTP stream error occurred');
      }
    }, captureInterval);
  };

  return {
    videoRef,
    canvasRef,
    detections,
    annotatedImageSrc,
  };
};

