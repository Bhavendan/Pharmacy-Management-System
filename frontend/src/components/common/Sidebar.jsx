import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Pill,
  Boxes,
  Truck,
  FileText,
  Receipt,
  BarChart3,
  UserCircle,
  Activity,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { hasRole } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'DOCTOR', 'PHARMACIST'],
    },
    {
      name: 'Patients',
      path: '/patients',
      icon: Users,
      roles: ['ADMIN', 'DOCTOR', 'PHARMACIST'],
    },
    {
      name: 'Prescriptions',
      path: '/prescriptions',
      icon: FileText,
      roles: ['ADMIN', 'DOCTOR', 'PHARMACIST'],
    },
    {
      name: 'Drugs Catalog',
      path: '/drugs',
      icon: Pill,
      roles: ['ADMIN', 'DOCTOR', 'PHARMACIST'],
    },
    {
      name: 'Inventory Stock',
      path: '/inventory',
      icon: Boxes,
      roles: ['ADMIN', 'PHARMACIST'],
    },
    {
      name: 'Billing & Invoices',
      path: '/billing',
      icon: Receipt,
      roles: ['ADMIN', 'PHARMACIST'],
    },
    {
      name: 'Suppliers',
      path: '/suppliers',
      icon: Truck,
      roles: ['ADMIN'],
    },
    {
      name: 'User Management',
      path: '/users',
      icon: UserCheck,
      roles: ['ADMIN'],
    },
    {
      name: 'Reports & Analytics',
      path: '/reports',
      icon: BarChart3,
      roles: ['ADMIN', 'DOCTOR', 'PHARMACIST'],
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: UserCircle,
      roles: ['ADMIN', 'DOCTOR', 'PHARMACIST'],
    },
  ];

  const filteredNavItems = navItems.filter((item) => hasRole(item.roles));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">PharmaCare</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">Hospital ERP</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Main Navigation
          </div>

          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-400">System Connected</span>
          </div>
        </div>
      </aside>
    </>
  );
};
