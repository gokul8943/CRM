import React, { useEffect, useState, useMemo } from 'react';
import {
  getDeals,
  createDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
} from '../api/deals.api';
import type { Deal, CreateDealRequest, DealStage } from '../types/deal.types';
import { getStageCategory } from '../types/deal.types';
import { DealKanban } from '../components/DealKanban';
import { DealTable } from '../components/DealTable';
import { DealFilters } from '../components/DealFilters';
import { DealModal } from '../components/DealModal';
import { DealDetailsModal } from '../components/DealDetailsModal';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useToast } from '../../../components/common/ToastContext';
import {
  Handshake,
  TrendingUp,
  Trophy,
  XCircle,
  Plus,
  Loader2,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters & Views
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [viewingDeal, setViewingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);

  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL seed params (from Leads / Contacts)
  const isNewFromQuery = searchParams.get('newDeal') === 'true';
  const queryLeadId = searchParams.get('leadId') || undefined;
  const queryContactId = searchParams.get('contactId') || undefined;
  const queryTitle = searchParams.get('title') || undefined;
  const queryValue = searchParams.get('value')
    ? Number(searchParams.get('value'))
    : undefined;

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await getDeals();
      setDeals(data);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
    if (isNewFromQuery || queryContactId) {
      setIsModalOpen(true);
    }
  }, []);

  const handleCreateOrUpdate = async (formData: CreateDealRequest) => {
    try {
      setActionLoading(true);
      if (editingDeal) {
        const updated = await updateDeal(editingDeal._id, formData);
        setDeals((prev) =>
          prev.map((d) => (d._id === updated._id ? updated : d))
        );
        if (viewingDeal?._id === updated._id) {
          setViewingDeal(updated);
        }
        showToast('success', 'Deal updated successfully');
      } else {
        const created = await createDeal(formData);
        setDeals((prev) => [created, ...prev]);
        showToast('success', 'Deal created successfully');
      }
      setIsModalOpen(false);
      setEditingDeal(null);
      // Clean query params if any
      if (isNewFromQuery) {
        setSearchParams({});
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save deal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStageChange = async (dealId: string, stage: DealStage) => {
    try {
      const updated = await updateDealStage(dealId, stage);
      setDeals((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d))
      );
      if (viewingDeal?._id === updated._id) {
        setViewingDeal(updated);
      }
      showToast(
        'success',
        `Deal stage updated to ${stage.replace('_', ' ')}`
      );
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update deal stage');
    }
  };

  const handleDelete = async () => {
    if (!deletingDeal) return;
    try {
      setActionLoading(true);
      await deleteDeal(deletingDeal._id);
      setDeals((prev) => prev.filter((d) => d._id !== deletingDeal._id));
      if (viewingDeal?._id === deletingDeal._id) {
        setViewingDeal(null);
      }
      showToast('success', 'Deal deleted successfully');
      setDeletingDeal(null);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete deal');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      const category = getStageCategory(d.stage);
      const matchesCategory =
        categoryFilter === 'ALL' || category === categoryFilter;

      const searchLower = searchTerm.toLowerCase();
      const contactName =
        typeof d.contact === 'object' && d.contact
          ? `${d.contact.firstName} ${d.contact.lastName} ${d.contact.company || ''}`.toLowerCase()
          : '';
      const matchesSearch =
        !searchTerm ||
        d.title.toLowerCase().includes(searchLower) ||
        contactName.includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [deals, categoryFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = deals.length;
    const activeDeals = deals.filter((d) => {
      const cat = getStageCategory(d.stage);
      return cat === 'New' || cat === 'In Progress';
    });
    const activePipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);

    const wonDeals = deals.filter((d) => d.stage === 'CLOSED_WON');
    const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

    const lostDeals = deals.filter((d) => d.stage === 'CLOSED_LOST');
    const lostValue = lostDeals.reduce((sum, d) => sum + d.value, 0);

    return {
      total,
      activeCount: activeDeals.length,
      activePipelineValue,
      wonCount: wonDeals.length,
      wonValue,
      lostCount: lostDeals.length,
      lostValue,
    };
  }, [deals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Deals & Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track deals across pipeline stages: New, In Progress, Won, and Lost.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDeal(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Deals</span>
            <div className="text-xl font-bold text-slate-900">{stats.total}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Active Pipeline</span>
            <div className="text-xl font-bold text-slate-900">
              ${stats.activePipelineValue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Won Revenue</span>
            <div className="text-xl font-bold text-emerald-600">
              ${stats.wonValue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Lost Deals</span>
            <div className="text-xl font-bold text-rose-600">
              ${stats.lostValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & View Mode */}
      <DealFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={filteredDeals.length}
      />

      {/* Main Pipeline View */}
      {loading ? (
        <div className="flex items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Loading pipeline...</span>
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        <DealKanban
          deals={filteredDeals}
          onStageChange={handleStageChange}
          onViewDetails={(deal) => setViewingDeal(deal)}
          onEdit={(deal) => {
            setEditingDeal(deal);
            setIsModalOpen(true);
          }}
          onDelete={(deal) => setDeletingDeal(deal)}
        />
      ) : (
        <DealTable
          deals={filteredDeals}
          onStageChange={handleStageChange}
          onViewDetails={(deal) => setViewingDeal(deal)}
          onEdit={(deal) => {
            setEditingDeal(deal);
            setIsModalOpen(true);
          }}
          onDelete={(deal) => setDeletingDeal(deal)}
        />
      )}

      {/* Modals & Details */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDeal(null);
        }}
        deal={editingDeal}
        initialContactId={queryContactId}
        initialLeadId={queryLeadId}
        initialTitle={queryTitle}
        initialValue={queryValue}
        onSubmit={handleCreateOrUpdate}
        loading={actionLoading}
      />

      <DealDetailsModal
        deal={viewingDeal}
        isOpen={!!viewingDeal}
        onClose={() => setViewingDeal(null)}
        onStageChange={handleStageChange}
        onEdit={(deal) => {
          setViewingDeal(null);
          setEditingDeal(deal);
          setIsModalOpen(true);
        }}
      />

      <ConfirmDialog
        isOpen={!!deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={handleDelete}
        title="Delete Deal"
        message={`Are you sure you want to delete deal "${deletingDeal?.title}"?`}
        confirmLabel="Delete"
        loading={actionLoading}
      />
    </div>
  );
};
