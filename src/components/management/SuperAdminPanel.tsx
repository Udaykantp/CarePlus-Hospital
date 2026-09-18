import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { Tenant } from '../../types/management';
import { 
  Building2, 
  ShieldCheck, 
  Database, 
  Plus, 
  Users, 
  FileText, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Search,
  Lock,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const SuperAdminPanel: React.FC = () => {
  const { allTenants, currentTenant, switchTenant, updateTenant } = useAuth();
  const { allPatients, allAppointments, allInvoices, allAuditLogs } = useClinicData();

  const [activeTab, setActiveTab] = useState<'tenants' | 'audit_logs' | 'security'>('tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);
  const [newTenantForm, setNewTenantForm] = useState({
    name: '',
    subdomain: '',
    legalName: '',
    email: '',
    phone: '',
    city: 'New Delhi',
    plan: 'Professional' as Tenant['subscriptionPlan']
  });

  const totalPatientsAll = allPatients.length;
  const totalAppointmentsAll = allAppointments.length;
  const totalGrossRevenue = allInvoices.reduce((sum, i) => sum + i.paidAmount, 0);

  const filteredTenants = allTenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantForm.name || !newTenantForm.subdomain) return;

    const newT: Tenant = {
      id: `tenant-${newTenantForm.subdomain.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: newTenantForm.name,
      subdomain: newTenantForm.subdomain.toLowerCase(),
      legalName: newTenantForm.legalName || `${newTenantForm.name} Healthcare LLP`,
      tagline: 'Comprehensive Outpatient & Multi-Speciality Medical Center',
      email: newTenantForm.email || `contact@${newTenantForm.subdomain}.demo`,
      phone: newTenantForm.phone || '+91 11 4000 0000',
      address: 'Suite 401, Medical Enclave',
      city: newTenantForm.city,
      state: 'Delhi',
      country: 'India',
      postalCode: '110001',
      status: 'active',
      subscriptionPlan: newTenantForm.plan,
      subscriptionExpiry: '2027-12-31',
      monthlyRevenue: 0,
      totalPatientsCount: 0,
      activeDoctorsCount: 2,
      totalBedsCount: 10,
      hipaaCompliantBaaSigned: true,
      featureFlags: {
        telemedicine: true,
        ePrescription: true,
        labIntegration: true,
        pharmacyInventory: true,
        inPatientWards: true,
        smsReminders: true,
        insuranceTpa: true,
        twoFactorAuth: false
      },
      createdAt: new Date().toISOString()
    };

    updateTenant(newT);
    setIsCreateTenantOpen(false);
    setNewTenantForm({
      name: '',
      subdomain: '',
      legalName: '',
      email: '',
      phone: '',
      city: 'New Delhi',
      plan: 'Professional'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching CarePlus portal layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Super Admin & Multi-Tenant Control Plane
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cross-tenant database isolation, enterprise license quotas, HIPAA compliance audit logs, and global platform telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateTenantOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Clinic</span>
          </button>
        </div>
      </div>

      {/* Global KPI Metrics matching CarePlus portal style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Active Tenants</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {allTenants.length} Clinics
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">100% SLA Uptime</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Total Patients</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {totalPatientsAll.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Isolated tenant vaults</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Appointments</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {totalAppointmentsAll}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">Processed platform-wide</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Collected Revenue</span>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 font-heading">
            ₹{totalGrossRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Reconciled via gateway</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tenants'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Provisioned Tenants ({allTenants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit_logs'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Audit Trail ({allAuditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & BAA Compliance</span>
        </button>
      </div>

      {/* TAB 1: TENANTS */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clinics by name, subdomain, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map((tenant) => {
              const isCurrent = tenant.id === currentTenant.id;
              return (
                <div
                  key={tenant.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isCurrent
                      ? 'border-purple-600 ring-2 ring-purple-600/10 shadow-md'
                      : 'border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {tenant.subscriptionPlan} Plan
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-2">{tenant.name}</h3>
                      <p className="text-slate-500 text-xs font-mono">{tenant.subdomain}.demo</p>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Active Context
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{tenant.tagline}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location</span>
                      <strong className="text-slate-700">{tenant.city}, {tenant.state}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Staff Doctors</span>
                      <strong className="text-slate-700">{tenant.activeDoctorsCount} Specialists</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">In-Patient Beds</span>
                      <strong className="text-slate-700">{tenant.totalBedsCount} Daycare/Wards</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">HIPAA BAA</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Signed
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => switchTenant(tenant.id)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-purple-700 hover:bg-purple-800 text-white'
                      }`}
                    >
                      {isCurrent ? 'Viewing This Tenant' : 'Switch Context & Manage'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">HIPAA Continuous Audit Trail (All Tenants)</h3>
              <p className="text-xs text-slate-500">
                Immutable, timestamped record of PHI access, prescription dispatches, patient triage, and administrative actions.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Immutable Ledger Active</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="py-2.5">Timestamp (UTC)</th>
                  <th className="py-2.5">User & Role</th>
                  <th className="py-2.5">Action Code</th>
                  <th className="py-2.5">Resource</th>
                  <th className="py-2.5">Details & PHI Log</th>
                  <th className="py-2.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {allAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 text-slate-800 font-sans">
                      <strong className="block text-xs text-slate-900">{log.userName}</strong>
                      <span className="text-[10px] text-purple-700 uppercase font-semibold">{log.userRole}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600 font-sans">
                      {log.resourceType} ({log.resourceId})
                    </td>
                    <td className="py-2.5 text-slate-700 font-sans max-w-md">
                      {log.details}
                    </td>
                    <td className="py-2.5 text-slate-400 text-[10px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & BAA */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Multi-Tenant Architecture Security Guarantees</span>
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Row-Level Security (RLS) & Schema Isolation:</strong> Every patient, EMR record, and billing item is tagged with <code className="text-purple-700">tenantId</code> and filtered strictly by the authenticated JWT session claim.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Encrypted at Rest & in Transit:</strong> AES-256 storage volume encryption and TLS 1.3 in-flight transport protection across all clinical microservices.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Strict RBAC Matrix:</strong> Receptionists cannot view clinical SOAP assessments; Pharmacists cannot edit doctors' medical notes; Doctors cannot alter billing ledger totals.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Business Associate Agreement (BAA) Status</span>
            </h3>
            <p className="text-slate-600">
              CarePlus Hospital (Demo) holds active HIPAA Title II and DISHA (Digital Information Security in Healthcare Act) compliance certificates.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
              <div>Certificate ID: BAA-HHMC-2026-X992</div>
              <div>Audit Standard: HIPAA 45 CFR Part 160 & Part 164</div>
              <div>Attestation Officer: Alexander Wright (Global CISO)</div>
              <div>Next Annual Audit: January 2027</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Tenant */}
      {isCreateTenantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Provision New Clinic Tenant</h3>
              <button onClick={() => setIsCreateTenantOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">Close</button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinic / Hospital Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Ortho & Spine Institute"
                  value={newTenantForm.name}
                  onChange={(e) => setNewTenantForm({ ...newTenantForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tenant Subdomain (Identifier)</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="cityortho"
                    value={newTenantForm.subdomain}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, subdomain: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-l-lg"
                  />
                  <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-200 text-slate-500 rounded-r-lg font-mono">
                    .demo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newTenantForm.city}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subscription Tier</label>
                  <select
                    value={newTenantForm.plan}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, plan: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Starter">Starter (Small Clinic)</option>
                    <option value="Professional">Professional (Polyclinic)</option>
                    <option value="Enterprise">Enterprise (Multispeciality)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTenantOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
                >
                  Initialize & Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
