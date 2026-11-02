import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const InventoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  drugs = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    drugId: '',
    batchNumber: '',
    manufactureDate: '',
    expiryDate: '',
    quantity: '',
    unitCost: '',
    binLocation: 'BIN-A1',
    status: 'AVAILABLE',
    receivedDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        drugId: initialData.drugId || '',
        batchNumber: initialData.batchNumber || '',
        manufactureDate: initialData.manufactureDate || '',
        expiryDate: initialData.expiryDate || '',
        quantity: initialData.quantity ?? '',
        unitCost: initialData.unitCost ?? '',
        binLocation: initialData.binLocation || 'BIN-A1',
        status: initialData.status || 'AVAILABLE',
        receivedDate: initialData.receivedDate || new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        drugId: drugs.length > 0 ? drugs[0].id : '',
        batchNumber: 'BATCH-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
        manufactureDate: '',
        expiryDate: '',
        quantity: '',
        unitCost: '',
        binLocation: 'BIN-A1',
        status: 'AVAILABLE',
        receivedDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen, drugs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      drugId: parseInt(formData.drugId),
      quantity: parseInt(formData.quantity) || 0,
      unitCost: parseFloat(formData.unitCost) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Inventory Stock Batch' : 'Add New Stock Batch'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Select Medicine *
            </label>
            <select
              name="drugId"
              required
              value={formData.drugId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              <option value="">-- Select Drug --</option>
              {drugs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.brandName} ({d.dosageForm || 'Tab'}) - ${d.sellingPrice}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Batch Number *
            </label>
            <input
              type="text"
              name="batchNumber"
              required
              value={formData.batchNumber}
              onChange={handleChange}
              placeholder="BATCH-2026-X1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              name="quantity"
              required
              value={formData.quantity}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Unit Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="unitCost"
              value={formData.unitCost}
              onChange={handleChange}
              placeholder="10.00"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Bin Location
            </label>
            <input
              type="text"
              name="binLocation"
              value={formData.binLocation}
              onChange={handleChange}
              placeholder="SHELF-B3"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Manufacture Date
            </label>
            <input
              type="date"
              name="manufactureDate"
              value={formData.manufactureDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              name="expiryDate"
              required
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Batch Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              <option value="EXPIRED">EXPIRED</option>
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
            {loading ? 'Saving...' : initialData ? 'Update Stock' : 'Add Stock Batch'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
