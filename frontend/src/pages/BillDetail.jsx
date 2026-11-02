import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { billApi } from '../api/billApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { PaymentUpdateModal } from '../components/forms/PaymentUpdateModal';
import { Receipt, ArrowLeft, Printer, CreditCard, Activity } from 'lucide-react';

export const BillDetail = () => {
  const { id } = useParams();
  const { isPharmacist, isAdmin } = useAuth();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();

  const fetchBill = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await billApi.getBillById(id);
      setBill(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load invoice record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [id]);

  const handleUpdatePayment = async (paymentData) => {
    setActionLoading(true);
    try {
      await billApi.updatePayment(id, paymentData);
      toast.success('Payment status updated successfully!');
      setIsPaymentModalOpen(false);
      fetchBill();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner label="Loading invoice..." />;
  if (error) return <ErrorState message={error} onRetry={fetchBill} />;
  if (!bill) return null;

  return (
    <div className="space-y-6">
      {/* Action Navigation Row */}
      <div className="flex items-center justify-between">
        <Link
          to="/billing"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors print:hidden"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </Link>

        <div className="flex items-center gap-3 print:hidden">
          {bill.paymentStatus === 'PENDING' && (isPharmacist || isAdmin) && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Record Payment
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-md max-w-3xl mx-auto space-y-8 font-sans">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">PharmaCare Hospital</h2>
              <p className="text-xs text-slate-500">Official Pharmacy Tax Invoice</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h3 className="text-lg font-mono font-extrabold text-blue-600">
              #{bill.invoiceNumber}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Date: <strong>{bill.billDate ? new Date(bill.billDate).toLocaleDateString() : 'N/A'}</strong>
            </p>
            <div className="mt-2">
              <StatusBadge status={bill.paymentStatus} />
            </div>
          </div>
        </div>

        {/* Billed To Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Billed Patient:
            </span>
            <p className="text-sm font-bold text-slate-900">{bill.patientName || 'OTC Patient'}</p>
            <p className="text-slate-500">Patient ID: #{bill.patientId}</p>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Prescription Ref:
            </span>
            <p className="text-sm font-bold text-slate-800 font-mono">
              {bill.prescriptionId ? `Prescription #${bill.prescriptionId}` : 'Standalone OTC Sale'}
            </p>
            <p className="text-slate-500">Payment Method: {bill.paymentMethod || 'PENDING SETTLEMENT'}</p>
          </div>
        </div>

        {/* Calculation Table */}
        <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal Amount:</span>
            <span className="font-semibold">${bill.subtotal?.toFixed(2) || '0.00'}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Applicable GST Tax:</span>
            <span className="font-semibold">${bill.gstAmount?.toFixed(2) || '0.00'}</span>
          </div>

          {bill.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount Applied:</span>
              <span>-${bill.discount?.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-300 flex justify-between items-center">
            <span className="text-sm font-extrabold text-slate-900 uppercase">Total Amount Due:</span>
            <span className="text-2xl font-black text-blue-600">${bill.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          <p>Thank you for choosing PharmaCare Hospital Pharmacy services.</p>
          <p className="mt-1">Computer generated invoice • Authorized System Record</p>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentUpdateModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleUpdatePayment}
        bill={bill}
        loading={actionLoading}
      />
    </div>
  );
};
