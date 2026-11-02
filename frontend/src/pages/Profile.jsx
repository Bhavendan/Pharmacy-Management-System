import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { User, Mail, Shield, Key, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
  const { user, isAdmin, isDoctor, isPharmacist } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="My Account Profile"
        subtitle="View logged-in user profile, system security privileges, and account details"
      />

      {/* User Information Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="mt-2">
              <StatusBadge status={user?.role} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              User ID #
            </span>
            <p className="font-mono font-bold text-slate-900 text-sm">{user?.id}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              Email Address
            </span>
            <p className="font-bold text-slate-900 text-sm">{user?.email}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              Assigned Role
            </span>
            <p className="font-bold text-blue-600 text-sm">{user?.role}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">
              Authentication Token Mode
            </span>
            <p className="font-bold text-emerald-600 text-sm">Bearer JWT Encrypted</p>
          </div>
        </div>

        {/* Role Privileges Checklist */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Your Active Role Privileges & Capabilities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {isAdmin && (
              <>
                <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Full System Administration
                </div>
                <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> User Accounts CRUD & Activation
                </div>
                <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> Supplier & Medicine Catalog Control
                </div>
              </>
            )}

            {isDoctor && (
              <>
                <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Patient Medical Registration
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Issue Prescriptions for Patients
                </div>
              </>
            )}

            {isPharmacist && (
              <>
                <div className="p-3 bg-teal-50 text-teal-900 rounded-xl border border-teal-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Verify Doctor Prescriptions
                </div>
                <div className="p-3 bg-teal-50 text-teal-900 rounded-xl border border-teal-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> FEFO Stock Batch Dispensing
                </div>
                <div className="p-3 bg-teal-50 text-teal-900 rounded-xl border border-teal-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Record Billing Payments (CASH/UPI)
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
