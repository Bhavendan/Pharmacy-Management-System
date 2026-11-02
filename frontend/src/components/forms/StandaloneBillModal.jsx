import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const StandaloneBillModal = ({
  isOpen,
  onClose,
  onSubmit,
  patients = [],
  loading = false,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [patientId, setPatientId] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [gstAmount, setGstAmount] = useState('');
  const [discount, setDiscount] = useState('0');
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  useEffect(() => {
    if (isOpen) {
      setInvoiceNumber('INV-' + Date.now());
      if (patients.length > 0) setPatientId(patients[0].id);
      setSubtotal('');
      setGstAmount('');
      setDiscount('0');
      setPaymentStatus('PENDING');
      setPaymentMethod('CASH');
    }
  }, [isOpen, patients]);

  const calcTotal = () => {
    const sub = parseFloat(subtotal) || 0;
    const gst = parseFloat(gstAmount) || 0;
    const disc = parseFloat(discount) || 0;
    return Math.max(0, sub + gst - disc).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sub = parseFloat(subtotal) || 0;
    const gst = parseFloat(gstAmount) || 0;
    const disc = parseFloat(discount) || 0;
    const total = parseFloat(calcTotal());

    onSubmit({
      invoiceNumber,
      patientId: parseInt(patientId),
      subtotal: sub,
      gstAmount: gst,
      discount: disc,
      totalAmount: total,
      paymentStatus,
      paymentMethod,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Standalone / Over-the-Counter Invoice"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Invoice Number *
            </label>
            <input
              type="text"
              required
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Patient *
            </label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patientCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Subtotal ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={subtotal}
              onChange={(e) => setSubtotal(e.target.value)}
              placeholder="100.00"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              GST Tax Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={gstAmount}
              onChange={(e) => setGstAmount(e.target.value)}
              placeholder="12.00"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Discount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-blue-900 uppercase">Calculated Total:</span>
          <span className="text-xl font-bold text-blue-600">${calcTotal()}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              <option value="CASH">CASH</option>
              <option value="UPI">UPI</option>
              <option value="CARD">CARD</option>
            </select>
          </div>
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
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Generating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
