import React from 'react';
import { AppointmentBooking } from '../types';
import { CLINIC_INFO } from '../data/clinicData';
import { printBookingsHistoryDocument } from '../utils/printUtils';
import { downloadBookingsHistoryPDF } from '../utils/pdfGenerator';
import { X, Printer, Download, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface PrintableBookingsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: AppointmentBooking[];
  patientPhoneQuery?: string;
}

export const PrintableBookingsHistoryModal: React.FC<PrintableBookingsHistoryModalProps> = ({
  isOpen,
  onClose,
  bookings,
  patientPhoneQuery
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    printBookingsHistoryDocument(bookings, patientPhoneQuery);
  };

  const activeCount = bookings.filter(b => b.status !== 'cancelled').length;
  const totalFees = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + (curr.fee || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Top Action Bar */}
        <div className="sticky top-0 bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between z-10 print:hidden rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Appointments & Token Ledger
            </span>
            <span className="text-xs text-slate-400">&bull; {bookings.length} Records</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadBookingsHistoryPDF(bookings, patientPhoneQuery)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-xs"
              title="Download Appointment History Ledger PDF"
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
                Helpline: {CLINIC_INFO.phonePrimary} | {CLINIC_INFO.phoneAppointments1}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Clinical Visit History Report
              </span>
              <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()}</p>
              {patientPhoneQuery && (
                <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">Filter: {patientPhoneQuery}</p>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Scheduled</span>
              <span className="text-lg font-extrabold text-slate-900">{bookings.length} Visits</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active / Confirmed</span>
              <span className="text-lg font-extrabold text-emerald-700">{activeCount} Visits</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative Fees</span>
              <span className="text-lg font-extrabold text-teal-800">₹{totalFees.toLocaleString()}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                  <th className="py-2.5 px-3">Token Ref</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Doctor & Specialty</th>
                  <th className="py-2.5 px-3">Date & Slot</th>
                  <th className="py-2.5 px-3 text-right">Fee</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {b.referenceCode}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-900 block">{b.patientName}</span>
                      <span className="text-[10px] text-slate-400">{b.patientPhone}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <strong className="text-slate-900 font-bold block">{b.doctorName}</strong>
                      <span className="text-[11px] text-slate-500">{b.departmentName}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-teal-800 block">{b.date}</span>
                      <span className="text-[10.5px] text-slate-500">{b.timeSlot}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      ₹{b.fee}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'rescheduled'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400">
            CarePlus Hospital Health Records • Authorized Outpatient Record Summary
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
            <span>Print Appointment History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
