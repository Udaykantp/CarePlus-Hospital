import React from 'react';
import { MedicalRecordEntry, SyntheticPatient } from '../types/management';
import { CLINIC_INFO } from '../data/clinicData';
import { printMedicalRecordDocument } from '../utils/printUtils';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Pill, 
  Activity, 
  FileText, 
  Stethoscope, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface PrintableMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecordEntry | null;
  patient: SyntheticPatient | null;
}

export const PrintableMedicalRecordModal: React.FC<PrintableMedicalRecordModalProps> = ({
  isOpen,
  onClose,
  record,
  patient
}) => {
  if (!isOpen || !record || !patient) return null;

  const handlePrint = () => {
    printMedicalRecordDocument(record, patient);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Action Bar */}
        <div className="sticky top-0 bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between z-10 print:hidden rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Clinical Outpatient Case Sheet & Rx
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">&bull; MRN: {patient.mrn}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable EMR Document Content */}
        <div className="p-6 sm:p-8 space-y-5 text-slate-900 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-teal-700 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                  CP
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black font-heading text-slate-900 leading-tight">
                    CarePlus <span className="text-teal-700">Hospital</span>
                  </h2>
                  <p className="text-[10px] text-teal-800 font-bold uppercase tracking-wider">
                    Outpatient Department & Specialized Clinical Care
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 max-w-sm">
                {CLINIC_INFO.address}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Helpline: {CLINIC_INFO.phonePrimary} | NABH Accredited Healthcare Provider
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-extrabold text-teal-800 tracking-wider block">
                Electronic Medical Record (EMR)
              </span>
              <span className="text-sm font-mono font-bold text-slate-900 block">
                {patient.mrn}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Visit Date: <strong>{record.visitDate}</strong>
              </span>
            </div>
          </div>

          {/* Attending Doctor Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-700" />
              <span>Treating Consultant: <strong>{record.doctorName}</strong></span>
            </div>
            <span className="text-[11px] text-teal-800 font-mono">Case ID: {record.id}</span>
          </div>

          {/* Patient Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Profile</span>
              <strong className="text-sm text-slate-900 block mt-0.5">{patient.firstName} {patient.lastName}</strong>
              <span className="text-slate-600 block mt-0.5">
                {patient.age} Yrs / {patient.gender} &bull; Blood: <strong>{patient.bloodGroup}</strong>
              </span>
              <span className="text-slate-600 font-mono text-[11px]">{patient.phone}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Known Allergies</span>
              <div className="mt-1 flex items-center gap-1.5 text-rose-700 font-bold">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{patient.allergies.join(', ') || 'No Known Drug Allergies (NKDA)'}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-3">Insurance Coverage</span>
              <span className="text-slate-700 text-[11px]">{patient.insuranceProvider || 'Self-Sponsored Outpatient'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Chronic Conditions</span>
              <div className="mt-1 space-y-0.5 text-slate-700 text-[11px]">
                {patient.chronicConditions.map((cond, i) => (
                  <div key={i}>&bull; {cond}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Recorded Vitals */}
          {record.vitals && (
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Recorded Clinical Vitals at OPD Triage
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Blood Pressure</span>
                  <span className="font-extrabold text-slate-900 mt-0.5 block">
                    {record.vitals.bloodPressureSys}/{record.vitals.bloodPressureDia}
                  </span>
                  <span className="text-[9px] text-slate-400">mmHg</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Heart Rate</span>
                  <span className="font-extrabold text-slate-900 mt-0.5 block">
                    {record.vitals.heartRateBpm}
                  </span>
                  <span className="text-[9px] text-slate-400">bpm</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">SpO2 Oxygen</span>
                  <span className="font-extrabold text-emerald-700 mt-0.5 block">
                    {record.vitals.oxygenSaturationSpO2}%
                  </span>
                  <span className="text-[9px] text-slate-400">room air</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Temperature</span>
                  <span className="font-extrabold text-slate-900 mt-0.5 block">
                    {record.vitals.temperatureF}°F
                  </span>
                  <span className="text-[9px] text-slate-400">oral</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Resp. Rate</span>
                  <span className="font-extrabold text-slate-900 mt-0.5 block">
                    {record.vitals.respiratoryRate}
                  </span>
                  <span className="text-[9px] text-slate-400">/min</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Weight & BMI</span>
                  <span className="font-extrabold text-slate-900 mt-0.5 block">
                    {record.vitals.weightKg} kg
                  </span>
                  <span className="text-[9px] text-slate-400">BMI {record.vitals.bmi || '24.2'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Chief Complaint & SOAP Assessment */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-700 block">Chief Complaint</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{record.chiefComplaint}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Clinical Examination (Objective)</span>
                <p className="text-slate-700 mt-1 leading-relaxed text-[11.5px] italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  {record.soapNotes.objective}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Diagnosis Assessment</span>
                <p className="text-slate-700 mt-1 leading-relaxed text-[11.5px] bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  {record.soapNotes.assessment}
                </p>
              </div>
            </div>

            {/* ICD-10 Chips */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">ICD-10 Diagnoses:</span>
              {record.icd10Diagnosis.map((icd) => (
                <span key={icd.code} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10.5px] font-mono">
                  {icd.code}: {icd.description}
                </span>
              ))}
            </div>
          </div>

          {/* Prescriptions (Rx) Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                Prescribed Medications (Rx)
              </h4>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Medicine & Strength</th>
                    <th className="py-2 px-3">Dosage</th>
                    <th className="py-2 px-3">Frequency</th>
                    <th className="py-2 px-3">Duration</th>
                    <th className="py-2 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {record.prescriptions.map((rx, idx) => (
                    <tr key={rx.id} className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{rx.medicineName}</td>
                      <td className="py-2 px-3 font-semibold text-teal-800">{rx.dosage}</td>
                      <td className="py-2 px-3 text-slate-700">{rx.frequency}</td>
                      <td className="py-2 px-3 text-slate-700">{rx.duration}</td>
                      <td className="py-2 px-3 text-[11px] text-slate-500 italic">{rx.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Treatment Plan & Recommended Labs */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Treatment & Rehabilitation Protocol
            </span>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              {record.soapNotes.plan}
            </p>

            {record.orderedLabTests && record.orderedLabTests.length > 0 && (
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <span className="text-[10.5px] font-bold text-teal-800 uppercase">Recommended Labs:</span>
                <span className="text-slate-800 font-semibold">{record.orderedLabTests.join(', ')}</span>
              </div>
            )}

            {record.followUpDate && (
              <div className="pt-1 text-slate-800 font-medium">
                Next Follow-Up Recommended: <strong className="text-teal-800">{record.followUpDate}</strong>
              </div>
            )}
          </div>

          {/* Doctor Signature Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
            <div className="text-[10.5px] text-slate-400">
              <p>Electronically verified via CarePlus EHR Hospital Platform</p>
              <p>Tamper-proof medical audit trail • Reg ID: #DEL-DOC-{record.doctorId}</p>
            </div>

            <div className="text-right sm:min-w-[180px]">
              <div className="font-serif italic text-teal-800 font-bold text-sm">
                Dr. {record.doctorName.replace('Dr. ', '')}
              </div>
              <div className="border-t border-slate-300 pt-0.5 text-[11px] font-bold text-slate-900">
                {record.doctorName}
              </div>
              <div className="text-[10px] text-slate-500">Treating Specialist Consultant</div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 print:hidden rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Prescription & Case Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
