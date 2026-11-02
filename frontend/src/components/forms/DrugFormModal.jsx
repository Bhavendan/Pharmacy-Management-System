import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const DrugFormModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    innName: '',
    brandName: '',
    category: 'Antibiotic',
    dosageForm: 'Tablet',
    unit: 'mg',
    sellingPrice: '',
    reorderLevel: 10,
    gstPercentage: 12.0,
    active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        innName: initialData.innName || '',
        brandName: initialData.brandName || '',
        category: initialData.category || 'Antibiotic',
        dosageForm: initialData.dosageForm || 'Tablet',
        unit: initialData.unit || 'mg',
        sellingPrice: initialData.sellingPrice ?? '',
        reorderLevel: initialData.reorderLevel ?? 10,
        gstPercentage: initialData.gstPercentage ?? 12.0,
        active: initialData.active ?? true,
      });
    } else {
      setFormData({
        innName: '',
        brandName: '',
        category: 'Antibiotic',
        dosageForm: 'Tablet',
        unit: 'mg',
        sellingPrice: '',
        reorderLevel: 10,
        gstPercentage: 12.0,
        active: true,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      gstPercentage: parseFloat(formData.gstPercentage) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Medicine Catalog Entry' : 'Add New Medicine to Catalog'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              name="brandName"
              required
              value={formData.brandName}
              onChange={handleChange}
              placeholder="Amoxicillin 500mg"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              INN Generic Name
            </label>
            <input
              type="text"
              name="innName"
              value={formData.innName}
              onChange={handleChange}
              placeholder="Amoxicillin Trihydrate"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              <option value="Antibiotic">Antibiotic</option>
              <option value="Analgesic">Analgesic / Painkiller</option>
              <option value="Antipyretic">Antipyretic</option>
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Antidiabetic">Antidiabetic</option>
              <option value="Vitamins">Vitamins / Supplement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Dosage Form
            </label>
            <select
              name="dosageForm"
              value={formData.dosageForm}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup / Suspension</option>
              <option value="Injection">Injection</option>
              <option value="Ointment">Ointment / Cream</option>
              <option value="Inhaler">Inhaler</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Unit
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="mg / ml / strip"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Selling Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="sellingPrice"
              required
              value={formData.sellingPrice}
              onChange={handleChange}
              placeholder="15.50"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Reorder Level *
            </label>
            <input
              type="number"
              min="0"
              name="reorderLevel"
              required
              value={formData.reorderLevel}
              onChange={handleChange}
              placeholder="10"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              GST Tax (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="gstPercentage"
              value={formData.gstPercentage}
              onChange={handleChange}
              placeholder="12.0"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="drug_active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <label htmlFor="drug_active" className="text-xs font-medium text-slate-700">
            Active for Doctor Prescribing
          </label>
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
            {loading ? 'Saving...' : initialData ? 'Update Drug' : 'Add to Catalog'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
