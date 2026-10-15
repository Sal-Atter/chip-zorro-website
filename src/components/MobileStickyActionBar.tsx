import React from 'react';
import { Calendar, Phone, ShieldCheck } from 'lucide-react';

interface MobileStickyActionBarProps {
  onBookNow: () => void;
  phone: string;
}

export const MobileStickyActionBar: React.FC<MobileStickyActionBarProps> = ({
  onBookNow,
  phone,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5 w-full items-center">
        <a
          href={`tel:${phone.replace(/\D/g, '')}`}
          className="h-11 inline-flex items-center justify-center gap-2 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors whitespace-nowrap shadow-2xs"
          aria-label="Call Dispatch"
        >
          <Phone className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="truncate">Call Dispatch</span>
        </a>

        <button
          onClick={onBookNow}
          className="h-11 inline-flex items-center justify-center gap-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-[0.98] shadow-md shadow-orange-600/20 transition-all whitespace-nowrap cursor-pointer"
          aria-label="Book Repair"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="truncate">Book Repair</span>
        </button>
      </div>
    </div>
  );
};
