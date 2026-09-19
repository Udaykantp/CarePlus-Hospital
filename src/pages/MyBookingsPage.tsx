import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Search, 
  XCircle, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Printer,
  Download,
  FileText,
  Bell,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  TrendingDown
} from 'lucide-react';
import { AppointmentBooking } from '../types';
import { PrintableAppointmentPassModal } from '../components/PrintableAppointmentPassModal';
import { PrintableBookingsHistoryModal } from '../components/PrintableBookingsHistoryModal';
import { printAppointmentPassDocument, printBookingsHistoryDocument } from '../utils/printUtils';
import { downloadAppointmentPassPDF, downloadBookingsHistoryPDF } from '../utils/pdfGenerator';
import { useNotifications } from '../context/NotificationContext';

interface MyBookingsPageProps {
  bookings: AppointmentBooking[];
  onCancelBooking: (id: string, reason: string) => void;
  onRescheduleBooking?: (bookingId: string, newDate: string, newTimeSlot: string) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  bookings,
  onCancelBooking,
  onRescheduleBooking
}) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Reschedule modal state
  const [rescheduleBooking, setRescheduleBooking] = useState<AppointmentBooking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('11:00 AM - 11:45 AM');

  // Print modals state
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<AppointmentBooking | null>(null);
  const [isPrintPassModalOpen, setIsPrintPassModalOpen] = useState(false);
  const [isPrintHistoryModalOpen, setIsPrintHistoryModalOpen] = useState(false);

  // Notification Context
  const {
    trigger24HourReminder,
    confirmAttendance,
    simulateQuick24hReminder,
    soundEnabled,
    toggleSound,
    pushPermission,
    requestPushPermission
  } = useNotifications();

  const filtered = bookings.filter(b => {
    if (!searchPhone) return true;
    return b.patientPhone.includes(searchPhone) || b.referenceCode.toLowerCase().includes(searchPhone.toLowerCase());
  });

  const handleConfirmCancel = () => {
    if (cancelModalId) {
      onCancelBooking(cancelModalId, cancelReason || 'Cancelled by patient');
      setCancelModalId(null);
      setCancelReason('');
    }
  };

  const handleOpenReschedule = (booking: AppointmentBooking) => {
    setRescheduleBooking(booking);
    const d = new Date();
    d.setDate(d.getDate() + 2);
    setRescheduleDate(d.toISOString().split('T')[0]);
    setRescheduleSlot(booking.timeSlot || '11:00 AM - 11:45 AM');
  };

  const handleConfirmReschedule = () => {
    if (rescheduleBooking && onRescheduleBooking && rescheduleDate) {
      onRescheduleBooking(rescheduleBooking.id, rescheduleDate, rescheduleSlot);
      setRescheduleBooking(null);
    }
  };

  const handleOpenPrintPass = (booking: AppointmentBooking) => {
    setSelectedBookingForPass(booking);
    setIsPrintPassModalOpen(true);
  };

  const handleDirectPrintPass = (booking: AppointmentBooking) => {
    printAppointmentPassDocument(booking);
  };

  // Helper to check if appointment is tomorrow (24h lead window)
  const isTomorrow = (dateStr: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return dateStr === tomorrowStr;
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Top Switcher Tabs: Appointments vs Medical Records */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <div className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-white text-teal-800 rounded-lg shadow-xs flex items-center justify-center gap-1.5 border border-slate-200/80">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            <span>Appointments & Passes</span>
          </div>
          <Link
            to="/medical-records"
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Medical Records & Rx</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {filtered.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadBookingsHistoryPDF(filtered, searchPhone || undefined)}
                className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="Download Appointment History PDF"
              >
                <Download className="w-3.5 h-3.5 text-teal-700" />
                <span>Download History (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPrintHistoryModalOpen(true)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-teal-400"
              >
                <Printer className="w-3.5 h-3.5 text-teal-700" />
                <span className="hidden md:inline">Print History Ledger</span>
                <span className="md:hidden">Print</span>
              </button>
            </div>
          )}

          <Link
            to="/book"
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap text-center shadow-xs"
          >
            + Book New Consultation
          </Link>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-800 text-xs font-bold rounded-full border border-teal-200">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          Patient Appointments Vault
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
          My Scheduled Appointments & Tokens
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          View token passes, verify consultation timings, download official PDF passes, or confirm your attendance to avoid queue delays.
        </p>
      </div>

      {/* 24-HOUR REMINDER & NO-SHOW REDUCTION PROTOCOL HERO CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-teal-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/40">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                Automated 24h Push Alert System
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                <TrendingDown className="w-3 h-3 text-emerald-400" />
                -78% No-Show Rate Reduction
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Pre-Visit Appointment Reminders & Instant Confirmation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              CarePlus triggers an automated push reminder <strong>24 hours before your scheduled visit</strong>. Confirming attendance with 1-click guarantees your doctor slot, reduces OPD wait times, and allows idle slots to be reallocated.
            </p>
          </div>

          {/* Interactive Simulation & Audio Controls */}
          <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end gap-2 flex-shrink-0">
            <button
              onClick={() => simulateQuick24hReminder(bookings)}
              className="flex-1 sm:flex-none bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Simulate 24h Push Reminder</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={toggleSound}
                className="flex-1 sm:flex-none bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Sound Chime: On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sound: Muted</span>
                  </>
                )}
              </button>

              {pushPermission !== 'granted' && (
                <button
                  onClick={requestPushPermission}
                  className="text-xs text-teal-300 hover:text-white underline font-semibold py-1 px-2"
                >
                  Enable Browser Push
                </button>
              )}
            </div>
          </div>
        </div>

        {/* System Metric Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800 text-[11px]">
          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Trigger Window</span>
            <span className="font-bold text-teal-300">T-24h Scheduled Lead</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Audio Feedback</span>
            <span className="font-bold text-teal-300">Web Audio Synthesizer</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance Flow</span>
            <span className="font-bold text-emerald-400">1-Tap Fast Confirmation</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Queue Impact</span>
            <span className="font-bold text-emerald-400">Zero OPD Stalls</span>
          </div>
        </div>
      </div>

      {/* Search by phone or token */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3 max-w-md mx-auto">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by phone (+91...) or Token (HHMC-...)"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="w-full text-xs text-slate-800 focus:outline-none"
        />
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Appointments Located</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No active or past bookings match your query. Book your doctor consultation or daycare session now.
            </p>
            <Link
              to="/book"
              className="inline-flex px-5 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800"
            >
              Book Consultation Now
            </Link>
          </div>
        ) : (
          filtered.map((b) => {
            const isVisitTomorrow = isTomorrow(b.date);
            const isConfirmed = b.attendanceConfirmed;

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all space-y-4 ${
                  b.status === 'cancelled'
                    ? 'border-slate-200 opacity-60 bg-slate-50'
                    : isConfirmed
                    ? 'border-emerald-300 ring-1 ring-emerald-500/20 shadow-xs'
                    : isVisitTomorrow
                    ? 'border-teal-400 ring-1 ring-teal-500/30 shadow-xs'
                    : 'border-slate-200/80 shadow-xs hover:border-teal-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs font-mono">
                      #{b.referenceCode.slice(-4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{b.patientName}</span>
                        {isVisitTomorrow && b.status !== 'cancelled' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 animate-pulse">
                            ⏰ Tomorrow (T-24h Alert)
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-xs block">Token: {b.referenceCode}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'rescheduled'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>

                    {/* PDF Download Button */}
                    <button
                      type="button"
                      onClick={() => downloadAppointmentPassPDF(b)}
                      className="flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
                      title="Download Official Consultation Pass PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-700" />
                      <span>Download PDF</span>
                    </button>

                    {/* Print Pass Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenPrintPass(b)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
                      title="Print Official Consultation Pass"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Print</span>
                    </button>

                    {/* Reschedule Button */}
                    {b.status !== 'cancelled' && onRescheduleBooking && (
                      <button
                        type="button"
                        onClick={() => handleOpenReschedule(b)}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-teal-700 bg-slate-50 hover:bg-teal-50 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-500" />
                        <span>Reschedule</span>
                      </button>
                    )}

                    {/* Cancel Button */}
                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => setCancelModalId(b.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Doctor / Service</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{b.doctorName}</span>
                    <span className="text-slate-500 text-[11px] block">{b.departmentName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Date & Time Slot</span>
                    <span className="font-bold text-teal-700 block mt-0.5">{b.date}</span>
                    <span className="text-slate-600 text-[11px] block">{b.timeSlot}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Consultation Type</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{b.consultationType}</span>
                    <span className="text-slate-500 text-[11px] block">Fee: ₹{b.fee} ({b.paymentMode})</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Contact</span>
                    <span className="font-semibold text-slate-900 block mt-0.5">{b.patientPhone}</span>
                    <span className="text-slate-500 text-[11px] block">{b.patientEmail}</span>
                  </div>
                </div>

                {/* 24-HOUR REMINDER & ATTENDANCE CONFIRMATION STRIP */}
                {b.status !== 'cancelled' && (
                  <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                    isConfirmed 
                      ? 'bg-emerald-50/70 border-emerald-200' 
                      : 'bg-teal-50/60 border-teal-200/90'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isConfirmed 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-teal-600 text-white'
                      }`}>
                        {isConfirmed ? <Check className="w-4 h-4 stroke-[3]" /> : <Bell className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {isConfirmed 
                              ? 'Patient Attendance Confirmed ✓' 
                              : '24-Hour Pre-Visit Reminder System'}
                          </span>
                          {isConfirmed && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                              OPD Slot Locked
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {isConfirmed 
                            ? 'Your arrival has been acknowledged by the outpatient desk. Please report 15 mins early.' 
                            : 'Trigger an instant simulated 24h push notification or confirm your attendance to avoid release.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {!isConfirmed ? (
                        <button
                          type="button"
                          onClick={() => confirmAttendance(b.id)}
                          className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm I'm Coming</span>
                        </button>
                      ) : (
                        <div className="text-[11px] font-bold text-emerald-700 bg-white border border-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>No-Show Risk: Zero</span>
                        </div>
                      )}

                      {/* Trigger Push Notification for this specific appointment */}
                      <button
                        type="button"
                        onClick={() => trigger24HourReminder(b, true)}
                        className="bg-white hover:bg-slate-50 text-teal-800 border border-teal-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Simulate 24-Hour push notification alert for this booking"
                      >
                        <Bell className="w-3.5 h-3.5 text-teal-600" />
                        <span>Test Push Alert</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-teal-700">
              <RotateCcw className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Reschedule Appointment</h3>
            </div>
            
            <p className="text-xs text-slate-600">
              Rescheduling allows another patient to use your upcoming slot and avoids no-show marks. Choose your preferred new date and time for <strong>{rescheduleBooking.doctorName}</strong>.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select New Consultation Date:
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select Preferred Time Slot:
                </label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                >
                  <option value="09:30 AM - 10:15 AM">09:30 AM - 10:15 AM (Morning Slot)</option>
                  <option value="11:00 AM - 11:45 AM">11:00 AM - 11:45 AM (Midday Slot)</option>
                  <option value="02:30 PM - 03:15 PM">02:30 PM - 03:15 PM (Afternoon Slot)</option>
                  <option value="04:30 PM - 05:15 PM">04:30 PM - 05:15 PM (Evening Slot)</option>
                  <option value="06:00 PM - 06:45 PM">06:00 PM - 06:45 PM (Late Evening Slot)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setRescheduleBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Keep Existing Slot
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs"
              >
                Confirm New Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Confirm Appointment Cancellation</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel this appointment? The consultation token will be released back to the OPD pool.
            </p>

            <textarea
              rows={3}
              placeholder="Reason for cancellation (optional)..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
              >
                Yes, Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Modals */}
      <PrintableAppointmentPassModal
        isOpen={isPrintPassModalOpen}
        onClose={() => setIsPrintPassModalOpen(false)}
        booking={selectedBookingForPass}
      />

      <PrintableBookingsHistoryModal
        isOpen={isPrintHistoryModalOpen}
        onClose={() => setIsPrintHistoryModalOpen(false)}
        bookings={filtered}
        patientPhoneQuery={searchPhone}
      />
    </div>
  );
};
