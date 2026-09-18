import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Award, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Building2, 
  Users, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-12 shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-2 sm:space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <HeartHandshake className="w-3.5 h-3.5" />
            About CarePlus Hospital
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Compassionate Care &amp; Advanced Multispeciality Clinical Excellence
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
            Founded with a vision to deliver world-class outpatient care, super-specialist consultations, advanced diagnostics, and dedicated rehabilitation.
          </p>
        </div>
      </div>

      {/* Story and Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Our Clinical Heritage</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            CarePlus Hospital (Demo), Old Rajinder Nagar
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Located just minutes from Karol Bagh and Rajendra Place Metro stations, CarePlus Hospital (Demo) provides comprehensive diagnostic, therapeutic, and preventive healthcare services.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our clinic integrates senior medical specialists, cutting-edge rehabilitation technologies (including class-IV therapeutic laser and certified dry needling), pathology lab diagnostics, and in-house pharmacy dispensing under one roof.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl">
              <span className="text-2xl font-extrabold text-teal-900 block font-heading">15,000+</span>
              <span className="text-xs text-teal-700">Satisfied Patients</span>
            </div>
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
              <span className="text-2xl font-extrabold text-blue-900 block font-heading">8+</span>
              <span className="text-xs text-blue-700">Senior Specialists</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-heading">Our Core Pillars of Care</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Patient-Centered Outcomes</span>
                <span className="text-slate-500">Every treatment protocol is tailored to the individual's lifestyle, mobility goals, and clinical history.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Evidence-Based Medicine</span>
                <span className="text-slate-500">Adhering strictly to international clinical practice guidelines, NABH sanitization protocols, and validated diagnostic standards.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Zero-Waiting Digital Workflow</span>
                <span className="text-slate-500">Guaranteed appointment slots with real-time token tracking to respect your time and provide dedicated consultation.</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/book"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment at Our Clinic</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
