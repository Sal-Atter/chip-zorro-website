import React, { useState } from 'react';
import {
  CheckCircle2,
  Send,
  ShieldCheck,
  Check,
  FileText,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { EdiClaimRecord, BookingAppointment } from '../types';

interface OmegaEdiHubProps {
  claims: EdiClaimRecord[];
  onTransmitClaim: (claimId: string) => void;
  bookings: BookingAppointment[];
  onSyncBookingToEdi: (booking: BookingAppointment) => void;
}

const displayStatus = (status: string) => {
  if (status === 'Queued') return 'In progress';
  return status;
};

const isApproved = (status: string) => status !== 'Queued';

export const OmegaEdiHub: React.FC<OmegaEdiHubProps> = ({
  claims,
  onTransmitClaim,
}) => {
  const [selectedClaim, setSelectedClaim] = useState<EdiClaimRecord | null>(claims[0] || null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'approved' | 'queued'>('all');

  const filteredClaims = claims.filter((c) => {
    if (activeFilter === 'approved') return isApproved(c.status);
    if (activeFilter === 'queued') return !isApproved(c.status);
    return true;
  });

  const approvedCount = claims.filter((c) => isApproved(c.status)).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>Insurance Claims Desk</span>
            <span aria-hidden="true">·</span>
            <span>$0 Deductible Direct Billing</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-950 tracking-tight text-balance">
            We handle all the insurance paperwork for you.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            When your repair is covered, our team files the claim with your carrier's auto glass
            program and handles every form and follow-up — you pay $0 out of pocket. No claim
            numbers to chase, no phone calls, no surprises.
          </p>
        </div>

        {/* How $0 billing works */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 shrink-0 w-full lg:max-w-xs">
          <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            How $0 billing works
          </div>
          <div className="space-y-2.5 text-xs">
            {[
              { icon: BadgeCheck, title: 'We verify your coverage', desc: 'Before the appointment, we confirm your comprehensive coverage includes glass repair.' },
              { icon: FileText, title: 'We file the claim', desc: 'Our desk submits everything to your carrier\u2019s auto glass program under standard billing codes.' },
              { icon: CheckCircle2, title: 'You pay $0', desc: 'Deductible waived. We handle any follow-up or questions from the carrier.' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700 shrink-0">
                  <s.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{s.title}</div>
                  <div className="text-slate-500 leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 value pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="text-xs font-mono font-bold text-orange-700">01. WAIVER APPLIED</div>
          <h3 className="text-base font-bold text-slate-900">Automatic $0 deductible</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Major auto insurers waive comprehensive deductibles for rock chip repairs — it saves
            them the $1,000+ cost of a replacement windshield. We apply the waiver on your behalf.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="text-xs font-mono font-bold text-orange-700">02. STANDARD CODES</div>
          <h3 className="text-base font-bold text-slate-900">Correct billing, first time</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We file under standard auto glass billing codes (WSR-1 for the primary chip, WSR-2 for
            additional chips) so claims clear without back-and-forth.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="text-xs font-mono font-bold text-orange-700">03. TRACKED TO APPROVAL</div>
          <h3 className="text-base font-bold text-slate-900">Filed &amp; followed up</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every claim is tracked from filing to approval, and you get written confirmation for
            your records. If the carrier has questions, we answer them — not you.
          </p>
        </div>
      </div>

      {/* Claims table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent $0-deductible claims
            </h3>
            <p className="text-xs text-slate-500">
              A sample of recent insurance claims our team has filed and tracked for customers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Show:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              {(
                [
                  { id: 'all', label: `All (${claims.length})` },
                  { id: 'approved', label: `Approved (${approvedCount})` },
                  { id: 'queued', label: `In progress (${claims.length - approvedCount})` },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-white shadow-xs text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order / Claim #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Insurance Carrier</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.map((claim) => {
                const isSelected = selectedClaim?.id === claim.id;
                const approved = isApproved(claim.status);

                return (
                  <tr
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-orange-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      <div>{claim.workOrderNumber}</div>
                      <div className="text-[10px] text-slate-400">{claim.claimControlNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{claim.insuredName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">VIN: {claim.vehicleVin}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{claim.carrierName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Pol: {claim.policyNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-bold">
                        {claim.ediServiceCode}
                      </span>
                      <div className="text-[11px] text-slate-500 max-w-xs truncate">
                        {claim.damageDescription}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-extrabold text-slate-900">${claim.netBilledAmount.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">$0 deductible</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {approved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{displayStatus(claim.status)}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{displayStatus(claim.status)}</span>
                        </span>
                      )}
                      {claim.responseAuthCode && (
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Ref: {claim.responseAuthCode}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!approved && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTransmitClaim(claim.id);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>File claim</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected claim detail */}
      {selectedClaim && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-600/20 text-orange-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Claim detail: {selectedClaim.workOrderNumber}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedClaim.carrierName} · {selectedClaim.insuredName} · Filed by the Chip Zorro claims desk
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                isApproved(selectedClaim.status)
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isApproved(selectedClaim.status) ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              <span>{displayStatus(selectedClaim.status)}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 font-mono text-[10px]">CUSTOMER PAID</div>
              <div className="font-extrabold text-emerald-400 text-sm">$0.00</div>
              <div className="text-slate-400 text-[11px]">Deductible waived</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 font-mono text-[10px]">BILLED TO CARRIER</div>
              <div className="font-extrabold text-white text-sm">${selectedClaim.netBilledAmount.toFixed(2)}</div>
              <div className="text-slate-400 text-[11px]">Code {selectedClaim.ediServiceCode}</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 font-mono text-[10px]">SERVICE</div>
              <div className="font-bold text-white text-sm">Rock chip repair</div>
              <div className="text-slate-400 text-[11px] truncate">{selectedClaim.damageDescription}</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 font-mono text-[10px]">FILED</div>
              <div className="font-bold text-white text-sm">{selectedClaim.submissionDate}</div>
              <div className="text-slate-400 text-[11px]">
                {selectedClaim.responseAuthCode ? `Ref ${selectedClaim.responseAuthCode}` : 'Awaiting carrier response'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
