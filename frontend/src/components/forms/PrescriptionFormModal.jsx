import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

export const PrescriptionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  patients = [],
  drugs = [],
  loading = false,
}) => {
  const { user } = useAuth();

  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    {
      drugId: '',
      dosage: '1 tablet',
      frequency: 'twice daily (1-0-1)',
      duration: '5 days',
      quantity: 10,
      instructions: 'Take after meals',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setPrescriptionNumber('RX-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
      if (patients.length > 0) setPatientId(patients[0].id);
      setDiagnosis('');
      setNotes('');
      setItems([
        {
          drugId: drugs.length > 0 ? drugs[0].id : '',
          dosage: '1 tablet',
          frequency: 'twice daily (1-0-1)',
          duration: '5 days',
          quantity: 10,
          instructions: 'Take after meals',
        },
      ]);
    }
  }, [isOpen, patients, drugs]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        drugId: drugs.length > 0 ? drugs[0].id : '',
        dosage: '1 tablet',
        frequency: 'twice daily (1-0-1)',
        duration: '5 days',
        quantity: 10,
        instructions: 'Take after meals',
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      prescriptionNumber,
      patientId: parseInt(patientId),
      doctorId: user?.id || 1,
      prescriptionDate: new Date().toISOString().split('T')[0],
      diagnosis,
      notes,
      items: items.map((it) => ({
        drugId: parseInt(it.drugId),
        dosage: it.dosage,
        frequency: it.frequency,
        duration: it.duration,
        quantity: parseInt(it.quantity) || 1,
        instructions: it.instructions,
      })),
    };
    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue New Medical Prescription"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Prescription Number *
            </label>
            <input
              type="text"
              required
              value={prescriptionNumber}
              onChange={(e) => setPrescriptionNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Select Patient *
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
                  {p.name} ({p.patientCode}) - {p.gender}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Diagnosis / Clinical Summary
          </label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Acute Bacterial Sinusitis with Fever"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
        </div>

        {/* Prescribed Items List */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Prescribed Medicines ({items.length})
            </h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medicine
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">
                    Medicine #{idx + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Drug *
                    </label>
                    <select
                      required
                      value={item.drugId}
                      onChange={(e) => handleItemChange(idx, 'drugId', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">-- Select Medicine --</option>
                      {drugs.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.brandName} ({d.dosageForm || 'Tab'}) - ${d.sellingPrice}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.dosage}
                      onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                      placeholder="1 tablet / 5ml"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={item.frequency}
                      onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                      placeholder="twice daily (1-0-1)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={item.duration}
                      onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                      placeholder="5 days"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      placeholder="10"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Additional Doctor Instructions
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take with warm water after food"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
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
            {loading ? 'Creating...' : 'Issue Prescription'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
