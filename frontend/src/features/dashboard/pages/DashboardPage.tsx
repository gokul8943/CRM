import React, { useEffect, useState } from 'react';
import { getContacts } from '../../contacts/api/contacts.api';
import { getLeads } from '../../leads/api/leads.api';
import { getDeals } from '../../deals/api/deals.api';
import { getReportSummary } from '../../reports/api/reports.api';
import type { Contact } from '../../contacts/types/contact.types';
import type { Lead } from '../../leads/types/lead.types';
import type { Deal } from '../../deals/types/deal.types';
import type { ReportSummary } from '../../reports/types/report.types';
import { Badge } from '../../../components/common/Badge';
import { getStageCategory } from '../../deals/types/deal.types';
import {
  Users,
  Target,
  Handshake,
  Trophy,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getContacts().catch(() => []),
      getLeads().catch(() => []),
      getDeals().catch(() => []),
      getReportSummary().catch(() => null),
    ])
      .then(([cData, lData, dData, rData]) => {
        setContacts(cData);
        setLeads(lData);
        setDeals(dData);
        setReport(rData);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeDeals = deals.filter((d) => {
    const cat = getStageCategory(d.stage);
    return cat === 'New' || cat === 'In Progress';
  });

  const activePipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const wonRevenue = report?.wonValue ?? deals.filter(d => d.stage === 'CLOSED_WON').reduce((sum, d) => sum + d.value, 0);

  const recentDeals = deals.slice(0, 5);
  const recentLeads = leads.slice(0, 5);

  const getContactDisplay = (contact: string | Contact) => {
    if (!contact) return 'Unassigned';
    if (typeof contact === 'string') return `Contact: ${contact.slice(-6)}`;
    return `${contact.firstName} ${contact.lastName}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
          <span className="text-sm font-medium text-slate-500">
            Loading CRM command center...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <TrendingUp className="w-3.5 h-3.5" /> Pipeline Live Dashboard
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Welcome to Mini CRM
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Track customer lifecycles from lead discovery and stage advancement to closed revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/deals?newDeal=true')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </button>
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-xs transition-all border border-white/10"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </button>
          <button
            onClick={() => navigate('/contacts')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-xs transition-all border border-white/10"
          >
            <Plus className="w-4 h-4" />
            New Contact
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/contacts"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Contacts
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">
            {contacts.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold mt-1">
            <span>Manage contacts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/leads"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">
            {leads.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-1">
            <span>Review opportunities</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/deals"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Pipeline
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Handshake className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">
            ${activePipelineValue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-sky-600 font-semibold mt-1">
            <span>{activeDeals.length} active deals in funnel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/reports"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Won Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">
            ${wonRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
            <span>View closed reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Closed Deals Highlight Banner */}
      {report && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">Closed Deals Performance</h3>
              <p className="text-xs text-slate-400">
                Won: ${report.wonValue.toLocaleString()} ({report.wonDeals} deals) • Lost: ${report.lostValue.toLocaleString()} ({report.lostDeals} deals) • Total Closed: ${report.totalClosedValue.toLocaleString()}
              </p>
            </div>
          </div>

          <Link
            to="/reports"
            className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            Open Full Report
          </Link>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Deals</h3>
              <p className="text-xs text-slate-500">Latest pipeline opportunities</p>
            </div>
            <Link
              to="/deals"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentDeals.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No deals found. Create a new deal to start tracking stages.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentDeals.map((deal) => (
                <div
                  key={deal._id}
                  onClick={() => navigate('/deals')}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {deal.title}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {getContactDisplay(deal.contact)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        ${deal.value.toLocaleString()}
                      </div>
                      <Badge
                        variant={
                          deal.stage === 'CLOSED_WON'
                            ? 'emerald'
                            : deal.stage === 'CLOSED_LOST'
                            ? 'rose'
                            : 'blue'
                        }
                        size="sm"
                      >
                        {deal.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inbound Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Leads</h3>
              <p className="text-xs text-slate-500">Unconverted incoming prospects</p>
            </div>
            <Link
              to="/leads"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No leads recorded yet. Add leads to start your sales pipeline.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => navigate('/leads')}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {lead.title}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {getContactDisplay(lead.contact)} • {lead.source || 'Website'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      {lead.value ? (
                        <div className="text-sm font-bold text-slate-900">
                          ${lead.value.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No value</span>
                      )}
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
                        size="sm"
                      >
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
