// src/components/HardwareDetection/HardwareDetection.tsx
import React, { useEffect, useState } from 'react';
import { useHydroSystem } from '../../../hooks/useHydroSystem';
import Button from '../../common/Button';

interface HardwareDetectionProps {
  location: string;
}

const HardwareDetection: React.FC<HardwareDetectionProps> = ({ location }) => {
  const {
    hardwareDetections,
    locationStatus,
    isWebSocketConnected,
    detectionSummaries,   // ✅ now available
    availableLocations,   // ✅ now available
    hardwareTypes,        // ✅ now available
    conditionStatuses,    // ✅ now available
    loading,
    actions
  } = useHydroSystem();

  const [selectedDetectionId, setSelectedDetectionId] = useState<number | null>(null);

  // Initialize hardware detection for the location
  useEffect(() => {
    if (location) {
      // Connect WebSocket for real-time updates
      actions.connectHardwareWebSocket([location]);

      // Fetch initial data
      actions.fetchHardwareDetections(location);
      actions.fetchLocationStatus(location);
      actions.fetchDetectionSummaries(location);
    }

    // Cleanup on unmount
    // return () => {
    //   actions.disconnectHardwareWebSocket();
    // };
    return () => {
      if (isWebSocketConnected) {
        actions.disconnectHardwareWebSocket();
      }
    };
  }, []);

  // Handle processing a detection result (simulated)
  const handleProcessDetection = async (detectionResultId: number) => {
    try {
      await actions.processDetectionResult(
        detectionResultId,
        location,
        'camera_1', // camera source
        0.7 // confidence threshold
      );
      console.log('Detection processed successfully');
    } catch (error) {
      console.error('Failed to process detection:', error);
    }
  };

  // Handle validating a detection
  const handleValidateDetection = async (detectionId: number, isValid: boolean) => {
    try {
      await actions.validateDetection(
        detectionId,
        isValid,
        isValid ? 'Validated by user' : 'Rejected by user'
      );
      console.log(`Detection ${isValid ? 'validated' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Failed to validate detection:', error);
    }
  };

  // Handle syncing location inventory
  const handleSyncInventory = async () => {
    try {
      await actions.syncLocationInventory(location);
      console.log('Inventory synced successfully');
    } catch (error) {
      console.error('Failed to sync inventory:', error);
    }
  };

  const currentLocationStatus = locationStatus[location];
  const locationDetections = hardwareDetections.filter(d => d.location === location);

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Hardware Detection for {location}</h2>

        {/* Connection Status */}
        <div className="mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isWebSocketConnected
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {isWebSocketConnected ? '🟢 WebSocket Connected' : '🔴 WebSocket Disconnected'}
          </div>
        </div>

        {/* Location Status Summary */}
        {currentLocationStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Total Expected</h3>
              <p className="text-2xl font-bold text-blue-600">{currentLocationStatus.total_expected}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Total Detected</h3>
              <p className="text-2xl font-bold text-green-600">{currentLocationStatus.total_detected}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Validated</h3>
              <p className="text-2xl font-bold text-purple-600">{currentLocationStatus.validated_count}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900">Avg Confidence</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {currentLocationStatus.detection_confidence_avg
                  ? `${(currentLocationStatus.detection_confidence_avg * 100).toFixed(1)}%`
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-6">
          <Button
            label="Refresh Data"
            onClick={() => {
              actions.fetchHardwareDetections(location);
              actions.fetchLocationStatus(location);
            }}
            disabled={loading}
            variant="secondary"
          />

          <Button
            label="Sync Inventory"
            onClick={handleSyncInventory}
            disabled={loading}
            variant="secondary"
          />

          <Button
            label="Setup Inventory"
            onClick={() => actions.setupLocationInventory(location)}
            disabled={loading}
            variant="secondary"
          />

          <Button
            label="Process Sample Detection"
            onClick={() => handleProcessDetection(1)} // Sample detection result ID
            disabled={loading}
            variant="primary"
          />
        </div>

        {/* Hardware Detections List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Detections</h3>

          {locationDetections.length > 0 ? (
            <div className="space-y-3">
              {locationDetections.map((detection) => (
                <div
                  key={detection.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedDetectionId === detection.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedDetectionId(
                    selectedDetectionId === detection.id ? null : detection.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Status Indicator */}
                      <div className={`w-3 h-3 rounded-full ${detection.is_validated
                          ? 'bg-green-500'
                          : detection.is_expected
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                        }`}></div>

                      <div>
                        <h4 className="font-medium">
                          {detection.hardware_name || detection.detected_class}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Type: {detection.hardware_type} |
                          Confidence: {(detection.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {!detection.is_validated && (
                        <>
                          <Button
                            label="✓ Validate"
                            onClick={() => {
                              handleValidateDetection(detection.id, true);
                            }}
                            className="text-green-600 hover:bg-green-50"
                            variant="secondary"
                            size="sm"
                          />
                          <Button
                            label="✗ Reject"
                            onClick={() => {
                              handleValidateDetection(detection.id, false);
                            }}
                            className="text-red-600 hover:bg-red-50"
                            variant="secondary"
                            size="sm"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedDetectionId === detection.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Detection ID:</strong> {detection.id}</p>
                          <p><strong>Expected:</strong> {detection.is_expected ? 'Yes' : 'No'}</p>
                          <p><strong>Validated:</strong> {detection.is_validated ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p><strong>Camera Source:</strong> {detection.camera_source || 'N/A'}</p>
                          <p><strong>Detected At:</strong> {new Date(detection.detected_at).toLocaleString()}</p>
                          <p><strong>Condition:</strong> {detection.condition_status || 'Unknown'}</p>
                        </div>
                      </div>

                      {detection.condition_notes && (
                        <div className="mt-2">
                          <p className="text-sm"><strong>Notes:</strong> {detection.condition_notes}</p>
                        </div>
                      )}

                      {detection.validation_notes && (
                        <div className="mt-2">
                          <p className="text-sm"><strong>Validation Notes:</strong> {detection.validation_notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hardware detections found for this location.</p>
              <p className="text-sm mt-2">
                Make sure the camera detection system is running and processing images.
              </p>
            </div>
          )}
        </div>

        {/* Missing/Unexpected Hardware Alerts */}
        {currentLocationStatus && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLocationStatus.missing_hardware.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Missing Hardware</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {currentLocationStatus.missing_hardware.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentLocationStatus.unexpected_hardware.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Unexpected Hardware</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {currentLocationStatus.unexpected_hardware.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Show detection summaries */}
      <div className="mt-4">
        <h3 className="font-semibold">Detection Summaries</h3>
        <pre>{JSON.stringify(detectionSummaries, null, 2)}</pre>
      </div>

      {/* Available Locations Dropdown */}
      <select
        onChange={e => actions.fetchHardwareDetections(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select a location</option>
        {availableLocations.map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      {/* Hardware Types */}
      <ul>
        {hardwareTypes.map(type => (
          <li key={type}>{type}</li>
        ))}
      </ul>

      {/* Condition Statuses */}
      <ul>
        {conditionStatuses.map(status => (
          <li key={status}>
            {status} – {status.charAt(0).toUpperCase() + status.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HardwareDetection;