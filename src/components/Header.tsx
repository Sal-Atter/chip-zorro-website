import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Zap,
  Phone,
  Wrench,
  ListChecks,
  MapPin,
  Star,
  ChevronRight,
} from 'lucide-react';
import logoImg from '../assets/images/chip_zorro_logo.png';
import { SiteSettings } from '../types';

interface HeaderProps {
  activeTab: 'home' | 'booking' | 'dispatch' | 'reviews' | 'claims' | 'admin';
  setActiveTab: (tab: 'home' | 'booking' | 'dispatch' | 'reviews' | 'claims' | 'admin') => void;
  onOpenBooking: () => void;
  bookingCount: number;
  siteSettings?: SiteSettings;
}

const SECTION_IDS = {
  services: 'services-section',
  howItWorks: 'how-it-works-section',
} as const;

// Keep the URL hash in sync with the visible tab so refresh / back-button
// land on the right view. Home is the default (no hash).
const syncHashForTab = (tab: 'home' | 'dispatch' | 'reviews') => {
  if (tab === 'home') {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  } else if (window.location.hash !== `#${tab}`) {
    window.location.hash = tab;
  }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  siteSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeSection, setHomeSection] = useState<string | null>(null);
  const pendingScrollRef = useRef<string | null>(null);
  // Suppresses scroll-spy updates while a programmatic nav scroll is in flight.
  const spyLockRef = useRef(false);

  const phoneDisplay = siteSettings?.phoneDisplay || '(800) 555-2447';
  const phoneRaw = siteSettings?.phone || '8005552447';
  const etaText = siteSettings?.dispatchEtaMinutes || '35–45 Min';
  const showAnnouncement = siteSettings ? siteSettings.announcementActive : true;

  const lockSpyBriefly = () => {
    spyLockRef.current = true;
    setTimeout(() => {
      spyLockRef.current = false;
    }, 1200);
  };

  const goHome = (sectionId?: string) => {
    setMobileMenuOpen(false);
    syncHashForTab('home');
    const navigate = () => {
      if (!sectionId) {
        pendingScrollRef.current = null;
        setHomeSection(null);
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      lockSpyBriefly();
      if (activeTab === 'home') {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHomeSection(sectionId);
      } else {
        // Home sections aren't in the DOM until the tab switch renders —
        // stash the target and scroll after the switch (see effect below).
        pendingScrollRef.current = sectionId;
        setActiveTab('home');
      }
    };
    // The mobile menu is a fixed full-screen overlay: closing it never
    // shifts layout, so navigation can start immediately.
    navigate();
  };

  const goTab = (tab: 'dispatch' | 'reviews') => {
    setMobileMenuOpen(false);
    const navigate = () => {
      setHomeSection(null);
      syncHashForTab(tab);
      setActiveTab(tab);
      window.scrollTo({ top: 0 });
    };
    navigate();
  };

  // Lock body scroll and allow Escape to close while the full-screen menu is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  // Complete a deferred section scroll after switching back to the home tab.
  useEffect(() => {
    if (activeTab === 'home' && pendingScrollRef.current) {
      const id = pendingScrollRef.current;
      pendingScrollRef.current = null;
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHomeSection(id);
      }, 80);
      return () => clearTimeout(t);
    }
    if (activeTab !== 'home') setHomeSection(null);
  }, [activeTab]);

  // Scroll-spy: highlight the home section currently in view.
  useEffect(() => {
    if (activeTab !== 'home') return;
    const ids = Object.values(SECTION_IDS);
    const observer = new IntersectionObserver(
      (entries) => {
        if (spyLockRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setHomeSection(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeTab]);

  const isServicesActive = activeTab === 'home' && homeSection === SECTION_IDS.services;
  const isHowActive = activeTab === 'home' && homeSection === SECTION_IDS.howItWorks;
  const isDispatchActive = activeTab === 'dispatch';
  const isReviewsActive = activeTab === 'reviews';

  const bookButton =
    'inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.1em] text-white cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98]';

  const bookButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #ff9435 0%, #f97316 55%, #e35f0a 100%)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px -8px rgba(249,115,22,0.6)',
    textShadow: '0 1px 2px rgba(120,40,0,0.4)',
  };

  const desktopItems = [
    { label: 'Services', icon: null, active: isServicesActive, onClick: () => goHome(SECTION_IDS.services) },
    { label: 'How It Works', icon: null, active: isHowActive, onClick: () => goHome(SECTION_IDS.howItWorks) },
    { label: 'Track Tech', icon: null, active: isDispatchActive, onClick: () => goTab('dispatch') },
    { label: 'Reviews', icon: null, active: isReviewsActive, onClick: () => goTab('reviews') },
  ];

  const mobileItems = [
    { label: 'Services', desc: 'Repairs, pricing & coverage', icon: <Wrench className="w-4 h-4" />, active: isServicesActive, onClick: () => goHome(SECTION_IDS.services) },
    { label: 'How It Works', desc: 'The 25-minute repair process', icon: <ListChecks className="w-4 h-4" />, active: isHowActive, onClick: () => goHome(SECTION_IDS.howItWorks) },
    { label: 'Track Tech', desc: 'Live dispatch status', icon: <MapPin className="w-4 h-4" />, active: isDispatchActive, onClick: () => goTab('dispatch') },
    { label: 'Reviews', desc: 'Verified customer stories', icon: <Star className="w-4 h-4" />, active: isReviewsActive, onClick: () => goTab('reviews') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-night-950/90 backdrop-blur-xl border-b border-white/10 text-white">
      {/* Announcement bar */}
      {showAnnouncement && (
        <div
          className="w-full text-white text-[11px] font-bold py-1.5 px-4 tracking-wide"
          style={{ background: 'linear-gradient(90deg, #b94a08 0%, #f97316 50%, #b94a08 100%)' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-[10px] sm:text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
              <span className="font-extrabold">Mobile service active</span>
              <span className="hidden md:inline text-white/70">· Dispatch {etaText} · $0 insurance deductible</span>
            </span>
            <a
              href={`tel:${phoneRaw.replace(/\D/g, '')}`}
              className="flex items-center gap-1.5 font-extrabold hover:text-amber-100 transition-colors"
            >
              <Phone className="w-3 h-3 shrink-0" />
              <span>{phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5">
        {/* Logo */}
        <button
          onClick={() => goHome()}
          className="flex items-center gap-3 text-left shrink-0 hover:opacity-95 transition-opacity cursor-pointer bg-transparent border-0 p-0"
          aria-label="Chip Zorro Home"
        >
          <img
            src={logoImg}
            alt="Chip Zorro Windshield Chip Repair"
            referrerPolicy="no-referrer"
            className="h-12 w-auto object-contain block shrink-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display font-bold tracking-tight text-xl text-white">
              Chip <span className="text-ember-400">Zorro</span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.22em] text-slate-500 uppercase">
              Mobile Windshield Repair
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em]" aria-label="Primary">
          {desktopItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              aria-current={item.active ? 'page' : undefined}
              className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-all duration-150 ${
                item.active
                  ? 'text-white bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button onClick={onOpenBooking} className={bookButton} style={bookButtonStyle}>
            <Zap className="w-3.5 h-3.5 text-amber-200 shrink-0" />
            <span>Book Repair</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-night-950 flex flex-col animate-menu-in"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between pl-4 pr-3 py-2.5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImg}
                alt=""
                aria-hidden="true"
                className="h-9 w-auto object-contain block drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
              />
              <span className="font-display font-bold tracking-tight text-lg text-white">
                Chip <span className="text-ember-400">Zorro</span>
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile">
            <div className="grid gap-1.5 max-w-md mx-auto">
              {mobileItems.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  aria-current={item.active ? 'page' : undefined}
                  style={{ animationDelay: `${i * 45}ms` }}
                  className={`animate-menu-item-in w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left cursor-pointer transition-colors ${
                    item.active ? 'bg-ember-500/15 border border-ember-500/25' : 'border border-transparent hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      item.active ? 'bg-ember-500/25 text-ember-300' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-base font-bold ${item.active ? 'text-white' : 'text-slate-200'}`}>
                      {item.label}
                    </span>
                    <span className="block text-xs text-slate-500 truncate">{item.desc}</span>
                  </span>
                  {item.active ? (
                    <span className="w-2 h-2 rounded-full bg-ember-400 shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-600 shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Bottom actions */}
          <div className="px-4 pb-8 pt-4 border-t border-white/10 shrink-0">
            <div className="max-w-md mx-auto grid gap-2.5">
              <a
                href={`tel:${phoneRaw.replace(/\D/g, '')}`}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-white/10 text-sm font-bold text-white hover:bg-white/5 transition-colors"
              >
                <Phone className="w-4 h-4 text-ember-400" />
                <span>Call {phoneDisplay}</span>
              </a>
              <button
                onClick={() => { onOpenBooking(); setMobileMenuOpen(false); }}
                className="w-full py-4 text-center text-xs font-extrabold uppercase tracking-[0.12em] text-white rounded-2xl cursor-pointer transition-all hover:brightness-110 active:scale-[0.99]"
                style={bookButtonStyle}
              >
                Book Chip Repair
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
