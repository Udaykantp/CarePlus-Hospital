import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ExternalLink,
  MessageCircle,
  Building,
  Heart,
  Award,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { CLINIC_INFO, REVIEWS, CLINIC_FACILITIES } from '../data/clinicData';
import { ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';

interface ClinicOverviewProps {
  onOpenScheduler: () => void;
}

export const ClinicOverview: React.FC<ClinicOverviewProps> = ({ onOpenScheduler }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const GENERAL_FAQS = [
    {
      q: "Where is CarePlus Hospital (Demo) located?",
      a: "We are located at 29/25, Old Rajinder Nagar, New Delhi - 110060, easily accessible from Karol Bagh Metro Station, Pusa Road, and Sir Ganga Ram Hospital Marg."
    },
    {
      q: "What are the clinic OPD operating hours?",
      a: "Our clinic is open Monday through Saturday from 9:00 AM to 9:00 PM. On Sundays, emergency on-call support and pre-scheduled daycare or physiotherapy sessions are accommodated."
    },
    {
      q: "Do I need a prior appointment or are walk-ins accepted?",
      a: "While walk-in patients are always welcomed at our reception triage, booking a scheduled appointment online or by phone guarantees priority zero-wait consultation with your designated specialist."
    },
    {
      q: "Do you provide home physiotherapy and home blood sample collection?",
      a: "Yes! Our certified physiotherapists provide doorstep rehabilitation sessions, and our phlebotomy team conducts home blood sample collection across Central Delhi including Old & New Rajinder Nagar, Karol Bagh, and Patel Nagar."
    },
    {
      q: "What modes of payment are accepted at the clinic?",
      a: "We accept all standard payment methods including UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Cash, and provide itemized computerized bills for medical insurance reimbursement."
    }
  ];

  return (
    <section id="clinic-info-section" className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header matching Hero Section Design */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-xs mb-3">
            <ShieldCheck className="w-4 h-4 text-[#00897b]" strokeWidth={2.5} />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              Clinical Excellence & Patient Trust
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight font-heading">
            World-Class Infrastructure <br />
            <span className="text-[#00897b]">Centred Around Patient Comfort</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A premier healthcare facility built on compassionate clinical ethics, advanced diagnostic technology, and attentive patient recovery in Central Delhi.
          </p>
        </div>

        {/* Clinic Facilities Grid matching Hero Features with scroll reveal */}
        <div className="space-y-6 mb-16">
          <ScrollRevealGroup staggerDelay={0.08} id="facilities" className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-mt-28">
            {CLINIC_FACILITIES.slice(0, 6).map((facility) => (
              <ScrollRevealItem key={facility.id}>
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full">
                  {/* Dedicated Facility Image Banner */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={facility.image}
                      alt={facility.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent" />
                    
                    {/* Category & Badge overlay */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                        {facility.category}
                      </span>
                      {facility.badge && (
                        <span className="bg-teal-950/80 backdrop-blur-md text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-400/40 uppercase tracking-wide">
                          {facility.badge}
                        </span>
                      )}
                    </div>

                    {/* Facility name overlay on image footer */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-base font-bold text-white font-heading leading-tight drop-shadow-sm group-hover:text-teal-200 transition-colors">
                        {facility.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#00897b] flex-shrink-0" />
                          <span className="font-medium text-slate-700">{facility.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{facility.operationalHours}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {facility.description}
                      </p>

                      <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {facility.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00897b] flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">CarePlus Infrastructure</span>
                      <Link
                        to="/facilities"
                        className="text-xs font-bold text-[#00897b] hover:text-teal-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>

          <div className="text-center pt-2">
            <Link
              to="/facilities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#00897b] border border-teal-200 text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <span>Explore All Clinic Facilities &amp; In-House Diagnostics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Patient Reviews Section matching Hero Floating Badge aesthetic */}
        <div id="reviews" className="mb-16 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-bold text-[#00897b] uppercase tracking-wider">Patient Testimonials</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
                Verified Patient Experiences
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-[#e6f7f5] px-3.5 py-2 rounded-xl border border-[#b8ece6] shadow-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <span className="font-extrabold text-slate-900">4.9 / 5</span>
              <span className="text-slate-600 font-medium">(Over 50,000+ local patients)</span>
            </div>
          </div>

          <ScrollRevealGroup staggerDelay={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map(rev => (
              <ScrollRevealItem key={rev.id}>
                <div 
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rev.patientName}</span>
                      <span className="text-[10px] text-[#00897b] font-bold bg-[#e6f7f5] px-2 py-0.5 rounded-full border border-[#b8ece6]">Verified</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rev.doctorOrService}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{rev.area} &bull; {rev.date}</p>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>

        {/* Location & Contact Grid */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden mb-16 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <span className="bg-[#00897b]/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30 uppercase tracking-wide">
                  Visit The Clinic
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading mt-3 text-white">
                  CarePlus Hospital (Demo)
                </h3>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  Conveniently situated in Old Rajinder Nagar with ample parking and direct metro connectivity.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm font-bold">Clinic Address:</strong>
                    <p className="text-slate-300">{CLINIC_INFO.address}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Landmark: Close to Karol Bagh Metro / Shankar Road / Pusa Road</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm font-bold">Clinical Hours:</strong>
                    <p className="text-slate-300">{CLINIC_INFO.operatingHours}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{CLINIC_INFO.sundayHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm font-bold">Direct Phone Inquiries:</strong>
                    <p className="text-slate-300">
                      Helpline: <a href={`tel:${CLINIC_INFO.phonePrimary.replace(/[^0-9]/g, '')}`} className="text-teal-300 hover:underline">{CLINIC_INFO.phonePrimary}</a>
                    </p>
                    <p className="text-slate-300">
                      Appointments: <a href="tel:+918448960011" className="text-teal-300 hover:underline">+91 84489 60011</a> / <a href="tel:+917367863233" className="text-teal-300 hover:underline">+91 73678 63233</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenScheduler}
                  className="px-6 py-3.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-[#00897b]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Book Appointment Slot
                </button>
                <a
                  href="https://maps.google.com/?q=29/25+Old+Rajinder+Nagar+New+Delhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>

            {/* Visual Location Card */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-700">
                <span>Clinic Accessibility</span>
                <span className="text-teal-300 font-semibold">Delhi Metro Accessible</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                  <span className="font-semibold text-white">Karol Bagh Metro (Blue Line)</span>
                  <span className="text-teal-300 font-medium">800m (5 min walk)</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                  <span className="font-semibold text-white">Rajendra Place Metro (Blue Line)</span>
                  <span className="text-slate-400">1.2 km</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                  <span className="font-semibold text-white">Sir Ganga Ram Hospital Marg</span>
                  <span className="text-slate-400">600 meters</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00897b]"></span>
                <span>Ground floor ramp access available for wheelchairs and senior citizens.</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#00897b] uppercase tracking-wider">Patient Support</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {GENERAL_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-teal-200 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#00897b] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
