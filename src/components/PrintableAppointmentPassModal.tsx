import React from 'react';
import { AppointmentBooking } from '../types';
import { CLINIC_INFO } from '../data/clinicData';
import { printAppointmentPassDocument } from '../utils/printUtils';
import { downloadAppointmentPassPDF } from '../utils/pdfGenerator';
import { 
  X, 
  Printer, 
  Download, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode,
  FileText
} from 'lucide-react';

interface PrintableAppointmentPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: AppointmentBooking | null;
}

export const PrintableAppointmentPassModal: React.FC<PrintableAppointmentPassModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    printAppointmentPassDocument(booking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="sticky top-0 bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between z-10 print:hidden rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Appointment Confirmation Pass
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">&bull; {booking.referenceCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadAppointmentPassPDF(booking)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Download Official Appointment Pass PDF"
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
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Pass Container */}
        <div className="p-6 sm:p-8 space-y-5 text-slate-900 bg-white" id="printable-appointment-pass">
          {/* Hospital Header */}
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
                    CarePlus Multispeciality Healthcare (Demo)
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 max-w-sm leading-relaxed">
                {CLINIC_INFO.address}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                Helpline: {CLINIC_INFO.phonePrimary} | Appts: {CLINIC_INFO.phoneAppointments1}
              </p>
            </div>

            {/* Token Badge */}
            <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-3 text-right min-w-[170px] self-start sm:self-auto">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider block">
                OPD Priority Token
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-950 font-mono block">
                {booking.referenceCode}
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-200/60 text-emerald-900">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="text-center py-1">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest border-b border-dashed border-slate-300 pb-1 inline-block">
              Outpatient Consultation & Check-In Verification Pass
            </span>
          </div>

          {/* 2-Column Info Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Patient Demographics */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-200 pb-1">
                Patient Demographics
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900">{booking.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Age & Gender:</span>
                <span className="font-semibold text-slate-800">{booking.patientAge} Years / {booking.patientGender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Phone:</span>
                <span className="font-mono font-medium text-slate-900">{booking.patientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-700 truncate max-w-[160px]">{booking.patientEmail || 'Not Provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registered On:</span>
                <span className="text-slate-700">{new Date(booking.bookedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Doctor & Schedule Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-200 pb-1">
                Clinical Schedule
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{booking.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Specialty:</span>
                <span className="font-medium text-slate-800">{booking.departmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Date:</span>
                <span className="font-bold text-teal-700">{booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-bold text-slate-900">{booking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Visit Mode:</span>
                <span className="font-semibold text-slate-800">{booking.consultationType}</span>
              </div>
            </div>
          </div>

          {/* Payment & Chief Complaint */}
          <div className="p-4 bg-teal-50/40 border border-teal-200 rounded-xl space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-100 pb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-800 block">Consultation Fee</span>
                <span className="text-base font-extrabold text-teal-950">₹{booking.fee}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-teal-800 block">Payment Method</span>
                <span className="font-semibold text-slate-800">{booking.paymentMode}</span>
              </div>
            </div>
            {booking.symptoms && (
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Reported Symptoms / Notes:</span>
                <p className="text-slate-700 italic text-[11px] mt-0.5">{booking.symptoms}</p>
              </div>
            )}
          </div>

          {/* Barcode & Check-In Verification */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Reception Barcode Check-In
              </span>
              <span className="font-mono text-xs font-bold text-slate-900">
                *{booking.referenceCode}*
              </span>
              <p className="text-[10px] text-slate-400">Scan at kiosk or front-desk scanner for instant OPD slip</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <QrCode className="w-10 h-10 text-slate-800" />
            </div>
          </div>

          {/* Clinical Prep & Guidelines */}
          <div className="text-[11px] text-slate-600 bg-amber-50/40 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
            <h4 className="font-bold text-amber-900 text-xs uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Patient Check-In Checklist</span>
            </h4>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              <li>Please reach the OPD desk 15 minutes prior to your allocated slot for vitals recording.</li>
              <li>Carry all previous prescriptions, MRI / X-ray films, and recent lab blood investigation reports.</li>
              <li>Free parking is available in the basement. Nearest Metro: Karol Bagh (Blue Line).</li>
            </ul>
          </div>

          {/* Official Signatory Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-[10.5px] text-slate-400">
            <div>
              <p>Generated by CarePlus Health Information Systems • ISO 9001:2015</p>
              <p>For cancellations or inquiries: {CLINIC_INFO.phonePrimary}</p>
            </div>
            <div className="text-right sm:min-w-[140px]">
              <div className="font-serif italic text-teal-800 font-bold text-xs">CarePlus Desk</div>
              <div className="border-t border-slate-300 pt-0.5 text-[10px] text-slate-500 font-semibold">
                Authorized OPD Issuance
              </div>
            </div>
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
            <span>Print Appointment Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
