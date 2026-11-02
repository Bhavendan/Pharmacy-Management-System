import React, { useState, useEffect } from 'react';
import { supplierApi } from '../api/supplierApi';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { SupplierFormModal } from '../components/forms/SupplierFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Truck, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const toast = useToast();

  const fetchSuppliers = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (query.trim()) {
        data = await supplierApi.searchSuppliers(query);
      } else {
        data = await supplierApi.getAllSuppliers();
      }
      setSuppliers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load medicine suppliers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearch(q);
    fetchSuppliers(q);
  };

  const handleSaveSupplier = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedSupplier) {
        await supplierApi.updateSupplier(selectedSupplier.id, formData);
        toast.success('Supplier record updated!');
      } else {
        await supplierApi.createSupplier(formData);
        toast.success('New vendor supplier registered!');
      }
      setIsModalOpen(false);
      fetchSuppliers(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save supplier record.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;
    setFormLoading(true);
    try {
      await supplierApi.deleteSupplier(supplierToDelete.id);
      toast.success('Supplier record deleted.');
      setIsDeleteOpen(false);
      fetchSuppliers(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete supplier.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Medicine Vendor Suppliers"
        subtitle="Manage pharmaceutical distributors, contact details, and license numbers"
        action={
          <button
            onClick={() => {
              setSelectedSupplier(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Register Supplier
          </button>
        }
      />

      {/* Search Input */}
      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by supplier name..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading suppliers..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchSuppliers(search)} />
      ) : suppliers.length === 0 ? (
        <EmptyState
          title="No Suppliers Registered"
          description="Register a new medicine distributor or vendor above."
          icon={Truck}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Supplier Name</th>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">License #</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-700">{s.contactPerson || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{s.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{s.email || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-md border border-slate-200">
                        {s.licenseNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={s.active} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedSupplier(s);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSupplierToDelete(s);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveSupplier}
        initialData={selectedSupplier}
        loading={formLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteSupplier}
        title="Delete Supplier Record"
        message={`Are you sure you want to delete ${supplierToDelete?.name}?`}
        confirmText="Delete Supplier"
        isDangerous
        loading={formLoading}
      />
    </div>
  );
};
