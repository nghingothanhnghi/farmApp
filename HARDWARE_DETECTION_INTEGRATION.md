# Hardware Detection Integration Guide

This guide explains how to use the integrated hardware detection system within the Hydroponic System dashboard.

## Overview

The hardware detection system has been integrated into the `useHydroSystem` hook, allowing you to:
- Detect hardware components using camera feeds
- Monitor hardware status in real-time via WebSocket
- Validate detected hardware
- Manage location-based hardware inventory
- Track hardware condition and status

## Integration Components

### 1. Enhanced useHydroSystem Hook

The hook now includes hardware detection capabilities:

```typescript
const {
  // Original hydro system data
  deviceStatusList,
  sensorData,
  thresholds,
  alerts,
  controlActions,
  loading,
  error,
  
  // Hardware detection data
  hardwareDetections,
  locationStatus,
  detectionSummaries,
  availableLocations,
  hardwareTypes,
  conditionStatuses,
  isWebSocketConnected,
  
  actions: {
    // Original actions...
    
    // Hardware detection actions
    fetchHardwareDetections,
    fetchLocationStatus,
    fetchDetectionSummaries,
    processDetectionResult,
    validateDetection,
    syncLocationInventory,
    setupLocationInventory,
    connectHardwareWebSocket,
    disconnectHardwareWebSocket,
  }
} = useHydroSystem();
```

### 2. Hardware Detection Tab

The main dashboard now includes a "Hardware Detection" tab that shows:
- WebSocket connection status
- Location-based detection statistics
- Recent hardware detections
- Validation controls
- Detection summaries

## Usage Examples

### Basic Setup

```typescript
import React, { useEffect } from 'react';
import { useHydroSystem } from '../hooks/useHydroSystem';

const MyComponent = () => {
  const {
    hardwareDetections,
    locationStatus,
    isWebSocketConnected,
    actions
  } = useHydroSystem();

  useEffect(() => {
    const location = 'greenhouse_a';
    
    // Connect WebSocket for real-time updates
    actions.connectHardwareWebSocket([location]);
    
    // Fetch initial detection data
    actions.fetchHardwareDetections(location);
    actions.fetchLocationStatus(location);
    
    // Cleanup on unmount
    return () => {
      actions.disconnectHardwareWebSocket();
    };
  }, [actions]);

  return (
    <div>
      <p>WebSocket Status: {isWebSocketConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Detections: {hardwareDetections.length}</p>
    </div>
  );
};
```

### Processing Detection Results

```typescript
// Process a detection result from camera analysis
const handleProcessDetection = async () => {
  try {
    await actions.processDetectionResult(
      detectionResultId, // ID from your detection system
      'greenhouse_a',    // location
      'camera_1',        // camera source (optional)
      0.7               // confidence threshold
    );
    console.log('Detection processed successfully');
  } catch (error) {
    console.error('Failed to process detection:', error);
  }
};
```

### Validating Detections

```typescript
// Validate or reject a detection
const handleValidateDetection = async (detectionId: number, isValid: boolean) => {
  try {
    await actions.validateDetection(
      detectionId,
      isValid,
      isValid ? 'Confirmed by operator' : 'False positive'
    );
  } catch (error) {
    console.error('Failed to validate detection:', error);
  }
};
```

### Managing Location Inventory

```typescript
// Sync location inventory with detected hardware
const handleSyncInventory = async () => {
  try {
    await actions.syncLocationInventory('greenhouse_a');
    console.log('Inventory synced successfully');
  } catch (error) {
    console.error('Failed to sync inventory:', error);
  }
};

// Setup initial inventory for a location
const handleSetupInventory = async () => {
  try {
    await actions.setupLocationInventory('greenhouse_a');
    console.log('Inventory setup completed');
  } catch (error) {
    console.error('Failed to setup inventory:', error);
  }
};
```

## WebSocket Real-time Updates

The system automatically handles real-time updates via WebSocket:

```typescript
// WebSocket messages are automatically processed and update the state:
// - 'detection_update': Updates existing detection
// - 'location_status_update': Updates location status
// - 'new_detection': Adds new detection and creates alert
```

## Data Structures

### Hardware Detection Response
```typescript
interface HardwareDetectionResponse {
  id: number;
  location: string;
  hardware_type: HardwareType;
  hardware_name?: string;
  confidence: number;
  detected_class: string;
  is_expected: boolean;
  is_validated: boolean;
  condition_status?: ConditionStatus;
  condition_notes?: string;
  camera_source?: string;
  detected_at: string;
  // ... more fields
}
```

### Location Status Response
```typescript
interface LocationStatusResponse {
  location: string;
  total_expected: number;
  total_detected: number;
  validated_count: number;
  missing_hardware: string[];
  unexpected_hardware: string[];
  hardware_status: Record<HardwareType, {
    count: number;
    condition: ConditionStatus;
  }>;
  last_detection?: string;
  detection_confidence_avg?: number;
}
```

## Integration with Existing System

The hardware detection system integrates seamlessly with the existing hydroponic system:

1. **Location-based**: Uses the same location system as hydroponic devices
2. **Real-time alerts**: Hardware detection issues create system alerts
3. **Unified dashboard**: All functionality accessible from the main dashboard
4. **Consistent UI**: Uses the same components and styling

## Best Practices

1. **Initialize WebSocket early**: Connect WebSocket when component mounts
2. **Handle cleanup**: Always disconnect WebSocket on unmount
3. **Error handling**: Wrap API calls in try-catch blocks
4. **Location filtering**: Filter detections by current device location
5. **Validation workflow**: Implement user validation for critical detections

## Example Component

See `src/components/HardwareDetection/HardwareDetectionExample.tsx` for a complete example implementation.

## API Integration

The system uses the existing `hardwareDetectionService` which provides:
- RESTful API endpoints for CRUD operations
- WebSocket connection for real-time updates
- Bulk operations for processing multiple detections
- Location-based filtering and management

## Troubleshooting

1. **WebSocket not connecting**: Check API_BASE_URL configuration
2. **No detections showing**: Verify location parameter matches backend data
3. **Validation not working**: Ensure detection ID is valid and not already validated
4. **Performance issues**: Limit the number of detections displayed and use pagination

This integration provides a complete hardware detection solution within your existing hydroponic system dashboard.