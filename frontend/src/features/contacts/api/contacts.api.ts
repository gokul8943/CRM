import apiClient from '../../../lib/axios';
import type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
} from '../types/contact.types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getContacts = async (): Promise<Contact[]> => {
  const response = await apiClient.get<ApiResponse<Contact[]>>('/contacts');
  return response.data.data;
};

export const getContact = async (id: string): Promise<Contact> => {
  const response = await apiClient.get<ApiResponse<Contact>>(`/contacts/${id}`);
  return response.data.data;
};

export const createContact = async (
  data: CreateContactRequest
): Promise<Contact> => {
  const response = await apiClient.post<ApiResponse<Contact>>('/contacts', data);
  return response.data.data;
};

export const updateContact = async (
  id: string,
  data: UpdateContactRequest
): Promise<Contact> => {
  const response = await apiClient.patch<ApiResponse<Contact>>(`/contacts/${id}`, data);
  return response.data.data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await apiClient.delete(`/contacts/${id}`);
};