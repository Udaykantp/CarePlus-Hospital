import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/management';
import { 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  UserCheck, 
  Eye, 
  Globe, 
  ChevronDown, 
  RefreshCw,
  LogOut,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useClinicData } from '../../context/ClinicDataContext';

export const DemoSwitcherBar: React.FC<{ onOpenLogin: () => void }> = ({ onOpenLogin }) => {
  const { 
    currentUser, 
    currentTenant, 
    allTenants, 
    switchTenant, 
    quickSwitchRole, 
    isViewModePublic, 
    setViewModePublic, 
    logout 
  } = useAuth();
  const { resetAllDemoData } = useClinicData();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const isPortal = location.pathname.startsWith('/portal');

  const DEMO_ACCOUNTS: {
    role: UserRole;
    label: string;
    email: string;
    subLabel: string;
    tenantId?: string;
    color: string;
  }[] = [
    {
      role: 'super_admin',
      label: 'Super Admin',
      email: 'superadmin@demo.com',
      subLabel: 'Platform Owner (All Tenants)',
      color: 'bg-purple-600 text-white'
    },
    {
      role: 'clinic_admin',
      label: 'Clinic Admin',
      email: 'admin@careplus.demo',
      subLabel: 'Tenant 1: CarePlus Hospital (Demo)',
      tenantId: 'tenant-healing-hands',
      color: 'bg-teal-700 text-white'
    },
    {
      role: 'doctor',
      label: 'Doctor',
      email: 'doctor@careplus.demo',
      subLabel: 'Dr. Rahul Sharma (General Physician)',
      tenantId: 'tenant-healing-hands',
      color: 'bg-blue-600 text-white'
    },
    {
      role: 'receptionist',
      label: 'Receptionist',
      email: 'receptionist@careplus.demo',
      subLabel: 'Front Desk & Queue (Priya Sharma)',
      tenantId: 'tenant-healing-hands',
      color: 'bg-emerald-600 text-white'
    },
    {
      role: 'nurse',
      label: 'Nurse / Paramedic',
      email: 'nurse@careplus.demo',
      subLabel: 'Sister Anjali Nair (Vitals & MAR)',
      tenantId: 'tenant-healing-hands',
      color: 'bg-cyan-600 text-white'
    },
    {
      role: 'billing',
      label: 'Billing Staff',
      email: 'billing@careplus.demo',
      subLabel: 'Invoicing & TPA (Rajesh Verma)',
      tenantId: 'tenant-healing-hands',
      color: 'bg-amber-600 text-white'
    },
    {
      role: 'pharmacist',
      label: 'Pharmacist',
      email: 'pharmacy@careplus.demo',
      subLabel: 'Inventory & Dispensary (Vikram Sethi)',
      tenantId: 'tenant-healing-hands',
      color: 'bg-indigo-600 text-white'
    },
    {
      role: 'patient',
      label: 'Patient Portal',
      email: 'patient@demo.com',
      subLabel: 'Amitabh Sen (MRN: 1001)',
      tenantId: 'tenant-healing-hands',
      color: 'bg-rose-600 text-white'
    },
    {
      role: 'clinic_admin',
      label: 'Clinic Admin (Tenant 2)',
      email: 'admin@clinic2.demo',
      subLabel: 'Tenant 2: Apex Care Hospital',
      tenantId: 'tenant-apex-care',
      color: 'bg-orange-600 text-white'
    }
  ];

  const handleSelectRole = (acc: typeof DEMO_ACCOUNTS[0]) => {
    quickSwitchRole(acc.role, acc.tenantId);
    setIsDropdownOpen(false);
    navigate('/portal');
  };

  const handleReset = () => {
    resetAllDemoData();
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 2000);
  };

  return (
    <aside aria-label="Demo environment controls" className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-3 sm:px-4 z-40 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: HIPAA Badge & Tenant Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-semibold tracking-wide text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HIPAA Compliant Demo Architecture</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400 text-[11px]">
            <Building2 className="w-3 h-3 text-teal-400" />
            <span>Active Tenant:</span>
            <strong className="text-white font-medium">{currentTenant.name}</strong>
            <span className="text-slate-500">({currentTenant.subdomain}.demo)</span>
          </div>
        </div>

        {/* Right: Role Switcher & View Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap">
          {/* View Mode Toggle Button */}
          {currentUser ? (
            isPortal ? (
              <Link
                to="/"
                className="px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                <Globe className="w-3 h-3 text-teal-400" />
                <span>View Public Website</span>
              </Link>
            ) : (
              <Link
                to="/portal"
                className="px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors bg-teal-600 hover:bg-teal-500 text-white"
              >
                <UserCheck className="w-3 h-3" />
                <span>Open {currentUser.role.replace('_', ' ').toUpperCase()} Portal</span>
              </Link>
            )
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Staff / Patient Login</span>
            </button>
          )}

          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                Demo Role:{' '}
                <strong className="text-white">
                  {currentUser ? currentUser.role.replace('_', ' ').toUpperCase() : 'Guest'}
                </strong>
              </span>
              <ChevronDown className="w-3 h-3 text-amber-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-slate-800 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    1-Click Demo Accounts Switcher
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Switch between all 9 seeded HIPAA personas instantly:
                  </p>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                  {DEMO_ACCOUNTS.map((acc, idx) => {
                    const isActive = currentUser?.email.toLowerCase() === acc.email.toLowerCase();
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectRole(acc)}
                        className={`w-full p-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-teal-950/80 border border-teal-600 text-white'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${acc.color}`}>
                              {acc.label}
                            </span>
                            {isActive && <CheckCircle2 className="w-3 h-3 text-teal-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{acc.email}</p>
                          <p className="text-[10px] text-slate-500">{acc.subLabel}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {currentUser && (
                  <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Log Out (Return to Guest)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={handleReset}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset synthetic demo data to factory defaults"
          >
            <RefreshCw className={`w-3 h-3 ${resetConfirm ? 'text-teal-400 animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </aside>
  );
};
