import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { prescriptionApi } from '../api/prescriptionApi';
import { patientApi } from '../api/patientApi';
import { drugApi } from '../api/drugApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { PrescriptionFormModal } from '../components/forms/PrescriptionFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { FileText, Plus, Search, Eye, Filter } from 'lucide-react';

export const Prescriptions = () => {
  const { isDoctor, isAdmin } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const toast = useToast();

  const fetchPrescriptionsData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await prescriptionApi.getAllPrescriptions();
      setPrescriptions(data);

      const pData = await patientApi.getAllPatients();
      setPatients(pData);

      const dData = await drugApi.getAllDrugs();
      setDrugs(dData.filter((d) => d.active));
    } catch (err) {
      console.error(err);
      setError('Failed to load prescriptions list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptionsData();
  }, []);

  const handleCreatePrescription = async (formData) => {
    setFormLoading(true);
    try {
      await prescriptionApi.createPrescription(formData);
      toast.success('Medical prescription created successfully (Status: PENDING)');
      setIsModalOpen(false);
      fetchPrescriptionsData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue prescription.');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((p) => {
    const matchesSearch =
      p.prescriptionNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      p.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Doctor Medical Prescriptions"
        subtitle="Manage prescriptions, pharmacist verification, and FEFO inventory dispensing"
        action={
          (isDoctor || isAdmin) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Issue New Prescription
            </button>
          )
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'PENDING', 'VERIFIED', 'DISPENSED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by RX#, patient, doctor..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading prescriptions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPrescriptionsData} />
      ) : filteredPrescriptions.length === 0 ? (
        <EmptyState
          title="No Prescriptions Found"
          description="Try changing your search filter or issue a new prescription."
          icon={FileText}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Prescription #</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Doctor</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Diagnosis</th>
                  <th className="py-3.5 px-4">Medicines Count</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPrescriptions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        to={`/prescriptions/${p.id}`}
                        className="font-mono font-bold text-blue-600 hover:underline"
                      >
                        {p.prescriptionNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.patientName || `Patient ID #${p.patientId}`}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {p.doctorName || `Doctor ID #${p.doctorId}`}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.prescriptionDate || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {p.diagnosis || 'General Clinical Consultation'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {p.items?.length || 0} items
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/prescriptions/${p.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <PrescriptionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePrescription}
        patients={patients}
        drugs={drugs}
        loading={formLoading}
      />
    </div>
  );
};
