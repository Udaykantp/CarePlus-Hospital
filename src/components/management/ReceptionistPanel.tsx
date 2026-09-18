import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { AppointmentRecord, SyntheticPatient } from '../../types/management';
import { 
  Users, 
  Calendar, 
  Clock, 
  UserPlus, 
  Search, 
  CheckCircle2, 
  Building2, 
  Ticket, 
  ArrowRight,
  Phone,
  Filter,
  Plus
} from 'lucide-react';

export const ReceptionistPanel: React.FC = () => {
  const { currentTenant, allUsers } = useAuth();
  const { 
    appointments, 
    patients, 
    addPatient, 
    addAppointment, 
    updateAppointmentStatus 
  } = useClinicData();

  const [activeTab, setActiveTab] = useState<'queue' | 'book' | 'register'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('All');

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    doctorId: 'dr-mehak-arora',
    doctorName: 'Dr. Mehak Arora (PT)',
    department: 'Physiotherapy & Spine Rehabilitation',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '02:00 PM - 02:30 PM',
    type: 'In-Clinic' as AppointmentRecord['type'],
    chiefComplaint: '',
    fee: 1000
  });

  // Fast Patient Registration Form State
  const [patForm, setPatForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male' as SyntheticPatient['gender'],
    age: 32,
    bloodGroup: 'B+' as SyntheticPatient['bloodGroup'],
    phone: '',
    email: '',
    address: 'Old Rajinder Nagar',
    city: 'New Delhi',
    allergiesInput: 'None Known (NKDA)',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: 'None / Self-Pay',
    insurancePolicyNumber: ''
  });

  const doctorsList = allUsers.filter(u => u.tenantId === currentTenant.id && u.role === 'doctor');

  // Filtered appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoctor = selectedDoctorFilter === 'All' || apt.doctorId === selectedDoctorFilter;
    return matchesSearch && matchesDoctor;
  });

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patForm.firstName || !patForm.lastName || !patForm.phone) return;

    const newPat = addPatient({
      firstName: patForm.firstName,
      lastName: patForm.lastName,
      dateOfBirth: `1994-05-12`,
      age: patForm.age,
      gender: patForm.gender,
      bloodGroup: patForm.bloodGroup,
      phone: patForm.phone,
      email: patForm.email || `${patForm.firstName.toLowerCase()}@synthetic.demo`,
      address: patForm.address,
      city: patForm.city,
      allergies: patForm.allergiesInput.split(',').map(s => s.trim()),
      chronicConditions: ['None Reported'],
      emergencyContact: {
        name: patForm.emergencyContactName || 'Family Member',
        relationship: 'Kin',
        phone: patForm.emergencyContactPhone || patForm.phone
      },
      insuranceProvider: patForm.insuranceProvider,
      insurancePolicyNumber: patForm.insurancePolicyNumber,
      status: 'active'
    });

    // Auto-select for booking
    setBookingForm({
      ...bookingForm,
      patientId: newPat.id
    });
    setActiveTab('book');
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === bookingForm.patientId);
    if (!pat) return;

    const nextToken = appointments.length + 1;

    addAppointment({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      patientPhone: pat.phone,
      doctorId: bookingForm.doctorId,
      doctorName: bookingForm.doctorName,
      department: bookingForm.department,
      date: bookingForm.date,
      timeSlot: bookingForm.timeSlot,
      type: bookingForm.type,
      chiefComplaint: bookingForm.chiefComplaint || 'Routine Medical Evaluation',
      status: 'Checked In', // Check in immediately for walk-in
      tokenNumber: nextToken,
      priority: 'Routine',
      billingStatus: 'Unbilled',
      fee: bookingForm.fee,
      checkedInAt: new Date().toISOString()
    });

    setActiveTab('queue');
  };

  return (
    <div className="space-y-6">
      {/* Header matching CarePlus portal layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Appointments & OPD Front Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time patient check-in, token ticketing, walk-in registration, and doctor queue triage for {currentTenant.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            Queue: {filteredAppointments.filter(a => a.status === 'Checked In' || a.status === 'In Consultation').length} Waiting
          </span>
          <button
            onClick={() => setActiveTab('register')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Live OPD Queue ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('book')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'book'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Appointment Slot</span>
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'register'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Fast Registration</span>
        </button>
      </div>

      {/* TAB 1: LIVE OPD QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, token, complaint..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Filter Clinician:</span>
              <select
                value={selectedDoctorFilter}
                onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="All">All Doctors</option>
                {doctorsList.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Patient Name & Phone</th>
                  <th className="py-3 px-4">Doctor & Department</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Queue Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        {apt.tokenNumber || '—'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block font-bold">{apt.patientName}</strong>
                      <span className="text-slate-500 text-[11px] font-mono">{apt.patientPhone}</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">{apt.referenceNumber}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-semibold">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{apt.department}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div>{apt.timeSlot}</div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{apt.type}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        apt.status === 'Checked In'
                          ? 'bg-blue-100 text-blue-900'
                          : apt.status === 'In Consultation'
                          ? 'bg-amber-100 text-amber-900 animate-pulse'
                          : apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      {apt.status === 'Scheduled' || apt.status === 'Confirmed' ? (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'Checked In')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Check In Patient
                        </button>
                      ) : apt.status === 'Checked In' ? (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Call Into Chamber
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">No action needed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BOOK APPOINTMENT */}
      {activeTab === 'book' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Schedule & Issue Consultation Token</h3>

          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Patient from Registry</label>
              <select
                required
                value={bookingForm.patientId}
                onChange={(e) => setBookingForm({ ...bookingForm, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="">-- Choose Registered Patient (50+ available) --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} &bull; {p.mrn} &bull; {p.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Doctor</label>
                <select
                  value={bookingForm.doctorId}
                  onChange={(e) => {
                    const doc = doctorsList.find(d => d.id === e.target.value);
                    setBookingForm({
                      ...bookingForm,
                      doctorId: e.target.value,
                      doctorName: doc?.name || 'Dr. Mehak Arora (PT)',
                      department: doc?.department || 'Physiotherapy & Spine Rehabilitation'
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="dr-mehak-arora">Dr. Mehak Arora (PT) - Physiotherapy</option>
                  <option value="dr-bibhu-bishwas">Dr. Bibhu Anand Bishwas - General Medicine</option>
                  <option value="dr-rohan-krishnan">Dr. Rohan Krishnan - Orthopaedics</option>
                  <option value="dr-dhruv-anand">Dr. Dhruv Anand - Chest Medicine</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Type</label>
                <select
                  value={bookingForm.type}
                  onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="In-Clinic">In-Clinic Consultation</option>
                  <option value="Online Video">Telemedicine Video OPD</option>
                  <option value="Home Visit">Home Rehabilitation Visit</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                <input
                  type="text"
                  value={bookingForm.timeSlot}
                  onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chief Medical Complaint</label>
              <textarea
                rows={2}
                placeholder="Reason for visit, symptoms..."
                value={bookingForm.chiefComplaint}
                onChange={(e) => setBookingForm({ ...bookingForm, chiefComplaint: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Confirm Booking & Check-In Token
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: REGISTER NEW PATIENT */}
      {activeTab === 'register' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Fast Walk-In Patient Registration</h3>
            <p className="text-slate-500 text-xs">Instantly creates MRN and patient profile in {currentTenant.name}.</p>
          </div>

          <form onSubmit={handleRegisterPatient} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul"
                  value={patForm.firstName}
                  onChange={(e) => setPatForm({ ...patForm, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Verma"
                  value={patForm.lastName}
                  onChange={(e) => setPatForm({ ...patForm, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={patForm.age}
                  onChange={(e) => setPatForm({ ...patForm, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={patForm.gender}
                  onChange={(e) => setPatForm({ ...patForm, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={patForm.bloodGroup}
                  onChange={(e) => setPatForm({ ...patForm, bloodGroup: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98100 12345"
                  value={patForm.phone}
                  onChange={(e) => setPatForm({ ...patForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, or None Known"
                  value={patForm.allergiesInput}
                  onChange={(e) => setPatForm({ ...patForm, allergiesInput: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Register & Proceed to Book Token
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
