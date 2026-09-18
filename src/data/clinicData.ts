import { Doctor, ServiceDepartment, DiagnosticTest, ClinicFacility, Review, AppointmentBooking } from '../types';

export const CLINIC_INFO = {
  name: "CarePlus Hospital (Demo)",
  tagline: "Compassionate Care • Multispeciality Excellence • Advanced Diagnostics",
  address: "29/25, Old Rajinder Nagar, New Delhi - 110060 (Near Karol Bagh Metro / Sir Ganga Ram Hospital Marg)",
  phonePrimary: "011-4303 6518",
  phoneAppointments1: "+91 84489 60011",
  phoneAppointments2: "+91 73678 63233",
  email: "demo@careplus-hospital.com",
  operatingHours: "Monday to Saturday: 9:00 AM - 9:00 PM",
  sundayHours: "Sunday: On-call emergency & pre-scheduled daycare",
  stats: [
    { label: "Patients Treated", value: "25,000+" },
    { label: "Specialist Doctors", value: "10+" },
    { label: "Clinical Departments", value: "12+" },
    { label: "Patient Satisfaction", value: "4.9/5" }
  ]
};

export const DOCTORS: Doctor[] = [
  {
    id: "dr-bibhu-bishwas",
    name: "Dr. Bibhu Anand Bishwas",
    title: "Consultant Physician & Internal Medicine Specialist",
    departmentId: "internal-medicine",
    departmentName: "Medical Consultation & General OPD",
    qualifications: "MBBS, MD (General Medicine)",
    experienceYears: 16,
    consultationFee: 800,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timingSummary: "10:00 AM - 2:00 PM & 5:00 PM - 8:30 PM",
    bio: "Senior consultant physician renowned for comprehensive diagnosis of chronic lifestyle disorders, hypertension, complicated diabetes, seasonal fevers, infectious diseases, and executive preventive health checkups.",
    roomNumber: "Consultation Suite 101",
    rating: 4.9,
    totalReviews: 320,
    languages: ["English", "Hindi"]
  },
  {
    id: "dr-mehak-arora",
    name: "Dr. Mehak Arora (PT)",
    title: "Head Consultant Physiotherapist & Rehabilitation Specialist",
    departmentId: "physiotherapy",
    departmentName: "Physiotherapy & Rehabilitation",
    qualifications: "BPT, MPT (Musculoskeletal & Sports Disorders), Certified Dry Needling Specialist",
    experienceYears: 11,
    consultationFee: 700,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timingSummary: "9:00 AM - 2:00 PM & 4:00 PM - 8:00 PM",
    bio: "Passionate rehabilitation specialist leading one-on-one personalized therapy protocols for spine decompression, sciatica, sports injuries, knee rehabilitation, neuro recovery, and tailored home care physiotherapy.",
    roomNumber: "Physio Rehab Center, Level 1",
    rating: 5.0,
    totalReviews: 410,
    languages: ["English", "Hindi", "Punjabi"]
  },
  {
    id: "dr-rohan-krishnan",
    name: "Dr. Rohan Krishnan",
    title: "Consultant Spine & Joint Replacement Specialist",
    departmentId: "orthopaedics-spine",
    departmentName: "Spine & Joint Replacement",
    qualifications: "MBBS, MS (Orthopaedics), Fellowship in Joint Replacement & Spine Surgery",
    experienceYears: 14,
    consultationFee: 1000,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    timingSummary: "4:00 PM - 7:30 PM",
    bio: "Renowned orthopaedic and spine surgeon with expertise in herniated discs, cervical spondylosis, total knee and hip replacements, arthroscopy, and non-surgical degenerative joint therapies.",
    roomNumber: "Consultation Suite 104",
    rating: 4.8,
    totalReviews: 285,
    languages: ["English", "Hindi"]
  },
  {
    id: "dr-avinash-sharma",
    name: "Dr. Avinash Sharma",
    title: "Senior Consultant Medical Oncologist & Cancer Specialist",
    departmentId: "oncology",
    departmentName: "Oncology & Cancer Screening",
    qualifications: "MBBS, MD (Medicine), DM (Medical Oncology - AIIMS)",
    experienceYears: 18,
    consultationFee: 1200,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    timingSummary: "5:30 PM - 8:30 PM",
    bio: "Eminent medical oncologist offering early cancer risk assessment, chemotherapy protocols, immunotherapy advisory, compassionate palliative oncology, and detailed second opinions.",
    roomNumber: "Consultation Suite 105",
    rating: 4.9,
    totalReviews: 190,
    languages: ["English", "Hindi"]
  },
  {
    id: "dr-manish-jangra",
    name: "Dr. Manish Jangra",
    title: "Consultant Dermatologist, Trichologist & Hair Transplant Surgeon",
    departmentId: "dermatology",
    departmentName: "Dermatology & Hair Restoration",
    qualifications: "MBBS, MD (Dermatology, Venereology & Leprosy), FUE Certified",
    experienceYears: 12,
    consultationFee: 800,
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    timingSummary: "11:00 AM - 2:00 PM & 5:00 PM - 8:00 PM",
    bio: "Expert in clinical skin conditions like eczema, psoriasis, resistant acne, pigmentary disorders, combined with hair thinning solutions, PRP therapy, and advanced micro FUE hair transplant techniques.",
    roomNumber: "Derma Suite 102",
    rating: 4.9,
    totalReviews: 340,
    languages: ["English", "Hindi"]
  },
  {
    id: "dr-dhruv-anand",
    name: "Dr. Dhruv Anand",
    title: "Chest Specialist & Consultant Pulmonologist (Respiratory Medicine)",
    departmentId: "pulmonology",
    departmentName: "Chest & Pulmonology",
    qualifications: "MBBS, MD (Pulmonary Medicine), European Diploma in Adult Respiratory Medicine (EDARM)",
    experienceYears: 13,
    consultationFee: 900,
    avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Monday", "Wednesday", "Friday"],
    timingSummary: "3:00 PM - 7:00 PM",
    bio: "Specializing in persistent cough, bronchial asthma, chronic obstructive pulmonary disease (COPD), post-COVID fibrosis, sleep apnea evaluations, and computer-guided spirometry testing.",
    roomNumber: "Chest Clinic Suite 103",
    rating: 4.9,
    totalReviews: 240,
    languages: ["English", "Hindi"]
  },
  {
    id: "dt-sukh-sabia-preet",
    name: "Dt. Sukh Sabia Preet",
    title: "Consultant Clinical Nutritionist, Dietitian & Lactation Consultant",
    departmentId: "dietetics-nutrition",
    departmentName: "Dietetics & Nutrition",
    qualifications: "M.Sc. (Clinical Nutrition & Dietetics), Certified Diabetes Educator, IBCLC",
    experienceYears: 10,
    consultationFee: 700,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timingSummary: "10:30 AM - 3:00 PM",
    bio: "Dedicated nutrition specialist designing customized medical diet charts for weight loss, PCOS management, dyslipidemia, fatty liver, diabetic carbohydrate counting, and maternal lactation care.",
    roomNumber: "Wellness & Nutrition Cabin 201",
    rating: 4.9,
    totalReviews: 215,
    languages: ["English", "Hindi", "Punjabi"]
  },
  {
    id: "dr-sonia-sharma",
    name: "Dr. Sonia Sharma",
    title: "Senior Consultant Paediatrician & Paediatric Nephrologist",
    departmentId: "paediatrics",
    departmentName: "Paediatrics & Child Health",
    qualifications: "MBBS, MD (Paediatrics), Fellowship in Paediatric Nephrology",
    experienceYears: 15,
    consultationFee: 800,
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timingSummary: "10:00 AM - 1:00 PM & 5:00 PM - 7:30 PM",
    bio: "Comprehensive child healthcare including newborn developmental screening, painless vaccination schedules, childhood asthma, recurrent urinary tract infections, and paediatric renal ailments.",
    roomNumber: "Paediatric Wing 106",
    rating: 5.0,
    totalReviews: 310,
    languages: ["English", "Hindi"]
  },
  {
    id: "dr-amit-saxena",
    name: "Dr. Amit Saxena",
    title: "Senior Consultant Interventional Cardiologist & Heart Specialist",
    departmentId: "cardiology",
    departmentName: "Cardiology",
    qualifications: "MBBS, MD (Medicine), DM (Cardiology), FACC",
    experienceYears: 18,
    consultationFee: 1100,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
    timingSummary: "11:00 AM - 2:00 PM & 5:00 PM - 8:00 PM",
    bio: "Renowned cardiologist offering expert evaluation for hypertension, coronary artery disease, arrhythmias, lipid management, echocardiography reviews, and post-angioplasty rehabilitation.",
    roomNumber: "Cardiac Care Suite 108",
    rating: 4.9,
    totalReviews: 380,
    languages: ["English", "Hindi"]
  }
];

export const SERVICES: ServiceDepartment[] = [
  {
    id: "cardiology",
    title: "Cardiology & Preventive Heart Care",
    category: "Cardiology",
    badge: "Specialized Heart Care",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Complete cardiac evaluation, 12-lead ECG, blood pressure titration, lipid management, and post-angioplasty recovery protocols.",
    fullDesc: "Our Cardiology department provides comprehensive evaluation and management for cardiovascular conditions. Under the leadership of senior cardiologist Dr. Amit Saxena, we prioritize preventive cardiac risk stratification, hypertension control, digital ECG screening, and post-procedure outpatient care.",
    iconName: "HeartPulse",
    highlightPoints: [
      "Digital 12-lead Electrocardiogram (ECG) with instant review",
      "Hypertension and dyslipidemia prevention protocols",
      "Pre-operative cardiac clearance and fitness certificates",
      "Lifestyle and diet counseling for ischemic heart disease"
    ],
    keyConditions: [
      "Hypertension & Fluctuating Blood Pressure",
      "Coronary Artery Disease & Angina Pectoris",
      "Cardiac Arrhythmias & Palpitations",
      "Dyslipidemia & High Cholesterol",
      "Heart Failure Outpatient Monitoring",
      "Post-Angioplasty & Bypass Recovery"
    ],
    treatmentProcedures: [
      "Digital 12-Lead Electrocardiography (ECG)",
      "Cardiovascular Risk Stratification & BP Mapping",
      "Lipid Profile & Cardiac Biomarker Analysis",
      "Cardiac Medication Titration & Second Opinions"
    ],
    preparationGuidelines: [
      "Bring all previous ECG tracings, Echo reports, and angiography CDs if available.",
      "Bring a current list of all blood pressure and heart medications."
    ],
    doctorIds: ["dr-amit-saxena"],
    pricingRange: "₹1,100 specialist consultation / Digital ECG ₹350",
    faqs: [
      {
        question: "Can I get an ECG done immediately during my consultation?",
        answer: "Yes, 12-lead digital ECGs are performed on-site within 5 minutes and reviewed immediately by the consulting cardiologist."
      }
    ]
  },
  {
    id: "physiotherapy",
    title: "Physiotherapy & Advanced Rehabilitation",
    category: "Rehabilitation & Pain Relief",
    badge: "Flagship Department",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    shortDesc: "One-on-one, assessment-led physiotherapy sessions with specialized electrotherapy, manual therapy, and tailored home rehabilitation.",
    fullDesc: "CarePlus Hospital (Demo) Physiotherapy wing is among Central Delhi's premier rehabilitation destinations. We deliver strictly assessment-led, 1-on-1 personalized physical therapy. Our clinic features advanced modality units (Short Wave Diathermy, TENS, Ultrasound Therapy, Cervical & Lumbar Traction) alongside active kinesiology and manual manipulation. We help patients transition safely from acute pain to functional athletic mobility without unnecessary medications.",
    iconName: "Activity",
    highlightPoints: [
      "1-on-1 dedicated therapist attention (45-60 min per session)",
      "Targeted pain relief without excessive analgesics",
      "Specialized dry needling, cupping & myofascial trigger release",
      "Comfortable doorstep home physiotherapy service available across Delhi NCR"
    ],
    keyConditions: [
      "Slip Disc & Sciatica Nerve Compression",
      "Cervical Spondylosis & Stiff Neck",
      "Knee Osteoarthritis & Post-TKR Recovery",
      "Frozen Shoulder & Rotator Cuff Tears",
      "Sports Ligament Injuries (ACL, Meniscus)",
      "Post-Stroke & Neurological Rehabilitation",
      "Geriatric Balance & Fall Prevention",
      "Postural Kyphosis & Workstation Ergonomics"
    ],
    treatmentProcedures: [
      "Manual Joint Mobilization (Maitland & Mulligan techniques)",
      "Dry Needling & Myofascial Release Therapy",
      "Advanced Ultrasound & IFT (Interferential Therapy)",
      "Spinal Decompression Traction",
      "Cupping Therapy for Muscle Soreness",
      "Therapeutic Laser & Heat Therapy",
      "Gait & Postural Re-education"
    ],
    preparationGuidelines: [
      "Wear loose, comfortable workout clothing or track pants.",
      "Bring any existing MRI, X-Ray or Orthopaedic discharge summaries.",
      "Avoid heavy meals within 45 minutes prior to session.",
      "Notify your therapist of any implanted pacemakers or surgical metal pins."
    ],
    doctorIds: ["dr-mehak-arora"],
    pricingRange: "₹700 - ₹1,200 per session / Affordable 10-session packages available",
    faqs: [
      {
        question: "How many physiotherapy sessions will I need?",
        answer: "Most acute musculoskeletal conditions show substantial relief within 3 to 5 sessions, while chronic degenerative spine or post-surgical cases may take 10 to 15 sessions with progressive strengthening."
      },
      {
        question: "Do you offer home visit physiotherapy?",
        answer: "Yes! Our certified physiotherapists conduct home visits across Old Rajinder Nagar, Karol Bagh, Patel Nagar, Pusa Road, and surrounding New Delhi neighborhoods with portable modality equipment."
      }
    ]
  },
  {
    id: "internal-medicine",
    title: "Medical Consultation & General OPD",
    category: "Primary & Preventive Care",
    badge: "Daily OPD",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Complete outpatient consultations for acute infections, fever, chronic disease management, diabetes, and hypertension.",
    fullDesc: "Our Outpatient Medical Consultation department serves as the clinical cornerstone for families in Old Rajinder Nagar and Central Delhi. Spearheaded by experienced senior physicians, we provide thorough medical evaluations, diagnostic investigations, medication titration, and preventative health guidance for all adult health issues.",
    iconName: "Stethoscope",
    highlightPoints: [
      "Same-day consultation appointments & walk-ins welcome",
      "Comprehensive multi-system diagnostic workups",
      "In-house pharmacy & rapid pathology collection",
      "Long-term management of hypertension, diabetes & thyroid"
    ],
    keyConditions: [
      "Type 2 Diabetes Mellitus & Metabolic Syndrome",
      "Essential Hypertension & High Blood Pressure",
      "Seasonal Viral Fevers, Dengue, Typhoid, Malaria",
      "Thyroid Disorders (Hypothyroidism & Hyperthyroidism)",
      "Gastrointestinal Infections, Acid Reflux & IBS",
      "Chronic Fatigue, Anaemia & Vitamin Deficiencies",
      "Adult Vaccinations & Travel Immunizations"
    ],
    treatmentProcedures: [
      "Physical Clinical Examination & Vitals Triage",
      "Point-of-care Blood Sugar & ECG Screening",
      "Customized Medication & Lifestyle Regimen",
      "Preventive Annual Health Checkup Protocols",
      "Referral coordination for specialty surgeries"
    ],
    preparationGuidelines: [
      "Bring previous medical records, past prescriptions, and current pill strips.",
      "If planning routine blood tests (Lipid/Fasting Sugar), fast for 10-12 hours overnight.",
      "Write down your chief complaints and symptom timelines."
    ],
    doctorIds: ["dr-bibhu-bishwas"],
    pricingRange: "₹800 consultation fee (Includes 7-day follow-up review)",
    faqs: [
      {
        question: "Is follow-up included in the consultation fee?",
        answer: "Yes, one complimentary follow-up review is valid within 7 days of your initial consultation for report review and prescription adjustment."
      }
    ]
  },
  {
    id: "orthopaedics-spine",
    title: "Spine Care & Joint Replacement",
    category: "Orthopaedics & Musculoskeletal",
    badge: "Specialist Care",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Advanced management of degenerative spine disorders, knee & hip arthritis, fracture care, and robotic joint guidance.",
    fullDesc: "Led by Dr. Rohan Krishnan, our Spine & Joint Replacement service provides conservative as well as surgical management for all bone, joint, and spinal conditions. We prioritize evidence-based conservative care first, utilizing joint viscosupplementation injections and rehabilitation, while organizing surgical solutions when essential.",
    iconName: "Bone",
    highlightPoints: [
      "Minimally invasive spine intervention advisory",
      "Pre-operative counseling & second opinions for joint replacements",
      "Intra-articular PRP & Hyaluronic Acid joint injections",
      "Fracture stabilization, plaster casting & bone density screening"
    ],
    keyConditions: [
      "Herniated Lumbar & Cervical Disc Prolapse",
      "Severe Knee Osteoarthritis & Cartilage Degeneration",
      "Hip Avascular Necrosis (AVN) & Osteoarthritis",
      "Sciatica & Spinal Canal Stenosis",
      "Tennis Elbow, Golfer's Elbow & Plantar Fasciitis",
      "Osteoporosis & Low Bone Mineral Density"
    ],
    treatmentProcedures: [
      "Joint Injections (Corticosteroid & PRP)",
      "Orthopaedic Splints & Waterproof Synthetic Casts",
      "Non-operative Spine Care Protocols",
      "Surgical Joint Replacement Pre-op Planning"
    ],
    preparationGuidelines: [
      "Bring latest X-Ray films, CT scans, or MRI spinal imaging.",
      "Wear shorts or easy-to-roll trousers if knee joints are being examined."
    ],
    doctorIds: ["dr-rohan-krishnan"],
    pricingRange: "₹1,000 specialist consultation fee",
    faqs: [
      {
        question: "Do you offer second opinions on spine and knee surgeries?",
        answer: "Yes, Dr. Rohan Krishnan regularly provides independent second opinions on MRI reports to help patients choose between conservative physical therapy versus surgery."
      }
    ]
  },
  {
    id: "dermatology",
    title: "Dermatology, Hair & Trichology",
    category: "Skin, Hair & Aesthetics",
    badge: "Clinical Aesthetics",
    image: "https://images.unsplash.com/photo-1512290900672-1f55878413b8?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Evidence-based clinical dermatology, hair loss treatments, PRP therapy, acne scar management, and micro FUE hair restoration.",
    fullDesc: "Dr. Manish Jangra offers science-backed dermatological care addressing stubborn clinical skin conditions alongside aesthetic trichology. From chronic allergies and fungal infections to advanced platelet-rich plasma (PRP) therapy for hair regrowth, all procedures adhere to the highest clinical hygiene protocols.",
    iconName: "Sparkles",
    highlightPoints: [
      "Advanced Dermascope examination for skin and scalp",
      "Clinically validated PRP & Mesotherapy for alopecia",
      "Laser & chemical peel protocols for stubborn acne & melasma",
      "Mole excision, skin tag cautery & wart removal"
    ],
    keyConditions: [
      "Male & Female Pattern Hair Loss (Androgenetic Alopecia)",
      "Severe Cystic Acne, Pimples & Post-Acne Scarring",
      "Eczema, Atopic Dermatitis & Psoriasis",
      "Fungal Infections, Ringworm & Nail Disorders",
      "Pigmentation, Melasma & Sun Damage",
      "Urticaria, Skin Allergies & Contact Dermatitis"
    ],
    treatmentProcedures: [
      "Autologous PRP (Platelet-Rich Plasma) Scalp Therapy",
      "Radiofrequency Cautery for Skin Tags & Moles",
      "Medical Grade Chemical Peels (Salicylic, Glycolic)",
      "Intralesional Injections for Alopecia Areata & Keloids"
    ],
    preparationGuidelines: [
      "Avoid applying thick makeup or hair oils on the day of consultation.",
      "List all topical medicated creams and cosmetic products you currently apply."
    ],
    doctorIds: ["dr-manish-jangra"],
    pricingRange: "₹800 consultation / PRP therapy from ₹3,500 per session",
    faqs: [
      {
        question: "How soon do PRP hair therapy results become visible?",
        answer: "Patients usually observe reduced hair shedding by the 2nd session and noticeable thickening and new follicular growth around 3 to 4 months."
      }
    ]
  },
  {
    id: "pulmonology",
    title: "Chest & Respiratory Medicine (Pulmonology)",
    category: "Respiratory & Lung Health",
    badge: "Spirometry On-Site",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Comprehensive diagnosis and care for persistent cough, asthma, allergy, COPD, bronchitis, and post-viral respiratory health.",
    fullDesc: "Headed by Dr. Dhruv Anand, our Chest & Respiratory Medicine department is fully equipped with computerized spirometry and pulse oximetry. Given Delhi's ambient air quality challenges, we specialize in pollution-triggered airway hyperactivity, adult asthma, and smoking-related chronic lung conditions.",
    iconName: "Wind",
    highlightPoints: [
      "Computerized Spirometry (PFT) with reversibility testing",
      "Metered dose inhaler (MDI) technique training & spacer optimization",
      "Post-COVID interstitial lung disease management",
      "Smoking cessation counseling & bronchial rehab"
    ],
    keyConditions: [
      "Bronchial Asthma & Exercise-Induced Wheezing",
      "Chronic Obstructive Pulmonary Disease (COPD)",
      "Persistent Chronic Cough & Post-Nasal Drip",
      "Chronic Bronchitis & Bronchiectasis",
      "Allergic Rhinitis & Sinusitis",
      "Sleep-Disordered Breathing & Obstructive Sleep Apnea"
    ],
    treatmentProcedures: [
      "Pulmonary Function Testing (Spirometry PFT)",
      "Nebulization & Acute Bronchodilator Therapy",
      "Oxygen Saturation & Exhaled Nitric Oxide Monitoring",
      "Inhalation Device Proficiency Coaching"
    ],
    preparationGuidelines: [
      "Avoid using fast-acting bronchodilator inhalers 4-6 hours prior if taking a Spirometry test (unless emergency).",
      "Do not smoke or consume heavy meals 2 hours prior to lung function testing."
    ],
    doctorIds: ["dr-dhruv-anand"],
    pricingRange: "₹900 consultation fee / Spirometry PFT test ₹800",
    faqs: [
      {
        question: "Can I get a Spirometry (PFT) test done on the same day?",
        answer: "Yes, our on-site respiratory lab performs digital spirometry during doctor OPD hours with immediate reports."
      }
    ]
  },
  {
    id: "oncology",
    title: "Medical Oncology & Cancer Screening",
    category: "Specialized Oncology",
    badge: "AIIMS Alumnus",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Specialized cancer screening, second opinions, systemic chemotherapy guidance, and holistic palliative oncology.",
    fullDesc: "Dr. Avinash Sharma brings extensive AIIMS training to deliver compassionate, evidence-based oncological counseling. We provide preventive cancer screening packages (cervical, breast, oral, colorectal), second opinions on biopsy/PET-CT reports, and outpatient palliative management.",
    iconName: "ShieldAlert",
    highlightPoints: [
      "Preventive early cancer screening programs",
      "Detailed second opinions on histopathology & PET-CT scans",
      "Chemotherapy protocol planning & port care",
      "Compassionate pain management & supportive palliative therapy"
    ],
    keyConditions: [
      "Breast, Cervical & Ovarian Cancer Screening",
      "Lung, Head & Neck Tumors",
      "Gastrointestinal & Colorectal Cancers",
      "Prostate & Urological Malignancies",
      "Lymphomas & Multiple Myeloma evaluations"
    ],
    treatmentProcedures: [
      "Oncological Risk Stratification & Family History Audits",
      "Tumor Marker Blood Screenings (PSA, CA-125, CEA, CA 19-9)",
      "Outpatient Supportive Infusions & Symptom Control",
      "Chemotherapy Side-effect Mitigation Counseling"
    ],
    preparationGuidelines: [
      "Bring all original biopsy slides, histopathology reports, and previous CT/PET-CT scans.",
      "Bring your complete chronological file of previous treatments or chemotherapies."
    ],
    doctorIds: ["dr-avinash-sharma"],
    pricingRange: "₹1,200 detailed oncology consultation",
    faqs: [
      {
        question: "Can I consult for a second opinion before beginning chemotherapy?",
        answer: "Absolutely. Second opinions on staging, receptor status (ER/PR/HER2/EGFR), and targeted therapy options are one of our core specialties."
      }
    ]
  },
  {
    id: "dietetics-nutrition",
    title: "Dietetics, Nutrition & Lactation Counseling",
    category: "Nutritional Therapy & Wellness",
    badge: "Custom Meal Plans",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Personalized medical nutrition therapy for obesity, diabetes, PCOS, fatty liver, cardiac diets, and certified lactation consulting.",
    fullDesc: "Dt. Sukh Sabia Preet provides actionable, culturally realistic dietary solutions without starvation diets. We specialize in medical nutrition therapy for metabolic syndromes, hormonal imbalances like PCOS, and specialized maternal lactation guidance for new mothers.",
    iconName: "Apple",
    highlightPoints: [
      "Body Composition Analysis & BMR calculations",
      "Realistic Indian home-cooked meal modifications",
      "Certified lactation consulting for newborn latch & milk supply",
      "Continuous WhatsApp diet follow-ups & weekly accountability"
    ],
    keyConditions: [
      "Overweight, Obesity & Metabolic Resistance",
      "PCOS / PCOD & Hormonal Weight Gain",
      "Gestational Diabetes & Pregnancy Nutrition",
      "Fatty Liver Disease (Grade 1 & 2) & High Uric Acid",
      "Dyslipidemia, High Cholesterol & Hypertension",
      "Postnatal Lactation Challenges & Infant Weaning"
    ],
    treatmentProcedures: [
      "Dietary Recall & Micronutrient Deficiency Audit",
      "Custom Macro/Micronutrient Daily Meal Breakdown",
      "Lactation Technique Assessment & Breastfeeding Support",
      "Structured 4-week & 12-week Metabolic Reset Programs"
    ],
    preparationGuidelines: [
      "Keep a 3-day log of your routine breakfast, lunch, snacks, and dinner timings.",
      "Bring recent lipid profile, fasting blood glucose, and HbA1c reports."
    ],
    doctorIds: ["dt-sukh-sabia-preet"],
    pricingRange: "₹700 initial consultation / Monthly plans from ₹2,500",
    faqs: [
      {
        question: "Are strict starvation or liquid diets recommended?",
        answer: "No, we strictly avoid crash diets. Our plans rely on balanced, sustainable home-cooked meals tailored to your lifestyle and cultural food preferences."
      }
    ]
  },
  {
    id: "paediatrics",
    title: "Paediatrics & Paediatric Nephrology",
    category: "Child & Infant Care",
    badge: "Child Friendly",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Comprehensive child health, painless vaccinations according to IAP guidelines, newborn care, and specialized paediatric kidney care.",
    fullDesc: "Dr. Sonia Sharma provides warm, child-friendly care designed to make doctor visits stress-free for kids and parents. From milestone tracking to painless vaccination needles and complex paediatric urinary/kidney assessments, your child receives empathetic attention.",
    iconName: "Baby",
    highlightPoints: [
      "Strict cold-chain maintained painless vaccines (IAP schedule)",
      "Comprehensive infant growth, weight & developmental milestone tracking",
      "Pediatric asthma, allergies & recurrent throat infections",
      "Subspecialty expertise in paediatric urinary tract and kidney disorders"
    ],
    keyConditions: [
      "Childhood Fevers, Cough & Bronchiolitis",
      "Paediatric Urinary Tract Infections (UTI)",
      "Nephrotic Syndrome & Childhood Proteinuria",
      "Neonatal Jaundice & Poor Weight Gain",
      "Childhood Asthma & Seasonal Eczema",
      "Nutritional Deficiencies (Rickets, Iron Deficiency)"
    ],
    treatmentProcedures: [
      "Routine & Optional Childhood Immunizations",
      "Growth Velocity & Milestone Evaluation",
      "Pediatric Blood Pressure & Urine Analysis",
      "Nebulization in a comforting environment"
    ],
    preparationGuidelines: [
      "Bring your child's official vaccination card / booklet.",
      "Bring a favorite toy or comfort item to ease any clinic anxiety."
    ],
    doctorIds: ["dr-sonia-sharma"],
    pricingRange: "₹800 consultation fee",
    faqs: [
      {
        question: "Do you offer painless vaccines for infants?",
        answer: "Yes, we use the latest painless needle technologies with advanced cold-chain maintained vaccines following Indian Academy of Paediatrics (IAP) protocols."
      }
    ]
  },
  {
    id: "diagnostics-pathology",
    title: "Diagnostic Testing & In-House Pathology",
    category: "Diagnostics & Lab",
    badge: "Same-Day Reports",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Accurate on-site pathology sample collection, biochemistry, hormone assays, ECG, and digital diagnostic reports delivered to WhatsApp.",
    fullDesc: "Accurate clinical diagnosis is the foundation of effective treatment. CarePlus Hospital (Demo) houses an on-site sample collection phlebotomy station backed by automated analyzers. Reports are verified by pathologists and automatically messaged to your phone.",
    iconName: "TestTube",
    highlightPoints: [
      "Gentle, painless vacuum blood collection techniques",
      "Same-day digital reporting sent directly to WhatsApp & Email",
      "Comprehensive preventive full body wellness profiles",
      "In-house 12-lead digital ECG screening"
    ],
    keyConditions: [
      "Full Body Preventive Health Checkups",
      "Thyroid Function Tests (T3, T4, TSH)",
      "Lipid & Cholesterol Cardiovascular Profiles",
      "Complete Blood Count (CBC) with Platelets for Dengue",
      "Liver Function (LFT) & Kidney Function (KFT)",
      "Vitamin D3 & Vitamin B12 Deficiencies",
      "Urine Routine & Microscopic Culture"
    ],
    treatmentProcedures: [
      "Vacutainer Blood Sample Collection",
      "12-Lead Digital Electrocardiogram (ECG)",
      "Point-of-Care Glucometer & Urine Strip Screening",
      "Home blood collection service on prior request"
    ],
    preparationGuidelines: [
      "For fasting tests, fast for 10-12 hours overnight; plain drinking water is permitted.",
      "Continue regular blood pressure medicines unless instructed otherwise by your physician."
    ],
    doctorIds: ["dr-bibhu-bishwas"],
    pricingRange: "Tests starting from ₹150 / Full body profile ₹1,499",
    faqs: [
      {
        question: "How do I receive my diagnostic reports?",
        answer: "You will receive an automated PDF link via WhatsApp and Email within 3 to 6 hours for routine tests, and you can also collect physical printed copies at the reception."
      }
    ]
  },
  {
    id: "daycare-pharmacy",
    title: "Daycare Procedures & In-Clinic Pharmacy",
    category: "Clinical Support Facilities",
    badge: "100% Genuine Medicines",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Monitored daycare beds for IV fluid administration, injectable antibiotics, wound dressings, plus an in-clinic certified pharmacy.",
    fullDesc: "For patients needing short-term medical observation, intravenous rehydration, iron sucrose infusions, or minor surgical dressings, our daycare unit offers monitored beds without the hassle of hospital admission. Our in-clinic pharmacy stocks genuine medicines prescribed by our doctors.",
    iconName: "Building2",
    highlightPoints: [
      "Supervised daycare beds with vital signs monitoring",
      "IV fluid infusions for dehydration, dengue & fever support",
      "Aseptic wound dressing, stitch removal & minor trauma care",
      "Fully stocked pharmacy dispensing genuine batch-verified medications"
    ],
    keyConditions: [
      "Acute Gastroenteritis & Dehydration needing IV Fluids",
      "Intravenous Iron or Antibiotic Therapy",
      "Post-accident abrasions, laceration dressings & sutures",
      "Nebulization for acute asthmatic breathlessness"
    ],
    treatmentProcedures: [
      "Intravenous Cannulation & Controlled Saline Infusion",
      "Sterile Surgical Dressing & Burn Care",
      "Tetanus Toxoid & Urgent Injectables",
      "Direct Prescription Dispensation"
    ],
    preparationGuidelines: [
      "Daycare stays usually last between 2 to 4 hours.",
      "A family member or attendant is advised to remain present."
    ],
    doctorIds: ["dr-bibhu-bishwas"],
    pricingRange: "Affordable daycare hourly rates / Pharmacy prices at standard MRP",
    faqs: [
      {
        question: "Does the pharmacy deliver medicines to nearby areas?",
        answer: "Yes, our pharmacy provides home delivery of prescribed medicines for residents within Old Rajinder Nagar and Karol Bagh."
      }
    ]
  }
];

export const DIAGNOSTIC_TESTS: DiagnosticTest[] = [
  {
    id: "complete-hemogram",
    name: "Complete Hemogram (CBC + ESR)",
    category: "Hematology",
    price: 350,
    turnaroundTime: "3 - 4 Hours",
    fastingRequired: false,
    sampleType: "Blood (EDTA)",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    description: "Detects infection, anaemia, platelet count, viral fever, and inflammation markers."
  },
  {
    id: "lipid-profile",
    name: "Lipid Profile Comprehensive",
    category: "Biochemistry",
    price: 650,
    turnaroundTime: "4 - 6 Hours",
    fastingRequired: true,
    sampleType: "Blood (Serum)",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
    description: "Total Cholesterol, Triglycerides, HDL, LDL, VLDL, and cardiac risk ratio."
  },
  {
    id: "thyroid-profile",
    name: "Thyroid Profile Total (T3, T4, TSH)",
    category: "Endocrinology",
    price: 550,
    turnaroundTime: "4 - 6 Hours",
    fastingRequired: false,
    sampleType: "Blood (Serum)",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    description: "Evaluates thyroid gland function, metabolic rate, hypo/hyperthyroidism."
  },
  {
    id: "diabetes-hba1c",
    name: "HbA1c (Glycosylated Hemoglobin) & Fasting Sugar",
    category: "Diabetes",
    price: 500,
    turnaroundTime: "3 Hours",
    fastingRequired: true,
    sampleType: "Blood (EDTA & Fluoride)",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    description: "Measures 3-month average blood glucose control with high precision."
  },
  {
    id: "vitamin-d3-b12",
    name: "Vitamin D3 & Vitamin B12 Combo",
    category: "Vitamins & Nutrients",
    price: 1100,
    turnaroundTime: "6 Hours",
    fastingRequired: false,
    sampleType: "Blood (Serum)",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    description: "Key bone strength, nerve health, and energy fatigue diagnostic screening."
  },
  {
    id: "liver-kidney-combo",
    name: "Liver & Kidney Function Profile (LFT + KFT)",
    category: "Biochemistry",
    price: 950,
    turnaroundTime: "4 - 6 Hours",
    fastingRequired: true,
    sampleType: "Blood (Serum)",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    description: "Bilirubin, SGOT, SGPT, Creatinine, Blood Urea Nitrogen, Uric Acid, Electrolytes."
  },
  {
    id: "digital-ecg",
    name: "12-Lead Digital ECG with Doctor Interpretation",
    category: "Cardiology",
    price: 350,
    turnaroundTime: "Immediate (15 mins)",
    fastingRequired: false,
    sampleType: "Non-invasive surface leads",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
    description: "Instant heart rhythm, electrical conduction, and ischaemia screening."
  },
  {
    id: "careplus-full-body",
    name: "CarePlus Executive Wellness Package (68 Parameters)",
    category: "Master Health Checkup",
    price: 1599,
    turnaroundTime: "Same Day",
    fastingRequired: true,
    sampleType: "Blood & Urine",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
    description: "CBC, Lipid, LFT, KFT, Thyroid, Fasting Glucose, Urine Routine, Calcium, and Physician consultation."
  }
];

export const CLINIC_FACILITIES: ClinicFacility[] = [
  {
    id: "daycare-observation",
    name: "Supervised Daycare & Observation Bay",
    category: "Inpatient Daycare",
    badge: "4 Monitored Beds",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    description: "Equipped with comfortable monitored beds for intravenous saline rehydration, injectable therapies, and minor wound management without hospital admission.",
    features: [
      "IV Fluid hydration & dengue platelet monitoring",
      "Sterile surgical dressing & suture care",
      "Continuous pulse oximetry & vitals monitoring",
      "Dedicated on-duty nursing staff"
    ],
    operationalHours: "8:00 AM - 8:00 PM",
    location: "Ground Floor, Wing A"
  },
  {
    id: "in-clinic-pharmacy",
    name: "Certified In-Clinic Pharmacy & Dispensary",
    category: "Pharmacy & Dispensary",
    badge: "100% Genuine Stock",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
    description: "Our on-site pharmacy stocks 100% genuine, temperature-controlled medications, injectables, orthopaedic braces, and dermatological essentials.",
    features: [
      "Genuine batch-verified pharmaceuticals",
      "Local prescription home delivery",
      "Refrigerated vaccine & insulin cold storage",
      "Computerized dosage guidance & billings"
    ],
    operationalHours: "9:00 AM - 9:00 PM",
    location: "Reception Lobby, Ground Floor"
  },
  {
    id: "rehabilitation-gym",
    name: "Advanced Physical Therapy & Rehabilitation Gym",
    category: "Rehabilitation & Physio",
    badge: "Electrotherapy Suite",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    description: "Dedicated rehabilitation zone with spinal traction units, ultrasound, interferential therapy (IFT), and dry needling suites for pain-free mobility.",
    features: [
      "One-on-one personalized recovery protocols",
      "Digital cervical & lumbar traction units",
      "Pre & post joint replacement rehab",
      "Sports injury taping & posture correction"
    ],
    operationalHours: "9:00 AM - 8:00 PM",
    location: "Level 1, Physio Center"
  },
  {
    id: "pathology-phlebotomy",
    name: "NABL-Accredited Pathology & Phlebotomy Station",
    category: "Diagnostics & Lab",
    badge: "Same-Day Reports",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    description: "Hygienic on-site sample collection phlebotomy station backed by automated biochemistry analyzers, barcoded sample integrity, and WhatsApp delivery.",
    features: [
      "Vacuum tube painless blood drawing",
      "Automated cell counters & biochemistry",
      "Home blood sample collection service",
      "Digital PDF reports delivered to WhatsApp"
    ],
    operationalHours: "7:30 AM - 7:00 PM",
    location: "Level 1, Diagnostics Wing"
  },
  {
    id: "cardiac-ecg-suite",
    name: "12-Lead Digital ECG & Cardiac Triage Suite",
    category: "Cardiac Diagnostics",
    badge: "Instant 15-Min Tracing",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
    description: "High-precision digital electrocardiogram room offering instant rhythm screening, chest pain evaluation, and remote cardiologist verification.",
    features: [
      "12-Lead computerized digital ECG",
      "Emergency arrhythmia & ischaemia detection",
      "Cardiologist interpretation report",
      "Direct integration into patient EHR"
    ],
    operationalHours: "9:00 AM - 9:00 PM (Emergency 24/7)",
    location: "Ground Floor, Suite 102"
  },
  {
    id: "minor-procedure-ot",
    name: "Minor OT, Wound Dressing & Sterilization Bay",
    category: "Surgical & Wound Care",
    badge: "Class-B Autoclaved",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    description: "Strictly aseptic procedure suite for minor outpatient surgical interventions, diabetic foot ulcer dressings, excisions, and sterile wound suturing.",
    features: [
      "Class-B autoclave steam sterilization",
      "Diabetic foot & burn dressings",
      "Aseptic skin biopsy & cyst excision",
      "Painless local anaesthesia protocols"
    ],
    operationalHours: "9:00 AM - 8:00 PM",
    location: "Ground Floor, Procedure Bay 104"
  },
  {
    id: "consultation-suites",
    name: "Specialist Consultation Suites & Executive Lounge",
    category: "Consultation & Comfort",
    badge: "Soundproof & Private",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    description: "Private, air-conditioned doctor consultation chambers designed for confidential doctor-patient conversations, complemented by an ergonomic waiting lounge.",
    features: [
      "Spacious air-conditioned waiting lounge",
      "Wheelchair accessible entrance & ramp",
      "Digital appointment queue display",
      "High-speed patient Wi-Fi & drinking water"
    ],
    operationalHours: "9:00 AM - 9:00 PM",
    location: "All Floors, Main Reception"
  },
  {
    id: "spirometry-bay",
    name: "Pulmonary Function & Computerized Spirometry Bay",
    category: "Pulmonary & Respiratory",
    badge: "Digital Lung Graphs",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    description: "Specialized respiratory testing station equipped with computerized spirometry for measuring forced expiratory volume, asthma, and COPD severity.",
    features: [
      "Computerized lung capacity assessment",
      "Pre & post bronchodilator testing",
      "Pulse oximetry & oxygen titration",
      "Allergy & pollution asthma screening"
    ],
    operationalHours: "10:00 AM - 7:00 PM",
    location: "Level 1, Suite 106"
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    patientName: "Sunita Mehra",
    verified: true,
    rating: 5,
    date: "14 Sep 2026",
    doctorOrService: "Dr. Mehak Arora (PT) - Physiotherapy",
    comment: "I had severe sciatica and lower back pain for 6 months. Dr. Mehak's 1-on-1 physiotherapy sessions, dry needling, and posture guidance completely relieved my pain. The clinic is spotless and polite!",
    area: "Old Rajinder Nagar"
  },
  {
    id: "rev-2",
    patientName: "Rajeshwar Verma",
    verified: true,
    rating: 5,
    date: "11 Sep 2026",
    doctorOrService: "Dr. Bibhu Anand Bishwas - Internal Medicine",
    comment: "Dr. Bibhu Bishwas is one of the most thorough physicians in New Delhi. He listened carefully to my father's complicated diabetic symptoms, adjusted his medications, and checked in personally. Highly recommended.",
    area: "Karol Bagh"
  },
  {
    id: "rev-3",
    patientName: "Pooja Chawla",
    verified: true,
    rating: 5,
    date: "04 Sep 2026",
    doctorOrService: "Dr. Manish Jangra - Dermatology",
    comment: "Consulted for persistent hair thinning and scalp acne. The PRP treatment and hair serum prescribed by Dr. Manish worked wonders within 2 months. Very transparent pricing with no false promises.",
    area: "Patel Nagar"
  },
  {
    id: "rev-4",
    patientName: "Col. Sanjeev Kapoor (Retd.)",
    verified: true,
    rating: 5,
    date: "28 Aug 2026",
    doctorOrService: "Dr. Rohan Krishnan - Spine & Joint Care",
    comment: "Excellent orthopaedic guidance. Dr. Rohan avoided an unnecessary knee surgery that was recommended elsewhere, putting me on targeted physiotherapy and viscosupplementation. I am walking comfortably again.",
    area: "Pusa Road"
  }
];

export const INITIAL_BOOKINGS: AppointmentBooking[] = [
  {
    id: "demo-bk-101",
    referenceCode: "HHMC-2026-9281",
    patientName: "Vikram Malhotra",
    patientAge: 42,
    patientGender: "Male",
    patientPhone: "+91 98112 34567",
    patientEmail: "vikram.malhotra@gmail.com",
    doctorId: "dr-mehak-arora",
    doctorName: "Dr. Mehak Arora (PT)",
    departmentId: "physiotherapy",
    departmentName: "Physiotherapy & Advanced Rehabilitation",
    date: "2026-09-22",
    timeSlot: "10:30 AM - 11:15 AM",
    consultationType: "In-Clinic Consultation",
    symptoms: "Lower back stiffness and radiating pain in right calf following gym deadlifts.",
    status: "confirmed",
    paymentMode: "Pay at Clinic",
    fee: 700,
    bookedAt: "2026-09-17T11:30:00.000Z"
  }
];
