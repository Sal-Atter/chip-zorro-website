import React from 'react';

interface SectionHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  sub,
  dark = true,
  align = 'left',
  className = '',
}) => (
  <div
    className={`${
      align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start'
    } flex flex-col gap-4 max-w-3xl ${className}`}
  >
    {eyebrow && <div>{eyebrow}</div>}
    <h2
      className={`font-display font-bold tracking-tight text-balance ${
        dark ? 'text-white' : 'text-slate-950'
      } text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]`}
    >
      {title}
    </h2>
    {sub && (
      <p
        className={`${dark ? 'text-slate-400' : 'text-slate-600'} text-sm sm:text-base leading-relaxed max-w-2xl ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      >
        {sub}
      </p>
    )}
  </div>
);
