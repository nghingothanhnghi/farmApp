// src/services/hydroActuatorService.ts

import apiClient from "../api/client";
import type { HydroActuator } from "../models/interfaces/HydroSystem";

export const actuatorService = {
  async getAll(): Promise<HydroActuator[]> {
    const res = await apiClient.get("/actuators");
    return res.data;
  },

  getByDevice: async (device_id: number): Promise<HydroActuator[]> => {
    const response = await apiClient.get(`/actuators/device/${device_id}`);
    return response.data;
  },

  getOne: async (id: number): Promise<HydroActuator> => {
    const response = await apiClient.get(`/actuators/${id}`);
    return response.data;
  },

  async create(data: Partial<HydroActuator>): Promise<HydroActuator> {
    const res = await apiClient.post("/actuators", data);
    return res.data;
  },

  async update(id: number, data: Partial<HydroActuator>): Promise<HydroActuator> {
    const res = await apiClient.put(`/actuators/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/actuators/${id}`);
  },
};
