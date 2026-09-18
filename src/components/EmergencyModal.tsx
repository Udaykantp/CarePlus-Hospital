import React from 'react';
import { 
  X, 
  Phone, 
  AlertTriangle, 
  Ambulance, 
  MapPin, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-300">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-3 sm:hidden" />

        {/* Emergency Header */}
        <div className="bg-red-600 text-white p-5 rounded-t-2xl sm:rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Ambulance className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">
                24/7 Emergency &amp; Ambulance
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Immediate response team on standby
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Main Ambulance Hotline Call Button */}
          <a
            href={`tel:${CLINIC_INFO.phoneAppointments1.replace(/[^0-9+]/g, '')}`}
            className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-between shadow-lg shadow-red-500/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-100 block">
                  Tap to Call Emergency ER
                </span>
                <span className="text-xl font-black font-heading block">
                  {CLINIC_INFO.phoneAppointments1}
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white" />
          </a>

          {/* Secondary Helpline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${CLINIC_INFO.phonePrimary.replace(/[^0-9+]/g, '')}`}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#00897b] flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Hospital Desk</span>
                <span className="text-xs font-bold text-slate-900 block">{CLINIC_INFO.phonePrimary}</span>
              </div>
            </a>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">ER Department</span>
                <span className="text-xs font-bold text-slate-900 block">24 Hours / 7 Days</span>
              </div>
            </div>
          </div>

          {/* Hospital Address Quick Map link */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-800">CarePlus Emergency Trauma Center</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {CLINIC_INFO.address}
                </p>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Emergency Panel
          </button>
        </div>

      </div>
    </div>
  );
};
