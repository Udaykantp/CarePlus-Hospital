import React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Home, 
  ChevronRight, 
  ArrowLeft, 
  Stethoscope, 
  Activity, 
  FlaskConical, 
  Calendar, 
  Info, 
  Phone, 
  BookmarkCheck,
  FileText
} from 'lucide-react';
import { DOCTORS, SERVICES, DIAGNOSTIC_TESTS } from '../data/clinicData';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export interface BreadcrumbsProps {
  /**
   * Optional manual override list of breadcrumb items.
   * If omitted, dynamically reflects the current route and search params.
   */
  items?: BreadcrumbItem[];
  /**
   * Whether to render the breadcrumb on the homepage root ('/'). Defaults to false.
   */
  showOnHome?: boolean;
  /**
   * Whether to display the root Home link (defaults to true).
   */
  showHome?: boolean;
  /**
   * Custom label for the home root link. Defaults to 'Home'.
   */
  homeLabel?: string;
  /**
   * Whether to display a quick 'Back' navigation button. Defaults to true.
   */
  showBackButton?: boolean;
  /**
   * Custom back target path. If not provided, invokes browser history back.
   */
  backHref?: string;
  /**
   * Custom back button text label (defaults to 'Back').
   */
  backLabel?: string;
  /**
   * Optional badge text displayed on the right edge.
   */
  badge?: string;
  /**
   * Custom outer styling.
   */
  className?: string;
}

// Built-in map of standard top-level routes to human titles and icons
const ROUTE_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  services: { label: 'Services', icon: Activity },
  doctors: { label: 'Doctors', icon: Stethoscope },
  diagnostics: { label: 'Diagnostics', icon: FlaskConical },
  about: { label: 'About Us', icon: Info },
  contact: { label: 'Contact', icon: Phone },
  book: { label: 'Book Appointment', icon: Calendar },
  'my-bookings': { label: 'My Appointments', icon: BookmarkCheck },
  'medical-records': { label: 'Medical Records & Rx', icon: FileText }
};

/**
 * Reusable Breadcrumbs component built with Tailwind CSS.
 * Dynamically resolves the active URL path, nested route segments, and query parameters
 * (e.g. Home > Services > Cardiology, Home > Doctors > Dr. Rohan Krishnan).
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showOnHome = false,
  showHome = true,
  homeLabel = 'Home',
  showBackButton = true,
  backHref,
  backLabel = 'Back',
  badge,
  className = ''
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const pathname = location.pathname;

  // By default, do not render breadcrumbs on the homepage landing view unless explicitly requested
  if (pathname === '/' && !showOnHome && (!items || items.length === 0)) {
    return null;
  }

  // Determine breadcrumb items list
  let trail: BreadcrumbItem[] = [];

  if (items && items.length > 0) {
    trail = items;
  } else {
    // Dynamically calculate from pathname and searchParams
    const segments = pathname.split('/').filter(Boolean);
    const topSegment = segments[0]?.toLowerCase() || '';

    // If topSegment exists in known routes
    if (topSegment && ROUTE_LABELS[topSegment]) {
      const topConfig = ROUTE_LABELS[topSegment];
      const hasSubSegment = segments.length > 1;
      const categoryParam = searchParams.get('category');
      const specialtyParam = searchParams.get('specialty');
      const doctorParam = searchParams.get('doctor');
      const serviceParam = searchParams.get('service');

      // Top level crumb
      const isTopCurrent = !hasSubSegment && !categoryParam && !specialtyParam && !doctorParam && !serviceParam;
      trail.push({
        label: topConfig.label,
        href: isTopCurrent ? undefined : `/${topSegment}`,
        icon: topConfig.icon,
        current: isTopCurrent
      });

      // Check sub-paths or search parameters for nested hierarchical reflection
      if (topSegment === 'services') {
        // E.g. /services/cardiology or /services?category=Cardiology
        const subCat = segments[1] || categoryParam;
        if (subCat && subCat.toLowerCase() !== 'all') {
          // Format category nicely
          const decoded = decodeURIComponent(subCat).replace(/-/g, ' ');
          const formatted = decoded.replace(/\b\w/g, l => l.toUpperCase());
          trail.push({
            label: formatted,
            current: true
          });
        }
      } else if (topSegment === 'doctors') {
        // E.g. /doctors/orthopaedics or /doctors?specialty=Spine+%26+Joint+Replacement or ?doctor=dr-rohan-krishnan
        if (doctorParam) {
          const doc = DOCTORS.find(d => d.id === doctorParam);
          if (doc) {
            trail.push({
              label: doc.name,
              current: true
            });
          }
        } else {
          const subSpecialty = segments[1] || specialtyParam;
          if (subSpecialty && subSpecialty.toLowerCase() !== 'all') {
            const decoded = decodeURIComponent(subSpecialty).replace(/-/g, ' ');
            const formatted = decoded.replace(/\b\w/g, l => l.toUpperCase());
            trail.push({
              label: formatted,
              current: true
            });
          }
        }
      } else if (topSegment === 'diagnostics') {
        // E.g. /diagnostics?category=Pathology or /diagnostics/pathology
        const subCat = segments[1] || categoryParam;
        if (subCat && subCat.toLowerCase() !== 'all') {
          const decoded = decodeURIComponent(subCat).replace(/-/g, ' ');
          const formatted = decoded.replace(/\b\w/g, l => l.toUpperCase());
          trail.push({
            label: formatted,
            current: true
          });
        }
      } else if (topSegment === 'book') {
        // E.g. /book?doctor=dr-mehak-arora or /book?service=physiotherapy
        if (doctorParam) {
          const doc = DOCTORS.find(d => d.id === doctorParam);
          if (doc) {
            trail.push({
              label: doc.name,
              href: `/doctors?doctor=${doc.id}`
            });
            trail.push({
              label: 'Slot Selection',
              current: true
            });
          }
        } else if (serviceParam) {
          const serv = SERVICES.find(s => s.id === serviceParam);
          if (serv) {
            trail.push({
              label: serv.title,
              href: `/services`
            });
            trail.push({
              label: 'Slot Selection',
              current: true
            });
          }
        }
      } else if (hasSubSegment) {
        // Generic nested path fallback
        for (let i = 1; i < segments.length; i++) {
          const seg = segments[i];
          const isLast = i === segments.length - 1;
          const subPath = `/${segments.slice(0, i + 1).join('/')}`;
          const formatted = decodeURIComponent(seg).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          trail.push({
            label: formatted,
            href: isLast ? undefined : subPath,
            current: isLast
          });
        }
      }
    } else if (segments.length > 0) {
      // Unmapped routes
      let accumulated = '';
      segments.forEach((seg, i) => {
        accumulated += `/${seg}`;
        const isLast = i === segments.length - 1;
        trail.push({
          label: decodeURIComponent(seg).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          href: isLast ? undefined : accumulated,
          current: isLast
        });
      });
    }
  }

  const handleBack = () => {
    if (backHref) {
      navigate(backHref);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`w-full bg-slate-50/90 border-b border-slate-200/80 backdrop-blur-xs py-2.5 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-0">
        <nav 
          aria-label="Breadcrumb navigation"
          className="flex items-center gap-2 min-w-0 overflow-x-auto scrollbar-none py-0.5"
        >
          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              title="Go back to previous page"
              aria-label={backLabel}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-teal-700 bg-white hover:bg-slate-100 border border-slate-200/80 px-2 py-1 rounded-lg transition-colors cursor-pointer flex-shrink-0 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{backLabel}</span>
            </button>
          )}

          <ol 
            className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 whitespace-nowrap min-w-0"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            {/* Root Home Item */}
            {showHome && (
              <li 
                className="inline-flex items-center flex-shrink-0"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-700 font-medium transition-colors group"
                  itemProp="item"
                >
                  <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  <span itemProp="name">{homeLabel}</span>
                </Link>
                <meta itemProp="position" content="1" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1 flex-shrink-0 select-none" />
              </li>
            )}

            {/* Trail Segments */}
            {trail.map((item, index) => {
              const isLast = index === trail.length - 1 || item.current;
              const position = index + 2;
              const Icon = item.icon;

              return (
                <li
                  key={index}
                  className="inline-flex items-center min-w-0 flex-shrink-0"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {item.href && !isLast ? (
                    <>
                      <Link
                        to={item.href}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-700 font-medium transition-colors truncate max-w-[130px] sm:max-w-[200px]"
                        itemProp="item"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                        <span itemProp="name" className="truncate">{item.label}</span>
                      </Link>
                      <meta itemProp="position" content={String(position)} />
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1 flex-shrink-0 select-none" />
                    </>
                  ) : (
                    <span 
                      className="inline-flex items-center gap-1 font-semibold text-slate-900 truncate max-w-[160px] sm:max-w-[260px]"
                      aria-current="page"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />}
                      <span itemProp="name" className="truncate">{item.label}</span>
                      <meta itemProp="position" content={String(position)} />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Optional Right-Hand Context Badge */}
        {badge && (
          <div className="flex-shrink-0 pl-2 hidden sm:block">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { Breadcrumbs as Breadcrumb };
export default Breadcrumbs;
