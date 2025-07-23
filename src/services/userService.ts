// src/services/userService.ts
import apiClient from '../api/client';
import type { User } from '../models/interfaces/User';

interface CreateUserPayload {
  username: string;
  password: string;
  email: string;
  client_id: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}


interface UpdateUserPayload {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  password?: string;
}

export async function createUser(data: CreateUserPayload): Promise<User> {
  const response = await apiClient.post('/users/', data);
  return response.data;
}


export async function updateUser(userId: number, data: UpdateUserPayload): Promise<User> {
  const response = await apiClient.put(`/users/${userId}`, data);
  return response.data;
}


export async function getUserById(userId: number): Promise<User> {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
}

export async function getAllUsers(): Promise<User[]> {
  const response = await apiClient.get('/users');
  return response.data;
}

export async function getUsersByClientId(clientId: string): Promise<User[]> {
  const response = await apiClient.get(`/users/by-client/${clientId}`);
  return response.data;
}

export async function deleteUser(userId: number): Promise<void> {
  await apiClient.delete(`/users/${userId}`);
}

export async function uploadUserImage(userId: number, file: File): Promise<User> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(`/users/${userId}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}