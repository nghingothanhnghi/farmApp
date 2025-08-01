import React, { useEffect, useState } from "react";
import { deviceService } from "../../../services/hydroDeviceService";
import type { HydroDevice } from "../../../models/interfaces/HydroSystem";

type Props = {
  onSelect?: (device: HydroDevice) => void;
  showStatus?: boolean;
};

const DeviceList: React.FC<Props> = ({ onSelect, showStatus = true }) => {
  const [devices, setDevices] = useState<HydroDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deviceService
      .getAll()
      .then(setDevices)
      .catch((err) => console.error("Device fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading devices...</p>;
  if (!devices.length) return <p>No devices found.</p>;

  return (
    <div className="grid gap-4">
      {devices.map((device) => (
        <div
          key={device.id}
          className="p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect?.(device)}
        >
          <div className="font-semibold text-lg">{device.name}</div>
          <div className="text-sm text-gray-500">{device.device_id}</div>
          <div className="text-sm text-gray-400">Type: {device.type}</div>
          {showStatus && (
            <div className="text-sm mt-1">
              Status:{" "}
              <span className={device.is_active ? "text-green-600" : "text-red-600"}>
                {device.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeviceList;
