import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { 
  Stethoscope, 
  Search, 
  Star, 
  Calendar, 
  Clock, 
  Award, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { DOCTORS } from '../data/clinicData';
import { DoctorGridSkeleton } from '../components/skeletons';

interface DoctorsPageProps {
  onSelectDoctor?: (doctorId: string, departmentId?: string) => void;
  isLoading?: boolean;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ onSelectDoctor, isLoading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { specialtySlug } = useParams<{ specialtySlug?: string }>();

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(isLoading ?? true);
  
  const specialties = ['all', ...Array.from(new Set(DOCTORS.map(d => d.departmentName)))];

  const findMatchedSpecialty = (param?: string | null) => {
    if (!param) return 'all';
    const decoded = decodeURIComponent(param).trim().toLowerCase();
    // 1. Direct match with departmentName
    const exact = specialties.find(s => s.toLowerCase() === decoded);
    if (exact) return exact;
    // 2. Match with doctor departmentId or substring
    const doc = DOCTORS.find(d => 
      d.departmentId.toLowerCase() === decoded ||
      d.departmentId.toLowerCase().includes(decoded) ||
      d.departmentName.toLowerCase().includes(decoded) ||
      d.title.toLowerCase().includes(decoded)
    );
    if (doc) return doc.departmentName;
    return 'all';
  };

  const activeSpecialtyParam = searchParams.get('specialty') || specialtySlug;
  const matchedSpecialty = findMatchedSpecialty(activeSpecialtyParam);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(matchedSpecialty);

  useEffect(() => {
    const currentParam = searchParams.get('specialty') || specialtySlug;
    setSelectedSpecialty(findMatchedSpecialty(currentParam));
  }, [searchParams, specialtySlug]);

  // Handle perceived loading state when data is being loaded or filtered
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
  }, [selectedSpecialty, isLoading]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleSpecialtySelect = (sp: string) => {
    setSelectedSpecialty(sp);
    const newParams = new URLSearchParams(searchParams);
    if (sp !== 'all') {
      newParams.set('specialty', sp);
    } else {
      newParams.delete('specialty');
    }
    setSearchParams(newParams);
  };

  const filteredDoctors = DOCTORS.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doc.departmentName === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-12 shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-2 sm:space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <Stethoscope className="w-3.5 h-3.5" />
            Specialist Clinicians
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Our Consultant Doctors &amp; Specialists
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
            Board-certified senior clinicians, physiotherapists, and surgeons practicing at CarePlus Hospital.
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
              placeholder="Search by doctor name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSpecialty}
              onChange={(e) => handleSpecialtySelect(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 flex-1 sm:flex-none"
            >
              {specialties.map((sp) => (
                <option key={sp} value={sp}>
                  {sp === 'all' ? 'All Clinical Specialties' : sp}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh / simulate data loading"
              aria-label="Refresh doctors list"
              className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer flex-shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Specialty Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {specialties.map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => handleSpecialtySelect(sp)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedSpecialty === sp
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {sp === 'all' ? 'All Specialties' : sp}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton / Doctor Cards Grid */}
      {loading ? (
        <DoctorGridSkeleton count={6} />
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Doctors Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No specialists matched "{searchQuery || selectedSpecialty}". Try adjusting your search query or selecting all specialties.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              handleSpecialtySelect('all');
            }}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Reset Search &amp; Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-teal-500/30 transition-all flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 font-normal">({doc.totalReviews} reviews)</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-heading truncate group-hover:text-teal-700 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-teal-700 font-semibold truncate mt-0.5">
                      {doc.departmentName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {doc.qualifications}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {doc.bio}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Award className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span>{doc.experienceYears} Years Clinical Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{doc.timingSummary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    <span>{doc.roomNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Consultation Fee</span>
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{doc.consultationFee}
                  </span>
                </div>

                <Link
                  to={`/book?doctor=${doc.id}&service=${doc.departmentId}`}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Book Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
