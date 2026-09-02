import React, { useState, useEffect } from 'react';
import type { Lead, CreateLeadRequest, LeadStatus } from '../types/lead.types';
import type { Contact } from '../../contacts/types/contact.types';
import { getContacts } from '../../contacts/api/contacts.api';

interface LeadFormProps {
  initialData?: Lead | null;
  initialContactId?: string;
  onSubmit: (data: CreateLeadRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialData,
  initialContactId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const getContactId = () => {
    if (initialData?.contact) {
      return typeof initialData.contact === 'string'
        ? initialData.contact
        : initialData.contact._id;
    }
    return initialContactId || '';
  };

  const [formData, setFormData] = useState<CreateLeadRequest>({
    contact: getContactId(),
    title: initialData?.title || '',
    status: initialData?.status || 'NEW',
    source: initialData?.source || 'LinkedIn',
    value: initialData?.value ?? 0,
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getContacts()
      .then((data) => setContacts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingContacts(false));
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contact) {
      newErrors.contact = 'Please select an associated contact';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Lead title is required';
    }
    if (formData.value !== undefined && formData.value < 0) {
      newErrors.value = 'Value cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Associated Contact <span className="text-rose-500">*</span>
        </label>
        {loadingContacts ? (
          <div className="text-xs text-slate-400 py-2">Loading contacts...</div>
        ) : (
          <select
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
              errors.contact
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
            } outline-hidden focus:ring-1 transition-all bg-white`}
          >
            <option value="">-- Select Contact --</option>
            {contacts.map((c) => (
              <option key={c._id} value={c._id}>
                {c.firstName} {c.lastName} {c.company ? `(${c.company})` : ''} - {c.email}
              </option>
            ))}
          </select>
        )}
        {errors.contact && (
          <p className="text-xs text-rose-500 mt-1">{errors.contact}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Lead Title / Opportunity <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
            errors.title
              ? 'border-rose-300 focus:ring-rose-500'
              : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
          } outline-hidden focus:ring-1 transition-all`}
          placeholder="e.g., Enterprise Software Licensing"
        />
        {errors.title && (
          <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as LeadStatus })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all bg-white"
          >
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="LOST">Lost</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Lead Source
          </label>
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all bg-white"
          >
            <option value="LinkedIn">LinkedIn</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Outreach">Cold Outreach</option>
            <option value="Event">Event</option>
            <option value="Inbound Call">Inbound Call</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Estimated Value ($)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            $
          </span>
          <input
            type="number"
            min="0"
            step="100"
            value={formData.value || ''}
            onChange={(e) =>
              setFormData({ ...formData, value: Number(e.target.value) || 0 })
            }
            className="w-full pl-8 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all"
            placeholder="50000"
          />
        </div>
        {errors.value && (
          <p className="text-xs text-rose-500 mt-1">{errors.value}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Description / Requirements
        </label>
        <textarea
          rows={3}
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all resize-none"
          placeholder="Details on client needs, budget readiness, timeline..."
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};
