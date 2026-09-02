import React, { useState } from 'react';
import type { Deal, DealStage, DealStageCategory } from '../types/deal.types';
import type { Contact } from '../../contacts/types/contact.types';
import { DEAL_STAGES, getStageCategory } from '../types/deal.types';
import { Badge } from '../../../components/common/Badge';
import {
  Sparkles,
  PlayCircle,
  Trophy,
  XCircle,
  Calendar,
  User,
  CheckCircle,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';

interface DealKanbanProps {
  deals: Deal[];
  onStageChange: (dealId: string, stage: DealStage) => Promise<void>;
  onViewDetails: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

interface ColumnConfig {
  id: DealStageCategory;
  title: string;
  defaultStage: DealStage;
  icon: React.ElementType;
  badgeVariant: 'amber' | 'blue' | 'emerald' | 'rose';
  borderClass: string;
  headerBg: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'New',
    title: 'New Opportunities',
    defaultStage: 'PROSPECTING',
    icon: Sparkles,
    badgeVariant: 'amber',
    borderClass: 'border-amber-200',
    headerBg: 'bg-amber-50/70 text-amber-950',
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    defaultStage: 'QUALIFICATION',
    icon: PlayCircle,
    badgeVariant: 'blue',
    borderClass: 'border-sky-200',
    headerBg: 'bg-sky-50/70 text-sky-950',
  },
  {
    id: 'Won',
    title: 'Closed Won',
    defaultStage: 'CLOSED_WON',
    icon: Trophy,
    badgeVariant: 'emerald',
    borderClass: 'border-emerald-200',
    headerBg: 'bg-emerald-50/70 text-emerald-950',
  },
  {
    id: 'Lost',
    title: 'Closed Lost',
    defaultStage: 'CLOSED_LOST',
    icon: XCircle,
    badgeVariant: 'rose',
    borderClass: 'border-rose-200',
    headerBg: 'bg-rose-50/70 text-rose-950',
  },
];

export const DealKanban: React.FC<DealKanbanProps> = ({
  deals,
  onStageChange,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<DealStageCategory | null>(
    null
  );

  const getDealsForCategory = (category: DealStageCategory) => {
    return deals.filter((d) => getStageCategory(d.stage) === category);
  };

  const getCategoryTotal = (category: DealStageCategory) => {
    return getDealsForCategory(category).reduce((acc, d) => acc + d.value, 0);
  };

  const getContactDisplay = (contact: string | Contact) => {
    if (!contact) return 'Unassigned';
    if (typeof contact === 'string') return `Contact ID: ${contact.slice(-6)}`;
    return `${contact.firstName} ${contact.lastName}${
      contact.company ? ` • ${contact.company}` : ''
    }`;
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, column: DealStageCategory) => {
    e.preventDefault();
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, column: ColumnConfig) => {
    e.preventDefault();
    setDragOverColumn(null);
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (!dealId) return;

    const deal = deals.find((d) => d._id === dealId);
    if (!deal) return;

    if (getStageCategory(deal.stage) === column.id) return;

    await onStageChange(dealId, column.defaultStage);
    setDraggedDealId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const colDeals = getDealsForCategory(col.id);
        const colTotal = getCategoryTotal(col.id);
        const Icon = col.icon;
        const isOver = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col)}
            className={`flex flex-col rounded-2xl bg-slate-100/75 border transition-all duration-150 min-h-[500px] ${
              isOver
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40'
                : 'border-slate-200/80'
            }`}
          >
            {/* Column Header */}
            <div
              className={`p-3.5 border-b rounded-t-2xl flex items-center justify-between ${col.headerBg} border-slate-200/60`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {col.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 shadow-2xs">
                  {colDeals.length}
                </span>
              </div>
            </div>

            {/* Column Summary */}
            <div className="px-3.5 py-2 bg-white/40 border-b border-slate-200/40 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Stage Value</span>
              <span className="font-bold text-slate-800">
                ${colTotal.toLocaleString()}
              </span>
            </div>

            {/* Deal Cards */}
            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              {colDeals.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-xl">
                  <span className="text-xs text-slate-400 font-medium">
                    Drop deals here
                  </span>
                </div>
              ) : (
                colDeals.map((deal) => {
                  const stageMeta = DEAL_STAGES.find((s) => s.id === deal.stage);
                  return (
                    <div
                      key={deal._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal._id)}
                      onClick={() => onViewDetails(deal)}
                      className="group p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing space-y-3"
                    >
                      {/* Card Title & Sub-stage */}
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {deal.title}
                        </h4>
                        <Badge variant={col.badgeVariant} size="sm">
                          {stageMeta?.label || deal.stage}
                        </Badge>
                      </div>

                      {/* Deal Value */}
                      <div className="text-lg font-bold text-slate-900">
                        ${deal.value.toLocaleString()}
                      </div>

                      {/* Contact & Date Info */}
                      <div className="space-y-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 truncate">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {getContactDisplay(deal.contact)}
                          </span>
                        </div>

                        {deal.expectedCloseDate && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Target:{' '}
                              {new Date(
                                deal.expectedCloseDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Stage Progression */}
                      <div
                        className="pt-2 flex items-center justify-between gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={deal.stage}
                          onChange={(e) =>
                            onStageChange(deal._id, e.target.value as DealStage)
                          }
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-hidden focus:border-slate-900"
                        >
                          {DEAL_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          {deal.stage !== 'CLOSED_WON' && (
                            <button
                              onClick={() =>
                                onStageChange(deal._id, 'CLOSED_WON')
                              }
                              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Mark as Won"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {deal.stage !== 'CLOSED_LOST' && (
                            <button
                              onClick={() =>
                                onStageChange(deal._id, 'CLOSED_LOST')
                              }
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Mark as Lost"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onEdit(deal)}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit Deal"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(deal)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Deal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
