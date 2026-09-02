import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1">
        <header className="h-16 border-b bg-white px-6">
          <div className="flex h-full items-center justify-between">
            <h2 className="font-semibold">
              CRM Dashboard
            </h2>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
              JD
            </div>
          </div>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
};