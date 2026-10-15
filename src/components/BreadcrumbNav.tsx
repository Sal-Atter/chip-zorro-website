import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Home, Shield, Calendar, Wrench, Star, FileText, Lock } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbNavProps {
  activeTab: 'home' | 'booking' | 'dispatch' | 'reviews' | 'claims' | 'admin';
  currentSection?: string | null;
  onNavigateHome: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  activeTab,
  currentSection,
  onNavigateHome,
  onNavigateSection,
}) => {
  // Construct trail based on activeTab and currentSection
  const items: BreadcrumbItem[] = [
    {
      label: 'Home',
      icon: Home,
      onClick: onNavigateHome,
      active: activeTab === 'home' && !currentSection,
    },
  ];

  if (activeTab === 'home') {
    if (currentSection) {
      let sectionLabel = 'Overview';
      let targetId = 'top';

      switch (currentSection) {
        case 'services-section':
          sectionLabel = 'Services & Rates';
          targetId = 'services-section';
          break;
        case 'how-it-works-section':
        case 'windshield-guide-section':
          sectionLabel = 'How It Works & Care Guide';
          targetId = 'how-it-works-section';
          break;
        case 'diagnostic-section':
          sectionLabel = 'Diagnostic Tools';
          targetId = 'diagnostic-section';
          break;
        case 'insurance-billing-section':
          sectionLabel = '$0 Insurance Claims';
          targetId = 'insurance-billing-section';
          break;
        case 'reviews-section':
          sectionLabel = 'Customer Reviews';
          targetId = 'reviews-section';
          break;
        case 'faq-section':
          sectionLabel = 'Frequently Asked Questions';
          targetId = 'faq-section';
          break;
        default:
          sectionLabel = currentSection;
      }

      items.push({
        label: sectionLabel,
        active: true,
        onClick: () => {
          if (targetId === 'top') onNavigateHome();
          else onNavigateSection?.(targetId);
        },
      });
    }
  } else if (activeTab === 'booking') {
    items.push({
      label: 'Schedule Mobile Repair',
      icon: Calendar,
      active: true,
    });
  } else if (activeTab === 'dispatch') {
    items.push({
      label: 'Mobile Fleet Dispatch',
      icon: Wrench,
      active: true,
    });
  } else if (activeTab === 'reviews') {
    items.push({
      label: 'Customer Reviews & Warranty',
      icon: Star,
      active: true,
    });
  } else if (activeTab === 'claims') {
    items.push({
      label: 'Insurance Clearinghouse API',
      icon: Shield,
      active: true,
    });
  } else if (activeTab === 'admin') {
    items.push({
      label: 'Admin Control Center',
      icon: Lock,
      active: true,
    });
  }

  const currentKey = `${activeTab}-${currentSection || 'root'}`;

  return (
    <nav 
      aria-label="Breadcrumb navigation trail" 
      className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 text-xs select-none sticky top-16 z-30 shadow-2xs transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Schema.org BreadcrumbList Microdata with subtle fade-in animation */}
        <AnimatePresence mode="wait">
          <motion.ol 
            key={currentKey}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            itemScope 
            itemType="https://schema.org/BreadcrumbList" 
            className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-slate-500 font-medium"
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const Icon = item.icon;

              return (
                <li 
                  key={index} 
                  itemProp="itemListElement" 
                  itemScope 
                  itemType="https://schema.org/ListItem"
                  className="inline-flex items-center gap-1.5"
                >
                  {index > 0 && (
                    <ChevronRight 
                      className="w-3.5 h-3.5 text-slate-400 shrink-0" 
                      aria-hidden="true" 
                    />
                  )}

                  {item.active || isLast ? (
                    <motion.span 
                      initial={{ opacity: 0.6, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      aria-current="page"
                      className="inline-flex items-center gap-1.5 font-bold text-slate-900 bg-slate-100/90 border border-slate-200/60 px-2 py-0.5 rounded-md text-[11px] sm:text-xs truncate max-w-[220px] sm:max-w-none shadow-2xs"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                      <span itemProp="name">{item.label}</span>
                    </motion.span>
                  ) : (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-orange-600 transition-colors cursor-pointer text-[11px] sm:text-xs hover:underline decoration-orange-400/50 underline-offset-2"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 shrink-0" />}
                      <span itemProp="name">{item.label}</span>
                    </button>
                  )}

                  <meta itemProp="position" content={String(index + 1)} />
                </li>
              );
            })}
          </motion.ol>
        </AnimatePresence>

        {/* Quick status cue */}
        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mobile Van Network: Active</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-mono text-slate-500">
            {activeTab.toUpperCase()}
          </span>
        </div>
      </div>
    </nav>
  );
};
