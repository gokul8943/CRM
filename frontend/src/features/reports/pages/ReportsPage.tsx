import React, { useEffect, useState, useMemo } from 'react';
import { getReportSummary } from '../api/reports.api';
import { getDeals } from '../../deals/api/deals.api';
import type { ReportSummary } from '../types/report.types';
import type { Deal } from '../../deals/types/deal.types';
import type { Contact } from '../../contacts/types/contact.types';
import { Badge } from '../../../components/common/Badge';
import { useToast } from '../../../components/common/ToastContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Trophy,
  XCircle,
  DollarSign,
  Percent,
  Calendar,
  Download,
  RotateCcw,
  User,
  Search,
  Loader2,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | 'WON' | 'LOST'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { showToast } = useToast();

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [summaryData, dealsData] = await Promise.all([
        getReportSummary(),
        getDeals(),
      ]);
      setSummary(summaryData);
      setDeals(dealsData);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to fetch reporting data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const closedDeals = useMemo(() => {
    return deals.filter(
      (d) => d.stage === 'CLOSED_WON' || d.stage === 'CLOSED_LOST'
    );
  }, [deals]);

  const filteredClosedDeals = useMemo(() => {
    return closedDeals.filter((d) => {
      const matchesOutcome =
        outcomeFilter === 'ALL'
          ? true
          : outcomeFilter === 'WON'
          ? d.stage === 'CLOSED_WON'
          : d.stage === 'CLOSED_LOST';

      const searchLower = searchTerm.toLowerCase();
      const contactName =
        typeof d.contact === 'object' && d.contact
          ? `${d.contact.firstName} ${d.contact.lastName} ${d.contact.company || ''}`.toLowerCase()
          : '';
      const matchesSearch =
        !searchTerm ||
        d.title.toLowerCase().includes(searchLower) ||
        contactName.includes(searchLower);

      return matchesOutcome && matchesSearch;
    });
  }, [closedDeals, outcomeFilter, searchTerm]);

  // Calculations
  const wonDealsCount = summary?.wonDeals ?? 0;
  const lostDealsCount = summary?.lostDeals ?? 0;
  const totalClosedCount = wonDealsCount + lostDealsCount;

  const winRate =
    totalClosedCount > 0
      ? Math.round((wonDealsCount / totalClosedCount) * 100)
      : 0;

  const wonValue = summary?.wonValue ?? 0;
  const lostValue = summary?.lostValue ?? 0;
  const totalClosedValue = summary?.totalClosedValue ?? wonValue + lostValue;

  const avgWonDealSize =
    wonDealsCount > 0 ? Math.round(wonValue / wonDealsCount) : 0;

  // Chart Data
  const donutData = [
    { name: 'Won Deals', value: wonDealsCount, color: '#10b981' },
    { name: 'Lost Deals', value: lostDealsCount, color: '#f43f5e' },
  ];

  const barData = [
    {
      name: 'Closed Revenue',
      Won: wonValue,
      Lost: lostValue,
    },
  ];

  const exportCSV = () => {
    if (closedDeals.length === 0) {
      showToast('info', 'No closed deals available to export');
      return;
    }

    const headers = ['Title', 'Contact', 'Company', 'Stage', 'Value', 'Closed Date'];
    const rows = closedDeals.map((d) => {
      const contact = typeof d.contact === 'object' ? d.contact : null;
      return [
        `"${d.title.replace(/"/g, '""')}"`,
        `"${contact ? `${contact.firstName} ${contact.lastName}` : ''}"`,
        `"${contact?.company || ''}"`,
        d.stage,
        d.value,
        d.updatedAt ? new Date(d.updatedAt).toISOString() : '',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `closed_deals_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Closed deals report exported successfully');
  };

  const getContactDisplay = (contact: string | Contact) => {
    if (!contact) return 'Unassigned';
    if (typeof contact === 'string') return contact;
    return `${contact.firstName} ${contact.lastName}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Closed Deals Reporting
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Performance analytics, win/loss metrics, and audit ledger for all closed deals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReportData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report (.csv)
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Closed Value
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ${totalClosedValue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Across {totalClosedCount} finalized deal{totalClosedCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Won Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            ${wonValue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {wonDealsCount} deal{wonDealsCount === 1 ? '' : 's'} won (Avg: ${avgWonDealSize.toLocaleString()})
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Lost Value
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            ${lostValue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {lostDealsCount} deal{lostDealsCount === 1 ? '' : 's'} lost or canceled
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Win Rate
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {winRate}%
          </div>
          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${winRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Won vs Lost Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Closed Deals Ratio
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of Won vs. Lost deals by count
            </p>
          </div>

          {totalClosedCount === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No closed deals recorded yet
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} Deals`, 'Count']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Revenue Comparison Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Closed Revenue Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Monetary value of won deals versus lost opportunities
            </p>
          </div>

          {totalClosedValue === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No closed deal values recorded yet
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => `$${val >= 1000 ? `${val / 1000}k` : val}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                  <Bar dataKey="Won" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Lost" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Closed Deals Ledger Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search closed deals..."
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setOutcomeFilter('ALL')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  outcomeFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Closed ({closedDeals.length})
              </button>
              <button
                onClick={() => setOutcomeFilter('WON')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  outcomeFilter === 'WON'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Won ({wonDealsCount})
              </button>
              <button
                onClick={() => setOutcomeFilter('LOST')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  outcomeFilter === 'LOST'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Lost ({lostDealsCount})
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
              <span className="text-sm text-slate-500 font-medium">Loading closed deals...</span>
            </div>
          </div>
        ) : filteredClosedDeals.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 text-sm">
            No closed deals match the selected criteria.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-6">Deal Title</th>
                    <th className="py-3.5 px-6">Contact</th>
                    <th className="py-3.5 px-6">Final Outcome</th>
                    <th className="py-3.5 px-6">Deal Value</th>
                    <th className="py-3.5 px-6">Closing Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredClosedDeals.map((deal) => {
                    const contact =
                      typeof deal.contact === 'object' ? deal.contact : null;
                    const isWon = deal.stage === 'CLOSED_WON';
                    return (
                      <tr
                        key={deal._id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900">
                            {deal.title}
                          </div>
                          {deal.description && (
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {deal.description}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{getContactDisplay(deal.contact)}</span>
                          </div>
                          {contact?.company && (
                            <div className="text-2xs text-slate-400 mt-0.5">
                              {contact.company}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <Badge variant={isWon ? 'emerald' : 'rose'}>
                            {isWon ? 'Closed Won' : 'Closed Lost'}
                          </Badge>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`font-bold text-base ${
                              isWon ? 'text-emerald-700' : 'text-slate-700'
                            }`}
                          >
                            ${deal.value.toLocaleString()}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(deal.updatedAt || deal.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
