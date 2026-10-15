import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers, 
  Car, 
  ArrowRight,
  AlertCircle,
  FileText,
  Compass,
  Wind,
  Sun,
  Play,
  Pause,
  RotateCcw,
  Droplets,
  Eye,
  Zap,
  Check,
  Scale
} from 'lucide-react';
import damageGuideImg from '../assets/images/windshield_damage_guide_1791911738683.jpg';
import glassLayersImg from '../assets/images/windshield_glass_layers_1791911755655.jpg';
import vacuumRepairImg from '../assets/images/vacuum_resin_repair_1791911777292.jpg';
import logoImg from '../assets/images/chip_zorro_logo.png';

interface WindshieldCareGuideProps {
  onBookNow: (damageType?: string) => void;
}

export const WindshieldCareGuide: React.FC<WindshieldCareGuideProps> = ({ onBookNow }) => {
  const [activeTab, setActiveTab] = useState<'process' | 'matrix' | 'anatomy' | 'vsreplace' | 'emergency'>('process');
  const [selectedDamageType, setSelectedDamageType] = useState<string>('bullseye');

  // Animation state for the 3-step vacuum-pressure explainer
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const repairSteps = [
    {
      title: '1. Negative Vacuum De-Aeration (-28 in-Hg)',
      badge: 'Vacuum Chamber',
      desc: 'The Chip Zorro precision bridge clamps over the rock chip with suction. We pull a powerful 28 in-Hg negative vacuum to extract all trapped air, microscopic dust, and moisture from the inner fracture pockets.',
      icon: Wind,
      visualDetail: 'Extracts 100% of trapped air bubbles & road moisture',
      color: 'from-sky-500 to-blue-600',
    },
    {
      title: '2. Hydraulic Optical Resin Injection',
      badge: 'Optical Polymer Fusion',
      desc: 'We inject aerospace-grade optical UV acrylic resin calibrated to the exact refractive index of automotive glass (1.52). High hydraulic pressure forces resin deep into every microscopic starburst capillary fissure.',
      icon: Sparkles,
      visualDetail: 'Refractive-matched polymer fills fissures, making cracks vanish',
      color: 'from-orange-500 to-amber-600',
    },
    {
      title: '3. 365nm UV Photopolymerization & Polish',
      badge: 'Instant Curing & Diamond Polish',
      desc: 'A high-intensity 365nm ultraviolet lamp polymerizes the liquid resin into a solid structural bond stronger than original glass in minutes. Capped and polished flush with cerium oxide. Drive away instantly!',
      icon: Sun,
      visualDetail: 'Solid molecular bond restores 100% structural factory strength',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  // Auto-play interval for the repair process animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % repairSteps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, repairSteps.length]);

  // Decision matrix data from the document
  const damageCategories = [
    {
      id: 'bullseye',
      name: 'Bullseye Break',
      repairable: true,
      maxSize: 'Up to 1 inch (Quarter size)',
      icon: '🎯',
      description: 'Smooth circular cone fracture in the outer glass sheet with a defined central impact pit and clean dark ring boundary.',
      cause: 'Direct blunt impact from round gravel or pebbles at highway speeds.',
      repairDifficulty: 'Very High Success Rate (98%+ optical restoration)',
      recommendation: 'Prime candidate for vacuum-resin repair. Keep clean with tape and avoid moisture.',
    },
    {
      id: 'starburst',
      name: 'Starburst / Star Break',
      repairable: true,
      maxSize: 'Up to 2 inches diameter',
      icon: '💥',
      description: 'Central impact crater with multiple short, radiating fracture legs branching outward like rays of a star or spiderweb.',
      cause: 'Sharp, angular crushed gravel causing localized tensile stress fractures.',
      repairDifficulty: 'Excellent (Resin is pressured deep along each microscopic leg)',
      recommendation: 'Must be taped and repaired promptly before vehicle vibrations cause legs to run.',
    },
    {
      id: 'combination',
      name: 'Combination Break',
      repairable: true,
      maxSize: 'Up to 2 inches diameter',
      icon: '⚡',
      description: 'Features both a central crushed bullseye cone AND radiating starburst fracture legs branching outward.',
      cause: 'High-energy projectile impact combining blunt and shearing forces.',
      repairDifficulty: 'Dual-cycle vacuum/pressure completely evacuates both cone and radiating legs.',
      recommendation: 'Saveable if treated before dirt enters. Avoid slamming vehicle doors.',
    },
    {
      id: 'halfmoon',
      name: 'Half-Moon (Partial Bullseye)',
      repairable: true,
      maxSize: 'Up to 1 inch',
      icon: '🌙',
      description: 'Semi-circular crescent fracture caused by an oblique or glancing stone strike.',
      cause: 'Glancing impact from passing traffic.',
      repairDifficulty: 'High success rate. Easy to fill with optical acrylic polymer.',
      recommendation: 'Completely restorable with pristine cosmetic results.',
    },
    {
      id: 'crack_short',
      name: 'Short Hairline Crack (< 6 Inches)',
      repairable: true,
      maxSize: 'Up to 6 inches (Dollar bill length)',
      icon: '📏',
      description: 'Single hairline crack line that has not reached the outer black ceramic edge of the windshield.',
      cause: 'Stress concentration following a rock strike or temperature variation.',
      repairDifficulty: 'Micro-relief pit drilled at crack tip to relieve stress, followed by pressurized resin infusion.',
      recommendation: 'Repair immediately! Thermal shock from AC or heater will quickly make it spread.',
    },
    {
      id: 'crack_edge',
      name: 'Edge Crack (Reaches Outer Frame)',
      repairable: false,
      maxSize: 'Touches outer frame edge',
      icon: '🚫',
      description: 'Any crack that touches or originates within 2 inches of the vehicle windshield perimeter urethane frame.',
      cause: 'Perimeter shear stress or torsional body flex.',
      repairDifficulty: 'Non-repairable (Structural integrity compromised at adhesive bond)',
      recommendation: 'Requires complete windshield replacement. Frame tension cannot hold repaired edge.',
    },
    {
      id: 'dual_layer',
      name: 'Dual-Layer Penetration',
      repairable: false,
      maxSize: 'Cracked through inside glass',
      icon: '⚠️',
      description: 'Damage that penetrates the outer glass, tears the vinyl PVB plastic layer, and breaks the inside glass sheet.',
      cause: 'Severe high-energy projectile or collision.',
      repairDifficulty: 'Non-repairable (Laminated safety barrier is breached)',
      recommendation: 'Requires windshield replacement for cabin occupant safety.',
    },
  ];

  const currentDamage = damageCategories.find(d => d.id === selectedDamageType) || damageCategories[0];

  return (
    <section 
      id="how-it-works-section" 
      className="py-16 bg-slate-950 text-white border-b border-slate-800 scroll-mt-20 relative overflow-hidden"
    >
      {/* Anchor for old guide links */}
      <div id="windshield-guide-section" className="absolute -top-20" />

      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              <span>How It Works · Windshield Care & Science Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              How Chip Zorro Saves Your Windshield
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Based on automotive engineering standards: discover how our 25-minute optical vacuum-resin technology restores factory glass, review qualifying damage types with real photo guides, and learn how emergency care saves you from a $1,200+ replacement.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onBookNow()}
              className="px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Schedule Mobile Repair</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Emergency First-Aid Callout (Always visible high-value advice) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 text-xl">
              🩹
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-extrabold text-amber-200">
                Fresh Stone Chip? 2-Minute Emergency Rule:
              </h4>
              <p className="text-xs text-slate-300">
                Put clean clear tape over the break immediately to seal out road dirt and moisture. <strong>Never blast defroster heat or max A/C</strong>—thermal shock causes chips to snap into 2-foot cracks within seconds!
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('emergency')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            View First-Aid Protocol →
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'process'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>1. The 3-Step Vacuum Repair Process</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-orange-400" />
            <span>2. Windshield Damage Photo Guide (Can It Be Saved?)</span>
          </button>

          <button
            onClick={() => setActiveTab('anatomy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'anatomy'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>3. The Laminated "Glass Sandwich" & Factory Seal</span>
          </button>

          <button
            onClick={() => setActiveTab('vsreplace')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'vsreplace'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>4. Repair vs Replace</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'emergency'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>5. Emergency First-Aid: Do&apos;s &amp; Don&apos;ts</span>
          </button>
        </div>

        {/* TAB 1: 3-STEP VACUUM REPAIR PROCESS (WITH INTERACTIVE ANIMATION & REAL PHOTO) */}
        {activeTab === 'process' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Real Process Photo & Overview Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Precision Automotive Optical Polymerization</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Professional Vacuum-Pressure Hydraulic Injection
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike retail DIY glue bottles that trap air and ruin windshields permanently, Chip Zorro utilizes a certified dual-stage mechanical injector bridge. We draw a deep <strong>-28 in-Hg vacuum</strong> to completely evacuate air and moisture from microscopic fissures, then inject crystal-clear optical acrylic resin (refractive index 1.52) under hydraulic pressure.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> 100% Factory Seal Intact
                  </span>
                  <span className="flex items-center gap-1.5 text-orange-400">
                    <CheckCircle2 className="w-4 h-4" /> 25-Min Rapid UV Cure
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <CheckCircle2 className="w-4 h-4" /> Lifetime No-Spread Warranty
                  </span>
                </div>
              </div>

              {/* Real High-Tech Repair Photo */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src={vacuumRepairImg}
                  alt="Professional windshield vacuum injector tool injecting resin under UV light"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-700">
                    Chip Zorro Injector Bridge & UV Lamp
                  </span>
                  <span className="text-emerald-400 font-bold">Live Workshop Application</span>
                </div>
              </div>
            </div>

            {/* Dynamic Motion Stage Canvas (Interactive Animated Explainer) */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>Interactive 3-Step Scientific Animation</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Step through each stage or watch the automated cycle below:
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep(0);
                      setIsPlaying(true);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    aria-label="Restart animation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stepper Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual Glass Animation Window */}
                <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 border border-slate-800 min-h-[280px] flex flex-col justify-between shadow-inner relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs font-mono border-b border-slate-900 pb-2">
                    <span className="text-slate-400">LAMINATED OEM GLASS (OUTER LAYER)</span>
                    <span className="text-orange-400 font-bold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-xs">
                      {repairSteps[activeStep].badge}
                    </span>
                  </div>

                  {/* Simulated Animated Fracture Chamber */}
                  <div className="relative w-full py-8 flex items-center justify-center my-auto min-h-[140px]">
                    <div className="absolute inset-x-4 inset-y-2 bg-gradient-to-r from-sky-950/30 via-sky-900/40 to-sky-950/30 rounded-xl border border-sky-800/40 backdrop-blur-sm" />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.35 }}
                        className="relative z-10 flex flex-col items-center justify-center text-center px-2 w-full"
                      >
                        {/* Step 1: Vacuum */}
                        {activeStep === 0 && (
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-sky-400 animate-spin flex items-center justify-center">
                              <Wind className="w-7 h-7 text-sky-400 animate-pulse" />
                            </div>
                            <div className="text-xs font-mono text-sky-300 bg-sky-950/90 px-3 py-1 rounded-full border border-sky-700">
                              VACUUM ACTIVE: -28.2 in-Hg (AIR DE-AERATED)
                            </div>
                          </div>
                        )}

                        {/* Step 2: Resin injection */}
                        {activeStep === 1 && (
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                              <Sparkles className="w-7 h-7 text-white animate-bounce" />
                            </div>
                            <div className="text-xs font-mono text-orange-300 bg-orange-950/90 px-3 py-1 rounded-full border border-orange-700">
                              OPTICAL RESIN INJECTED: 100% CAPILLARY FUSION
                            </div>
                          </div>
                        )}

                        {/* Step 3: UV cure */}
                        {activeStep === 2 && (
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                              <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-xs font-mono text-emerald-300 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-700">
                              UV POLYMERIZED: 100% SAFE TO DRIVE IMMEDIATELY
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Scrub Bar */}
                  <div className="space-y-2 border-t border-slate-900 pt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span className="font-bold text-slate-300">STAGE {activeStep + 1} OF 3</span>
                      <span className="text-slate-400">{repairSteps[activeStep].visualDetail}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {repairSteps.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setActiveStep(i);
                            setIsPlaying(false);
                          }}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            activeStep === i
                              ? 'bg-orange-500 shadow-sm shadow-orange-500/50'
                              : i < activeStep
                              ? 'bg-emerald-500'
                              : 'bg-slate-800 hover:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Steps Details */}
                <div className="lg:col-span-5 space-y-3">
                  {repairSteps.map((s, idx) => {
                    const isSelected = activeStep === idx;
                    const IconComponent = s.icon;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setActiveStep(idx);
                          setIsPlaying(false);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/95 border-orange-500 shadow-md ring-1 ring-orange-500/30'
                            : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/50 text-slate-400'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-white">
                              {s.title}
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {s.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Why DIY Kits Fail Box */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-amber-200">
                  Why Cheap $12 Store-Bought DIY Glue Kits Ruin Windshields
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Retail glue kits lack a negative vacuum evacuation pump. When glue is squeezed over a rock chip, air and road moisture remain trapped inside the micro-fissures. Once the glue hardens in the sun, the break is permanently sealed with air pockets inside—preventing professional optical resin from ever penetrating and turning a fixable $79 repair into an unavoidable $1,200 windshield replacement!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WINDSHIELD DAMAGE PHOTO GUIDE (WITH REAL MACRO PHOTO) */}
        {activeTab === 'matrix' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Visual Damage Guide Photo Header */}
            <div className="space-y-4">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Visual Damage Identification Guide</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Automotive Windshield Rock Chip Damage Types
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Examine the macro photograph diagram below to identify your specific rock chip structure. Our mobile technicians carry specialized injectors calibrated for each geometry:
                </p>
              </div>

              {/* High-Resolution Diagram Image */}
              <div className="rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl relative group">
                <img
                  src={damageGuideImg}
                  alt="Automotive Windshield Rock Chip Damage Types: Bullseye Break, Starburst Fracture, Combination Rock Chip with photographic detail"
                  className="w-full h-auto object-cover"
                />
                <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Photo Guide: Bullseye (Conic Crush) · Starburst (Radiating Legs) · Combination Break</span>
                  <span className="text-emerald-400 font-bold">100% Qualifies for $0 Deductible Insurance Repair</span>
                </div>
              </div>
            </div>

            {/* Interactive Damage Decision Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Damage Selector List */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Select Damage Type for Technical Specifications:
                </div>
                {damageCategories.map((cat) => {
                  const isSelected = cat.id === selectedDamageType;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedDamageType(cat.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-orange-500 shadow-lg shadow-orange-500/15'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{cat.icon}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold text-white">
                            {cat.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Limit: {cat.maxSize}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {cat.repairable ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✓ 100% Repairable
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            ✕ Must Replace
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Damage Detail Card */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentDamage.icon}</span>
                    <div>
                      <h4 className="text-xl font-black text-white">{currentDamage.name}</h4>
                      <p className="text-xs text-slate-400">Maximum Qualification Limit: {currentDamage.maxSize}</p>
                    </div>
                  </div>

                  <div>
                    {currentDamage.repairable ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Chip Zorro Guaranteed Repair</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Requires Full Glass Replacement</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-1">
                      Visual Morphology & Characteristics:
                    </span>
                    <p className="text-slate-200 leading-relaxed text-sm">
                      {currentDamage.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-orange-400 uppercase tracking-wider block text-[10px]">
                        Primary Cause:
                      </span>
                      <p className="text-slate-300">{currentDamage.cause}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-sky-400 uppercase tracking-wider block text-[10px]">
                        Optical Restoration Index:
                      </span>
                      <p className="text-slate-300">{currentDamage.repairDifficulty}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider block text-[10px]">
                      Technician Action & Recommendation:
                    </span>
                    <p className="text-slate-200 font-medium">{currentDamage.recommendation}</p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    {currentDamage.repairable
                      ? '✓ $0 out of pocket with comprehensive auto insurance'
                      : '⚠️ We will advise you honestly if replacement is required'}
                  </div>

                  <button
                    onClick={() => onBookNow(currentDamage.id)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{currentDamage.repairable ? 'Book Repair for This Damage' : 'Get Free Diagnostic Advice'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THE LAMINATED GLASS SANDWICH & OEM SAFETY INTEGRITY */}
        {activeTab === 'anatomy' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header with Cutaway Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Automotive Laminated Safety Glass Engineering</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  The "Glass Sandwich": Outer Layer, PVB, and Inner Layer
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike side or rear windows (which are single-sheet tempered glass), your vehicle’s windshield is a high-tech 3-layer laminated safety composite. <strong>In 95%+ of stone chips, only the outer glass layer is chipped.</strong> The protective PVB safety vinyl and inner glass remain 100% intact. Chip Zorro restores this outer layer without ever disturbing the factory seal!
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Robotic Assembly Line Seal</span>
                  </div>
                  <p>
                    Original factory urethane is applied by robotics under controlled temperature and humidity. Field windshield replacements require slicing with metal blades, which often scratches the frame's pinch weld and leads to rust and water leaks.
                  </p>
                </div>
              </div>

              {/* Cutaway Engineering Diagram Photo */}
              <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src={glassLayersImg}
                  alt="3D cutaway engineering diagram of automotive laminated windshield glass sandwich structure"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>1. Outer Glass (2.1mm) · 2. Acoustic PVB · 3. Inner Glass</span>
                  <span className="text-sky-400 font-bold">OEM Structural Composite</span>
                </div>
              </div>
            </div>

            {/* 3 Major Structural Reasons Why Saving OEM Windshield Matters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 w-fit">
                  <Car className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">30% of Cabin Rollover Strength</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In a rollover collision, your vehicle’s factory-bonded windshield provides up to <strong>30% of total roof crush resistance</strong> and serves as the primary backstop for passenger airbag deployment.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 w-fit">
                  <Droplets className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Zero Pinch Weld Frame Rust</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Technicians removing old windshields slice the urethane with sharp metal cold knives. This almost always scratches the vehicle's painted pinch weld frame, leading to hidden corrosion, rainwater leaks, and wind whistle.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 w-fit">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Zero ADAS Recalibration Fees</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Modern cars feature front-facing safety cameras (Automatic Emergency Braking, Lane Departure). Replacing the windshield requires recalibrating sensors costing up to $500. Repairing the chip leaves camera positions 100% factory original.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: REPAIR VS REPLACE */}
        {activeTab === 'vsreplace' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Scale className="w-4 h-4" />
                <span>Repair is all we do</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                A $99 repair vs. a $899.60 replacement.
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                A national chain charges <strong className="text-slate-200">$899.60 plus tax</strong> for
                a common truck windshield \u2014 before the day\u2019s wait for glass, the 2-hour install,
                and camera recalibration. Our repair: <strong className="text-emerald-400">$99 flat</strong>,
                done in your driveway in under 30 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6">
                <div className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">
                  Full Replacement
                </div>
                <div className="text-3xl font-black text-white mb-4">
                  $899.60 <span className="text-sm font-medium text-slate-500">+ tax</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>\u00B7 Day+ wait for glass to arrive</li>
                  <li>\u00B7 2-hour shop install</li>
                  <li>\u00B7 1\u20132 hours ADAS camera recalibration</li>
                  <li>\u00B7 Factory seal cut out and replaced</li>
                  <li>\u00B7 Old windshield to landfill</li>
                  <li>\u00B7 You drive to the shop and wait</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">
                  Chip Zorro Repair
                </div>
                <div className="text-3xl font-black text-white mb-4">
                  $99 <span className="text-sm font-medium text-slate-500">flat</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li>\u00B7 Usually within 24 hours</li>
                  <li>\u00B7 Under 30 minutes, at your location</li>
                  <li>\u00B7 No recalibration needed</li>
                  <li>\u00B7 Factory seal stays 100% intact</li>
                  <li>\u00B7 Zero glass waste</li>
                  <li>\u00B7 Drive away immediately</li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h4 className="text-white font-bold mb-4">Head-to-head comparison</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 uppercase tracking-wider text-[11px] border-b border-white/10">
                      <th className="text-left py-2 pr-4"></th>
                      <th className="text-left py-2 pr-4 text-emerald-400">Repair ($99)</th>
                      <th className="text-left py-2">Replace ($899.60+)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr><td className="py-2.5 pr-4 font-bold text-white">Time</td><td className="py-2.5 pr-4">Under 30 min</td><td className="py-2.5">Day+ with calibration</td></tr>
                    <tr><td className="py-2.5 pr-4 font-bold text-white">Location</td><td className="py-2.5 pr-4">Your driveway</td><td className="py-2.5">Shop visit required</td></tr>
                    <tr><td className="py-2.5 pr-4 font-bold text-white">Factory seal</td><td className="py-2.5 pr-4">Kept intact</td><td className="py-2.5">Cut out &amp; replaced</td></tr>
                    <tr><td className="py-2.5 pr-4 font-bold text-white">Drive-away</td><td className="py-2.5 pr-4">Immediately</td><td className="py-2.5">1\u20132 hr adhesive cure wait</td></tr>
                    <tr><td className="py-2.5 pr-4 font-bold text-white">ADAS</td><td className="py-2.5 pr-4">No recalibration</td><td className="py-2.5">$200\u2013400 recalibration</td></tr>
                    <tr><td className="py-2.5 pr-4 font-bold text-white">Green</td><td className="py-2.5 pr-4">Zero waste</td><td className="py-2.5">Old glass to landfill</td></tr>
                    <tr><td className="py-2.5 pr-4 font-bold text-white">Insurance</td><td className="py-2.5 pr-4">$0 deductible, no rate hike</td><td className="py-2.5">Deductible applies</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-4">
              <h4 className="text-white font-bold">Honest limits \u2014 when repair isn\u2019t the answer</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sand-blasted or heavily pitted glass can\u2019t be repaired \u2014 the surface is too far
                gone for resin to restore clarity. If your windshield needs replacement, we\u2019ll tell
                you straight and point you to a trusted shop from our replacement referral database.
                Learn more at{' '}
                <a
                  href="https://safewindshields.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember-400 hover:text-ember-300 underline"
                >
                  safewindshields.org
                </a>.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every Chip Zorro technician completes <strong className="text-slate-200">100+ repairs</strong> before
                touching your car. Repair is all we do \u2014 we never upsell replacements.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: EMERGENCY FIRST-AID (DO'S & DON'TS) */}
        {activeTab === 'emergency' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Emergency Rock Chip First-Aid: How to Save Your Glass
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Take these 4 simple steps immediately following a rock chip impact to protect the fracture from spreading before our mobile unit arrives:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* THE CRUCIAL DO'S */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">What You MUST Do Immediately</h3>
                    <p className="text-xs text-emerald-400 font-semibold">First-Aid to preserve optical clarity</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-[10px]">1</span>
                      <span>Apply Clear Scotch or Packing Tape Over the Chip</span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">
                      Cover the outside impact point with a piece of clear tape immediately! This seals out dirt, washer fluid, road grime, and moisture. Clean breaks repair to <strong>95%–99% invisible clarity</strong>; dirty contaminated breaks trap micro-debris and leave noticeable blemishes.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-[10px]">2</span>
                      <span>Keep the Vehicle at a Moderate Ambient Temperature</span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">
                      Park in a shaded garage or carport if possible. Direct hot summer sunshine heats up the outer glass layer while the interior remains cooler, creating thermal shear stress that pops the break open.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-[10px]">3</span>
                      <span>Drive Gently and Avoid Potholes</span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">
                      Vehicle unibody frames flex slightly when hitting potholes or speed bumps. This chassis twist transfers directly to the bonded windshield. Drive smoothly until repaired.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-[10px]">4</span>
                      <span>Book Mobile Repair Within 24 to 48 Hours</span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">
                      The fresher the rock chip, the better the optical resin bonds. Once our van injects the polymer, the crack is chemically fused forever.
                    </p>
                  </div>
                </div>
              </div>

              {/* THE DANGEROUS DON'TS */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-rose-500/30 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">What You MUST NEVER Do</h3>
                    <p className="text-xs text-rose-400 font-semibold">Common mistakes that ruin repairable windshields</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-mono flex items-center justify-center text-[10px]">✕</span>
                      <span>DO NOT Blast High Defroster Heat or Max A/C (Thermal Shock)</span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">
                      <strong>#1 Cause of Spread:</strong> Blasting hot defroster air on a freezing morning creates intense thermal expansion on the inside while the outside remains freezing cold. The glass expands unevenly and snaps instantly into a long 2-foot runner crack!
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-mono flex items-center justify-center text-[10px]">✕</span>
                      <span>DO NOT Press With Your Thumb or Tap the Glass</span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">
                      Many drivers press their thumb against the inside of the glass or tap the rock chip to "feel" how deep it is. Any localized flex pushes the micro-cracks past their yield point and triggers a permanent split.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-mono flex items-center justify-center text-[10px]">✕</span>
                      <span>DO NOT Go Through High-Pressure Car Washes</span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">
                      High-pressure sprayers force pressurized water, detergents, and waxes directly into the microscopic fissure. Trapped chemicals prevent optical UV resin from achieving structural bonding.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-mono flex items-center justify-center text-[10px]">✕</span>
                      <span>DO NOT Slam Car Doors With All Windows Rolled Up</span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">
                      Modern vehicle cabins have airtight weatherstripping. Slamming a door compresses interior cabin air like a piston, producing a sudden outward pressure spike against the windshield that can pop the break.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
