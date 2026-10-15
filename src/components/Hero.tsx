import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Zap,
  Star,
  Check
} from 'lucide-react';
import { FoxZorroHeroAnimation } from './FoxZorroHeroAnimation';
import { EmberButton, Eyebrow } from './design';

interface HeroProps {
  onStartBookingWithParams: (zip: string, damage: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartBookingWithParams,
}) => {
  const [quickZip, setQuickZip] = useState('97201');
  const [quickDamage, setQuickDamage] = useState('rock_chip_bullseye');
  const [zipVerified, setZipVerified] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBookingWithParams(quickZip, quickDamage);
  };

  return (
    <section className="relative overflow-hidden bg-night-950 text-white border-b border-white/10">
      {/* Ambient glows */}
      <div className="absolute top-[-12%] left-1/4 w-[720px] h-[720px] bg-ember-600/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-12%] right-1/5 w-[560px] h-[560px] bg-amber-500/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      />
      {/* Ember horizon line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ember-500/60 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-[11px] sm:text-xs font-semibold backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Mobile van dispatched in <strong className="text-white">35–45 mins</strong></span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400 font-bold">$0 deductible approved</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="hidden sm:flex items-center gap-2.5 text-xs font-semibold text-slate-300 bg-white/[0.04] border border-white/10 px-4 py-2 rounded-full"
          >
            <span className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </span>
            <span className="text-white font-bold">4.98</span>
            <span className="text-slate-400">640+ verified repairs</span>
          </motion.div>
        </div>

        {/* Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left: messaging + booking */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Eyebrow icon={<Zap className="w-3.5 h-3.5" />}>
                Repair only · Zero replacement upsells
              </Eyebrow>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="font-display font-bold text-[2.6rem] sm:text-6xl lg:text-[4.2rem] leading-[1.04] tracking-tight text-balance mt-5"
            >
              Don&rsquo;t replace your windshield when{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ember-300 via-amber-300 to-ember-500">
                Chip&nbsp;Zorro
              </span>{' '}
              can save it.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mt-5"
            >
              Keep your original factory seal, skip the $1,200+ replacement quote, and drive away in 25 minutes. Our mobile technicians come to your driveway.
            </motion.p>

            {/* Booking card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28 }}
              className="mt-8 p-5 sm:p-6 bg-white/[0.04] border border-white/10 rounded-3xl shadow-card-dark backdrop-blur-md max-w-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-ember-400/70 to-transparent" />

              <div className="flex items-center justify-between text-xs mb-4">
                <span className="font-extrabold text-white uppercase tracking-[0.12em] flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-ember-400" />
                  <span>Instant mobile dispatch</span>
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>$0 with most insurance</span>
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1.5">
                      Service ZIP code
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-ember-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={quickZip}
                        onChange={(e) => {
                          setQuickZip(e.target.value);
                          setZipVerified(e.target.value.length === 5);
                        }}
                        placeholder="e.g. 97201"
                        maxLength={5}
                        className="w-full pl-10 pr-10 py-3 text-sm bg-night-950/80 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-ember-500/50 placeholder-slate-600 font-semibold transition-all"
                      />
                      {zipVerified && (
                        <Check className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3.5 pointer-events-none" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1.5">
                      Damage type
                    </label>
                    <select
                      value={quickDamage}
                      onChange={(e) => setQuickDamage(e.target.value)}
                      className="w-full px-3.5 py-3 text-sm bg-night-950/80 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-ember-500/50 font-medium transition-all"
                    >
                      <option value="rock_chip_bullseye">Bullseye chip</option>
                      <option value="rock_chip_starburst">Starburst chip</option>
                      <option value="combination_break">Combination break</option>
                      <option value="crack_small">Short crack (under 6&Prime;)</option>
                      <option value="multiple_chips">Multiple chips</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-[0.1em] font-semibold">Estimated cost</div>
                    <div className="text-base font-extrabold text-white mt-0.5">
                      <span className="text-emerald-400">$0</span>
                      <span className="text-slate-500 text-xs font-medium"> with insurance · or $79 direct</span>
                    </div>
                  </div>

                  <EmberButton type="submit" arrow className="whitespace-nowrap">
                    Book chip repair
                  </EmberButton>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right: 3D fox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5 w-full max-w-xl mx-auto lg:max-w-none"
          >
            <FoxZorroHeroAnimation
              onBookNow={(damage) => {
                onStartBookingWithParams(quickZip, damage || quickDamage);
              }}
            />
          </motion.div>
        </div>

        {/* Stat strip */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { big: '100%', label: 'Repair-only specialists', sub: 'Never replace or upsell glass' },
            { big: '25 min', label: 'Driveway repair', sub: 'UV-cured, drive immediately' },
            { big: 'OEM', label: 'Factory seal kept', sub: 'No leaks, no wind whistle' },
            { big: '$0', label: 'Insurance deductible', sub: 'Direct electronic claims' },
          ].map((s) => (
            <div key={s.label} className="space-y-1.5">
              <div className="font-display font-bold text-3xl text-white tracking-tight">{s.big}</div>
              <div className="text-xs font-bold text-ember-400 uppercase tracking-[0.1em]">{s.label}</div>
              <p className="text-xs text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
