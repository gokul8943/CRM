export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  status: 'ACTIVE' | 'INACTIVE';
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  source?: string;
  notes?: string;
}

export type UpdateContactRequest = Partial<CreateContactRequest>;