import apiClient from "../api/client";
import type {
  HardwareDetectionCreate,
  HardwareDetectionResponse,
  BulkHardwareDetectionCreate,
  HardwareDetectionFilter,
  HardwareValidationRequest,
  LocationHardwareInventoryCreate,
  LocationHardwareInventoryUpdate,
  LocationHardwareInventoryResponse,
  HardwareDetectionStats,
  LocationStatusResponse,
  HardwareDetectionSummaryResponse,
  HardwareType,
  ConditionStatus,
} from "../models/interfaces/HydroSystem";

export const hardwareDetectionService = {
  async createDetection(data: HardwareDetectionCreate) {
    const res = await apiClient.post<HardwareDetectionResponse>("/hardware-detection", data);
    return res.data;
  },

  async createBulkDetections(data: BulkHardwareDetectionCreate) {
    const res = await apiClient.post<HardwareDetectionResponse[]>("/hardware-detection/bulk", data);
    return res.data;
  },

  async processDetectionResult(
    detectionResultId: number,
    location: string,
    cameraSource?: string,
    confidenceThreshold: number = 0.5
  ) {
    const res = await apiClient.post<HardwareDetectionResponse[]>(
      `/hardware-detection/process-detection/${detectionResultId}`,
      null,
      {
        params: {
          location,
          camera_source: cameraSource,
          confidence_threshold: confidenceThreshold,
        },
      }
    );
    return res.data;
  },

  async getDetections(filters: Partial<HardwareDetectionFilter>) {
    const res = await apiClient.get<HardwareDetectionResponse[]>("/hardware-detection", {
      params: filters,
    });
    return res.data;
  },

  async validateDetection(detectionId: number, data: HardwareValidationRequest) {
    const res = await apiClient.put<HardwareDetectionResponse>(
      `/hardware-detection/${detectionId}/validate`,
      data
    );
    return res.data;
  },

  async getLocationStatus(location: string) {
    const res = await apiClient.get<LocationStatusResponse>(
      `/hardware-detection/location/${location}/status`
    );
    return res.data;
  },

  async createLocationInventory(data: LocationHardwareInventoryCreate) {
    const res = await apiClient.post<LocationHardwareInventoryResponse>(
      "/hardware-detection/inventory",
      data
    );
    return res.data;
  },

  async updateLocationInventory(id: number, data: LocationHardwareInventoryUpdate) {
    const res = await apiClient.put<LocationHardwareInventoryResponse>(
      `/hardware-detection/inventory/${id}`,
      data
    );
    return res.data;
  },

  async syncLocationInventory(location: string) {
    const res = await apiClient.post<LocationHardwareInventoryResponse[]>(
      `/hardware-detection/inventory/sync/${location}`
    );
    return res.data;
  },

  async getStats() {
    const res = await apiClient.get<HardwareDetectionStats>("/hardware-detection/stats");
    return res.data;
  },

  async getHardwareTypes() {
    const res = await apiClient.get<HardwareType[]>("/hardware-detection/hardware-types");
    return res.data;
  },

  async getConditionStatuses() {
    const res = await apiClient.get<ConditionStatus[]>("/hardware-detection/condition-statuses");
    return res.data;
  },

  async getDetectionLocations() {
    const res = await apiClient.get<string[]>("/hardware-detection/locations");
    return res.data;
  },

  async getHardwareTypeMapping() {
    const res = await apiClient.get<Record<HardwareType, string>>("/hardware-detection/hardware-mapping");
    return res.data;
  },

  async getHydroLocations() {
    const res = await apiClient.get<string[]>("/hardware-detection/hydro-integration/locations");
    return res.data;
  },

  async getLocationHealthReport(location: string) {
    const res = await apiClient.get<LocationStatusResponse>(
      `/hardware-detection/hydro-integration/location/${location}/health`
    );
    return res.data;
  },

  async validateLocationHardware(location: string, hoursBack: number = 24) {
    const res = await apiClient.post(
      `/hardware-detection/hydro-integration/location/${location}/validate`,
      null,
      { params: { hours_back: hoursBack } }
    );
    return res.data;
  },

  async getCameraPlacementSuggestions(): Promise<string[]> {
    const res = await apiClient.get("/hardware-detection/hydro-integration/camera-placement-suggestions");
    return res.data;
  },

  async setupLocationInventory(location: string) {
    const res = await apiClient.post(`/hardware-detection/hydro-integration/location/${location}/setup-inventory`);
    return res.data;
  },

  async getDetectionSummaries(location?: string): Promise<HardwareDetectionSummaryResponse[]> {
    const res = await apiClient.get("/hardware-detection/summary", {
      params: location ? { location } : undefined,
    });
    return res.data;
  },
};
