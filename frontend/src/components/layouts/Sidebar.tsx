import React from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  Handshake,
  BarChart3,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Contacts',
    path: '/contacts',
    icon: Users,
  },
  {
    name: 'Leads',
    path: '/leads',
    icon: Target,
  },
  {
    name: 'Deals & Pipeline',
    path: '/deals',
    icon: Handshake,
  },
  {
    name: 'Closed Reports',
    path: '/reports',
    icon: BarChart3,
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
          CR
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
            CRM
          </h1>
          <span className="text-2xs text-slate-400 font-medium">
            Pipeline Management
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 p-4 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile / Status */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
            AG
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">CRM Admin</p>
            <p className="text-2xs text-slate-400 truncate">admin@crm.internal</p>
          </div>
        </div>
      </div>
    </aside>
  );
};