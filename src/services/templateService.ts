import apiClient from "../api/client"; // already configured with base URL & auth
import type { Template } from '../models/types/Template';

export const getAllTemplates = async (): Promise<Template[]> => {
  const response = await apiClient.get('/templates');
  return response.data;
};


export const getTemplateByClientId = async (clientId: string): Promise<Template> => {
  const res = await apiClient.get(`/templates/${clientId}`);
  return res.data;
};

export const createTemplate = async (data: {
  client_id: string;
  mapping: Record<string, any>;
}): Promise<Template> => {
  const response = await apiClient.post('/templates', data);
  return response.data;
};