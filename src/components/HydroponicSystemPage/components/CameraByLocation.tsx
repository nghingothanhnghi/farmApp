// src/components/HydroponicSystemPage/components/CameraByLocation.tsx
import React from 'react';
import { useCamera } from '../../../hooks/useCamera';

interface CameraByLocationProps {
  location?: string;
}

const CameraByLocation: React.FC<CameraByLocationProps> = ({ location }) => {

    console.log("Location:",location);

  const { isStreaming, videoRef } = useCamera({ location });

  return (
       <div>
      {isStreaming ? (
        <video ref={videoRef} autoPlay muted playsInline />
      ) : (
        <p>Loading camera...</p>
      )}
    </div>
  );
};

export default CameraByLocation;

