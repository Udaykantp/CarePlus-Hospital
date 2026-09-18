import React, { useState } from 'react';
import { 
  TestTube, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Home, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { DIAGNOSTIC_TESTS, CLINIC_INFO } from '../data/clinicData';
import { DiagnosticTest } from '../types';
import { ScrollRevealGroup, ScrollRevealItem, ScrollReveal } from './ScrollReveal';

interface DiagnosticTestsSectionProps {
  onBookTest: (testName: string) => void;
}

export const DiagnosticTestsSection: React.FC<DiagnosticTestsSectionProps> = ({ onBookTest }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Master Health Checkup', 'Hematology', 'Biochemistry', 'Cardiology', 'Endocrinology', 'Diabetes', 'Vitamins & Nutrients'];

  const filteredTests = DIAGNOSTIC_TESTS.filter(test => {
    const matchesCat = filterCategory === 'All' || test.category === filterCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    return matchesCat && (
      test.name.toLowerCase().includes(q) ||
      test.description.toLowerCase().includes(q)
    );
  });

  return (
    <section id="diagnostics-section" className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header matching Hero Section Design */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-xs mb-3">
            <TestTube className="w-4 h-4 text-[#00897b]" strokeWidth={2.5} />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              NABL-Accredited In-House Pathology & Imaging
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight font-heading">
            Accurate Diagnostic Testing <br />
            <span className="text-[#00897b]">Same-Day Digital Reports on WhatsApp</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Equipped with state-of-the-art analyzers and 12-lead digital ECG. Receive prompt sample collection at the clinic or doorstep with verified digital reports delivered directly to your WhatsApp.
          </p>
        </div>

        {/* Feature Highlights Bar matching Hero Feature Circles with scroll reveal */}
        <ScrollRevealGroup staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <ScrollRevealItem>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center font-bold flex-shrink-0">
                <Clock className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Same-Day Digital Reports</h4>
                <p className="text-xs text-slate-500 mt-0.5">Delivered via WhatsApp &amp; Email in 3-6 hours</p>
              </div>
            </div>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center font-bold flex-shrink-0">
                <Home className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Home Phlebotomy Collection</h4>
                <p className="text-xs text-slate-500 mt-0.5">Available across Central Delhi within 45 mins</p>
              </div>
            </div>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 rounded-full bg-[#e0f4f3] text-[#00897b] flex items-center justify-center font-bold flex-shrink-0">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Quality Assured</h4>
                <p className="text-xs text-slate-500 mt-0.5">Calibrated vacuum tubes &amp; verified pathologists</p>
              </div>
            </div>
          </ScrollRevealItem>
        </ScrollRevealGroup>

        {/* Search & Filter matching Hero design */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests (e.g. CBC, lipid, thyroid, sugar)..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00897b]/30 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#00897b] text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid matching Hero Card aesthetic with scroll reveal */}
        <ScrollRevealGroup staggerDelay={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredTests.map((test: DiagnosticTest) => (
            <ScrollRevealItem 
              key={test.id}
              className={test.category === 'Master Health Checkup' ? 'lg:col-span-2' : ''}
            >
              <div
                className={`rounded-2xl border flex flex-col justify-between transition-all duration-300 h-full overflow-hidden group ${
                  test.category === 'Master Health Checkup'
                    ? 'bg-gradient-to-b from-[#e6f7f5]/80 via-white to-white border-teal-300 shadow-sm ring-1 ring-teal-400/30 hover:shadow-xl'
                    : 'bg-white border-slate-200/90 hover:border-teal-300 hover:shadow-xl shadow-sm'
                }`}
              >
                {/* Test Related Image Banner */}
                {test.image && (
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <img
                      src={test.image}
                      alt={test.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-wide">
                        {test.category}
                      </span>
                      {test.fastingRequired && (
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/40">
                          Fasting Required
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    {!test.image && (
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-[#00897b] uppercase tracking-wider bg-[#e6f7f5] px-2.5 py-1 rounded-full border border-[#b8ece6]">
                          {test.category}
                        </span>
                        {test.fastingRequired && (
                          <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                            Fasting 10-12 hrs
                          </span>
                        )}
                      </div>
                    )}

                    <h4 className="font-bold text-slate-900 text-base font-heading group-hover:text-[#00897b] transition-colors">
                      {test.name}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {test.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Sample:</span>
                        <strong className="text-slate-800">{test.sampleType}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Turnaround:</span>
                        <strong className="text-slate-800">{test.turnaroundTime}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Standard Price</span>
                      <span className="text-lg font-black text-slate-900">₹{test.price}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onBookTest(test.name)}
                      className="px-4 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl shadow-xs shadow-[#00897b]/20 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Test</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
};
