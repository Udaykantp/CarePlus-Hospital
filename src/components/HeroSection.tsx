import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
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
  ChevronRight,
  X,
  CheckCircle2,
  Sparkles,
  Search,
  Ambulance,
  TestTubes,
  ClipboardList,
  Pill,
  HeartPulse,
  Building2,
  Bone,
  Baby
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
  const [mobileDoctorImg, setMobileDoctorImg] = useState(
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85'
  );
  const [mobileDoctorImgError, setMobileDoctorImgError] = useState(false);

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute top-0 right-0 bottom-14 w-full lg:w-[54%] xl:w-[50%] overflow-hidden pointer-events-none select-none z-0"
      >
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
      </motion.div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8 lg:pt-14 lg:pb-14 relative z-10">
        
        {/* ================= MOBILE NATIVE APP VIEW (lg:hidden) ================= */}
        <div className="lg:hidden space-y-3.5 pb-2">
          
          {/* 1. Doctor / User Active Status Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 text-[#00897b] flex items-center justify-center font-bold flex-shrink-0">
                <User className="w-5 h-5 text-[#00897b]" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                  <span>Dr. Rahul Sharma</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">General Physician</div>
              </div>
            </div>

            {/* Online Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Online</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </div>
          </motion.div>

          {/* 2. Hero Banner Card */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#dcf5f1] via-[#eaf9f6] to-[#f0f9ff] border border-teal-100/90 p-4 sm:p-5 shadow-xs"
          >
            {/* Script "Your Health Matters ♡" above the doctor */}
            <div className="absolute top-2.5 right-2.5 z-20 text-right pointer-events-none select-none bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-full border border-teal-100/70 shadow-2xs">
              <div className="font-serif italic text-teal-900 text-[10.5px] sm:text-xs font-bold leading-tight flex items-center justify-end gap-1">
                <span>Your Health Matters</span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              </div>
            </div>

            <div className="relative z-10 max-w-[62%]">
              {/* Priority Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-[#00897b] text-[10px] font-bold border border-[#b8ece6] shadow-2xs mb-2">
                <Activity className="w-3 h-3 text-[#00897b]" />
                <span>Your Health Our Priority</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-[1.2]">
                Quality Healthcare <br />
                <span className="text-[#00897b]">for a Healthier Tomorrow</span>
              </h1>

              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Compassionate care, advanced technology and a dedicated team for your well-being.
              </p>
              
              <div className="mt-3.5">
                <button
                  onClick={() => onOpenScheduler()}
                  className="px-3.5 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-full shadow-md shadow-[#00897b]/30 flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book an Appointment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Doctor Image on the right */}
            <div className="absolute right-0 bottom-0 top-3 w-[46%] pointer-events-none flex items-end justify-end overflow-hidden">
              {!mobileDoctorImgError ? (
                <img 
                  src={mobileDoctorImg}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (mobileDoctorImg !== 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80') {
                      setMobileDoctorImg('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80');
                    } else {
                      setMobileDoctorImgError(true);
                    }
                  }}
                  className="h-full max-h-[220px] object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-teal-100/40 rounded-2xl">
                  <Stethoscope className="w-14 h-14 text-teal-600/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* 3. 8-Grid Quick Action Launchpad (4 columns x 2 rows) */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: 'easeOut' }}
            className="grid grid-cols-4 gap-2"
          >
            {/* Card 1: Book OPD */}
            <button
              onClick={() => onOpenScheduler()}
              className="p-2.5 bg-[#f0fdfa] hover:bg-teal-100/60 border border-teal-100/80 rounded-2xl flex flex-col justify-between items-start text-left transition-all active:scale-95 cursor-pointer shadow-2xs min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-xl bg-[#00897b] text-white flex items-center justify-center shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="w-full mt-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">Book OPD</span>
                <div className="flex items-center justify-between text-[9px] text-teal-800 mt-0.5">
                  <span>Fast Token</span>
                  <ArrowRight className="w-3 h-3 text-[#00897b]" />
                </div>
              </div>
            </button>

            {/* Card 2: Doctors */}
            <Link
              to="/doctors"
              className="p-2.5 bg-[#eff6ff] hover:bg-blue-100/60 border border-blue-100/80 rounded-2xl flex flex-col justify-between items-start text-left transition-all active:scale-95 shadow-2xs min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="w-full mt-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">Doctors</span>
                <div className="flex items-center justify-between text-[9px] text-blue-700 mt-0.5">
                  <span className="truncate">12+ Specialists</span>
                  <ArrowRight className="w-3 h-3 text-blue-600 flex-shrink-0" />
                </div>
              </div>
            </Link>

            {/* Card 3: Lab Tests */}
            <Link
              to="/diagnostics"
              className="p-2.5 bg-[#faf5ff] hover:bg-purple-100/60 border border-purple-100/80 rounded-2xl flex flex-col justify-between items-start text-left transition-all active:scale-95 shadow-2xs min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <TestTubes className="w-4 h-4" />
              </div>
              <div className="w-full mt-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">Lab Tests</span>
                <div className="flex items-center justify-between text-[9px] text-purple-700 mt-0.5">
                  <span>Same-Day</span>
                  <ArrowRight className="w-3 h-3 text-purple-600" />
                </div>
              </div>
            </Link>

            {/* Card 4: AI Symptom */}
            <button
              onClick={() => onOpenSymptomChecker && onOpenSymptomChecker()}
              className="p-2.5 bg-[#fffbeb] hover:bg-amber-100/60 border border-amber-100/80 rounded-2xl flex flex-col justify-between items-start text-left transition-all active:scale-95 cursor-pointer shadow-2xs min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="w-full mt-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">AI Symptom</span>
                <div className="flex items-center justify-between text-[9px] text-amber-800 mt-0.5">
                  <span>Match Doctor</span>
                  <ArrowRight className="w-3 h-3 text-amber-600" />
                </div>
              </div>
            </button>

            {/* Card 5: 24/7 ER */}
            <button
              onClick={() => onOpenEmergency ? onOpenEmergency() : (window.location.href = 'tel:108')}
              className="p-2.5 bg-[#fff1f2] hover:bg-rose-100/60 border border-rose-100/80 rounded-2xl flex flex-col justify-between items-start text-left transition-all active:scale-95 cursor-pointer shadow-2xs min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <Ambulance className="w-4 h-4" />
              </div>
              <div className="w-full mt-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">24/7 ER</span>
                <div className="flex items-center justify-between text-[9px] text-rose-700 mt-0.5">
                  <span>Ambulance</span>
                  <ArrowRight className="w-3 h-3 text-rose-600" />
                </div>
              </div>
            </button>

            {/* Card 6: My Visits */}
            <Link
              to="/my-bookings"
              className="p-2.5 bg-[#f0fdf4] hover:bg-emerald-100/60 border border-emerald-100/80 rounded-2xl flex flex-col justify-between items-start text-left transition-all active:scale-95 shadow-2xs min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div className="w-full mt-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">My Visits</span>
                <div className="flex items-center justify-between text-[9px] text-emerald-800 mt-0.5">
                  <span>Queue &amp; Pass</span>
                  <ArrowRight className="w-3 h-3 text-emerald-600" />
                </div>
              </div>
            </Link>

            {/* Card 7: Prescriptions */}
            <Link
              to="/medical-records"
              className="p-2.5 bg-[#f0f9ff] hover:bg-sky-100/60 border border-sky-100/80 rounded-2xl flex flex-col justify-between items-start text-left transition-all active:scale-95 shadow-2xs min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Pill className="w-4 h-4" />
              </div>
              <div className="w-full mt-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">Prescriptions</span>
                <div className="flex items-center justify-between text-[9px] text-sky-800 mt-0.5">
                  <span>Digital &amp; Refill</span>
                  <ArrowRight className="w-3 h-3 text-sky-600" />
                </div>
              </div>
            </Link>

            {/* Card 8: Health Records */}
            <Link
              to="/medical-records"
              className="p-2.5 bg-[#fdf2f8] hover:bg-pink-100/60 border border-pink-100/80 rounded-2xl flex flex-col justify-between items-start text-left transition-all active:scale-95 shadow-2xs min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-xs">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="w-full mt-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">Health Records</span>
                <div className="flex items-center justify-between text-[9px] text-pink-800 mt-0.5">
                  <span>View Reports</span>
                  <ArrowRight className="w-3 h-3 text-pink-600" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* 4. "Our Departments / Comprehensive Care Across Specialties" */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24, ease: 'easeOut' }}
            className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5"
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00897b]">
                <Building2 className="w-4 h-4 text-[#00897b]" />
                <span>Our Departments</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Comprehensive Care Across Specialties
              </h2>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                From routine checkups to advanced treatments, we offer a wide range of medical services under one roof.
              </p>
            </div>

            {/* 2-Column Specialty Pills Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* General Medicine */}
              <Link
                to="/services/internal-medicine"
                className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">General Medicine</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00897b] flex-shrink-0 ml-1" />
              </Link>

              {/* Cardiology */}
              <Link
                to="/services/cardiology"
                className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">Cardiology</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00897b] flex-shrink-0 ml-1" />
              </Link>

              {/* Orthopedics */}
              <Link
                to="/services/orthopaedics-spine"
                className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-[#00897b] flex items-center justify-center flex-shrink-0">
                    <Bone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">Orthopedics</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00897b] flex-shrink-0 ml-1" />
              </Link>

              {/* Gynecology */}
              <Link
                to="/services/gynaecology-obstetrics"
                className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">Gynecology</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00897b] flex-shrink-0 ml-1" />
              </Link>

              {/* Pediatrics */}
              <Link
                to="/services/paediatrics"
                className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Baby className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">Pediatrics</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00897b] flex-shrink-0 ml-1" />
              </Link>

              {/* Dermatology */}
              <Link
                to="/services/dermatology"
                className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">Dermatology</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00897b] flex-shrink-0 ml-1" />
              </Link>
            </div>

            <div className="pt-1">
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#00897b] text-[#00897b] hover:bg-teal-50 text-xs font-bold transition-colors"
              >
                <span>View All Departments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* 5. "New Patients? Book Your Appointment in Just a Few Clicks" Banner Card */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.32, ease: 'easeOut' }}
            className="relative rounded-3xl overflow-hidden shadow-xs border border-slate-200 bg-slate-900 text-white min-h-[150px]"
          >
            {/* Hospital reception interior background */}
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=85"
              alt="CarePlus Hospital Reception"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />

            {/* Floating Trust Pill Top-Right */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
              <Users className="w-3.5 h-3.5 text-[#00897b]" />
              <div className="text-left">
                <span className="text-[8.5px] text-slate-500 font-bold block leading-none">Trusted by</span>
                <span className="text-[10px] font-black block leading-tight">50,000+ Patients</span>
              </div>
            </div>

            <div className="relative z-10 p-4 sm:p-5 space-y-1.5 max-w-[70%]">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[9.5px] font-bold">
                <Building2 className="w-3 h-3" />
                <span>New Patients?</span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                Book Your Appointment in Just a Few Clicks
              </h3>

              <p className="text-[10.5px] text-slate-300 leading-relaxed">
                Choose your doctor, select time and get quality care, hassle-free.
              </p>

              <div className="pt-1.5">
                <button
                  onClick={() => onOpenScheduler()}
                  className="px-3.5 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-[#00897b]/30 cursor-pointer active:scale-95 transition-transform"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ================= DESKTOP VIEW (hidden lg:grid) ================= */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[460px] lg:min-h-[500px]">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6">
            
            {/* 1. Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-xs"
            >
              <Activity className="w-4 h-4 text-[#00897b]" strokeWidth={2.5} />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                Your Health Our Priority
              </span>
            </motion.div>

            {/* 2. Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-[52px] font-black text-slate-900 tracking-tight leading-[1.12]"
            >
              Quality Healthcare <br />
              <span className="text-slate-900 font-black">for a </span>
              <span className="text-[#00897b] font-black">Healthier Tomorrow</span>
            </motion.h1>

            {/* 3. Subtitle Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
              className="text-slate-600 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl"
            >
              We provide compassionate, advanced and affordable healthcare services for you and your family. Your well-being is our mission.
            </motion.p>

            {/* 4. Streamlined Trust Highlights (Minimalist & Crisp) */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-1 text-xs sm:text-sm font-medium text-slate-700"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00897b]" />
                <span>15+ Senior MD Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00897b]" />
                <span>NABH Accredited Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00897b]" />
                <span>Instant Digital OPD Pass</span>
              </div>
            </motion.div>

            {/* 5. Clean CTA Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              {/* Book an Appointment Button */}
              <button
                type="button"
                onClick={() => onOpenScheduler()}
                className="px-6 py-3.5 bg-[#00897b] hover:bg-[#00796b] text-white text-sm font-bold rounded-xl shadow-md shadow-[#00897b]/25 flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {/* Watch Our Story Button */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 text-sm font-semibold rounded-xl shadow-2xs flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center pl-0.5">
                  <Play className="w-2.5 h-2.5 fill-slate-800 text-slate-800" />
                </div>
                <span>Watch Video Tour</span>
              </button>
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: Floating Cards over Hospital & Doctor Visual ================= */}
          <div className="lg:col-span-5 relative flex flex-col justify-between items-end min-h-[400px] lg:min-h-[460px] py-2">
            
            {/* FLOATING CARD 1: Top Right "Trusted by 50,000+ Happy Patients" */}
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
              className="relative self-end bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 z-20 transition-transform hover:scale-105"
            >
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
            </motion.div>

            {/* FLOATING CARD 2: Bottom Right "Live OPD Status & Fast Token" */}
            <motion.div 
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.45, ease: 'easeOut' }}
              className="relative self-end bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-5 w-full sm:w-76 lg:w-80 z-20 space-y-3 mt-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-900">OPD Active Today</span>
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                  Zero Wait
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                <div className="text-[11px] text-slate-500 font-medium">Next Available Consultation:</div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#00897b]" />
                  <span>General &amp; Specialist OPD</span>
                </div>
                <div className="text-[10px] text-teal-700 font-semibold">
                  Today &bull; 15-Minute Average Token Time
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenScheduler()}
                className="w-full py-2.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span>Get Instant OPD Token</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 space-y-4 p-6 relative"
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
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
                className="px-4 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Schedule Consultation Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
};
