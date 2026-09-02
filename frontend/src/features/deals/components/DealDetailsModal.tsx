import React from 'react';
import { Modal } from '../../../components/common/Modal';
import type { Deal, DealStage } from '../types/deal.types';
import type { Contact } from '../../contacts/types/contact.types';
import type { Lead } from '../../leads/types/lead.types';
import { DEAL_STAGES, getStageCategory } from '../types/deal.types';
import { Badge } from '../../../components/common/Badge';
import {
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  Target,
  Clock,
  XCircle,
} from 'lucide-react';

interface DealDetailsModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onStageChange: (dealId: string, stage: DealStage) => Promise<void>;
  onEdit: (deal: Deal) => void;
}

export const DealDetailsModal: React.FC<DealDetailsModalProps> = ({
  deal,
  isOpen,
  onClose,
  onStageChange,
  onEdit,
}) => {
  if (!isOpen || !deal) return null;

  const contact =
    typeof deal.contact === 'object' && deal.contact
      ? (deal.contact as Contact)
      : null;

  const lead =
    typeof deal.lead === 'object' && deal.lead ? (deal.lead as Lead) : null;

  const currentCategory = getStageCategory(deal.stage);

  // Progressive stages for standard funnel
  const funnelStages: DealStage[] = [
    'PROSPECTING',
    'QUALIFICATION',
    'PROPOSAL',
    'NEGOTIATION',
    'CLOSED_WON',
  ];

  const currentStageIndex = funnelStages.indexOf(deal.stage);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal.title}
      description={`Deal Value: $${deal.value.toLocaleString()}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Deal Header Overview */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Total Contract Value
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              ${deal.value.toLocaleString()}
            </div>
            {deal.expectedCloseDate && (
              <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Target:{' '}
                {new Date(deal.expectedCloseDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-xs text-slate-400">Current Stage</span>
            <Badge
              variant={
                deal.stage === 'CLOSED_WON'
                  ? 'emerald'
                  : deal.stage === 'CLOSED_LOST'
                  ? 'rose'
                  : 'blue'
              }
              size="md"
            >
              {deal.stage.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Stage Funnel Tracker */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pipeline Stage Tracking
            </span>
            <span className="text-xs font-medium text-slate-600">
              Category: <strong className="text-slate-900">{currentCategory}</strong>
            </span>
          </div>

          {deal.stage === 'CLOSED_LOST' ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm font-medium">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>This deal has been marked as Closed Lost.</span>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {funnelStages.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = deal.stage === stage;
                const meta = DEAL_STAGES.find((s) => s.id === stage);
                return (
                  <div key={stage} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-full h-2 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 ring-2 ring-indigo-600/30'
                          : isPassed
                          ? 'bg-slate-900'
                          : 'bg-slate-200'
                      }`}
                    />
                    <span
                      className={`text-2xs font-semibold text-center leading-tight truncate w-full ${
                        isCurrent
                          ? 'text-indigo-600 font-bold'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {meta?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Stage Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Move to:</span>
            {DEAL_STAGES.filter((s) => s.id !== deal.stage).map((s) => (
              <button
                key={s.id}
                onClick={() => onStageChange(deal._id, s.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                  s.id === 'CLOSED_WON'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : s.id === 'CLOSED_LOST'
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stage History Timeline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <h4 className="text-sm font-bold text-slate-900">
              Stage History & Audit Log
            </h4>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 max-h-48 overflow-y-auto">
            {deal.stageHistory && deal.stageHistory.length > 0 ? (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {deal.stageHistory.map((item, index) => {
                  const meta = DEAL_STAGES.find((s) => s.id === item.stage);
                  return (
                    <div key={index} className="relative flex items-start justify-between">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          {meta?.label || item.stage} ({getStageCategory(item.stage)})
                        </div>
                        <div className="text-2xs text-slate-400">
                          Transition recorded
                        </div>
                      </div>
                      <span className="text-2xs font-medium text-slate-500">
                        {new Date(item.changedAt).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-2">
                Created in {deal.stage} stage on{' '}
                {new Date(deal.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Contact & Lead Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contact && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                Primary Contact
              </span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-900">
                  {contact.firstName} {contact.lastName}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                {contact.company && (
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {lead && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                Originating Lead
              </span>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-900">
                  {lead.title}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div>Source: {lead.source || 'Website'}</div>
                <div>Status at conversion: {lead.status}</div>
                {lead.value && <div>Lead Value: ${lead.value.toLocaleString()}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {deal.description && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Description & Notes
            </span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              {deal.description}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onEdit(deal);
            }}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            Edit Parameters
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
