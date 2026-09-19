import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  X, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PushNotificationToastProps {
  onOpenReschedule?: (bookingId: string) => void;
  onOpenPass?: (bookingId: string) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  onOpenReschedule,
  onOpenPass
}) => {
  const { 
    activePushToast, 
    dismissActiveToast, 
    confirmAttendance, 
    soundEnabled, 
    toggleSound 
  } = useNotifications();

  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Auto-dismiss after 12 seconds unless hovered
  useEffect(() => {
    if (!activePushToast) {
      setProgress(100);
      return;
    }

    if (isHovered) return;

    const interval = 100;
    const totalTime = 12000;
    const step = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          dismissActiveToast();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activePushToast, isHovered, dismissActiveToast]);

  if (!activePushToast) return null;

  const is24hReminder = activePushToast.type === '24h_reminder';
  const isConfirmed = activePushToast.attendanceConfirmed;

  return (
    <div 
      className="fixed top-4 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-teal-500/30 overflow-hidden ring-1 ring-white/10">
        
        {/* Native Web-Push System Header Bar */}
        <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-teal-600 flex items-center justify-center text-white">
              <Bell className="w-3 h-3 animate-pulse" />
            </div>
            <span className="text-[11px] font-bold tracking-wider text-teal-300 uppercase">
              CarePlus Push Reminder
            </span>
            <span className="text-slate-500 text-[10px]">&bull;</span>
            <span className="text-slate-400 text-[10px]">24h Prior Notification</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleSound}
              className="text-slate-400 hover:text-teal-300 p-1 rounded-md transition-colors"
              title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={dismissActiveToast}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              title="Dismiss"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-5 h-5 text-teal-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>{activePushToast.title}</span>
                </h4>
                <span className="text-[10px] font-mono text-teal-400/80 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/40">
                  T-24h
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activePushToast.message}
              </p>

              {activePushToast.referenceCode && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-teal-200">
                    Token: {activePushToast.referenceCode}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Slot: {activePushToast.timeSlot || 'Tomorrow morning'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* No-Show Prevention Strategy Banner */}
          <div className="bg-teal-950/50 rounded-xl p-2.5 border border-teal-500/20 flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>Prompt confirmation keeps OPD queues on schedule and reduces patient wait times.</span>
            </div>
          </div>

          {/* Action Buttons for No-Show Reduction */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {is24hReminder && (
              <>
                {!isConfirmed ? (
                  <button
                    onClick={() => {
                      if (activePushToast.bookingId) {
                        confirmAttendance(activePushToast.bookingId);
                      }
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm I'm Coming</span>
                  </button>
                ) : (
                  <div className="flex-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Attendance Confirmed ✓</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    dismissActiveToast();
                    if (onOpenReschedule && activePushToast.bookingId) {
                      onOpenReschedule(activePushToast.bookingId);
                    } else {
                      navigate('/my-bookings');
                    }
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Reschedule
                </button>
              </>
            )}

            <button
              onClick={() => {
                dismissActiveToast();
                navigate('/my-bookings');
              }}
              className="text-xs text-teal-300 hover:text-white px-2 py-1 flex items-center gap-1 transition-colors"
            >
              <span>View Pass</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Dismiss Progress Bar */}
        <div className="w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-teal-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
