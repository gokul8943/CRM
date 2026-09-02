import { useEffect, useState } from 'react';

import {
    getContacts,
} from '../api/contacts.api';

import type {
    Contact,
} from '../types/contact.types';

export const ContactsPage = () => {
    const [contacts, setContacts] =
        useState<Contact[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const data = await getContacts();

                setContacts(data);
            } catch (error) {
                console.error(
                    'Failed to fetch contacts',
                    error,
                );
            } finally {
                setLoading(false);
            }
        };

        loadContacts();
    }, []);

    if (loading) {
        return <div>Loading contacts...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Contacts
                    </h1>

                    <p className="text-sm text-slate-500">
                        Manage your CRM contacts.
                    </p>
                </div>

                <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                    Add Contact
                </button>
            </div>

            {/* ContactTable */}
        </div>
    );
};