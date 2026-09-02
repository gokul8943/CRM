import React, { useEffect, useState, useMemo } from 'react';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../api/contacts.api';
import type { Contact, CreateContactRequest } from '../types/contact.types';
import { ContactTable } from '../components/ContactTable';
import { ContactFilters } from '../components/ContactFilters';
import { ContactModal } from '../components/ContactModal';
import { ContactDetailsDrawer } from '../components/ContactDetailsDrawer';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useToast } from '../../../components/common/ToastContext';
import { UserCheck, Users, UserMinus, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleCreateOrUpdate = async (formData: CreateContactRequest) => {
    try {
      setActionLoading(true);
      if (editingContact) {
        const updated = await updateContact(editingContact._id, formData);
        setContacts((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
        if (viewingContact?._id === updated._id) {
          setViewingContact(updated);
        }
        showToast('success', 'Contact updated successfully');
      } else {
        const created = await createContact(formData);
        setContacts((prev) => [created, ...prev]);
        showToast('success', 'Contact created successfully');
      }
      setIsModalOpen(false);
      setEditingContact(null);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save contact');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingContact) return;
    try {
      setActionLoading(true);
      await deleteContact(deletingContact._id);
      setContacts((prev) => prev.filter((c) => c._id !== deletingContact._id));
      if (viewingContact?._id === deletingContact._id) {
        setViewingContact(null);
      }
      showToast('success', 'Contact deleted successfully');
      setDeletingContact(null);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete contact');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesStatus =
        statusFilter === 'ALL' || c.status === statusFilter;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        (c.company && c.company.toLowerCase().includes(searchLower)) ||
        (c.phone && c.phone.includes(searchTerm));
      return matchesStatus && matchesSearch;
    });
  }, [contacts, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = contacts.length;
    const active = contacts.filter((c) => c.status === 'ACTIVE').length;
    const inactive = contacts.filter((c) => c.status === 'INACTIVE').length;
    return { total, active, inactive };
  }, [contacts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Contacts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain your customer relationships, prospective clients, and key partners.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingContact(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Contacts</span>
            <div className="text-xl font-bold text-slate-900">{stats.total}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Active Contacts</span>
            <div className="text-xl font-bold text-slate-900">{stats.active}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
            <UserMinus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Inactive</span>
            <div className="text-xl font-bold text-slate-900">{stats.inactive}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ContactFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={filteredContacts.length}
      />

      {/* Table & Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Loading contacts...</span>
          </div>
        </div>
      ) : (
        <ContactTable
          contacts={filteredContacts}
          onView={(contact) => setViewingContact(contact)}
          onEdit={(contact) => {
            setEditingContact(contact);
            setIsModalOpen(true);
          }}
          onDelete={(contact) => setDeletingContact(contact)}
        />
      )}

      {/* Modals & Drawers */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        contact={editingContact}
        onSubmit={handleCreateOrUpdate}
        loading={actionLoading}
      />

      <ContactDetailsDrawer
        contact={viewingContact}
        isOpen={!!viewingContact}
        onClose={() => setViewingContact(null)}
        onEdit={(c) => {
          setEditingContact(c);
          setIsModalOpen(true);
        }}
        onAddLead={(c) => {
          setViewingContact(null);
          navigate(`/leads?contactId=${c._id}`);
        }}
        onAddDeal={(c) => {
          setViewingContact(null);
          navigate(`/deals?contactId=${c._id}`);
        }}
      />

      <ConfirmDialog
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message={`Are you sure you want to delete ${deletingContact?.firstName} ${deletingContact?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={actionLoading}
      />
    </div>
  );
};