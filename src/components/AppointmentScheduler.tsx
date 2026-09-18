import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  Stethoscope, 
  Activity, 
  ShieldCheck, 
  Printer, 
  Share2, 
  Download, 
  ArrowRight,
  Sparkles,
  MapPin,
  FileText,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DOCTORS, SERVICES, CLINIC_INFO } from '../data/clinicData';
import { Doctor, AppointmentBooking } from '../types';

interface AppointmentSchedulerProps {
  initialDoctorId?: string;
  initialDepartmentId?: string;
  onBookingSuccess: (booking: AppointmentBooking) => void;
  onClose?: () => void;
  isModal?: boolean;
}

// Generate the next 14 available dates (Mon-Sat, Sundays optional or noted)
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isSunday = d.getDay() === 0;
    
    dates.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: dayOfWeek,
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      isSunday,
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }
  return dates;
};

// Available slot templates by shift
const MORNING_SLOTS = [
  { time: "09:30 AM - 10:00 AM", status: "available" },
  { time: "10:15 AM - 10:45 AM", status: "filling-fast" },
  { time: "11:00 AM - 11:30 AM", status: "available" },
  { time: "11:45 AM - 12:15 PM", status: "available" }
];

const AFTERNOON_SLOTS = [
  { time: "12:30 PM - 01:00 PM", status: "available" },
  { time: "01:15 PM - 01:45 PM", status: "few-left" },
  { time: "02:30 PM - 03:00 PM", status: "available" },
  { time: "03:15 PM - 03:45 PM", status: "available" }
];

const EVENING_SLOTS = [
  { time: "04:30 PM - 05:00 PM", status: "available" },
  { time: "05:15 PM - 05:45 PM", status: "filling-fast" },
  { time: "06:00 PM - 06:30 PM", status: "few-left" },
  { time: "06:45 PM - 07:15 PM", status: "available" },
  { time: "07:30 PM - 08:00 PM", status: "available" },
  { time: "08:15 PM - 08:45 PM", status: "available" }
];

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  initialDoctorId,
  initialDepartmentId,
  onBookingSuccess,
  onClose,
  isModal = false
}) => {
  const [step, setStep] = useState<number>(1);
  
  // Step 1: Department & Doctor
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(
    initialDepartmentId || (initialDoctorId ? DOCTORS.find(d => d.id === initialDoctorId)?.departmentId || 'all' : 'all')
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || DOCTORS[0].id
  );

  // Step 2: Date & Slot
  const availableDates = generateAvailableDates();
  // default to tomorrow if today is past clinic time, or today if morning
  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates[0].isSunday ? availableDates[1].dateStr : availableDates[0].dateStr
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:15 AM - 10:45 AM");

  // Step 3: Patient Information
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [consultationType, setConsultationType] = useState<'In-Clinic Consultation' | 'Home Physiotherapy Visit' | 'Online Video Consultation' | 'Follow-up Consultation'>('In-Clinic Consultation');
  const [symptoms, setSymptoms] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Pay at Clinic' | 'Online Prepaid'>('Pay at Clinic');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Step 4: Completed Booking
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);

  // Sync if props change
  useEffect(() => {
    if (initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
      const doc = DOCTORS.find(d => d.id === initialDoctorId);
      if (doc) {
        setSelectedDepartmentId(doc.departmentId);
      }
    } else if (initialDepartmentId) {
      setSelectedDepartmentId(initialDepartmentId);
      const docsInDept = DOCTORS.filter(d => d.departmentId === initialDepartmentId);
      if (docsInDept.length > 0) {
        setSelectedDoctorId(docsInDept[0].id);
      }
    }
  }, [initialDoctorId, initialDepartmentId]);

  // Selected doctor object
  const selectedDoctor = DOCTORS.find(d => d.id === selectedDoctorId) || DOCTORS[0];

  // Filter doctors by selected department
  const filteredDoctors = selectedDepartmentId === 'all' 
    ? DOCTORS 
    : DOCTORS.filter(d => d.departmentId === selectedDepartmentId);

  // When department changes, adjust selected doctor if not in department
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    if (deptId !== 'all') {
      const docs = DOCTORS.filter(d => d.departmentId === deptId);
      if (docs.length > 0 && !docs.some(d => d.id === selectedDoctorId)) {
        setSelectedDoctorId(docs[0].id);
      }
    }
  };

  const validateStep3 = () => {
    const errors: { [key: string]: string } = {};
    if (!patientName.trim() || patientName.trim().length < 3) {
      errors.patientName = 'Please enter patient full name (at least 3 characters)';
    }
    if (!patientPhone.trim() || patientPhone.trim().replace(/[^0-9]/g, '').length < 10) {
      errors.patientPhone = 'Please enter a valid 10-digit mobile number';
    }
    if (patientAge === '' || Number(patientAge) <= 0 || Number(patientAge) > 115) {
      errors.patientAge = 'Please enter a valid age (1-115)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (validateStep3()) {
        finalizeBooking();
      }
    }
  };

  const finalizeBooking = () => {
    const refCode = `HHMC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: AppointmentBooking = {
      id: 'bk-' + Date.now(),
      referenceCode: refCode,
      patientName: patientName.trim(),
      patientAge: Number(patientAge),
      patientGender,
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim() || `${patientName.toLowerCase().replace(/\s+/g, '')}@patient.careplus.demo`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      departmentId: selectedDoctor.departmentId,
      departmentName: selectedDoctor.departmentName,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationType,
      symptoms: symptoms.trim() || 'General specialist consultation and health assessment',
      status: 'confirmed',
      paymentMode,
      fee: selectedDoctor.consultationFee,
      bookedAt: new Date().toISOString()
    };

    setConfirmedBooking(newBooking);
    setStep(4);
    onBookingSuccess(newBooking);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const d = new Date(dateString + 'T00:00:00');
      return d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const resetFormForNew = () => {
    setStep(1);
    setConfirmedBooking(null);
    setPatientName('');
    setPatientAge('');
    setPatientPhone('');
    setSymptoms('');
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden ${isModal ? 'max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto' : ''}`}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 sm:p-6 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close scheduler"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-500/30">
                Official Clinic Booking Portal
              </span>
              <span className="text-xs text-slate-300">
                &bull; Mon - Sat: 9:00 AM - 9:00 PM
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading">
              Patient Appointment Scheduling
            </h2>
            <p className="text-sm text-slate-300 mt-0.5">
              Confirm your consultation slot with senior doctors at Old Rajinder Nagar
            </p>
          </div>
        </div>

        {/* Stepper Tabs */}
        {step < 4 && (
          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-xs">
            <div 
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                step === 1 ? 'bg-teal-600/30 text-teal-200 font-semibold border border-teal-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 1 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>1</div>
              <span className="truncate">Doctor & Specialty</span>
            </div>

            <div 
              onClick={() => { if (step > 2) setStep(2); }}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                step === 2 ? 'bg-teal-600/30 text-teal-200 font-semibold border border-teal-500/40' : 'text-slate-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 2 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>2</div>
              <span className="truncate">Date & Slot</span>
            </div>

            <div 
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                step === 3 ? 'bg-teal-600/30 text-teal-200 font-semibold border border-teal-500/40' : 'text-slate-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 3 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>3</div>
              <span className="truncate">Patient Info</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Form Body */}
      <div className="p-5 sm:p-7">
        {/* ================= STEP 1: DOCTOR & SPECIALTY ================= */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                1. Filter by Medical Specialty / Department
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleDepartmentChange('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedDepartmentId === 'all'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Specialists ({DOCTORS.length})
                </button>
                {SERVICES.map(srv => {
                  const hasDoctor = DOCTORS.some(d => d.departmentId === srv.id);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => handleDepartmentChange(srv.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedDepartmentId === srv.id
                          ? 'bg-teal-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {srv.title.split('&')[0].trim()}
                      {hasDoctor ? '' : ' (OPD)'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2.5">
                2. Select Your Specialist Doctor
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredDoctors.map(doc => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex gap-3.5 relative ${
                        isSelected 
                          ? 'border-teal-600 bg-teal-50/40 shadow-sm ring-2 ring-teal-500/20' 
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <img 
                        src={doc.avatar} 
                        alt={doc.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {doc.name}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-teal-800 font-medium line-clamp-1 mt-0.5">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {doc.qualifications} &bull; {doc.experienceYears}+ Yrs Exp
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                          <span className="text-slate-600">
                            OPD: <strong className="text-slate-900">₹{doc.consultationFee}</strong>
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {doc.timingSummary.split('&')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Doctor Highlights preview */}
            {selectedDoctor && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Selected Doctor</span>
                    <h5 className="text-sm font-bold text-slate-900">{selectedDoctor.name} ({selectedDoctor.departmentName})</h5>
                    <p className="text-xs text-slate-600">Available: {selectedDoctor.availableDays.join(', ')} &bull; {selectedDoctor.timingSummary}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-0.5"
                >
                  <span>Select Date & Slot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: DATE & TIME SLOT ================= */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Selected Doctor Summary */}
            <div className="flex items-center justify-between bg-teal-50/60 p-3.5 rounded-xl border border-teal-200/60">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedDoctor.avatar} 
                  alt={selectedDoctor.name} 
                  className="w-10 h-10 rounded-lg object-cover border border-teal-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedDoctor.name}</h4>
                  <p className="text-xs text-teal-800">{selectedDoctor.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
              >
                Change Doctor
              </button>
            </div>

            {/* Date Picker (Horizontal slider / cards) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-teal-600" />
                  <span>Choose Appointment Date (Next 14 Days)</span>
                </label>
                <span className="text-xs text-slate-500">Sunday on-call & daycare</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {availableDates.map(item => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-500/20'
                          : item.isSunday
                          ? 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30'
                      }`}
                    >
                      <span className={`text-[11px] font-medium uppercase tracking-wider ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {item.dayName}
                      </span>
                      <span className="text-lg font-extrabold my-0.5">
                        {item.dayNumber}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                        {item.monthName}
                      </span>
                      {item.isToday && (
                        <span className="absolute -top-1.5 right-1 bg-amber-500 text-slate-950 font-extrabold text-[8px] px-1 rounded-full uppercase">
                          Today
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Select Consultation Time Slot</span>
                </label>
                <span className="text-xs text-slate-500">
                  Doctor Room: <strong className="text-slate-700">{selectedDoctor.roomNumber}</strong>
                </span>
              </div>

              {/* Shift Groups */}
              <div className="space-y-4">
                {/* Morning */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Morning Shift (09:00 AM - 12:00 PM)</span>
                    <span className="text-[10px] text-teal-700 font-medium">Fresh morning slots</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MORNING_SLOTS.map(slot => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:bg-teal-50/20'
                          }`}
                        >
                          <span>{slot.time.split(' - ')[0]}</span>
                          <span className={`text-[9px] mt-0.5 ${
                            isSelected ? 'text-teal-200' : slot.status === 'filling-fast' ? 'text-amber-600' : 'text-slate-400'
                          }`}>
                            {slot.status === 'filling-fast' ? 'Filling fast' : 'Available'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Afternoon Shift (12:00 PM - 04:00 PM)</span>
                    <span className="text-[10px] text-slate-500">Quiet OPD hours</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AFTERNOON_SLOTS.map(slot => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:bg-teal-50/20'
                          }`}
                        >
                          <span>{slot.time.split(' - ')[0]}</span>
                          <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                            Available
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Evening Shift (04:30 PM - 09:00 PM)</span>
                    <span className="text-[10px] text-amber-700 font-medium">After-work popular slots</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {EVENING_SLOTS.map(slot => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:bg-teal-50/20'
                          }`}
                        >
                          <span>{slot.time.split(' - ')[0]}</span>
                          <span className={`text-[9px] mt-0.5 ${
                            isSelected ? 'text-teal-200' : slot.status === 'few-left' ? 'text-red-500 font-semibold' : 'text-slate-400'
                          }`}>
                            {slot.status === 'few-left' ? 'Few slots' : 'Available'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Step Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:translate-x-0.5"
              >
                <span>Enter Patient Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PATIENT INFORMATION ================= */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Appointment Preview Banner */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-300">Appointment with</p>
                  <p className="font-bold text-sm text-white">{selectedDoctor.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-300">{formatDisplayDate(selectedDate)}</p>
                <p className="font-bold text-teal-300 text-sm">{selectedTimeSlot}</p>
              </div>
            </div>

            {/* Consultation Mode Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Consultation Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                {[
                  {
                    id: 'In-Clinic Consultation',
                    title: 'In-Clinic Visit',
                    desc: 'At Old Rajinder Nagar clinic'
                  },
                  {
                    id: 'Home Physiotherapy Visit',
                    title: 'Home Physio Visit',
                    desc: 'Delhi NCR doorstep therapist'
                  },
                  {
                    id: 'Online Video Consultation',
                    title: 'Online Video OPD',
                    desc: 'Teleconsultation on WhatsApp'
                  },
                  {
                    id: 'Follow-up Consultation',
                    title: 'Follow-up Review',
                    desc: 'Report review within 7 days'
                  }
                ].map(mode => {
                  const isSelected = consultationType === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setConsultationType(mode.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 text-slate-900 ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs">{mode.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{mode.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                      formErrors.patientName ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {formErrors.patientName && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.patientName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (for SMS & WhatsApp Pass) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="e.g. 9811234567"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                      formErrors.patientPhone ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {formErrors.patientPhone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.patientPhone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 38"
                    className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                      formErrors.patientAge ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.patientAge && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.patientAge}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="e.g. patient@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
              </div>
            </div>

            {/* Symptoms & Quick Tags */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Symptoms or Reason for Visit
                </label>
                <span className="text-[11px] text-slate-400">Click quick tags to add</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  "Back Pain", "Knee Swelling", "High Fever", "Persistent Cough", 
                  "Skin Rash", "Hair Thinning", "Diabetic Check", "Sciatica", "General Checkup"
                ].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSymptoms(prev => prev ? `${prev}, ${tag}` : tag);
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-800 px-2 py-0.5 rounded transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Briefly describe your symptoms, pain duration, or specific consultation requirement..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payment Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer ${
                  paymentMode === 'Pay at Clinic' ? 'border-teal-600 bg-teal-50/60 font-semibold' : 'border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="paymentMode" 
                      checked={paymentMode === 'Pay at Clinic'}
                      onChange={() => setPaymentMode('Pay at Clinic')}
                      className="text-teal-600"
                    />
                    <span>Pay at Clinic Reception (Cash/UPI/Card)</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{selectedDoctor.consultationFee}</span>
                </label>

                <label className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer ${
                  paymentMode === 'Online Prepaid' ? 'border-teal-600 bg-teal-50/60 font-semibold' : 'border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="paymentMode" 
                      checked={paymentMode === 'Online Prepaid'}
                      onChange={() => setPaymentMode('Online Prepaid')}
                      className="text-teal-600"
                    />
                    <span>Online Pre-pay (Priority Slot)</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{selectedDoctor.consultationFee}</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-7 py-3 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-800/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Generate Clinic Pass</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CONFIRMATION PASS & SLIP ================= */}
        {step === 4 && confirmedBooking && (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            {/* Success Alert */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Appointment Confirmed
                </span>
                <h3 className="text-lg font-bold text-emerald-950">
                  We look forward to welcoming you at CarePlus Hospital!
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  A confirmation SMS & WhatsApp reminder will be dispatched to <strong>{confirmedBooking.patientPhone}</strong>. Please arrive 10 minutes before your slot.
                </p>
              </div>
            </div>

            {/* Printable Digital Clinic Pass */}
            <div 
              id="printable-appointment-pass" 
              className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-teal-700 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                Confirmed Appointment Pass
              </div>

              {/* Clinic Branding Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 font-heading">
                    {CLINIC_INFO.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {CLINIC_INFO.address} &bull; Ph: {CLINIC_INFO.phonePrimary}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500">Reference Booking ID</span>
                  <div className="text-base font-extrabold text-teal-800 font-mono tracking-wider">
                    {confirmedBooking.referenceCode}
                  </div>
                </div>
              </div>

              {/* Pass Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5 border-b border-slate-200">
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Consulting Specialist</span>
                    <h5 className="text-base font-bold text-slate-900">{confirmedBooking.doctorName}</h5>
                    <p className="text-xs text-teal-700 font-medium">{confirmedBooking.departmentName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedDoctor.roomNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Scheduled Date</span>
                      <p className="text-sm font-bold text-slate-800">{formatDisplayDate(confirmedBooking.date)}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Time Slot</span>
                      <p className="text-sm font-bold text-slate-800">{confirmedBooking.timeSlot}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Patient Information</span>
                    <h5 className="text-sm font-bold text-slate-900">{confirmedBooking.patientName}</h5>
                    <p className="text-xs text-slate-600">
                      Age: {confirmedBooking.patientAge} &bull; Gender: {confirmedBooking.patientGender} &bull; Ph: {confirmedBooking.patientPhone}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Consultation Mode</span>
                      <p className="font-semibold text-slate-700">{confirmedBooking.consultationType}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Consultation Fee</span>
                      <p className="font-bold text-teal-800 text-sm">₹{confirmedBooking.fee} ({confirmedBooking.paymentMode})</p>
                    </div>
                  </div>

                  {confirmedBooking.symptoms && (
                    <div className="pt-1 text-xs">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Reported Symptoms</span>
                      <p className="text-slate-600 line-clamp-2">{confirmedBooking.symptoms}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions Footer */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Bring previous test records, prescriptions, and wear comfortable clothing.</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  Status: <strong className="text-emerald-700 uppercase">Confirmed</strong>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF Slip</span>
                </button>

                <a
                  href={`https://wa.me/918448960011?text=Hi%20CarePlus%20Hospital%20Demo,%20I%20have%20booked%20appointment%20${confirmedBooking.referenceCode}%20with%20${encodeURIComponent(confirmedBooking.doctorName)}%20for%20${confirmedBooking.date}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Confirm on WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetFormForNew}
                  className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
                >
                  Book Another Appointment
                </button>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
