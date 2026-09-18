import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Activity, 
  Stethoscope, 
  Bed, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  Play, 
  Users, 
  Star, 
  User, 
  ChevronDown,
  X,
  CheckCircle2,
  Sparkles,
  Search,
  Ambulance,
  TestTubes,
  ClipboardList
} from 'lucide-react';
import { DOCTORS, SERVICES } from '../data/clinicData';

interface HeroSectionProps {
  onOpenScheduler: (prefill?: { doctorId?: string; departmentId?: string; date?: string }) => void;
  onOpenSymptomChecker?: () => void;
  onOpenEmergency?: () => void;
  onScrollToServices?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenScheduler,
  onOpenSymptomChecker,
  onOpenEmergency,
  onScrollToServices
}) => {
  // Appointment Quick Card State
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  // High-res Doctor image with seamless hospital background
  const [heroDoctorImg, setHeroDoctorImg] = useState(
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=85'
  );

  // Available doctors filtered by department if selected
  const availableDoctors = selectedDept
    ? DOCTORS.filter(d => d.departmentId === selectedDept)
    : DOCTORS;

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenScheduler({
      departmentId: selectedDept || undefined,
      doctorId: selectedDoc || undefined,
      date: selectedDate || undefined
    });
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Background Seamless Doctor & Modern Hospital Setting on the Right */}
      <div className="absolute top-0 right-0 bottom-14 w-full lg:w-[54%] xl:w-[50%] overflow-hidden pointer-events-none select-none z-0">
        <img 
          src={heroDoctorImg}
          onError={() => {
            if (heroDoctorImg.includes('1559839734')) {
              setHeroDoctorImg('https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=1600&q=85');
            } else {
              setHeroDoctorImg('https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1600&q=85');
            }
          }}
          alt="CarePlus Hospital Consultant Physician Doctor with stethoscope in hospital" 
          className="w-full h-full object-cover object-[center_15%] lg:object-[center_10%]"
        />

        {/* Seamless gradient mask: smoothly dissolves the hospital setting into pure white on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 via-25% to-transparent lg:from-white lg:via-white/60 lg:via-18% lg:to-transparent" />
        {/* Soft bottom fade towards the wave */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/70 to-transparent" />
        {/* Soft top gradient for clean header clearance */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8 lg:pt-14 lg:pb-14 relative z-10">
        
        {/* ================= MOBILE NATIVE APP VIEW (lg:hidden) ================= */}
        <div className="lg:hidden space-y-5">
          
          {/* 1. App Greeting Header Card */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e6f7f5] text-[#00897b] text-[11px] font-bold border border-[#b8ece6]">
                <Activity className="w-3 h-3 text-[#00897b]" />
                <span>Your Health Our Priority</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2 leading-tight">
                Quality Healthcare <br />
                <span className="text-[#00897b]">for a Healthier Tomorrow</span>
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-[#00897b] fill-[#00897b]/20" />
            </div>
          </div>

          {/* 2. App Quick Search Bar */}
          <div 
            onClick={() => onOpenSymptomChecker && onOpenSymptomChecker()}
            className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2.5 text-slate-400">
              <Search className="w-4 h-4 text-[#00897b]" />
              <span className="text-xs font-medium text-slate-500">
                Search doctors, specialties, tests...
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>AI</span>
            </div>
          </div>

          {/* 3. Native App 6-Grid Quick Action Launchpad */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Action 1: Book OPD */}
            <button
              onClick={() => onOpenScheduler()}
              className="p-3 bg-teal-50 hover:bg-teal-100/80 border border-teal-100 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00897b] text-white flex items-center justify-center shadow-xs mb-1.5">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Book OPD</span>
              <span className="text-[9.5px] text-teal-800">Fast Token</span>
            </button>

            {/* Action 2: Find Doctors */}
            <Link
              to="/doctors"
              className="p-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs mb-1.5">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Doctors</span>
              <span className="text-[9.5px] text-blue-700">12+ Specialists</span>
            </Link>

            {/* Action 3: Lab Tests */}
            <Link
              to="/diagnostics"
              className="p-3 bg-purple-50 hover:bg-purple-100/80 border border-purple-100 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs mb-1.5">
                <TestTubes className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Lab Tests</span>
              <span className="text-[9.5px] text-purple-700">Same-Day</span>
            </Link>

            {/* Action 4: AI Matcher */}
            <button
              onClick={() => onOpenSymptomChecker && onOpenSymptomChecker()}
              className="p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-100 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs mb-1.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">AI Symptom</span>
              <span className="text-[9.5px] text-amber-800">Match Doctor</span>
            </button>

            {/* Action 5: 24/7 ER */}
            <button
              onClick={() => {
                if (onOpenEmergency) {
                  onOpenEmergency();
                } else {
                  window.location.href = 'tel:108';
                }
              }}
              className="p-3 bg-red-50 hover:bg-red-100/80 border border-red-100 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs mb-1.5">
                <Ambulance className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-slate-900">24/7 ER</span>
              <span className="text-[9.5px] text-red-700">Ambulance</span>
            </button>

            {/* Action 6: My Passes */}
            <Link
              to="/my-bookings"
              className="p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs mb-1.5">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">My Visits</span>
              <span className="text-[9.5px] text-emerald-800">Queue &amp; Pass</span>
            </Link>
          </div>

          {/* 4. Horizontal Specialty Category Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Top Departments
              </h3>
              <Link to="/services" className="text-xs font-bold text-[#00897b] flex items-center gap-0.5">
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              <button
                onClick={() => setSelectedDept('')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  selectedDept === ''
                    ? 'bg-[#00897b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Departments
              </button>
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedDept(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                    selectedDept === s.id
                      ? 'bg-[#00897b] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Mobile Doctor Hero Banner Card with Trust Badge */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-lg">
            <img 
              src={heroDoctorImg}
              alt="CarePlus Physician"
              className="w-full h-44 object-cover object-[center_15%] opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            
            {/* Floating Trust Badge */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md">
              <Users className="w-3.5 h-3.5 text-[#00897b]" />
              <div>
                <span className="text-[10px] font-black block leading-none">50,000+</span>
                <span className="text-[8px] text-slate-500 font-bold block">Happy Patients</span>
              </div>
            </div>

            {/* Card Content at bottom */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Experienced MD Specialists</span>
                <p className="text-[10px] text-teal-200">Compassionate &amp; Affordable Care</p>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Story</span>
              </button>
            </div>
          </div>

          {/* 6. Quick Booking Native Form Card */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Book an Appointment
              </h3>
              <span className="text-[10px] bg-teal-50 text-[#00897b] font-bold px-2 py-0.5 rounded-full border border-teal-100">
                Instant Token
              </span>
            </div>

            <form onSubmit={handleQuickBook} className="space-y-2.5">
              <div className="relative">
                <div className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="w-4 h-4 text-[#00897b] flex-shrink-0" />
                    <select
                      value={selectedDept}
                      onChange={(e) => {
                        setSelectedDept(e.target.value);
                        setSelectedDoc('');
                      }}
                      className="bg-transparent text-slate-800 text-xs w-full focus:outline-none cursor-pointer appearance-none pr-4"
                    >
                      <option value="">Select Department</option>
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <div className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="w-4 h-4 text-[#00897b] flex-shrink-0" />
                    <select
                      value={selectedDoc}
                      onChange={(e) => setSelectedDoc(e.target.value)}
                      className="bg-transparent text-slate-800 text-xs w-full focus:outline-none cursor-pointer appearance-none pr-4"
                    >
                      <option value="">Select Doctor</option>
                      {availableDoctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.departmentName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <div className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                  <div className="flex items-center gap-2 w-full">
                    <Calendar className="w-4 h-4 text-[#00897b] flex-shrink-0" />
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-slate-800 text-xs w-full focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-sm shadow-[#00897b]/30 cursor-pointer"
              >
                <span>Confirm &amp; Book Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* ================= DESKTOP VIEW (hidden lg:grid) ================= */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[500px] lg:min-h-[550px]">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-6 lg:pr-4">
            
            {/* 1. Pill Badge: "Your Health Our Priority" */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-xs">
              <Activity className="w-4 h-4 text-[#00897b]" strokeWidth={2.5} />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                Your Health Our Priority
              </span>
            </div>

            {/* 2. Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
              Quality Healthcare <br />
              <span className="text-slate-900 font-black">for a </span>
              <span className="text-[#00897b] font-black">Healthier Tomorrow</span>
            </h1>

            {/* 3. Subtitle Paragraph */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl">
              We provide compassionate, advanced and affordable healthcare services for you and your family. Your well-being is our mission.
            </p>

            {/* 4. Four Key Features Horizontal Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {/* Feature 1: Expert Doctors */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center transition-transform hover:scale-105">
                  <Stethoscope className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Expert Doctors</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Experienced &amp; Specialized Team
                  </p>
                </div>
              </div>

              {/* Feature 2: Modern Facilities */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center transition-transform hover:scale-105">
                  <Bed className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Modern Facilities</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Advanced Technology &amp; Comfortable Care
                  </p>
                </div>
              </div>

              {/* Feature 3: 24/7 Support */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center transition-transform hover:scale-105">
                  <ShieldCheck className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">24/7 Support</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Emergency &amp; Critical Care
                  </p>
                </div>
              </div>

              {/* Feature 4: Patient First */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center transition-transform hover:scale-105">
                  <Heart className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Patient First</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Personalized Care for Every Patient
                  </p>
                </div>
              </div>
            </div>

            {/* 5. CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Book an Appointment Button */}
              <button
                type="button"
                onClick={() => onOpenScheduler()}
                className="px-6 py-3.5 bg-[#00897b] hover:bg-[#00796b] text-white text-sm font-bold rounded-xl shadow-md shadow-[#00897b]/20 flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {/* Watch Our Story Button */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 text-sm font-semibold rounded-full shadow-xs flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center pl-0.5">
                  <Play className="w-2.5 h-2.5 fill-slate-800 text-slate-800" />
                </div>
                <span>Watch Our Story</span>
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Floating Cards over Hospital & Doctor Visual ================= */}
          <div className="lg:col-span-5 relative flex flex-col justify-between items-end min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] pt-2 pb-2">
            
            {/* FLOATING CARD 1: Top Right "Trusted by 50,000+ Happy Patients" */}
            <div className="relative self-end bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-100/90 flex items-center gap-3.5 z-20 transition-transform hover:scale-105">
              <div className="w-10 h-10 rounded-xl bg-[#e0f4f3] text-[#00897b] flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  Trusted by 50,000+
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">Happy Patients</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Bottom Right "Need an Appointment?" */}
            <div className="relative self-end bg-white rounded-2xl shadow-2xl border border-slate-100/90 p-5 sm:p-6 w-full sm:w-80 lg:w-84 z-20 space-y-3.5 mt-auto">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Need an Appointment?
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Book your visit in just a few clicks.
                </p>
              </div>

              <form onSubmit={handleQuickBook} className="space-y-2.5">
                {/* Select Department Dropdown */}
                <div className="relative">
                  <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <select
                        value={selectedDept}
                        onChange={(e) => {
                          setSelectedDept(e.target.value);
                          setSelectedDoc('');
                        }}
                        className="bg-transparent text-slate-800 text-xs w-full focus:outline-none cursor-pointer appearance-none pr-4"
                      >
                        <option value="">Select Department</option>
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Select Doctor Dropdown */}
                <div className="relative">
                  <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <select
                        value={selectedDoc}
                        onChange={(e) => setSelectedDoc(e.target.value)}
                        className="bg-transparent text-slate-800 text-xs w-full focus:outline-none cursor-pointer appearance-none pr-4"
                      >
                        <option value="">Select Doctor</option>
                        {availableDoctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.departmentName})
                          </option>
                        ))}
                      </select>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Select Date Input */}
                <div className="relative">
                  <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 transition-colors">
                    <div className="flex items-center gap-2 w-full">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-slate-800 text-xs w-full focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Book Now Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer hover:shadow-md"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>

      {/* ================= BOTTOM PARTNER STRIP & CURVED WAVE ================= */}
      <div className="relative pt-6">
        {/* Soft Organic Curved Wave Divider */}
        <div className="w-full overflow-hidden leading-none text-[#f0f9f8]">
          <svg
            className="relative block w-full h-10 sm:h-14"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,32 C280,75 520,10 820,48 C1120,86 1320,25 1440,50 L1440,80 L0,80 Z" />
          </svg>
        </div>

        {/* Partner Logos Strip Background */}
        <div className="bg-[#f0f9f8] border-b border-teal-100/50 py-5 sm:py-6 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Tagline */}
            <div className="text-slate-500 text-xs sm:text-sm font-medium tracking-normal text-center md:text-left whitespace-nowrap">
              Partnering for a healthier community
            </div>

            {/* Insurance & Hospital Partner Logos */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-10 opacity-80 hover:opacity-100 transition-opacity">
              
              {/* TATA AIG Logo */}
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="bg-[#103064] text-white font-black text-[10px] px-2 py-1 rounded tracking-tighter leading-none text-center">
                  <div>TATA</div>
                  <div className="text-[8px] text-sky-200">AIG</div>
                </div>
                <div className="text-[11px] font-bold text-[#103064] tracking-tight">
                  TATA AIG <span className="text-[9px] block text-slate-500 font-normal">INSURANCE</span>
                </div>
              </div>

              {/* HDFC ERGO Logo */}
              <div className="flex items-center gap-1.5 group cursor-pointer">
                <div className="bg-[#002f6c] text-white font-extrabold text-[10px] px-2 py-1 rounded tracking-tight text-center">
                  HDFC
                </div>
                <div className="bg-[#da291c] text-white font-extrabold text-[10px] px-1.5 py-1 rounded tracking-tight text-center">
                  ERGO
                </div>
              </div>

              {/* Star Health Insurance Logo */}
              <div className="flex items-center gap-1.5 group cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <div className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
                  Star <span className="block text-[9px] text-slate-500 font-medium">Health Insurance</span>
                </div>
              </div>

              {/* Bajaj Allianz Logo */}
              <div className="flex items-center gap-1.5 group cursor-pointer">
                <div className="text-xs font-black text-[#004b87] tracking-tight">
                  bajaj <span className="font-light text-slate-400">|</span> Allianz 
                </div>
                <div className="w-4 h-4 rounded-full border border-[#004b87] flex items-center justify-center text-[9px] font-bold text-[#004b87]">
                  ⓘ
                </div>
              </div>

              {/* ManipalCigna Logo */}
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-5 h-5 rounded-md bg-[#2563eb] text-white flex items-center justify-center font-bold text-[10px]">
                  M
                </div>
                <div className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
                  ManipalCigna
                  <span className="block text-[9px] text-slate-500 font-normal">Health Insurance</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Video Modal: "Watch Our Story" */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 space-y-4 p-6 relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00897b]">
                Hospital Story &amp; Heritage
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                CarePlus Hospital: Compassionate Care in Action
              </h3>
            </div>

            {/* Video Placeholder / Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80" 
                alt="CarePlus Hospital facility documentary" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#00897b] text-white flex items-center justify-center shadow-lg shadow-teal-900/50 pl-1 animate-pulse">
                  <Play className="w-8 h-8 fill-white" />
                </div>
                <h4 className="text-base font-bold">A Day in the Life at CarePlus Hospital</h4>
                <p className="text-xs text-slate-200 max-w-md">
                  Experience our advanced operation theatres, dedicated rehabilitation floors, zero-wait OPD token management, and compassionate patient care.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                NABH Accredited &bull; 24x7 Emergency Services
              </span>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  onOpenScheduler();
                }}
                className="px-4 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl transition-colors"
              >
                Schedule Consultation Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
