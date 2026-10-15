import React, { useState } from 'react';
import { Gift, Copy, Check, Share2 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import {
  GIFT_AMOUNTS,
  GiftCardRecord,
  generateGiftCode,
  addGiftCard,
} from '../utils/promos';

export const GiftCards: React.FC = () => {
  const [amount, setAmount] = useState(99);
  const [buyerName, setBuyerName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [card, setCard] = useState<GiftCardRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const create = () => {
    if (!buyerName.trim() || !recipientName.trim()) return;
    const rec: GiftCardRecord = {
      code: generateGiftCode(),
      amount,
      buyerName: buyerName.trim(),
      recipientName: recipientName.trim(),
      createdAt: new Date().toISOString(),
      redeemed: false,
    };
    addGiftCard(rec);
    setCard(rec);
    setCopied(false);
  };

  const copyText = async () => {
    if (!card) return;
    const text = `Chip Zorro Gift Card \u2014 $${card.amount} for ${card.recipientName}. Redeem with code ${card.code} at booking.`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="gift-cards-section"
      className="scroll-mt-28 bg-night-950 py-16 md:py-24 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          title={<>Give the gift of a clear windshield.</>}
          sub="A Chip Zorro gift card covers a full chip repair or part of one. They book like normal and enter the code at checkout \u2014 the amount comes straight off."
          align="center"
        />

        <div className="max-w-xl mx-auto mt-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 sm:p-8">
          {card ? (
            <div className="space-y-5 text-center">
              <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-amber-600/5 p-6">
                <Gift className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                <div className="text-[11px] uppercase tracking-widest text-amber-200/70">
                  Chip Zorro Gift Card
                </div>
                <div className="font-display text-4xl font-black text-white my-1">
                  ${card.amount}
                </div>
                <div className="text-xs text-slate-400">
                  For <span className="text-white font-bold">{card.recipientName}</span>
                  {' '}from {card.buyerName}
                </div>
                <div className="mt-3 font-mono text-lg font-bold tracking-widest text-amber-200">
                  {card.code}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyText}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy Gift Card'}
                </button>
                <button
                  onClick={async () => {
                    const text = `Chip Zorro Gift Card \u2014 $${card.amount} for ${card.recipientName}. Redeem with code ${card.code} at booking.`;
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: 'Chip Zorro Gift Card',
                          text,
                        });
                      } catch {
                        /* dismissed */
                      }
                    } else {
                      copyText();
                    }
                  }}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
              <button
                onClick={() => {
                  setCard(null);
                  setBuyerName('');
                  setRecipientName('');
                }}
                className="text-xs text-slate-500 hover:text-slate-300 underline cursor-pointer"
              >
                Create another gift card
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Choose amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GIFT_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`py-3 rounded-2xl border text-sm font-bold transition-all cursor-pointer ${
                        amount === a
                          ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25'
                      }`}
                    >
                      ${a}
                      {a === 99 && (
                        <span className="block text-[10px] font-medium text-slate-500 mt-0.5">
                          Full repair
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    From
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 text-sm bg-night-950/80 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    For
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient's name"
                    className="w-full px-4 py-3 text-sm bg-night-950/80 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={create}
                disabled={!buyerName.trim() || !recipientName.trim()}
                className="w-full py-3.5 text-center text-xs font-extrabold uppercase tracking-[0.12em] text-white rounded-2xl cursor-pointer transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 55%, #d97706 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px -8px rgba(245,158,11,0.6)',
                  textShadow: '0 1px 2px rgba(120,50,0,0.4)',
                }}
              >
                <Gift className="w-4 h-4" />
                Create ${amount} Gift Card
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                Codes are saved on this device \u2014 the recipient enters the code at
                checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
