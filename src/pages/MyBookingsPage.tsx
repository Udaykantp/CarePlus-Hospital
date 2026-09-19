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
  FileText
} from 'lucide-react';
import { AppointmentBooking } from '../types';
import { PrintableAppointmentPassModal } from '../components/PrintableAppointmentPassModal';
import { PrintableBookingsHistoryModal } from '../components/PrintableBookingsHistoryModal';
import { printAppointmentPassDocument, printBookingsHistoryDocument } from '../utils/printUtils';
import { downloadAppointmentPassPDF, downloadBookingsHistoryPDF } from '../utils/pdfGenerator';

interface MyBookingsPageProps {
  bookings: AppointmentBooking[];
  onCancelBooking: (id: string, reason: string) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  bookings,
  onCancelBooking
}) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Print modals state
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<AppointmentBooking | null>(null);
  const [isPrintPassModalOpen, setIsPrintPassModalOpen] = useState(false);
  const [isPrintHistoryModalOpen, setIsPrintHistoryModalOpen] = useState(false);

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

  const handleOpenPrintPass = (booking: AppointmentBooking) => {
    setSelectedBookingForPass(booking);
    setIsPrintPassModalOpen(true);
  };

  const handleDirectPrintPass = (booking: AppointmentBooking) => {
    printAppointmentPassDocument(booking);
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

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-800 text-xs font-bold rounded-full border border-teal-200">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          Patient Appointments Vault
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
          My Scheduled Appointments & Tokens
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          View token passes, verify consultation timings, or manage cancellations for your consultations at CarePlus Hospital (Demo).
        </p>
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
          filtered.map((b) => (
            <div
              key={b.id}
              className={`bg-white rounded-2xl border p-6 transition-all ${
                b.status === 'cancelled'
                  ? 'border-slate-200 opacity-60 bg-slate-50'
                  : 'border-slate-200/80 shadow-xs hover:border-teal-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs font-mono">
                    #{b.referenceCode.slice(-4)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{b.patientName}</span>
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

                  <button
                    type="button"
                    onClick={() => downloadAppointmentPassPDF(b)}
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Download Official Consultation Pass PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenPrintPass(b)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Print Official Consultation Pass"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print</span>
                  </button>

                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => setCancelModalId(b.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Doctor / Service</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{b.doctorName}</span>
                  <span className="text-slate-500 text-[11px] block">{b.departmentName}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Date & Time</span>
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
            </div>
          ))
        )}
      </div>

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
