import apiClient from '../../../lib/axios';

import type {
    Contact,
    CreateContactRequest,
    UpdateContactRequest,
} from '../types/contact.types';

export const getContacts = async () => {
    const response =
        await apiClient.get<Contact[]>('/contacts');

    return response.data;
};

export const getContact = async (
    id: string,
) => {
    const response =
        await apiClient.get<Contact>(
            `/contacts/${id}`,
        );

    return response.data;
};

export const createContact = async (
    data: CreateContactRequest,
) => {
    const response =
        await apiClient.post<Contact>(
            '/contacts',
            data,
        );

    return response.data;
};

export const updateContact = async (
    id: string,
    data: UpdateContactRequest,
) => {
    const response =
        await apiClient.patch<Contact>(
            `/contacts/${id}`,
            data,
        );

    return response.data;
};

export const deleteContact = async (
    id: string,
) => {
    await apiClient.delete(`/contacts/${id}`);
};