// // src/components/HydroponicSystemPage/components/CameraByLocation.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useHydroSystem } from '../../../hooks/useHydroSystem';

interface CameraByLocationProps {
  location?: string;
}

const CameraByLocation: React.FC<CameraByLocationProps> = ({ location }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { hardwareDetections, actions } = useHydroSystem();
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!location) return;

    // Connect to WebSocket for this location
    actions.connectHardwareWebSocket([location]);

    // Optional: simulate detections every 5s (for testing)
    const detectionResultId = 1;
    const interval = setInterval(() => {
      const simulatedDetection = {
        detection_result_id: detectionResultId,
        location,
        hardware_type: 'pump' as const,
        hardware_name: 'Main Pump',
        confidence: 0.95,
        detected_class: 'pump',
        is_expected: true,
        condition_status: 'good' as const,
        bbox_x1: 100,
        bbox_y1: 150,
        bbox_x2: 150,
        bbox_y2: 200,
        detection_metadata: {
          source: 'ARCamera',
          note: 'Simulated detection'
        }
      };

      actions.createHardwareDetection(simulatedDetection)
        .then(res => console.log('Detection sent:', res))
        .catch(err => console.error('Error sending detection:', err));
    }, 5000);

    return () => {
      clearInterval(interval);
      actions.disconnectHardwareWebSocket();
    };
  }, [location, actions]);

  useEffect(() => {
    // Example: start playing a live stream
    if (videoRef.current) {
      // Replace this URL with your WebRTC or HLS camera stream URL
      videoRef.current.src = `/stream/${location}.m3u8`;
      setIsStreaming(true);
    }
  }, [location]);

  return (
    <div className="relative">
      {isStreaming ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: '100%', height: 'auto' }}
        />
      ) : (
        <p>Loading camera...</p>
      )}

      {/* Detection Overlays */}
      {hardwareDetections
        .filter(det => det.location === location)
        .map(det => (
          <div
            key={det.id}
            style={{
              position: 'absolute',
              left: det.bbox_x1,
              top: det.bbox_y1,
              width: det.bbox_x2 - det.bbox_x1,
              height: det.bbox_y2 - det.bbox_y1,
              border: '2px solid red',
              color: 'white',
              fontSize: '12px',
              background: 'rgba(0,0,0,0.3)',
            }}
          >
            {det.hardware_type} ({Math.round(det.confidence * 100)}%)
          </div>
        ))}
    </div>
  );
};

export default CameraByLocation;
