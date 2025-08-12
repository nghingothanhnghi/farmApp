// Camera detection model for Hydro System //

export type ConditionStatus = "good" | "damaged" | "missing" | "unknown";

export type HardwareType =
  | "pump"
  | "water_pump"
  | "light"
  | "fan"
  | "valve"
  | "sensor"
  | "relay"
  | "controller"
  | "tank"
  | "pipe"
  | "cable"
  | "other";

// ─────────────────────────────────────────────
// Hardware Detection
// ─────────────────────────────────────────────

export interface HardwareDetectionBase {
  location: string;
  hardware_type: HardwareType;
  hardware_name?: string;
  confidence: number;
  detected_class: string;
  is_expected: boolean;
  condition_status?: ConditionStatus;
  condition_notes?: string;
  camera_source?: string;
}

export interface HardwareDetectionCreate extends HardwareDetectionBase {
  detection_result_id: number;
  detection_object_id?: number;
  bbox_x1: number;
  bbox_y1: number;
  bbox_x2: number;
  bbox_y2: number;
  detection_metadata?: Record<string, any>;
}

export interface HardwareDetectionUpdate {
  hardware_name?: string;
  is_expected?: boolean;
  is_validated?: boolean;
  validation_notes?: string;
  condition_status?: ConditionStatus;
  condition_notes?: string;
}

export interface HardwareDetectionResponse extends HardwareDetectionBase {
  id: number;
  detection_result_id: number;
  detection_object_id?: number;
  bbox_x1: number;
  bbox_y1: number;
  bbox_x2: number;
  bbox_y2: number;
  is_validated: boolean;
  validation_notes?: string;
  detection_metadata?: Record<string, any>;
  detected_at: string;
  validated_at?: string;
  created_at: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────
// Location Inventory
// ─────────────────────────────────────────────

export interface LocationHardwareInventoryBase {
  location: string;
  hardware_type: HardwareType;
  hardware_name?: string;
  expected_quantity: number;
  notes?: string;
}

export interface LocationHardwareInventoryCreate extends LocationHardwareInventoryBase {
  hydro_device_id?: number;
  hydro_actuator_id?: number;
}

export interface LocationHardwareInventoryUpdate {
  hardware_name?: string;
  expected_quantity?: number;
  is_active?: boolean;
  notes?: string;
}

export interface LocationHardwareInventoryResponse extends LocationHardwareInventoryBase {
  id: number;
  hydro_device_id?: number;
  hydro_actuator_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────
// Filter & Queries
// ─────────────────────────────────────────────

export interface HardwareDetectionFilter {
  location?: string;
  hardware_type: HardwareType;
  condition_status?: ConditionStatus;
  is_validated?: boolean;
  is_expected?: boolean;
  min_confidence?: number;
  start_date?: string;
  end_date?: string;
  camera_source?: string;
  limit?: number;
  offset?: number;
}

// ─────────────────────────────────────────────
// Location Status
// ─────────────────────────────────────────────

export interface LocationStatusResponse {
  location: string;
  total_expected: number;
  total_detected: number;
  validated_count: number;
  missing_hardware: string[];
  unexpected_hardware: string[];
  hardware_status: Record<
    HardwareType,
    {
      count: number;
      condition: ConditionStatus;
      [key: string]: any;
    }
  >;
  last_detection?: string;
  detection_confidence_avg?: number;
}

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────

export interface HardwareValidationRequest {
  is_validated: boolean;
  validation_notes?: string;
  condition_status?: ConditionStatus;
  condition_notes?: string;
}

// ─────────────────────────────────────────────
// Bulk
// ─────────────────────────────────────────────

export interface BulkHardwareDetectionCreate {
  detections: HardwareDetectionCreate[];
  location: string;
  camera_source?: string;
}

// ─────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────

export interface HardwareDetectionStats {
  total_locations: number;
  total_detections: number;
  total_validated: number;
  hardware_types_count: Record<HardwareType, number>;
  condition_status_count: Record<ConditionStatus, number>;
  locations_with_missing_hardware: string[];
  locations_with_unexpected_hardware: string[];
  average_confidence?: number;
  detection_trend?: Record<string, number>;
}

// Optional summary type
export interface HardwareDetectionSummaryResponse {
  id: number;
  location: string;
  summary_date: string;
  total_detections: number;
  unique_hardware_types: number;
  validated_detections: number;
  expected_present: number;
  expected_missing: number;
  unexpected_present: number;
  good_condition: number;
  damaged_condition: number;
  unknown_condition: number;
  hardware_types_detected?: HardwareType[];
  detection_confidence_avg?: number;
  created_at: string;
}
