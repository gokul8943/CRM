import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, Building, Calendar, Tag, FileText, Plus, Handshake, Target } from 'lucide-react';
import type { Contact } from '../types/contact.types';
import { Badge } from '../../../components/common/Badge';
import { getLeadsByContact } from '../../leads/api/leads.api';
import { getDealsByContact } from '../../deals/api/deals.api';
import type { Lead } from '../../leads/types/lead.types';
import type { Deal } from '../../deals/types/deal.types';

interface ContactDetailsDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onAddLead: (contact: Contact) => void;
  onAddDeal: (contact: Contact) => void;
}

export const ContactDetailsDrawer: React.FC<ContactDetailsDrawerProps> = ({
  contact,
  isOpen,
  onClose,
  onEdit,
  onAddLead,
  onAddDeal,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact && isOpen) {
      setLoading(true);
      Promise.all([
        getLeadsByContact(contact._id).catch(() => []),
        getDealsByContact(contact._id).catch(() => []),
      ]).then(([leadsData, dealsData]) => {
        setLeads(leadsData);
        setDeals(dealsData);
        setLoading(false);
      });
    }
  }, [contact, isOpen]);

  if (!isOpen || !contact) return null;

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              {getInitials(contact.firstName, contact.lastName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {contact.firstName} {contact.lastName}
                </h3>
                <Badge
                  variant={contact.status === 'ACTIVE' ? 'emerald' : 'slate'}
                >
                  {contact.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                {contact.jobTitle || 'No title'} {contact.company ? `at ${contact.company}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddDeal(contact)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Deal
            </button>
            <button
              onClick={() => onAddLead(contact)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Lead
            </button>
            <button
              onClick={() => onEdit(contact)}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Contact Details Grid */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2.5 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{contact.phone || 'No phone number'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{contact.company || 'No company'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Source: {contact.source || 'Website'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Added: {new Date(contact.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {contact.notes && (
              <div className="pt-3 border-t border-slate-200/60">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <p className="whitespace-pre-line leading-relaxed">{contact.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Linked Deals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-slate-700" />
                <h4 className="text-sm font-bold text-slate-900">
                  Deals ({deals.length})
                </h4>
              </div>
              <button
                onClick={() => onAddDeal(contact)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Deal
              </button>
            </div>

            {loading ? (
              <div className="py-4 text-center text-xs text-slate-400">Loading deals...</div>
            ) : deals.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No deals associated with this contact yet.
              </div>
            ) : (
              <div className="space-y-2">
                {deals.map((deal) => (
                  <div
                    key={deal._id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between hover:border-indigo-200 transition-colors"
                  >
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900">{deal.title}</h5>
                      <span className="text-xs text-slate-500">
                        ${deal.value.toLocaleString()}
                      </span>
                    </div>
                    <Badge
                      variant={
                        deal.stage === 'CLOSED_WON'
                          ? 'emerald'
                          : deal.stage === 'CLOSED_LOST'
                          ? 'rose'
                          : deal.stage === 'PROSPECTING'
                          ? 'amber'
                          : 'blue'
                      }
                    >
                      {deal.stage}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Linked Leads */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-700" />
                <h4 className="text-sm font-bold text-slate-900">
                  Leads ({leads.length})
                </h4>
              </div>
              <button
                onClick={() => onAddLead(contact)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Lead
              </button>
            </div>

            {loading ? (
              <div className="py-4 text-center text-xs text-slate-400">Loading leads...</div>
            ) : leads.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No leads associated with this contact yet.
              </div>
            ) : (
              <div className="space-y-2">
                {leads.map((lead) => (
                  <div
                    key={lead._id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between hover:border-indigo-200 transition-colors"
                  >
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900">{lead.title}</h5>
                      <span className="text-xs text-slate-500">
                        {lead.value ? `$${lead.value.toLocaleString()}` : 'No value'} • {lead.source || 'Website'}
                      </span>
                    </div>
                    <Badge
                      variant={
                        lead.status === 'QUALIFIED'
                          ? 'indigo'
                          : lead.status === 'CONTACTED'
                          ? 'blue'
                          : lead.status === 'LOST'
                          ? 'rose'
                          : 'amber'
                      }
                    >
                      {lead.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
