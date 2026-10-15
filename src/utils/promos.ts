// Referral program + gift card utilities (browser-local storage).

export interface ReferralRecord {
  code: string;
  referrerName: string;
  createdAt: string;
  usedCount: number;
}

export interface GiftCardRecord {
  code: string;
  amount: number;
  buyerName: string;
  recipientName: string;
  createdAt: string;
  redeemed: boolean;
  redeemedAt?: string;
  redeemedOrderNumber?: string;
}

export const REFERRAL_REWARD = 10;
export const GIFT_AMOUNTS = [25, 50, 99];

const REFERRAL_KEY = 'chipzorro_referrals';
const GIFT_KEY = 'chipzorro_giftcards';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode(prefix: string): string {
  let s = '';
  for (let i = 0; i < 6; i++) {
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `${prefix}-${s}`;
}

// ---------------- Referrals ----------------

export function generateReferralCode(): string {
  return randomCode('CZ');
}

export function isValidReferralCode(code: string): boolean {
  return /^CZ-[A-HJ-NP-Z2-9]{6}$/i.test(code.trim());
}

export function loadReferrals(): ReferralRecord[] {
  try {
    const raw = localStorage.getItem(REFERRAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReferrals(list: ReferralRecord[]) {
  try {
    localStorage.setItem(REFERRAL_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export function addReferral(rec: ReferralRecord) {
  const list = loadReferrals();
  if (!list.some((r) => r.code.toUpperCase() === rec.code.toUpperCase())) {
    saveReferrals([rec, ...list]);
  }
}

export function findReferral(code: string): ReferralRecord | undefined {
  const t = code.trim().toUpperCase();
  return loadReferrals().find((r) => r.code.toUpperCase() === t);
}

export function incrementReferralUse(code: string) {
  const t = code.trim().toUpperCase();
  saveReferrals(
    loadReferrals().map((r) =>
      r.code.toUpperCase() === t ? { ...r, usedCount: r.usedCount + 1 } : r
    )
  );
}

export function deleteReferral(code: string) {
  const t = code.trim().toUpperCase();
  try {
    const filtered = loadReferrals().filter((r) => r.code.toUpperCase() !== t);
    localStorage.setItem(REFERRAL_KEY, JSON.stringify(filtered));
  } catch {
    /* storage unavailable */
  }
}

export function referralShareLink(code: string): string {
  return `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(code)}#booking`;
}

// ---------------- Gift cards ----------------

export function generateGiftCode(): string {
  return randomCode('GIFT');
}

export function isValidGiftCode(code: string): boolean {
  return /^GIFT-[A-HJ-NP-Z2-9]{6}$/i.test(code.trim());
}

export function loadGiftCards(): GiftCardRecord[] {
  try {
    const raw = localStorage.getItem(GIFT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGiftCards(list: GiftCardRecord[]) {
  try {
    localStorage.setItem(GIFT_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export function addGiftCard(rec: GiftCardRecord) {
  const list = loadGiftCards();
  if (!list.some((g) => g.code.toUpperCase() === rec.code.toUpperCase())) {
    saveGiftCards([rec, ...list]);
  }
}

export function findGiftCard(code: string): GiftCardRecord | undefined {
  const t = code.trim().toUpperCase();
  return loadGiftCards().find((g) => g.code.toUpperCase() === t);
}

export function redeemGiftCard(code: string, orderNumber: string) {
  const t = code.trim().toUpperCase();
  saveGiftCards(
    loadGiftCards().map((g) =>
      g.code.toUpperCase() === t
        ? { ...g, redeemed: true, redeemedAt: new Date().toISOString(), redeemedOrderNumber: orderNumber }
        : g
    )
  );
}

export function deleteGiftCard(code: string) {
  const t = code.trim().toUpperCase();
  try {
    const filtered = loadGiftCards().filter((g) => g.code.toUpperCase() !== t);
    localStorage.setItem(GIFT_KEY, JSON.stringify(filtered));
  } catch {
    /* storage unavailable */
  }
}
