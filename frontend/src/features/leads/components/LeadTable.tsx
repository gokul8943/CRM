import React from 'react';
import type { Lead } from '../types/lead.types';
import type { Contact } from '../../contacts/types/contact.types';
import { Badge } from '../../../components/common/Badge';
import { Target, User, Edit2, Trash2, Handshake, Calendar } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onConvertToDeal: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onEdit,
  onDelete,
  onConvertToDeal,
}) => {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Target className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">No leads found</h4>
        <p className="text-sm text-slate-500 max-w-sm">
          No leads match your current query. Create a new lead or adjust your filter.
        </p>
      </div>
    );
  }

  const getContactDisplay = (contact: string | Contact) => {
    if (!contact) return 'Unassigned';
    if (typeof contact === 'string') return `Contact ID: ${contact.slice(-6)}`;
    return `${contact.firstName} ${contact.lastName}${
      contact.company ? ` (${contact.company})` : ''
    }`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'QUALIFIED':
        return 'indigo';
      case 'CONTACTED':
        return 'blue';
      case 'LOST':
        return 'rose';
      case 'NEW':
      default:
        return 'amber';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-6">Lead Opportunity</th>
              <th className="py-3.5 px-6">Associated Contact</th>
              <th className="py-3.5 px-6">Est. Value</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Source</th>
              <th className="py-3.5 px-6">Date Added</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {lead.title}
                    </div>
                    {lead.description && (
                      <div className="text-xs text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                        {lead.description}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{getContactDisplay(lead.contact)}</span>
                  </div>
                </td>

                <td className="py-4 px-6 font-semibold text-slate-900">
                  {lead.value !== undefined ? (
                    <span>${lead.value.toLocaleString()}</span>
                  ) : (
                    <span className="text-slate-400 font-normal italic text-xs">—</span>
                  )}
                </td>

                <td className="py-4 px-6">
                  <Badge variant={getStatusVariant(lead.status)}>
                    {lead.status}
                  </Badge>
                </td>

                <td className="py-4 px-6">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {lead.source || 'Website'}
                  </span>
                </td>

                <td className="py-4 px-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onConvertToDeal(lead)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Convert this lead to an active Deal"
                    >
                      <Handshake className="w-3.5 h-3.5" />
                      Convert to Deal
                    </button>
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Lead"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
