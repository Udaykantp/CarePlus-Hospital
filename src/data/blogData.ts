export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  readTime: string;
  date: string;
  summary: string;
  featured?: boolean;
  image: string;
  content: string[];
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'preventive-cardiology-bp-cholesterol',
    title: 'Silent Risks: How to Manage Blood Pressure & Cholesterol Before Symptoms Appear',
    category: 'Cardiology',
    author: 'Dr. Amit Saxena',
    authorRole: 'Senior Consultant Interventional Cardiologist',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    readTime: '4 min read',
    date: 'Sep 12, 2026',
    featured: true,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    summary: 'High blood pressure and dyslipidemia often progress silently without overt chest pain. Learn the 5 baseline clinical tests and lifestyle adjustments that safeguard your heart.',
    tags: ['Cardiology', 'Hypertension', 'ECG', 'Heart Health'],
    content: [
      'Cardiovascular disease remains the leading cause of adult morbidity, yet over 60% of individuals with elevated blood pressure remain undiagnosed until an acute hypertensive crisis occurs.',
      'Routine 12-lead digital electrocardiograms (ECGs) and annual fasting lipid profiles enable clinicians to identify arterial stiffness and hypercholesterolemia early before irreversible vascular remodeling begins.',
      'Key clinical recommendations include reducing dietary sodium below 2,000 mg daily, engaging in 150 minutes of moderate aerobic activity weekly, and scheduling a baseline preventive cardiology evaluation after age 30.',
      'At CarePlus Hospital, same-day cardiac biomarker profiling and digital 12-lead ECGs provide instant risk stratification with personalized dietary prescriptions.'
    ]
  },
  {
    id: 'post-2',
    slug: 'back-pain-sciatica-physiotherapy-vs-surgery',
    title: 'Managing Lower Back Pain & Sciatica: When Physiotherapy Outperforms Medication',
    category: 'Physiotherapy & Spine',
    author: 'Dr. Mehak Arora (PT)',
    authorRole: 'Head Consultant Physiotherapist',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813575-5735f4705574?auto=format&fit=crop&w=200&q=80',
    readTime: '5 min read',
    date: 'Sep 08, 2026',
    featured: true,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    summary: 'Prolonged sitting and poor ergonomics are triggering lumbar disc bulges in working adults. Discover targeted decompression, core stabilization, and manual therapy techniques.',
    tags: ['Physiotherapy', 'Spine', 'Sciatica', 'Ergonomics'],
    content: [
      'Acute lumbar strain and sciatica often cause radiating leg tingling and muscular spasm. While pain-relieving analgesics provide temporary comfort, they do not resolve mechanical disc compression.',
      'Assessment-led electrotherapy, short-wave diathermy (SWD), dry needling of gluteal trigger points, and lumbar traction decompress pinched nerve roots naturally without dependence on oral painkillers.',
      'Maintaining an ergonomic lumbar curve, taking 2-minute standing breaks every 45 minutes, and building transversus abdominis strength prevent recurrent disc injuries.',
      'Our physical therapy team develops individualized 1-on-1 home rehabilitation plans that restore mobility and safely return patients to active sports.'
    ]
  },
  {
    id: 'post-3',
    slug: 'dengue-platelet-fever-management',
    title: 'Monsoon Fever & Dengue Alert: Understanding Platelet Counts and Hydration Protocols',
    category: 'Internal Medicine',
    author: 'Dr. Bibhu Anand Bishwas',
    authorRole: 'Consultant Physician & Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    readTime: '4 min read',
    date: 'Aug 29, 2026',
    featured: true,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    summary: 'Distinguishing common viral fevers from dengue and chikungunya is critical. Understand warning signs like mucosal bleeding, persistent vomiting, and critical fluid balance.',
    tags: ['Internal Medicine', 'Dengue', 'Fever', 'CBC Test'],
    content: [
      'During monsoon season, seasonal vector-borne illnesses rise sharply across North India. A sharp spike in body temperature accompanied by retro-orbital headache and body aches warrants an immediate Complete Blood Count (CBC).',
      'Platelet drops are manageable with structured intravenous or oral electrolyte hydration under medical supervision. Avoid self-medicating with non-steroidal anti-inflammatory drugs (NSAIDs) like ibuprofen or aspirin, which exacerbate bleeding risks.',
      'CarePlus Hospital (Demo) provides 2-hour rapid dengue NS1 antigen and platelet testing with supervised daycare saline rehydration and continuous vital signs monitoring.'
    ]
  },
  {
    id: 'post-4',
    slug: 'paediatric-vaccination-schedule-iap',
    title: 'Painless Vaccines for Infants: A Guide to the Indian Academy of Paediatrics (IAP) Schedule',
    category: 'Paediatrics',
    author: 'Dr. Sonia Sharma',
    authorRole: 'Senior Consultant Paediatrician',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    readTime: '6 min read',
    date: 'Aug 22, 2026',
    featured: false,
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    summary: 'Timely immunization safeguards newborns against pertussis, rotavirus, pneumococcal pneumonia, and measles. Learn how modern acellular vaccines minimize fever and fussiness.',
    tags: ['Paediatrics', 'Vaccines', 'Infant Care'],
    content: [
      'Modern acellular combination vaccines (Hexavalent DTaP-IPV-Hib-HepB) dramatically reduce post-vaccination fever, injection-site swelling, and infant discomfort compared to older whole-cell vaccines.',
      'Maintaining an unbroken cold chain (2°C to 8°C) is strictly enforced in certified paediatric clinics to ensure vaccine efficacy.',
      'Parents should bring immunization booklets to every well-baby checkup to track milestone growth curves alongside timely vaccine boosters.'
    ]
  },
  {
    id: 'post-5',
    slug: 'skincare-prp-hair-restoration',
    title: 'PRP Hair Restoration & Acne Therapy: What Clinical Dermatology Can Actually Achieve',
    category: 'Dermatology',
    author: 'Dr. Manish Jangra',
    authorRole: 'Consultant Dermatologist & Dermatosurgeon',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    readTime: '4 min read',
    date: 'Aug 15, 2026',
    featured: false,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    summary: 'Demystifying Platelet-Rich Plasma (PRP) therapy for androgenetic alopecia and clinical chemical peels for stubborn cystic acne without hormonal damage.',
    tags: ['Dermatology', 'Skin Care', 'Hair Loss', 'PRP'],
    content: [
      'Platelet-Rich Plasma (PRP) therapy harnesses autologous growth factors extracted from the patient’s own blood to stimulate dormant hair follicles into the anagen growth phase.',
      'Noticeable stabilization of hair fall occurs after 2 to 3 sessions spaced 4 weeks apart, followed by visible density improvements.',
      'Clinical consultation ensures personalized treatment without reliance on unverified internet remedies or harsh topical steroidal creams.'
    ]
  },
  {
    id: 'post-6',
    slug: 'diabetes-hba1c-glycemic-variability',
    title: 'Beyond Fasting Sugar: Why HbA1c & Glycemic Variability Are the True Gold Standards',
    category: 'Endocrinology & Diabetology',
    author: 'Dr. Bibhu Anand Bishwas',
    authorRole: 'Consultant Physician & Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    readTime: '5 min read',
    date: 'Aug 04, 2026',
    featured: false,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    summary: 'Isolated finger-prick blood sugar tests miss acute spikes and nocturnal drops. Learn why the 3-month glycated hemoglobin test prevents diabetic neuropathy and retinopathy.',
    tags: ['Diabetes', 'HbA1c', 'Metabolic Health', 'Blood Sugar'],
    content: [
      'A single fasting blood glucose reading only reflects your metabolism over the past 8 to 10 hours. HbA1c measures the percentage of hemoglobin bound to glucose over 90 to 120 days.',
      'Maintaining HbA1c under 6.5% reduces microvascular complications like diabetic kidney disease (nephropathy) and retinal microaneurysms by over 40%.',
      'At CarePlus Hospital, automated high-performance liquid chromatography (HPLC) provides certified HbA1c results in under 60 minutes with lifestyle counseling.'
    ]
  }
];
