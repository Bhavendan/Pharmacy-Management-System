import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billApi } from '../api/billApi';
import { patientApi } from '../api/patientApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { PaymentUpdateModal } from '../components/forms/PaymentUpdateModal';
import { StandaloneBillModal } from '../components/forms/StandaloneBillModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Receipt, Plus, Search, Eye, CreditCard, DollarSign } from 'lucide-react';

export const Billing = () => {
  const { hasRole } = useAuth();
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const toast = useToast();

  const fetchBillsData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await billApi.getAllBills();
      setBills(data);

      const pData = await patientApi.getAllPatients();
      setPatients(pData);
    } catch (err) {
      console.error(err);
      setError('Failed to load billing invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillsData();
  }, []);

  const handleUpdatePayment = async (paymentData) => {
    if (!selectedBill) return;
    setFormLoading(true);
    try {
      await billApi.updatePayment(selectedBill.id, paymentData);
      toast.success(`Payment recorded for Invoice #${selectedBill.invoiceNumber}`);
      setIsPaymentModalOpen(false);
      fetchBillsData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment status.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateStandaloneBill = async (billData) => {
    setFormLoading(true);
    try {
      await billApi.createBill(billData);
      toast.success('Over-the-counter invoice generated!');
      setIsBillModalOpen(false);
      fetchBillsData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice.');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      b.paymentMethod?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Billing & Invoice Settlement"
        subtitle="Manage patient bills, sales invoices, GST taxes, and payment methods"
        action={
          hasRole(['ADMIN', 'PHARMACIST']) && (
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create OTC Invoice
            </button>
          )
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold w-fit">
          {['ALL', 'PENDING', 'PAID'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice # or patient..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading invoices..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBillsData} />
      ) : filteredBills.length === 0 ? (
        <EmptyState
          title="No Billing Invoices Found"
          description="Invoices automatically generate when prescriptions are dispensed, or you can create OTC invoices."
          icon={Receipt}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Subtotal</th>
                  <th className="py-3.5 px-4">GST Tax</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <Link to={`/billing/${b.id}`} className="hover:text-blue-600">
                        #{b.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {b.patientName || `Patient #${b.patientId}`}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      ${b.subtotal?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      ${b.gstAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-blue-600 text-sm">
                      ${b.totalAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-md border border-slate-200">
                        {b.paymentMethod || 'UNSET'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {b.paymentStatus === 'PENDING' && (
                        <button
                          onClick={() => {
                            setSelectedBill(b);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition-colors"
                        >
                          Record Payment
                        </button>
                      )}

                      <Link
                        to={`/billing/${b.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Invoice
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Update Modal */}
      <PaymentUpdateModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleUpdatePayment}
        bill={selectedBill}
        loading={formLoading}
      />

      {/* Standalone OTC Bill Modal */}
      <StandaloneBillModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onSubmit={handleCreateStandaloneBill}
        patients={patients}
        loading={formLoading}
      />
    </div>
  );
};
