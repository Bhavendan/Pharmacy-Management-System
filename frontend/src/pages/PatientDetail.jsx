import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientApi } from '../api/patientApi';
import { prescriptionApi } from '../api/prescriptionApi';
import { billApi } from '../api/billApi';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertCircle,
  FileText,
  Receipt,
  ArrowLeft,
} from 'lucide-react';

export const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPatientData = async () => {
    setLoading(true);
    setError('');
    try {
      const pData = await patientApi.getPatientById(id);
      setPatient(pData);

      const prescData = await prescriptionApi.getPatientPrescriptions(id);
      setPrescriptions(prescData);

      const billData = await billApi.getPatientBills(id);
      setBills(billData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch patient details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading patient profile..." />;
  if (error) return <ErrorState message={error} onRetry={fetchPatientData} />;
  if (!patient) return null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/patients"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Patients List
      </Link>

      {/* Patient Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xl flex items-center justify-center shrink-0">
            {patient.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold text-xs rounded-md border border-blue-200">
                {patient.patientCode}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" /> {patient.gender || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> DOB: {patient.dateOfBirth || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" /> {patient.phone || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" /> Blood Group:{' '}
                <strong className="text-slate-800">{patient.bloodGroup || 'N/A'}</strong>
              </span>
            </div>

            {patient.address && (
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" /> {patient.address}
              </p>
            )}
          </div>
        </div>

        {patient.allergies && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 max-w-xs">
            <div className="font-bold flex items-center gap-1.5 text-rose-700 mb-1">
              <AlertCircle className="w-4 h-4" /> Known Allergies
            </div>
            <p className="leading-snug">{patient.allergies}</p>
          </div>
        )}
      </div>

      {/* Tabs / Subsections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescriptions History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Prescriptions History ({prescriptions.length})
              </h3>
            </div>
          </div>

          {prescriptions.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-xl">
              No prescriptions issued for this patient yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {prescriptions.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <Link
                      to={`/prescriptions/${p.id}`}
                      className="text-xs font-bold text-blue-600 hover:underline font-mono block"
                    >
                      {p.prescriptionNumber}
                    </Link>
                    <span className="text-[11px] text-slate-500">
                      Date: {p.prescriptionDate || 'N/A'} • Doctor: {p.doctorName || 'N/A'}
                    </span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Billing & Invoices ({bills.length})
              </h3>
            </div>
          </div>

          {bills.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-xl">
              No invoices generated for this patient yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {bills.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <Link
                      to={`/billing/${b.id}`}
                      className="text-xs font-bold text-slate-900 font-mono block hover:text-blue-600"
                    >
                      #{b.invoiceNumber}
                    </Link>
                    <span className="text-[11px] text-slate-500">
                      Total: <strong className="text-slate-800">${b.totalAmount?.toFixed(2)}</strong> • Method: {b.paymentMethod || 'N/A'}
                    </span>
                  </div>
                  <StatusBadge status={b.paymentStatus} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
