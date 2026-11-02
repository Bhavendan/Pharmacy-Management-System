import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from './StatusBadge';
import { Menu, LogOut, User as UserIcon, Bell } from 'lucide-react';

export const Header = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Hospital Pharmacy Management System</span>
          <span>•</span>
          <span className="text-slate-400">v1.0.0</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <div className="relative">
          <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          </button>
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block leading-tight">
                {user?.email}
              </span>
            </div>
            <div className="ml-1 hidden sm:block">
              <StatusBadge status={user?.role} />
            </div>
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                  <div className="mt-2">
                    <StatusBadge status={user?.role} />
                  </div>
                </div>

                <a
                  href="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Account Profile</span>
                </a>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
