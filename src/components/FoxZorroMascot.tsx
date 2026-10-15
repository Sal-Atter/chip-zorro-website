import React from 'react';
import { motion } from 'motion/react';
import logoImg from '../assets/images/chip_zorro_logo.jpg';

export type AnimationPhase = 'idle' | 'rock_hit' | 'zorro_arrive' | 'z_slash' | 'uv_cure' | 'restored';

interface FoxZorroMascotProps {
  phase: AnimationPhase;
  onTrigger?: () => void;
}

export const FoxZorroMascot: React.FC<FoxZorroMascotProps> = ({
  phase,
  onTrigger,
}) => {
  const isSlashing = phase === 'z_slash';
  const isArriving = phase === 'zorro_arrive';
  const isCuring = phase === 'uv_cure';
  const isRestored = phase === 'restored';

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-auto">
      {/* Comic Speech Bubble */}
      <motion.div
        initial={{ scale: 0, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className="mb-2 bg-slate-950/95 border-2 border-orange-500 text-white px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black tracking-tight shadow-xl shadow-slate-950 flex items-center gap-1.5 relative max-w-[240px] sm:max-w-none text-left backdrop-blur-md z-50"
      >
        <span className="text-orange-400 font-extrabold shrink-0">Chip Zorro:</span>
        <span className="truncate whitespace-nowrap text-slate-100">
          {phase === 'rock_hit' && '⚠️ Rock chip spotted! En garde!'}
          {phase === 'zorro_arrive' && '🛡️ Mobile Unit Arriving! Protecting the glass!'}
          {phase === 'z_slash' && '⚡ Vacuum suction & optical resin injection!'}
          {phase === 'uv_cure' && '☀️ 365nm UV laser lock — glass cured!'}
          {phase === 'restored' && '✨ 100% saved! Drive right away in 25 min!'}
          {phase === 'idle' && 'Click to test resin repair!'}
        </span>
        <div className="absolute -bottom-1.5 left-10 w-2.5 h-2.5 bg-slate-950 border-r-2 border-b-2 border-orange-500 rotate-45" />
      </motion.div>

      {/* Official Authentic Logo Card (Preserved Exactly As Is) */}
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          if (onTrigger) onTrigger();
        }}
        className="relative cursor-pointer group select-none"
        title="Official Chip Zorro Logo - Click to test repair simulation"
        animate={
          isSlashing
            ? {
                scale: [1, 1.06, 1.03, 1],
                rotate: [0, 2, -2, 0],
              }
            : isArriving
            ? {
                scale: [0.85, 1.04, 1],
                y: [15, -4, 0],
              }
            : isRestored
            ? {
                y: [0, -4, 0],
                transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
              }
            : {
                y: [0, -3, 0],
                transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
              }
        }
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Glow Halo */}
        <div
          className={`absolute -inset-3 rounded-2xl blur-lg pointer-events-none transition-opacity duration-300 ${
            isSlashing
              ? 'bg-amber-400/40 opacity-100'
              : isCuring
              ? 'bg-purple-500/35 opacity-100'
              : isRestored
              ? 'bg-emerald-400/30 opacity-100'
              : 'bg-orange-500/20 opacity-70 group-hover:opacity-100'
          }`}
        />

        {/* Clean Logo Display Container preserving the exact logo file as is */}
        <div className="relative bg-white rounded-2xl p-2.5 shadow-2xl border-2 border-slate-700/80 group-hover:border-orange-500 transition-colors overflow-hidden">
          <img
            src={logoImg}
            alt="Chip Zorro Official Logo"
            className="w-40 xs:w-48 sm:w-56 md:w-60 h-auto object-contain block"
          />
        </div>
      </motion.div>
    </div>
  );
};
