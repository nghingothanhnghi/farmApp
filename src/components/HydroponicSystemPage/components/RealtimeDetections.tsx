import React from 'react';
import type { Detection } from '../../../models/interfaces/Camera';
import { classToHardwareType, hardwareColors } from '../../../utils/hardwareMappings';


interface RealtimeDetectionsProps {
  currentDetections: Detection[];
}


const RealtimeDetections: React.FC<RealtimeDetectionsProps> = ({ currentDetections }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bg-black/20 text-white text-[0.625rem] p-2">
      {currentDetections.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {currentDetections.map((det, index) => {
            const hardwareType = classToHardwareType[det.class];
            const colorClass = hardwareColors.tailwind[hardwareType as keyof typeof hardwareColors.tailwind]
              || hardwareColors.tailwind.other;


            return (
              <div key={index} className={`px-2 py-1 rounded ${colorClass}`}>
                <div className="font-medium">{det.class}</div>
                <div>{Math.round(det.confidence * 100)}% confidence</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-[0.625rem] text-gray-500 italic p-2">No hardware detected in current frame</div>
      )}
    </div>
  );
};

export default RealtimeDetections;
