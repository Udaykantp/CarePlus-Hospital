import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Stethoscope, 
  ArrowRight, 
  AlertCircle, 
  Activity, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { DOCTORS, SERVICES } from '../data/clinicData';

interface SymptomCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendation: (departmentId: string, doctorId?: string) => void;
}

interface SymptomMapping {
  id: string;
  symptomTitle: string;
  category: string;
  departmentId: string;
  departmentName: string;
  recommendedDoctorId: string;
  recommendedDoctorName: string;
  clinicalReason: string;
  urgency: 'Routine' | 'Prompt' | 'Priority';
}

const COMMON_SYMPTOMS: SymptomMapping[] = [
  {
    id: 'sym-back-pain',
    symptomTitle: 'Lower Back Stiffness & Sciatic Leg Pain',
    category: 'Spine & Musculoskeletal',
    departmentId: 'physiotherapy',
    departmentName: 'Physiotherapy & Advanced Rehabilitation',
    recommendedDoctorId: 'dr-mehak-arora',
    recommendedDoctorName: 'Dr. Mehak Arora (PT)',
    clinicalReason: 'Requires 1-on-1 physical assessment, spine decompression traction, and manual mobilization to relieve nerve compression.',
    urgency: 'Prompt'
  },
  {
    id: 'sym-fever',
    symptomTitle: 'Persistent High Fever, Body Ache & Chills (> 3 days)',
    category: 'General Health & Infection',
    departmentId: 'internal-medicine',
    departmentName: 'Medical Consultation & General OPD',
    recommendedDoctorId: 'dr-bibhu-bishwas',
    recommendedDoctorName: 'Dr. Bibhu Anand Bishwas',
    clinicalReason: 'Needs clinical evaluation to rule out viral infections (Dengue, Typhoid, Malaria) with immediate in-house CBC blood test.',
    urgency: 'Priority'
  },
  {
    id: 'sym-knee-stiffness',
    symptomTitle: 'Knee Joint Pain, Creaking & Difficulty Climbing Stairs',
    category: 'Joints & Bones',
    departmentId: 'orthopaedics-spine',
    departmentName: 'Spine Care & Joint Replacement',
    recommendedDoctorId: 'dr-rohan-krishnan',
    recommendedDoctorName: 'Dr. Rohan Krishnan',
    clinicalReason: 'Assessment of cartilage wear, osteoarthritis grading, and non-surgical viscosupplementation or joint preservation.',
    urgency: 'Routine'
  },
  {
    id: 'sym-cough-breathless',
    symptomTitle: 'Persistent Dry Cough, Night Wheezing or Chest Tightness',
    category: 'Chest & Lungs',
    departmentId: 'pulmonology',
    departmentName: 'Chest & Respiratory Medicine',
    recommendedDoctorId: 'dr-dhruv-anand',
    recommendedDoctorName: 'Dr. Dhruv Anand',
    clinicalReason: 'Spirometry (PFT) lung function testing to diagnose pollution-induced airway hypersensitivity, asthma, or bronchitis.',
    urgency: 'Prompt'
  },
  {
    id: 'sym-hair-fall',
    symptomTitle: 'Severe Hair Shedding, Receding Hairline & Scalp Itch',
    category: 'Skin & Hair',
    departmentId: 'dermatology',
    departmentName: 'Dermatology & Hair Restoration',
    recommendedDoctorId: 'dr-manish-jangra',
    recommendedDoctorName: 'Dr. Manish Jangra',
    clinicalReason: 'Trichoscopic scalp examination to check follicular density and initiate targeted PRP or nutritional therapy.',
    urgency: 'Routine'
  },
  {
    id: 'sym-child-fever',
    symptomTitle: 'Infant / Child Fever, Vomiting or Delayed Vaccination',
    category: 'Pediatric Care',
    departmentId: 'paediatrics',
    departmentName: 'Paediatrics & Child Health',
    recommendedDoctorId: 'dr-sonia-sharma',
    recommendedDoctorName: 'Dr. Sonia Sharma',
    clinicalReason: 'Child-friendly clinical examination, milestone assessment, and painless immunization administration.',
    urgency: 'Priority'
  },
  {
    id: 'sym-fatty-liver',
    symptomTitle: 'High Blood Sugar, Fatty Liver or PCOS Weight Struggle',
    category: 'Metabolic & Nutrition',
    departmentId: 'dietetics-nutrition',
    departmentName: 'Dietetics, Nutrition & Lactation Counseling',
    recommendedDoctorId: 'dt-sukh-sabia-preet',
    recommendedDoctorName: 'Dt. Sukh Sabia Preet',
    clinicalReason: 'Tailored medical nutrition therapy, macro balancing, and realistic lifestyle diet planning without crash diets.',
    urgency: 'Routine'
  },
  {
    id: 'sym-unexplained-lump',
    symptomTitle: 'Unexplained Body Lump, Persistent Weight Loss, Cancer Screening',
    category: 'Oncology',
    departmentId: 'oncology',
    departmentName: 'Medical Oncology & Cancer Screening',
    recommendedDoctorId: 'dr-avinash-sharma',
    recommendedDoctorName: 'Dr. Avinash Sharma',
    clinicalReason: 'Thorough oncological risk audit, second opinions on biopsy reports, and early detection diagnostics.',
    urgency: 'Prompt'
  }
];

export const SymptomCheckerModal: React.FC<SymptomCheckerModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendation
}) => {
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomMapping | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredList = COMMON_SYMPTOMS.filter(s => 
    s.symptomTitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.departmentName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-250">
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="sticky top-0 bg-slate-900 text-white p-5 flex items-center justify-between z-10 sm:rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">
                Symptom & Specialty Matcher
              </h3>
              <p className="text-xs text-slate-400">
                Not sure who to consult? Pick your symptoms to match the right specialist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by symptoms (e.g. back pain, cough, knee, fever, hair, diet)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* List of Symptoms */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredList.map(s => {
              const isSelected = selectedSymptom?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSymptom(s)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-500' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {s.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {s.symptomTitle}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    s.urgency === 'Priority' ? 'bg-red-100 text-red-800' : s.urgency === 'Prompt' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {s.urgency}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recommendation Output Card */}
          {selectedSymptom && (
            <div className="mt-4 p-4 rounded-xl bg-teal-50/70 border border-teal-200 animate-in zoom-in-95 duration-150">
              <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
                Recommended Clinical Department
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedSymptom.departmentName}
              </h4>
              <p className="text-xs text-slate-700 mt-1">
                {selectedSymptom.clinicalReason}
              </p>
              
              <div className="mt-3 pt-3 border-t border-teal-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Specialist Doctor</span>
                  <p className="text-xs font-bold text-teal-900">{selectedSymptom.recommendedDoctorName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectRecommendation(selectedSymptom.departmentId, selectedSymptom.recommendedDoctorId);
                    onClose();
                  }}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <span>Book This Doctor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>For acute medical emergencies, call Helpline: <strong>011-4303 6518</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
