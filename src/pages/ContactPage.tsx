import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Navigation, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General OPD Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-teal-200">
          <MapPin className="w-3.5 h-3.5" />
          Location &amp; Inquiries
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
          Contact &amp; Hospital Timings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Conveniently located in Old Rajinder Nagar, New Delhi. Reach our front desk directly for appointments, emergency admissions, or reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Clinic Particulars</h2>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Clinic Address</span>
                  <span>{CLINIC_INFO.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Phone Helpline</span>
                  <a href={`tel:${CLINIC_INFO.phonePrimary.replace(/[^0-9]/g, '')}`} className="text-blue-700 hover:underline">
                    {CLINIC_INFO.phonePrimary}
                  </a>
                  <span className="text-slate-400 block mt-0.5">Appointments: {CLINIC_INFO.phoneAppointments1} / {CLINIC_INFO.phoneAppointments2}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">WhatsApp Desk</span>
                  <a 
                    href="https://wa.me/918448960011?text=Hello%20CarePlus%20Hospital%20Demo,%20I%20would%20like%20to%20inquire%20about%20an%20appointment."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    {CLINIC_INFO.phoneAppointments1} (Click to Chat)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Operating Hours</span>
                  <span>{CLINIC_INFO.operatingHours}</span>
                  <span className="text-slate-400 block mt-0.5">{CLINIC_INFO.sundayHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Email Desk</span>
                  <a href={`mailto:${CLINIC_INFO.email}`} className="text-amber-700 hover:underline">
                    {CLINIC_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white p-6 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-5 h-5 text-teal-300" />
              <h3 className="text-sm font-bold">Directions & Metro Connectivity</h3>
            </div>
            <p className="text-xs text-teal-100 leading-relaxed">
              Located within a 5-minute walking distance from Karol Bagh Metro Station (Blue Line) and Sir Ganga Ram Hospital Marg, with valet and parking support.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Transmitted</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for reaching out to CarePlus Hospital (Demo). Our coordinator will call you back within 30 minutes during OPD hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Send a Quick Clinical Inquiry</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Fill out your details below and our front office will respond promptly.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98111 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department of Interest</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    >
                      <option value="Physiotherapy & Rehab">Physiotherapy & Rehab</option>
                      <option value="General OPD & Physician">General OPD & Physician</option>
                      <option value="Orthopaedics & Spine">Orthopaedics & Spine</option>
                      <option value="Diagnostics & Blood Work">Diagnostics & Blood Work</option>
                      <option value="Daycare & IV Infusions">Daycare & IV Infusions</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Medical Question or Symptom</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly describe your symptoms or request..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry to Reception</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
