import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  icon: Icon = PackageOpen,
  action,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-4">
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};
