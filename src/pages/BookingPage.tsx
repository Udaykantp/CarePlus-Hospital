import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppointmentScheduler } from '../components/AppointmentScheduler';
import { Calendar, ShieldCheck } from 'lucide-react';
import { AppointmentBooking } from '../types';

interface BookingPageProps {
  onBookingSuccess?: (booking: AppointmentBooking) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onBookingSuccess }) => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service') || undefined;
  const doctorId = searchParams.get('doctor') || undefined;

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-800 text-[11px] font-bold rounded-full border border-teal-200">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          Direct Appointment Booking
        </span>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
          Schedule Consultation
        </h1>
        <p className="text-[11px] sm:text-sm text-slate-500">
          Select doctor or service, choose slot, and receive instant token pass.
        </p>
      </div>

      {/* Dedicated Scheduler Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-md p-4 sm:p-10">
        <AppointmentScheduler
          initialDoctorId={doctorId}
          initialDepartmentId={serviceId}
          onBookingSuccess={(booking: AppointmentBooking) => {
            if (onBookingSuccess) onBookingSuccess(booking);
          }}
        />
      </div>
    </div>
  );
};
