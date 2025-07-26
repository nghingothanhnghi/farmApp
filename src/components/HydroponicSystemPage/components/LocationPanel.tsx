import React from 'react';

interface LocationPanelProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

const LocationPanel: React.FC<LocationPanelProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="w-full flex flex-row-reverse items-start gap-4 p-4 bg-gray-100 border border-gray-100 rounded-lg min-h-[6rem]">
      <img
        alt={title}
        src={imageUrl}
        className="w-20 rounded object-cover"
      />
      <div>
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>

        <p className="text-[0.625rem] mt-0.5 text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LocationPanel;
