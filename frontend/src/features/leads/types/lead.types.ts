import type { Contact } from '../../contacts/types/contact.types';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';

export interface Lead {
  _id: string;
  contact: string | Contact;
  title: string;
  status: LeadStatus;
  source?: string;
  value?: number;
  description?: string;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  contact: string;
  title: string;
  status?: LeadStatus;
  source?: string;
  value?: number;
  description?: string;
  assignedTo?: string;
}

export type UpdateLeadRequest = Partial<CreateLeadRequest>;
