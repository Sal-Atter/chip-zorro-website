import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BookingWizard } from './components/BookingWizard';
import { MobileDispatchTracker } from './components/MobileDispatchTracker';
import { ReviewsSection } from './components/ReviewsSection';
import { OmegaEdiHub } from './components/OmegaEdiHub';
import { EmailConfirmationModal } from './components/EmailConfirmationModal';
import { Footer } from './components/Footer';
import { InteractiveWindshieldVisualizer } from './components/InteractiveWindshieldVisualizer';
import { InstantPhotoAnalyzer } from './components/InstantPhotoAnalyzer';
import { MobileStickyActionBar } from './components/MobileStickyActionBar';
import { ObjectionFaqSection } from './components/ObjectionFaqSection';
import { WindshieldCareGuide } from './components/WindshieldCareGuide';
import { SectionHeader, Eyebrow } from './components/design';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { 
  BookingAppointment, 
  MobileTechnician, 
  CustomerReview, 
  EdiClaimRecord,
  DamageType,
  SiteSettings
} from './types';
import { 
  INITIAL_BOOKINGS, 
  INITIAL_TECHNICIANS, 
  INITIAL_REVIEWS, 
  INITIAL_EDI_CLAIMS,
  DEFAULT_SITE_SETTINGS,
} from './data/mockData';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Cpu,
  Lock,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'dispatch' | 'reviews' | 'claims' | 'admin'>('home');
  const [bookings, setBookings] = useState<BookingAppointment[]>(() => {
    try {
      const raw = localStorage.getItem('chipzorro_bookings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as BookingAppointment[];
      }
    } catch {
      /* corrupted storage — fall back to defaults */
    }
    return INITIAL_BOOKINGS;
  });
  const [technicians, setTechnicians] = useState<MobileTechnician[]>(INITIAL_TECHNICIANS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [claims, setClaims] = useState<EdiClaimRecord[]>(() => {
    try {
      const raw = localStorage.getItem('chipzorro_claims');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as EdiClaimRecord[];
      }
    } catch {
      /* corrupted storage — fall back to defaults */
    }
    return INITIAL_EDI_CLAIMS;
  });

  // Persist bookings & claims locally so they survive a refresh.
  useEffect(() => {
    try {
      localStorage.setItem('chipzorro_bookings', JSON.stringify(bookings));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('chipzorro_claims', JSON.stringify(claims));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  }, [claims]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('chipzorro_admin_auth') === 'true' ||
        sessionStorage.getItem('chipzorro_admin_auth') === 'true'
      );
    } catch {
      return false;
    }
  });

  const handleAdminLoginSuccess = (rememberMe: boolean) => {
    setIsAdminAuthenticated(true);
    try {
      if (rememberMe) {
        localStorage.setItem('chipzorro_admin_auth', 'true');
      } else {
        sessionStorage.setItem('chipzorro_admin_auth', 'true');
      }
    } catch {
      // ignore storage errors
    }
    setRecentNotification('Admin identity authenticated. Welcome to your Control Center!');
    setTimeout(() => setRecentNotification(null), 3500);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('chipzorro_admin_auth');
      sessionStorage.removeItem('chipzorro_admin_auth');
    } catch {
      // ignore storage errors
    }
    setActiveTab('home');
    if (window.location.hash.toLowerCase() === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setRecentNotification('Admin logged out successfully.');
    setTimeout(() => setRecentNotification(null), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [emailModalBooking, setEmailModalBooking] = useState<BookingAppointment | null>(null);
  const [initialBookingZip, setInitialBookingZip] = useState('97201');
  const [initialBookingDamage, setInitialBookingDamage] = useState('rock_chip_bullseye');
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  // Track active section on the home page for dynamic breadcrumb trail
  useEffect(() => {
    if (activeTab !== 'home') {
      setCurrentSection(null);
      return;
    }

    const sectionIds = [
      'services-section',
      'how-it-works-section',
      'diagnostic-section',
      'insurance-billing-section',
      'reviews-section',
      'faq-section',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      let active: string | null = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            active = id;
            break;
          }
        }
      }

      setCurrentSection(active);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // Synchronize URL hash and search params with active view tab (supports #admin, #booking, etc.)
  // Discreet keyboard shortcut for site owner (Ctrl+Shift+A or Cmd+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      const params = new URLSearchParams(window.location.search);
      const viewParam = (params.get('view') || params.get('tab') || params.get('preview'))?.toLowerCase();

      if (hash === 'admin' || viewParam === 'admin') {
        setActiveTab('admin');
      } else if (hash === 'booking' || viewParam === 'booking') {
        setActiveTab('booking');
      } else if (hash === 'dispatch' || viewParam === 'dispatch') {
        setActiveTab('dispatch');
      } else if (hash === 'reviews' || viewParam === 'reviews') {
        setActiveTab('reviews');
      } else if (hash === 'claims' || viewParam === 'claims') {
        setActiveTab('claims');
      }
    };

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    return () => window.removeEventListener('hashchange', syncFromUrl);
  }, []);

  // Sync hash when activeTab changes
  useEffect(() => {
    if (activeTab === 'admin') {
      if (window.location.hash !== '#admin') {
        window.location.hash = 'admin';
      }
    }
  }, [activeTab]);

  // Quick toggle between customer live website view and admin backend preview
  const handleTogglePreview = (target: 'customer' | 'admin') => {
    if (target === 'admin') {
      setActiveTab('admin');
      window.location.hash = 'admin';
    } else {
      setActiveTab('home');
      if (window.location.hash.toLowerCase() === '#admin') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Homepage insurance coverage estimate widget (estimate only, no live carrier check)
  const [simCarrier, setSimCarrier] = useState('State Farm');
  const [simPolicyInput, setSimPolicyInput] = useState('SF-9481920-X');
  const [isVerifyingApi, setIsVerifyingApi] = useState(false);
  const [apiVerificationResult, setApiVerificationResult] = useState<{
    verified: boolean;
    deductibleWaived: boolean;
    coverageType: string;
  } | null>(null);

  // Quick Start Booking from Hero
  const handleStartBookingFromHero = (zip: string, damage: string) => {
    setInitialBookingZip(zip);
    setInitialBookingDamage(damage);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select damage from Services section
  const handleSelectDamageFromSection = (damageType: string) => {
    setInitialBookingDamage(damageType);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Homepage coverage estimate widget (estimate only — no live carrier verification)
  const handleRunApiVerification = () => {
    setIsVerifyingApi(true);
    setApiVerificationResult(null);

    setTimeout(() => {
      setIsVerifyingApi(false);
      setApiVerificationResult({
        verified: true,
        deductibleWaived: true,
        coverageType: 'Comprehensive Glass Endorsement (No-Fault)',
      });
      setRecentNotification(`$0 deductible estimate ready for ${simCarrier} — our claims desk will confirm coverage when filing.`);
    }, 1100);
  };

  // Complete a booking
  // Email the booking to the shop owner via Netlify Forms (best-effort; never blocks the UI).
  const notifyOwnerOfBooking = (b: BookingAppointment) => {
    try {
      const params = new URLSearchParams();
      params.append('form-name', 'chip-repair-booking');
      params.append('orderNumber', b.orderNumber);
      params.append('customerName', b.customerName);
      params.append('customerEmail', b.customerEmail);
      params.append('customerPhone', b.customerPhone);
      params.append('address', `${b.address}, ${b.city} ${b.zipCode}`);
      params.append('city', b.city);
      params.append('zipCode', b.zipCode);
      params.append('damageType', b.damageType);
      params.append('chipCount', String(b.chipCount));
      params.append('vehicle', `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`);
      params.append('appointmentDate', b.appointmentDate);
      params.append('timeSlot', b.timeSlot);
      params.append('paymentMethod', b.paymentMethod);
      params.append('insuranceCarrier', b.insuranceCarrier || '');
      params.append('insurancePolicyNumber', b.insurancePolicyNumber || '');
      params.append('estimatedCost', `$${b.estimatedCost.toFixed(2)}`);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      }).catch(() => {
        /* notification failed — booking is still saved locally */
      });
    } catch {
      /* ignore */
    }
  };

  const handleBookingComplete = (newBooking: BookingAppointment) => {
    setBookings((prev) => [newBooking, ...prev]);
    notifyOwnerOfBooking(newBooking);

    // If insurance, create a claim record for the claims desk to file with the carrier
    if (newBooking.paymentMethod === 'insurance') {
      const newClaim: EdiClaimRecord = {
        id: `edi-claim-${Date.now()}`,
        workOrderNumber: newBooking.orderNumber,
        claimControlNumber: `CLM${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${newBooking.orderNumber.replace('CZ-', '')}`,
        carrierName: newBooking.insuranceCarrier || 'State Farm Insurance',
        policyNumber: newBooking.insurancePolicyNumber || 'POL-PENDING',
        insuredName: newBooking.customerName,
        vehicleVin: newBooking.vehicle.vin || '1HGCR2F84NA009182',
        ediServiceCode: newBooking.chipCount > 1 ? 'WSR-2' : 'WSR-1',
        damageDescription: `Windshield Chip Repair - Optical Resin Vacuum Injection (${newBooking.chipCount} chip${newBooking.chipCount > 1 ? 's' : ''})`,
        totalClaimAmount: newBooking.estimatedCost,
        deductiblePaid: 0, // Waived by carrier for repair!
        netBilledAmount: newBooking.estimatedCost,
        submissionDate: `${new Date().toISOString().slice(0, 10)} ${new Date().toTimeString().slice(0, 5)} UTC`,
        filingChannel: 'Chip Zorro Claims Desk',
        status: 'Queued',
      };

      setClaims((prev) => [newClaim, ...prev]);
    }

    // Open automated confirmation email modal immediately
    setEmailModalBooking(newBooking);
    setRecentNotification(`Work Order #${newBooking.orderNumber} confirmed! Your confirmation and mobile prep checklist are ready.`);
    setActiveTab('dispatch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mark a claim as filed by the claims desk (demo data — no live carrier integration)
  const handleTransmitClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            status: 'In review',
          };
        }
        return c;
      })
    );
    setRecentNotification(`Claim filed — our claims desk will confirm coverage with the carrier.`);
    setTimeout(() => setRecentNotification(null), 5000);
  };

  // Mark a booking as insurance-paid (demo helper)
  const handleSyncBookingToEdi = (booking: BookingAppointment) => {
    handleBookingComplete({
      ...booking,
      paymentMethod: 'insurance',
      insuranceCarrier: 'State Farm',
      insurancePolicyNumber: 'POL-AUTO-SYNC',
    });
  };

  // Add review
  const handleAddReview = (newReview: CustomerReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // Update appointment status & tech assignment in dispatch/admin tracker
  const handleUpdateBookingStatus = (bookingId: string, status: BookingAppointment['status'], techId?: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, ...(techId !== undefined ? { technicianId: techId } : {}) } : b))
    );
    setRecentNotification(`Work order updated: Status set to ${status.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setRecentNotification(null), 4000);
  };

  // Delete booking from Admin
  const handleDeleteBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    setRecentNotification('Work order removed from system.');
    setTimeout(() => setRecentNotification(null), 3000);
  };

  // Add technician
  const handleAddTechnician = (newTech: MobileTechnician) => {
    setTechnicians((prev) => [...prev, newTech]);
    setRecentNotification(`Technician ${newTech.name} registered.`);
    setTimeout(() => setRecentNotification(null), 3000);
  };

  // Update technician
  const handleUpdateTechnician = (updatedTech: MobileTechnician) => {
    setTechnicians((prev) => prev.map((t) => (t.id === updatedTech.id ? updatedTech : t)));
    setRecentNotification(`Fleet updated: ${updatedTech.name} status changed to ${updatedTech.activeStatus.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setRecentNotification(null), 3000);
  };

  // Update site settings
  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    setRecentNotification('Website settings, rates, and business details updated live!');
    setTimeout(() => setRecentNotification(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      {/* Header conforming strictly to Single-Action Primary CTA */}
      {activeTab !== 'admin' && (
        <Header
          activeTab={activeTab === 'claims' ? 'home' : activeTab}
          setActiveTab={(t) => {
            setActiveTab(t);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBooking={() => {
            setActiveTab('booking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          bookingCount={bookings.length}
          siteSettings={siteSettings}
        />
      )}

      {/* Global Notification Toast */}
      {recentNotification && (
        <div className="bg-orange-600 text-white px-4 sm:px-6 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md sticky top-[68px] z-40">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-200 shrink-0" />
              <span>{recentNotification}</span>
            </div>
            <button
              onClick={() => setRecentNotification(null)}
              className="text-orange-200 hover:text-white cursor-pointer ml-4 font-bold text-sm"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area with mobile thumb-bar offset */}
      <main className="flex-1 pb-20 md:pb-0">
        {/* Breadcrumb Navigation Trail (not on home or admin) */}
        {activeTab !== 'admin' && activeTab !== 'home' && (
          <BreadcrumbNav
            activeTab={activeTab}
            currentSection={currentSection}
            onNavigateHome={() => {
              setActiveTab('home');
              setCurrentSection(null);
              if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateSection={(sectionId) => {
              const el = document.getElementById(sectionId);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'home' && (
          <div>
            {/* Attractive Hero Section with Live Resin Simulation */}
            <Hero
              onStartBookingWithParams={handleStartBookingFromHero}
            />

            {/* Why Repair Only & 4 Core Services */}
            <ServicesSection onSelectDamage={handleSelectDamageFromSection} />

            {/* Official Windshield Care, Anatomy & Repairability Guide */}
            <WindshieldCareGuide
              onBookNow={(damageType) => {
                if (damageType) {
                  setInitialBookingDamage(damageType);
                }
                setActiveTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Interactive Visualizer & Photo Pre-Screen Diagnostic */}
            <section id="diagnostic-section" className="py-20 sm:py-24 bg-paper-50 border-b border-slate-200/70">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
                <SectionHeader
                  dark={false}
                  eyebrow={
                    <Eyebrow dark={false} icon={<Sparkles className="w-3.5 h-3.5" />}>
                      Interactive diagnostic tools
                    </Eyebrow>
                  }
                  title={<>Pinpoint your damage, <span className="text-ember-600">or snap a photo.</span></>}
                  sub="Check whether your stone chip qualifies for an instant $0 insurance repair — tap our interactive windshield or upload a photo from your phone."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <InteractiveWindshieldVisualizer
                    selectedDamage={initialBookingDamage as DamageType}
                    onSelectDamage={(dmg, zone) => {
                      setInitialBookingDamage(dmg);
                      setRecentNotification(`Windshield coordinate marked in ${zone}. Ready to book!`);
                    }}
                  />
                  <InstantPhotoAnalyzer
                    onValidated={(msg) => {
                      setRecentNotification(msg);
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Direct Electronic Insurance API Section with Live Interactive Verification */}
            <section id="insurance-billing-section" className="py-20 sm:py-24 bg-night-950 text-white border-b border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-emerald-600/8 rounded-full blur-[140px] pointer-events-none" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 relative">

                <SectionHeader
                  eyebrow={
                    <Eyebrow tone="emerald" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                      Direct insurance claims · $0 deductible
                    </Eyebrow>
                  }
                  title={<>Repairs are <span className="text-emerald-400">free</span> with comprehensive insurance.</>}
                  sub="Carriers waive your deductible for chip repair — it saves them the $1,200 replacement. Pick your carrier below to see how $0 billing works; our team handles the actual filing."
                />

                {/* Major Insurance Carrier Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
                  {[
                    'State Farm',
                    'Geico',
                    'Progressive',
                    'Allstate',
                    'USAA',
                    'Travelers',
                    'Farmers',
                    'Liberty Mutual',
                  ].map((carrier) => (
                    <div
                      key={carrier}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 transition-colors flex flex-col items-center justify-center space-y-1"
                    >
                      <Shield className="w-5 h-5 text-orange-400" />
                      <span className="text-xs font-bold text-white">{carrier}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">$0 Deductible</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Instant Insurance Coverage Verification Engine */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                        <Cpu className="w-4 h-4 text-orange-400" />
                        <span>Instant coverage estimate</span>
                      </div>
                      <h4 className="text-lg font-extrabold text-white">
                        Estimate Your $0 Coverage
                      </h4>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Our claims desk confirms coverage when we file
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Select Auto Insurance Carrier
                      </label>
                      <select
                        value={simCarrier}
                        onChange={(e) => {
                          setSimCarrier(e.target.value);
                          setApiVerificationResult(null);
                        }}
                        className="w-full px-3 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="State Farm">State Farm Insurance</option>
                        <option value="Geico">Geico Auto Glass</option>
                        <option value="Progressive">Progressive Direct</option>
                        <option value="Allstate">Allstate Motor Club</option>
                        <option value="USAA">USAA Military Members</option>
                        <option value="Travelers">Travelers Insurance</option>
                        <option value="Farmers">Farmers Insurance Group</option>
                        <option value="Liberty Mutual">Liberty Mutual Insurance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Policy Number or Vehicle VIN
                      </label>
                      <input
                        type="text"
                        value={simPolicyInput}
                        onChange={(e) => setSimPolicyInput(e.target.value)}
                        placeholder="e.g. POL-841920-X"
                        className="w-full px-3 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <button
                        onClick={handleRunApiVerification}
                        disabled={isVerifyingApi}
                        className="w-full py-2.5 px-4 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isVerifyingApi ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Checking...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>Check My Coverage</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* API Verification Result Card */}
                  {apiVerificationResult && (
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 animate-in fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span className="font-extrabold text-white text-sm">
                            Likely covered: $0 deductible estimate
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Estimate only — our claims desk confirms your coverage with the carrier when we file.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px]">CARRIER:</span>
                          <strong>{simCarrier}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">COVERAGE:</span>
                          <strong className="text-emerald-300">{apiVerificationResult.coverageType}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">YOUR OUT-OF-POCKET:</span>
                          <strong className="text-emerald-400 text-sm">$0.00 (Zero Cost)</strong>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setActiveTab('booking');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-5 py-2 text-xs font-black uppercase tracking-wider text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Apply To Booking & Dispatch Tech</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-800">
                    <div className="flex flex-wrap items-center gap-4">
                      <span>✓ 100% $0 Deductible Waived</span>
                      <span>✓ Zero Insurance Rate Increases</span>
                      <span>✓ Automated Paperless Filing</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('booking');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
                    >
                      Or proceed directly to Book Chip Repair →
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* Customer Reviews Section */}
            <ReviewsSection reviews={reviews} onAddReview={handleAddReview} />

            {/* Objection Buster FAQ Section */}
            <ObjectionFaqSection />
          </div>
        )}

        {/* Online Booking Tab */}
        {activeTab === 'booking' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <BookingWizard
              initialZip={initialBookingZip}
              initialDamage={initialBookingDamage}
              pricingConfig={siteSettings.pricing}
              onBookingComplete={handleBookingComplete}
              onCancel={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Mobile Technician Dispatch Tracker Tab */}
        {activeTab === 'dispatch' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <MobileDispatchTracker
              technicians={technicians}
              bookings={bookings}
              onSelectBooking={(b) => setEmailModalBooking(b)}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onOpenEmailModal={(b) => setEmailModalBooking(b)}
            />
          </div>
        )}

        {/* Customer Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="py-6">
            <ReviewsSection reviews={reviews} onAddReview={handleAddReview} />
          </div>
        )}

        {/* Insurance Claims Desk Tab (for Shop Management) */}
        {activeTab === 'claims' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <OmegaEdiHub
              claims={claims}
              onTransmitClaim={handleTransmitClaim}
              bookings={bookings}
              onSyncBookingToEdi={handleSyncBookingToEdi}
            />
          </div>
        )}

        {/* Admin Control Center Tab (Backend Control for Site Owner) */}
        {activeTab === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              bookings={bookings}
              technicians={technicians}
              reviews={reviews}
              claims={claims}
              siteSettings={siteSettings}
              onUpdateSiteSettings={handleUpdateSiteSettings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
              onUpdateTechnician={handleUpdateTechnician}
              onAddTechnician={handleAddTechnician}
              onNavigateToSite={() => {
                setActiveTab('home');
                if (window.location.hash.toLowerCase() === '#admin') {
                  history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={handleAdminLogout}
            />
          ) : (
            <AdminLogin
              currentPassword={siteSettings.adminPassword || 'admin123'}
              onLoginSuccess={handleAdminLoginSuccess}
              onBackToSite={() => {
                setActiveTab('home');
                if (window.location.hash.toLowerCase() === '#admin') {
                  history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )
        )}
      </main>

      {/* Automated Email Confirmation Modal */}
      {emailModalBooking && (
        <EmailConfirmationModal
          booking={emailModalBooking}
          technician={technicians.find((t) => t.id === emailModalBooking.technicianId)}
          onClose={() => setEmailModalBooking(null)}
        />
      )}

      {/* Footer */}
      {activeTab !== 'admin' && (
        <Footer
          siteSettings={siteSettings}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Floating Thumb-Zone Action Bar for Mobile Viewports */}
      {activeTab !== 'admin' && (
        <MobileStickyActionBar
          onBookNow={() => {
            setActiveTab('booking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          phone={siteSettings.phone}
        />
      )}


    </div>
  );
}
