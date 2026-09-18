import React from 'react';

export interface ServiceCardSkeletonProps {
  className?: string;
}

/**
 * Custom skeleton loader component matching Service Card geometry and typography hierarchy.
 */
export const ServiceCardSkeleton: React.FC<ServiceCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs animate-pulse ${className}`}
    >
      <div className="space-y-4">
        {/* Top Badges Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="h-5 w-24 bg-teal-100/80 rounded-full" />
          <div className="h-4.5 w-28 bg-amber-100/70 rounded-full" />
        </div>

        {/* Title and Short Description */}
        <div className="space-y-2">
          <div className="h-4.5 w-3/4 bg-slate-300 rounded" />
          <div className="space-y-1 pt-0.5">
            <div className="h-2.5 w-full bg-slate-200 rounded" />
            <div className="h-2.5 w-5/6 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Conditions Treated Section */}
        <div className="space-y-2">
          <div className="h-2.5 w-36 bg-slate-200 rounded" />
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-teal-200/80 flex-shrink-0" />
              <div className="h-3 w-4/5 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-teal-200/80 flex-shrink-0" />
              <div className="h-3 w-3/4 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-teal-200/80 flex-shrink-0" />
              <div className="h-3 w-2/3 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        {/* Modalities Box */}
        <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
          <div className="h-2 w-20 bg-slate-200 rounded" />
          <div className="h-3 w-11/12 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Card Footer: Indicative Fee & Book Slot Button */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-2 w-16 bg-slate-200 rounded" />
          <div className="h-3.5 w-24 bg-slate-300 rounded" />
        </div>

        {/* Button Skeleton */}
        <div className="h-9 w-28 bg-teal-200/60 rounded-xl" />
      </div>
    </div>
  );
};

export interface ServiceGridSkeletonProps {
  count?: number;
}

/**
 * Grid skeleton wrapper for Services listing page.
 */
export const ServiceGridSkeleton: React.FC<ServiceGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading clinical specialties..."
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <span className="sr-only">Loading clinical specialties and services...</span>
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={`service-skeleton-${index}`} />
      ))}
    </div>
  );
};
