import React from 'react';

const statusConfig = {
  // Prescription Statuses
  PENDING: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  VERIFIED: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Verified' },
  DISPENSED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Dispensed' },
  CANCELLED: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Cancelled' },

  // Payment Statuses
  PAID: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Paid' },
  PARTIAL: { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Partial' },

  // Batch Statuses
  AVAILABLE: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Available' },
  OUT_OF_STOCK: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Out of Stock' },
  EXPIRED: { bg: 'bg-red-100 text-red-800 border-red-300', label: 'Expired' },

  // Roles
  ADMIN: { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Admin' },
  DOCTOR: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Doctor' },
  PHARMACIST: { bg: 'bg-teal-50 text-teal-700 border-teal-200', label: 'Pharmacist' },

  // Active / Enabled
  true: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Active' },
  false: { bg: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Inactive' },
};

export const StatusBadge = ({ status, customLabel }) => {
  const config = statusConfig[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    label: String(status),
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {customLabel || config.label}
    </span>
  );
};
