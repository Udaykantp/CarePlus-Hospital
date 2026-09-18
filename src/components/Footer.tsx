import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp,
  MessageCircle,
  ShieldAlert,
  Building2
} from 'lucide-react';
import { CLINIC_INFO, SERVICES } from '../data/clinicData';

interface FooterProps {
  onOpenScheduler: () => void;
  onOpenBookings: () => void;
  onOpenSymptomChecker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenScheduler,
  onOpenBookings,
  onOpenSymptomChecker
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 text-xs">
          {/* Col 1 & 2: Clinic Overview & Emergency */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white font-heading">
                  CarePlus Hospital
                </span>
                <span className="block text-[11px] text-teal-400 font-semibold tracking-wider">
                  MULTISPECIALITY HEALTHCARE (DEMO)
                </span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Dedicated to compassionate, multi-disciplinary outpatient care. Our senior consultants across physiotherapy, internal medicine, spine, orthopaedics, oncology, dermatology, and child health provide patient-centered treatments in Old Rajinder Nagar, New Delhi.
            </p>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 max-w-sm">
              <div className="text-teal-400 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Helpline & Appointment Inquiries:</span>
              </div>
              <div className="text-sm font-bold text-white">
                {CLINIC_INFO.phonePrimary} &bull; +91 84489 60011
              </div>
              <div className="text-[11px] text-slate-400">
                Monday to Saturday: 9:00 AM - 9:00 PM
              </div>
            </div>
          </div>

          {/* Col 3: Key Clinical Services */}
          <div>
            <h4 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-3">
              Clinical Services
            </h4>
            <ul className="space-y-2 text-slate-400">
              {SERVICES.slice(0, 6).map(srv => (
                <li key={srv.id}>
                  <Link
                    to="/services"
                    className="hover:text-teal-400 transition-colors text-left block"
                  >
                    {srv.title.split('&')[0]}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link to="/services" className="text-teal-400 hover:underline font-semibold">
                  All Treatments &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Patient Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-3">
              Patient Pages
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link
                  to="/book"
                  className="hover:text-teal-400 transition-colors font-medium text-white block"
                >
                  &rarr; Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className="hover:text-teal-400 transition-colors block"
                >
                  My Appointments
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenSymptomChecker}
                  className="hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Symptom Matcher
                </button>
              </li>
              <li>
                <Link
                  to="/doctors"
                  className="hover:text-teal-400 transition-colors block"
                >
                  Specialist Doctors
                </Link>
              </li>
              <li>
                <Link
                  to="/diagnostics"
                  className="hover:text-teal-400 transition-colors block"
                >
                  Diagnostics & Lab
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-teal-400 transition-colors block"
                >
                  About Clinic
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-teal-400 transition-colors block"
                >
                  Location & Metro
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-teal-400 transition-colors block"
                >
                  Health Insights &amp; Blog
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/portal"
                  className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospital Staff Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Location & WhatsApp */}
          <div>
            <h4 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-3">
              Clinic Address
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>29/25, Old Rajinder Nagar, New Delhi - 110060</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/918448960011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Booking</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              Disclaimer: In case of acute life-threatening medical emergency, call 102/112 or visit the nearest hospital casualty immediately.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} CarePlus Hospital (Demo)</span>
            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
