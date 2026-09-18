import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Stethoscope, 
  Calendar, 
  UserCheck, 
  ClipboardList,
  Sparkles
} from 'lucide-react';

interface MobileBottomNavProps {
  activeBookingsCount: number;
  onOpenScheduler: () => void;
  onOpenSymptomChecker: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeBookingsCount,
  onOpenScheduler,
  onOpenSymptomChecker
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[calc(env(safe-area-inset-bottom,0px)+4px)]">
      <nav className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        
        {/* 1. Home Tab */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isActive('/') 
              ? 'text-[#00897b] font-bold scale-105' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isActive('/') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00897b] rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </Link>

        {/* 2. Specialties / Departments Tab */}
        <Link
          to="/services"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isActive('/services') 
              ? 'text-[#00897b] font-bold scale-105' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Stethoscope className={`w-5 h-5 ${isActive('/services') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isActive('/services') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00897b] rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Specialties</span>
        </Link>

        {/* 3. Center Floating Quick Book Button */}
        <div className="relative -top-3.5 flex flex-col items-center">
          <Link
            to="/book"
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#00796b] to-[#00897b] text-white flex items-center justify-center shadow-lg shadow-[#00897b]/40 border-4 border-white active:scale-95 transition-transform"
            aria-label="Book Appointment"
          >
            <Calendar className="w-6 h-6 stroke-[2.2]" />
          </Link>
          <span className="text-[10px] font-bold text-[#00897b] tracking-tight mt-0.5">
            Book
          </span>
        </div>

        {/* 4. Doctors Tab */}
        <Link
          to="/doctors"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isActive('/doctors') 
              ? 'text-[#00897b] font-bold scale-105' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <UserCheck className={`w-5 h-5 ${isActive('/doctors') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isActive('/doctors') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00897b] rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Doctors</span>
        </Link>

        {/* 5. My Visits / Bookings Tab */}
        <Link
          to="/my-bookings"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            isActive('/my-bookings') 
              ? 'text-[#00897b] font-bold scale-105' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ClipboardList className={`w-5 h-5 ${isActive('/my-bookings') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {activeBookingsCount}
              </span>
            )}
            {isActive('/my-bookings') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00897b] rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">My Visits</span>
        </Link>

      </nav>
    </div>
  );
};
