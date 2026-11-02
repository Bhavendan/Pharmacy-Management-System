import React, { useState, useEffect } from 'react';
import { inventoryApi } from '../api/inventoryApi';
import { drugApi } from '../api/drugApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { InventoryFormModal } from '../components/forms/InventoryFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Boxes, Plus, Search, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';

export const Inventory = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'low-stock', 'expiring'
  const [inventory, setInventory] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const toast = useToast();

  const fetchInventory = async (tab = activeTab) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (tab === 'low-stock') {
        data = await inventoryApi.getLowStock();
      } else if (tab === 'expiring') {
        data = await inventoryApi.getExpiring();
      } else {
        data = await inventoryApi.getAllInventory();
      }
      setInventory(data);

      // Fetch drugs for modal selection
      const drugData = await drugApi.getAllDrugs();
      setDrugs(drugData.filter((d) => d.active));
    } catch (err) {
      console.error(err);
      setError('Failed to load inventory stock batches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(activeTab);
  }, [activeTab]);

  const handleSaveBatch = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedBatch) {
        await inventoryApi.updateStock(selectedBatch.id, formData);
        toast.success('Inventory stock batch updated!');
      } else {
        await inventoryApi.addStock(formData);
        toast.success('New stock batch added successfully!');
      }
      setIsModalOpen(false);
      fetchInventory(activeTab);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save inventory batch.');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredInventory = inventory.filter(
    (b) =>
      b.drugBrandName?.toLowerCase().includes(search.toLowerCase()) ||
      b.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.binLocation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Physical Inventory Stock Management"
        subtitle="Manage batch numbers, FEFO expiration dates, and physical shelf locations"
        action={
          hasRole(['ADMIN', 'PHARMACIST']) && (
            <button
              onClick={() => {
                setSelectedBatch(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Stock Batch
            </button>
          )
        }
      />

      {/* Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl w-fit text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Stock Batches
          </button>
          <button
            onClick={() => setActiveTab('low-stock')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'low-stock'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-100/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alerts
          </button>
          <button
            onClick={() => setActiveTab('expiring')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'expiring'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-100/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Expiring Soon (30 Days)
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by drug name or batch #..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading inventory stock..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchInventory(activeTab)} />
      ) : filteredInventory.length === 0 ? (
        <EmptyState
          title="No Inventory Batches Found"
          description={
            activeTab === 'low-stock'
              ? 'Great! There are currently no low-stock warnings.'
              : activeTab === 'expiring'
              ? 'No stock batches expiring within the next 30 days.'
              : 'No stock batches recorded yet. Click Add Stock Batch above.'
          }
          icon={activeTab === 'all' ? Boxes : CheckCircle2}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Batch #</th>
                  <th className="py-3.5 px-4">Medicine</th>
                  <th className="py-3.5 px-4">Stock Quantity</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Unit Cost</th>
                  <th className="py-3.5 px-4">Bin Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInventory.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {b.batchNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {b.drugBrandName || `Drug ID #${b.drugId}`}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {b.quantity}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">units</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {b.expiryDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      ${b.unitCost?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-md border border-slate-200">
                        {b.binLocation || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedBatch(b);
                          setIsModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Edit Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <InventoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveBatch}
        initialData={selectedBatch}
        drugs={drugs}
        loading={formLoading}
      />
    </div>
  );
};
