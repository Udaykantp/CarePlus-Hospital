import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  HeartPulse, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Pill, 
  FlaskConical, 
  CreditCard, 
  MessageSquare, 
  User, 
  Settings, 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  LogOut,
  Building2,
  CheckCircle2,
  Stethoscope,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { HospitalDashboardView } from './HospitalDashboardView';
import { HospitalPatientsView } from './HospitalPatientsView';
import { ReceptionistPanel } from './ReceptionistPanel';
import { DoctorPanel } from './DoctorPanel';
import { PharmacyPanel } from './PharmacyPanel';
import { LabPanel } from './LabPanel';
import { Breadcrumb } from '../Breadcrumb';
import { BillingPanel } from './BillingPanel';
import { ClinicAdminPanel } from './ClinicAdminPanel';
import { SuperAdminPanel } from './SuperAdminPanel';

interface HospitalPortalLayoutProps {
  initialTab?: string;
}

export const HospitalPortalLayout: React.FC<HospitalPortalLayoutProps> = ({ initialTab = 'dashboard' }) => {
  const { 
    currentUser, 
    currentTenant, 
    allTenants, 
    switchTenant, 
    quickSwitchRole, 
    toggleViewMode, 
    logout 
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path (e.g. /portal/appointments -> 'appointments')
  const pathParts = location.pathname.split('/');
  const subRoute = pathParts[2]; // after /portal/
  const activeTab = subRoute || initialTab || 'dashboard';

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);

  // Nav Items matching the uploaded screenshot:
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'lab', label: 'Lab Reports', icon: FlaskConical },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tabId: string) => {
    navigate(`/portal/${tabId}`);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex-1 flex bg-[#f4f7fb] text-slate-800 font-sans antialiased min-h-[calc(100vh-140px)]">
      {/* 1. LEFT SIDEBAR (Dark Navy Background #0d1f38) */}
      {/* Desktop Sidebar */}
      <aside 
        aria-label="CarePlus Hospital Navigation"
        className="hidden lg:flex flex-col w-64 bg-[#0d1f38] text-slate-300 flex-shrink-0 select-none border-r border-slate-900"
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 flex-shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-white tracking-tight font-heading leading-tight truncate">
              CarePlus Hospital
            </h1>
            <p className="text-[11px] text-slate-400 truncate">
              Better Health. Brighter Tomorrow.
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Tenant Info & Public Web Switcher */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-[#0a182c]">
          <div className="px-2 py-1.5 rounded-lg bg-slate-800/60 text-[11px] text-slate-300 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Tenant</span>
              <span className="font-semibold text-white truncate block">{currentTenant.name}</span>
            </div>
          </div>

          <Link
            to="/"
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Slide-out Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="relative w-64 max-w-[80vw] bg-[#0d1f38] text-slate-300 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight">CarePlus Hospital</h2>
                  <p className="text-[10px] text-slate-400">Hospital Portal</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#2563eb] text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-800 space-y-2">
              <button
                onClick={toggleViewMode}
                className="w-full py-2 px-3 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Public Website</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP SEARCH & USER HEADER */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 z-10 shadow-2xs flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Search bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Pill Search Input matching screenshot */}
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search patients, appointments, or records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>

          {/* Right: Notification Bell & Doctor Profile Chip */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell with red badge 3 */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Notification preview drop */}
              {showNotificationPopup && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40 text-xs animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                    <span>Notifications (3 New)</span>
                    <button 
                      onClick={() => setShowNotificationPopup(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 pt-1 space-y-1">
                    <div className="p-2 hover:bg-slate-50 rounded-lg">
                      <p className="font-semibold text-slate-900">Dr. Rahul Sharma</p>
                      <p className="text-slate-500 text-[11px]">Patient Neha Gupta checked in for OPD consultation.</p>
                    </div>
                    <div className="p-2 hover:bg-slate-50 rounded-lg">
                      <p className="font-semibold text-slate-900">Lab Diagnostic Ready</p>
                      <p className="text-slate-500 text-[11px]">CBC & Lipid Profile report generated for Rohit Verma.</p>
                    </div>
                    <div className="p-2 hover:bg-slate-50 rounded-lg">
                      <p className="font-semibold text-slate-900">New e-Prescription</p>
                      <p className="text-slate-500 text-[11px]">Amoxicillin 500mg dispensed by hospital pharmacy.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Chip matching screenshot */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'}
                  alt={currentUser?.name || 'Dr. Rahul Sharma'}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {currentUser?.name || 'Dr. Rahul Sharma'}
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    {currentUser?.role === 'doctor' ? 'General Physician' : currentUser?.department || 'Medical Staff'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Profile dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 text-xs animate-in fade-in zoom-in-95">
                  <div className="p-2.5 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{currentUser?.name || 'Dr. Rahul Sharma'}</p>
                    <p className="text-slate-400 text-[11px]">{currentUser?.email || 'doctor@careplus.demo'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                      {currentUser?.role?.toUpperCase() || 'DOCTOR'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { setShowProfileDropdown(false); handleSelectTab('profile'); }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                    >
                      View Profile & Schedule
                    </button>
                    <button
                      onClick={() => { setShowProfileDropdown(false); handleSelectTab('settings'); }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                    >
                      Hospital Settings
                    </button>
                    <Link
                      to="/"
                      onClick={() => setShowProfileDropdown(false)}
                      className="block w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                    >
                      Switch to Public Website
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => { setShowProfileDropdown(false); logout(); }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab !== 'dashboard' && (
            <div className="mb-5">
              <Breadcrumb
                showHome={false}
                showBackButton={true}
                backHref="/portal/dashboard"
                backLabel="Dashboard"
                items={[
                  { label: 'Hospital Portal', href: '/portal/dashboard', icon: LayoutDashboard },
                  { 
                    label: navItems.find(n => n.id === activeTab)?.label || activeTab, 
                    icon: navItems.find(n => n.id === activeTab)?.icon, 
                    current: true 
                  }
                ]}
                badge={currentTenant.name}
              />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <HospitalDashboardView
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onOpenQuickAction={(action) => handleSelectTab(action)}
            />
          )}

          {activeTab === 'appointments' && (
            <ReceptionistPanel />
          )}

          {activeTab === 'patients' && (
            <HospitalPatientsView />
          )}

          {activeTab === 'records' && (
            <DoctorPanel />
          )}

          {activeTab === 'prescriptions' && (
            <PharmacyPanel />
          )}

          {activeTab === 'lab' && (
            <LabPanel />
          )}

          {activeTab === 'billing' && (
            <BillingPanel />
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Internal Hospital Messaging & Telehealth Inquiries</h2>
                  <p className="text-xs text-slate-500">Secure HIPAA-compliant staff messaging and patient teleconsultation chat.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  3 Unread Messages
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { sender: 'Sister Anjali Nair (Nurse)', time: '10:15 AM', preview: 'Vitals logged for patient Amit Kumar. Blood pressure slightly elevated at 140/90.', unread: true },
                  { sender: 'Dr. Rohan Krishnan (Orthopaedics)', time: '09:50 AM', preview: 'Referred patient Neha Gupta for post-rehab joint review. X-ray looks clean.', unread: true },
                  { sender: 'Vikram Sethi (Pharmacy Desk)', time: '09:20 AM', preview: 'Paracetamol and Amoxicillin stock dispensed for OPD prescriptions.', unread: true },
                  { sender: 'Priya Sharma (Reception Front Desk)', time: '08:45 AM', preview: 'All 18 tokens allocated for morning OPD shift. Walk-ins open from 12 PM.', unread: false },
                ].map((msg, i) => (
                  <div key={i} className={`p-4 rounded-xl border transition-all ${msg.unread ? 'bg-blue-50/40 border-blue-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="font-bold text-slate-900">{msg.sender}</span>
                      <span className="text-[11px] text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{msg.preview}</p>
                    <button className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                      Reply message &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'}
                  alt="Doctor"
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/20"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-slate-900 font-heading">
                    {currentUser?.name || 'Dr. Rahul Sharma'}
                  </h2>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">
                    Senior General Physician &bull; MD (General Medicine)
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    CarePlus Hospital &bull; License DMC-44912 &bull; Room 102, Ground Floor OPD
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">OPD Schedule</span>
                  <span className="font-bold text-slate-900 block mt-1">Mon - Sat: 9:00 AM - 4:00 PM</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Fee</span>
                  <span className="font-bold text-emerald-700 block mt-1">₹800 (In-Clinic) / ₹600 (Video)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patients Handled</span>
                  <span className="font-bold text-blue-700 block mt-1">1,400+ Consultations</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <ClinicAdminPanel />
          )}
        </main>
      </div>
    </div>
  );
};
