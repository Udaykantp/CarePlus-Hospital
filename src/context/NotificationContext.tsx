import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppointmentBooking, PushNotificationItem } from '../types';
import { playNotificationChime } from '../utils/notificationAudio';

const STORAGE_NOTIFICATIONS_KEY = 'careplus_push_notifications_v1';
const STORAGE_SOUND_KEY = 'careplus_notification_sound_enabled';
const STORAGE_SENT_REMINDERS_KEY = 'careplus_sent_24h_reminders_v1';

interface NotificationContextType {
  notifications: PushNotificationItem[];
  unreadCount: number;
  pushPermission: NotificationPermission | 'default';
  soundEnabled: boolean;
  activePushToast: PushNotificationItem | null;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  requestPushPermission: () => Promise<void>;
  toggleSound: () => void;
  trigger24HourReminder: (booking: AppointmentBooking, isManual?: boolean) => void;
  confirmAttendance: (bookingId: string) => void;
  dismissActiveToast: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  checkAndTrigger24hReminders: (bookings: AppointmentBooking[]) => void;
  simulateQuick24hReminder: (bookings: AppointmentBooking[]) => void;
  onAttendanceConfirmedCallback?: (bookingId: string) => void;
  setOnAttendanceConfirmedCallback: (cb: (bookingId: string) => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notifications from storage', e);
    }
    return [];
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOUND_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'default'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [activePushToast, setActivePushToast] = useState<PushNotificationItem | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [attendanceCallback, setAttendanceCallback] = useState<((bookingId: string) => void) | null>(null);

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to persist notifications', e);
    }
  }, [notifications]);

  // Sync sound preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SOUND_KEY, JSON.stringify(soundEnabled));
    } catch (e) {
      console.error('Failed to save sound preference', e);
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPushPermission(res);
      } catch (err) {
        console.warn('Could not request notification permission', err);
        setPushPermission('granted'); // Fallback simulated permission
      }
    } else {
      setPushPermission('granted');
    }
  };

  const dismissActiveToast = () => {
    setActivePushToast(null);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setActivePushToast(null);
  };

  const trigger24HourReminder = useCallback((booking: AppointmentBooking, isManual = false) => {
    const newNotif: PushNotificationItem = {
      id: `notif-24h-${booking.id}-${Date.now()}`,
      bookingId: booking.id,
      referenceCode: booking.referenceCode,
      type: '24h_reminder',
      title: `🔔 24h Reminder: Visit with ${booking.doctorName}`,
      message: `Your consultation is scheduled for tomorrow at ${booking.timeSlot} (${booking.departmentName}). Please confirm attendance to avoid release of your slot.`,
      doctorName: booking.doctorName,
      date: booking.date,
      timeSlot: booking.timeSlot,
      timestamp: new Date().toISOString(),
      isRead: false,
      attendanceConfirmed: booking.attendanceConfirmed || false,
      priority: 'high'
    };

    setNotifications(prev => [newNotif, ...prev.filter(n => n.bookingId !== booking.id)]);
    setActivePushToast(newNotif);

    // Play chime sound
    if (soundEnabled) {
      playNotificationChime();
    }

    // Trigger native browser notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`CarePlus Hospital: Visit in 24 Hours`, {
          body: `Tomorrow at ${booking.timeSlot} with ${booking.doctorName}. Token: #${booking.referenceCode.slice(-4)}. Tap to confirm attendance.`,
          icon: '/favicon.ico',
          tag: `booking-24h-${booking.id}`
        });
      } catch (e) {
        console.debug('Browser native notification suppressed by environment', e);
      }
    }

    // Save that this booking has had its 24h reminder sent
    try {
      const existingSent: string[] = JSON.parse(localStorage.getItem(STORAGE_SENT_REMINDERS_KEY) || '[]');
      if (!existingSent.includes(booking.id)) {
        existingSent.push(booking.id);
        localStorage.setItem(STORAGE_SENT_REMINDERS_KEY, JSON.stringify(existingSent));
      }
    } catch (e) {
      console.error(e);
    }
  }, [soundEnabled]);

  const confirmAttendance = useCallback((bookingId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.bookingId === bookingId
          ? { ...n, attendanceConfirmed: true, isRead: true }
          : n
      )
    );

    if (activePushToast && activePushToast.bookingId === bookingId) {
      setActivePushToast(prev => prev ? { ...prev, attendanceConfirmed: true } : null);
    }

    // Create a confirmation feedback notification
    const confirmNotif: PushNotificationItem = {
      id: `notif-confirmed-${bookingId}-${Date.now()}`,
      bookingId,
      type: 'attendance_confirmed',
      title: '✓ Attendance Confirmed & Slot Reserved',
      message: 'Thank you for confirming. Your OPD slot is guaranteed and the department queue has been updated. Please arrive 15 minutes prior with your token pass.',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'normal'
    };

    setNotifications(prev => [confirmNotif, ...prev]);

    if (soundEnabled) {
      playNotificationChime();
    }

    if (attendanceCallback) {
      attendanceCallback(bookingId);
    }
  }, [activePushToast, soundEnabled, attendanceCallback]);

  // Automated 24-hour reminder detection scanner
  const checkAndTrigger24hReminders = useCallback((bookings: AppointmentBooking[]) => {
    if (!bookings || bookings.length === 0) return;

    try {
      const existingSent: string[] = JSON.parse(localStorage.getItem(STORAGE_SENT_REMINDERS_KEY) || '[]');
      const now = new Date();

      // Find bookings scheduled for tomorrow or within 12 to 36 hours
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const todayStr = now.toISOString().split('T')[0];

      const candidates = bookings.filter(b => {
        if (b.status === 'cancelled') return false;
        if (existingSent.includes(b.id)) return false;

        // Check if date is tomorrow or today
        if (b.date === tomorrowStr) return true;

        // Alternatively check timestamp delta
        try {
          const bookingDate = new Date(b.date);
          const diffMs = bookingDate.getTime() - now.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          return diffHours >= 0 && diffHours <= 36;
        } catch {
          return false;
        }
      });

      if (candidates.length > 0) {
        // Trigger for first candidate automatically
        trigger24HourReminder(candidates[0]);
      }
    } catch (e) {
      console.error('Error scanning 24h reminders', e);
    }
  }, [trigger24HourReminder]);

  // Manual simulation helper for user testing
  const simulateQuick24hReminder = useCallback((bookings: AppointmentBooking[]) => {
    const activeBooking = bookings.find(b => b.status !== 'cancelled') || bookings[0];
    if (activeBooking) {
      trigger24HourReminder(activeBooking, true);
    }
  }, [trigger24HourReminder]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        pushPermission,
        soundEnabled,
        activePushToast,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        requestPushPermission,
        toggleSound,
        trigger24HourReminder,
        confirmAttendance,
        dismissActiveToast,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        checkAndTrigger24hReminders,
        simulateQuick24hReminder,
        onAttendanceConfirmedCallback: attendanceCallback || undefined,
        setOnAttendanceConfirmedCallback: (cb) => setAttendanceCallback(() => cb)
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
