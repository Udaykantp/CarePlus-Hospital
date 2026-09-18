import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Bed, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Check, 
  CircleDot, 
  Pill, 
  UserPlus, 
  CalendarPlus, 
  FileEdit, 
  FileText, 
  FolderLock, 
  CreditCard, 
  X,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';

interface HospitalDashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenQuickAction: (action: string) => void;
}

interface AppointmentRow {
  id: string;
  time: string;
  patientName: string;
  patientAvatar: string;
  age: number;
  gender: string;
  phone: string;
  reason: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  type: string;
}

export const HospitalDashboardView: React.FC<HospitalDashboardViewProps> = ({
  onNavigateTab,
  onOpenQuickAction
}) => {
  const { currentUser } = useAuth();
  const { patients } = useClinicData();

  // Active day in Doctor Schedule week strip (Default: Tue 10)
  const [selectedDay, setSelectedDay] = useState<number>(10);

  // Selected appointment for details modal
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRow | null>(null);

  // Quick action modals
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);

  // New patient state
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Female',
    bloodGroup: 'B+'
  });
  const [patientAddedMsg, setPatientAddedMsg] = useState(false);

  // New appointment state
  const [newAppt, setNewAppt] = useState({
    patientName: '',
    time: '10:00 AM',
    reason: 'Routine Health Checkup',
    date: '2025-06-10'
  });
  const [apptBookedMsg, setApptBookedMsg] = useState(false);

  // Exact appointments from the uploaded design screenshot
  const appointments: AppointmentRow[] = [
    {
      id: 'apt-1',
      time: '09:00 AM',
      patientName: 'Priya Sharma',
      patientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      age: 28,
      gender: 'Female',
      phone: '+91 98112 45890',
      reason: 'Fever & Cough',
      status: 'Completed',
      type: 'Follow-up'
    },
    {
      id: 'apt-2',
      time: '09:45 AM',
      patientName: 'Rohit Verma',
      patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      age: 34,
      gender: 'Male',
      phone: '+91 98711 67234',
      reason: 'Back Pain',
      status: 'Completed',
      type: 'New Patient'
    },
    {
      id: 'apt-3',
      time: '10:30 AM',
      patientName: 'Neha Gupta',
      patientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      age: 26,
      gender: 'Female',
      phone: '+91 99100 23411',
      reason: 'Skin Allergy',
      status: 'In Progress',
      type: 'Consultation'
    },
    {
      id: 'apt-4',
      time: '11:15 AM',
      patientName: 'Amit Kumar',
      patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      age: 45,
      gender: 'Male',
      phone: '+91 97180 88912',
      reason: 'Diabetes Follow-up',
      status: 'Upcoming',
      type: 'Follow-up'
    },
    {
      id: 'apt-5',
      time: '12:00 PM',
      patientName: 'Simran Kaur',
      patientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      age: 32,
      gender: 'Female',
      phone: '+91 98990 77621',
      reason: 'Thyroid Checkup',
      status: 'Upcoming',
      type: 'Consultation'
    }
  ];

  // Schedule timeline entries matching screenshot
  const scheduleTimeline = [
    { time: '09:00 AM', name: 'Priya Sharma', tag: '(Follow-up)', status: 'Completed', color: 'emerald' },
    { time: '09:45 AM', name: 'Rohit Verma', tag: '(New Patient)', status: 'Completed', color: 'emerald' },
    { time: '10:30 AM', name: 'Neha Gupta', tag: '(Consultation)', status: 'In Progress', color: 'blue' },
    { time: '11:15 AM', name: 'Amit Kumar', tag: '(Follow-up)', status: 'Upcoming', color: 'amber' },
    { time: '12:00 PM', name: 'Simran Kaur', tag: '(Consultation)', status: 'Upcoming', color: 'amber' },
    { time: '01:00 PM', name: 'Lunch Break', tag: '—', status: 'Break', color: 'slate' },
    { time: '02:00 PM', name: 'Sandeep Yadav', tag: '(New Patient)', status: 'Upcoming', color: 'amber' },
  ];

  // Weekday strip items
  const weekDays = [
    { day: 'Mon', date: 9 },
    { day: 'Tue', date: 10 },
    { day: 'Wed', date: 11 },
    { day: 'Thu', date: 12 },
    { day: 'Fri', date: 13 },
    { day: 'Sat', date: 14 },
    { day: 'Sun', date: 15 },
  ];

  // Prescriptions list matching screenshot
  const prescriptions = [
    { medicine: 'Paracetamol 500mg', date: '10 Jun 2025' },
    { medicine: 'Amoxicillin 500mg', date: '9 Jun 2025' },
    { medicine: 'Cetirizine 10mg', date: '8 Jun 2025' },
    { medicine: 'Pantoprazole 40mg', date: '7 Jun 2025' },
  ];

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name) return;
    setPatientAddedMsg(true);
    setTimeout(() => {
      setPatientAddedMsg(false);
      setShowAddPatientModal(false);
      setNewPatient({ name: '', phone: '', age: '', gender: 'Female', bloodGroup: 'B+' });
    }, 1200);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.patientName) return;
    setApptBookedMsg(true);
    setTimeout(() => {
      setApptBookedMsg(false);
      setShowBookAppointmentModal(false);
      setNewAppt({ patientName: '', time: '10:00 AM', reason: 'Routine Health Checkup', date: '2025-06-10' });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP GREETING & DATE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Good Morning, Dr. <span className="italic font-extrabold text-slate-900">{currentUser?.name?.replace(/^Dr\.\s*/, '') || 'Rahul Sharma'}</span> 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening at your hospital today.
          </p>
        </div>

        <div className="text-left sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Tue, 10 Jun 2025</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            10:24 AM
          </div>
        </div>
      </div>

      {/* 2. TOP 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Patients */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[#e0e7ff] text-[#4338ca] flex items-center justify-center flex-shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-500">Total Patients</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">248</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                12%
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">vs. last 7 days</div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-500">Today's Appointments</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">18</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                3%
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">vs. yesterday</div>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-500">Pending Reports</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">6</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                <ArrowDownRight className="w-3.5 h-3.5" />
                40%
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">vs. last 7 days</div>
          </div>
        </div>

        {/* Total Admissions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-[#ffe4e6] text-[#be123c] flex items-center justify-center flex-shrink-0">
            <Bed className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-500">Total Admissions</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">12</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                20%
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">vs. last 7 days</div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: TODAY'S APPOINTMENTS (LEFT 60%) + DOCTOR SCHEDULE (RIGHT 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Today's Appointments */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Today's Appointments
            </h2>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
            <table className="w-full text-xs text-left min-w-[540px]">
              <thead>
                <tr className="text-slate-500 font-semibold text-[11px] border-b border-slate-100 pb-3">
                  <th className="py-2.5 font-semibold text-slate-500">Time</th>
                  <th className="py-2.5 font-semibold text-slate-500">Patient Name</th>
                  <th className="py-2.5 font-semibold text-slate-500">Age / Gender</th>
                  <th className="py-2.5 font-semibold text-slate-500">Reason</th>
                  <th className="py-2.5 font-semibold text-slate-500">Status</th>
                  <th className="py-2.5 font-semibold text-slate-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-medium text-slate-700 whitespace-nowrap">
                      {apt.time}
                    </td>
                    <td className="py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={apt.patientAvatar}
                          alt={apt.patientName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="font-bold text-slate-900">{apt.patientName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600 whitespace-nowrap">
                      {apt.age} / {apt.gender}
                    </td>
                    <td className="py-3.5 text-slate-600 whitespace-nowrap">
                      {apt.reason}
                    </td>
                    <td className="py-3.5 whitespace-nowrap">
                      {apt.status === 'Completed' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Completed
                        </span>
                      )}
                      {apt.status === 'In Progress' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                          In Progress
                        </span>
                      )}
                      {apt.status === 'Upcoming' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Doctor Schedule */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Doctor Schedule
            </h2>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Calendar</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          {/* Weekday Selector Strip */}
          <div className="grid grid-cols-7 gap-1.5 pb-4 border-b border-slate-100 text-center">
            {weekDays.map((item) => {
              const isSelected = selectedDay === item.date;
              return (
                <button
                  key={item.date}
                  onClick={() => setSelectedDay(item.date)}
                  className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className={`text-[10px] uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold mt-0.5">
                    {item.date}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Schedule Timeline */}
          <div className="pt-4 space-y-3.5 text-xs">
            {scheduleTimeline.map((slot, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {slot.color === 'emerald' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  )}
                  {slot.color === 'blue' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                  )}
                  {slot.color === 'amber' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  )}
                  {slot.color === 'slate' && (
                    <span className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0" />
                  )}

                  <span className="font-semibold text-slate-700 w-16">{slot.time}</span>
                  <span className={`font-bold ${slot.name === 'Lunch Break' ? 'text-slate-400 italic' : 'text-slate-900'}`}>
                    {slot.name}
                  </span>
                  <span className="text-slate-400 text-[11px]">{slot.tag}</span>
                </div>

                <div className="text-right">
                  {slot.status === 'Completed' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Completed
                    </span>
                  )}
                  {slot.status === 'In Progress' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                      <CircleDot className="w-3.5 h-3.5" />
                      In Progress
                    </span>
                  )}
                  {slot.status === 'Upcoming' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                      <CircleDot className="w-3.5 h-3.5" />
                      Upcoming
                    </span>
                  )}
                  {slot.status === 'Break' && (
                    <span className="text-[11px] text-slate-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: PATIENT OVERVIEW + RECENT PRESCRIPTIONS + QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
        {/* Card 1: Patient Overview (Donut Chart & Legend) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Patient Overview
            </h2>
            <button
              onClick={() => onNavigateTab('patients')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          {/* SVG Donut Chart + Legend */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Donut graphic */}
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="11"
                />
                {/* Slice 1: Follow-up (41%) - Blue #3b82f6 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset="0"
                />
                {/* Slice 2: New Patient (27%) - Green #22c55e */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset="97.89" // 41% offset
                />
                {/* Slice 3: Emergency (13%) - Amber #f59e0b */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset="162.35" // (41+27=68%) offset
                />
                {/* Slice 4: Other (19%) - Purple #a855f7 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset="193.39" // (68+13=81%) offset
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 font-heading leading-tight">248</span>
                <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Total Patients</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-2 text-xs flex-1 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600">Follow-up</span>
                </div>
                <span className="font-bold text-slate-900">102 <span className="font-normal text-slate-400 text-[11px]">(41%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">New Patient</span>
                </div>
                <span className="font-bold text-slate-900">68 <span className="font-normal text-slate-400 text-[11px]">(27%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600">Emergency</span>
                </div>
                <span className="font-bold text-slate-900">32 <span className="font-normal text-slate-400 text-[11px]">(13%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-600">Other</span>
                </div>
                <span className="font-bold text-slate-900">46 <span className="font-normal text-slate-400 text-[11px]">(19%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Recent Prescriptions */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Recent Prescriptions
            </h2>
            <button
              onClick={() => onNavigateTab('prescriptions')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{rx.medicine}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rx.date}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Issued
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Add New Patient */}
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-900 text-[11px] leading-tight">Add New Patient</span>
            </button>

            {/* Book Appointment */}
            <button
              onClick={() => setShowBookAppointmentModal(true)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-900 text-[11px] leading-tight">Book Appointment</span>
            </button>

            {/* Write Prescription */}
            <button
              onClick={() => onNavigateTab('prescriptions')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileEdit className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-900 text-[11px] leading-tight">Write Prescription</span>
            </button>

            {/* View Reports */}
            <button
              onClick={() => onNavigateTab('lab')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-900 text-[11px] leading-tight">View Reports</span>
            </button>

            {/* Patient Records */}
            <button
              onClick={() => onNavigateTab('records')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderLock className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-900 text-[11px] leading-tight">Patient Records</span>
            </button>

            {/* Billing & Payments */}
            <button
              onClick={() => onNavigateTab('billing')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-900 text-[11px] leading-tight">Billing & Payments</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. FOOTER BAR MATCHING SCREENSHOT */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>CarePlus Hospital Management System</span>
        <span>Advanced Healthcare &bull; Better Outcomes</span>
      </div>

      {/* ================= MODALS ================= */}

      {/* Appointment View Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedAppointment.patientAvatar}
                  alt={selectedAppointment.patientName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedAppointment.patientName}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedAppointment.age} Yrs &bull; {selectedAppointment.gender} &bull; {selectedAppointment.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheduled Time</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedAppointment.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Appointment Type</span>
                  <span className="font-bold text-blue-700">{selectedAppointment.type}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Chief Reason for Consultation</span>
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-800 font-medium">
                  {selectedAppointment.reason}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Blood Group</span>
                  <span className="font-bold text-slate-800">O+ Positive</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Clinical Vitals Status</span>
                  <span className="font-bold text-emerald-700">Logged (BP: 120/80)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedAppointment(null);
                  onNavigateTab('records');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Open Medical EMR Workstation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Patient</h3>
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {patientAddedMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-emerald-950">Patient Successfully Registered!</h4>
                <p className="text-xs text-slate-500">UHID #HH-2025-901 generated.</p>
              </div>
            ) : (
              <form onSubmit={handleCreatePatient} className="py-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deepika Rao"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98123 45678"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 29"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={newPatient.bloodGroup}
                      onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    >
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPatientModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                  >
                    Register Patient
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Book OPD Appointment</h3>
              </div>
              <button
                onClick={() => setShowBookAppointmentModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {apptBookedMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-emerald-950">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-500">Token allocated and added to today's schedule.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateAppointment} className="py-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={newAppt.patientName}
                    onChange={(e) => setNewAppt({ ...newAppt, patientName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newAppt.date}
                      onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={newAppt.time}
                      onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:45 AM">10:45 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Reason</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Knee joint rehabilitation / fever"
                    value={newAppt.reason}
                    onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookAppointmentModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                  >
                    Schedule Slot
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
