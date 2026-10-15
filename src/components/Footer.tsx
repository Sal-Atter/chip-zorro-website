import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';
import logoImg from '../assets/images/chip_zorro_logo.png';
import { SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (tab: 'home' | 'booking' | 'dispatch' | 'reviews' | 'claims' | 'admin') => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, siteSettings }) => {
  const phone = siteSettings?.phone || '8005552447';
  const phoneDisplay = siteSettings?.phoneDisplay || '(800) 555-2447';
  const dispatchEmail = siteSettings?.dispatchEmail || 'dispatch@chipzorro.com';
  return (
    <footer className="bg-night-950 text-slate-300 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          {/* Brand Info with Official Uploaded Logo (Exactly As Is) */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Chip Zorro Windshield Chip Repair"
                referrerPolicy="no-referrer"
                className="h-12 w-auto object-contain block shrink-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
              />
              <div className="leading-tight">
                <span className="font-display font-bold text-white text-lg tracking-tight">
                  Chip <span className="text-ember-400">Zorro</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                  Windshield Chip Repair
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              We specialize exclusively in mobile rock chip and crack repair. We do NOT replace windshields—we save your original factory glass, safety seal, and camera calibration!
            </p>
            <div className="text-slate-400 space-y-1 pt-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lifetime No-Spread Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-ember-400 shrink-0" />
                <span>Mobile Dispatch: Mon-Sat 7:30am - 6:30pm</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">
              Quick Links
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book Chip Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dispatch')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Zorro Mobile Van
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    const el = document.getElementById('insurance-billing-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  $0 Insurance Claims
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('claims')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Insurance Claims Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">
              Dispatch Desk
            </div>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ember-400 shrink-0" />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-white font-semibold hover:text-ember-400 transition-colors">
                  {phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{dispatchEmail}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Metro Mobile Service Fleet · We Come To You!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Chip Zorro Windshield Repair. All rights reserved.
            {/* Owner secret entrance: double-clicking or clicking the small dot opens admin */}
            <button
              onClick={() => onNavigate('admin')}
              title="Site Owner Access"
              className="inline-block opacity-0 hover:opacity-20 cursor-default text-[9px] ml-1 select-none text-slate-600 focus:outline-none"
              tabIndex={-1}
              aria-hidden="true"
            >
              ·
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1">
            <span>Specialized In Windshield Chip Repair Only</span>
            <span aria-hidden="true" className="hidden xs:inline">·</span>
            <span>Insurance Claims Desk</span>
            <span aria-hidden="true" className="hidden xs:inline">·</span>
            <span>Zero Replacement Upsells</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
