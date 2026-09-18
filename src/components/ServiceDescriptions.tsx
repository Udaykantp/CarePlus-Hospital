import React, { useState } from 'react';
import { 
  Activity, 
  Stethoscope, 
  Bone, 
  Sparkles, 
  Wind, 
  ShieldAlert, 
  Apple, 
  Baby, 
  TestTube, 
  Building2, 
  Search, 
  CheckCircle, 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  Info, 
  FileText, 
  HelpCircle, 
  Clock, 
  X,
  UserCheck
} from 'lucide-react';
import { SERVICES, DOCTORS } from '../data/clinicData';
import { ServiceDepartment } from '../types';
import { ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';

interface ServiceDescriptionsProps {
  onBookService: (departmentId: string, doctorId?: string) => void;
}

// Icon mapper for dynamic service icons
const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Activity': return <Activity className="w-6 h-6 text-teal-600" />;
    case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-teal-600" />;
    case 'Bone': return <Bone className="w-6 h-6 text-teal-600" />;
    case 'Sparkles': return <Sparkles className="w-6 h-6 text-teal-600" />;
    case 'Wind': return <Wind className="w-6 h-6 text-teal-600" />;
    case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-teal-600" />;
    case 'Apple': return <Apple className="w-6 h-6 text-teal-600" />;
    case 'Baby': return <Baby className="w-6 h-6 text-teal-600" />;
    case 'TestTube': return <TestTube className="w-6 h-6 text-teal-600" />;
    case 'Building2': return <Building2 className="w-6 h-6 text-teal-600" />;
    default: return <Stethoscope className="w-6 h-6 text-teal-600" />;
  }
};

export const ServiceDescriptions: React.FC<ServiceDescriptionsProps> = ({ onBookService }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedService, setExpandedService] = useState<ServiceDepartment | null>(null);

  const categories = ['All', 'Rehabilitation & Pain Relief', 'Primary & Preventive Care', 'Orthopaedics & Musculoskeletal', 'Skin, Hair & Aesthetics', 'Respiratory & Lung Health', 'Specialized Oncology', 'Nutritional Therapy & Wellness', 'Child & Infant Care', 'Diagnostics & Lab'];

  // Filter services by search & category
  const filteredServices = SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = 
      service.title.toLowerCase().includes(q) ||
      service.shortDesc.toLowerCase().includes(q) ||
      service.keyConditions.some(c => c.toLowerCase().includes(q)) ||
      service.treatmentProcedures.some(p => p.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services-section" className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header matching Hero Section Design */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-xs mb-3">
            <Activity className="w-4 h-4 text-[#00897b]" strokeWidth={2.5} />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              Comprehensive Clinical Departments
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight font-heading">
            Multispeciality Services <br />
            <span className="text-[#00897b]">for Every Stage of Life</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From specialized one-on-one physiotherapy and orthopaedics to internal medicine, dermatology, and on-site diagnostics, our clinic provides continuous outpatient care under one roof.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-10 space-y-3.5">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments or conditions (e.g. sciatica, acne, asthma, dry needling, knee pain, diabetes)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00897b]/30 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded-lg cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips matching Hero Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00897b] text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid matching Hero Card aesthetic with scroll reveal */}
        <ScrollRevealGroup staggerDelay={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const doctorsInService = DOCTORS.filter(d => service.doctorIds.includes(d.id));

            return (
              <ScrollRevealItem key={service.id}>
                <div 
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full"
                >
                  {/* Service Related Image Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                        {service.category}
                      </span>
                      {service.badge && (
                        <span className="bg-amber-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40 uppercase tracking-wide">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs text-[#00897b] flex items-center justify-center shadow-xs border border-white/40">
                        {getServiceIcon(service.iconName)}
                      </div>
                      <span className="text-white text-xs font-bold font-heading drop-shadow-sm truncate max-w-[200px]">
                        {service.title}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading group-hover:text-[#00897b] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {service.shortDesc}
                      </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {service.highlightPoints.slice(0, 3).map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00897b] flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Conditions Treated Tags */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Key Conditions Treated
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {service.keyConditions.slice(0, 4).map((cond, i) => (
                        <span 
                          key={i} 
                          className="bg-slate-50 text-slate-700 border border-slate-200/70 text-[11px] px-2.5 py-0.5 rounded-md font-medium"
                        >
                          {cond}
                        </span>
                      ))}
                      {service.keyConditions.length > 4 && (
                        <span className="text-[10px] text-[#00897b] font-bold px-1.5 py-0.5 bg-teal-50 rounded-md">
                          +{service.keyConditions.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Associated Doctor snippet */}
                  {doctorsInService.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
                      <img 
                        src={doctorsInService[0].avatar} 
                        alt={doctorsInService[0].name} 
                        className="w-9 h-9 rounded-full object-cover border-2 border-teal-200"
                      />
                      <div className="text-xs">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department Head</span>
                        <span className="font-bold text-slate-800">{doctorsInService[0].name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions matching Hero Buttons */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedService(service)}
                    className="text-xs font-bold text-slate-700 hover:text-[#00897b] flex items-center gap-1.5 cursor-pointer transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
                  >
                    <Info className="w-3.5 h-3.5 text-[#00897b]" />
                    <span>Clinical Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookService(service.id, doctorsInService[0]?.id)}
                    className="px-4 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#00897b]/20 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Service</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollRevealItem>
          );
        })}
      </ScrollRevealGroup>

        {/* If no services match search */}
        {filteredServices.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 max-w-md mx-auto">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 mb-1">No matching clinical services found</h4>
            <p className="text-xs text-slate-500 mb-4">
              Try searching with different medical terms or reset filters to explore all departments.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ================= DETAILED SERVICE MODAL (DEEP DIVE & PREPARATION) ================= */}
      {expandedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Image Header Banner */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
              <img
                src={expandedService.image}
                alt={expandedService.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setExpandedService(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-teal-500/30 text-teal-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-400/40 uppercase">
                    {expandedService.category}
                  </span>
                  {expandedService.badge && (
                    <span className="text-amber-300 text-xs font-semibold">
                      &bull; {expandedService.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading">
                  {expandedService.title}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Comprehensive Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Clinical Overview & Approach
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {expandedService.fullDesc}
                </p>
              </div>

              {/* Conditions Treated */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Conditions Evaluated & Treated
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {expandedService.keyConditions.map((cond, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment Procedures */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Procedures & Clinical Modalities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {expandedService.treatmentProcedures.map((proc, i) => (
                    <span key={i} className="bg-teal-50 text-teal-900 border border-teal-200 text-xs font-medium px-3 py-1 rounded-md">
                      {proc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Patient Preparation Guidelines */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>Patient Preparation & What to Bring</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950">
                  {expandedService.preparationGuidelines.map((guideline, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">&bull;</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consultation Fee Guidance */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Pricing & Fee Structure</span>
                  <p className="text-sm font-bold text-slate-900">{expandedService.pricingRange}</p>
                </div>
                <span className="text-xs text-slate-500">Transparent billing</span>
              </div>

              {/* Department FAQs */}
              {expandedService.faqs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>Frequently Asked Questions</span>
                  </h4>
                  <div className="space-y-3">
                    {expandedService.faqs.map((faq, i) => (
                      <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                        <p className="font-bold text-slate-900 mb-1">{faq.question}</p>
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setExpandedService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetDeptId = expandedService.id;
                  const doc = DOCTORS.find(d => expandedService.doctorIds.includes(d.id));
                  setExpandedService(null);
                  onBookService(targetDeptId, doc?.id);
                }}
                className="px-5 py-2.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl shadow-md shadow-[#00897b]/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Consultation for this Department</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
