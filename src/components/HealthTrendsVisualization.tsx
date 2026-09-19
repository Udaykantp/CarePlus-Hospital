import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import {
  Activity,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  Plus,
  Info,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Trash2,
  X,
  Droplet,
  Sparkles,
  Scale,
  Thermometer
} from 'lucide-react';
import { SyntheticPatient, MedicalRecordEntry, NurseVitalLog } from '../types/management';
import { VitalMetricType, TimeRangeOption, VitalMeasurement } from '../types/healthTrends';
import {
  buildPatientVitalHistory,
  saveCustomVital,
  deleteCustomVital,
  computeMetricStats,
  evaluateBloodPressure,
  evaluateGlucose,
  evaluateHeartRate,
  evaluateSpO2
} from '../utils/vitalTrendsGenerator';

interface HealthTrendsVisualizationProps {
  patient: SyntheticPatient;
  medicalRecords?: MedicalRecordEntry[];
  nurseLogs?: NurseVitalLog[];
  showAddVitalButton?: boolean;
  compactMode?: boolean;
  title?: string;
  defaultMetric?: VitalMetricType;
}

export const HealthTrendsVisualization: React.FC<HealthTrendsVisualizationProps> = ({
  patient,
  medicalRecords = [],
  nurseLogs = [],
  showAddVitalButton = true,
  compactMode = false,
  title,
  defaultMetric = 'bloodPressure'
}) => {
  const [selectedMetric, setSelectedMetric] = useState<VitalMetricType>(defaultMetric);
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('all');
  const [chartStyle, setChartStyle] = useState<'line' | 'area'>('area');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Form state for logging a new vital
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    bpSys: 122,
    bpDia: 78,
    glucoseType: 'fasting' as 'fasting' | 'postPrandial' | 'random',
    glucoseValue: 98,
    heartRate: 74,
    spO2: 99,
    weightKg: 72,
    heightCm: 172,
    temperatureF: 98.4,
    source: 'Patient Self-Log' as VitalMeasurement['source'],
    notes: 'Home digital monitor regular check'
  });

  // Re-fetch / re-compute vitals on patient or refreshKey change
  const allMeasurements = useMemo(() => {
    // refreshKey is used as dependency to force re-evaluation after custom vitals saved/deleted
    if (refreshKey >= 0) {
      return buildPatientVitalHistory(patient, medicalRecords, nurseLogs);
    }
    return [];
  }, [patient, medicalRecords, nurseLogs, refreshKey]);

  // Filter by time range
  const filteredData = useMemo(() => {
    if (allMeasurements.length === 0) return [];
    if (timeRange === 'all') return allMeasurements;

    const daysMap: Record<TimeRangeOption, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '180d': 180,
      'all': 9999
    };

    const days = daysMap[timeRange];
    // Anchor to latest timestamp in the dataset
    const latestTimestamp = new Date(allMeasurements[allMeasurements.length - 1].timestamp).getTime();
    const cutoffTime = latestTimestamp - days * 24 * 60 * 60 * 1000;

    const filtered = allMeasurements.filter(m => new Date(m.timestamp).getTime() >= cutoffTime);
    // If filter results in too few points, show at least the last 4 to keep chart meaningful
    return filtered.length >= 2 ? filtered : allMeasurements.slice(-4);
  }, [allMeasurements, timeRange]);

  // Metric stats
  const bpStats = useMemo(() => computeMetricStats(filteredData, 'bloodPressure'), [filteredData]);
  const glucoseStats = useMemo(() => computeMetricStats(filteredData, 'glucose'), [filteredData]);
  const heartStats = useMemo(() => computeMetricStats(filteredData, 'heartRateSpO2'), [filteredData]);
  const weightStats = useMemo(() => computeMetricStats(filteredData, 'weightBmi'), [filteredData]);

  // Handle adding a new vital reading
  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    const isoTimestamp = `${formData.date}T${formData.time}:00Z`;
    const d = new Date(isoTimestamp);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const fullDateTime = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const heightM = (formData.heightCm || 170) / 100;
    const bmi = formData.weightKg ? +(formData.weightKg / (heightM * heightM)).toFixed(1) : undefined;

    const newReading: VitalMeasurement = {
      id: `custom-vital-${Date.now()}`,
      patientId: patient.id,
      timestamp: isoTimestamp,
      dateLabel,
      fullDateTime,
      bloodPressureSys: Number(formData.bpSys),
      bloodPressureDia: Number(formData.bpDia),
      glucoseFasting: formData.glucoseType === 'fasting' ? Number(formData.glucoseValue) : undefined,
      glucosePostPrandial: formData.glucoseType === 'postPrandial' ? Number(formData.glucoseValue) : undefined,
      glucoseRandom: formData.glucoseType === 'random' ? Number(formData.glucoseValue) : undefined,
      heartRate: Number(formData.heartRate),
      spO2: Number(formData.spO2),
      weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
      heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
      bmi,
      temperatureF: formData.temperatureF ? Number(formData.temperatureF) : undefined,
      source: formData.source,
      loggedBy: formData.source === 'Patient Self-Log' ? 'Patient Personal Log' : 'Clinical Attendant',
      notes: formData.notes
    };

    saveCustomVital(patient.id, newReading);
    setRefreshKey(prev => prev + 1);
    setIsAddModalOpen(false);
  };

  const handleDeleteVital = (vitalId: string) => {
    if (confirm('Remove this custom vital entry from the trend history?')) {
      deleteCustomVital(patient.id, vitalId);
      setRefreshKey(prev => prev + 1);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Date Time,Systolic (mmHg),Diastolic (mmHg),Fasting Glucose (mg/dL),Post-Prandial (mg/dL),Heart Rate (bpm),SpO2 (%),Weight (kg),BMI,Source,Notes\n'];
    const rows = filteredData.map(m =>
      `"${m.fullDateTime}",${m.bloodPressureSys},${m.bloodPressureDia},${m.glucoseFasting || ''},${m.glucosePostPrandial || ''},${m.heartRate},${m.spO2},${m.weightKg || ''},${m.bmi || ''},"${m.source}","${(m.notes || '').replace(/"/g, '""')}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${patient.firstName}_${patient.lastName}_Health_Trends_${patient.mrn}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Apply quick preset for adding vital
  const applyPreset = (preset: 'normal' | 'postMeal' | 'opd') => {
    if (preset === 'normal') {
      setFormData(prev => ({
        ...prev,
        bpSys: 118,
        bpDia: 76,
        glucoseType: 'fasting',
        glucoseValue: 92,
        heartRate: 70,
        spO2: 99,
        source: 'Patient Self-Log',
        notes: 'Morning resting fasting check'
      }));
    } else if (preset === 'postMeal') {
      setFormData(prev => ({
        ...prev,
        bpSys: 124,
        bpDia: 80,
        glucoseType: 'postPrandial',
        glucoseValue: 135,
        heartRate: 78,
        spO2: 98,
        source: 'Patient Self-Log',
        notes: '2 hours post lunch glycemic check'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bpSys: 132,
        bpDia: 84,
        glucoseType: 'random',
        glucoseValue: 145,
        heartRate: 82,
        spO2: 98,
        source: 'In-Patient Triage',
        notes: 'Routine OPD nursing assessment'
      }));
    }
  };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: VitalMeasurement = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
            <span className="font-bold text-sky-300">{dataPoint.fullDateTime}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {dataPoint.source}
            </span>
          </div>

          <div className="space-y-1.5 font-sans">
            {selectedMetric === 'bloodPressure' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Blood Pressure:</span>
                  <span className="font-mono font-bold text-base text-white">
                    {dataPoint.bloodPressureSys}/{dataPoint.bloodPressureDia} <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
                  </span>
                </div>
                {(() => {
                  const evalStatus = evaluateBloodPressure(dataPoint.bloodPressureSys, dataPoint.bloodPressureDia);
                  return (
                    <div className="text-[11px] text-sky-200 mt-1 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${evalStatus.level === 'normal' ? 'bg-emerald-400' : evalStatus.level === 'elevated' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                      <span>{evalStatus.label}</span>
                    </div>
                  );
                })()}
              </>
            )}

            {selectedMetric === 'glucose' && (
              <>
                {dataPoint.glucoseFasting !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-300">Fasting Glucose:</span>
                    <span className="font-mono font-bold text-emerald-200">
                      {dataPoint.glucoseFasting} mg/dL
                    </span>
                  </div>
                )}
                {dataPoint.glucosePostPrandial !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300">Post-Meal Glucose:</span>
                    <span className="font-mono font-bold text-amber-200">
                      {dataPoint.glucosePostPrandial} mg/dL
                    </span>
                  </div>
                )}
                {(() => {
                  const val = dataPoint.glucoseFasting || dataPoint.glucosePostPrandial || dataPoint.glucoseRandom || 100;
                  const evalStatus = evaluateGlucose(val, !!dataPoint.glucoseFasting);
                  return (
                    <div className="text-[11px] text-slate-300 mt-1">
                      Status: <strong className="text-white">{evalStatus.label}</strong>
                    </div>
                  );
                })()}
              </>
            )}

            {selectedMetric === 'heartRateSpO2' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-rose-300">Heart Rate:</span>
                  <span className="font-mono font-bold text-white">{dataPoint.heartRate} bpm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sky-300">Oxygen Saturation:</span>
                  <span className="font-mono font-bold text-white">{dataPoint.spO2}% SpO2</span>
                </div>
              </>
            )}

            {selectedMetric === 'weightBmi' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-violet-300">Weight:</span>
                  <span className="font-mono font-bold text-white">{dataPoint.weightKg || '--'} kg</span>
                </div>
                {dataPoint.bmi && (
                  <div className="flex justify-between items-center">
                    <span className="text-violet-300">BMI:</span>
                    <span className="font-mono font-bold text-white">{dataPoint.bmi}</span>
                  </div>
                )}
              </>
            )}

            {selectedMetric === 'all' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">BP:</span>
                  <span className="font-bold text-white">{dataPoint.bloodPressureSys}/{dataPoint.bloodPressureDia} mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Glucose:</span>
                  <span className="font-bold text-emerald-300">{dataPoint.glucoseFasting || dataPoint.glucosePostPrandial || '--'} mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pulse / SpO2:</span>
                  <span className="font-bold text-white">{dataPoint.heartRate} bpm / {dataPoint.spO2}%</span>
                </div>
              </>
            )}

            {dataPoint.notes && (
              <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-700/60 mt-1">
                "{dataPoint.notes}"
              </p>
            )}
            {dataPoint.loggedBy && (
              <span className="text-[10px] text-slate-400 block pt-0.5">
                Recorded by: {dataPoint.loggedBy}
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="health-trends-visualization-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Header with Title, Patient MRN, and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Recharts Biometric Engine</span>
            </span>
            <span className="text-slate-400 text-xs font-mono">
              MRN: {patient.mrn}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading tracking-tight flex items-center gap-2">
            <span>{title || `Health Trends & Vital Biometrics: ${patient.firstName} ${patient.lastName}`}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Longitudinal vital tracking plotting blood pressure, plasma glucose, pulse, and oxygen saturation over time.
          </p>
        </div>

        {/* Action Buttons: Log Vital & Export */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export biometric data to CSV file"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {showAddVitalButton && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Vital Reading</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Metric Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedMetric('bloodPressure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedMetric === 'bloodPressure'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-blue-600" />
            <span>Blood Pressure</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMetric('glucose')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedMetric === 'glucose'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Blood Glucose</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMetric('heartRateSpO2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedMetric === 'heartRateSpO2'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-600" />
            <span>Pulse & SpO2</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMetric('weightBmi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedMetric === 'weightBmi'
                ? 'bg-white text-violet-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-violet-600" />
            <span>Weight & BMI</span>
          </button>
        </div>

        {/* Time Range Filter & Chart Style Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-semibold">
            {(['30d', '90d', '180d', 'all'] as TimeRangeOption[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeRange(t)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  timeRange === t
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === '30d' ? '30D' : t === '90d' ? '3M' : t === '180d' ? '6M' : 'All'}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setChartStyle('area')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-semibold ${
                chartStyle === 'area'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Area
            </button>
            <button
              type="button"
              onClick={() => setChartStyle('line')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-semibold ${
                chartStyle === 'line'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Summary Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Metric Specific Active Card */}
        {selectedMetric === 'bloodPressure' && (
          <>
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
              <span className="text-blue-800 font-semibold text-[11px] flex items-center justify-between">
                <span>Latest Blood Pressure</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${bpStats.latestStatus.badgeBg} ${bpStats.latestStatus.badgeText}`}>
                  {bpStats.latestStatus.label}
                </span>
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {bpStats.latestValueText} <span className="text-xs font-normal text-slate-500">mmHg</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                {bpStats.trendDirection === 'down' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> {bpStats.trendDelta}
                  </span>
                ) : bpStats.trendDirection === 'up' ? (
                  <span className="text-rose-700 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> {bpStats.trendDelta}
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium flex items-center gap-0.5">
                    <Minus className="w-3.5 h-3.5" /> Stable
                  </span>
                )}
                <span className="text-slate-400">vs prev check</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-slate-500 font-semibold text-[11px] block">Period Average</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {bpStats.averageText} <span className="text-xs font-normal text-slate-500">mmHg</span>
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                Calculated across {bpStats.readingsCount} logs
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-slate-500 font-semibold text-[11px] block">Recorded Range (Min - Max)</span>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1.5">
                {bpStats.minText} &rarr; {bpStats.maxText}
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                Lowest to highest recorded
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <span className="text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clinical Target (AHA)</span>
              </span>
              <div className="text-lg font-black font-mono text-emerald-900 mt-1">
                &lt; 120 / 80 <span className="text-xs font-normal text-emerald-700">mmHg</span>
              </div>
              <span className="text-emerald-700 text-[11px] block mt-1">
                Target guideline for normotensive state
              </span>
            </div>
          </>
        )}

        {selectedMetric === 'glucose' && (
          <>
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <span className="text-emerald-800 font-semibold text-[11px] flex items-center justify-between">
                <span>Latest Glucose Reading</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${glucoseStats.latestStatus.badgeBg} ${glucoseStats.latestStatus.badgeText}`}>
                  {glucoseStats.latestStatus.label}
                </span>
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {glucoseStats.latestValueText} <span className="text-xs font-normal text-slate-500">mg/dL</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                {glucoseStats.trendDelta ? (
                  <span className={glucoseStats.trendDirection === 'down' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {glucoseStats.trendDelta}
                  </span>
                ) : (
                  <span className="text-slate-500">First recorded</span>
                )}
                <span className="text-slate-400">vs prev check</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-slate-500 font-semibold text-[11px] block">Mean Glycemic Index</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {glucoseStats.averageText} <span className="text-xs font-normal text-slate-500">mg/dL</span>
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                Across {glucoseStats.readingsCount} plasma readings
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-slate-500 font-semibold text-[11px] block">Extremes (Min - Max)</span>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1.5">
                {glucoseStats.minText} &rarr; {glucoseStats.maxText} <span className="text-xs font-normal text-slate-500">mg/dL</span>
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                Trough to peak variation
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
              <span className="text-amber-800 font-semibold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>ADA Fasting Target</span>
              </span>
              <div className="text-lg font-black font-mono text-amber-900 mt-1">
                70 &ndash; 99 <span className="text-xs font-normal text-amber-700">mg/dL</span>
              </div>
              <span className="text-amber-700 text-[11px] block mt-1">
                Post-prandial target &lt; 140 mg/dL
              </span>
            </div>
          </>
        )}

        {selectedMetric === 'heartRateSpO2' && (
          <>
            <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl">
              <span className="text-rose-800 font-semibold text-[11px] flex items-center justify-between">
                <span>Resting Heart Rate</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  {filteredData[filteredData.length - 1]?.heartRate || 72} bpm
                </span>
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {filteredData[filteredData.length - 1]?.heartRate || 72} <span className="text-xs font-normal text-slate-500">bpm</span>
              </div>
              <span className="text-slate-500 text-[11px] block mt-1">
                Average resting: {heartStats.averageText}
              </span>
            </div>

            <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-2xl">
              <span className="text-sky-800 font-semibold text-[11px] flex items-center justify-between">
                <span>Oxygen Saturation</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                  Optimal
                </span>
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {filteredData[filteredData.length - 1]?.spO2 || 99}% <span className="text-xs font-normal text-slate-500">SpO2</span>
              </div>
              <span className="text-slate-500 text-[11px] block mt-1">
                On room ambient air
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-slate-500 font-semibold text-[11px] block">Heart Rate Range</span>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1.5">
                {heartStats.minText} &rarr; {heartStats.maxText}
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                Normal corridor: 60 - 100 bpm
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <span className="text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SpO2 Safe Zone</span>
              </span>
              <div className="text-lg font-black font-mono text-emerald-900 mt-1">
                &ge; 95% <span className="text-xs font-normal text-emerald-700">SpO2</span>
              </div>
              <span className="text-emerald-700 text-[11px] block mt-1">
                Alert triggered if &lt; 92%
              </span>
            </div>
          </>
        )}

        {selectedMetric === 'weightBmi' && (
          <>
            <div className="p-3.5 bg-violet-50/70 border border-violet-200/80 rounded-2xl">
              <span className="text-violet-800 font-semibold text-[11px] flex items-center justify-between">
                <span>Latest Weight</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800">
                  {filteredData[filteredData.length - 1]?.bmi ? `BMI ${filteredData[filteredData.length - 1].bmi}` : 'Logged'}
                </span>
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {filteredData[filteredData.length - 1]?.weightKg || '--'} <span className="text-xs font-normal text-slate-500">kg</span>
              </div>
              <span className="text-slate-500 text-[11px] block mt-1">
                {weightStats.trendDelta ? `${weightStats.trendDelta} vs last log` : 'Stable weight'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-slate-500 font-semibold text-[11px] block">Weight Range</span>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1.5">
                {weightStats.minText} &rarr; {weightStats.maxText}
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                Period average: {weightStats.averageText}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-slate-500 font-semibold text-[11px] block">Body Mass Index (BMI)</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1">
                {filteredData[filteredData.length - 1]?.bmi || '24.2'} <span className="text-xs font-normal text-slate-500">kg/m²</span>
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                Healthy bracket: 18.5 - 24.9
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <span className="text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status Assessment</span>
              </span>
              <div className="text-base font-bold text-emerald-900 mt-1">
                {weightStats.latestStatus.label}
              </div>
              <span className="text-emerald-700 text-[11px] block mt-1">
                Regular monitoring active
              </span>
            </div>
          </>
        )}
      </div>

      {/* Main Recharts Graph View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>
                {selectedMetric === 'bloodPressure'
                  ? 'Blood Pressure Trajectory (Systolic vs Diastolic)'
                  : selectedMetric === 'glucose'
                  ? 'Plasma Blood Glucose Fluctuations (Fasting & Post-Prandial)'
                  : selectedMetric === 'heartRateSpO2'
                  ? 'Cardiopulmonary Profile: Resting Heart Rate & Pulse Oximetry'
                  : 'Anthropometric Weight & Body Mass Index Progression'}
              </span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-3">
            <span>Points: <strong className="text-slate-700">{filteredData.length}</strong></span>
            <span>&bull;</span>
            <span>Range: <strong className="text-slate-700">{filteredData[0]?.dateLabel} &ndash; {filteredData[filteredData.length - 1]?.dateLabel}</strong></span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartStyle === 'area' ? (
              <AreaChart data={filteredData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  {/* Blood Pressure Gradients */}
                  <linearGradient id="sysGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="diaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Glucose Gradients */}
                  <linearGradient id="fastingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ppGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Heart Rate Gradients */}
                  <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Weight Gradients */}
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />

                {selectedMetric === 'bloodPressure' && (
                  <>
                    <YAxis
                      domain={[50, 190]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      unit=" mmHg"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                      iconType="circle"
                    />
                    {/* Clinical Reference Lines */}
                    <ReferenceLine y={120} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Normal Sys (120)', position: 'insideTopRight', fill: '#059669', fontSize: 10 }} />
                    <ReferenceLine y={80} stroke="#14b8a6" strokeDasharray="4 4" label={{ value: 'Normal Dia (80)', position: 'insideTopRight', fill: '#0d9488', fontSize: 10 }} />
                    <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Stage 2 (140)', position: 'insideTopRight', fill: '#dc2626', fontSize: 10 }} />

                    <Area
                      type="monotone"
                      dataKey="bloodPressureSys"
                      name="Systolic BP (mmHg)"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#sysGradient)"
                      activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bloodPressureDia"
                      name="Diastolic BP (mmHg)"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#diaGradient)"
                      activeDot={{ r: 6, stroke: '#0891b2', strokeWidth: 2, fill: '#fff' }}
                    />
                  </>
                )}

                {selectedMetric === 'glucose' && (
                  <>
                    <YAxis
                      domain={[60, 280]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      unit=" mg/dL"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                      iconType="circle"
                    />
                    {/* ADA Normal Reference Line */}
                    <ReferenceLine y={100} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Fasting Target (100)', position: 'insideTopRight', fill: '#059669', fontSize: 10 }} />
                    <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Post-Meal Target (140)', position: 'insideTopRight', fill: '#d97706', fontSize: 10 }} />
                    <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'High Spike (200)', position: 'insideTopRight', fill: '#dc2626', fontSize: 10 }} />

                    <Area
                      type="monotone"
                      dataKey="glucoseFasting"
                      name="Fasting Glucose (mg/dL)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#fastingGradient)"
                      activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="glucosePostPrandial"
                      name="Post-Meal Glucose (mg/dL)"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#ppGradient)"
                      activeDot={{ r: 6, stroke: '#b45309', strokeWidth: 2, fill: '#fff' }}
                    />
                  </>
                )}

                {selectedMetric === 'heartRateSpO2' && (
                  <>
                    <YAxis
                      yAxisId="left"
                      domain={[45, 130]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      unit=" bpm"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[85, 102]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      unit=" %"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                      iconType="circle"
                    />
                    <ReferenceLine yAxisId="left" y={100} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Upper Rest (100 bpm)', position: 'insideTopLeft', fill: '#e11d48', fontSize: 10 }} />
                    <ReferenceLine yAxisId="right" y={95} stroke="#0284c7" strokeDasharray="4 4" label={{ value: 'SpO2 Threshold (95%)', position: 'insideTopRight', fill: '#0369a1', fontSize: 10 }} />

                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="heartRate"
                      name="Heart Rate (bpm)"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#pulseGradient)"
                      activeDot={{ r: 6, stroke: '#be123c', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="spO2"
                      name="Oxygen Saturation (%)"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#spo2Gradient)"
                      activeDot={{ r: 6, stroke: '#075985', strokeWidth: 2, fill: '#fff' }}
                    />
                  </>
                )}

                {selectedMetric === 'weightBmi' && (
                  <>
                    <YAxis
                      domain={['dataMin - 3', 'dataMax + 3']}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      unit=" kg"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                      iconType="circle"
                    />
                    <Area
                      type="monotone"
                      dataKey="weightKg"
                      name="Weight (kg)"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#weightGradient)"
                      activeDot={{ r: 6, stroke: '#6d28d9', strokeWidth: 2, fill: '#fff' }}
                    />
                  </>
                )}
              </AreaChart>
            ) : (
              <LineChart data={filteredData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />

                {selectedMetric === 'bloodPressure' && (
                  <>
                    <YAxis domain={[50, 190]} tick={{ fontSize: 11, fill: '#64748b' }} unit=" mmHg" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} iconType="circle" />
                    <ReferenceLine y={120} stroke="#10b981" strokeDasharray="4 4" />
                    <ReferenceLine y={80} stroke="#14b8a6" strokeDasharray="4 4" />
                    <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="bloodPressureSys"
                      name="Systolic BP (mmHg)"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#2563eb' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bloodPressureDia"
                      name="Diastolic BP (mmHg)"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#06b6d4' }}
                      activeDot={{ r: 7 }}
                    />
                  </>
                )}

                {selectedMetric === 'glucose' && (
                  <>
                    <YAxis domain={[60, 280]} tick={{ fontSize: 11, fill: '#64748b' }} unit=" mg/dL" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} iconType="circle" />
                    <ReferenceLine y={100} stroke="#10b981" strokeDasharray="4 4" />
                    <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="glucoseFasting"
                      name="Fasting Glucose (mg/dL)"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10b981' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="glucosePostPrandial"
                      name="Post-Meal Glucose (mg/dL)"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#f59e0b' }}
                      activeDot={{ r: 7 }}
                    />
                  </>
                )}

                {selectedMetric === 'heartRateSpO2' && (
                  <>
                    <YAxis yAxisId="left" domain={[45, 130]} tick={{ fontSize: 11, fill: '#64748b' }} unit=" bpm" />
                    <YAxis yAxisId="right" orientation="right" domain={[85, 102]} tick={{ fontSize: 11, fill: '#64748b' }} unit=" %" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} iconType="circle" />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="heartRate"
                      name="Heart Rate (bpm)"
                      stroke="#f43f5e"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#f43f5e' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="spO2"
                      name="Oxygen Saturation (%)"
                      stroke="#0284c7"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#0284c7' }}
                      activeDot={{ r: 7 }}
                    />
                  </>
                )}

                {selectedMetric === 'weightBmi' && (
                  <>
                    <YAxis domain={['dataMin - 3', 'dataMax + 3']} tick={{ fontSize: 11, fill: '#64748b' }} unit=" kg" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} iconType="circle" />
                    <Line
                      type="monotone"
                      dataKey="weightKg"
                      name="Weight (kg)"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8b5cf6' }}
                      activeDot={{ r: 7 }}
                    />
                  </>
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Guidance / Guideline Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Clinical Target Reference Guide</span>
          </h4>

          {selectedMetric === 'bloodPressure' ? (
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-emerald-800">Normal / Optimal:</span>
                <span className="font-mono font-bold">&lt; 120 / &lt; 80 mmHg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-amber-800">Elevated Systolic:</span>
                <span className="font-mono font-bold">120&ndash;129 / &lt; 80 mmHg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-orange-800">Stage 1 Hypertension:</span>
                <span className="font-mono font-bold">130&ndash;139 / 80&ndash;89 mmHg</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-rose-800">Stage 2 Hypertension:</span>
                <span className="font-mono font-bold">&ge; 140 / &ge; 90 mmHg</span>
              </div>
            </div>
          ) : selectedMetric === 'glucose' ? (
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-emerald-800">Normal Fasting:</span>
                <span className="font-mono font-bold">70 &ndash; 99 mg/dL</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-amber-800">Impaired Fasting (Pre-diabetes):</span>
                <span className="font-mono font-bold">100 &ndash; 125 mg/dL</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-rose-800">Diabetic Fasting Threshold:</span>
                <span className="font-mono font-bold">&ge; 126 mg/dL</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-700">Normal 2-Hr Post-Meal:</span>
                <span className="font-mono font-bold">&lt; 140 mg/dL</span>
              </div>
            </div>
          ) : selectedMetric === 'heartRateSpO2' ? (
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-emerald-800">Normal Resting Pulse:</span>
                <span className="font-mono font-bold">60 &ndash; 100 bpm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-sky-800">Normal Oxygen Saturation (SpO2):</span>
                <span className="font-mono font-bold">95% &ndash; 100%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-rose-800">Hypoxemia Alert Level:</span>
                <span className="font-mono font-bold">&lt; 92%</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-emerald-800">Healthy BMI Range:</span>
                <span className="font-mono font-bold">18.5 &ndash; 24.9 kg/m²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-amber-800">Overweight Range:</span>
                <span className="font-mono font-bold">25.0 &ndash; 29.9 kg/m²</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-rose-800">Obesity Class I+:</span>
                <span className="font-mono font-bold">&ge; 30.0 kg/m²</span>
              </div>
            </div>
          )}
        </div>

        {/* Patient Specific Clinical Context */}
        <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-200/80 space-y-2">
          <h4 className="font-bold text-sky-900 flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <span>Patient Specific Clinical Correlation</span>
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {patient.chronicConditions.length > 0 ? (
              <>
                Patient has diagnosed chronic conditions:{' '}
                <strong className="text-slate-800">{patient.chronicConditions.join(', ')}</strong>.
                Continuous vitals trend monitoring is aligned with care plans managed by{' '}
                <strong className="text-slate-800">{patient.assignedDoctorId ? 'assigned clinic consultant' : 'OPD team'}</strong>.
              </>
            ) : (
              <>
                No active chronic diagnoses reported. Vitals reflect preventive health checkups and outpatient physical wellness assessments.
              </>
            )}
          </p>

          <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-[11px] text-sky-900 font-semibold">
            <span>Primary Care Physician:</span>
            <span>Dr. Bibhu Anand Bishwas</span>
          </div>
        </div>
      </div>

      {/* Recent Longitudinal Readings Table */}
      {!compactMode && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Historical Measurement Log ({filteredData.length} records)</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Sorted newest to oldest
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Blood Pressure</th>
                  <th className="py-2.5 px-3">Blood Glucose</th>
                  <th className="py-2.5 px-3">Pulse / SpO2</th>
                  <th className="py-2.5 px-3">Weight (BMI)</th>
                  <th className="py-2.5 px-3">Source & Context</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...filteredData].reverse().map((reading) => {
                  const bpEval = evaluateBloodPressure(reading.bloodPressureSys, reading.bloodPressureDia);
                  const isCustom = reading.id.startsWith('custom-vital-');

                  return (
                    <tr key={reading.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-900">
                        {reading.fullDateTime}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900">
                            {reading.bloodPressureSys}/{reading.bloodPressureDia}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${bpEval.badgeBg} ${bpEval.badgeText}`}>
                            {bpEval.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {reading.glucoseFasting !== undefined ? (
                          <span className="text-emerald-700 font-semibold font-mono">
                            {reading.glucoseFasting} mg/dL <span className="text-[10px] text-slate-400">(Fasting)</span>
                          </span>
                        ) : reading.glucosePostPrandial !== undefined ? (
                          <span className="text-amber-700 font-semibold font-mono">
                            {reading.glucosePostPrandial} mg/dL <span className="text-[10px] text-slate-400">(Post-meal)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">--</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-mono">
                        {reading.heartRate} bpm &bull; {reading.spO2}%
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-mono">
                        {reading.weightKg ? `${reading.weightKg} kg` : '--'}
                        {reading.bmi ? ` (${reading.bmi})` : ''}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap inline-block">
                          {reading.source}
                        </span>
                        {reading.notes && (
                          <span className="text-[10px] text-slate-400 block truncate max-w-xs mt-0.5">
                            {reading.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {isCustom ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteVital(reading.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                            title="Delete custom vital entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-mono">Verified</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Log New Vital Reading */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Log New Vital Measurement</h3>
                  <p className="text-xs text-slate-500">Record point-in-time biometric data for {patient.firstName} {patient.lastName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick preset selector */}
            <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Quick 1-Click Simulation Presets:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('normal')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  ✓ Morning Fasting (118/76, 92 mg/dL)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('postMeal')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Post-Meal Check (124/80, 135 mg/dL)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('opd')}
                  className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  OPD Triage Check (132/84, 145 mg/dL)
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveVital} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Blood Pressure Input */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60">
                <span className="font-bold text-blue-900 block mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-blue-600" />
                  <span>Blood Pressure (mmHg)</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Systolic (Top)</label>
                    <input
                      type="number"
                      required
                      min={60}
                      max={240}
                      value={formData.bpSys}
                      onChange={(e) => setFormData(prev => ({ ...prev, bpSys: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Diastolic (Bottom)</label>
                    <input
                      type="number"
                      required
                      min={40}
                      max={140}
                      value={formData.bpDia}
                      onChange={(e) => setFormData(prev => ({ ...prev, bpDia: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Blood Glucose Input */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
                <span className="font-bold text-emerald-900 block mb-2 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Blood Glucose (mg/dL)</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Timing / Condition</label>
                    <select
                      value={formData.glucoseType}
                      onChange={(e) => setFormData(prev => ({ ...prev, glucoseType: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="fasting">Fasting (Overnight)</option>
                      <option value="postPrandial">Post-Prandial (2hr after meal)</option>
                      <option value="random">Random Blood Sugar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Level (mg/dL)</label>
                    <input
                      type="number"
                      required
                      min={40}
                      max={500}
                      value={formData.glucoseValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, glucoseValue: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Pulse, SpO2 & Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    min={40}
                    max={200}
                    value={formData.heartRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, heartRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    min={70}
                    max={100}
                    value={formData.spO2}
                    onChange={(e) => setFormData(prev => ({ ...prev, spO2: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={30}
                    max={250}
                    value={formData.weightKg}
                    onChange={(e) => setFormData(prev => ({ ...prev, weightKg: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source / Setting</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="Patient Self-Log">Patient Self-Log (Home Monitor)</option>
                  <option value="OPD Consultation">OPD Consultation Room</option>
                  <option value="In-Patient Triage">In-Patient / Nursing Triage</option>
                  <option value="Lab Biochemistry">Laboratory Biochemistry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Context / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Taken before breakfast, feel energetic"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Save & Update Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
