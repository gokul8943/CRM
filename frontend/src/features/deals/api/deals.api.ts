import apiClient from '../../../lib/axios';
import type {
  Deal,
  CreateDealRequest,
  UpdateDealRequest,
  DealStage,
} from '../types/deal.types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getDeals = async (): Promise<Deal[]> => {
  const response = await apiClient.get<ApiResponse<Deal[]>>('/deals');
  return response.data.data;
};

export const getDeal = async (id: string): Promise<Deal> => {
  const response = await apiClient.get<ApiResponse<Deal>>(`/deals/${id}`);
  return response.data.data;
};

export const getDealsByContact = async (contactId: string): Promise<Deal[]> => {
  const response = await apiClient.get<ApiResponse<Deal[]>>(`/deals/contact/${contactId}`);
  return response.data.data;
};

export const createDeal = async (data: CreateDealRequest): Promise<Deal> => {
  const response = await apiClient.post<ApiResponse<Deal>>('/deals', data);
  return response.data.data;
};

export const updateDeal = async (
  id: string,
  data: UpdateDealRequest
): Promise<Deal> => {
  const response = await apiClient.patch<ApiResponse<Deal>>(`/deals/${id}`, data);
  return response.data.data;
};

export const updateDealStage = async (
  id: string,
  stage: DealStage
): Promise<Deal> => {
  const response = await apiClient.patch<ApiResponse<Deal>>(`/deals/${id}/stage`, { stage });
  return response.data.data;
};

export const deleteDeal = async (id: string): Promise<void> => {
  await apiClient.delete(`/deals/${id}`);
};
