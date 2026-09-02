import apiClient from '../../../lib/axios';
import type {
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
} from '../types/lead.types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getLeads = async (): Promise<Lead[]> => {
  const response = await apiClient.get<ApiResponse<Lead[]>>('/leads');
  return response.data.data;
};

export const getLead = async (id: string): Promise<Lead> => {
  const response = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
  return response.data.data;
};

export const getLeadsByContact = async (contactId: string): Promise<Lead[]> => {
  const response = await apiClient.get<ApiResponse<Lead[]>>(`/leads/contact/${contactId}`);
  return response.data.data;
};

export const createLead = async (data: CreateLeadRequest): Promise<Lead> => {
  const response = await apiClient.post<ApiResponse<Lead>>('/leads', data);
  return response.data.data;
};

export const updateLead = async (
  id: string,
  data: UpdateLeadRequest
): Promise<Lead> => {
  const response = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
  return response.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await apiClient.delete(`/leads/${id}`);
};
