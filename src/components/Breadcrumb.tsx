import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Building2
} from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export interface BreadcrumbProps {
  /**
   * Explicit breadcrumb items trail.
   * If omitted, breadcrumb items are automatically derived from the current route.
   */
  items?: BreadcrumbItem[];
  /**
   * Whether to display the root Home link (defaults to true).
   */
  showHome?: boolean;
  /**
   * Label for the home link (defaults to 'Home').
   */
  homeLabel?: string;
  /**
   * Whether to include a quick back button before the breadcrumb trail.
   */
  showBackButton?: boolean;
  /**
   * Custom back target URL. If not provided, invokes browser history back.
   */
  backHref?: string;
  /**
   * Optional custom back button label.
   */
  backLabel?: string;
  /**
   * Optional contextual badge or status indicator displayed at the end.
   */
  badge?: string;
  /**
   * Additional container class names.
   */
  className?: string;
}

// Built-in route dictionary for automatic breadcrumb resolution
const ROUTE_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  services: { label: 'Specialties & Care', icon: Activity },
  doctors: { label: 'Consultant Doctors', icon: Stethoscope },
  diagnostics: { label: 'Diagnostics & Pathology', icon: FlaskConical },
  about: { label: 'About CarePlus', icon: Info },
  contact: { label: 'Contact & Clinic Hours', icon: Phone },
  book: { label: 'Book Consultation', icon: Calendar },
  'my-bookings': { label: 'My Appointments & Passes', icon: BookmarkCheck },
  portal: { label: 'Hospital Administration', icon: Building2 }
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  homeLabel = 'Home',
  showBackButton = false,
  backHref,
  backLabel = 'Back',
  badge,
  className = ''
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve items: use custom items if supplied, otherwise compute from path
  let trail: BreadcrumbItem[] = [];

  if (items && items.length > 0) {
    trail = items;
  } else {
    // Generate from pathname
    const segments = location.pathname.split('/').filter(Boolean);
    let accumulatedPath = '';

    trail = segments.map((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const config = ROUTE_CONFIG[segment.toLowerCase()];

      return {
        label: config?.label || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        href: isLast ? undefined : accumulatedPath,
        icon: config?.icon,
        current: isLast
      };
    });
  }

  const handleBack = () => {
    if (backHref) {
      navigate(backHref);
    } else {
      navigate(-1);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={`w-full ${className}`}
    >
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-xs border border-slate-200/80 px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-2xs overflow-hidden">
        {/* Left Side: Back button + Breadcrumb trail */}
        <div className="flex items-center gap-2 min-w-0 overflow-x-auto scrollbar-none py-0.5">
          {showBackButton && (
            <>
              <button
                type="button"
                onClick={handleBack}
                aria-label={backLabel}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-slate-200/70 px-2 py-1 rounded-lg transition-colors cursor-pointer flex-shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{backLabel}</span>
              </button>
              <span className="text-slate-300 select-none flex-shrink-0">|</span>
            </>
          )}

          <ol 
            className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-500 whitespace-nowrap min-w-0"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
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
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 flex-shrink-0 select-none" />
              </li>
            )}

            {trail.map((item, index) => {
              const isLast = index === trail.length - 1;
              const position = (showHome ? 2 : 1) + index;
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
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-700 font-medium transition-colors truncate max-w-[140px] sm:max-w-[200px]"
                        itemProp="item"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                        <span itemProp="name" className="truncate">{item.label}</span>
                      </Link>
                      <meta itemProp="position" content={String(position)} />
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 flex-shrink-0 select-none" />
                    </>
                  ) : (
                    <span 
                      className="inline-flex items-center gap-1 font-bold text-slate-800 truncate max-w-[170px] sm:max-w-[260px]"
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
        </div>

        {/* Right Side: Optional badge or count */}
        {badge && (
          <div className="flex-shrink-0 pl-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200/80">
              {badge}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};
