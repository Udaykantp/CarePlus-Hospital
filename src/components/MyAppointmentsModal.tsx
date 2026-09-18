import React, { useState } from 'react';
import { 
  X, 
  BookmarkCheck, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  Search,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { AppointmentBooking } from '../types';
import { CLINIC_INFO } from '../data/clinicData';

interface MyAppointmentsModalProps {
  bookings: AppointmentBooking[];
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking: (bookingId: string, reason: string) => void;
  onRescheduleBooking: (bookingId: string, newDate: string, newTimeSlot: string) => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  bookings,
  isOpen,
  onClose,
  onCancelBooking,
  onRescheduleBooking
}) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<AppointmentBooking | null>(null);
  const [actionType, setActionType] = useState<'view' | 'reschedule' | 'cancel' | null>(null);
  
  // Reschedule form state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('11:00 AM - 11:30 AM');
  
  // Cancel form state
  const [cancelReason, setCancelReason] = useState('Personal scheduling conflict');

  if (!isOpen) return null;

  // Filter bookings by phone or ref code if entered
  const filteredBookings = bookings.filter(b => {
    if (!searchPhone.trim()) return true;
    const q = searchPhone.toLowerCase().trim();
    return (
      b.patientPhone.includes(q) ||
      b.referenceCode.toLowerCase().includes(q) ||
      b.patientName.toLowerCase().includes(q)
    );
  });

  const handlePrintPass = () => {
    window.print();
  };

  const handleConfirmReschedule = () => {
    if (!selectedBookingForAction || !rescheduleDate) return;
    onRescheduleBooking(selectedBookingForAction.id, rescheduleDate, rescheduleSlot);
    setActionType(null);
    setSelectedBookingForAction(null);
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingForAction) return;
    onCancelBooking(selectedBookingForAction.id, cancelReason);
    setActionType(null);
    setSelectedBookingForAction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-250">
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="sticky top-0 bg-slate-900 text-white p-5 flex items-center justify-between z-10 sm:rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">
                Patient Appointment Tracker
              </h3>
              <p className="text-xs text-slate-400">
                Manage, reschedule, or retrieve your confirmed clinic slips
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Search by Mobile Number, Patient Name or Booking Ref (e.g. HHMC-2026-9281)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No appointments found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active or historical bookings match your search query. You can schedule a new consultation anytime.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map(booking => {
                const isCancelled = booking.status === 'cancelled';
                const isRescheduled = booking.status === 'rescheduled';

                return (
                  <div
                    key={booking.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCancelled
                        ? 'bg-slate-50/70 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 shadow-sm hover:border-teal-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {booking.referenceCode}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                            isCancelled 
                              ? 'bg-red-100 text-red-700' 
                              : isRescheduled
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mt-1">
                          {booking.doctorName}
                        </h4>
                        <p className="text-xs text-teal-700 font-medium">
                          {booking.departmentName}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400">Consultation Fee</span>
                        <div className="text-sm font-extrabold text-slate-900">
                          ₹{booking.fee}
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {booking.paymentMode}
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date & Slot</span>
                        <p className="font-bold text-slate-800 mt-0.5">{booking.date}</p>
                        <p className="text-slate-600">{booking.timeSlot}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient Name & Phone</span>
                        <p className="font-bold text-slate-800 mt-0.5">{booking.patientName}</p>
                        <p className="text-slate-600">{booking.patientPhone}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Consultation Mode</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{booking.consultationType}</p>
                        <p className="text-slate-500 line-clamp-1">{booking.symptoms}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {!isCancelled && (
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBookingForAction(booking);
                            setActionType('view');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View / Print Pass</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBookingForAction(booking);
                              setRescheduleDate(booking.date);
                              setActionType('reschedule');
                            }}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBookingForAction(booking);
                              setActionType('cancel');
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {isCancelled && booking.cancellationReason && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50/60 p-2 rounded-lg border border-red-100">
                        Cancellation note: {booking.cancellationReason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= ACTION MODAL SUB-VIEW ================= */}
          {actionType === 'reschedule' && selectedBookingForAction && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 text-xs space-y-3">
              <h5 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>Reschedule Booking #{selectedBookingForAction.referenceCode}</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">New Preferred Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">New Preferred Time Slot</label>
                  <select
                    value={rescheduleSlot}
                    onChange={(e) => setRescheduleSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="10:00 AM - 10:30 AM">Morning: 10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">Morning: 11:30 AM - 12:00 PM</option>
                    <option value="01:00 PM - 01:30 PM">Afternoon: 01:00 PM - 01:30 PM</option>
                    <option value="05:00 PM - 05:30 PM">Evening: 05:00 PM - 05:30 PM</option>
                    <option value="06:30 PM - 07:00 PM">Evening: 06:30 PM - 07:00 PM</option>
                    <option value="07:45 PM - 08:15 PM">Evening: 07:45 PM - 08:15 PM</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-md"
                >
                  Save Rescheduled Slot
                </button>
              </div>
            </div>
          )}

          {actionType === 'cancel' && selectedBookingForAction && (
            <div className="bg-red-50/90 border border-red-200 rounded-xl p-4 text-xs space-y-3">
              <h5 className="font-bold text-red-900 text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-700" />
                <span>Confirm Cancellation for #{selectedBookingForAction.referenceCode}</span>
              </h5>
              <p className="text-slate-700">
                Are you sure you want to cancel the appointment with <strong>{selectedBookingForAction.doctorName}</strong> on <strong>{selectedBookingForAction.date}</strong>?
              </p>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for cancellation</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule conflict, feeling better, need different day..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-md"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-md"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Helpline: <strong className="text-slate-800">{CLINIC_INFO.phonePrimary}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
