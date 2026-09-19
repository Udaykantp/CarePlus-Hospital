import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { PrintableReceiptModal } from './PrintableReceiptModal';
import { PrintableLabReportModal } from './PrintableLabReportModal';
import { 
  User, 
  Calendar, 
  FileText, 
  Receipt, 
  FlaskConical, 
  Pill, 
  Download, 
  Printer, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Phone, 
  PlusCircle, 
  AlertCircle,
  Activity,
  TrendingUp
} from 'lucide-react';
import { BillingInvoice, LabOrder, MedicalRecordEntry, AppointmentRecord } from '../../types/management';
import { AppointmentBooking } from '../../types';
import { PrintableMedicalRecordModal } from '../PrintableMedicalRecordModal';
import { PrintableMedicalHistoryModal } from '../PrintableMedicalHistoryModal';
import { PrintableAppointmentPassModal } from '../PrintableAppointmentPassModal';
import { printMedicalRecordDocument, printMedicalHistoryDocument, printAppointmentPassDocument } from '../../utils/printUtils';
import { HealthTrendsVisualization } from '../HealthTrendsVisualization';

export const PatientPortal: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const { 
    patients, 
    appointments, 
    medicalRecords, 
    invoices, 
    labOrders,
    nurseLogs,
    recordPayment,
    addAppointment
  } = useClinicData();

  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'appointments' | 'records' | 'labs' | 'billing' | 'book'>('overview');

  // Print modals
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<LabOrder | null>(null);
  const [isLabReportOpen, setIsLabReportOpen] = useState(false);

  // EMR & Appointment Print Modals
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState<MedicalRecordEntry | null>(null);
  const [isPrintRecordOpen, setIsPrintRecordOpen] = useState(false);
  const [isPrintHistoryOpen, setIsPrintHistoryOpen] = useState(false);
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<AppointmentBooking | null>(null);
  const [isPrintPassOpen, setIsPrintPassOpen] = useState(false);

  // Self booking form
  const [bookForm, setBookForm] = useState({
    doctorId: 'dr-mehak-arora',
    doctorName: 'Dr. Mehak Arora (PT)',
    department: 'Physiotherapy & Spine Rehabilitation',
    date: '2026-09-22',
    timeSlot: '04:00 PM - 04:30 PM',
    type: 'In-Clinic' as const,
    chiefComplaint: 'Follow up assessment for lumbar stiffness'
  });

  // Current patient identification:
  // Lookup by email, patientId, or fallback to first patient in list
  const currentPatient = patients.find(p => p.email === currentUser?.email || p.id === (currentUser as any)?.patientId) || patients[0];

  if (!currentPatient) {
    return (
      <div className="p-8 text-center text-slate-500">
        No patient records available in current clinic.
      </div>
    );
  }

  const patientAppointments = appointments.filter(a => a.patientId === currentPatient.id);
  const patientRecords = medicalRecords.filter(m => m.patientId === currentPatient.id);
  const patientInvoices = invoices.filter(i => i.patientId === currentPatient.id);
  const patientLabs = labOrders.filter(l => l.patientId === currentPatient.id);

  const handleSelfBook = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      patientId: currentPatient.id,
      patientName: `${currentPatient.firstName} ${currentPatient.lastName}`,
      patientPhone: currentPatient.phone,
      doctorId: bookForm.doctorId,
      doctorName: bookForm.doctorName,
      department: bookForm.department,
      date: bookForm.date,
      timeSlot: bookForm.timeSlot,
      type: bookForm.type,
      chiefComplaint: bookForm.chiefComplaint,
      status: 'Scheduled',
      tokenNumber: appointments.length + 1,
      priority: 'Routine',
      billingStatus: 'Unbilled',
      fee: 800
    });
    setActiveTab('appointments');
  };

  const handlePayBill = (inv: BillingInvoice) => {
    recordPayment(inv.id, inv.balanceDue, 'UPI / QR');
    alert(`Payment of ₹${inv.balanceDue} confirmed via UPI. Receipt updated.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-sky-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-blue-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-bold uppercase tracking-wider">
                Personal Health Portal
              </span>
              <span className="text-slate-400 text-xs font-mono">
                {currentTenant.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Welcome, {currentPatient.firstName} {currentPatient.lastName}
            </h1>
            <p className="text-sky-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Access your verified electronic medical records, laboratory diagnostic results, prescriptions, and invoices 24/7.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('book')}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Patient Demographic Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-sky-800/50 text-xs">
          <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-700/30">
            <span className="text-sky-300 text-[11px] block">Patient MRN</span>
            <div className="text-base font-mono font-bold mt-0.5 text-white">{currentPatient.mrn}</div>
          </div>
          <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-700/30">
            <span className="text-sky-300 text-[11px] block">Blood Group</span>
            <div className="text-base font-bold mt-0.5 text-teal-300">{currentPatient.bloodGroup}</div>
          </div>
          <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-700/30">
            <span className="text-sky-300 text-[11px] block">Known Allergies</span>
            <div className="text-base font-bold mt-0.5 text-amber-300">
              {currentPatient.allergies.join(', ') || 'None Reported'}
            </div>
          </div>
          <div className="bg-sky-950/60 p-3 rounded-2xl border border-sky-700/30">
            <span className="text-sky-300 text-[11px] block">Emergency Contact</span>
            <div className="text-base font-bold mt-0.5 text-white">{currentPatient.emergencyContact.phone}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Health Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'trends'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-teal-600" />
          <span>Health Trends & Vitals</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'appointments'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Consultations ({patientAppointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'records'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>EMR Records & e-Prescriptions ({patientRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('labs')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'labs'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Diagnostic Reports ({patientLabs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'billing'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoices & Receipts ({patientInvoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('book')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'book'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Active Appointments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Upcoming Scheduled Visits</span>
            </h3>

            {patientAppointments.filter(a => a.status !== 'Completed').length === 0 ? (
              <p className="text-slate-500 italic">No upcoming consultations scheduled.</p>
            ) : (
              <div className="space-y-2">
                {patientAppointments.filter(a => a.status !== 'Completed').map(apt => (
                  <div key={apt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-slate-900 font-bold block">{apt.doctorName}</strong>
                        <span className="text-slate-500 text-[11px]">{apt.department}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-900">
                        {apt.status}
                      </span>
                    </div>
                    <div className="mt-2 text-slate-600 flex items-center gap-3">
                      <span>Date: <strong>{apt.date}</strong></span>
                      <span>Time: <strong>{apt.timeSlot}</strong></span>
                      {apt.tokenNumber && <span>Token: <strong>#{apt.tokenNumber}</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Prescriptions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Current Prescribed Medications</span>
            </h3>

            {patientRecords.length === 0 ? (
              <p className="text-slate-500 italic">No active prescriptions on file.</p>
            ) : (
              <div className="space-y-2">
                {patientRecords[0].prescriptions.map(rx => (
                  <div key={rx.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 font-bold">{rx.medicineName}</strong>
                      <span className="text-xs font-semibold text-emerald-700">{rx.dosage}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      {rx.frequency} &bull; {rx.duration} &bull; {rx.instructions}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Longitudinal Health Trends Section within Overview */}
          <div className="md:col-span-2">
            <HealthTrendsVisualization
              patient={currentPatient}
              medicalRecords={patientRecords}
              nurseLogs={nurseLogs}
              showAddVitalButton={true}
              compactMode={false}
              title="Vitals & Health Trends (Blood Pressure, Glucose, Pulse)"
            />
          </div>
        </div>
      )}

      {/* TAB: HEALTH TRENDS & VITALS BIOMETRICS */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <HealthTrendsVisualization
            patient={currentPatient}
            medicalRecords={patientRecords}
            nurseLogs={nurseLogs}
            showAddVitalButton={true}
            compactMode={false}
          />
        </div>
      )}

      {/* TAB 2: CONSULTATIONS */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">All Consultation Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Ref #</th>
                  <th className="py-2.5 px-3">Doctor & Specialty</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patientAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold">{apt.referenceNumber}</td>
                    <td className="py-2.5 px-3">
                      <strong className="text-slate-900 block font-bold">{apt.doctorName}</strong>
                      <span className="text-slate-500 text-[11px]">{apt.department}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {apt.date} &bull; {apt.timeSlot}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold">
                        {apt.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-900">
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          const b: AppointmentBooking = {
                            id: apt.id,
                            referenceCode: apt.referenceNumber,
                            patientName: apt.patientName,
                            patientAge: currentPatient.age,
                            patientGender: currentPatient.gender,
                            patientPhone: apt.patientPhone,
                            patientEmail: currentPatient.email,
                            doctorId: apt.doctorId,
                            doctorName: apt.doctorName,
                            departmentId: 'general-dept',
                            departmentName: apt.department,
                            date: apt.date,
                            timeSlot: apt.timeSlot,
                            consultationType: apt.type === 'Home Visit' 
                              ? 'Home Physiotherapy Visit' 
                              : apt.type === 'Online Video' 
                              ? 'Online Video Consultation' 
                              : 'In-Clinic Consultation',
                            symptoms: apt.chiefComplaint,
                            status: apt.status === 'Cancelled' ? 'cancelled' : 'confirmed',
                            paymentMode: 'Pay at Clinic',
                            fee: apt.fee,
                            bookedAt: new Date().toISOString()
                          };
                          setSelectedBookingForPass(b);
                          setIsPrintPassOpen(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Print Confirmation Pass"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Pass</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EMR RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Clinical Outpatient Records & Prescriptions</h3>
              <p className="text-slate-500 text-[11px]">All physician examination notes, diagnoses, and treatments on file.</p>
            </div>
            {patientRecords.length > 0 && (
              <button
                onClick={() => setIsPrintHistoryOpen(true)}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Complete Medical History</span>
              </button>
            )}
          </div>

          {patientRecords.map(rec => (
            <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rec.chiefComplaint}</h4>
                  <p className="text-slate-500 text-[11px]">Visited {rec.doctorName} on {rec.visitDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {rec.icd10Diagnosis.map(icd => (
                      <span key={icd.code} className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[10px]">
                        {icd.code}: {icd.description}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRecordForPrint(rec);
                      setIsPrintRecordOpen(true);
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Print Case Sheet / Rx"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Record</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">Clinical Examination (Objective):</span>
                  <p className="text-slate-600 italic">{rec.soapNotes.objective}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">Treatment Plan & Rehabilitation:</span>
                  <p className="text-slate-600">{rec.soapNotes.plan}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-2">Prescribed Medicines:</span>
                <div className="space-y-1">
                  {rec.prescriptions.map(rx => (
                    <div key={rx.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                      <strong className="text-slate-900">{rx.medicineName} ({rx.dosage})</strong>
                      <span className="text-slate-600">{rx.frequency} &bull; {rx.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: LABS */}
      {activeTab === 'labs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Diagnostic Laboratory Reports</h3>
          <div className="space-y-3">
            {patientLabs.map(lab => (
              <div key={lab.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <strong className="text-slate-900 font-bold text-sm block">{lab.testName}</strong>
                  <span className="text-slate-500 text-[11px]">
                    Order: {lab.orderNumber} &bull; Ordered by {lab.doctorName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    lab.sampleStatus === 'Result Ready' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {lab.sampleStatus}
                  </span>

                  {lab.sampleStatus === 'Result Ready' && (
                    <button
                      onClick={() => {
                        setSelectedLab(lab);
                        setIsLabReportOpen(true);
                      }}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Report</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BILLING */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Invoices & Financial Receipts</h3>
          <div className="space-y-3">
            {patientInvoices.map(inv => (
              <div key={inv.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold font-mono">{inv.invoiceNumber}</strong>
                    <span className="text-slate-500 text-[11px]">&bull; {inv.date}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Total: ₹{inv.totalAmount} &bull; Paid: ₹{inv.paidAmount} &bull; Due: <strong className="text-amber-800">₹{inv.balanceDue}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                  }`}>
                    {inv.paymentStatus}
                  </span>

                  {inv.balanceDue > 0 && (
                    <button
                      onClick={() => handlePayBill(inv)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Pay Online (UPI)
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedInvoice(inv);
                      setIsReceiptOpen(true);
                    }}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SELF BOOKING */}
      {activeTab === 'book' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Schedule Follow-up or New Visit</h3>

          <form onSubmit={handleSelfBook} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor & Specialty</label>
              <select
                value={bookForm.doctorId}
                onChange={(e) => setBookForm({ ...bookForm, doctorId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="dr-mehak-arora">Dr. Mehak Arora (PT) - Physiotherapy & Spine</option>
                <option value="dr-bibhu-bishwas">Dr. Bibhu Anand Bishwas - General Medicine</option>
                <option value="dr-rohan-krishnan">Dr. Rohan Krishnan - Orthopaedics</option>
                <option value="dr-dhruv-anand">Dr. Dhruv Anand - Chest Medicine</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={bookForm.date}
                  onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mode</label>
                <select
                  value={bookForm.type}
                  onChange={(e) => setBookForm({ ...bookForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="In-Clinic">In-Clinic Consultation</option>
                  <option value="Online Video">Online Telemedicine</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Symptoms or Reason for Visit</label>
              <textarea
                rows={3}
                value={bookForm.chiefComplaint}
                onChange={(e) => setBookForm({ ...bookForm, chiefComplaint: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Confirm Appointment Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRINT MODALS */}
      <PrintableReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        invoice={selectedInvoice}
        tenant={currentTenant}
      />

      <PrintableLabReportModal
        isOpen={isLabReportOpen}
        onClose={() => setIsLabReportOpen(false)}
        order={selectedLab}
        tenant={currentTenant}
      />

      <PrintableMedicalRecordModal
        isOpen={isPrintRecordOpen}
        onClose={() => setIsPrintRecordOpen(false)}
        record={selectedRecordForPrint}
        patient={currentPatient}
      />

      <PrintableMedicalHistoryModal
        isOpen={isPrintHistoryOpen}
        onClose={() => setIsPrintHistoryOpen(false)}
        patient={currentPatient}
        records={patientRecords}
      />

      <PrintableAppointmentPassModal
        isOpen={isPrintPassOpen}
        onClose={() => setIsPrintPassOpen(false)}
        booking={selectedBookingForPass}
      />
    </div>
  );
};
