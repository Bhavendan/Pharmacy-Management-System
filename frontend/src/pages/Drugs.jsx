import React, { useState, useEffect } from 'react';
import { drugApi } from '../api/drugApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { DrugFormModal } from '../components/forms/DrugFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pill, Plus, Search, Edit2, Trash2, Power } from 'lucide-react';

export const Drugs = () => {
  const { isAdmin } = useAuth();
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [drugToDelete, setDrugToDelete] = useState(null);

  const toast = useToast();

  const fetchDrugs = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (query.trim()) {
        data = await drugApi.searchDrugs(query);
      } else {
        data = await drugApi.getAllDrugs();
      }
      setDrugs(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load drug catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearch(q);
    fetchDrugs(q);
  };

  const handleSaveDrug = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedDrug) {
        await drugApi.updateDrug(selectedDrug.id, formData);
        toast.success('Medicine catalog entry updated!');
      } else {
        await drugApi.createDrug(formData);
        toast.success('New medicine added to catalog!');
      }
      setIsModalOpen(false);
      fetchDrugs(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save medicine record.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeactivate = async (drug) => {
    try {
      await drugApi.deactivateDrug(drug.id);
      toast.warning(`Deactivated ${drug.brandName} for prescribing.`);
      fetchDrugs(search);
    } catch (err) {
      toast.error('Failed to deactivate drug.');
    }
  };

  const handleDeleteDrug = async () => {
    if (!drugToDelete) return;
    setFormLoading(true);
    try {
      await drugApi.deleteDrug(drugToDelete.id);
      toast.success('Drug removed from catalog.');
      setIsDeleteOpen(false);
      fetchDrugs(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete drug.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Medicine Product Catalog"
        subtitle="Catalog of approved hospital pharmaceuticals and pricing"
        action={
          isAdmin && (
            <button
              onClick={() => {
                setSelectedDrug(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Medicine
            </button>
          )
        }
      />

      {/* Search Filter */}
      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by brand name or INN generic name..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading medicines catalog..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchDrugs(search)} />
      ) : drugs.length === 0 ? (
        <EmptyState
          title="No Medicines Found"
          description="Try searching for another medicine name or add a new entry."
          icon={Pill}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Brand Name / INN</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Dosage / Unit</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-4">GST Tax %</th>
                  <th className="py-3.5 px-4">Reorder Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  {isAdmin && <th className="py-3.5 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {drugs.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{d.brandName}</p>
                      {d.innName && (
                        <p className="text-[11px] text-slate-500 font-sans">{d.innName}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{d.category || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {d.dosageForm || 'Tablet'} ({d.unit || 'mg'})
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${d.sellingPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{d.gstPercentage || 0}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-bold text-[10px] rounded-md border border-amber-200">
                        {d.reorderLevel} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={d.active} />
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right space-x-1">
                        {d.active && (
                          <button
                            onClick={() => handleDeactivate(d)}
                            title="Deactivate Drug"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedDrug(d);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setDrugToDelete(d);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <DrugFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveDrug}
        initialData={selectedDrug}
        loading={formLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteDrug}
        title="Delete Medicine from Catalog"
        message={`Are you sure you want to remove ${drugToDelete?.brandName} from the catalog?`}
        confirmText="Remove Medicine"
        isDangerous
        loading={formLoading}
      />
    </div>
  );
};
