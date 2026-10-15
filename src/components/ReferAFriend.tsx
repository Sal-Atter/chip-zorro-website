import React, { useState } from 'react';
import { Ticket, Share2, DollarSign, Check, Copy } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import {
  REFERRAL_REWARD,
  ReferralRecord,
  generateReferralCode,
  addReferral,
  loadReferrals,
  referralShareLink,
} from '../utils/promos';

export const ReferAFriend: React.FC = () => {
  const [name, setName] = useState('');
  const [referral, setReferral] = useState<ReferralRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const existing = loadReferrals().find(
      (r) => r.referrerName.toLowerCase() === trimmed.toLowerCase()
    );
    const rec: ReferralRecord = existing ?? {
      code: generateReferralCode(),
      referrerName: trimmed,
      createdAt: new Date().toISOString(),
      usedCount: 0,
    };
    if (!existing) addReferral(rec);
    setReferral(rec);
    setCopied(false);
  };

  const shareLink = referral ? referralShareLink(referral.code) : '';

  const copy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cards = [
    {
      icon: <Ticket className="w-5 h-5" />,
      title: 'Get your code',
      desc: 'Enter your name below and we\u2019ll generate your personal referral code.',
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: 'Share your link',
      desc: 'Text it, post it, shout it from the van \u2014 however you share, it tracks back to you.',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: `You both save $${REFERRAL_REWARD}`,
      desc: `They get $${REFERRAL_REWARD} off their repair. You bank $${REFERRAL_REWARD} off your next one. Everybody wins.`,
    },
  ];

  return (
    <section id="referral-section" className="scroll-mt-28 bg-night-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          title={
            <>
              Give ${REFERRAL_REWARD}, Get ${REFERRAL_REWARD}.
            </>
          }
          sub={`Know someone driving around with a chipped windshield? Send them your link \u2014 they save $${REFERRAL_REWARD} on their repair, and you get $${REFERRAL_REWARD} off your next one. No limits, no fine print.`}
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-4xl mx-auto">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center mb-3">
                {c.icon}
              </div>
              <div className="text-white font-bold text-sm mb-1">{c.title}</div>
              <p className="text-slate-400 text-xs leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto mt-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 sm:p-8">
          {referral ? (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/12 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                <Check className="w-3.5 h-3.5" />
                You&apos;re in, {referral.referrerName}
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">
                  Your referral code
                </div>
                <div className="font-mono text-3xl font-black tracking-widest text-white">
                  {referral.code}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 min-w-0 px-3 py-2.5 text-xs font-mono bg-night-950/80 border border-white/10 rounded-xl text-slate-300 focus:outline-none"
                />
                <button
                  onClick={copy}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <button
                onClick={async () => {
                  if (!shareLink) return;
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: 'Chip Zorro \u2014 $10 off windshield chip repair',
                        text: 'Get $10 off your windshield chip repair with my link:',
                        url: shareLink,
                      });
                    } catch {
                      /* dismissed */
                    }
                  } else {
                    copy();
                  }
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share My Link
              </button>
              {referral.usedCount > 0 && (
                <p className="text-xs text-emerald-300">
                  {referral.usedCount} friend{referral.usedCount === 1 ? '' : 's'} booked
                  with your code \u2014 ${referral.usedCount * REFERRAL_REWARD} in
                  rewards banked!
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') generate();
                }}
                placeholder="e.g. Maria Gonzalez"
                className="w-full px-4 py-3 text-sm bg-night-950/80 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/50 transition-all"
              />
              <button
                onClick={generate}
                disabled={!name.trim()}
                className="w-full py-3.5 text-center text-xs font-extrabold uppercase tracking-[0.12em] text-white rounded-2xl cursor-pointer transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(180deg, #34d399 0%, #10b981 55%, #059669 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px -8px rgba(16,185,129,0.6)',
                  textShadow: '0 1px 2px rgba(0,60,30,0.4)',
                }}
              >
                Generate My Referral Link
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                Your code is saved on this device \u2014 come back anytime to copy it again.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
