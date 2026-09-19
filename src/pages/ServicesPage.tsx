import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Stethoscope, 
  Calendar, 
  HeartPulse, 
  RefreshCw, 
  AlertCircle,
  X,
  FileText,
  CheckCircle,
  Clock,
  HelpCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { SERVICES, DOCTORS } from '../data/clinicData';
import { ServiceDepartment } from '../types';
import { ServiceGridSkeleton } from '../components/skeletons';
import { ScrollRevealGroup, ScrollRevealItem } from '../components/ScrollReveal';

interface ServicesPageProps {
  onSelectService?: (departmentId: string) => void;
  isLoading?: boolean;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onSelectService, isLoading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(isLoading ?? true);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceDepartment | null>(null);
  
  const categories = ['all', ...Array.from(new Set(SERVICES.map(s => s.category)))];

  const findMatchedCategory = (param?: string | null) => {
    if (!param) return 'all';
    const decoded = decodeURIComponent(param).trim().toLowerCase();
    // 1. Direct category match
    const catMatch = categories.find(c => c.toLowerCase() === decoded);
    if (catMatch) return catMatch;
    // 2. Service ID or partial title match
    const svcMatch = SERVICES.find(s => 
      s.id.toLowerCase() === decoded ||
      s.id.toLowerCase().replace(/[^a-z0-9]/g, '') === decoded.replace(/[^a-z0-9]/g, '') ||
      s.category.toLowerCase().includes(decoded) ||
      s.title.toLowerCase().includes(decoded)
    );
    if (svcMatch) return svcMatch.category;
    return 'all';
  };

  // Derive initial category from query param or route slug
  const activeParam = searchParams.get('category') || categorySlug;
  const matchedCategory = findMatchedCategory(activeParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(matchedCategory);

  useEffect(() => {
    const currentParam = searchParams.get('category') || categorySlug;
    setSelectedCategory(findMatchedCategory(currentParam));
  }, [searchParams, categorySlug]);

  // Handle perceived loading state when data is being fetched or category filtered
  useEffect(() => {
    if (isLoading !== undefined) {
      setLoading(isLoading);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, isLoading]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category !== 'all') {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.keyConditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      service.treatmentProcedures.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-2 sm:space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <Activity className="w-3.5 h-3.5" />
            Clinical Specialties &amp; Care
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Specialised Treatments &amp; Clinical Services
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
            Every clinical department is equipped with modern diagnostics, dedicated specialists, and evidence-based protocols to restore your health.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search treatments, symptoms, or conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 flex-1 sm:flex-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Clinical Categories' : cat}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh specialties list"
              aria-label="Refresh specialties list"
              className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer flex-shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton / Services Grid */}
      {loading ? (
        <ServiceGridSkeleton count={6} />
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Services Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No specialties or treatments matched "{searchQuery || selectedCategory}". Try adjusting your search query or choosing all categories.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              handleCategorySelect('all');
            }}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Reset Search &amp; Filters</span>
          </button>
        </div>
      ) : (
        <ScrollRevealGroup staggerDelay={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ScrollRevealItem key={service.id}>
              <div
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full"
              >
                {/* 1. Service Related Image Banner */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                  
                  {/* Category and Badge overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                      {service.category}
                    </span>
                    {service.badge && (
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-amber-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/40 shadow-xs">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title overlay in image footer for strong context */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-tight drop-shadow-sm group-hover:text-teal-200 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* 2. Card Content */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3.5">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    {/* Common Conditions Treated */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Common Conditions Treated
                      </span>
                      <div className="space-y-1 text-xs text-slate-600">
                        {service.keyConditions.slice(0, 3).map((condition, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                            <span className="truncate">{condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Modalities */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs border border-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Key Modalities</span>
                      <p className="text-slate-700 text-xs font-medium line-clamp-2">
                        {service.treatmentProcedures.slice(0, 3).join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* 3. Card Footer with Fee, Details & Booking */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Indicative Fee</span>
                      <span className="text-xs font-extrabold text-slate-900 truncate block">
                        {service.pricingRange}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedServiceForModal(service)}
                        className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        title="View treatment details & FAQs"
                      >
                        Details
                      </button>

                      {onSelectService ? (
                        <button
                          type="button"
                          onClick={() => onSelectService(service.id)}
                          className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <Link
                          to={`/book?service=${service.id}`}
                          className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      )}

      {/* Detailed Service Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Image Header Banner */}
            <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-900">
              <img
                src={selectedServiceForModal.image}
                alt={selectedServiceForModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                type="button"
                onClick={() => setSelectedServiceForModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-teal-500/30 text-teal-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-400/40 uppercase">
                    {selectedServiceForModal.category}
                  </span>
                  {selectedServiceForModal.badge && (
                    <span className="text-amber-300 text-xs font-semibold">
                      &bull; {selectedServiceForModal.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading">
                  {selectedServiceForModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Comprehensive Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Clinical Overview &amp; Care Approach
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedServiceForModal.fullDesc}
                </p>
              </div>

              {/* Conditions Treated */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Conditions Evaluated &amp; Treated
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedServiceForModal.keyConditions.map((cond, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment Procedures */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Procedures &amp; Clinical Modalities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedServiceForModal.treatmentProcedures.map((proc, i) => (
                    <span key={i} className="bg-teal-50 text-teal-900 border border-teal-200 text-xs font-medium px-3 py-1 rounded-lg">
                      {proc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Patient Preparation Guidelines */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>Patient Preparation &amp; What to Bring</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950">
                  {selectedServiceForModal.preparationGuidelines.map((guideline, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">&bull;</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQs if available */}
              {selectedServiceForModal.faqs && selectedServiceForModal.faqs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>Frequently Asked Questions</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedServiceForModal.faqs.map((faq, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                        <p className="font-bold text-slate-900">{faq.question}</p>
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Indicative Fee Structure</span>
                  <p className="text-sm font-extrabold text-slate-900">{selectedServiceForModal.pricingRange}</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedServiceForModal(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer flex-1 sm:flex-none text-center"
                  >
                    Close
                  </button>

                  {onSelectService ? (
                    <button
                      type="button"
                      onClick={() => {
                        const sId = selectedServiceForModal.id;
                        setSelectedServiceForModal(null);
                        onSelectService(sId);
                      }}
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-1 sm:flex-none"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Consultation</span>
                    </button>
                  ) : (
                    <Link
                      to={`/book?service=${selectedServiceForModal.id}`}
                      onClick={() => setSelectedServiceForModal(null)}
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-1 sm:flex-none"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Consultation</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
