import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { AppointmentBooking } from '../types';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Trash2, 
  CheckCheck, 
  Play, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: AppointmentBooking[];
  onOpenReschedule?: (bookingId: string) => void;
}

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onOpenReschedule
}) => {
  const {
    notifications,
    unreadCount,
    pushPermission,
    requestPushPermission,
    soundEnabled,
    toggleSound,
    confirmAttendance,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    simulateQuick24hReminder
  } = useNotifications();

  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <span>Push Notifications & Reminders</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-teal-500 text-[10px] text-slate-950 font-extrabold">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                24-Hour Pre-Visit Automated Alert System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'text-teal-400 bg-teal-950/60' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Mute Alert Chime' : 'Unmute Alert Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simulation Action Bar */}
        <div className="p-4 bg-teal-50/80 border-b border-teal-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Automated 24h Reminder Simulator
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Active Mode
            </span>
          </div>

          <p className="text-[11px] text-teal-800/90 leading-relaxed">
            Trigger a real-time push notification test to simulate the exact alert a patient receives 24 hours prior to their scheduled visit.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => simulateQuick24hReminder(bookings)}
              className="flex-1 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate 24h Push Alert</span>
            </button>

            {pushPermission !== 'granted' && (
              <button
                onClick={requestPushPermission}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold py-2 px-3 rounded-xl transition-all"
                title="Enable Browser Web Push"
              >
                Enable Web Push
              </button>
            )}
          </div>
        </div>

        {/* Notification Toolbar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>{notifications.length} Total Messages</span>
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={markAllAsRead}
                  className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
                <span>&bull;</span>
                <button
                  onClick={clearAllNotifications}
                  className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center mx-auto">
                <Bell className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No Notifications Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Automated reminders trigger 24 hours before your visit. Click "Simulate 24h Push Alert" above to test the system!
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const is24h = n.type === '24h_reminder';
              const isConfirmed = n.attendanceConfirmed;

              return (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    !n.isRead
                      ? 'bg-teal-50/40 border-teal-200 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      <h5 className="text-xs font-bold text-slate-900 leading-tight">
                        {n.title}
                      </h5>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {n.message}
                  </p>

                  {n.referenceCode && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10.5px]">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                        Ref: {n.referenceCode}
                      </span>
                      {n.timeSlot && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {n.timeSlot}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions for 24h reminder */}
                  {is24h && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      {!isConfirmed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (n.bookingId) confirmAttendance(n.bookingId);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Attendance</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Attendance Confirmed ✓
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          if (onOpenReschedule && n.bookingId) {
                            onOpenReschedule(n.bookingId);
                          } else {
                            navigate('/my-bookings');
                          }
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Reschedule
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          navigate('/my-bookings');
                        }}
                        className="ml-auto text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
                      >
                        <span>Pass</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info on No-Show Reduction Impact */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>CarePlus No-Show Prevention Protocol</span>
          </div>
          <p className="text-[10.5px] text-slate-500 leading-normal">
            Automated 24h push reminders reduce clinic no-show rates from 18.5% to under 4.2% by enabling proactive 1-click confirmation or early rescheduling.
          </p>
        </div>
      </div>
    </div>
  );
};
