import React, { useState, useEffect } from 'react';
import type { Deal, CreateDealRequest, DealStage } from '../types/deal.types';
import type { Contact } from '../../contacts/types/contact.types';
import type { Lead } from '../../leads/types/lead.types';
import { getContacts } from '../../contacts/api/contacts.api';
import { getLeads } from '../../leads/api/leads.api';
import { DEAL_STAGES } from '../types/deal.types';

interface DealFormProps {
  initialData?: Deal | null;
  initialContactId?: string;
  initialLeadId?: string;
  initialTitle?: string;
  initialValue?: number;
  onSubmit: (data: CreateDealRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const DealForm: React.FC<DealFormProps> = ({
  initialData,
  initialContactId,
  initialLeadId,
  initialTitle,
  initialValue,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingDependencies, setLoadingDependencies] = useState(true);

  const getInitialContactId = () => {
    if (initialData?.contact) {
      return typeof initialData.contact === 'string'
        ? initialData.contact
        : initialData.contact._id;
    }
    return initialContactId || '';
  };

  const getInitialLeadId = () => {
    if (initialData?.lead) {
      return typeof initialData.lead === 'string'
        ? initialData.lead
        : initialData.lead._id;
    }
    return initialLeadId || '';
  };

  const [formData, setFormData] = useState<CreateDealRequest>({
    contact: getInitialContactId(),
    lead: getInitialLeadId() || undefined,
    title: initialData?.title || initialTitle || '',
    value: initialData?.value ?? initialValue ?? 0,
    stage: initialData?.stage || 'PROSPECTING',
    expectedCloseDate: initialData?.expectedCloseDate
      ? new Date(initialData.expectedCloseDate).toISOString().split('T')[0]
      : '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([getContacts().catch(() => []), getLeads().catch(() => [])])
      .then(([contactsData, leadsData]) => {
        setContacts(contactsData);
        setLeads(leadsData);
      })
      .finally(() => setLoadingDependencies(false));
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contact) {
      newErrors.contact = 'Please select a contact';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required';
    }
    if (formData.value === undefined || formData.value < 0) {
      newErrors.value = 'Deal value must be 0 or greater';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...formData,
      lead: formData.lead ? formData.lead : undefined,
      expectedCloseDate: formData.expectedCloseDate || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Contact <span className="text-rose-500">*</span>
        </label>
        {loadingDependencies ? (
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
                {c.firstName} {c.lastName} {c.company ? `(${c.company})` : ''}
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
          Deal Title <span className="text-rose-500">*</span>
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
          placeholder="e.g., Enterprise Annual Plan"
        />
        {errors.title && (
          <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Deal Value ($) <span className="text-rose-500">*</span>
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
              className={`w-full pl-8 pr-3.5 py-2 text-sm rounded-xl border ${
                errors.value
                  ? 'border-rose-300 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
              } outline-hidden focus:ring-1 transition-all`}
              placeholder="50000"
            />
          </div>
          {errors.value && (
            <p className="text-xs text-rose-500 mt-1">{errors.value}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Initial Stage
          </label>
          <select
            value={formData.stage}
            onChange={(e) =>
              setFormData({ ...formData, stage: e.target.value as DealStage })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all bg-white"
          >
            {DEAL_STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Originating Lead (Optional)
          </label>
          <select
            value={formData.lead || ''}
            onChange={(e) =>
              setFormData({ ...formData, lead: e.target.value || undefined })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all bg-white"
          >
            <option value="">-- None / Independent Deal --</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id}>
                {l.title} {l.value ? `($${l.value.toLocaleString()})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Target Close Date
          </label>
          <input
            type="date"
            value={formData.expectedCloseDate || ''}
            onChange={(e) =>
              setFormData({ ...formData, expectedCloseDate: e.target.value })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Description / Scope of Work
        </label>
        <textarea
          rows={3}
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all resize-none"
          placeholder="Implementation deliverables, agreed discounts, payment terms..."
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
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Deal'}
        </button>
      </div>
    </form>
  );
};
