import React from 'react';
import { ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { PricingConfig } from '../types';
import vanImg from '../assets/images/mobile_service_van.webp';

interface ServicesSectionProps {
  onSelectDamage: (damageType: string) => void;
  pricing?: PricingConfig;
}

const SERVICES = [
  {
    id: 'rock_chip_bullseye',
    name: 'Bullseye Rock Chip',
    priceKey: 'baseBullseye' as const,
    desc: 'Smooth circular impact from highway gravel. Deep vacuum extraction, then crystal-clear optical resin injection.',
    meta: '~20 mins \u00B7 98%+ optical restoration',
    cta: 'Book bullseye fix',
  },
  {
    id: 'rock_chip_starburst',
    name: 'Starburst Fracture',
    priceKey: 'baseStarburst' as const,
    desc: 'Impact point with micro-cracks radiating outward. Hydraulic pressure forces resin into every leg, halting spread permanently.',
    meta: '~25 mins \u00B7 Halts running cracks',
    cta: 'Book starburst fix',
  },
  {
    id: 'crack_small',
    name: 'Short Crack Stabilization',
    priceKey: 'baseSmallCrack' as const,
    desc: 'Single cracks under 6 inches. Stress relieved at the tip with a micro-drill pit, then infused with high-tensile resin.',
    meta: '~30 mins \u00B7 Prevents total windshield loss',
    cta: 'Book crack fix',
  },
  {
    id: 'multiple_chips',
    name: 'Multi-Chip Combo',
    priceKey: null,
    desc: 'Gravel barrage? Fix the primary chip \u2014 each additional chip on the same windshield is only $30 more.',
    meta: '~35 mins \u00B7 Family & fleet friendly',
    cta: 'Book multi-chip fix',
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectDamage,
  pricing,
}) => {
  const priceLabel = (priceKey: 'baseBullseye' | 'baseStarburst' | 'baseSmallCrack' | null) =>
    priceKey ? `$${pricing?.[priceKey] ?? 99}` : `+$${pricing?.additionalChipRate ?? 30}`;

  const trustPoints = [
    'Free mobile dispatch',
    '25-minute repair',
    'Done within 24 hours',
    'Lifetime warranty',
  ];

  return (
    <section
      id="services-section"
      className="py-20 sm:py-24 bg-paper-50 border-b border-slate-200/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            dark={false}
            title={
              <>
                Rock chip &amp; crack repair,{' '}
                <span className="text-ember-600">specialized.</span>
              </>
            }
            sub="We do one thing \u2014 save windshields. Every service is mobile, takes under 35 minutes, and qualifies for $0 insurance deductible."
          />
          <div className="shrink-0 hidden md:block">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Lifetime No-Spread Guarantee
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="group p-6 bg-white border border-slate-200/80 rounded-3xl flex flex-col justify-between gap-6 transition-[border-color,box-shadow,transform] duration-300 hover:border-ember-500/50 hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,0.35)] hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                    {priceLabel(s.priceKey)}{' '}
                    <span className="text-[11px] font-semibold text-slate-400">
                      / $0 ins.
                    </span>
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-950 tracking-tight">
                  {s.name}
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">{s.desc}</p>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  {s.meta}
                </div>
              </div>
              <button
                onClick={() => onSelectDamage(s.id)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-ember-700 bg-ember-500/10 hover:bg-ember-600 hover:text-white rounded-2xl transition-[background-color,color] duration-200 cursor-pointer"
              >
                <span>{s.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden p-8 sm:p-10 bg-night-950 text-white rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card-dark">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-ember-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="space-y-4 max-w-xl relative">
            <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
              We come to your driveway. You keep your day.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No time off work, no traffic, no shop lobby. Our vans arrive with
              professional vacuum injector rigs and UV curing systems \u2014 zero travel fee.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-300 pt-1">
              {trustPoints.map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full md:w-96 rounded-2xl overflow-hidden border border-white/10 shadow-card-dark shrink-0 aspect-[4/3] relative">
            <img
              src={vanImg}
              alt="Chip Zorro mobile repair van"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night-950/85 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-white tracking-wide">
                Mobile Van #4 \u00B7 On active duty
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
