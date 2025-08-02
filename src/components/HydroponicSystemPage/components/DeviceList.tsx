import React, { useEffect, useState, useMemo } from "react";
import { IconAlertCircle } from '@tabler/icons-react';
import { deviceService } from "../../../services/hydroDeviceService";
import { useAlert } from "../../../contexts/alertContext";
import type { HydroDevice } from "../../../models/interfaces/HydroSystem";
import DataGrid from '../../common/dataGrid/dataGrid';
import ActionButtons from '../../common/dataGrid/actionButton';
import Modal from '../../common/Modal';
import Badge from '../../common/Badge';
import Button from "../../common/Button";
import LinearProgress from '../../common/LinearProgress';

type Props = {
  onSelect?: (device: HydroDevice) => void;
  showStatus?: boolean;
};

const DeviceList: React.FC<Props> = ({ onSelect, showStatus = true }) => {
  const { setAlert } = useAlert();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HydroDevice | null>(null);
  const [devices, setDevices] = useState<HydroDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deviceService
      .getAll()
      .then(setDevices)
      .catch((err) => console.error("Device fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestDelete = (device: HydroDevice) => {
    setSelectedDevice(device);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDevice) return;
    try {
      await deviceService.delete(selectedDevice.id);
      setDevices(prev => prev.filter(d => d.id !== selectedDevice.id));
      setAlert({
        message: `Device "${selectedDevice?.name}" deleted successfully.`,
        type: 'success',
      });
    } catch (err) {
      console.error("Delete error:", err);
      setAlert({
        message: 'Failed to delete device. Please try again.',
        type: 'error',
      });
    } finally {
      setConfirmModalOpen(false);
      setSelectedDevice(null);
    }
  };

  const columnDefs = useMemo(() => {
    return [
      { headerName: 'ID', field: 'id', width: 80, filter: false, cellStyle: { textAlign: "center" } },
      { headerName: 'Name', field: 'name', flex: 1, filter: false },
      { headerName: 'Device ID', field: 'device_id', flex: 1, filter: false },
      { headerName: 'Type', field: 'type',flex: 1, filter: false, resizable: false },
      showStatus && {
        headerName: 'Status',
        field: 'is_active',
        flex: 1,
        filter: false,
        resizable: false,
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
        width: 100,
        filter: false,
        sortable: false,
        resizable: false,
        pinned: "right",
        cellStyle: { textAlign: "center" },
        cellRenderer: ({ data }: any) => (
          <ActionButtons
            row={data}
            onEdit={() => onSelect(data)}
            onDelete={() => handleRequestDelete(data)}
          />
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
    <>
      <DataGrid
        rowData={devices}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={10}
        height="500px"
      />
      <Modal
        showCloseButton={false}
        size="xsmall"
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedDevice(null);
        }}
        content={
          <div className="text-sm px-10 pt-6 pb-10 text-center">
            <IconAlertCircle size={64} className="text-red-500 mb-4 mx-auto" />
            Are you sure you want to delete device{" "}
            <strong>{selectedDevice?.name}</strong>?
          </div>
        }
        actions={
          <div className="flex gap-4">
            <Button
              label="Yes, Delete"
              variant="danger"
              onClick={handleConfirmDelete}
              className="min-w-[150px]"
            />
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setConfirmModalOpen(false)}
              className="min-w-[150px]"
            />
          </div>
        }
      />
    </>
  );
};

export default DeviceList;
