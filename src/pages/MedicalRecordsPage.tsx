import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClinicData } from '../context/ClinicDataContext';
import { 
  FileText, 
  Printer, 
  Search, 
  Calendar, 
  Clock, 
  Pill, 
  Activity, 
  Stethoscope, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  User,
  Heart,
  CheckCircle2,
  Download,
  ClipboardList
} from 'lucide-react';
import { MedicalRecordEntry, SyntheticPatient } from '../types/management';
import { PrintableMedicalRecordModal } from '../components/PrintableMedicalRecordModal';
import { PrintableMedicalHistoryModal } from '../components/PrintableMedicalHistoryModal';
import { printMedicalRecordDocument, printMedicalHistoryDocument } from '../utils/printUtils';

export const MedicalRecordsPage: React.FC = () => {
  const { patients, medicalRecords } = useClinicData();

  // Search by phone, name, or MRN
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'pat-1001');
  const [filterCategory, setFilterCategory] = useState<'all' | 'prescriptions' | 'vitals'>('all');

  // Print Modals State
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState<MedicalRecordEntry | null>(null);
  const [isPrintRecordModalOpen, setIsPrintRecordModalOpen] = useState(false);
  const [isPrintHistoryModalOpen, setIsPrintHistoryModalOpen] = useState(false);

  // Active patient
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Records for this patient
  const patientRecords = medicalRecords.filter(m => m.patientId === activePatient?.id);

  // Filtered patients for search
  const matchingPatients = searchQuery.trim() === '' 
    ? patients.slice(0, 6) 
    : patients.filter(p => 
        p.phone.includes(searchQuery) ||
        p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleOpenPrintRecord = (record: MedicalRecordEntry) => {
    setSelectedRecordForPrint(record);
    setIsPrintRecordModalOpen(true);
  };

  const handleDirectPrintRecord = (record: MedicalRecordEntry) => {
    if (activePatient) {
      printMedicalRecordDocument(record, activePatient);
    }
  };

  const handleOpenPrintHistory = () => {
    setIsPrintHistoryModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Top Switcher Tabs: Appointments vs Medical Records */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <Link
            to="/my-bookings"
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Appointments & Passes</span>
          </Link>
          <div className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-white text-teal-800 rounded-lg shadow-xs flex items-center justify-center gap-1.5 border border-slate-200/80">
            <FileText className="w-3.5 h-3.5 text-teal-700" />
            <span>Medical Records & Rx</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {activePatient && patientRecords.length > 0 && (
            <button
              onClick={handleOpenPrintHistory}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-teal-400"
            >
              <Printer className="w-3.5 h-3.5 text-teal-700" />
              <span>Print Full Medical History</span>
            </button>
          )}

          <Link
            to="/book"
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-center shadow-xs"
          >
            + Book Consultation
          </Link>
        </div>
      </div>

      {/* Hero Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-800 text-xs font-bold rounded-full border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          Patient Electronic Health Dossier
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
          Medical Records & e-Prescriptions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Access verified OPD case sheets, diagnosis assessments, prescribed medications, and clinical vitals history with one-click print capability.
        </p>
      </div>

      {/* Patient Search & Quick Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-80 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Patient Name, Phone or MRN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-800 focus:outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">
              Profiles:
            </span>
            {matchingPatients.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPatientId === p.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.firstName} {p.lastName}
              </button>
            ))}
          </div>
        </div>

        {/* Active Patient Dossier Card */}
        {activePatient && (
          <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs bg-slate-50/60 p-3.5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                {activePatient.firstName[0]}{activePatient.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 font-bold text-sm">
                    {activePatient.firstName} {activePatient.lastName}
                  </strong>
                  <span className="px-2 py-0.5 rounded bg-slate-200/80 font-mono text-[10px] text-slate-700 font-bold">
                    {activePatient.mrn}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  {activePatient.age} Yrs &bull; {activePatient.gender} &bull; Blood: <strong className="text-slate-800">{activePatient.bloodGroup}</strong> &bull; {activePatient.phone}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                <span>Allergies: {activePatient.allergies.join(', ') || 'None'}</span>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-800 font-medium">
                Conditions: {activePatient.chronicConditions.slice(0, 2).join(', ') || 'None Reported'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Consultations ({patientRecords.length})
          </button>
          <button
            onClick={() => setFilterCategory('prescriptions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterCategory === 'prescriptions'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Prescriptions (Rx)
          </button>
          <button
            onClick={() => setFilterCategory('vitals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterCategory === 'vitals'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Vitals & Triage
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Showing {patientRecords.length} record{patientRecords.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Records Listing */}
      <div className="space-y-4">
        {patientRecords.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Clinical Records On File</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No previous outpatient consultations or prescriptions have been saved for this patient profile.
            </p>
            <Link
              to="/book"
              className="inline-flex px-5 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800"
            >
              Book an Appointment
            </Link>
          </div>
        ) : (
          patientRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-teal-300 transition-all space-y-4"
            >
              {/* Record Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                      Outpatient Case Record
                    </span>
                    <span className="text-xs text-slate-400 font-mono">&bull; {record.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {record.chiefComplaint}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Consulted <strong>{record.doctorName}</strong></span>
                    <span>&bull;</span>
                    <span className="text-teal-700 font-medium">Visit Date: {record.visitDate}</span>
                  </p>
                </div>

                {/* Print Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenPrintRecord(record)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Preview & Print Case Sheet"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-700" />
                    <span>Print Record</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectPrintRecord(record)}
                    className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                    title="Quick Print Pass"
                    aria-label="Quick Print Record"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Vitals Summary Strip */}
              {record.vitals && (
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">BP</span>
                    <span className="font-bold text-slate-800">{record.vitals.bloodPressureSys}/{record.vitals.bloodPressureDia}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Pulse</span>
                    <span className="font-bold text-slate-800">{record.vitals.heartRateBpm} bpm</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">SpO2</span>
                    <span className="font-bold text-emerald-700">{record.vitals.oxygenSaturationSpO2}%</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Temp</span>
                    <span className="font-bold text-slate-800">{record.vitals.temperatureF}°F</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Resp</span>
                    <span className="font-bold text-slate-800">{record.vitals.respiratoryRate}/m</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Weight</span>
                    <span className="font-bold text-slate-800">{record.vitals.weightKg} kg</span>
                  </div>
                </div>
              )}

              {/* Assessment & SOAP notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase">
                    Clinical Examination & Findings:
                  </span>
                  <p className="text-slate-600 italic leading-relaxed text-[11.5px]">
                    {record.soapNotes.objective}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase">
                    Treatment & Rehabilitation Plan:
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {record.soapNotes.plan}
                  </p>
                </div>
              </div>

              {/* ICD-10 Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Diagnosis:</span>
                {record.icd10Diagnosis.map((icd) => (
                  <span
                    key={icd.code}
                    className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[10.5px] font-mono font-medium"
                  >
                    {icd.code}: {icd.description}
                  </span>
                ))}
              </div>

              {/* Prescriptions Block */}
              {record.prescriptions && record.prescriptions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prescriptions ({record.prescriptions.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {record.prescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="p-2.5 bg-emerald-50/40 border border-emerald-200/80 rounded-xl flex justify-between items-start"
                      >
                        <div>
                          <strong className="text-slate-900 font-bold block">{rx.medicineName}</strong>
                          <span className="text-slate-600 text-[11px] block mt-0.5">
                            {rx.frequency} &bull; {rx.duration}
                          </span>
                          <span className="text-[10.5px] text-slate-500 italic block">{rx.instructions}</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {rx.dosage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Footer Details */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                {record.followUpDate && (
                  <span>
                    Next Recommended Follow-Up: <strong className="text-teal-700">{record.followUpDate}</strong>
                  </span>
                )}
                <span className="text-[11px] text-slate-400">
                  CarePlus Hospital Digital EHR System
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Print Modals */}
      <PrintableMedicalRecordModal
        isOpen={isPrintRecordModalOpen}
        onClose={() => setIsPrintRecordModalOpen(false)}
        record={selectedRecordForPrint}
        patient={activePatient}
      />

      <PrintableMedicalHistoryModal
        isOpen={isPrintHistoryModalOpen}
        onClose={() => setIsPrintHistoryModalOpen(false)}
        patient={activePatient}
        records={patientRecords}
      />
    </div>
  );
};
