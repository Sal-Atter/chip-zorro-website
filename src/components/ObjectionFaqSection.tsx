import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ShieldCheck, Check, HelpCircle, Phone } from 'lucide-react';

export const ObjectionFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why should I put clear tape over a rock chip immediately?',
      a: 'Applying a piece of clean, clear Scotch or packing tape over the outside of the break seals out road grime, wiper fluid, car wash wax, and moisture. Clean breaks achieve 95%–99% crystal-clear optical resin bonding, whereas contaminated breaks trap micro-debris that can leave a cloudy blemish.',
    },
    {
      q: 'Can I turn on my defroster or max A/C when my windshield has a rock chip?',
      a: 'Avoid sudden temperature extremes (thermal shock)! Blasting hot defroster air onto cold windshield glass causes rapid uneven thermal expansion. This is the #1 reason a tiny 5mm stone chip suddenly snaps into a 2-foot unrepairable crack across your entire windshield within seconds.',
    },
    {
      q: 'What is the "glass sandwich" structure of an automotive windshield?',
      a: 'Unlike side or rear windows (which are tempered single-pane safety glass), windshields are made of laminated safety glass: two sheets of ~2.1mm float glass permanently bonded with a tough 0.76mm Polyvinyl Butyral (PVB) vinyl interlayer. In almost all rock chips, only the outer glass sheet is chipped. Our vacuum-resin injection restores this outer layer without disturbing the PVB core or inner glass.',
    },
    {
      q: 'Why is keeping my original factory OEM windshield safer than replacement?',
      a: 'Your factory windshield is installed by precision robotics and provides up to 30% of your vehicle cabin’s structural rollover roof crush resistance and supports passenger airbag deployment. Field replacements often scratch the vehicle frame paint (causing hidden rust and water leaks) and require costly recalibration of front ADAS safety cameras.',
    },
    {
      q: 'Can all windshield rock chips and cracks be repaired?',
      a: 'We successfully repair bullseyes, starbursts, combinations, and half-moons up to 2 inches, and single hairline cracks under 6 inches (dollar bill length). However, if damage penetrates both glass layers, reaches the outer perimeter edge of the windshield, or severely impairs the driver direct sightline, safety regulations require full replacement.',
    },
    {
      q: 'Will filing a rock chip repair claim increase my auto insurance rates?',
      a: 'No! Under insurance industry regulations, windshield rock chip repairs fall under "no-fault comprehensive glass coverage." Because insurance companies want to prevent paying for a $1,000+ windshield replacement, they waive your deductible 100% and it will NOT increase your policy premiums.',
    },
    {
      q: 'Can you repair my rock chip while I am at work or away from the vehicle?',
      a: 'Yes! Over 60% of our mobile repairs are completed in office parking structures and driveways without the customer needing to stand outside. You can simply leave keys in a lockbox or coordinate with your mobile technician by phone. We text you before-and-after photos and a digital receipt upon completion.',
    },
    {
      q: 'Will the repaired windshield pass annual state safety inspections?',
      a: '100% yes. Our optical polymer resin restores structural glass density to factory specifications and achieves 95%–99% visual clarity, fully complying with DOT and ANSI/ROLAGS automotive safety inspection requirements.',
    },
    {
      q: 'What is the Chip Zorro Lifetime No-Spread Guarantee?',
      a: 'If any rock chip repaired by Chip Zorro ever spreads or cracks from the point of repair during the lifetime of your vehicle ownership, we will refund 100% of the cost of the repair or credit it toward any future glass service. That is our unbreakable promise.',
    },
    {
      q: 'Why do other glass shops try to force a full replacement instead of a repair?',
      a: 'Because auto glass replacement companies can bill insurance $1,000 to $1,500 for aftermarket glass and ADAS recalibration fees! At Chip Zorro, we are 100% dedicated to windshield repair. We never replace windshields, meaning you never have to worry about high-pressure replacement upsells.',
    },
    {
      q: 'How long until I can safely wash my car or drive on the highway?',
      a: 'You can drive on the highway the very second our technician finishes! Unlike windshield replacements which require 24 hours for urethane adhesive to cure, our UV-cured acrylic polymer solidifies instantly under 365nm light.',
    },
  ];

  // Schema.org FAQPage structured data for Google Search rich snippets
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a,
      },
    })),
  };

  return (
    <section id="faq-section" className="py-16 bg-slate-50 border-b border-slate-200">
      {/* Schema.org FAQPage JSON-LD for search engine crawlers & rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Got Questions? We Have Answers
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions & Guarantees
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to know about $0 deductible insurance claims, mobile dispatch, and our lifetime warranty.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <div
                    className={`p-1.5 rounded-full bg-slate-100 text-slate-600 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-orange-100 text-orange-600' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Quick Help Callout */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Have a unique crack or multiple vehicles?</span>
              <span className="text-slate-500">Call our direct dispatch desk for an immediate 2-minute answer.</span>
            </div>
          </div>
          <a
            href="tel:8005552447"
            className="px-4 py-2 font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors whitespace-nowrap"
          >
            (800) 555-2447
          </a>
        </div>
      </div>
    </section>
  );
};
