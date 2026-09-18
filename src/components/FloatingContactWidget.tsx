import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  MessageCircle, 
  Ambulance, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  ShieldAlert,
  Headphones,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CLINIC_INFO } from '../data/clinicData';

interface FloatingContactWidgetProps {
  onOpenEmergencyModal?: () => void;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({
  onOpenEmergencyModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  const cleanReceptionPhone = CLINIC_INFO.phonePrimary.replace(/[^0-9+]/g, '');
  const cleanEmergencyPhone = CLINIC_INFO.phoneAppointments1.replace(/[^0-9+]/g, '');
  const whatsappUrl = `https://wa.me/918448960011?text=${encodeURIComponent(
    'Hello CarePlus Hospital, I would like to inquire about an appointment/support.'
  )}`;

  return (
    <div 
      ref={widgetRef}
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end"
      id="floating-contact-widget"
    >
      {/* Expanded Quick-Dial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden"
            style={{ transformOrigin: 'bottom right' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00897b] to-[#00695c] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight">CarePlus Help Desk</h3>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-100 font-medium">
                    Quick-dial assistance &amp; triage
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick-Dial Links List */}
            <div className="p-3.5 sm:p-4 space-y-2.5 bg-slate-50/50">
              {/* 1. Reception & Appointments */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00897b] border border-teal-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">Clinic Reception</h4>
                        <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                          OPD 9 AM - 9 PM
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {CLINIC_INFO.phonePrimary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(CLINIC_INFO.phonePrimary, 'reception')}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Copy number"
                    >
                      {copiedType === 'reception' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`tel:${cleanReceptionPhone}`}
                      className="px-3.5 py-1.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 active:scale-98"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. 24/7 Emergency & Ambulance */}
              <div className="bg-gradient-to-r from-red-50/70 via-white to-red-50/40 rounded-2xl p-3.5 border border-red-200/90 shadow-xs hover:border-red-400 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Ambulance className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-red-950">24/7 Emergency</h4>
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-300 animate-pulse">
                          Priority
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {CLINIC_INFO.phoneAppointments1}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {onOpenEmergencyModal && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          onOpenEmergencyModal();
                        }}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-100/60 transition-colors cursor-pointer"
                        title="View emergency triage details"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    )}
                    <a
                      href={`tel:${cleanEmergencyPhone}`}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-red-500/20 flex items-center gap-1.5 transition-all hover:scale-102 active:scale-98"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>SOS</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 3. WhatsApp Instant Support */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">WhatsApp Support</h4>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          Instant Chat
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Reports, booking, inquiries
                      </p>
                    </div>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 active:scale-98 flex-shrink-0"
                  >
                    <span>Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Information */}
            <div className="px-4 py-2.5 bg-slate-100/80 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Mon-Sat 9:00 AM - 9:00 PM</span>
              </span>
              <span className="font-semibold text-slate-700">Central Delhi</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Toggle Button */}
      <motion.button
        type="button"
        id="quick-dial-fab"
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        aria-expanded={isOpen}
        aria-label="Toggle quick contact and emergency dial links"
        className={`group relative flex items-center gap-2.5 px-4 py-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-colors cursor-pointer ${
          isOpen
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : 'bg-[#00897b] text-white hover:bg-[#00796b] shadow-[#00897b]/30'
        }`}
      >
        {/* Pulsing indicator ring when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
        )}

        <div className="flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-white transition-transform duration-200" />
          ) : (
            <PhoneCall className="w-5 h-5 text-white animate-pulse" />
          )}
        </div>

        <div className="hidden sm:flex flex-col items-start text-left leading-tight">
          <span className="text-xs font-bold tracking-tight">
            {isOpen ? 'Close Menu' : 'Quick Dial & Support'}
          </span>
          {!isOpen && (
            <span className="text-[10px] text-teal-100 font-medium">
              Reception • Emergency • WhatsApp
            </span>
          )}
        </div>
      </motion.button>
    </div>
  );
};
