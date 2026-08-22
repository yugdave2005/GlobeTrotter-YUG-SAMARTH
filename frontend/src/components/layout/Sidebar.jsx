import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Compass, Wallet, Users, Settings, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'My Trips', icon: Map, path: '/dashboard/trips' },
  { name: 'Discover', icon: Compass, path: '/dashboard/discover' },
  { name: 'Budget', icon: Wallet, path: '/dashboard/budget' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export const Sidebar = ({ onSettingsClick }) => {
  return (
    <div className="w-64 flex-shrink-0 bg-white shadow-xl z-20 flex flex-col h-full rounded-r-[3rem] border-r border-gray-100 overflow-hidden relative">
      <div className="p-8 pb-4 flex items-center space-x-2">
        <Plane className="text-primary-600 w-8 h-8" />
        <h1 className="text-2xl font-bold text-primary-600 tracking-tight">GlobeTrotter</h1>
      </div>

      <nav className="flex-1 px-5 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-sky-50 text-sky-600 shadow-sm border border-sky-100/60'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={`mr-3.5 transition-colors ${isActive ? 'text-sky-600' : 'text-slate-400'}`}
                />
                <span className="font-semibold">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-50">
        <NavLink
          to="/dashboard/settings"
          className="flex w-full items-center px-4 py-3 rounded-2xl font-semibold text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings size={20} className="mr-3 text-gray-400" />
          Personalization
        </NavLink>
      </div>
    </div>
  );
};
