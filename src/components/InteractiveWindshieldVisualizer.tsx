import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Wind, 
  Sun, 
  RotateCcw, 
  ZoomIn, 
  Droplet, 
  Zap, 
  Eye,
  Check
} from 'lucide-react';
import { DamageType } from '../types';

interface InteractiveWindshieldVisualizerProps {
  onSelectDamage: (type: DamageType, zoneName: string) => void;
  selectedDamage: DamageType;
}

export const InteractiveWindshieldVisualizer: React.FC<InteractiveWindshieldVisualizerProps> = ({
  onSelectDamage,
  selectedDamage,
}) => {
  // Coordinates on windshield (0-100% x, y)
  const [chipPoint, setChipPoint] = useState<{ x: number; y: number }>({ x: 34, y: 48 });
  const [activeZone, setActiveZone] = useState<string>('Driver Line of Sight');
  const [currentDamage, setCurrentDamage] = useState<DamageType>(selectedDamage || 'rock_chip_bullseye');

  // Resin Injection Simulation State
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [injectionProgress, setInjectionProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const progressTimerRef = useRef<number | null>(null);

  // Sync prop changes
  useEffect(() => {
    if (selectedDamage && selectedDamage !== currentDamage) {
      setCurrentDamage(selectedDamage);
      triggerResinInjection(selectedDamage, activeZone);
    }
  }, [selectedDamage]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  // Trigger the full 4-phase resin injection animation
  const triggerResinInjection = (damageType: DamageType, zone: string) => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setIsInjecting(true);
    setIsCompleted(false);
    setInjectionProgress(0);

    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds full realistic cycle

    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setInjectionProgress(progress);

      if (progress >= 100) {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setIsInjecting(false);
        setIsCompleted(true);
        onSelectDamage(damageType, zone);
      }
    }, 40);
  };

  const handleSelectDamageType = (type: DamageType) => {
    setCurrentDamage(type);
    triggerResinInjection(type, activeZone);
  };

  const handleWindshieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Keep point within active windshield glass area
    const clampedX = Math.max(16, Math.min(84, x));
    const clampedY = Math.max(20, Math.min(80, y));

    setChipPoint({ x: clampedX, y: clampedY });

    let zone = 'Passenger Side';
    if (clampedX < 45 && clampedY > 30) zone = 'Driver Line of Sight';
    else if (clampedY < 32) zone = 'Center / Rearview Mirror Zone';
    else if (clampedY > 70) zone = 'Lower Wiper Cowl Area';

    setActiveZone(zone);
    triggerResinInjection(currentDamage, zone);
  };

  // Get current repair phase label and color
  const getPhaseInfo = () => {
    if (injectionProgress < 32) {
      return {
        step: 1,
        title: 'Phase 1: Vacuum De-Aeration (-28.2 in-Hg)',
        detail: 'Extracting trapped air bubbles and road moisture from micro-fissures...',
        colorText: 'text-sky-400',
        colorBg: 'bg-sky-500',
        badge: 'Vacuum Chamber',
      };
    }
    if (injectionProgress < 75) {
      return {
        step: 2,
        title: 'Phase 2: Hydraulic Optical Resin Injection',
        detail: 'Pressurizing low-viscosity acrylic polymer (1.52 refractive index) into cracks...',
        colorText: 'text-orange-400',
        colorBg: 'bg-orange-500',
        badge: 'Resin Fusion',
      };
    }
    if (injectionProgress < 100) {
      return {
        step: 3,
        title: 'Phase 3: 365nm UV Photopolymerization',
        detail: 'Ultraviolet light solidifies resin into high-tensile glass bond. Polishing flush...',
        colorText: 'text-purple-400',
        colorBg: 'bg-purple-500',
        badge: 'UV Photopolymerization',
      };
    }
    return {
      step: 4,
      title: 'Restoration Complete: 98.8% Optical Clarity',
      detail: 'Factory robotic urethane seal preserved. 100% road and highway safe!',
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-500',
      badge: 'Certified Cured',
    };
  };

  const phase = getPhaseInfo();

  // Fracture opacity decreases as resin cures (from dark crack to 98% invisible)
  const crackOpacity = Math.max(0.08, 1 - (injectionProgress / 100) * 0.92);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
      
      {/* Header with Title and Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Diagnostic & Resin Simulator</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 tracking-tight">
            Click Damage Type or Tap Glass to Watch Resin Flow
          </h3>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
          <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
          <span>Macro Optical Simulator</span>
        </div>
      </div>

      {/* Damage Type Selection Pills */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Select Damage to Simulate Resin Repair:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'rock_chip_bullseye', label: 'Bullseye Break', icon: '🎯', sub: 'Circular Cone' },
            { id: 'rock_chip_starburst', label: 'Starburst Break', icon: '💥', sub: 'Radiating Legs' },
            { id: 'combination_break', label: 'Combination', icon: '⚡', sub: 'Crush & Star' },
            { id: 'crack_small', label: 'Short Crack', icon: '📏', sub: '< 6 Inches' },
          ].map((type) => {
            const isSelected = currentDamage === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleSelectDamageType(type.id as DamageType)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900 border-orange-500 text-white shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-100/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/20 rounded-bl-full pointer-events-none" />
                )}
                <div className="flex items-center gap-2">
                  <span className="text-base">{type.icon}</span>
                  <div className="truncate">
                    <div className="text-xs font-black truncate">{type.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-orange-300' : 'text-slate-400'}`}>
                      {type.sub}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Automotive Windshield Graphic with Live Resin Animation Canvas */}
      <div className="relative">
        <div
          onClick={handleWindshieldClick}
          className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden cursor-crosshair border border-slate-700 shadow-inner group select-none"
        >
          {/* Glass Tint / Gradient & Reflection */}
          <div className="absolute inset-x-3 sm:inset-x-8 top-3 bottom-2 rounded-t-[30px] sm:rounded-t-[44px] rounded-b-[12px] bg-gradient-to-b from-sky-400/20 via-sky-300/10 to-sky-500/15 border-2 border-slate-600/70 backdrop-blur-xs overflow-hidden">
            
            {/* Rearview Mirror & Forward ADAS Housing Graphic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-8 bg-slate-900/95 rounded-b-xl border-x border-b border-slate-700 flex flex-col items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400/90 animate-pulse shadow-sm shadow-emerald-400" />
              <span className="text-[7px] text-slate-400 font-mono mt-0.5">ADAS CAM</span>
            </div>

            {/* Subtle Windshield Sightline Grids */}
            <div className="absolute inset-0 grid grid-cols-3 divide-x divide-white/5 pointer-events-none">
              <div className="flex items-end justify-center pb-2 text-[10px] text-white/30 font-medium tracking-wider uppercase font-mono">
                Driver Side
              </div>
              <div className="flex items-end justify-center pb-2 text-[10px] text-white/30 font-medium tracking-wider uppercase font-mono">
                Center / Mirror
              </div>
              <div className="flex items-end justify-center pb-2 text-[10px] text-white/30 font-medium tracking-wider uppercase font-mono">
                Passenger Side
              </div>
            </div>

            {/* Target Helper Text */}
            <div className="absolute top-2 left-3 sm:left-4 text-[10px] text-sky-200/60 font-mono tracking-tight pointer-events-none flex items-center gap-1.5">
              <span>TAP ANYWHERE ON GLASS TO MOVE PIN</span>
            </div>

            {/* UV Polymerization Scan Beam Sweep (Active during Phase 3) */}
            {isInjecting && injectionProgress >= 70 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                  className="w-32 sm:w-48 h-full bg-gradient-to-r from-transparent via-purple-500/35 to-transparent blur-md"
                  style={{
                    position: 'absolute',
                    left: `${chipPoint.x - 15}%`,
                    top: 0,
                    animation: 'uv-sweep 1.2s ease-in-out infinite',
                  }}
                />
              </div>
            )}

            {/* ACTIVE REPAIR PIN & RESIN INJECTION CORE */}
            <div
              style={{ left: `${chipPoint.x}%`, top: `${chipPoint.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              {/* VACUUM PHASE ANIMATION (Concentric Pulsing Ring) */}
              {isInjecting && injectionProgress < 40 && (
                <div className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full border-2 border-sky-400 animate-vacuum-ring pointer-events-none" />
              )}

              {/* RESIN FLUID FLOW ANIMATION (Luminous amber-cyan fluid expanding) */}
              {isInjecting && injectionProgress >= 25 && injectionProgress < 85 && (
                <div 
                  className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full bg-radial from-amber-400/80 via-orange-500/40 to-transparent animate-resin-flow pointer-events-none"
                />
              )}

              {/* UV CURING GLOW SHIELD (Deep violet-emerald halo) */}
              {isInjecting && injectionProgress >= 70 && (
                <div className="absolute w-24 h-24 -ml-12 -mt-12 rounded-full bg-radial from-purple-500/60 via-emerald-400/25 to-transparent animate-pulse pointer-events-none" />
              )}

              {/* COMPLETED GLINT (Shimmering restoration diamond shine) */}
              {isCompleted && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-radial from-white via-emerald-300/60 to-transparent pointer-events-none"
                />
              )}

              {/* FRACTURE SVG (Rendered according to damage type & fading dynamically) */}
              <div className="relative w-16 h-16 -ml-8 -mt-8 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full transition-all duration-300 pointer-events-none"
                  style={{ opacity: crackOpacity }}
                >
                  {/* Bullseye Shape */}
                  {currentDamage === 'rock_chip_bullseye' && (
                    <>
                      <circle cx="50" cy="50" r="28" fill="none" stroke="#0f172a" strokeWidth="4" />
                      <circle cx="50" cy="50" r="18" fill="rgba(15, 23, 42, 0.6)" stroke="#334155" strokeWidth="2" />
                      <circle cx="50" cy="50" r="7" fill="#020617" />
                    </>
                  )}

                  {/* Starburst Shape */}
                  {currentDamage === 'rock_chip_starburst' && (
                    <>
                      <circle cx="50" cy="50" r="8" fill="#020617" />
                      <path d="M50 18 L50 82 M18 50 L82 50 M26 26 L74 74 M26 74 L74 26" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M50 30 L65 38 M50 70 L35 62 M30 50 L38 65 M70 50 L62 35" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                    </>
                  )}

                  {/* Combination Break Shape */}
                  {currentDamage === 'combination_break' && (
                    <>
                      <circle cx="50" cy="50" r="24" fill="rgba(15, 23, 42, 0.4)" stroke="#0f172a" strokeWidth="3" />
                      <circle cx="50" cy="50" r="10" fill="#020617" />
                      <path d="M50 12 L50 88 M12 50 L88 50 M22 22 L78 78 M22 78 L78 22" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                    </>
                  )}

                  {/* Short Crack Shape */}
                  {currentDamage === 'crack_small' && (
                    <>
                      <circle cx="30" cy="65" r="6" fill="#020617" />
                      <path d="M30 65 Q 48 45, 75 25" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                      <path d="M48 45 L58 52 M62 35 L56 28" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                    </>
                  )}
                </svg>

                {/* Center Pin Indicator */}
                <div className="absolute w-4 h-4 rounded-full bg-orange-600 border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Coordinates Popover HUD */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-md shadow-lg border border-slate-700 whitespace-nowrap pointer-events-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span>{activeZone}</span>
                {isCompleted && <span className="text-emerald-400 font-bold">✓ Cured</span>}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* REPAIR PROGRESS FEEDBACK CONTROLLER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-md">
        
        {/* Progress Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`font-bold ${phase.colorText}`}>{phase.title}</span>
              <span className="text-slate-500">·</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                {phase.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {phase.detail}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => triggerResinInjection(currentDamage, activeZone)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Injection</span>
            </button>
            <div className="text-right font-mono font-black text-sm text-white min-w-[44px]">
              {injectionProgress}%
            </div>
          </div>
        </div>

        {/* Dynamic Progress Meter Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                injectionProgress < 35
                  ? 'bg-gradient-to-r from-sky-500 to-blue-500'
                  : injectionProgress < 75
                  ? 'bg-gradient-to-r from-sky-500 via-amber-500 to-orange-500'
                  : injectionProgress < 100
                  ? 'bg-gradient-to-r from-orange-500 via-purple-500 to-emerald-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${injectionProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 text-[10px] font-mono text-slate-500 text-center">
            <span className={injectionProgress > 0 ? 'text-sky-400 font-bold' : ''}>1. Vacuum Extraction</span>
            <span className={injectionProgress >= 35 ? 'text-orange-400 font-bold' : ''}>2. Resin Flow</span>
            <span className={injectionProgress >= 75 ? 'text-emerald-400 font-bold' : ''}>3. UV Photopolymer</span>
          </div>
        </div>

      </div>

      {/* Real-time Assessment Summary Card */}
      <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Target Area:</span>
            <span className="text-xs font-bold text-orange-700">{activeZone}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              ✓ 100% Guaranteed Repairable
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {activeZone === 'Driver Line of Sight'
              ? 'Located in primary driver sightline: Our optical acrylic polymer restores clarity to >98%, meeting strict DOT and ANSI/ROLAGS road safety standards.'
              : 'Ideal location for vacuum bridge suction. Keeps original robotic factory seal completely intact with zero water leaks or wind noise.'}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Estimated Cost</div>
            <div className="text-base font-black text-slate-900 tabular-nums">
              <span className="text-emerald-700">$0</span> <span className="text-xs text-slate-500 font-normal">via Ins. / $79</span>
            </div>
          </div>
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

    </div>
  );
};
