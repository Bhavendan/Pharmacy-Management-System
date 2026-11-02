import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { prescriptionApi } from '../api/prescriptionApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  FileText,
  User,
  Stethoscope,
  Calendar,
  CheckCircle2,
  Boxes,
  XCircle,
  ArrowLeft,
  Pill,
  Receipt,
  AlertCircle,
} from 'lucide-react';

export const PrescriptionDetail = () => {
  const { id } = useParams();
  const { isPharmacist, isAdmin } = useAuth();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const toast = useToast();

  const fetchPrescription = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await prescriptionApi.getPrescriptionById(id);
      setPrescription(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load prescription details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescription();
  }, [id]);

  const handleVerify = async () => {
    setActionLoading(true);
    try {
      await prescriptionApi.verifyPrescription(id);
      toast.success('Prescription verified successfully! Status updated to VERIFIED.');
      fetchPrescription();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify prescription.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispense = async () => {
    setActionLoading(true);
    try {
      await prescriptionApi.dispensePrescription(id);
      toast.success(
        'Medicine dispensed successfully! FEFO inventory stock deducted and bill invoice generated.'
      );
      fetchPrescription();
    } catch (err) {
      const msg = err.response?.data?.message || 'Dispensation failed.';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await prescriptionApi.cancelPrescription(id);
      toast.warning('Prescription cancelled.');
      setCancelModalOpen(false);
      fetchPrescription();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel prescription.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading prescription details..." />;
  if (error) return <ErrorState message={error} onRetry={fetchPrescription} />;
  if (!prescription) return null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/prescriptions"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Prescriptions Directory
      </Link>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono font-extrabold text-xl text-blue-600">
              {prescription.prescriptionNumber}
            </span>
            <StatusBadge status={prescription.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Issued on: <strong>{prescription.prescriptionDate || 'N/A'}</strong>
          </p>
        </div>

        {/* Pharmacist Workflow Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {prescription.status === 'PENDING' && (isPharmacist || isAdmin) && (
            <button
              onClick={handleVerify}
              disabled={actionLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2 disabled:bg-blue-300"
            >
              <CheckCircle2 className="w-4 h-4" /> Verify Prescription
            </button>
          )}

          {prescription.status === 'VERIFIED' && (isPharmacist || isAdmin) && (
            <button
              onClick={handleDispense}
              disabled={actionLoading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2 disabled:bg-emerald-300"
            >
              <Boxes className="w-4.5 h-4.5" /> Dispense Medicines (FEFO)
            </button>
          )}

          {prescription.status === 'DISPENSED' && (
            <Link
              to="/billing"
              className="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
            >
              <Receipt className="w-4 h-4" /> Invoice Generated
            </Link>
          )}

          {['PENDING', 'VERIFIED'].includes(prescription.status) && (
            <button
              onClick={() => setCancelModalOpen(true)}
              disabled={actionLoading}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel Prescription
            </button>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <User className="w-4 h-4 text-blue-600" /> Patient Info
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {prescription.patientName || 'Unknown Patient'}
          </h4>
          <Link
            to={`/patients/${prescription.patientId}`}
            className="text-xs text-blue-600 hover:underline font-semibold block"
          >
            View Patient Medical Profile
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Stethoscope className="w-4 h-4 text-indigo-600" /> Prescribing Doctor
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {prescription.doctorName || 'Dr. Assigned'}
          </h4>
          <p className="text-xs text-slate-500">Hospital Medical Officer</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <FileText className="w-4 h-4 text-teal-600" /> Diagnosis Summary
          </div>
          <p className="text-xs font-bold text-slate-800">
            {prescription.diagnosis || 'Clinical Consultation'}
          </p>
          {prescription.notes && (
            <p className="text-[11px] text-slate-500 leading-snug">{prescription.notes}</p>
          )}
        </div>
      </div>

      {/* Prescribed Medicines Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Prescribed Medicines Line Items ({prescription.items?.length || 0})
            </h3>
          </div>
          {prescription.status === 'VERIFIED' && (
            <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 font-medium">
              Ready for FEFO Stock Deduction
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Medicine Brand Name</th>
                <th className="py-3.5 px-4">Dosage</th>
                <th className="py-3.5 px-4">Frequency</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Prescribed Qty</th>
                <th className="py-3.5 px-4">Dispensed Qty</th>
                <th className="py-3.5 px-4">Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {prescription.items?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.drugBrandName || `Drug ID #${item.drugId}`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{item.dosage}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.frequency}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.duration}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.quantity} units
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <span
                      className={
                        item.dispensedQuantity > 0 ? 'text-emerald-600' : 'text-slate-400'
                      }
                    >
                      {item.dispensedQuantity || 0} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 italic">
                    {item.instructions || 'Standard usage'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Confirm Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Prescription"
        message="Are you sure you want to cancel this prescription? Cancelled prescriptions cannot be verified or dispensed."
        confirmText="Cancel Prescription"
        isDangerous
        loading={actionLoading}
      />
    </div>
  );
};
