import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Overview & Activity';
      case '/contacts':
        return 'Contact Management';
      case '/leads':
        return 'Lead Pipeline';
      case '/deals':
        return 'Deals & Stage Tracking';
      case '/reports':
        return 'Closed Deals Reporting';
      default:
        return 'CRM Dashboard';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'CRM';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white px-6 sticky top-0 z-20 shadow-2xs">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900">
                {getPageTitle()}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live API
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">{user?.email ?? 'Standard Mode'}</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shadow-2xs select-none">
                {initials}
              </div>
              <button
                id="header-logout-btn"
                onClick={handleLogout}
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};