import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Car, 
  ArrowRight,
  FileText,
  Compass,
  Droplets,
  Eye,
  Siren
} from 'lucide-react';
import { Eyebrow, EmberButton } from './design';
import damageGuideImg from '../assets/images/windshield_damage_guide_1791911738683.jpg';
import glassLayersImg from '../assets/images/windshield_glass_layers_1791911755655.jpg';
import vacuumRepairImg from '../assets/images/vacuum_resin_repair_1791911777292.jpg';

interface WindshieldCareGuideProps {
  onBookNow: (damageType?: string) => void;
}

export const WindshieldCareGuide: React.FC<WindshieldCareGuideProps> = ({ onBookNow }) => {
  const [activeTab, setActiveTab] = useState<'process' | 'matrix' | 'anatomy'>('process');
  const [selectedDamageType, setSelectedDamageType] = useState<string>('bullseye');

  const repairSteps = [
    {
      title: 'Vacuum extraction',
      desc: 'A precision bridge seals over the chip and pulls a deep vacuum, drawing every trace of air and moisture out of the fissures.',
    },
    {
      title: 'Resin injection',
      desc: 'Crystal-clear optical resin, matched to the refractive index of glass, is injected under pressure deep into the break.',
    },
    {
      title: 'UV cure & polish',
      desc: 'A UV lamp hardens the resin into a structural bond in minutes. Polished flush — you drive away immediately.',
    },
  ];

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
          <div className="space-y-4 max-w-3xl">
            <Eyebrow icon={<FileText className="w-3.5 h-3.5" />}>
              How it works · Care & science guide
            </Eyebrow>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] text-white tracking-tight text-balance">
              How Chip Zorro saves your windshield.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Our 25-minute optical vacuum-resin process restores factory glass without replacing it. See how it works, check whether your damage qualifies, and learn the two-minute first-aid that prevents a $1,200 replacement.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <EmberButton onClick={() => onBookNow()} arrow>
              Schedule mobile repair
            </EmberButton>
          </div>
        </div>

        {/* Emergency First-Aid Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
            <Siren className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-extrabold text-amber-200">
              Fresh Stone Chip? 2-Minute Emergency Rule:
            </h4>
            <p className="text-xs text-slate-300">
              Put clear tape over the break right away to seal out dirt and moisture. <strong>Never blast defroster heat or max A/C</strong> — thermal shock can turn a chip into a two-foot crack in seconds.
            </p>
          </div>
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
            <span>1. The Repair Process</span>
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
            <span>2. Damage Guide</span>
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
            <span>3. Glass Science</span>
          </button>
        </div>

        {/* TAB 1: 3-STEP VACUUM REPAIR PROCESS (WITH INTERACTIVE ANIMATION & REAL PHOTO) */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            {/* Overview: photo + intro */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Optical vacuum-resin repair</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Three steps. Twenty-five minutes. Factory glass saved.
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  A certified injector bridge seals over the chip, evacuates air and moisture under deep vacuum, then injects crystal-clear optical resin under pressure. A UV lamp hardens it into a structural bond — polished flush, ready to drive immediately.
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

              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
                <img
                  src={vacuumRepairImg}
                  alt="Professional windshield vacuum injector tool injecting resin under UV light"
                  className="w-full h-auto object-cover"
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

            {/* The three steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {repairSteps.map((s, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-black flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-extrabold text-white">{s.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Why DIY Kits Fail Box */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-amber-200">
                  Why cheap store-bought DIY glue kits ruin windshields
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Retail glue kits can't pull a vacuum, so air and moisture stay trapped inside the fissures. Once the glue hardens, the break is sealed with air pockets inside — professional resin can never penetrate afterward, turning a fixable $79 repair into a $1,200 replacement.
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

              </div>
    </section>
  );
};
