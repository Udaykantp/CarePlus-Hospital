import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  Calendar, 
  HeartPulse, 
  FileText, 
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Activity,
  X,
  Clock
} from 'lucide-react';
import { useClinicData } from '../../context/ClinicDataContext';
import { SyntheticPatient } from '../../types/management';

interface HospitalPatientsViewProps {
  onOpenConsultation?: (patientId: string) => void;
}

export const HospitalPatientsView: React.FC<HospitalPatientsViewProps> = ({ onOpenConsultation }) => {
  const { patients } = useClinicData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [activePatient, setActivePatient] = useState<SyntheticPatient | null>(null);

  const filteredPatients = patients.filter(p => {
    const fullName = `${p.firstName} ${p.lastName}`;
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    const matchesGender = selectedGender === 'all' || p.gender.toLowerCase() === selectedGender.toLowerCase();
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Patient Directory & Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized Electronic Health Record (EHR) registry with demographic index and clinical history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            Total Active Patients: {patients.length}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by UHID, patient name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
          >
            <option value="all">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">UHID</th>
                <th className="py-3 px-4">Patient Particulars</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Primary Allergies</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => {
                const fullName = `${p.firstName} ${p.lastName}`;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {p.mrn}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {p.firstName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{fullName}</span>
                          <span className="text-[11px] text-slate-400">{p.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {p.age} Yrs &bull; {p.gender}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono whitespace-nowrap">
                      {p.phone}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {p.allergies.length > 0 ? (
                        <span className="text-amber-700 font-medium">{p.allergies.join(', ')}</span>
                      ) : (
                        <span className="text-slate-400 italic">None reported</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActivePatient(p)}
                        className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Drawer / Modal */}
      {activePatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center">
                  {activePatient.firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activePatient.firstName} {activePatient.lastName}</h3>
                  <span className="text-xs text-blue-700 font-mono font-semibold">MRN: {activePatient.mrn}</span>
                </div>
              </div>
              <button
                onClick={() => setActivePatient(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Age & Gender</span>
                  <span className="font-bold text-slate-800">{activePatient.age} Yrs &bull; {activePatient.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
                  <span className="font-bold text-rose-700">{activePatient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency Contact</span>
                  <span className="font-bold text-slate-800">{activePatient.emergencyContact?.relationship || 'Family'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>Chronic Medical Conditions</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activePatient.chronicConditions.map((cond, i) => (
                    <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-medium">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Insurance & TPA Policy</span>
                </h4>
                {activePatient.insurancePolicyNumber ? (
                  <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1">
                    <p className="font-bold text-slate-800">{activePatient.insuranceProvider}</p>
                    <p className="text-slate-500 font-mono">Policy #: {activePatient.insurancePolicyNumber}</p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Self-Pay / Cash Patient</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setActivePatient(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
