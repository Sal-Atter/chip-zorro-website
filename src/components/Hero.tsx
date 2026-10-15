import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Star,
  Check
} from 'lucide-react';
import { FoxZorroHeroAnimation } from './FoxZorroHeroAnimation';
import { PricingConfig } from '../types';

interface HeroProps {
  onStartBookingWithParams: (zip: string, damage: string) => void;
  onExploreServices: () => void;
  pricing?: PricingConfig;
}

export const Hero: React.FC<HeroProps> = ({
  onStartBookingWithParams,
  onExploreServices,
  pricing,
}) => {
  const [quickZip, setQuickZip] = useState('97201');
  const [quickDamage, setQuickDamage] = useState('rock_chip_bullseye');
  const [zipVerified, setZipVerified] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBookingWithParams(quickZip, quickDamage);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
      {/* Dynamic Background Atmosphere: Radial Glows & Subtle Automotive Carbon Grid */}
      <div className="absolute top-[-10%] left-1/4 w-[700px] h-[700px] bg-orange-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-22">
        {/* Top Floating Live Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-2xl sm:rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-[11px] sm:text-xs font-semibold backdrop-blur-md shadow-md"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Mobile Van Dispatched In <strong>35–45 Mins</strong></span>
            <span className="text-slate-600 hidden xs:inline">|</span>
            <span className="text-emerald-400 font-bold">$0 Deductible Approved</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full"
          >
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-white font-bold">4.98 Rating</span>
            <span className="text-amber-300/80">· 640+ Verified Repairs</span>
          </motion.div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: High-Impact Messaging & Fast Booking Engine */}
          <div className="lg:col-span-7 space-y-7">
            {/* Distinctive Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-orange-400 animate-pulse shrink-0" />
              <span>Dedicated Windshield Repair Only · Zero Replacement Upsells</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-balance">
                Don’t Replace Your Windshield When{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 drop-shadow-md">
                  Chip Zorro
                </span>{' '}
                Can Save It!
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                Keep your original robotic factory seal, avoid $1,200+ replacement quotes, and eliminate future water leaks. We bring master optical vacuum-resin technicians directly to your driveway—ready to drive in 25 minutes.
              </p>

              {/* Emergency Windshield First-Aid Alert from the guide */}
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3 text-xs max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🩹</span>
                  <div className="text-slate-200">
                    <strong className="text-amber-300">Just got a rock chip?</strong> Put clear tape over it now to seal out road dirt, and avoid blasting defroster heat or max A/C!
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('windshield-guide-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-orange-400 hover:text-orange-300 font-bold whitespace-nowrap underline cursor-pointer text-[11px] shrink-0"
                >
                  Care Guide →
                </button>
              </div>
            </motion.div>

            {/* Fast Mobile Booking & Instant Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-5 sm:p-6 bg-slate-900/90 border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-md max-w-xl space-y-4 relative overflow-hidden"
            >
              {/* Subtle accent border glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />

              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>Instant Driveway Mobile Dispatch</span>
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>$0 With Most Insurance</span>
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Service Zip Code
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-orange-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={quickZip}
                        onChange={(e) => {
                          setQuickZip(e.target.value);
                          setZipVerified(e.target.value.length === 5);
                        }}
                        placeholder="e.g. 97201"
                        maxLength={5}
                        className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-500 font-semibold"
                      />
                      {zipVerified && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Damage Type
                    </label>
                    <select
                      value={quickDamage}
                      onChange={(e) => setQuickDamage(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    >
                      <option value="rock_chip_bullseye">Bullseye Chip (Smooth circular impact)</option>
                      <option value="rock_chip_starburst">Starburst (Multiple radiating legs)</option>
                      <option value="combination_break">Combination Break (Pit + legs)</option>
                      <option value="crack_small">Short Crack (Under 6 inches)</option>
                      <option value="multiple_chips">Multiple Chips (2 or 3)</option>
                    </select>
                  </div>
                </div>

                {/* Instant Pricing & 1-Click Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-slate-400 uppercase font-medium">Estimated Cost:</div>
                    <div className="text-base font-extrabold text-white flex items-center gap-2">
                      <span className="text-emerald-400">$0 (Ins. Deductible Waived)</span>
                      <span className="text-slate-500 text-xs font-normal">or $79 Direct</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Book Chip Repair</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* 3 Core Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lifetime No-Spread Guarantee</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Ready to Drive in 25 Min</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Original Factory Seal Intact</span>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Fox Zorro Windshield Rescue Mascot */}
          <div className="lg:col-span-5 space-y-6 w-full max-w-xl mx-auto lg:max-w-none">
            <FoxZorroHeroAnimation
              onBookNow={(damage) => {
                onStartBookingWithParams(quickZip, damage || quickDamage);
              }}
            />
          </div>

        </div>

        {/* 4-Column Feature Strip */}
        <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          <div className="space-y-1">
            <div className="text-3xl font-black text-white tabular-nums tracking-tight">100%</div>
            <div className="text-xs font-bold text-orange-400">Repair Only Specialists</div>
            <p className="text-xs text-slate-400">We never replace or upsell glass</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white tabular-nums tracking-tight">Original</div>
            <div className="text-xs font-bold text-orange-400">Factory Seal Kept</div>
            <p className="text-xs text-slate-400">Zero air whistles or water leaks</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white tabular-nums tracking-tight">25 Min</div>
            <div className="text-xs font-bold text-orange-400">Rapid UV Polymer Cure</div>
            <p className="text-xs text-slate-400">Drive on the highway immediately</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white tabular-nums tracking-tight">$0 Ded.</div>
            <div className="text-xs font-bold text-orange-400">Direct Insurance Claims</div>
            <p className="text-xs text-slate-400">Instant electronic clearinghouse API</p>
          </div>
        </div>

      </div>
    </section>
  );
};
