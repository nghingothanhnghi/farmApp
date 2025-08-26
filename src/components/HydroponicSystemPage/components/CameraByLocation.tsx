// src/components/HydroponicSystemPage/components/CameraByLocation.tsx

import React from 'react';
import Spinner from '../../common/Spinner';
import RealtimeDetections from './RealtimeDetections';
import StoredDetections from './StoredDetections';
import { useHydroCameraDetection } from '../../../hooks/useHydroCameraDetection';

interface CameraByLocationProps {
  location?: string;
}

const CameraByLocation: React.FC<CameraByLocationProps> = ({ location }) => {
  const { videoRef, canvasRef, currentDetections, storedDetections, loading, alert } = useHydroCameraDetection(location);

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
          <RealtimeDetections currentDetections={currentDetections} />

          {/* 🔹 Stored detections overlay (bottom) */}
          <StoredDetections hardwareDetections={storedDetections} location={location} />
        </div>

        {/* Panel placeholders */}
        <div className="mt-3"></div>
        <div className="mt-4"></div>
      </div>
    </div>
  );
};

export default CameraByLocation;
