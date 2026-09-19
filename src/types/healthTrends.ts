export type VitalMetricType = 'bloodPressure' | 'glucose' | 'heartRateSpO2' | 'weightBmi' | 'all';

export type TimeRangeOption = '7d' | '30d' | '90d' | '180d' | 'all';

export interface VitalMeasurement {
  id: string;
  patientId: string;
  timestamp: string; // ISO date string
  dateLabel: string; // e.g., "12 Aug"
  fullDateTime: string; // e.g., "12 Aug 2026, 09:30 AM"
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  glucoseFasting?: number; // mg/dL
  glucosePostPrandial?: number; // mg/dL
  glucoseRandom?: number; // mg/dL
  heartRate: number; // bpm
  spO2: number; // %
  weightKg?: number; // kg
  heightCm?: number; // cm
  bmi?: number;
  temperatureF?: number; // °F
  source: 'OPD Consultation' | 'In-Patient Triage' | 'Lab Biochemistry' | 'Patient Self-Log';
  loggedBy?: string;
  notes?: string;
}

export interface VitalStatusEvaluation {
  level: 'normal' | 'elevated' | 'high' | 'critical' | 'low';
  label: string;
  description: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface MetricSummaryStats {
  latestValueText: string;
  latestStatus: VitalStatusEvaluation;
  previousValueText?: string;
  trendDelta?: string;
  trendDirection: 'up' | 'down' | 'stable';
  averageText: string;
  minText: string;
  maxText: string;
  unit: string;
  readingsCount: number;
}
