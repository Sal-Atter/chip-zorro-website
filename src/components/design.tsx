import React from 'react';
import { ArrowRight } from 'lucide-react';

/* Shared premium primitives for the Chip Zorro marketing page.
   Use these for every section header, primary CTA and badge so the
   whole page speaks one visual language. */

export const Eyebrow: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: 'ember' | 'emerald' | 'sky' | 'amber';
  dark?: boolean;
}> = ({ icon, children, tone = 'ember', dark = true }) => {
  const tones: Record<string, string> = {
    ember: 'bg-ember-500/12 border-ember-500/30 text-ember-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    sky: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-[0.14em] ${tones[tone]} ${dark ? '' : 'bg-ember-500/10'}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};

export const SectionHeader: React.FC<{
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
  align?: 'left' | 'center';
  className?: string;
}> = ({ eyebrow, title, sub, dark = true, align = 'left', className = '' }) => (
  <div className={`${align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start'} flex flex-col gap-4 max-w-3xl ${className}`}>
    <div>{eyebrow}</div>
    <h2
      className={`font-display font-bold tracking-tight text-balance ${
        dark ? 'text-white' : 'text-slate-950'
      } text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]`}
    >
      {title}
    </h2>
    {sub && (
      <p className={`${dark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
        {sub}
      </p>
    )}
  </div>
);

export const EmberButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  arrow?: boolean;
}> = ({ children, onClick, type = 'button', className = '', arrow = false }) => (
  <button
    type={type}
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-extrabold tracking-wide text-white cursor-pointer transition-all duration-200 hover:brightness-110 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${className}`}
    style={{
      background: 'linear-gradient(180deg, #ff9435 0%, #f97316 55%, #e35f0a 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 6px rgba(120,40,0,0.35), 0 12px 32px -10px rgba(249,115,22,0.6)',
      textShadow: '0 1px 2px rgba(120,40,0,0.4)',
    }}
  >
    <span>{children}</span>
    {arrow && <ArrowRight className="w-4 h-4" />}
  </button>
);

export const QuietButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  dark?: boolean;
}> = ({ children, onClick, className = '', dark = true }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all duration-200 border ${
      dark
        ? 'border-white/15 text-slate-200 hover:border-white/30 hover:text-white bg-white/5'
        : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-950 bg-white'
    } ${className}`}
  >
    {children}
  </button>
);
