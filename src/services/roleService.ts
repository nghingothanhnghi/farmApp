// services/roleService.ts
import apiClient from "../api/client";
import type { Role } from "../models/interfaces/Role";

export const getAllRoles = async (): Promise<Role[]> => {
  const res = await apiClient.get("/roles");
  return res.data;
};

export const assignRoleToUser = async (payload: {
  userId: number;
  roleId: number;
}) => {
  return apiClient.post("/roles/assign", {
    user_id: payload.userId,
    role_id: payload.roleId,
  });
};

export const removeRoleFromUser = async (userId: number, roleId: number) => {
  return apiClient.delete(`/roles/assign/${userId}/${roleId}`);
};


export const toggleRoleActive = async (roleId: number): Promise<Role> => {
  const response = await apiClient.patch<Role>(`/roles/toggle/${roleId}`);
  return response.data;
};