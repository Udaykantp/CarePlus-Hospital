import React from 'react';
import { MedicalRecordEntry, SyntheticPatient } from '../types/management';
import { CLINIC_INFO } from '../data/clinicData';
import { printMedicalHistoryDocument } from '../utils/printUtils';
import { downloadMedicalHistoryPDF } from '../utils/pdfGenerator';
import { X, Printer, Download, FileText, Calendar, ShieldCheck } from 'lucide-react';

interface PrintableMedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: SyntheticPatient | null;
  records: MedicalRecordEntry[];
}

export const PrintableMedicalHistoryModal: React.FC<PrintableMedicalHistoryModalProps> = ({
  isOpen,
  onClose,
  patient,
  records
}) => {
  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    printMedicalHistoryDocument(patient, records);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Top Action Bar */}
        <div className="sticky top-0 bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between z-10 print:hidden rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Consolidated Clinical Medical History
            </span>
            <span className="text-xs text-slate-400">&bull; MRN: {patient.mrn}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadMedicalHistoryPDF(patient, records)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-xs"
              title="Download Full Medical History PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable History Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-teal-700 pb-5">
            <div>
              <h2 className="text-xl font-black font-heading text-slate-900">
                CarePlus <span className="text-teal-700">Hospital</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                {CLINIC_INFO.address}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Helpline: {CLINIC_INFO.phonePrimary} | Health Records Department
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Comprehensive Patient Health Record
              </span>
              <p className="text-xs text-slate-500 mt-1 font-mono font-bold">MRN: {patient.mrn}</p>
              <p className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Patient Health Dossier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Information</span>
              <strong className="text-sm text-slate-900 block mt-0.5">{patient.firstName} {patient.lastName}</strong>
              <span className="text-slate-600 block mt-0.5">
                {patient.age} Yrs / {patient.gender} &bull; Blood Group: <strong>{patient.bloodGroup}</strong>
              </span>
              <span className="text-slate-600 font-mono text-[11px]">{patient.phone}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Allergies & Warnings</span>
              <span className="text-rose-700 font-bold block mt-1">
                {patient.allergies.join(', ') || 'No Known Drug Allergies'}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-2">Insurance Provider</span>
              <span className="text-slate-700 text-[11px]">{patient.insuranceProvider || 'Direct Cash / Card'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Chronic Conditions</span>
              <div className="mt-1 space-y-0.5 text-slate-700 text-[11px]">
                {patient.chronicConditions.map((c, i) => (
                  <div key={i}>&bull; {c}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Encounters Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-1">
              Recorded Clinical Encounters ({records.length})
            </h3>

            {records.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No past medical consultations on file for this patient.</p>
            ) : (
              records.map((rec, idx) => (
                <div key={rec.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10.5px] font-bold text-teal-700 uppercase">
                        Visit #{records.length - idx} &bull; {rec.visitDate}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{rec.chiefComplaint}</h4>
                      <span className="text-[11px] text-slate-500">Consultant: {rec.doctorName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {rec.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] text-slate-600">
                    <div>
                      <strong className="text-slate-800 block text-[10.5px] uppercase">Examination & Findings:</strong>
                      <p className="italic">{rec.soapNotes.objective}</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[10.5px] uppercase">Assessment & Plan:</strong>
                      <p>{rec.soapNotes.assessment}</p>
                    </div>
                  </div>

                  {rec.prescriptions && rec.prescriptions.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <strong className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                        Prescribed Medications:
                      </strong>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.prescriptions.map((rx) => (
                          <span key={rx.id} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px]">
                            {rx.medicineName} ({rx.dosage}) - {rx.frequency}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 text-center text-[10.5px] text-slate-400">
            CarePlus Hospital Information Management System • Electronic Health Record Dossier
          </div>
        </div>

        {/* Modal Bottom Actions */}
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
            <span>Print Complete History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
