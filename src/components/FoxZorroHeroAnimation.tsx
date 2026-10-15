import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { FoxZorroMascot } from './FoxZorroMascot';

interface FoxZorroHeroAnimationProps {
  onBookNow: (damage?: string) => void;
}

type AnimationPhase = 'idle' | 'rock_hit' | 'zorro_arrive' | 'z_slash' | 'uv_cure' | 'restored';

export const FoxZorroHeroAnimation: React.FC<FoxZorroHeroAnimationProps> = ({ onBookNow }) => {
  const [viewMode, setViewMode] = useState<'mascot' | 'slider'>('mascot');
  const [phase, setPhase] = useState<AnimationPhase>('restored');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoPlay] = useState(true);
  const [userClickedCoords, setUserClickedCoords] = useState<{ x: number; y: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synthesized Web Audio Sound Effects (optional, user toggleable)
  const playSfx = (type: 'rock' | 'whoosh' | 'zorro' | 'uv' | 'victory') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      if (type === 'rock') {
        // Sharp glass tink
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'zorro') {
        // Dramatic hero flourish (low to high chord)
        [330, 440, 660].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.2, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + 0.45);
        });
      } else if (type === 'uv') {
        // High frequency optical laser hum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'victory') {
        // Crisp crystal shine chime
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + 0.65);
        });
      }
    } catch {
      // Audio not permitted or unsupported
    }
  };

  // Run full rescue sequence
  const startRescueSequence = (customCoords?: { x: number; y: number }) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (customCoords) {
      setUserClickedCoords(customCoords);
    } else {
      setUserClickedCoords({ x: 50, y: 50 });
    }

    // Step 1: Rock hits glass
    setPhase('rock_hit');
    playSfx('rock');

    // Step 2: Fox Zorro arrives
    timerRef.current = setTimeout(() => {
      setPhase('zorro_arrive');
      playSfx('zorro');

      // Step 3: Zorro slashes the resin 'Z'
      timerRef.current = setTimeout(() => {
        setPhase('z_slash');

        // Step 4: UV Polymerization Cure
        timerRef.current = setTimeout(() => {
          setPhase('uv_cure');
          playSfx('uv');

          // Step 5: Restored!
          timerRef.current = setTimeout(() => {
            setPhase('restored');
            playSfx('victory');
          }, 1600);
        }, 1500);
      }, 1400);
    }, 1200);
  };

  // Handle glass click
  const handleGlassClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(82, Math.max(38, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.min(72, Math.max(22, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    startRescueSequence({ x, y });
  };

  // Initial auto sequence loop
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      if (phase === 'restored') {
        startRescueSequence();
      }
    }, 9000);
    return () => clearInterval(interval);
  }, [autoPlay, phase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const coords = userClickedCoords || { x: 60, y: 44 };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 lg:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between w-full">
      {/* Ambient background lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls strip */}
      <div className="relative z-10 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 border-b border-slate-800 pb-3 mb-4">
        <div className="grid grid-cols-2 xs:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('mascot')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === 'mascot'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="truncate">Fox Zorro In Action</span>
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === 'slider'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="truncate">Before / After Slider</span>
          </button>
        </div>

        {viewMode === 'mascot' && (
          <div className="flex items-center justify-end gap-2 shrink-0">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playSfx('zorro');
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer border ${
                soundEnabled 
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Trigger Sequence Button */}
            <button
              onClick={() => startRescueSequence()}
              className="flex-1 xs:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-600/20 active:scale-95 whitespace-nowrap"
            >
              <Play className="w-3 h-3 fill-current shrink-0" />
              <span>Launch Strike</span>
            </button>
          </div>
        )}
      </div>

      {viewMode === 'slider' ? (
        <div className="my-2">
          <BeforeAfterSlider />
        </div>
      ) : (
        <div>
          {/* The Interactive Windshield Rescue Arena */}
          <div 
            onClick={handleGlassClick}
            className="relative w-full aspect-[4/3] xs:aspect-[16/11] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/10] min-h-[250px] xs:min-h-[270px] sm:min-h-[290px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-slate-700/80 overflow-hidden cursor-crosshair select-none group shadow-inner"
          >
            {/* Rearview mirror & car roof contour visual */}
            <div className="absolute top-0 inset-x-0 h-4 bg-slate-800/90 border-b border-slate-700 flex justify-center z-10 pointer-events-none">
              <div className="w-16 sm:w-20 h-3 bg-slate-900 rounded-b-md border-x border-b border-slate-600 shadow-xs" />
            </div>

            {/* Dashboard bottom contour visual */}
            <div className="absolute bottom-0 inset-x-0 h-6 sm:h-7 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent border-t border-slate-800 flex items-center justify-between px-3 sm:px-4 text-[9px] sm:text-[10px] text-slate-400 font-mono z-10 pointer-events-none">
              <span className="truncate max-w-[140px] xs:max-w-none">OEM LAMINATED GLASS</span>
              <span className="text-orange-400 font-bold shrink-0">CLICK TO TEST</span>
            </div>

            {/* Subtle glass wiper arc & reflection rays */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent" />
            <div className="absolute -inset-x-10 top-0 h-full w-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] pointer-events-none" />

        {/* --- PHASE 1: FLYING ROCK & IMPACT --- */}
        {phase === 'rock_hit' && (
          <motion.div
            initial={{ scale: 0, opacity: 1, x: '-80px', y: '-80px' }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeIn' }}
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            className="absolute -ml-3 -mt-3 z-30 pointer-events-none"
          >
            {/* Rock pebble */}
            <div className="w-5 h-4 bg-amber-900 rounded-full border border-amber-600 shadow-lg shadow-amber-900/50 rotate-45 animate-spin" />
          </motion.div>
        )}

        {/* Comic "TINK!" or "CRACK!" Impact Callout */}
        <AnimatePresence>
          {phase === 'rock_hit' && (
            <motion.div
              initial={{ scale: 0, rotate: -15, opacity: 0 }}
              animate={{ scale: [0, 1.25, 1], rotate: -10, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ left: `${Math.min(65, Math.max(12, coords.x - 4))}%`, top: `${Math.max(14, coords.y - 16)}%` }}
              className="absolute z-40 bg-rose-600 text-white font-black text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border-2 border-white shadow-xl shadow-rose-900/60 uppercase tracking-wider pointer-events-none whitespace-nowrap"
            >
              ⚡ TINK! CHIP DETECTED!
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Windshield Crack Graphic */}
        {(phase === 'rock_hit' || phase === 'zorro_arrive' || phase === 'z_slash' || phase === 'uv_cure') && (
          <div 
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <svg className="w-20 h-20" viewBox="0 0 80 80">
              {/* Glass impact ring */}
              <circle
                cx="40"
                cy="40"
                r={phase === 'uv_cure' ? '5' : '10'}
                fill={phase === 'z_slash' ? '#F59E0B' : '#0F172A'}
                fillOpacity={phase === 'z_slash' ? 0.7 : 0.8}
                stroke={phase === 'z_slash' ? '#FBBF24' : '#E2E8F0'}
                strokeWidth={phase === 'uv_cure' ? 1 : 2}
                className="transition-all duration-300"
              />

              {/* Spidering cracks */}
              {phase !== 'uv_cure' && (
                <>
                  <line x1="40" y1="40" x2="15" y2="20" stroke={phase === 'z_slash' ? '#F59E0B' : '#FFFFFF'} strokeWidth="1.8" />
                  <line x1="40" y1="40" x2="68" y2="25" stroke={phase === 'z_slash' ? '#F59E0B' : '#FFFFFF'} strokeWidth="1.8" />
                  <line x1="40" y1="40" x2="62" y2="65" stroke={phase === 'z_slash' ? '#F59E0B' : '#FFFFFF'} strokeWidth="1.8" />
                  <line x1="40" y1="40" x2="20" y2="60" stroke={phase === 'z_slash' ? '#F59E0B' : '#FFFFFF'} strokeWidth="1.8" />
                  <line x1="40" y1="40" x2="40" y2="72" stroke={phase === 'z_slash' ? '#F59E0B' : '#FFFFFF'} strokeWidth="1.5" />
                  {/* Micro sub-legs */}
                  <line x1="25" y1="30" x2="10" y2="35" stroke={phase === 'z_slash' ? '#F59E0B' : '#E2E8F0'} strokeWidth="1" />
                  <line x1="55" y1="32" x2="72" y2="40" stroke={phase === 'z_slash' ? '#F59E0B' : '#E2E8F0'} strokeWidth="1" />
                </>
              )}
            </svg>
          </div>
        )}

        {/* --- PHASE 3: THE SIGNATURE 'Z' SLASH OF OPTICAL RESIN (CARVED BY SWORD TIP) --- */}
        <AnimatePresence>
          {phase === 'z_slash' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-35 pointer-events-none"
            >
              {/* Glowing animated Zorro 'Z' path carved directly by sword tip */}
              <svg className="w-28 h-28 sm:w-32 sm:h-32 overflow-visible" viewBox="0 0 100 100">
                {/* Background optical resin flare */}
                <motion.path
                  d="M 18 24 L 82 24 L 18 76 L 82 76"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.4}
                  filter="blur(4px)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.85, ease: 'easeInOut' }}
                />

                {/* Sharp molten golden optical resin line */}
                <motion.path
                  d="M 18 24 L 82 24 L 18 76 L 82 76"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.85, ease: 'easeInOut' }}
                  filter="drop-shadow(0 0 10px #F59E0B)"
                />

                {/* White-hot laser cut core made by rapier tip */}
                <motion.path
                  d="M 18 24 L 82 24 L 18 76 L 82 76"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.85, ease: 'easeInOut' }}
                />

                {/* Slicing Sword Tip Spark carving the path in real time */}
                <motion.circle
                  r="5.5"
                  fill="#FFFFFF"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 10px #FDE047)"
                  animate={{
                    cx: [18, 82, 18, 82],
                    cy: [24, 24, 76, 76],
                  }}
                  transition={{
                    duration: 0.85,
                    times: [0, 0.32, 0.68, 1],
                    ease: 'linear',
                  }}
                />
              </svg>

              {/* Sparkle burst attached to the slicing sword tip */}
              <motion.div 
                animate={{
                  x: [-32, 32, -32, 32],
                  y: [-26, -26, 26, 26],
                }}
                transition={{
                  duration: 0.85,
                  times: [0, 0.32, 0.68, 1],
                  ease: 'linear',
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Sparkles className="w-8 h-8 text-amber-300 animate-spin drop-shadow-[0_0_12px_#F59E0B]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- PHASE 4: UV LIGHT CURING BEAM --- */}
        <AnimatePresence>
          {phase === 'uv_cure' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0.6, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center bg-gradient-to-b from-cyan-400/30 via-indigo-500/25 to-purple-600/30 backdrop-blur-[1px]"
            >
              {/* UV Beam Cone towards chip */}
              <div 
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-400/40 blur-2xl animate-pulse"
              />
              <div className="absolute top-3 sm:top-4 inset-x-2 text-center pointer-events-none flex justify-center">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-950/90 border border-cyan-400 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold tracking-tight sm:tracking-wider shadow-lg max-w-[95%] truncate">
                  ⚡ 365nm UV POLYMER CURE
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- PHASE 5: RESTORED CLEAR GLASS & SHINE --- */}
        <AnimatePresence>
          {phase === 'restored' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
            >
              {/* Restored point with barely visible micro-dot */}
              <div 
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                {/* Micro dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300/40 border border-cyan-200/50" />
                
                {/* Optical Star Gleam sweeping across */}
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: [0, 1.8, 0], rotate: 180 }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute"
                >
                  <Sparkles className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_10px_#67E8F9]" />
                </motion.div>
              </div>

              {/* Success Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-slate-950/95 border border-emerald-500/80 text-white rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-xl backdrop-blur-md flex items-center gap-1.5 sm:gap-2 max-w-[70%] sm:max-w-none"
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <div className="text-[10px] sm:text-[11px] leading-tight font-sans truncate">
                  <div className="font-extrabold text-emerald-300 truncate">100% FACTORY SEAL SAVED</div>
                  <div className="text-slate-400 text-[9px] sm:text-[10px] truncate">99% Clarity · $0 Deductible</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* --- THE ANIMATED FOX ZORRO HERO CHARACTER --- */}
        {/* ============================================================== */}
        <AnimatePresence>
          <motion.div
            initial={{ x: -60, y: 30, scale: 0.8, opacity: 0 }}
            animate={{ 
              x: phase === 'z_slash' ? 20 : 0, 
              y: 0, 
              scale: 1, 
              opacity: 1 
            }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="absolute left-1 sm:left-4 bottom-2 sm:bottom-4 z-40 select-none flex flex-col items-center"
          >
            <FoxZorroMascot
              phase={phase}
              onTrigger={() => startRescueSequence()}
            />
          </motion.div>
        </AnimatePresence>
      </div>

            {/* Step progress pills */}
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mt-4 pt-3 border-t border-slate-800">
              {[
                { id: 'rock_hit', label: '1. Hit', full: '1. Rock Hit', active: phase === 'rock_hit' },
                { id: 'zorro_arrive', label: '2. Leaps', full: '2. Zorro Leaps', active: phase === 'zorro_arrive' },
                { id: 'z_slash', label: '3. Resin Z', full: '3. Resin "Z"', active: phase === 'z_slash' },
                { id: 'uv_cure', label: '4. UV Cure', full: '4. UV Cure', active: phase === 'uv_cure' },
                { id: 'restored', label: '5. Clear', full: '5. Restored', active: phase === 'restored' },
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => {
                    if (step.id === 'rock_hit') startRescueSequence();
                    else setPhase(step.id as AnimationPhase);
                  }}
                  className={`py-1.5 px-0.5 sm:px-1 text-[9px] sm:text-[10px] font-bold rounded-lg text-center transition-all cursor-pointer ${
                    step.active
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="sm:hidden">{step.label}</span>
                  <span className="hidden sm:inline">{step.full}</span>
                </button>
              ))}
            </div>
          </div>
      )}

      {/* Dynamic bottom call to action */}
      <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 w-full sm:w-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <span className="font-bold text-white">Save Windshield</span>
              <span className="text-slate-400"> · 25-min driveway repair</span>
            </div>
          </div>

          <button
            onClick={() => onBookNow('rock_chip_bullseye')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Book Chip Repair</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
