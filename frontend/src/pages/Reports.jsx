import React, { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { BarChart3, AlertTriangle, Calendar, FileText, DollarSign, Search } from 'lucide-react';

export const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales'); // 'sales', 'low-stock', 'expiry', 'prescriptions'
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchReport = async (reportType = activeReport) => {
    setLoading(true);
    setError('');
    try {
      let data = [];
      if (reportType === 'low-stock') {
        data = await reportApi.getLowStockReport();
      } else if (reportType === 'expiry') {
        data = await reportApi.getExpiryReport();
      } else if (reportType === 'prescriptions') {
        data = await reportApi.getPrescriptionReport();
      } else {
        data = await reportApi.getSalesReport();
      }
      setReportData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch analytics report data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeReport);
  }, [activeReport]);

  const filteredData = reportData.filter((item) => {
    const s = search.toLowerCase();
    if (!s) return true;
    return JSON.stringify(item).toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pharmacy Analytics & Clinical Reports"
        subtitle="Comprehensive financial, stock inventory, and prescribing reports"
      />

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveReport('sales')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeReport === 'sales'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Sales Revenue Report</span>
            <DollarSign className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-xs mt-2 opacity-90">Financial invoices, GST tax, and payment methods</p>
        </button>

        <button
          onClick={() => setActiveReport('low-stock')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeReport === 'low-stock'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Report</span>
            <AlertTriangle className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-xs mt-2 opacity-90">Stock at or below drug reorder levels</p>
        </button>

        <button
          onClick={() => setActiveReport('expiry')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeReport === 'expiry'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Stock Expiry Report</span>
            <Calendar className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-xs mt-2 opacity-90">Batches expiring within 30 days window</p>
        </button>

        <button
          onClick={() => setActiveReport('prescriptions')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeReport === 'prescriptions'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Prescriptions Report</span>
            <FileText className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-xs mt-2 opacity-90">Doctor prescribing logs & statuses</p>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter report data..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Total Records: {filteredData.length}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Compiling report analytics..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchReport(activeReport)} />
      ) : filteredData.length === 0 ? (
        <EmptyState
          title="No Data in Selected Report"
          description="There are currently no records matching this report filter."
          icon={BarChart3}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeReport === 'sales' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Invoice #</th>
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Subtotal</th>
                    <th className="py-3.5 px-4">GST Tax</th>
                    <th className="py-3.5 px-4">Total Sales Amount</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredData.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">#{b.invoiceNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{b.patientName || `Patient #${b.patientId}`}</td>
                      <td className="py-3 px-4 text-slate-600">${b.subtotal?.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-600">${b.gstAmount?.toFixed(2)}</td>
                      <td className="py-3 px-4 font-extrabold text-blue-600">${b.totalAmount?.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-600">{b.paymentMethod || 'UNSET'}</td>
                      <td className="py-3 px-4"><StatusBadge status={b.paymentStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {(activeReport === 'low-stock' || activeReport === 'expiry') && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Batch Number</th>
                    <th className="py-3.5 px-4">Medicine Brand Name</th>
                    <th className="py-3.5 px-4">Remaining Quantity</th>
                    <th className="py-3.5 px-4">Expiry Date</th>
                    <th className="py-3.5 px-4">Unit Cost</th>
                    <th className="py-3.5 px-4">Bin Location</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredData.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.batchNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{inv.drugBrandName || `Drug #${inv.drugId}`}</td>
                      <td className="py-3 px-4 font-bold text-rose-600">{inv.quantity} units</td>
                      <td className="py-3 px-4 text-slate-700">{inv.expiryDate}</td>
                      <td className="py-3 px-4 text-slate-600">${inv.unitCost?.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-600">{inv.binLocation || 'N/A'}</td>
                      <td className="py-3 px-4"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'prescriptions' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Prescription #</th>
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Doctor</th>
                    <th className="py-3.5 px-4">Prescription Date</th>
                    <th className="py-3.5 px-4">Diagnosis</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredData.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{p.prescriptionNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{p.patientName || `Patient #${p.patientId}`}</td>
                      <td className="py-3 px-4 text-slate-700">{p.doctorName || `Doctor #${p.doctorId}`}</td>
                      <td className="py-3 px-4 text-slate-600">{p.prescriptionDate}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{p.diagnosis || 'N/A'}</td>
                      <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
