/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClinicDataProvider } from './context/ClinicDataContext';
import { DemoSwitcherBar } from './components/management/DemoSwitcherBar';
import { LoginModal } from './components/management/LoginModal';
import { HospitalPortalLayout } from './components/management/HospitalPortalLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { MedicalRecordsPage } from './pages/MedicalRecordsPage';
import { BlogPage } from './pages/BlogPage';
import { ReviewsPage } from './pages/ReviewsPage';

// Public Layout Components
import { Navbar } from './components/Navbar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { EmergencyModal } from './components/EmergencyModal';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { SymptomCheckerModal } from './components/SymptomCheckerModal';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { INITIAL_BOOKINGS } from './data/clinicData';
import { AppointmentBooking } from './types';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'hhmc_patient_bookings_v1';

function MainApplicationContent() {
  const { currentUser, isManagementView, toggleViewMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Public website bookings state
  const [bookings, setBookings] = useState<AppointmentBooking[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading bookings', e);
    }
    return INITIAL_BOOKINGS;
  });

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Error saving bookings', e);
    }
  }, [bookings]);

  const handleBookingSuccess = (newBooking: AppointmentBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string, reason: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const, cancellationReason: reason } : b
      )
    );
  };

  const handleRescheduleBooking = (bookingId: string, newDate: string, newTimeSlot: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, date: newDate, timeSlot: newTimeSlot, status: 'rescheduled' as const } : b
      )
    );
  };

  const handleOpenScheduler = (prefill?: { doctorId?: string; departmentId?: string }) => {
    const params = new URLSearchParams();
    if (prefill?.doctorId) params.set('doctor', prefill.doctorId);
    if (prefill?.departmentId) params.set('service', prefill.departmentId);
    const qs = params.toString();
    navigate(`/book${qs ? `?${qs}` : ''}`);
  };

  const isPortalRoute = location.pathname.startsWith('/portal');
  const activeBookingsCount = bookings.filter(b => b.status !== 'cancelled').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-teal-600 selection:text-white font-sans antialiased">
      {/* 1. TOP DEMO SWITCHER & MULTI-TENANT BAR */}
      <DemoSwitcherBar onOpenLogin={() => setIsLoginModalOpen(true)} />

      {/* 2. GLOBAL NAVBAR DISPLAYED ON ALL PAGES & PANELS */}
      <Navbar
        onOpenScheduler={handleOpenScheduler}
        onOpenBookings={() => navigate('/my-bookings')}
        onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        activeBookingsCount={activeBookingsCount}
      />

      {/* 3. MAIN WORKSPACE / ROUTING CONTAINER */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        {isPortalRoute ? (
          <HospitalPortalLayout />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Dynamic Reusable Breadcrumbs Component for Public Layout */}
            <Breadcrumbs />

            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    onOpenScheduler={handleOpenScheduler}
                    onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
                    onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                  />
                } 
              />
              <Route 
                path="/services" 
                element={
                  <ServicesPage 
                    onSelectService={(deptId) => handleOpenScheduler({ departmentId: deptId })}
                  />
                } 
              />
              <Route 
                path="/services/:categorySlug" 
                element={
                  <ServicesPage 
                    onSelectService={(deptId) => handleOpenScheduler({ departmentId: deptId })}
                  />
                } 
              />
              <Route 
                path="/doctors" 
                element={
                  <DoctorsPage 
                    onSelectDoctor={(docId, deptId) => handleOpenScheduler({ doctorId: docId, departmentId: deptId })}
                  />
                } 
              />
              <Route 
                path="/doctors/:specialtySlug" 
                element={
                  <DoctorsPage 
                    onSelectDoctor={(docId, deptId) => handleOpenScheduler({ doctorId: docId, departmentId: deptId })}
                  />
                } 
              />
              <Route 
                path="/facilities" 
                element={
                  <DiagnosticsPage 
                    onOpenScheduler={handleOpenScheduler}
                  />
                } 
              />
              <Route 
                path="/facilities/:categorySlug" 
                element={
                  <DiagnosticsPage 
                    onOpenScheduler={handleOpenScheduler}
                  />
                } 
              />
              <Route 
                path="/diagnostics" 
                element={
                  <DiagnosticsPage 
                    onOpenScheduler={handleOpenScheduler}
                  />
                } 
              />
              <Route 
                path="/diagnostics/:categorySlug" 
                element={
                  <DiagnosticsPage 
                    onOpenScheduler={handleOpenScheduler}
                  />
                } 
              />
              <Route 
                path="/about" 
                element={<AboutPage />} 
              />
              <Route 
                path="/contact" 
                element={<ContactPage />} 
              />
              <Route 
                path="/book" 
                element={
                  <BookingPage 
                    onBookingSuccess={handleBookingSuccess}
                  />
                } 
              />
              <Route 
                path="/my-bookings" 
                element={
                  <MyBookingsPage 
                    bookings={bookings}
                    onCancelBooking={handleCancelBooking}
                  />
                } 
              />
              <Route 
                path="/medical-records" 
                element={<MedicalRecordsPage />} 
              />
              <Route 
                path="/blog" 
                element={<BlogPage />} 
              />
              <Route 
                path="/reviews" 
                element={<ReviewsPage />} 
              />
              <Route 
                path="/facilities" 
                element={
                  <DiagnosticsPage 
                    onOpenScheduler={handleOpenScheduler}
                  />
                } 
              />
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            </Routes>
          </div>
        )}
      </main>

      {/* 4. GLOBAL FOOTER DISPLAYED ON ALL PAGES & PANELS */}
      <Footer
        onOpenScheduler={handleOpenScheduler}
        onOpenBookings={() => navigate('/my-bookings')}
        onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
      />

      {/* Floating Switcher to Staff Management Platform (shown on public routes) */}
      {!isPortalRoute && (
        <div className="hidden md:flex fixed bottom-4 left-4 z-40">
          <button
            onClick={() => navigate('/portal/dashboard')}
            className="bg-slate-950 text-white hover:bg-slate-800 px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Launch Clinic Management System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mobile Bottom App Navigation Bar */}
      <MobileBottomNav
        activeBookingsCount={activeBookingsCount}
        onOpenScheduler={() => handleOpenScheduler()}
        onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
      />

      {/* Floating Action Button Widget: Quick-dial for Reception, Emergency & WhatsApp */}
      <FloatingContactWidget
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Global Modals */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <MyAppointmentsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onRescheduleBooking={handleRescheduleBooking}
      />

      <SymptomCheckerModal
        isOpen={isSymptomCheckerOpen}
        onClose={() => setIsSymptomCheckerOpen(false)}
        onSelectRecommendation={(deptId, docId) => {
          handleOpenScheduler({ departmentId: deptId, doctorId: docId });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ClinicDataProvider>
        <MainApplicationContent />
      </ClinicDataProvider>
    </AuthProvider>
  );
}
