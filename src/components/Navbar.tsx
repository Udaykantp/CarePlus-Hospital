import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Search, 
  User, 
  Menu, 
  X, 
  ArrowLeft,
  PhoneCall,
  Ambulance,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard,
  Building2,
  Stethoscope,
  Clock,
  Heart,
  FileText,
  Activity,
  Sparkles,
  MapPin,
  TestTube,
  Award,
  Phone,
  Star,
  BookOpen,
  Building,
  Info
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { GlobalSearchBar } from './GlobalSearchBar';

interface NavbarProps {
  onOpenScheduler: (prefill?: { doctorId?: string; departmentId?: string }) => void;
  onOpenBookings: () => void;
  onOpenSymptomChecker: () => void;
  onOpenLogin?: () => void;
  onOpenEmergency?: () => void;
  activeBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenScheduler,
  onOpenBookings,
  onOpenSymptomChecker,
  onOpenLogin,
  onOpenEmergency,
  activeBookingsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [departmentsDropdownOpen, setDepartmentsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDepartmentsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
        setDepartmentsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll position for subtle elevation shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to check active state
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setDepartmentsDropdownOpen(false);
  };

  // Department shortcuts for the Departments dropdown
  const DEPARTMENTS = [
    {
      name: 'Physiotherapy & Rehab',
      desc: '1-on-1 Manual Therapy & Electrotherapy',
      path: '/services/physiotherapy',
      icon: Activity
    },
    {
      name: 'Cardiology & Heart Care',
      desc: 'ECG, Hypertension & Cardiac Risk Screening',
      path: '/services/cardiology',
      icon: Heart
    },
    {
      name: 'Orthopaedics & Spine Care',
      desc: 'Joint Care, Slip Disc & Non-Surgical Triage',
      path: '/services/orthopaedics',
      icon: Stethoscope
    },
    {
      name: 'Internal Medicine & OPD',
      desc: 'Diabetes, Hypertension & Senior Physicians',
      path: '/services/internal-medicine',
      icon: ShieldCheck
    },
    {
      name: 'Dermatology & Cosmetology',
      desc: 'PRP Hair Therapy, Acne & Laser Clinics',
      path: '/services/dermatology',
      icon: Sparkles
    },
    {
      name: 'Paediatrics & Child Health',
      desc: 'Painless IAP Vaccines & Newborn Care',
      path: '/services/paediatrics',
      icon: Heart
    },
    {
      name: 'Chest & Pulmonology',
      desc: 'Computerized Spirometry (PFT) & Asthma',
      path: '/services/pulmonology',
      icon: Activity
    },
    {
      name: 'NABL Diagnostic Pathology',
      desc: 'Blood Tests, Digital ECG & WhatsApp Reports',
      path: '/diagnostics',
      icon: TestTube
    }
  ];

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-200 ${
      isScrolled 
        ? 'shadow-md shadow-slate-900/5 border-b border-slate-200' 
        : 'shadow-xs border-b border-slate-200/80'
    }`}>

      {/* ================= 1. DESKTOP / TABLET TOP UTILITY STRIP ================= */}
      <div className="hidden md:block bg-[#004d40] text-teal-50 border-b border-[#00382e] text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Emergency, OPD Hours & Location */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-200 font-bold">24/7 Emergency:</span>
              <a 
                href={`tel:${CLINIC_INFO.phonePrimary.replace(/[^0-9]/g, '')}`} 
                className="hover:text-white transition-colors underline font-semibold"
              >
                {CLINIC_INFO.phonePrimary}
              </a>
            </div>

            <span className="hidden lg:inline text-teal-300/40">|</span>

            <div className="hidden lg:flex items-center gap-1.5 text-teal-100">
              <Clock className="w-3 h-3 text-teal-300" />
              <span>OPD Hours: Mon–Sat 9:00 AM – 9:00 PM</span>
            </div>

            <span className="hidden xl:inline text-teal-300/40">|</span>

            <div className="hidden xl:flex items-center gap-1.5 text-teal-100">
              <MapPin className="w-3 h-3 text-teal-300" />
              <span>Old Rajinder Nagar, Central Delhi</span>
            </div>
          </div>

          {/* Right Trust Badges & Portal */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 text-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>NABH Accredited &bull; DISHA Compliant</span>
            </div>

            <Link
              to="/portal/dashboard"
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-teal-100 hover:text-white font-semibold transition-colors"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Staff Portal</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ================= 2. DESKTOP MAIN HEADER (Row 1: Logo + Global Search Bar + CTAs) ================= */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 py-2.5 items-center justify-between gap-4 lg:gap-8">
        
        {/* Brand Logo */}
        <Link 
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0"
        >
          <div className="relative w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-9 h-9 lg:w-10 lg:h-10 text-[#00897b]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-3.5 h-3.5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3.5 bg-white rounded-xs shadow-2xs"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3.5 h-1 bg-white rounded-xs shadow-2xs"></div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-lg lg:text-xl font-black tracking-tight text-slate-900 font-heading leading-tight block">
              CarePlus <span className="text-[#00897b]">Hospital</span>
            </span>
            <p className="text-[10px] lg:text-[10.5px] text-slate-500 font-medium tracking-tight -mt-0.5">
              Better Health. Brighter Tomorrow.
            </p>
          </div>
        </Link>

        {/* Global Search Bar (Prominent in Header) */}
        <div className="flex-1 max-w-md lg:max-w-xl">
          <GlobalSearchBar 
            onOpenScheduler={onOpenScheduler}
            placeholder="Search doctors, services, or lab tests (e.g. ECG, CBC, Dr. Bishwas)..."
          />
        </div>

        {/* Action Buttons: Login & Book Appointment (+ My Visits) */}
        <div className="flex items-center gap-2.5 lg:gap-3 flex-shrink-0">
          
          {/* Active Bookings badge if any */}
          {activeBookingsCount > 0 && (
            <button
              onClick={onOpenBookings}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-[#00897b] border border-teal-200/90 hover:bg-teal-100 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeBookingsCount} Active Pass</span>
            </button>
          )}

          {/* Login Button (Required) */}
          <button
            onClick={() => onOpenLogin ? onOpenLogin() : navigate('/portal/dashboard')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold text-slate-700 hover:text-[#00897b] hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Login</span>
          </button>

          {/* Book Appointment Button (Required Primary CTA) */}
          <button
            onClick={() => onOpenScheduler()}
            className="flex items-center gap-2 px-4 lg:px-5 py-2 rounded-xl text-xs lg:text-sm font-bold text-white bg-[#00897b] hover:bg-[#00796b] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

        </div>

      </div>

      {/* ================= 3. DESKTOP NAVIGATION BAR (Row 2: Requested Buttons Ribbon) ================= */}
      <div className="hidden md:block bg-slate-50/80 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Exact buttons available in navbar */}
          <nav className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold text-slate-700 py-1">
            
            {/* 1. Departments (with dropdown) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDepartmentsDropdownOpen(!departmentsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  departmentsDropdownOpen || isActive('/services')
                    ? 'text-[#00897b] bg-white shadow-2xs font-bold' 
                    : 'hover:text-[#00897b] hover:bg-slate-100'
                }`}
                aria-expanded={departmentsDropdownOpen}
                aria-haspopup="true"
              >
                <Building2 className="w-3.5 h-3.5 text-[#00897b]" />
                <span>Departments</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  departmentsDropdownOpen ? 'rotate-180 text-[#00897b]' : 'text-slate-400'
                }`} />
              </button>

              {/* Departments Mega Dropdown */}
              {departmentsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[460px] bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 mb-2 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Clinical Specialties &amp; Wings</span>
                    <Link
                      to="/services"
                      onClick={() => setDepartmentsDropdownOpen(false)}
                      className="text-[#00897b] font-bold hover:underline normal-case tracking-normal"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {DEPARTMENTS.map((dept, idx) => {
                      const IconComponent = dept.icon;
                      return (
                        <Link
                          key={idx}
                          to={dept.path}
                          onClick={() => setDepartmentsDropdownOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#00897b] group-hover:bg-[#00897b] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800 group-hover:text-[#00897b] leading-tight transition-colors">
                              {dept.name}
                            </span>
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {dept.desc}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 bg-teal-50/60 p-2 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">Unsure which department you need?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDepartmentsDropdownOpen(false);
                        onOpenSymptomChecker();
                      }}
                      className="text-[#00897b] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Triage</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Services */}
            <Link 
              to="/services" 
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/services') && !departmentsDropdownOpen
                  ? 'text-[#00897b] bg-white shadow-2xs font-bold' 
                  : 'hover:text-[#00897b] hover:bg-slate-100'
              }`}
            >
              Services
            </Link>

            {/* 3. Facilities */}
            <Link 
              to="/facilities" 
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/facilities') || isActive('/diagnostics')
                  ? 'text-[#00897b] bg-white shadow-2xs font-bold' 
                  : 'hover:text-[#00897b] hover:bg-slate-100'
              }`}
            >
              Facilities
            </Link>

            {/* 4. Doctors */}
            <Link 
              to="/doctors" 
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/doctors') 
                  ? 'text-[#00897b] bg-white shadow-2xs font-bold' 
                  : 'hover:text-[#00897b] hover:bg-slate-100'
              }`}
            >
              Doctors
            </Link>

            {/* 5. Reviews */}
            <Link 
              to="/reviews" 
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${
                isActive('/reviews') 
                  ? 'text-[#00897b] bg-white shadow-2xs font-bold' 
                  : 'hover:text-[#00897b] hover:bg-slate-100'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Reviews</span>
            </Link>

            {/* 6. Blog */}
            <Link 
              to="/blog" 
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/blog') 
                  ? 'text-[#00897b] bg-white shadow-2xs font-bold' 
                  : 'hover:text-[#00897b] hover:bg-slate-100'
              }`}
            >
              Blog
            </Link>

            {/* 7. About */}
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/about') 
                  ? 'text-[#00897b] bg-white shadow-2xs font-bold' 
                  : 'hover:text-[#00897b] hover:bg-slate-100'
              }`}
            >
              About
            </Link>

            {/* 8. Contact */}
            <Link 
              to="/contact" 
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/contact') 
                  ? 'text-[#00897b] bg-white shadow-2xs font-bold' 
                  : 'hover:text-[#00897b] hover:bg-slate-100'
              }`}
            >
              Contact
            </Link>

          </nav>

          {/* Quick Right shortcuts: AI Symptom Checker & Emergency */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={onOpenSymptomChecker}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[#00897b] font-medium py-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00897b]" />
              <span className="hidden lg:inline">AI Symptom Checker</span>
            </button>

            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold py-1.5 transition-colors cursor-pointer"
              >
                <Ambulance className="w-3.5 h-3.5" />
                <span>Emergency SOS</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ================= 4. MOBILE / COMPACT APP BAR (< md:block) ================= */}
      <div className="md:hidden px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100">
        
        {/* Mobile Brand Logo */}
        <Link 
          to="/" 
          onClick={handleMobileLinkClick}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-[#00897b] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="text-base font-black text-slate-900 font-heading leading-tight block">
              CarePlus <span className="text-[#00897b]">Hospital</span>
            </span>
          </div>
        </Link>

        {/* Mobile Right Controls: Search Toggle, SOS & Hamburger */}
        <div className="flex items-center gap-1.5">
          
          {/* Global Search Bar Toggle for Mobile */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              mobileSearchOpen ? 'bg-teal-50 text-[#00897b]' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Search Doctors, Services and Tests"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick SOS Emergency */}
          {onOpenEmergency ? (
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold active:scale-95 transition-transform"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>SOS</span>
            </button>
          ) : (
            <a
              href={`tel:${CLINIC_INFO.phonePrimary.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Call</span>
            </a>
          )}

          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all relative cursor-pointer"
            aria-label="Open Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
            {activeBookingsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00897b] rounded-full ring-2 ring-white"></span>
            )}
          </button>

        </div>
      </div>

      {/* ================= 5. MOBILE EXPANDED SEARCH BAR (When user clicks search icon) ================= */}
      {mobileSearchOpen && (
        <div className="md:hidden px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top-2 duration-150">
          <GlobalSearchBar
            onOpenScheduler={onOpenScheduler}
            onResultSelect={() => setMobileSearchOpen(false)}
            placeholder="Search doctors, services, or lab tests..."
            isMobileDrawer={false}
          />
        </div>
      )}

      {/* ================= 6. MOBILE FULL SLIDE-OVER DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative ml-auto w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00897b] text-white flex items-center justify-center font-bold">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-900 font-heading">
                    CarePlus Menu
                  </span>
                  <p className="text-[10px] text-slate-500">Central Delhi Multispeciality</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Global Search Bar inside Mobile Drawer */}
            <div className="p-3.5 bg-white border-b border-slate-100">
              <GlobalSearchBar
                onOpenScheduler={onOpenScheduler}
                onResultSelect={handleMobileLinkClick}
                placeholder="Search doctors, tests, services..."
                isMobileDrawer={true}
              />
            </div>

            {/* Scrollable Navigation Links List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-semibold">
              
              {/* 1. Departments */}
              <Link
                to="/services"
                onClick={handleMobileLinkClick}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isActive('/services') ? 'bg-teal-50 text-[#00897b] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-[#00897b]" />
                  <span>Departments</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* 2. Services */}
              <Link
                to="/services"
                onClick={handleMobileLinkClick}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isActive('/services') ? 'bg-teal-50 text-[#00897b] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-[#00897b]" />
                  <span>Services</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* 3. Facilities */}
              <Link
                to="/facilities"
                onClick={handleMobileLinkClick}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isActive('/facilities') || isActive('/diagnostics') ? 'bg-teal-50 text-[#00897b] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-[#00897b]" />
                  <span>Facilities</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* 4. Doctors */}
              <Link
                to="/doctors"
                onClick={handleMobileLinkClick}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isActive('/doctors') ? 'bg-teal-50 text-[#00897b] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className="w-4 h-4 text-[#00897b]" />
                  <span>Doctors</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* 5. Reviews */}
              <Link
                to="/reviews"
                onClick={handleMobileLinkClick}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isActive('/reviews') ? 'bg-teal-50 text-[#00897b] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Reviews</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* 6. Blog */}
              <Link
                to="/blog"
                onClick={handleMobileLinkClick}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isActive('/blog') ? 'bg-teal-50 text-[#00897b] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#00897b]" />
                  <span>Blog</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* 7. About */}
              <Link
                to="/about"
                onClick={handleMobileLinkClick}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isActive('/about') ? 'bg-teal-50 text-[#00897b] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-[#00897b]" />
                  <span>About</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* 8. Contact */}
              <Link
                to="/contact"
                onClick={handleMobileLinkClick}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isActive('/contact') ? 'bg-teal-50 text-[#00897b] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#00897b]" />
                  <span>Contact</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* 9. Login Action Button */}
              <button
                type="button"
                onClick={() => {
                  handleMobileLinkClick();
                  if (onOpenLogin) onOpenLogin();
                  else navigate('/portal/dashboard');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Login</span>
                </div>
                <span className="text-[11px] text-[#00897b] font-bold">Sign In</span>
              </button>

              {/* 10. Book Appointment Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleMobileLinkClick();
                    onOpenScheduler();
                  }}
                  className="w-full py-3 bg-[#00897b] hover:bg-[#00796b] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>

              {/* Emergency Assistance card */}
              <div className="mt-4 p-3 bg-red-50/80 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-2 text-red-700 font-bold text-xs mb-1">
                  <Ambulance className="w-4 h-4 text-red-600" />
                  <span>24/7 Emergency &amp; Ambulance</span>
                </div>
                <p className="text-[11px] text-red-600 mb-2">
                  Immediate trauma, cardiac resuscitation &amp; doctor on-call.
                </p>
                <a
                  href={`tel:${CLINIC_INFO.phonePrimary.replace(/[^0-9]/g, '')}`}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {CLINIC_INFO.phonePrimary}</span>
                </a>
              </div>

              {/* Staff Portal Link */}
              <div className="pt-3 text-center">
                <Link
                  to="/portal/dashboard"
                  onClick={handleMobileLinkClick}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#00897b] font-medium"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Staff / Doctor Portal Access</span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      )}

    </header>
  );
};
