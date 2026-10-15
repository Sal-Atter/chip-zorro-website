import React from 'react';
import {
  Check,
  ArrowRight,
  Zap,
} from 'lucide-react';
import vanImg from '../assets/images/mobile_service_van.webp';
import { SectionHeader, Eyebrow } from './design';

interface ServicesSectionProps {
  onSelectDamage: (damageType: string) => void;
}

const SERVICES = [
  {
    id: 'rock_chip_bullseye',
    num: '01',
    name: 'Bullseye Rock Chip',
    price: '$79',
    desc: 'Smooth circular impact from highway gravel. Deep vacuum extraction, then crystal-clear optical resin injection.',
    meta: '~20 mins · 98%+ optical restoration',
    cta: 'Book bullseye fix',
  },
  {
    id: 'rock_chip_starburst',
    num: '02',
    name: 'Starburst Fracture',
    price: '$89',
    desc: 'Impact point with micro-cracks radiating outward. Hydraulic pressure forces resin into every leg, halting spread permanently.',
    meta: '~25 mins · Halts running cracks',
    cta: 'Book starburst fix',
  },
  {
    id: 'crack_small',
    num: '03',
    name: 'Short Crack Stabilization',
    price: '$99',
    desc: 'Single cracks under 6 inches. Stress relieved at the tip with a micro-drill pit, then infused with high-tensile resin.',
    meta: '~30 mins · Prevents total windshield loss',
    cta: 'Book crack fix',
  },
  {
    id: 'multiple_chips',
    num: '04',
    name: 'Multi-Chip Combo',
    price: '+$30',
    desc: 'Gravel barrage? Fix the primary chip — each additional chip on the same windshield is only $30 more.',
    meta: '~35 mins · Family & fleet friendly',
    cta: 'Book multi-chip fix',
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectDamage }) => {
  return (
    <section id="services-section" className="py-20 sm:py-24 bg-paper-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            dark={false}
            eyebrow={
              <Eyebrow dark={false} icon={<Zap className="w-3.5 h-3.5" />}>
                Transparent rates · Mobile service
              </Eyebrow>
            }
            title={<>Rock chip & crack repair, <span className="text-ember-600">specialized.</span></>}
            sub="We do one thing — save windshields. Every service is mobile, takes under 35 minutes, and qualifies for $0 insurance deductible."
          />
          <div className="shrink-0 hidden md:block">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600" />
              Lifetime No-Spread Guarantee
            </span>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="group p-6 bg-white border border-slate-200/80 rounded-3xl flex flex-col justify-between gap-6 transition-all duration-300 hover:border-ember-500/50 hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,0.35)] hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-ember-600">{s.num}</span>
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                    {s.price} <span className="text-[11px] font-semibold text-slate-400">/ $0 ins.</span>
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-950 tracking-tight">
                  {s.name}
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{s.meta}</div>
              </div>
              <button
                onClick={() => onSelectDamage(s.id)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-ember-700 bg-ember-500/10 hover:bg-ember-600 hover:text-white rounded-2xl transition-all cursor-pointer"
              >
                <span>{s.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Mobile van spotlight */}
        <div className="relative overflow-hidden p-8 sm:p-10 bg-night-950 text-white rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card-dark">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-ember-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="space-y-4 max-w-xl relative">
            <Eyebrow icon={<Zap className="w-3.5 h-3.5" />}>
              The mobile advantage
            </Eyebrow>
            <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
              We come to your driveway. You keep your day.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No time off work, no traffic, no shop lobby. Our vans arrive with professional vacuum injector rigs and UV curing systems — zero travel fee.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-300 pt-1">
              {['Free mobile dispatch', '25-minute repair', 'Lifetime warranty'].map((t) => (
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
                Mobile Van #4 · On active duty
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
