import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Lock, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Smartphone
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, allTenants, quickSwitchRole } = useAuth();

  const [email, setEmail] = useState('admin@careplus.demo');
  const [password, setPassword] = useState('Admin@123');
  const [selectedTenantId, setSelectedTenantId] = useState('tenant-healing-hands');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  if (!isOpen) return null;

  const DEMO_CREDENTIALS = [
    { label: 'Super Admin', email: 'superadmin@demo.com', pass: 'SuperAdmin@123', roleBadge: 'Global' },
    { label: 'Clinic Admin', email: 'admin@careplus.demo', pass: 'Admin@123', roleBadge: 'Tenant 1' },
    { label: 'Doctor', email: 'doctor@careplus.demo', pass: 'Doctor@123', roleBadge: 'OPD / EMR' },
    { label: 'Receptionist', email: 'receptionist@careplus.demo', pass: 'Reception@123', roleBadge: 'Front Desk' },
    { label: 'Nurse / Paramedic', email: 'nurse@careplus.demo', pass: 'Nurse@123', roleBadge: 'Vitals & MAR' },
    { label: 'Billing Staff', email: 'billing@careplus.demo', pass: 'Billing@123', roleBadge: 'Invoicing' },
    { label: 'Pharmacist', email: 'pharmacy@careplus.demo', pass: 'Pharmacy@123', roleBadge: 'Inventory' },
    { label: 'Patient (Demo)', email: 'patient@demo.com', pass: 'Patient@123', roleBadge: 'Patient Portal' },
    { label: 'Clinic Admin 2', email: 'admin@clinic2.demo', pass: 'Admin@123', roleBadge: 'Tenant 2' }
  ];

  const handleFillCredentials = (item: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(item.email);
    setPassword(item.pass);
    setErrorMessage('');
    if (item.email.includes('clinic2')) {
      setSelectedTenantId('tenant-apex-care');
    } else if (!item.email.includes('superadmin')) {
      setSelectedTenantId('tenant-healing-hands');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (twoFactorEnabled && twoFactorCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your authenticator device (e.g. 123456).');
      return;
    }

    const result = login(email, password, selectedTenantId);
    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] sm:max-h-none overflow-y-auto shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-250">
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative sm:rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Clinic Management System Login
                </h3>
                <p className="text-xs text-slate-400">
                  Role-based access control with multi-tenant data isolation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick 1-Click Credentials Grid */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Select Demo Credentials to Auto-Fill:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              {DEMO_CREDENTIALS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleFillCredentials(item)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    email === item.email
                      ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-950 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] truncate">{item.label}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                      {item.roleBadge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono truncate mt-0.5">{item.email}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isForgotPassword ? (
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-slate-900">Reset Password (HIPAA Self-Service)</h4>
              <p className="text-xs text-slate-600">
                Enter your registered clinic staff email. An encrypted password reset token will be logged for your verification.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  placeholder="doctor@careplus.demo"
                />
              </div>

              {resetEmailSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  Password reset link has been dispatched to your email. You may now return and log in with your demo password.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setResetEmailSent(true)}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs"
                >
                  Send Encrypted Reset Instructions
                </button>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetEmailSent(false);
                  }}
                  className="text-xs text-teal-700 font-semibold hover:underline"
                >
                  &larr; Back to login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tenant Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clinic Tenant Domain</span>
                </label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  {allTenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subdomain}.demo)
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>Work Email / Patient Username</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-teal-600" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[11px] text-teal-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
                />
              </div>

              {/* 2FA Toggle Simulation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Smartphone className="w-4 h-4 text-teal-600" />
                    <span className="font-semibold text-slate-800">Two-Factor Authentication (2FA)</span>
                  </div>
                  <input
                    type="checkbox"
                    id="two-factor-checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </div>
                {twoFactorEnabled && (
                  <div className="pt-2 border-t border-slate-200 animate-in fade-in duration-100">
                    <label className="block text-[11px] text-slate-600 mb-1">Enter 6-Digit Authenticator Token (e.g. 123456)</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono tracking-widest text-center"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In & Open Role Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>256-bit TLS • HIPAA Tenant Encrypted</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">SESSION: JWT-HMAC256</span>
        </div>
      </div>
    </div>
  );
};
