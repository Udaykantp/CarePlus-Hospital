import React from 'react';

export interface DoctorCardSkeletonProps {
  className?: string;
}

/**
 * Custom skeleton loader component matching Doctor Card geometry and typography hierarchy.
 */
export const DoctorCardSkeleton: React.FC<DoctorCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs animate-pulse ${className}`}
    >
      <div className="space-y-4">
        {/* Header: Avatar + Meta */}
        <div className="flex items-start gap-4">
          {/* Avatar Skeleton */}
          <div className="w-20 h-20 rounded-2xl bg-slate-200 flex-shrink-0 ring-2 ring-slate-100" />

          {/* Name & Specialty Info */}
          <div className="flex-1 min-w-0 space-y-2 pt-0.5">
            {/* Rating Stars Bar */}
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-200/80" />
              <div className="h-3 w-8 bg-slate-200 rounded" />
              <div className="h-3 w-16 bg-slate-100 rounded ml-1" />
            </div>

            {/* Doctor Name */}
            <div className="h-4.5 w-4/5 bg-slate-300 rounded" />

            {/* Department Tag */}
            <div className="h-3.5 w-1/2 bg-teal-100/70 rounded" />

            {/* Qualifications */}
            <div className="h-2.5 w-3/5 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Bio Paragraph Lines */}
        <div className="space-y-1.5 pt-1">
          <div className="h-2.5 bg-slate-200 rounded w-full" />
          <div className="h-2.5 bg-slate-200 rounded w-11/12" />
          <div className="h-2.5 bg-slate-200 rounded w-4/5" />
        </div>

        {/* Clinical Info Box */}
        <div className="p-3 bg-slate-50 rounded-xl space-y-2.5 border border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-teal-200/80 flex-shrink-0" />
            <div className="h-3 bg-slate-200 rounded w-44" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-200/80 flex-shrink-0" />
            <div className="h-3 bg-slate-200 rounded w-40" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-200/80 flex-shrink-0" />
            <div className="h-3 bg-slate-200 rounded w-28" />
          </div>
        </div>
      </div>

      {/* Card Footer: Fee & Action Button */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-2 w-16 bg-slate-200 rounded" />
          <div className="h-4.5 w-14 bg-slate-300 rounded" />
        </div>

        {/* Button Skeleton */}
        <div className="h-9 w-28 bg-teal-200/60 rounded-xl" />
      </div>
    </div>
  );
};

export interface DoctorGridSkeletonProps {
  count?: number;
}

/**
 * Grid skeleton wrapper for Doctors listing page.
 */
export const DoctorGridSkeleton: React.FC<DoctorGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading doctors listing..."
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <span className="sr-only">Loading consultant doctors...</span>
      {Array.from({ length: count }).map((_, index) => (
        <DoctorCardSkeleton key={`doctor-skeleton-${index}`} />
      ))}
    </div>
  );
};
