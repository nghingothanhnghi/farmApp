// src/components/HydroponicSystemPage/components/CameraByLocation.tsx

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useCamera } from '../../../hooks/useCamera';
import { useStreaming } from '../../../hooks/useStreaming';
import { useHydroSystem } from '../../../hooks/useHydroSystem';
import type { DetectionResult, Detection } from '../../../models/interfaces/Camera';
import type { HardwareType } from '../../../models/interfaces/HardwareDetection';
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);
  const [currentDetections, setCurrentDetections] = useState<Detection[]>([]);
  const lastSyncRef = useRef<number>(0); // 🔹 track last backend sync

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

  // Draw bounding boxes on canvas overlay
  const drawBoundingBoxes = useCallback((detections: Detection[]) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bounding boxes
    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.bbox;
      const width = x2 - x1;
      const height = y2 - y1;

      // Set box style based on hardware type
      const hardwareType = classToHardwareType[det.class];
      const colors = {
        pump: '#3B82F6',      // blue
        light: '#F59E0B',     // amber
        sensor: '#10B981',    // emerald
        fan: '#8B5CF6',       // violet
        valve: '#EF4444',     // red
        other: '#6B7280'      // gray
      };
      const color = colors[hardwareType as keyof typeof colors] || colors.other;

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);

      // Draw label background
      const label = `${det.class} (${Math.round(det.confidence * 100)}%)`;
      ctx.font = '14px Arial';
      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const textHeight = 20;

      ctx.fillStyle = color;
      ctx.fillRect(x1, y1 - textHeight - 4, textWidth + 8, textHeight + 4);

      // Draw label text
      ctx.fillStyle = 'white';
      ctx.fillText(label, x1 + 4, y1 - 8);
    });
  }, []);

  // Normalize backend payload -> { class, confidence, bbox: [x1,y1,x2,y2] }
  const normalizeDetections = (res: DetectionResult) => {
    const raw = (res as any)?.detections || [];
    return raw.map((d: any) => {
      const cls = d.class ?? d.class_name ?? d.original_class ?? 'unknown';
      let bbox = d.bbox;
      if (Array.isArray(bbox) && bbox.length === 4) {
        // Backend sends [x, y, width, height] → convert to [x1, y1, x2, y2]
        const [x, y, w, h] = bbox.map(Number);
        bbox = [x, y, x + w, y + h];
      } else if (
        d.bbox_x1 !== undefined && d.bbox_y1 !== undefined &&
        d.bbox_x2 !== undefined && d.bbox_y2 !== undefined
      ) {
        bbox = [Number(d.bbox_x1), Number(d.bbox_y1), Number(d.bbox_x2), Number(d.bbox_y2)];
      }
      return { class: String(cls), confidence: Number(d.confidence ?? d.score ?? 0), bbox } as Detection;
    });
  };

  // ✅ Refactored: non-blocking UI + throttled backend sync
  const processDetectionResults = useCallback(
    (result: DetectionResult) => {
      if (!result) return;

      // 1. Fast UI update
      const detections = normalizeDetections(result);
      setCurrentDetections(detections);
      drawBoundingBoxes(detections);

      // 2. Optional backend processing
      const detectionId = (result as any).detection_id;
      if (detectionId && location) {
        // actions.processDetectionResult(detectionId, location, 'camera_by_location', 0.6);
        (async () => {
          try {
            await actions.processDetectionResult(detectionId, location, 'camera_by_location', 0.6);

            const now = Date.now();
            if (now - lastSyncRef.current > 10000) { // throttle 10s
              lastSyncRef.current = now;
              await actions.syncLocationInventory(location);
              await Promise.all([
                actions.fetchLocationStatus(location),
                actions.fetchHardwareDetections(location)
              ]);
            }
          } catch (e) {
            console.warn('Post-process sync failed:', e);
          }
        })();
      }
      // Note: Do NOT call createHardwareDetection here.
      // Streaming WS responses don't include a valid detection_result_id, and
      // posting random IDs causes backend FK errors. Use processDetectionResult
      // when detection_id is available (HTTP detect-base64 flow).
    },
    [actions, location, drawBoundingBoxes]
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

  // Handle video resize to update canvas dimensions
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const handleVideoResize = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Redraw current detections if any
        if (currentDetections.length > 0) {
          drawBoundingBoxes(currentDetections);
        }
      }
    };

    video.addEventListener('loadedmetadata', handleVideoResize);
    video.addEventListener('resize', handleVideoResize);

    return () => {
      video.removeEventListener('loadedmetadata', handleVideoResize);
      video.removeEventListener('resize', handleVideoResize);
    };
  }, [currentDetections, drawBoundingBoxes]);

  // Auto-sync inventory once per location on mount
  const hasSyncedRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (!location) return;
    if (hasSyncedRef.current === location) return; // prevent duplicate sync for same location in this session
    (async () => {
      try {
        await actions.syncLocationInventory(location);
        await Promise.all([
          actions.fetchLocationStatus(location),
          actions.fetchHardwareDetections(location)
        ]);
      } catch (e) {
        console.warn('Initial sync failed:', e);
      } finally {
        hasSyncedRef.current = location;
      }
    })();
  }, [location, actions]);

  // Note: WebSocket connection is handled by HardwareDetection component
  // to avoid duplicate connections

  return (
    <div className="camera-by-location relative h-full">
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-6 h-full'>
        {/* Video and Canvas Container */}
        <div className="relative h-full flex flex-col row-span-2 col-span-2 rounded-lg overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-lg">
              <Spinner size={48} colorClass="border-white" borderClass="border-4" />
            </div>
          )}
          {alert && (
            <div className={`alert alert-${alert.type} mb-2 p-2 rounded bg-red-900 text-white font-bold text-sm absolute`}>
              {alert.message}
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
              display: 'block'
            }}
          />
          {/* Canvas overlay for bounding boxes */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
          />
          {/* 🔹 Real-time detections overlay (top) */}
          <div className="absolute top-0 left-0 right-0 bg-black/20 text-white text-[0.625rem] p-2">
            {currentDetections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentDetections.map((det, index) => {
                  const hardwareType = classToHardwareType[det.class];
                  const colors = {
                    pump: 'bg-blue-100 text-blue-800',
                    light: 'bg-amber-100 text-amber-800',
                    sensor: 'bg-emerald-100 text-emerald-800',
                    fan: 'bg-violet-100 text-violet-800',
                    valve: 'bg-red-100 text-red-800',
                    other: 'bg-gray-100 text-gray-800'
                  };
                  const colorClass = colors[hardwareType as keyof typeof colors] || colors.other;

                  return (
                    <div key={index} className={`px-2 py-1 rounded ${colorClass}`}>
                      <div className="font-medium">{det.class}</div>
                      <div>{Math.round(det.confidence * 100)}% confidence</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="absolute top-0 left-0 text-[0.625rem] text-gray-500 italic p-2">
                <div className='text-center'>No hardware detected in current frame</div>
              </div>
            )}
          </div>

          {/* 🔹 Stored detections overlay (bottom) */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white text-xs p-2 max-h-24 overflow-y-auto">
            {hardwareDetections
              .filter((d) => !location || d.location === location)
              .slice(0, 5) // show recent 5
              .map((det) => (
                <div key={det.id} className="flex justify-between">
                  <span>{det.hardware_type}</span>
                  <span>{Math.round(det.confidence * 100)}% • {det.is_validated ? '✓' : '○'}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Panel */}
        <div className="mt-3">

        </div>

        {/* Panel */}
        <div className="mt-4">


        </div>
      </div>
    </div>
  );
};

export default CameraByLocation;


