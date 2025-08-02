import React, { useEffect, useState, useMemo } from "react";
import { deviceService } from "../../../services/hydroDeviceService";
import type { HydroDevice } from "../../../models/interfaces/HydroSystem";
import DataGrid from '../../common/dataGrid/dataGrid';
import Badge from '../../common/Badge';
import LinearProgress from '../../common/LinearProgress';

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

  const columnDefs = useMemo(() => {
    return [
      { headerName: 'ID', field: 'id', width: 80 },
      { headerName: 'Name', field: 'name', flex: 1 },
      { headerName: 'Device ID', field: 'device_id', flex: 1 },
      { headerName: 'Type', field: 'type', width: 120 },
      showStatus && {
        headerName: 'Status',
        field: 'is_active',
        width: 120,
        cellRenderer: ({ value }: any) => (
          <Badge
            label={value ? 'Active' : 'Inactive'}
            variant={value ? 'success' : 'gray'}
          />
        ),
      },
      onSelect && {
        headerName: '',
        field: 'actions',
        width: 120,
        cellRenderer: ({ data }: any) => (
          <button
            className="text-blue-600 hover:underline"
            onClick={() => onSelect(data)}
          >
            Select
          </button>
        ),
      },
    ].filter(Boolean); // remove falsey values like 'undefined' if showStatus or onSelect is false
  }, [showStatus, onSelect]);

  if (loading) {
    return (
      <LinearProgress
        position="relative"
        thickness="h-1"
        duration={1000}
      />
    );
  }

  if (!devices.length) {
    return <p className="text-gray-500">No devices found.</p>;
  }

  return (
    <div className="grid gap-4">
      <DataGrid
        rowData={devices}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={10}
        height="500px"
      />
    </div>
  );
};

export default DeviceList;
