import {
  BarChart3,
  Building2,
  Contact,
  LayoutDashboard,
  Handshake,
  Users,
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
    icon: Contact,
  },
  {
    name: 'Companies',
    path: '/companies',
    icon: Building2,
  },
  {
    name: 'Deals',
    path: '/deals',
    icon: Handshake,
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: BarChart3,
  },
  {
    name: 'Users',
    path: '/users',
    icon: Users,
  },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-white">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold">
          Mini CRM
        </h1>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};