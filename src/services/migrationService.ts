// services/migrationService.ts
import apiClient from "../api/client";

export interface RawDataIn {
  client_id: string;
  payload: Record<string, any>;
}

export const ingestRawData = async (data: RawDataIn) => {
  const res = await apiClient.post("/ingest", data);
  return res.data;
};
