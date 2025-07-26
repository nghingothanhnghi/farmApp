import React from 'react';

interface LocationPanelProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

const LocationPanel: React.FC<LocationPanelProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="w-full flex items-stretch gap-4 min-h-[16rem]">
      <img
        alt={title}
        src={imageUrl}
        className="w-20 rounded object-cover"
      />

      <div>
        <h3 className="font-medium text-gray-900 sm:text-lg">{title}</h3>

        <p className="mt-0.5 text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LocationPanel;
