// src/components/HydroponicSystemPage/components/StoredDetections.tsx

import React from 'react';
import { IconCircleCheck, IconCircle } from '@tabler/icons-react';
import type { HardwareDetectionResponse } from '../../../models/interfaces/HardwareDetection';

interface StoredDetectionsProps {
  hardwareDetections: HardwareDetectionResponse[];
  location?: string;
}

const StoredDetections: React.FC<StoredDetectionsProps> = ({ hardwareDetections, location }) => {
  const filteredDetections = hardwareDetections
    .filter((d) => !location || d.location === location)
    .sort((a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime())
    .slice(0, 5); // show recent 5 only

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white text-xs p-2 max-h-24 overflow-y-auto">
      {filteredDetections.map((det) => (
        <div key={det.id} className="flex justify-between">
          <span>{det.hardware_name || det.detected_class} • {det.hardware_type}</span>
          <span className="inline-flex items-center gap-2">
            {Math.round(det.confidence * 100)}%
            {det.is_validated ? (
              <IconCircleCheck size={16} className="text-green-400" />
            ) : (
              <IconCircle size={16} className="text-gray-400" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoredDetections;
