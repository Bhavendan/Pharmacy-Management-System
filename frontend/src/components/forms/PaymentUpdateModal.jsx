import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const PaymentUpdateModal = ({ isOpen, onClose, onSubmit, bill = null, loading = false }) => {
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    if (bill) {
      setPaymentStatus(bill.paymentStatus || 'PAID');
      setPaymentMethod(bill.paymentMethod || 'UPI');
    }
  }, [bill, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      paymentStatus,
      paymentMethod,
    });
  };

  if (!bill) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Payment Status for Invoice #${bill.invoiceNumber}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Patient:</span>
            <span className="font-bold text-slate-800">{bill.patientName || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Invoice Amount:</span>
            <span className="font-bold text-blue-600 text-sm">${bill.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Payment Status *
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          >
            <option value="PAID">PAID (Settled)</option>
            <option value="PENDING">PENDING</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Payment Method *
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          >
            <option value="UPI">UPI Digital Payment</option>
            <option value="CASH">CASH</option>
            <option value="CARD">Credit / Debit Card</option>
            <option value="INSURANCE">Medical Insurance</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors disabled:bg-emerald-300"
          >
            {loading ? 'Updating...' : 'Record Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
