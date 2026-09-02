export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    companyId?: string;
    status: 'LEAD' | 'CUSTOMER' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    companyId?: string;
    status: 'LEAD' | 'CUSTOMER' | 'INACTIVE';
}

export type UpdateContactRequest =
    Partial<CreateContactRequest>;