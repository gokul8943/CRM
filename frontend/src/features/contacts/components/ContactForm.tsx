import React, { useState } from 'react';
import type { Contact, CreateContactRequest } from '../types/contact.types';

interface ContactFormProps {
  initialData?: Contact | null;
  onSubmit: (data: CreateContactRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateContactRequest>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    jobTitle: initialData?.jobTitle || '',
    status: initialData?.status || 'ACTIVE',
    source: initialData?.source || 'Website',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            First Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
              errors.firstName
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
            } outline-hidden focus:ring-1 transition-all`}
            placeholder="Jane"
          />
          {errors.firstName && (
            <p className="text-xs text-rose-500 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Last Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
              errors.lastName
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
            } outline-hidden focus:ring-1 transition-all`}
            placeholder="Smith"
          />
          {errors.lastName && (
            <p className="text-xs text-rose-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
              errors.email
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
            } outline-hidden focus:ring-1 transition-all`}
            placeholder="jane@company.com"
          />
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Company
          </label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Title
          </label>
          <input
            type="text"
            value={formData.jobTitle || ''}
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all"
            placeholder="VP of Sales"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'ACTIVE' | 'INACTIVE',
              })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all bg-white"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Lead Source
          </label>
          <select
            value={formData.source || 'Website'}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all bg-white"
          >
            <option value="Website">Website</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option>
            <option value="Cold Outreach">Cold Outreach</option>
            <option value="Trade Show">Trade Show</option>
            <option value="Partner">Partner</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Notes
        </label>
        <textarea
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all resize-none"
          placeholder="Key details about this contact..."
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
          {loading
            ? 'Saving...'
            : initialData
            ? 'Save Changes'
            : 'Create Contact'}
        </button>
      </div>
    </form>
  );
};
