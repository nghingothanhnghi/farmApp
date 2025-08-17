// src/components/HydroponicSystemPage/components/CameraByLocation.tsx

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useCamera } from '../../../hooks/useCamera';
import { useStreaming } from '../../../hooks/useStreaming';
import { useHydroSystem } from '../../../hooks/useHydroSystem';
import type { DetectionResult } from '../../../models/interfaces/Camera';
import type { HardwareType, HardwareDetectionCreate } from '../../../models/interfaces/HardwareDetection';
import Spinner from '../../common/Spinner';
interface CameraByLocationProps {
  location?: string;
}
const classToHardwareType: Record<string, HardwareType> = {
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


const CameraByLocation: React.FC<CameraByLocationProps> = ({ location }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);

  const { isStreaming } = useCamera({
    videoRef,
    location,
    facingMode: 'environment'
  });

  const { actions, hardwareDetections, loading, error } = useHydroSystem();

  // Capture current frame
  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // When detection results come in from the streaming service
  const processDetectionResults = useCallback(
    (result: DetectionResult) => {
      if (!result?.detections) return;

      result.detections.forEach((det) => {
        const hardwareType = classToHardwareType[det.class];
        if (!hardwareType) {
          console.warn(`Unknown hardware type: ${det.class}`);
          return;
        }

        const payload: HardwareDetectionCreate = {
          location: location || 'unknown',
          hardware_type: hardwareType,
          hardware_name: undefined,
          confidence: det.confidence,
          detected_class: det.class,
          is_expected: false,
          bbox_x1: det.bbox[0],
          bbox_y1: det.bbox[1],
          bbox_x2: det.bbox[2],
          bbox_y2: det.bbox[3],
          detection_metadata: {
            source: 'streaming',
            annotated_image: result.annotated_image // put it here instead
          },
          detection_result_id: Date.now(),
        };

        actions.createHardwareDetection(payload);
      });
    },
    [actions, location]
  );

  // Start streaming video frames for detection
  useStreaming({
    streamMode: 'websocket',
    captureInterval: 1000,
    selectedModel: 'hardware-detection-model',
    captureFrame,
    isStreaming,
    processDetectionResults,
    setAlert
  });

  // Note: WebSocket connection is handled by HardwareDetection component
  // to avoid duplicate connections

  return (
    <div className="camera-by-location relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-lg">
          <Spinner size={48} colorClass="border-white" borderClass="border-4" />
        </div>
      )}
      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: '100%', borderRadius: '8px' }}
      />
      <div className="detections-list mt-2">
        {hardwareDetections
          .filter((d) => !location || d.location === location)
          .map((det) => (
            <div key={det.id} className="detection-item">
              {det.hardware_type} ({Math.round(det.confidence * 100)}%)
            </div>
          ))}
      </div>
    </div>
  );
};

export default CameraByLocation;


