import React from 'react';
import type { Deal, DealStage } from '../types/deal.types';
import type { Contact } from '../../contacts/types/contact.types';
import type { Lead } from '../../leads/types/lead.types';
import { DEAL_STAGES, getStageCategory } from '../types/deal.types';
import { Badge } from '../../../components/common/Badge';
import { Handshake, User, Calendar, Edit2, Trash2, Eye } from 'lucide-react';

interface DealTableProps {
  deals: Deal[];
  onStageChange: (dealId: string, stage: DealStage) => Promise<void>;
  onViewDetails: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export const DealTable: React.FC<DealTableProps> = ({
  deals,
  onStageChange,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Handshake className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">No deals found</h4>
        <p className="text-sm text-slate-500 max-w-sm">
          No deals match your current query or filter. Create a deal or clear filters to view pipeline.
        </p>
      </div>
    );
  }

  const getContactDisplay = (contact: string | Contact) => {
    if (!contact) return 'Unassigned';
    if (typeof contact === 'string') return `Contact: ${contact.slice(-6)}`;
    return `${contact.firstName} ${contact.lastName}${
      contact.company ? ` (${contact.company})` : ''
    }`;
  };

  const getLeadDisplay = (lead?: string | Lead) => {
    if (!lead) return null;
    if (typeof lead === 'string') return `Lead: ${lead.slice(-6)}`;
    return lead.title;
  };

  const getCategoryBadgeVariant = (stage: DealStage) => {
    const cat = getStageCategory(stage);
    switch (cat) {
      case 'Won':
        return 'emerald';
      case 'Lost':
        return 'rose';
      case 'In Progress':
        return 'blue';
      case 'New':
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
              <th className="py-3.5 px-6">Deal Opportunity</th>
              <th className="py-3.5 px-6">Contact & Lead</th>
              <th className="py-3.5 px-6">Value</th>
              <th className="py-3.5 px-6">Stage Category</th>
              <th className="py-3.5 px-6">Current Stage</th>
              <th className="py-3.5 px-6">Target Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {deals.map((deal) => {
              const leadTitle = getLeadDisplay(deal.lead);
              const category = getStageCategory(deal.stage);
              return (
                <tr
                  key={deal._id}
                  onClick={() => onViewDetails(deal)}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {deal.title}
                      </div>
                      {deal.description && (
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                          {deal.description}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{getContactDisplay(deal.contact)}</span>
                      </div>
                      {leadTitle && (
                        <div className="text-2xs text-slate-400">
                          From Lead: {leadTitle}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 text-base">
                      ${deal.value.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <Badge variant={getCategoryBadgeVariant(deal.stage)}>
                      {category}
                    </Badge>
                  </td>

                  <td
                    className="py-4 px-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={deal.stage}
                      onChange={(e) =>
                        onStageChange(deal._id, e.target.value as DealStage)
                      }
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-medium focus:outline-hidden focus:border-slate-900"
                    >
                      {DEAL_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-500">
                    {deal.expectedCloseDate ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>

                  <td
                    className="py-4 px-6 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(deal)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Stage History & Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(deal)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Deal"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(deal)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Deal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
