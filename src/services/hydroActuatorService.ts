import apiClient from "../api/client";
import type { HydroDevice } from "../models/interfaces/HydroSystem";

export const actuatorService = {
  async getAll(): Promise<HydroDevice[]> {
    const res = await apiClient.get("/actuators");
    return res.data;
  },

    async get(id: number): Promise<HydroDevice> {
    const res = await apiClient.get(`/actuators/${id}`);
    return res.data;
  },

  async create(data: Partial<HydroDevice>): Promise<HydroDevice> {
    const res = await apiClient.post("/actuators", data);
    return res.data;
  },

  async update(id: number, data: Partial<HydroDevice>): Promise<HydroDevice> {
    const res = await apiClient.put(`/actuators/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/actuators/${id}`);
  },
};
