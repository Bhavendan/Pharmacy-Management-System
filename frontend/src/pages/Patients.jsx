import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientApi } from '../api/patientApi';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { PatientFormModal } from '../components/forms/PatientFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Users as UsersIcon, Plus, Search, Edit2, Trash2, Eye, Activity } from 'lucide-react';

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const toast = useToast();

  const fetchPatients = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (query.trim()) {
        data = await patientApi.searchPatients(query);
      } else {
        data = await patientApi.getAllPatients();
      }
      setPatients(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load patient records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearch(q);
    fetchPatients(q);
  };

  const handleSavePatient = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedPatient) {
        await patientApi.updatePatient(selectedPatient.id, formData);
        toast.success('Patient details updated successfully!');
      } else {
        await patientApi.createPatient(formData);
        toast.success('Patient registered successfully!');
      }
      setIsModalOpen(false);
      fetchPatients(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save patient record.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    setFormLoading(true);
    try {
      await patientApi.deletePatient(patientToDelete.id);
      toast.success('Patient record deleted.');
      setIsDeleteOpen(false);
      fetchPatients(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete patient record.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Patient Profiles Directory"
        subtitle="Manage hospital patient medical records and histories"
        action={
          <button
            onClick={() => {
              setSelectedPatient(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Register New Patient
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
          placeholder="Search patient by name or patient code (e.g. PAT-100)..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading patients..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchPatients(search)} />
      ) : patients.length === 0 ? (
        <EmptyState
          title="No Patients Found"
          description="Register a new patient or change your search query."
          icon={UsersIcon}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Patient Code</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Gender / DOB</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {p.patientCode}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{p.name}</p>
                      {p.allergies && (
                        <span className="text-[10px] text-rose-600 font-medium block">
                          Allergies: {p.allergies}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {p.gender || 'N/A'} {p.dateOfBirth && `(${p.dateOfBirth})`}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded-md border border-rose-200 text-[10px]">
                        {p.bloodGroup || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Link
                        to={`/patients/${p.id}`}
                        title="View Detailed History"
                        className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedPatient(p);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setPatientToDelete(p);
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
      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSavePatient}
        initialData={selectedPatient}
        loading={formLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeletePatient}
        title="Delete Patient Record"
        message={`Are you sure you want to delete patient record for ${patientToDelete?.name}?`}
        confirmText="Delete Record"
        isDangerous
        loading={formLoading}
      />
    </div>
  );
};
