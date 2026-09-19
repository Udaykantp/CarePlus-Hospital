import { SyntheticPatient, MedicalRecordEntry, NurseVitalLog } from '../types/management';
import { VitalMeasurement, VitalStatusEvaluation, MetricSummaryStats, VitalMetricType } from '../types/healthTrends';

const CUSTOM_VITALS_STORAGE_KEY = 'hhmc_custom_vitals_';

export function getCustomVitals(patientId: string): VitalMeasurement[] {
  try {
    const raw = localStorage.getItem(CUSTOM_VITALS_STORAGE_KEY + patientId);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read custom vitals', e);
    return [];
  }
}

export function saveCustomVital(patientId: string, vital: VitalMeasurement): void {
  try {
    const existing = getCustomVitals(patientId);
    const updated = [...existing, vital];
    localStorage.setItem(CUSTOM_VITALS_STORAGE_KEY + patientId, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom vital', e);
  }
}

export function deleteCustomVital(patientId: string, vitalId: string): void {
  try {
    const existing = getCustomVitals(patientId);
    const updated = existing.filter(v => v.id !== vitalId);
    localStorage.setItem(CUSTOM_VITALS_STORAGE_KEY + patientId, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete custom vital', e);
  }
}

function formatDateLabel(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return isoDate;
  }
}

function formatFullDateTime(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoDate;
  }
}

// Generate realistic seeded longitudinal readings for a patient based on chronic profile
function generateHistoricalBaselines(patient: SyntheticPatient): VitalMeasurement[] {
  const isDiabetic = patient.chronicConditions.some(c => c.toLowerCase().includes('diabetes'));
  const isHypertensive = patient.chronicConditions.some(c => c.toLowerCase().includes('hypertension') || c.toLowerCase().includes('bp'));
  const isSenior = patient.age >= 55;

  // Base parameters
  const baseSys = isHypertensive ? 138 : isSenior ? 128 : 118;
  const baseDia = isHypertensive ? 88 : isSenior ? 82 : 76;
  const baseFastingGlu = isDiabetic ? 148 : 92;
  const basePpGlu = isDiabetic ? 210 : 124;
  const baseWeight = 68 + (patient.age % 18);
  const baseHeight = 168 + (patient.gender === 'Male' ? 6 : -4);

  // Define 8 chronological dates in the past 6 months leading up to September 2026
  const pastDates = [
    { date: '2026-03-24T09:15:00Z', note: 'Quarterly Routine Preventive Check', source: 'OPD Consultation' as const, doctor: 'Dr. Bibhu Bishwas' },
    { date: '2026-04-18T10:30:00Z', note: 'Medication titration review', source: 'OPD Consultation' as const, doctor: 'Dr. Bibhu Bishwas' },
    { date: '2026-05-12T08:20:00Z', note: 'Fasting laboratory biometric panel', source: 'Lab Biochemistry' as const, doctor: 'Dr. K. S. Murthy' },
    { date: '2026-06-05T09:40:00Z', note: 'Pre-monsoon clinical check-up', source: 'OPD Consultation' as const, doctor: 'Dr. Mehak Arora (PT)' },
    { date: '2026-07-14T11:00:00Z', note: 'Mid-year lifestyle & diet consultation', source: 'Patient Self-Log' as const, doctor: 'Patient Home Digital Monitor' },
    { date: '2026-08-08T08:45:00Z', note: 'Monthly routine monitoring log', source: 'Patient Self-Log' as const, doctor: 'Omron Hem-7120 Smart BP' },
    { date: '2026-08-28T16:30:00Z', note: 'In-clinic triage before orthopedic consult', source: 'In-Patient Triage' as const, doctor: 'Sister Anjali Nair, RN' },
    { date: '2026-09-10T10:00:00Z', note: 'Follow-up vitals log', source: 'OPD Consultation' as const, doctor: 'Dr. Bibhu Bishwas' }
  ];

  return pastDates.map((item, idx) => {
    // Slight realistic variations per checkup
    const sysVariation = (idx % 2 === 0 ? 1 : -1) * (idx * 2.5 % 7);
    const diaVariation = (idx % 3 === 0 ? 1 : -1) * (idx * 1.8 % 5);
    const sys = Math.round(baseSys + sysVariation);
    const dia = Math.round(baseDia + diaVariation);

    const gluFasting = isDiabetic
      ? Math.round(baseFastingGlu + (idx === 1 ? 22 : idx === 3 ? -15 : (idx * 4 % 19) - 8))
      : Math.round(baseFastingGlu + (idx % 5) - 2);

    const gluPp = isDiabetic
      ? Math.round(basePpGlu + (idx === 2 ? 35 : (idx * 7 % 25) - 10))
      : Math.round(basePpGlu + (idx * 3 % 10) - 4);

    const pulse = 68 + Math.round((idx * 3.7) % 18);
    const spo2 = 97 + (idx % 3 === 0 ? 2 : 1);
    const weight = +(baseWeight + (idx * 0.2 - 0.5)).toFixed(1);
    const heightM = baseHeight / 100;
    const bmi = +(weight / (heightM * heightM)).toFixed(1);

    return {
      id: `seeded-vital-${patient.id}-${idx}`,
      patientId: patient.id,
      timestamp: item.date,
      dateLabel: formatDateLabel(item.date),
      fullDateTime: formatFullDateTime(item.date),
      bloodPressureSys: sys,
      bloodPressureDia: dia,
      glucoseFasting: gluFasting,
      glucosePostPrandial: gluPp,
      glucoseRandom: gluPp + 10,
      heartRate: pulse,
      spO2: spo2,
      weightKg: weight,
      heightCm: baseHeight,
      bmi,
      temperatureF: +(98.2 + (idx % 3 === 0 ? 0.4 : 0.1)).toFixed(1),
      source: item.source,
      loggedBy: item.doctor,
      notes: item.note
    };
  });
}

export function buildPatientVitalHistory(
  patient: SyntheticPatient,
  medicalRecords: MedicalRecordEntry[] = [],
  nurseLogs: NurseVitalLog[] = []
): VitalMeasurement[] {
  const seeded = generateHistoricalBaselines(patient);
  const custom = getCustomVitals(patient.id);

  // Convert real EMR records for this patient
  const emrMeasurements: VitalMeasurement[] = medicalRecords
    .filter(m => m.patientId === patient.id && m.vitals)
    .map(m => {
      const isDiabetic = patient.chronicConditions.some(c => c.toLowerCase().includes('diabetes'));
      const timestamp = m.visitDate.includes('T') ? m.visitDate : `${m.visitDate}T10:00:00Z`;
      const fasting = isDiabetic ? 142 : 94;
      const pp = isDiabetic ? 198 : 128;

      return {
        id: `emr-vital-${m.id}`,
        patientId: patient.id,
        timestamp,
        dateLabel: formatDateLabel(timestamp),
        fullDateTime: formatFullDateTime(timestamp),
        bloodPressureSys: m.vitals.bloodPressureSys,
        bloodPressureDia: m.vitals.bloodPressureDia,
        glucoseFasting: fasting,
        glucosePostPrandial: pp,
        glucoseRandom: pp,
        heartRate: m.vitals.heartRateBpm,
        spO2: m.vitals.oxygenSaturationSpO2,
        weightKg: m.vitals.weightKg,
        heightCm: m.vitals.heightCm,
        bmi: m.vitals.bmi,
        temperatureF: m.vitals.temperatureF,
        source: 'OPD Consultation',
        loggedBy: m.doctorName,
        notes: m.chiefComplaint
      };
    });

  // Convert real Nurse Logs for this patient
  const nurseMeasurements: VitalMeasurement[] = nurseLogs
    .filter(n => n.patientId === patient.id)
    .map(n => {
      let sys = 120;
      let dia = 80;
      if (n.bp) {
        const parts = n.bp.replace(/[^0-9/]/g, '').split('/');
        if (parts.length >= 2) {
          sys = parseInt(parts[0], 10) || 120;
          dia = parseInt(parts[1], 10) || 80;
        }
      }

      return {
        id: `nurse-vital-${n.id}`,
        patientId: patient.id,
        timestamp: n.timestamp,
        dateLabel: formatDateLabel(n.timestamp),
        fullDateTime: formatFullDateTime(n.timestamp),
        bloodPressureSys: sys,
        bloodPressureDia: dia,
        glucoseFasting: n.bloodSugar ? Math.round(n.bloodSugar * 0.75) : undefined,
        glucosePostPrandial: n.bloodSugar,
        glucoseRandom: n.bloodSugar,
        heartRate: n.heartRate,
        spO2: n.spO2,
        temperatureF: n.temp,
        source: 'In-Patient Triage',
        loggedBy: n.loggedByNurse,
        notes: n.nursingNotes
      };
    });

  // Merge, dedup by ID or timestamp, and sort chronologically
  const all = [...seeded, ...emrMeasurements, ...nurseMeasurements, ...custom];
  const uniqueMap = new Map<string, VitalMeasurement>();

  all.forEach(item => {
    // Unique key by date prefix and source if not unique id
    uniqueMap.set(item.id, item);
  });

  return Array.from(uniqueMap.values()).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

// Evaluate clinical blood pressure status per AHA/ACC Guidelines
export function evaluateBloodPressure(sys: number, dia: number): VitalStatusEvaluation {
  if (sys >= 180 || dia >= 120) {
    return {
      level: 'critical',
      label: 'Hypertensive Crisis',
      description: 'Emergency care needed if accompanied by chest pain or shortness of breath.',
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      badgeBorder: 'border-rose-300'
    };
  }
  if (sys >= 140 || dia >= 90) {
    return {
      level: 'high',
      label: 'Stage 2 Hypertension',
      description: 'Above target range. Physician review recommended for antihypertensive therapy.',
      colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
      badgeBorder: 'border-orange-300'
    };
  }
  if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    return {
      level: 'elevated',
      label: 'Stage 1 Hypertension',
      description: 'Mildly elevated. Lifestyle and sodium moderation suggested.',
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300'
    };
  }
  if (sys >= 120 && sys <= 129 && dia < 80) {
    return {
      level: 'elevated',
      label: 'Elevated BP',
      description: 'Borderline systolic. Regular aerobic activity recommended.',
      colorClass: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-800',
      badgeBorder: 'border-yellow-300'
    };
  }
  if (sys < 90 || dia < 60) {
    return {
      level: 'low',
      label: 'Hypotension (Low BP)',
      description: 'Below standard baseline. Monitor for dizziness upon standing.',
      colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800',
      badgeBorder: 'border-sky-300'
    };
  }
  return {
    level: 'normal',
    label: 'Normal / Optimal',
    description: 'Systolic < 120 and Diastolic < 80 mmHg. Excellent cardiovascular baseline.',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300'
  };
}

// Evaluate clinical blood glucose status per ADA Guidelines
export function evaluateGlucose(mgDl: number, isFasting: boolean = true): VitalStatusEvaluation {
  if (isFasting) {
    if (mgDl >= 126) {
      return {
        level: 'high',
        label: 'Diabetic Range (Fasting)',
        description: 'Fasting plasma glucose ≥ 126 mg/dL indicates diabetes.',
        colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800',
        badgeBorder: 'border-rose-300'
      };
    }
    if (mgDl >= 100) {
      return {
        level: 'elevated',
        label: 'Pre-diabetes / Impaired Fasting',
        description: 'Fasting 100–125 mg/dL. Glycemic monitoring & diet management suggested.',
        colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-300'
      };
    }
    if (mgDl < 70) {
      return {
        level: 'low',
        label: 'Hypoglycemia Alert',
        description: 'Blood sugar below 70 mg/dL. Fast-acting carbohydrate intake advised.',
        colorClass: 'text-purple-700 bg-purple-50 border-purple-200',
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-800',
        badgeBorder: 'border-purple-300'
      };
    }
    return {
      level: 'normal',
      label: 'Normal Fasting Glucose',
      description: 'Fasting glucose 70–99 mg/dL. Well within target physiological range.',
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-300'
    };
  } else {
    // Post-prandial / 2hr post-meal
    if (mgDl >= 200) {
      return {
        level: 'high',
        label: 'High Post-Meal Spike',
        description: '2hr post-prandial glucose ≥ 200 mg/dL.',
        colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800',
        badgeBorder: 'border-rose-300'
      };
    }
    if (mgDl >= 140) {
      return {
        level: 'elevated',
        label: 'Impaired Glucose Tolerance',
        description: 'Post-prandial 140–199 mg/dL.',
        colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-300'
      };
    }
    return {
      level: 'normal',
      label: 'Normal Post-Prandial',
      description: 'Post-prandial < 140 mg/dL.',
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-300'
    };
  }
}

// Evaluate Heart Rate
export function evaluateHeartRate(bpm: number): VitalStatusEvaluation {
  if (bpm > 100) {
    return {
      level: 'high',
      label: 'Tachycardia',
      description: 'Resting pulse > 100 bpm. Evaluate stress, hydration, or thyroid status.',
      colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
      badgeBorder: 'border-orange-300'
    };
  }
  if (bpm < 60) {
    return {
      level: 'low',
      label: 'Bradycardia',
      description: 'Resting pulse < 60 bpm. Typical in endurance athletes or beta-blocker therapy.',
      colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800',
      badgeBorder: 'border-sky-300'
    };
  }
  return {
    level: 'normal',
    label: 'Normal Resting Pulse',
    description: '60–100 bpm resting range. Stable sinus rhythm.',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300'
  };
}

// Evaluate SpO2
export function evaluateSpO2(spo2: number): VitalStatusEvaluation {
  if (spo2 < 90) {
    return {
      level: 'critical',
      label: 'Severe Hypoxemia',
      description: 'Oxygen saturation < 90%. Immediate clinical oxygen supplementation required.',
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      badgeBorder: 'border-rose-300'
    };
  }
  if (spo2 < 95) {
    return {
      level: 'elevated',
      label: 'Mild Hypoxia',
      description: 'Oxygen saturation 90–94%. Pulmonary airway check recommended.',
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300'
    };
  }
  return {
    level: 'normal',
    label: 'Optimal Saturation',
    description: '95–100% SpO2 on room air. Normal gas exchange.',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300'
  };
}

// Helper to compute summary stats for a metric
export function computeMetricStats(
  measurements: VitalMeasurement[],
  metric: VitalMetricType
): MetricSummaryStats {
  if (measurements.length === 0) {
    return {
      latestValueText: '--',
      latestStatus: {
        level: 'normal',
        label: 'No Data',
        description: 'No recordings available',
        colorClass: 'text-slate-500 bg-slate-50 border-slate-200',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-200'
      },
      trendDirection: 'stable',
      averageText: '--',
      minText: '--',
      maxText: '--',
      unit: '',
      readingsCount: 0
    };
  }

  const latest = measurements[measurements.length - 1];
  const previous = measurements.length > 1 ? measurements[measurements.length - 2] : undefined;

  if (metric === 'bloodPressure') {
    const sysVals = measurements.map(m => m.bloodPressureSys);
    const diaVals = measurements.map(m => m.bloodPressureDia);
    const avgSys = Math.round(sysVals.reduce((a, b) => a + b, 0) / sysVals.length);
    const avgDia = Math.round(diaVals.reduce((a, b) => a + b, 0) / diaVals.length);
    const minSys = Math.min(...sysVals);
    const minDia = Math.min(...diaVals);
    const maxSys = Math.max(...sysVals);
    const maxDia = Math.max(...diaVals);

    const deltaSys = previous ? latest.bloodPressureSys - previous.bloodPressureSys : 0;
    const trendDirection = deltaSys > 2 ? 'up' : deltaSys < -2 ? 'down' : 'stable';
    const trendDelta = previous
      ? `${deltaSys > 0 ? '+' : ''}${deltaSys} mmHg sys`
      : undefined;

    return {
      latestValueText: `${latest.bloodPressureSys}/${latest.bloodPressureDia}`,
      latestStatus: evaluateBloodPressure(latest.bloodPressureSys, latest.bloodPressureDia),
      previousValueText: previous ? `${previous.bloodPressureSys}/${previous.bloodPressureDia} mmHg` : undefined,
      trendDelta,
      trendDirection,
      averageText: `${avgSys}/${avgDia}`,
      minText: `${minSys}/${minDia}`,
      maxText: `${maxSys}/${maxDia}`,
      unit: 'mmHg',
      readingsCount: measurements.length
    };
  }

  if (metric === 'glucose') {
    const vals = measurements
      .map(m => m.glucoseFasting || m.glucosePostPrandial || m.glucoseRandom)
      .filter((v): v is number => typeof v === 'number');

    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    const min = vals.length ? Math.min(...vals) : 0;
    const max = vals.length ? Math.max(...vals) : 0;

    const latestVal = latest.glucoseFasting || latest.glucosePostPrandial || latest.glucoseRandom || 100;
    const prevVal = previous
      ? previous.glucoseFasting || previous.glucosePostPrandial || previous.glucoseRandom
      : undefined;

    const delta = prevVal ? latestVal - prevVal : 0;
    const trendDirection = delta > 4 ? 'up' : delta < -4 ? 'down' : 'stable';
    const trendDelta = prevVal ? `${delta > 0 ? '+' : ''}${delta} mg/dL` : undefined;

    return {
      latestValueText: `${latestVal}`,
      latestStatus: evaluateGlucose(latestVal, !!latest.glucoseFasting),
      previousValueText: prevVal ? `${prevVal} mg/dL` : undefined,
      trendDelta,
      trendDirection,
      averageText: `${avg}`,
      minText: `${min}`,
      maxText: `${max}`,
      unit: 'mg/dL',
      readingsCount: vals.length
    };
  }

  if (metric === 'heartRateSpO2') {
    const pulseVals = measurements.map(m => m.heartRate);
    const avgPulse = Math.round(pulseVals.reduce((a, b) => a + b, 0) / pulseVals.length);
    const minPulse = Math.min(...pulseVals);
    const maxPulse = Math.max(...pulseVals);

    const delta = previous ? latest.heartRate - previous.heartRate : 0;
    const trendDirection = delta > 2 ? 'up' : delta < -2 ? 'down' : 'stable';

    return {
      latestValueText: `${latest.heartRate} bpm / ${latest.spO2}%`,
      latestStatus: evaluateHeartRate(latest.heartRate),
      previousValueText: previous ? `${previous.heartRate} bpm / ${previous.spO2}%` : undefined,
      trendDelta: previous ? `${delta > 0 ? '+' : ''}${delta} bpm` : undefined,
      trendDirection,
      averageText: `${avgPulse} bpm avg`,
      minText: `${minPulse} bpm`,
      maxText: `${maxPulse} bpm`,
      unit: 'bpm & %',
      readingsCount: measurements.length
    };
  }

  // Weight & BMI
  const weightVals = measurements
    .map(m => m.weightKg)
    .filter((v): v is number => typeof v === 'number');

  const avgWeight = weightVals.length
    ? +(weightVals.reduce((a, b) => a + b, 0) / weightVals.length).toFixed(1)
    : 0;
  const minWeight = weightVals.length ? Math.min(...weightVals) : 0;
  const maxWeight = weightVals.length ? Math.max(...weightVals) : 0;

  const latestWeight = latest.weightKg || 70;
  const prevWeight = previous?.weightKg;
  const deltaWeight = prevWeight ? +(latestWeight - prevWeight).toFixed(1) : 0;
  const trendDirection = deltaWeight > 0.3 ? 'up' : deltaWeight < -0.3 ? 'down' : 'stable';

  return {
    latestValueText: `${latestWeight} kg ${latest.bmi ? `(BMI ${latest.bmi})` : ''}`,
    latestStatus: {
      level: 'normal',
      label: latest.bmi ? (latest.bmi < 18.5 ? 'Underweight' : latest.bmi <= 24.9 ? 'Normal Weight' : latest.bmi <= 29.9 ? 'Overweight' : 'Obese Class I') : 'Recorded',
      description: 'Body weight & calculated Body Mass Index track nutritional balance.',
      colorClass: 'text-violet-700 bg-violet-50 border-violet-200',
      badgeBg: 'bg-violet-100',
      badgeText: 'text-violet-800',
      badgeBorder: 'border-violet-300'
    },
    previousValueText: prevWeight ? `${prevWeight} kg` : undefined,
    trendDelta: prevWeight ? `${deltaWeight > 0 ? '+' : ''}${deltaWeight} kg` : undefined,
    trendDirection,
    averageText: `${avgWeight} kg`,
    minText: `${minWeight} kg`,
    maxText: `${maxWeight} kg`,
    unit: 'kg',
    readingsCount: weightVals.length
  };
}
