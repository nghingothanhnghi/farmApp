import React from 'react';
import Lottie from 'lottie-react';
import type { EmptyStateProps } from '../../models/interfaces/EmptyState';

const EmptyState: React.FC<EmptyStateProps> = ({
  animationData,
  message,
  height = 150,
  width = 150,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 space-y-4 h-48">
      <Lottie animationData={animationData} loop autoplay style={{ height, width }} />
      <p className="text-sm mb-6">{message}</p>
    </div>
  );
};

export default EmptyState;
