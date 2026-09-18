import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { ManagementUser } from '../../types/management';
import { 
  Building2, 
  Users, 
  Settings, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Activity, 
  ToggleLeft, 
  ToggleRight,
  UserCheck
} from 'lucide-react';

export const ClinicAdminPanel: React.FC = () => {
  const { currentTenant, updateTenant, allUsers, addUser, toggleUserStatus } = useAuth();
  const { patients, appointments, invoices } = useClinicData();

  const [activeTab, setActiveTab] = useState<'staff' | 'settings' | 'reports' | 'features'>('staff');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'doctor' as ManagementUser['role'],
    department: 'Physiotherapy & Spine Care',
    specialization: '',
    licenseNumber: ''
  });

  // Filter staff belonging to this clinic
  const clinicStaff = allUsers.filter(u => u.tenantId === currentTenant.id);

  const completedApts = appointments.filter(a => a.status === 'Completed').length;
  const totalRevenue = invoices.reduce((sum, i) => sum + i.paidAmount, 0);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) return;

    addUser({
      tenantId: currentTenant.id,
      name: staffForm.name,
      email: staffForm.email.toLowerCase(),
      role: staffForm.role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      phone: staffForm.phone || '+91 98111 00000',
      department: staffForm.department,
      specialization: staffForm.specialization,
      licenseNumber: staffForm.licenseNumber,
      status: 'active',
      lastLogin: new Date().toISOString(),
      twoFactorEnabled: false
    });

    setIsAddStaffOpen(false);
    setStaffForm({
      name: '',
      email: '',
      phone: '',
      role: 'doctor',
      department: 'Physiotherapy & Spine Care',
      specialization: '',
      licenseNumber: ''
    });
  };

  const handleToggleFeature = (key: keyof typeof currentTenant.featureFlags) => {
    const updated = {
      ...currentTenant,
      featureFlags: {
        ...currentTenant.featureFlags,
        [key]: !currentTenant.featureFlags[key]
      }
    };
    updateTenant(updated);
  };

  return (
    <div className="space-y-6">
      {/* Clinic Header matching CarePlus portal layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Clinic Administration & Operational Config
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage resident clinicians, front-desk triage staff, OPD schedules, feature flags, and analytics for {currentTenant.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff / Clinician</span>
          </button>
        </div>
      </div>

      {/* Quick KPI stats matching CarePlus portal style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Active Patients</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {patients.length}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">In local tenant registry</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Scheduled Today</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {appointments.length} Consults
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">{completedApts} completed today</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Staff & Doctors</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {clinicStaff.length} On Duty
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Credentialed personnel</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Gross Revenue</span>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 font-heading">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">OPD, Rehab & Pharmacy</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff & Doctor Roster ({clinicStaff.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'features'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ToggleRight className="w-3.5 h-3.5" />
          <span>Clinical Modules & Toggles</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Financial Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Clinic Timings & Profile</span>
        </button>
      </div>

      {/* TAB 1: STAFF MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Credentialed Staff Directory</h3>
              <p className="text-xs text-slate-500">
                Manage roles, medical council licenses, departments, and active account access.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="py-2.5">Staff Member</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5">Department & Specialization</th>
                  <th className="py-2.5">Medical License</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clinicStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/70">
                    <td className="py-3 flex items-center gap-3">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <strong className="text-slate-900 font-bold block">{staff.name}</strong>
                        <span className="text-[11px] text-slate-500">{staff.email}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-teal-800">
                        {staff.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">
                      <div>{staff.department}</div>
                      {staff.specialization && (
                        <div className="text-[11px] text-slate-500 italic">{staff.specialization}</div>
                      )}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600">
                      {staff.licenseNumber || '—'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        staff.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => toggleUserStatus(staff.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                          staff.status === 'active'
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FEATURE TOGGLES */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Clinical Feature Flags & Tenant Modules</h3>
            <p className="text-xs text-slate-500">
              Enable or disable integrated clinical modules for this clinic without affecting other tenant databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(currentTenant.featureFlags).map(([key, enabled]) => {
              const labels: Record<string, { title: string; desc: string }> = {
                telemedicine: { title: 'Telemedicine & Video OPD', desc: 'Secure WebRTC-based video consultations with digital queue' },
                ePrescription: { title: 'Electronic Prescriptions (e-Rx)', desc: 'Direct digital prescription routing to in-clinic pharmacy' },
                labIntegration: { title: 'Pathology & Diagnostic Lab', desc: 'Integrated sample barcoding and computerized report generation' },
                pharmacyInventory: { title: 'Pharmacy & Drug Stock Ledger', desc: 'Real-time stock alerts and automatic batch expiry tracking' },
                inPatientWards: { title: 'Daycare & Inpatient Beds', desc: 'Bed allocation, nurse vital charts, and MAR administration' },
                smsReminders: { title: 'SMS & WhatsApp Appointment Alerts', desc: 'Automated 24-hour and 2-hour patient appointment reminders' },
                insuranceTpa: { title: 'Cashless TPA & Insurance Billing', desc: 'Pre-authorization tracking and claim submission desk' },
                twoFactorAuth: { title: 'Mandatory 2FA for Medical Staff', desc: 'Enforce time-based OTP for all clinicians handling PHI' }
              };
              const item = labels[key] || { title: key, desc: '' };

              return (
                <div
                  key={key}
                  className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="pr-4">
                    <strong className="text-xs font-bold text-slate-900 block">{item.title}</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggleFeature(key as any)}
                    className={`shrink-0 p-1 rounded-full transition-colors cursor-pointer ${
                      enabled ? 'text-teal-600' : 'text-slate-300'
                    }`}
                  >
                    {enabled ? (
                      <ToggleRight className="w-8 h-8 fill-teal-600 text-teal-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 fill-slate-300 text-slate-300" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Department Footfall Distribution
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Physiotherapy & Spine Rehabilitation</span>
                  <span>42% (580 Visits)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full w-[42%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>General Internal Medicine & Diabetes</span>
                  <span>28% (390 Visits)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-[28%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Orthopaedics & Joint Replacement</span>
                  <span>18% (250 Visits)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full w-[18%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Pathology & Radiology Diagnostics</span>
                  <span>12% (170 Visits)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-[12%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Revenue Breakdown by Category
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Doctor Consultations</span>
                <strong className="text-slate-900">₹4,20,000</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Rehab & Physiotherapy Packages</span>
                <strong className="text-slate-900">₹5,85,000</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Diagnostic Laboratory & Imaging</span>
                <strong className="text-slate-900">₹2,90,000</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Dispensary Pharmacy Sales</span>
                <strong className="text-slate-900">₹1,90,000</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-2xl text-xs">
          <h3 className="text-sm font-bold text-slate-900">Clinic Timings & Operational Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinic Name</label>
              <input
                type="text"
                disabled
                value={currentTenant.name}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Helpline Phone</label>
              <input
                type="text"
                defaultValue={currentTenant.phone}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                defaultValue={`${currentTenant.address}, ${currentTenant.city} - ${currentTenant.postalCode}`}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Morning OPD Timings</label>
              <input
                type="text"
                defaultValue="09:00 AM - 01:00 PM"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Evening OPD Timings</label>
              <input
                type="text"
                defaultValue="04:00 PM - 08:30 PM"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-sm">
              Save Clinic Settings
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add Staff */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Staff Member</h3>
              <button onClick={() => setIsAddStaffOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">Close</button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Gupta"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="r.gupta@careplus.demo"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98100 00000"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="doctor">Doctor / Clinician</option>
                    <option value="receptionist">Receptionist / Front Desk</option>
                    <option value="nurse">Nurse / Paramedic</option>
                    <option value="billing">Billing & Accounts</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Physiotherapy / Cardiology"
                    value={staffForm.department}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medical Registration / License #</label>
                <input
                  type="text"
                  placeholder="DMC-19824 or DCPTOT-889"
                  value={staffForm.licenseNumber}
                  onChange={(e) => setStaffForm({ ...staffForm, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold"
                >
                  Save & Invite Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
