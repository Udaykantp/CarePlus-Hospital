import React from 'react';
import { 
  Calendar, 
  Clock, 
  Award, 
  MapPin, 
  Star, 
  ShieldCheck, 
  GraduationCap, 
  ChevronRight,
  Languages,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { DOCTORS } from '../data/clinicData';
import { Doctor } from '../types';
import { ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';

interface DoctorProfilesProps {
  onSelectDoctor: (doctorId: string, departmentId: string) => void;
}

export const DoctorProfiles: React.FC<DoctorProfilesProps> = ({ onSelectDoctor }) => {
  return (
    <section id="doctors-section" className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header matching Hero Section Design */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-xs mb-3">
            <Stethoscope className="w-4 h-4 text-[#00897b]" strokeWidth={2.5} />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              Distinguished Medical Faculty
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight font-heading">
            Meet Our Senior Specialists <br />
            <span className="text-[#00897b]">Decades of Trusted Clinical Excellence</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our experienced team of specialist physicians, spine and joint surgeons, physical therapists, and diagnostic consultants bring compassionate, evidence-based healthcare to you and your family.
          </p>
        </div>

        {/* Doctors Grid with staggered scroll reveal */}
        <ScrollRevealGroup staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DOCTORS.map((doc: Doctor) => (
            <ScrollRevealItem key={doc.id}>
              <div 
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group shadow-sm h-full"
              >
              <div>
                {/* Doctor Avatar & Floating Trust Badges */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={doc.avatar} 
                    alt={doc.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl border border-white/10 shadow-xs">
                    {doc.experienceYears}+ Years Exp.
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-md border border-slate-100 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-slate-400 text-[10px]">({doc.totalReviews})</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#00897b] uppercase tracking-wider block mb-1">
                      {doc.departmentName}
                    </span>
                    
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00897b] transition-colors font-heading leading-snug">
                      {doc.name}
                    </h3>

                    <p className="text-xs text-slate-700 font-medium line-clamp-1 mt-0.5">
                      {doc.title}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#00897b] flex-shrink-0" />
                    <span className="truncate">{doc.qualifications}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {doc.bio}
                  </p>

                  {/* Languages & Room */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#00897b]" />
                        <span>OPD Hours</span>
                      </span>
                      <span className="font-bold text-slate-800 text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {doc.timingSummary.split('&')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.roomNumber}</span>
                      </span>
                      <span className="text-slate-600">
                        OPD Fee: <strong className="text-slate-900 font-bold">₹{doc.consultationFee}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action matching Hero Primary Button */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectDoctor(doc.id, doc.departmentId)}
                  className="w-full py-2.5 px-4 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#00897b]/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation Slot</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
};
