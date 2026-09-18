import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { 
  Building2, 
  FlaskConical, 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall, 
  Info, 
  X, 
  Sparkles,
  Award
} from 'lucide-react';
import { DIAGNOSTIC_TESTS, CLINIC_FACILITIES, CLINIC_INFO } from '../data/clinicData';
import { ClinicFacility } from '../types';

interface DiagnosticsPageProps {
  onOpenScheduler?: (prefill?: any) => void;
}

export const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({ onOpenScheduler }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  // Primary tab: facilities vs diagnostics
  const isFacilityRoute = location.pathname.startsWith('/facilities');
  const [activeTab, setActiveTab] = useState<'facilities' | 'diagnostics'>(
    isFacilityRoute ? 'facilities' : 'diagnostics'
  );

  // Sync tab with route if user navigates via browser back/forward
  useEffect(() => {
    if (location.pathname.startsWith('/facilities')) {
      setActiveTab('facilities');
    } else if (location.pathname.startsWith('/diagnostics')) {
      setActiveTab('diagnostics');
    }
  }, [location.pathname]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacilityModal, setSelectedFacilityModal] = useState<ClinicFacility | null>(null);

  // Facilities Categories
  const facilityCategories = ['all', ...Array.from(new Set(CLINIC_FACILITIES.map(f => f.category)))];
  // Diagnostic Test Categories
  const testCategories = ['all', ...Array.from(new Set(DIAGNOSTIC_TESTS.map(t => t.category)))];

  const activeCategoryParam = searchParams.get('category') || (categorySlug ? decodeURIComponent(categorySlug) : 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategoryParam);

  useEffect(() => {
    const currentParam = searchParams.get('category') || (categorySlug ? decodeURIComponent(categorySlug) : 'all');
    setSelectedCategory(currentParam);
  }, [searchParams, categorySlug]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat !== 'all') {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleTabChange = (tab: 'facilities' | 'diagnostics') => {
    setActiveTab(tab);
    setSelectedCategory('all');
    setSearchQuery('');
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  // Filter facilities
  const filteredFacilities = CLINIC_FACILITIES.filter(facility => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      facility.name.toLowerCase().includes(q) ||
      facility.description.toLowerCase().includes(q) ||
      facility.category.toLowerCase().includes(q) ||
      facility.location.toLowerCase().includes(q) ||
      facility.features.some(f => f.toLowerCase().includes(q));

    const matchesCategory = selectedCategory === 'all' || facility.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Filter diagnostics
  const filteredTests = DIAGNOSTIC_TESTS.filter(test => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      test.name.toLowerCase().includes(q) ||
      test.description.toLowerCase().includes(q) ||
      test.category.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'all' || test.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Header Hero Banner with Tab Switcher */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border border-teal-800/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>NABH Accredited Infrastructure &amp; NABL Diagnostics</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight">
            Advanced Clinical Facilities &amp; <br />
            <span className="text-teal-300">Modern Medical Infrastructure</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl">
            CarePlus Hospital (Demo) features hospital-grade infrastructure in Central Delhi, including a monitored daycare bay, certified pharmacy, advanced physical therapy gym, and NABL-partnered pathology diagnostics.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-xl font-black text-teal-300 block">4 Beds</span>
              <span className="text-[11px] text-slate-300">Monitored Daycare Bay</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-xl font-black text-teal-300 block">100%</span>
              <span className="text-[11px] text-slate-300">Genuine In-Clinic Pharmacy</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-xl font-black text-teal-300 block">15 Mins</span>
              <span className="text-[11px] text-slate-300">Digital ECG Reports</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-xl font-black text-teal-300 block">Same Day</span>
              <span className="text-[11px] text-slate-300">WhatsApp Digital Lab Reports</span>
            </div>
          </div>
        </div>

        {/* Major Segment Switcher Tabs */}
        <div className="mt-8 pt-6 border-t border-teal-800/50 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleTabChange('facilities')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'facilities'
                ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Clinic Facilities &amp; Infrastructure ({CLINIC_FACILITIES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('diagnostics')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Pathology &amp; Diagnostic Lab Tests ({DIAGNOSTIC_TESTS.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={
                activeTab === 'facilities'
                  ? "Search facilities (e.g. Daycare, Pharmacy, Physio Gym, ECG)..."
                  : "Search tests (e.g. CBC, Lipid, Thyroid, HbA1c, Vitamin)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {(activeTab === 'facilities' ? facilityCategories : testCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? (activeTab === 'facilities' ? 'All Facility Types' : 'All Test Categories') : cat}
                </option>
              ))}
            </select>

            <Link
              to="/book"
              className="px-4 py-2.5 bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          {(activeTab === 'facilities' ? facilityCategories : testCategories).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#00897b] text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? (activeTab === 'facilities' ? 'All Facilities' : 'All Tests') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CLINIC FACILITIES SECTION - EVERY FACILITY HAS ITS OWN RELATED IMAGE */}
      {/* ========================================================================= */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Clinic Facilities &amp; Departments
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Showing {filteredFacilities.length} specialized facilities located in our Old Rajinder Nagar premises
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Dedicated High-Resolution Facility Image Banner */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                      {facility.category}
                    </span>
                    {facility.badge && (
                      <span className="bg-teal-950/85 backdrop-blur-md text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-400/40 uppercase tracking-wide">
                        {facility.badge}
                      </span>
                    )}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white font-heading leading-snug drop-shadow-sm group-hover:text-teal-200 transition-colors">
                      {facility.name}
                    </h3>
                  </div>
                </div>

                {/* Facility Details */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3">
                    {/* Location & Operating Hours */}
                    <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-[#00897b] flex-shrink-0" />
                        <span>{facility.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{facility.operationalHours}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {facility.description}
                    </p>

                    {/* Features list */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Equipment &amp; Highlights
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {facility.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00897b] flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2 justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedFacilityModal(facility)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenScheduler) {
                          onOpenScheduler();
                        }
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00897b] hover:bg-[#00796b] text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DIAGNOSTIC TESTS SECTION - EVERY TEST HAS ITS OWN RELATED IMAGE       */}
      {/* ========================================================================= */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Pathology Profiles &amp; Diagnostic Tests
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                NABL Accredited In-House &amp; Doorstep Phlebotomy Sample Collection
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Dedicated Test Image */}
                {test.image && (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={test.image}
                      alt={test.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wide">
                        {test.category}
                      </span>
                      {test.fastingRequired && (
                        <span className="bg-amber-950/85 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                          8-10h Fasting
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3">
                      <span className="text-[11px] text-teal-200 font-medium">Sample: {test.sampleType}</span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-[#00897b] transition-colors leading-tight">
                      {test.name}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {test.description}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Turnaround Time:</span>
                        <span className="font-semibold text-slate-800">{test.turnaroundTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Reports Format:</span>
                        <span className="font-semibold text-[#00897b]">WhatsApp &amp; PDF</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard Fee</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{test.price}
                      </span>
                    </div>

                    <Link
                      to="/book?service=diagnostics-pathology"
                      className="px-4 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Test</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facility Detail Modal */}
      {selectedFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Image Header */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
              <img
                src={selectedFacilityModal.image}
                alt={selectedFacilityModal.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              
              <button
                type="button"
                onClick={() => setSelectedFacilityModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4">
                <span className="bg-teal-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
                  {selectedFacilityModal.category}
                </span>
                <h3 className="text-xl font-bold text-white font-heading leading-tight">
                  {selectedFacilityModal.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-[#00897b] flex-shrink-0" />
                  <span className="font-semibold">{selectedFacilityModal.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="font-semibold">{selectedFacilityModal.operationalHours}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Overview</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedFacilityModal.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Equipment &amp; Features</h4>
                <div className="space-y-2">
                  {selectedFacilityModal.features.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#00897b] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 p-3.5 rounded-2xl border border-teal-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#00897b]" />
                  <span className="text-xs text-slate-700 font-medium">Direct Desk: {CLINIC_INFO.phoneAppointments1}</span>
                </div>
                <a
                  href={`tel:${CLINIC_INFO.phoneAppointments1.replace(/\s+/g, '')}`}
                  className="text-xs font-bold text-[#00897b] hover:underline"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedFacilityModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFacilityModal(null);
                  if (onOpenScheduler) onOpenScheduler();
                }}
                className="px-5 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule an Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
