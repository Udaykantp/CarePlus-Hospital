import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { AppointmentRecord, MedicalRecordEntry, SyntheticPatient } from '../../types/management';
import { ICD10_CATALOG } from '../../data/mockManagementData';
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Video, 
  FileText, 
  Pill, 
  FlaskConical, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  ShieldAlert,
  ArrowRight,
  Activity,
  Heart,
  Thermometer,
  Mic,
  Camera,
  X
} from 'lucide-react';

export const DoctorPanel: React.FC = () => {
  const { currentUser, currentTenant } = useAuth();
  const { 
    appointments, 
    patients, 
    medicalRecords, 
    inventory, 
    updateAppointmentStatus, 
    addMedicalRecord, 
    addLabOrder,
    dispensePrescription
  } = useClinicData();

  // Active appointment being consulted
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(
    appointments.find(a => a.status === 'In Consultation' || a.status === 'Checked In') || appointments[0] || null
  );

  // Active view mode: queue or consultation room
  const [isConsulting, setIsConsulting] = useState(false);
  const [isVideoRoomOpen, setIsVideoRoomOpen] = useState(false);

  // Consultation Form State
  const [soapSubjective, setSoapSubjective] = useState('');
  const [soapObjective, setSoapObjective] = useState('');
  const [soapAssessment, setSoapAssessment] = useState('');
  const [soapPlan, setSoapPlan] = useState('');
  const [selectedIcdList, setSelectedIcdList] = useState<{ code: string; description: string }[]>([]);
  const [icdSearchTerm, setIcdSearchTerm] = useState('');

  // Prescriptions state
  const [prescriptions, setPrescriptions] = useState<{
    medicineName: string;
    dosage: string;
    form: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[]>([
    {
      medicineName: 'Aceclofenac + Paracetamol + Thiocolchicoside (Aceclo-MR)',
      dosage: '100mg/325mg/4mg',
      form: 'Tablet',
      frequency: '1-0-1 (Twice daily after meals)',
      duration: '5 days',
      instructions: 'Take after meals.'
    }
  ]);

  // Lab orders state
  const [labTestsToOrder, setLabTestsToOrder] = useState<string[]>([]);
  const [labOrderInput, setLabOrderInput] = useState('');

  // Vitals form
  const [vitals, setVitals] = useState({
    bpSys: 120,
    bpDia: 80,
    pulse: 74,
    temp: 98.4,
    spO2: 99,
    weight: 70
  });

  // Selected patient details
  const selectedPatient = selectedAppointment 
    ? patients.find(p => p.id === selectedAppointment.patientId)
    : null;

  // Past EMR records for this patient
  const patientPastRecords = selectedPatient
    ? medicalRecords.filter(m => m.patientId === selectedPatient.id)
    : [];

  const handleStartConsultation = (apt: AppointmentRecord) => {
    setSelectedAppointment(apt);
    updateAppointmentStatus(apt.id, 'In Consultation');
    setIsConsulting(true);

    // Populate initial chief complaint
    setSoapSubjective(`Patient presents with: ${apt.chiefComplaint}`);
    setSoapObjective('Patient conscious, oriented, ambulant. Systemic examination underway.');
    setSoapAssessment('');
    setSoapPlan('Physiotherapy modalities, home exercise protocol, and pharmacotherapy.');
  };

  const handleAddIcd = (icd: { code: string; description: string }) => {
    if (!selectedIcdList.some(item => item.code === icd.code)) {
      setSelectedIcdList([...selectedIcdList, icd]);
      setIcdSearchTerm('');
    }
  };

  const handleRemoveIcd = (code: string) => {
    setSelectedIcdList(selectedIcdList.filter(i => i.code !== code));
  };

  const handleAddPrescriptionRow = () => {
    setPrescriptions([
      ...prescriptions,
      {
        medicineName: '',
        dosage: '',
        form: 'Tablet',
        frequency: '1-0-1',
        duration: '5 days',
        instructions: 'Take after meals'
      }
    ]);
  };

  const handleRemovePrescriptionRow = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const handleAddLabTest = () => {
    if (labOrderInput.trim() && !labTestsToOrder.includes(labOrderInput.trim())) {
      setLabTestsToOrder([...labTestsToOrder, labOrderInput.trim()]);
      setLabOrderInput('');
    }
  };

  const handleSaveConsultation = () => {
    if (!selectedAppointment || !selectedPatient) return;

    // 1. Save EMR Record
    const savedRec = addMedicalRecord({
      patientId: selectedPatient.id,
      doctorId: currentUser?.id || 'dr-mehak-arora',
      doctorName: currentUser?.name || 'Dr. Mehak Arora (PT)',
      appointmentId: selectedAppointment.id,
      visitDate: new Date().toISOString().split('T')[0],
      chiefComplaint: selectedAppointment.chiefComplaint,
      soapNotes: {
        subjective: soapSubjective,
        objective: soapObjective,
        assessment: soapAssessment || 'Clinical evaluation completed.',
        plan: soapPlan
      },
      icd10Diagnosis: selectedIcdList,
      vitals: {
        bloodPressureSys: vitals.bpSys,
        bloodPressureDia: vitals.bpDia,
        heartRateBpm: vitals.pulse,
        temperatureF: vitals.temp,
        oxygenSaturationSpO2: vitals.spO2,
        respiratoryRate: 16,
        weightKg: vitals.weight,
        heightCm: 172,
        bmi: 23.6
      },
      prescriptions: prescriptions.map((p, idx) => ({
        id: `rx-gen-${Date.now()}-${idx}`,
        medicineName: p.medicineName,
        dosage: p.dosage,
        form: (p.form as any) || 'Tablet',
        frequency: p.frequency,
        duration: p.duration,
        instructions: p.instructions,
        dispensedStatus: 'Pending'
      })),
      orderedLabTests: labTestsToOrder,
      documents: [],
      followUpDate: '2026-09-28'
    });

    // 2. If lab tests ordered, dispatch lab orders
    labTestsToOrder.forEach(testName => {
      addLabOrder({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        doctorId: currentUser?.id || 'dr-mehak-arora',
        doctorName: currentUser?.name || 'Dr. Mehak Arora (PT)',
        testName,
        category: 'Biochemistry',
        sampleType: 'Whole Blood / Venous Specimen',
        sampleStatus: 'Sample Pending',
        criticalFlag: false,
        results: []
      });
    });

    // 3. Mark appointment as completed
    updateAppointmentStatus(selectedAppointment.id, 'Completed');
    setIsConsulting(false);
  };

  return (
    <div className="space-y-6">
      {/* Clinician Header matching CarePlus portal layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Medical Records & Doctor OPD Workstation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as {currentUser?.name || 'Dr. Mehak Arora (PT)'} &bull; Electronic Health Records (EHR), SOAP note documentation, and e-Prescribing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            {appointments.filter(a => a.status === 'Checked In').length} Patients Waiting
          </span>
          <button
            onClick={() => setIsVideoRoomOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Telemedicine Room</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching CarePlus portal style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Waiting Outside</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {appointments.filter(a => a.status === 'Checked In').length}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Checked-in tokens</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">In Consultation</span>
          <div className="text-2xl font-extrabold mt-1 text-amber-600 font-heading">
            {appointments.filter(a => a.status === 'In Consultation').length}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">Active inside room</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Completed Today</span>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 font-heading">
            {appointments.filter(a => a.status === 'Completed').length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Discharged OPD cases</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Upcoming Schedule</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {appointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed').length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">Remaining in OPD shift</span>
        </div>
      </div>

      {/* Main Grid: Left Side Queue, Right Side Consultation Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: OPD QUEUE (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Today's OPD Queue ({appointments.length})</span>
            </h3>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {appointments.map((apt) => {
              const isSelected = selectedAppointment?.id === apt.id;
              const pat = patients.find(p => p.id === apt.patientId);

              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                          {apt.tokenNumber || '—'}
                        </span>
                        <strong className="text-slate-900 font-bold">{apt.patientName}</strong>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{apt.timeSlot}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      apt.status === 'In Consultation'
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : apt.status === 'Checked In'
                        ? 'bg-blue-100 text-blue-900'
                        : apt.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-1 italic">
                    "{apt.chiefComplaint}"
                  </p>

                  {/* Red Allergy Tag if patient has allergies */}
                  {pat && pat.allergies && pat.allergies.length > 0 && !pat.allergies.includes('None Known (NKDA)') && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                      <span>Allergies: {pat.allergies.join(', ')}</span>
                    </div>
                  )}

                  {apt.status !== 'Completed' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartConsultation(apt);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Start Consultation</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: CONSULTATION & EMR WORKSTATION (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPatient && selectedAppointment ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Patient Banner */}
              <div className="bg-slate-900 text-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h2>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs">
                        {selectedPatient.mrn}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-teal-900/80 text-teal-300 text-xs font-bold">
                        {selectedPatient.bloodGroup}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedPatient.age} yrs &bull; {selectedPatient.gender} &bull; Phone: {selectedPatient.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Chief Complaint</span>
                    <span className="text-xs font-semibold text-amber-300">{selectedAppointment.chiefComplaint}</span>
                  </div>
                </div>

                {/* Patient Safety Flags (Allergies & Chronic Diseases) */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px]">
                  {selectedPatient.allergies.length > 0 && !selectedPatient.allergies.includes('None Known (NKDA)') ? (
                    <div className="px-2 py-0.5 rounded bg-red-900/80 text-red-200 border border-red-700 flex items-center gap-1 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span>ALLERGIC: {selectedPatient.allergies.join(', ')}</span>
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      No known drug allergies (NKDA)
                    </div>
                  )}

                  {selectedPatient.chronicConditions.map((cc, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {cc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Consultation Body */}
              <div className="p-5 space-y-5">
                {/* Vitals Ribbon */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
                    Current Clinical Vitals:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">BP (mmHg)</span>
                      <input
                        type="text"
                        value={`${vitals.bpSys}/${vitals.bpDia}`}
                        onChange={(e) => {
                          const [s, d] = e.target.value.split('/');
                          setVitals({ ...vitals, bpSys: Number(s) || 120, bpDia: Number(d) || 80 });
                        }}
                        className="w-full font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pulse (bpm)</span>
                      <input
                        type="number"
                        value={vitals.pulse}
                        onChange={(e) => setVitals({ ...vitals, pulse: Number(e.target.value) })}
                        className="w-full font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Temp (°F)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={vitals.temp}
                        onChange={(e) => setVitals({ ...vitals, temp: Number(e.target.value) })}
                        className="w-full font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">SpO2 (%)</span>
                      <input
                        type="number"
                        value={vitals.spO2}
                        onChange={(e) => setVitals({ ...vitals, spO2: Number(e.target.value) })}
                        className="w-full font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Weight (kg)</span>
                      <input
                        type="number"
                        value={vitals.weight}
                        onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
                        className="w-full font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">BMI</span>
                      <span className="font-bold text-slate-800 block mt-1">23.6 Normal</span>
                    </div>
                  </div>
                </div>

                {/* SOAP NOTES SECTION */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Clinical SOAP Documentation (HIPAA Standard)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        S - Subjective (Patient Narrative & History)
                      </label>
                      <textarea
                        rows={3}
                        value={soapSubjective}
                        onChange={(e) => setSoapSubjective(e.target.value)}
                        placeholder="Patient symptoms, duration, aggravating factors..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        O - Objective (Physical Findings & Tests)
                      </label>
                      <textarea
                        rows={3}
                        value={soapObjective}
                        onChange={(e) => setSoapObjective(e.target.value)}
                        placeholder="Palpation, Range of Motion, auscultation, gait..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        A - Assessment & Clinical Impression
                      </label>
                      <textarea
                        rows={3}
                        value={soapAssessment}
                        onChange={(e) => setSoapAssessment(e.target.value)}
                        placeholder="Differential diagnosis, severity grade..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        P - Plan & Patient Instructions
                      </label>
                      <textarea
                        rows={3}
                        value={soapPlan}
                        onChange={(e) => setSoapPlan(e.target.value)}
                        placeholder="Rehab exercises, ergonomics, follow up..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* ICD-10 DIAGNOSIS PICKER */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      ICD-10 Clinical Coding Diagnosis
                    </span>
                    <span className="text-[10px] text-slate-500">WHO Standardized</span>
                  </div>

                  {/* Selected ICD tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIcdList.length === 0 ? (
                      <span className="text-slate-400 text-xs italic">No ICD-10 codes added yet. Search or click below:</span>
                    ) : (
                      selectedIcdList.map((icd) => (
                        <span
                          key={icd.code}
                          className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-medium flex items-center gap-1.5"
                        >
                          <strong className="font-mono">{icd.code}:</strong> {icd.description}
                          <button
                            type="button"
                            onClick={() => handleRemoveIcd(icd.code)}
                            className="hover:text-red-600 ml-1 font-bold"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* ICD search dropdown */}
                  <div className="relative pt-1">
                    <input
                      type="text"
                      placeholder="Type to search ICD-10 codes (e.g. back pain, diabetes, sciatica)..."
                      value={icdSearchTerm}
                      onChange={(e) => setIcdSearchTerm(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    {icdSearchTerm && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-20">
                        {ICD10_CATALOG.filter(c =>
                          c.code.toLowerCase().includes(icdSearchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(icdSearchTerm.toLowerCase())
                        ).map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleAddIcd(c)}
                            className="w-full text-left p-2 hover:bg-slate-50 text-xs flex justify-between"
                          >
                            <span>{c.description}</span>
                            <span className="font-mono font-bold text-blue-600">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* E-PRESCRIPTION BUILDER */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-emerald-600" />
                      <span>Electronic Prescription (e-Rx)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddPrescriptionRow}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded-lg font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Medicine</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {prescriptions.map((p, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Medicine Name & Formulation</label>
                            <input
                              type="text"
                              value={p.medicineName}
                              onChange={(e) => {
                                const copy = [...prescriptions];
                                copy[idx].medicineName = e.target.value;
                                setPrescriptions(copy);
                              }}
                              placeholder="e.g. Aceclofenac + Paracetamol"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Dosage / Strength</label>
                            <input
                              type="text"
                              value={p.dosage}
                              onChange={(e) => {
                                const copy = [...prescriptions];
                                copy[idx].dosage = e.target.value;
                                setPrescriptions(copy);
                              }}
                              placeholder="e.g. 100mg / 325mg"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Frequency</label>
                            <input
                              type="text"
                              value={p.frequency}
                              onChange={(e) => {
                                const copy = [...prescriptions];
                                copy[idx].frequency = e.target.value;
                                setPrescriptions(copy);
                              }}
                              placeholder="1-0-1 (BD)"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Duration</label>
                            <input
                              type="text"
                              value={p.duration}
                              onChange={(e) => {
                                const copy = [...prescriptions];
                                copy[idx].duration = e.target.value;
                                setPrescriptions(copy);
                              }}
                              placeholder="5 days"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemovePrescriptionRow(idx)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Remove medication"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LAB TEST REQUISITION */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-purple-600" />
                    <span>Order Diagnostic Lab Tests</span>
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter investigation name (e.g. CBC, HbA1c, Vitamin D3, Lumbar MRI)..."
                      value={labOrderInput}
                      onChange={(e) => setLabOrderInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLabTest(); } }}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddLabTest}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                    >
                      Add Test
                    </button>
                  </div>

                  {labTestsToOrder.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {labTestsToOrder.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-medium flex items-center gap-1.5">
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => setLabTestsToOrder(labTestsToOrder.filter((_, idx) => idx !== i))}
                            className="font-bold text-purple-800 hover:text-red-600"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTION BAR: COMPLETE CONSULTATION */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Prescription & Lab orders will automatically route to Pharmacy and Laboratory.</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveConsultation}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Complete & Dispatch Consultation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No Patient Selected</h3>
              <p className="text-xs max-w-sm mx-auto">
                Select a patient from the OPD Queue on the left to review medical history and launch clinical documentation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: TELEMEDICINE VIDEO ROOM */}
      {isVideoRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-sm font-bold">Secure Telemedicine Video Room (WebRTC Preview)</h3>
              </div>
              <button onClick={() => setIsVideoRoomOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
                  <Camera className="w-8 h-8" />
                </div>
                <h4 className="text-xs font-bold text-slate-300">Encrypted P2P Video Call Feed</h4>
                <p className="text-[11px] text-slate-500">Connected with Patient: {selectedPatient?.firstName || 'Amitabh Sen'}</p>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-200">
                  <Mic className="w-4 h-4" />
                </button>
                <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-200">
                  <Camera className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsVideoRoomOpen(false)} 
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-full text-xs font-bold"
                >
                  End Call
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Telemedicine link: <code className="text-blue-400">https://meet.careplus.demo/room-live</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
