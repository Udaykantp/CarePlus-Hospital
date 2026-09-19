import React from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  Stethoscope, 
  TestTubes, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Sparkles,
  Activity,
  AlertCircle,
  Video,
  ChevronRight,
  Ambulance,
  HeartPulse
} from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { ServiceDescriptions } from '../components/ServiceDescriptions';
import { DoctorProfiles } from '../components/DoctorProfiles';
import { DiagnosticTestsSection } from '../components/DiagnosticTestsSection';
import { ClinicOverview } from '../components/ClinicOverview';
import { LatestHealthInsights } from '../components/LatestHealthInsights';
import { CLINIC_INFO } from '../data/clinicData';
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from '../components/ScrollReveal';

interface HomePageProps {
  onOpenScheduler: (prefill?: { doctorId?: string; departmentId?: string }) => void;
  onOpenSymptomChecker: () => void;
  onOpenEmergency?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenScheduler,
  onOpenSymptomChecker,
  onOpenEmergency
}) => {
  return (
    <div className="space-y-0 pb-0 bg-white">
      {/* 1. Hero Section */}
      <HeroSection 
        onOpenScheduler={onOpenScheduler}
        onOpenSymptomChecker={onOpenSymptomChecker}
        onOpenEmergency={onOpenEmergency}
        onScrollToServices={() => {
          const el = document.getElementById('services-section');
          if (el) {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }}
      />

      {/* 2. CarePulse Highlights & Live OPD Emergency Strip with Scroll Reveal (Desktop only, mobile has 8-action launchpad) */}
      <section className="hidden lg:block bg-[#f0f9f8] pt-4 pb-12 border-b border-teal-100/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* 4 Clinical Pillars matching Hero Feature Circles with staggered reveal */}
          <ScrollRevealGroup staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            <ScrollRevealItem>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex items-center gap-4 h-full">
                <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
                  <Stethoscope className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">Senior MD Clinicians</h4>
                  <p className="text-xs text-slate-500 mt-0.5">15+ Years Avg. Experience</p>
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex items-center gap-4 h-full">
                <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
                  <Calendar className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">Zero Wait OPD Pass</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Live Queue Management</p>
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex items-center gap-4 h-full">
                <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
                  <TestTubes className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">NABL Onsite Pathology</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Same-Day WhatsApp Reports</p>
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex items-center gap-4 h-full">
                <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
                  <ShieldCheck className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">NABH Patient Safety</h4>
                  <p className="text-xs text-slate-500 mt-0.5">100% Sterile &amp; Regulated</p>
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollRevealGroup>

          {/* Emergency & Live Reception Action Bar with smooth reveal */}
          <ScrollReveal direction="up" delay={0.15} distance={20}>
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-teal-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                    <Ambulance className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                      24/7 Critical Care &amp; Ambulance
                    </span>
                    <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold border border-red-200">
                      Always On
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight mt-0.5">
                    Cardiac Triage, Trauma &amp; Emergency Helpline
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Immediate doctor response &bull; Direct hotline: <strong className="text-slate-800">{CLINIC_INFO.phonePrimary}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={onOpenEmergency}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs shadow-red-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Emergency Protocol</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenScheduler()}
                  className="px-4 py-2.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs shadow-[#00897b]/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Priority OPD</span>
                </button>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 3. Clinical Services Section */}
      <div id="services-section">
        <ScrollReveal direction="up" distance={30} duration={0.6}>
          <ServiceDescriptions 
            onBookService={(deptId, docId) => {
              onOpenScheduler({ departmentId: deptId, doctorId: docId });
            }} 
          />
        </ScrollReveal>
      </div>

      {/* 4. Doctors Section */}
      <ScrollReveal direction="up" distance={30} duration={0.6}>
        <DoctorProfiles 
          onSelectDoctor={(docId, deptId) => {
            onOpenScheduler({ doctorId: docId, departmentId: deptId });
          }} 
        />
      </ScrollReveal>

      {/* 5. Diagnostic Pathology & Tests */}
      <ScrollReveal direction="up" distance={30} duration={0.6}>
        <DiagnosticTestsSection 
          onBookTest={() => {
            onOpenScheduler({ departmentId: 'diagnostics-pathology' });
          }} 
        />
      </ScrollReveal>

      {/* 6. Clinic Facilities & Map Overview */}
      <ScrollReveal direction="up" distance={30} duration={0.6}>
        <ClinicOverview 
          onOpenScheduler={() => onOpenScheduler()} 
        />
      </ScrollReveal>

      {/* 7. Latest Health Insights (Medical Blog Posts & Guidance) */}
      <ScrollReveal direction="up" distance={30} duration={0.6}>
        <LatestHealthInsights 
          onOpenScheduler={onOpenScheduler}
          maxPosts={3}
        />
      </ScrollReveal>

      {/* 8. Bottom Call-to-Action Section with Scroll Reveal */}
      <section className="bg-gradient-to-b from-[#f0f9f8] to-[#e6f7f5] py-16 sm:py-20 border-t border-teal-100 relative overflow-hidden">
        {/* Subtle background circle decorations matching hero style */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-300/20 blur-3xl pointer-events-none" />

        <ScrollReveal direction="up" distance={25} duration={0.65} className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Eyebrow Pill matching Hero */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#00897b] border border-[#b8ece6] shadow-xs mb-4">
            <Sparkles className="w-4 h-4 text-[#00897b]" strokeWidth={2.5} />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              Your Health, Our Highest Calling
            </span>
          </div>

          {/* Heading matching Hero Typography */}
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tight leading-tight font-heading">
            Experience Healthcare <br />
            <span className="text-[#00897b]">That Puts You and Your Family First</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Book your consultation slot with our senior medical specialists in under 60 seconds. Enjoy zero waiting time, certified on-site diagnostics, and digital WhatsApp prescriptions.
          </p>

          {/* Action Buttons matching Hero Button styles */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenScheduler()}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#00897b] hover:bg-[#00796b] text-white text-sm font-bold rounded-xl shadow-md shadow-[#00897b]/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenSymptomChecker}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 text-sm font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#00897b]" />
              <span>Try AI Symptom Triage</span>
            </button>
          </div>

          {/* Floating Trust Metrics matching Hero Badges */}
          <div className="mt-10 pt-8 border-t border-teal-200/60 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00897b]" />
              <span>50,000+ Verified Patient Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00897b]" />
              <span>4.9 / 5 Star Community Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00897b]" />
              <span>100% Cashless TPA &amp; Insurance Desk</span>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
