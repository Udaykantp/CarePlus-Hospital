export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: number;
  avatar: string;
  availableDays: string[];
  timingSummary: string;
  bio: string;
  roomNumber: string;
  rating: number;
  totalReviews: number;
  languages: string[];
}

export interface ServiceDepartment {
  id: string;
  title: string;
  category: string;
  badge?: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  highlightPoints: string[];
  keyConditions: string[];
  treatmentProcedures: string[];
  preparationGuidelines: string[];
  doctorIds: string[];
  pricingRange: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface AppointmentBooking {
  id: string;
  referenceCode: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string;
  timeSlot: string;
  consultationType: 'In-Clinic Consultation' | 'Home Physiotherapy Visit' | 'Online Video Consultation' | 'Follow-up Consultation';
  symptoms: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  paymentMode: 'Pay at Clinic' | 'Online Prepaid';
  fee: number;
  bookedAt: string;
  cancellationReason?: string;
  reminderSent24h?: boolean;
  reminderSentAt?: string;
  attendanceConfirmed?: boolean;
  attendanceConfirmedAt?: string;
}

export interface PushNotificationItem {
  id: string;
  bookingId?: string;
  referenceCode?: string;
  type: '24h_reminder' | 'attendance_confirmed' | 'booking_status' | 'reschedule_prompt';
  title: string;
  message: string;
  doctorName?: string;
  date?: string;
  timeSlot?: string;
  timestamp: string;
  isRead: boolean;
  attendanceConfirmed?: boolean;
  priority: 'high' | 'normal';
}

export interface DiagnosticTest {
  id: string;
  name: string;
  category: string;
  price: number;
  turnaroundTime: string;
  fastingRequired: boolean;
  sampleType: string;
  description: string;
  image?: string;
}

export interface ClinicFacility {
  id: string;
  name: string;
  category: string;
  badge?: string;
  image: string;
  description: string;
  features: string[];
  operationalHours: string;
  location: string;
}

export interface Review {
  id: string;
  patientName: string;
  verified: boolean;
  rating: number;
  date: string;
  doctorOrService: string;
  comment: string;
  area: string;
}
