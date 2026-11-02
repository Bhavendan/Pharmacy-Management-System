import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Activity,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Pill,
  CheckCircle2,
  Boxes,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const expired = searchParams.get('expired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Invalid email or password. Please check your login credentials.';
      setErrorMsg(msg);
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* LEFT SIDE: Medical & Pharmacy Branding Hero Showcase */}
      <div className="lg:w-7/12 relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
        {/* Background Ambient Lights & Grid Overlay */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Pill className="w-6 h-6 transform -rotate-45" />
          </div>
          <div>
            <span className="text-white font-extrabold tracking-tight text-lg block leading-none">
              Hospital Pharmacy Management System
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block mt-1">
              Clinical & ERP Administration Portal
            </span>
          </div>
        </div>

        {/* Hero Content Section */}
        <div className="relative z-10 my-10 lg:my-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Smart • Secure • Efficient Pharmacy Management</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4">
            Advanced Healthcare & <br />
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              Medicine Inventory Portal
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-normal">
            Streamlining patient prescriptions, automated FEFO inventory batch tracking, real-time billing, and clinical analytics for hospital administration.
          </p>

          {/* Key Value Highlights */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Multi-Role Access Control</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dedicated portals for Admins, Doctors & Pharmacists with strict authorization.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm">
              <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl mt-0.5">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Automated FEFO & Expiry Tracking</h4>
                <p className="text-xs text-slate-400 mt-0.5">First-Expiry-First-Out batch selection prevents medicine wastage and ensures compliance.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Integrated Prescriptions & Billing</h4>
                <p className="text-xs text-slate-400 mt-0.5">Instant invoice generation with automatic tax calculation and stock deduction.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info on left */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Secure Enterprise Architecture</span>
          </div>
          <span>Hospital ERP System</span>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Modern Login Form Portal */}
      <div className="lg:w-5/12 bg-slate-900 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Card Wrapper */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/20 relative">
            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Sign in with your credentials to access your account
              </p>
            </div>

            {/* Expired Notification */}
            {expired && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Your session has expired. Please sign in again.</span>
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div>{errorMsg}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@hospital.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quick Demo Seed Logins</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@pharmacy.com', 'Admin@123')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all group"
                >
                  <span className="font-bold text-purple-400 text-xs block group-hover:text-purple-300">Admin</span>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">admin@pharmacy.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('doctor1@pharmacy.com', 'Doctor@123')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all group"
                >
                  <span className="font-bold text-indigo-400 text-xs block group-hover:text-indigo-300">Doctor</span>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">doctor1@pharmacy.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('pharmacist1@pharmacy.com', 'Pharmacist@123')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all group"
                >
                  <span className="font-bold text-teal-400 text-xs block group-hover:text-teal-300">Pharmacist</span>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">pharmacist1@pharmacy.com</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[11px] text-slate-500">
            Hospital Pharmacy Management System • Spring Boot & React
          </div>
        </div>
      </div>
    </div>
  );
};
