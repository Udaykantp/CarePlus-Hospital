import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Stethoscope, 
  HeartPulse, 
  TestTube, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Star, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { DOCTORS, SERVICES, DIAGNOSTIC_TESTS, CLINIC_INFO } from '../data/clinicData';

interface GlobalSearchBarProps {
  onOpenScheduler: (prefill?: { doctorId?: string; departmentId?: string }) => void;
  className?: string;
  placeholder?: string;
  isMobileDrawer?: boolean;
  onResultSelect?: () => void;
}

type SearchCategory = 'all' | 'doctors' | 'services' | 'tests';

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onOpenScheduler,
  className = '',
  placeholder = "Search doctors, services, or diagnostic tests...",
  isMobileDrawer = false,
  onResultSelect
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Listen for Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search Results Filtering
  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return { doctors: [], services: [], tests: [], total: 0 };

    const matchedDoctors = DOCTORS.filter(d => 
      d.name.toLowerCase().includes(trimmed) ||
      d.title.toLowerCase().includes(trimmed) ||
      d.departmentName.toLowerCase().includes(trimmed) ||
      d.qualifications.toLowerCase().includes(trimmed) ||
      d.bio.toLowerCase().includes(trimmed)
    );

    const matchedServices = SERVICES.filter(s => 
      s.title.toLowerCase().includes(trimmed) ||
      s.category.toLowerCase().includes(trimmed) ||
      s.shortDesc.toLowerCase().includes(trimmed) ||
      s.keyConditions.some(c => c.toLowerCase().includes(trimmed))
    );

    const matchedTests = DIAGNOSTIC_TESTS.filter(t => 
      t.name.toLowerCase().includes(trimmed) ||
      t.category.toLowerCase().includes(trimmed) ||
      t.description.toLowerCase().includes(trimmed) ||
      t.sampleType.toLowerCase().includes(trimmed)
    );

    return {
      doctors: matchedDoctors,
      services: matchedServices,
      tests: matchedTests,
      total: matchedDoctors.length + matchedServices.length + matchedTests.length
    };
  }, [query]);

  const handleSelectDoctor = (doctorId: string, deptId: string) => {
    setIsOpen(false);
    setQuery('');
    if (onResultSelect) onResultSelect();
    navigate(`/doctors`);
  };

  const handleBookDoctor = (doctorId: string, deptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setQuery('');
    if (onResultSelect) onResultSelect();
    onOpenScheduler({ doctorId, departmentId: deptId });
  };

  const handleSelectService = (serviceId: string) => {
    setIsOpen(false);
    setQuery('');
    if (onResultSelect) onResultSelect();
    navigate(`/services`);
  };

  const handleBookService = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setQuery('');
    if (onResultSelect) onResultSelect();
    onOpenScheduler({ departmentId: serviceId });
  };

  const handleSelectTest = (testId: string) => {
    setIsOpen(false);
    setQuery('');
    if (onResultSelect) onResultSelect();
    navigate(`/diagnostics`);
  };

  const handleBookTest = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setQuery('');
    if (onResultSelect) onResultSelect();
    onOpenScheduler({ departmentId: 'diagnostics-pathology' });
  };

  const trendingKeywords = [
    { label: 'Dr. Bibhu Bishwas', category: 'doctors' as SearchCategory },
    { label: 'Cardiology', category: 'services' as SearchCategory },
    { label: 'Complete Hemogram (CBC)', category: 'tests' as SearchCategory },
    { label: 'Physiotherapy & Rehab', category: 'services' as SearchCategory },
    { label: 'Lipid Profile', category: 'tests' as SearchCategory },
    { label: 'Dr. Mehak Arora', category: 'doctors' as SearchCategory },
    { label: 'Full Body Checkup', category: 'tests' as SearchCategory }
  ];

  const showDoctors = activeCategory === 'all' || activeCategory === 'doctors';
  const showServices = activeCategory === 'all' || activeCategory === 'services';
  const showTests = activeCategory === 'all' || activeCategory === 'tests';

  const hasAnyResults = results.total > 0;
  const isQueryEmpty = query.trim() === '';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-[#00897b]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 focus:border-[#00897b] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00897b]/20 text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
          aria-label="Global Search for Doctors, Services, and Tests"
        />

        {/* Right actions inside input: Clear button and keyboard shortcut hint */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Dropdown Results Popover */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
          isMobileDrawer ? 'max-h-[60vh]' : 'max-h-[480px]'
        } flex flex-col`}>

          {/* Category Filter Chips */}
          <div className="px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-[#00897b] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              All Results {hasAnyResults && `(${results.total})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('doctors')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeCategory === 'doctors'
                  ? 'bg-[#00897b] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <Stethoscope className="w-3 h-3" />
              <span>Doctors {results.doctors.length > 0 && `(${results.doctors.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('services')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeCategory === 'services'
                  ? 'bg-[#00897b] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <HeartPulse className="w-3 h-3" />
              <span>Services {results.services.length > 0 && `(${results.services.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('tests')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeCategory === 'tests'
                  ? 'bg-[#00897b] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <TestTube className="w-3 h-3" />
              <span>Lab Tests {results.tests.length > 0 && `(${results.tests.length})`}</span>
            </button>
          </div>

          {/* Results Scroll Area */}
          <div className="overflow-y-auto flex-1 p-3 space-y-4">
            
            {/* Empty State: Trending Searches */}
            {isQueryEmpty && (
              <div className="py-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#00897b]" />
                  <span>Popular &amp; Recommended Searches</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {trendingKeywords.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuery(item.label);
                        setActiveCategory(item.category);
                      }}
                      className="px-3 py-1.5 bg-slate-100/90 hover:bg-teal-50 hover:text-[#00897b] border border-slate-200/80 hover:border-teal-200 rounded-full text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Search className="w-3 h-3 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Looking for emergency help?</span>
                  <a 
                    href={`tel:${CLINIC_INFO.phonePrimary.replace(/[^0-9]/g, '')}`} 
                    className="text-red-600 font-bold hover:underline"
                  >
                    Call 24/7 Helpline ({CLINIC_INFO.phonePrimary})
                  </a>
                </div>
              </div>
            )}

            {/* No Results Found */}
            {!isQueryEmpty && !hasAnyResults && (
              <div className="py-8 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No matches for "{query}"</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try searching with generic terms like "Heart", "Physio", "Skin", "Blood test", or doctor names like "Bibhu" or "Mehak".
                </p>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mt-3 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* 1. DOCTORS MATCHES */}
            {!isQueryEmpty && showDoctors && results.doctors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#00897b]" />
                    Specialist Doctors ({results.doctors.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/doctors');
                    }}
                    className="text-[11px] text-[#00897b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All Doctors</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {results.doctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDoctor(doc.id, doc.departmentId)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/90 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#00897b] transition-colors leading-tight">
                              {doc.name}
                            </h4>
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.2 rounded">
                              <Star className="w-2.5 h-2.5 fill-amber-500" />
                              {doc.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#00897b] font-medium leading-tight mt-0.5">
                            {doc.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {doc.experienceYears}+ yrs exp &bull; {doc.qualifications}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleBookDoctor(doc.id, doc.departmentId, e)}
                        className="px-3 py-1.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1 transition-transform active:scale-95 flex-shrink-0 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span className="hidden sm:inline">Book Slot</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SERVICES MATCHES */}
            {!isQueryEmpty && showServices && results.services.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-[#00897b]" />
                    Medical Services &amp; Departments ({results.services.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/services');
                    }}
                    className="text-[11px] text-[#00897b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All Services</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {results.services.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => handleSelectService(svc.id)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/90 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#e0f4f3] text-[#00897b] flex items-center justify-center flex-shrink-0">
                          <HeartPulse className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#00897b] transition-colors leading-tight">
                              {svc.title}
                            </h4>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                              {svc.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {svc.shortDesc}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleBookService(svc.id, e)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-[#00897b] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer"
                      >
                        <span>Consult</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. DIAGNOSTIC TESTS MATCHES */}
            {!isQueryEmpty && showTests && results.tests.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TestTube className="w-3.5 h-3.5 text-[#00897b]" />
                    Diagnostic Tests &amp; Scans ({results.tests.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/diagnostics');
                    }}
                    className="text-[11px] text-[#00897b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All Tests</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {results.tests.map((test) => (
                    <div
                      key={test.id}
                      onClick={() => handleSelectTest(test.id)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/90 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#00897b] flex items-center justify-center flex-shrink-0">
                          <TestTube className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#00897b] transition-colors leading-tight">
                              {test.name}
                            </h4>
                            <span className="text-xs font-black text-[#00897b]">
                              ₹{test.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Sample: {test.sampleType} &bull; Report: {test.turnaroundTime}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleBookTest}
                        className="px-3 py-1.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1 transition-transform active:scale-95 flex-shrink-0 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span className="hidden sm:inline">Book Test</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Popover Footer */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Press <kbd className="font-mono bg-white px-1 border border-slate-200 rounded">ESC</kbd> to close</span>
            <span className="text-[#00897b] font-medium">CarePlus Central Search Engine</span>
          </div>

        </div>
      )}
    </div>
  );
};
