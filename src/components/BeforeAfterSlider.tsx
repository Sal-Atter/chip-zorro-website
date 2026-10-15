import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, ShieldCheck, Zap } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl text-white space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-orange-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Glass Clarity Simulator</span>
        </div>
        <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">Drag slider to compare</span>
      </div>

      {/* Slider Viewport */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden select-none border border-slate-700 bg-slate-950">
        {/* Layer 1: After Repair (Clear, restored glass) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-sky-950/40 to-slate-900 flex items-center justify-center p-4 sm:p-6">
          {/* Subtle reflection & clear glass */}
          <div className="w-full h-full rounded-lg border border-sky-400/20 bg-sky-500/5 relative overflow-hidden flex items-center justify-center">
            {/* Very faint repaired micro-blemish */}
            <div className="w-3 h-3 rounded-full bg-sky-200/20 blur-[1px] relative">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 absolute inset-0 m-auto" />
            </div>
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-emerald-500/90 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>AFTER CHIP ZORRO: 99% CLARITY</span>
            </div>
          </div>
        </div>

        {/* Layer 2: Before Repair (Damaged rock chip fracture) - Clipped to slider position */}
        <div
          className="absolute inset-0 bg-slate-900 flex items-center justify-center p-4 sm:p-6"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className="w-full h-full rounded-lg border border-slate-700 bg-slate-900/60 relative flex items-center justify-center">
            {/* Jagged starburst graphic */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-slate-200/90 shadow-md border-2 border-slate-950" />
              <div className="absolute w-10 h-0.5 bg-white/90 rotate-45 shadow-xs" />
              <div className="absolute w-12 h-0.5 bg-white/90 -rotate-30 shadow-xs" />
              <div className="absolute w-8 h-0.5 bg-white/80 rotate-80 shadow-xs" />
              <div className="absolute w-7 h-0.5 bg-white/70 -rotate-70 shadow-xs" />
            </div>
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-rose-600/90 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-md shadow-sm">
              BEFORE: RAW IMPACT FRACTURE
            </div>
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute inset-y-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-7 h-7 -ml-3 rounded-full bg-orange-600 text-white shadow-lg border-2 border-white flex items-center justify-center text-[10px] font-bold">
            ↔
          </div>
        </div>

        {/* Range Input for dragging with mobile touch support */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full touch-none"
          aria-label="Drag before and after clarity comparison slider"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] sm:text-xs text-slate-400">
        <span>Original windshield preserved</span>
        <span className="text-orange-400 font-semibold">100% Factory seal intact</span>
      </div>
    </div>
  );
};
