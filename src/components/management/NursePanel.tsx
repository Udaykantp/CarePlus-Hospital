import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { 
  HeartPulse, 
  Activity, 
  Thermometer, 
  Droplet, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Pill, 
  Bed, 
  UserCheck 
} from 'lucide-react';

export const NursePanel: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const { patients, nurseLogs, addNurseVitalLog } = useClinicData();

  const [activeTab, setActiveTab] = useState<'vitals' | 'mar' | 'beds'>('vitals');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [bedNumber, setBedNumber] = useState('Daycare Bay 02');
  const [wardName, setWardName] = useState('Daycare Therapy Wing');

  // Vitals form
  const [bp, setBp] = useState('120/80');
  const [heartRate, setHeartRate] = useState(74);
  const [temp, setTemp] = useState(98.6);
  const [spO2, setSpO2] = useState(99);
  const [respRate, setRespRate] = useState(16);
  const [bloodSugar, setBloodSugar] = useState(110);
  const [painScore, setPainScore] = useState(3);
  const [nursingNotes, setNursingNotes] = useState('');

  // MAR form
  const [medName, setMedName] = useState('Aceclofenac + Paracetamol');
  const [medDose, setMedDose] = useState('1 Tablet Oral');
  const [medRoute, setMedRoute] = useState('Oral');
  const [medTime, setMedTime] = useState('11:00 AM');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleLogVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addNurseVitalLog({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      bedNumber,
      wardName,
      loggedByNurse: currentUser?.name || 'Sister Anjali Nair, RN',
      bp,
      heartRate,
      temp,
      spO2,
      respRate,
      bloodSugar: bloodSugar || undefined,
      painScore,
      nursingNotes: nursingNotes || 'Patient stable, vitals monitored and within normal limits.',
      medicationsAdministered: [
        {
          medicineName: medName,
          dose: medDose,
          route: (medRoute as any) || 'Oral',
          time: medTime,
          status: 'Given'
        }
      ]
    });

    setNursingNotes('');
    alert('Vitals and MAR record successfully logged to EMR.');
  };

  return (
    <div className="space-y-6">
      {/* Header matching CarePlus portal layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Nurse Station & Vitals Triaging
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Digital vital sign charting, blood glucose surveillance, and Medication Administration Record (MAR) for {currentTenant.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            {nurseLogs.length} Vitals Recorded Today
          </span>
        </div>
      </div>

      {/* 4 Stat Cards matching CarePlus portal style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Vitals Logged Today</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {nurseLogs.length}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Observation records</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Active Daycare Beds</span>
          <div className="text-2xl font-extrabold mt-1 text-blue-700 font-heading">
            4
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Occupied beds</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Critical Alerts</span>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 font-heading">
            0
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">All patients stable</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Next MAR Round</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            02:00 PM
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">Scheduled round</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('vitals')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'vitals'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Record Vitals & MAR Administration</span>
        </button>

        <button
          onClick={() => setActiveTab('mar')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'mar'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Observation Logs ({nurseLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: VITALS FORM */}
      {activeTab === 'vitals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-6 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Clinical Triage & Vitals Entry</h3>
            <p className="text-slate-500 text-xs">Synchronizes immediately with Doctor's consultation EMR.</p>
          </div>

          <form onSubmit={handleLogVitals} className="space-y-4">
            {/* Patient & Bed */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ward / Bay</label>
                <input
                  type="text"
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bed Number</label>
                <input
                  type="text"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">SpO2 Oxygen (%)</label>
                <input
                  type="number"
                  value={spO2}
                  onChange={(e) => setSpO2(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Capillary Sugar (mg/dL)</label>
                <input
                  type="number"
                  value={bloodSugar}
                  onChange={(e) => setBloodSugar(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pain Scale (0-10)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={painScore}
                  onChange={(e) => setPainScore(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Respiratory Rate (/min)</label>
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            {/* MAR Medication Administration */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-cyan-600" />
                <span>Medication Administration Record (MAR)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Medicine Name</label>
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Dose & Route</label>
                  <input
                    type="text"
                    value={medDose}
                    onChange={(e) => setMedDose(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Administration Time</label>
                  <input
                    type="text"
                    value={medTime}
                    onChange={(e) => setMedTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nursing Shift & Observation Remarks</label>
              <textarea
                rows={3}
                placeholder="Patient comfort, cannula site inspection, hydration, mobility notes..."
                value={nursingNotes}
                onChange={(e) => setNursingNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Submit Vitals & MAR to Medical Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: OBSERVATION LOGS */}
      {activeTab === 'mar' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Recorded Nursing Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="py-2.5">Timestamp</th>
                  <th className="py-2.5">Patient & Bed</th>
                  <th className="py-2.5">Vital Parameters</th>
                  <th className="py-2.5">Pain (0-10)</th>
                  <th className="py-2.5">Nursing Observations</th>
                  <th className="py-2.5">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {nurseLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3">
                      <strong className="text-slate-900 block font-bold">{log.patientName}</strong>
                      <span className="text-[11px] text-cyan-700 font-semibold">{log.bedNumber} ({log.wardName})</span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-700">
                      <div>BP: {log.bp} | HR: {log.heartRate} bpm</div>
                      <div>SpO2: {log.spO2}% | Temp: {log.temp}°F</div>
                      {log.bloodSugar && <div>Sugar: {log.bloodSugar} mg/dL</div>}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800">
                        {log.painScore}/10
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 max-w-xs">
                      {log.nursingNotes}
                    </td>
                    <td className="py-3 text-slate-700 font-medium">
                      {log.loggedByNurse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
