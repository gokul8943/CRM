import React from 'react';
import { Search, LayoutGrid, List, Filter, X } from 'lucide-react';

interface DealFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  viewMode: 'kanban' | 'table';
  onViewModeChange: (mode: 'kanban' | 'table') => void;
  totalCount: number;
}

export const DealFilters: React.FC<DealFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search deals by title, contact..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden"
          >
            <option value="ALL">All Stages</option>
            <option value="New">New (Prospecting)</option>
            <option value="In Progress">In Progress</option>
            <option value="Won">Won (Closed Won)</option>
            <option value="Lost">Lost (Closed Lost)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
        <span className="text-xs text-slate-400 font-medium">
          {totalCount} deal{totalCount === 1 ? '' : 's'}
        </span>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => onViewModeChange('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Kanban Board
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Table View
          </button>
        </div>
      </div>
    </div>
  );
};
