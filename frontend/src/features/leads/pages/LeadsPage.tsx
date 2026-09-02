import React, { useEffect, useState, useMemo } from 'react';
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from '../api/leads.api';
import type { Lead, CreateLeadRequest } from '../types/lead.types';
import { LeadTable } from '../components/LeadTable';
import { LeadFilters } from '../components/LeadFilters';
import { LeadModal } from '../components/LeadModal';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useToast } from '../../../components/common/ToastContext';
import { Target, Sparkles, CheckCircle2, DollarSign, Plus, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contactIdParam = searchParams.get('contactId');

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    if (contactIdParam) {
      setIsModalOpen(true);
    }
  }, [contactIdParam]);

  const handleCreateOrUpdate = async (formData: CreateLeadRequest) => {
    try {
      setActionLoading(true);
      if (editingLead) {
        const updated = await updateLead(editingLead._id, formData);
        setLeads((prev) =>
          prev.map((l) => (l._id === updated._id ? updated : l))
        );
        showToast('success', 'Lead updated successfully');
      } else {
        const created = await createLead(formData);
        setLeads((prev) => [created, ...prev]);
        showToast('success', 'Lead created successfully');
      }
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save lead');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLead) return;
    try {
      setActionLoading(true);
      await deleteLead(deletingLead._id);
      setLeads((prev) => prev.filter((l) => l._id !== deletingLead._id));
      showToast('success', 'Lead deleted successfully');
      setDeletingLead(null);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete lead');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvertToDeal = (lead: Lead) => {
    const contactId =
      typeof lead.contact === 'string' ? lead.contact : lead.contact._id;
    navigate(
      `/deals?newDeal=true&leadId=${lead._id}&contactId=${contactId}&title=${encodeURIComponent(
        lead.title
      )}&value=${lead.value || 0}`
    );
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesStatus =
        statusFilter === 'ALL' || l.status === statusFilter;
      const searchLower = searchTerm.toLowerCase();
      const contactName =
        typeof l.contact === 'object' && l.contact
          ? `${l.contact.firstName} ${l.contact.lastName} ${l.contact.company || ''}`.toLowerCase()
          : '';
      const matchesSearch =
        !searchTerm ||
        l.title.toLowerCase().includes(searchLower) ||
        contactName.includes(searchLower) ||
        (l.source && l.source.toLowerCase().includes(searchLower));
      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'NEW').length;
    const qualifiedCount = leads.filter((l) => l.status === 'QUALIFIED').length;
    const totalPipelineValue = leads.reduce((acc, l) => acc + (l.value || 0), 0);
    return { total, newCount, qualifiedCount, totalPipelineValue };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track early stage prospects, qualification statuses, and conversion opportunities.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingLead(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Leads</span>
            <div className="text-xl font-bold text-slate-900">{stats.total}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">New Leads</span>
            <div className="text-xl font-bold text-slate-900">{stats.newCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Qualified</span>
            <div className="text-xl font-bold text-slate-900">{stats.qualifiedCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Pipeline Potential</span>
            <div className="text-xl font-bold text-slate-900">
              ${stats.totalPipelineValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={filteredLeads.length}
      />

      {/* Table & Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Loading leads...</span>
          </div>
        </div>
      ) : (
        <LeadTable
          leads={filteredLeads}
          onEdit={(lead) => {
            setEditingLead(lead);
            setIsModalOpen(true);
          }}
          onDelete={(lead) => setDeletingLead(lead)}
          onConvertToDeal={handleConvertToDeal}
        />
      )}

      {/* Modals */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        lead={editingLead}
        initialContactId={contactIdParam || undefined}
        onSubmit={handleCreateOrUpdate}
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete lead "${deletingLead?.title}"?`}
        confirmLabel="Delete"
        loading={actionLoading}
      />
    </div>
  );
};
