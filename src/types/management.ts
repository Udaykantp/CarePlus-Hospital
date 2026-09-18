export type UserRole = 
  | 'super_admin'
  | 'clinic_admin'
  | 'doctor'
  | 'receptionist'
  | 'nurse'
  | 'billing'
  | 'pharmacist'
  | 'patient';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  legalName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  status: 'active' | 'suspended' | 'trial' | 'maintenance';
  subscriptionPlan: 'Starter' | 'Professional' | 'Enterprise';
  subscriptionExpiry: string;
  monthlyRevenue: number;
  totalPatientsCount: number;
  activeDoctorsCount: number;
  totalBedsCount: number;
  hipaaCompliantBaaSigned: boolean;
  featureFlags: {
    telemedicine: boolean;
    ePrescription: boolean;
    labIntegration: boolean;
    pharmacyInventory: boolean;
    inPatientWards: boolean;
    smsReminders: boolean;
    insuranceTpa: boolean;
    twoFactorAuth: boolean;
  };
  createdAt: string;
}

export interface ManagementUser {
  id: string;
  tenantId: string | null; // null for super_admin
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  twoFactorEnabled?: boolean;
}

export interface SyntheticPatient {
  id: string;
  tenantId: string;
  mrn: string; // Medical Record Number e.g. HHMC-MRN-1042
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  address: string;
  city: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  assignedDoctorId?: string;
  status: 'active' | 'discharged' | 'admitted';
  registeredAt: string;
  lastVisitAt?: string;
}

export interface AppointmentRecord {
  id: string;
  tenantId: string;
  referenceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  type: 'In-Clinic' | 'Online Video' | 'Home Visit' | 'Emergency Walk-in';
  chiefComplaint: string;
  status: 'Scheduled' | 'Confirmed' | 'Checked In' | 'In Consultation' | 'Completed' | 'Cancelled' | 'No Show';
  tokenNumber: number;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  billingStatus: 'Unbilled' | 'Pending' | 'Paid';
  fee: number;
  checkedInAt?: string;
  completedAt?: string;
  telemedicineMeetingUrl?: string;
}

export interface MedicalRecordEntry {
  id: string;
  tenantId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  visitDate: string;
  chiefComplaint: string;
  soapNotes: {
    subjective: string; // Patient described symptoms & duration
    objective: string;  // Physical exam, vitals, observations
    assessment: string; // Clinical diagnosis & differential
    plan: string;       // Treatment, follow-up, lifestyle advice
  };
  icd10Diagnosis: {
    code: string;
    description: string;
  }[];
  vitals: {
    bloodPressureSys: number;
    bloodPressureDia: number;
    heartRateBpm: number;
    temperatureF: number;
    oxygenSaturationSpO2: number;
    respiratoryRate: number;
    weightKg: number;
    heightCm: number;
    bmi: number;
  };
  prescriptions: PrescriptionItem[];
  orderedLabTests: string[];
  documents: {
    name: string;
    type: string;
    date: string;
    size: string;
  }[];
  followUpDate?: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;      // e.g. "500 mg"
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops' | 'Inhaler';
  frequency: string; // e.g. "1-0-1 (Twice daily after meals)"
  duration: string;  // e.g. "5 days"
  instructions: string;
  dispensedStatus: 'Pending' | 'Dispensed' | 'Partial';
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  genericName: string;
  category: 'Analgesics' | 'Antibiotics' | 'Cardiovascular' | 'Respiratory' | 'Dermatology' | 'IV Fluids' | 'Surgical Consumables';
  dosageForm: string;
  strength: string;
  stockQuantity: number;
  minThreshold: number;
  reorderQuantity: number;
  unitCost: number;
  sellingPrice: number;
  supplierName: string;
  batchNumber: string;
  expiryDate: string;
  location: string;
}

export interface LabOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Cardiology' | 'Radiology' | 'Pathology';
  sampleType: string;
  sampleStatus: 'Sample Pending' | 'Sample Collected' | 'Analyzing' | 'Result Ready';
  orderedAt: string;
  collectedAt?: string;
  resultReadyAt?: string;
  criticalFlag: boolean;
  results: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
  }[];
  pathologistNotes?: string;
  verifiedBy?: string;
}

export interface InvoiceItem {
  description: string;
  category: 'Consultation' | 'Physiotherapy Procedure' | 'Lab Test' | 'Pharmacy' | 'Ward Daycare' | 'Nursing';
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface BillingInvoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Claim Processing' | 'Cancelled';
  paymentMethod?: 'UPI / QR' | 'Credit / Debit Card' | 'Cash' | 'TPA Insurance Claim';
  insuranceDetails?: {
    tpaName: string;
    claimId: string;
    preAuthAmount: number;
    status: 'Approved' | 'In Review' | 'Submitted';
  };
  notes?: string;
}

export interface NurseVitalLog {
  id: string;
  tenantId: string;
  patientId: string;
  patientName: string;
  bedNumber?: string;
  wardName?: string;
  timestamp: string;
  loggedByNurse: string;
  bp: string;
  heartRate: number;
  temp: number;
  spO2: number;
  respRate: number;
  bloodSugar?: number;
  painScore: number; // 0 - 10
  nursingNotes: string;
  medicationsAdministered: {
    medicineName: string;
    dose: string;
    route: 'Oral' | 'IV' | 'IM' | 'Subcutaneous' | 'Inhalation';
    time: string;
    status: 'Given' | 'Refused' | 'Held';
  }[];
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resourceType: 'Patient' | 'EMR' | 'Prescription' | 'Invoice' | 'Lab' | 'Auth' | 'Tenant' | 'Inventory';
  resourceId: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARN' | 'DENIED';
  details: string;
}
