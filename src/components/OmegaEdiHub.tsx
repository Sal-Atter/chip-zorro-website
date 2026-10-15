import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  FileCode, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Check,
  Cpu,
  Lock,
  Server
} from 'lucide-react';
import { EdiClaimRecord, BookingAppointment } from '../types';
import { generateEdiPayload } from '../data/mockData';
import logoImg from '../assets/images/chip_zorro_logo.png';

interface OmegaEdiHubProps {
  claims: EdiClaimRecord[];
  onTransmitClaim: (claimId: string) => void;
  bookings: BookingAppointment[];
  onSyncBookingToEdi: (booking: BookingAppointment) => void;
}

export const OmegaEdiHub: React.FC<OmegaEdiHubProps> = ({
  claims,
  onTransmitClaim,
  bookings,
  onSyncBookingToEdi,
}) => {
  const [selectedClaim, setSelectedClaim] = useState<EdiClaimRecord | null>(claims[0] || null);
  const [isPingingApi, setIsPingingApi] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);
  const [showRawPayloadModal, setShowRawPayloadModal] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<'all' | 'lynx' | 'safelite'>('all');

  const handleTestConnection = () => {
    setIsPingingApi(true);
    setPingSuccess(null);
    setTimeout(() => {
      setIsPingingApi(false);
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(null), 4000);
    }, 600);
  };

  const handleDownloadEdiFile = (claim: EdiClaimRecord) => {
    const payload = claim.ediPayloadSnippet || 'ISA*00*...';
    const blob = new Blob([payload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${claim.workOrderNumber}_EDI_837_CHIP_CLAIM.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredClaims = claims.filter((c) => {
    if (activeNetwork === 'lynx') return c.networkGateway.includes('Lynx');
    if (activeNetwork === 'safelite') return c.networkGateway.includes('Safelite');
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <Cpu className="w-4 h-4 text-orange-600" />
            <span>Automated Clearinghouse EDI API Gateway</span>
            <span aria-hidden="true">·</span>
            <span>$0 Deductible Direct Billing</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Direct Insurance Electronic Claims Gateway
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Automated cloud API bridge that formats windshield rock chip repairs directly into ANSI X12 837 electronic claims (WSR-1/WSR-2 codes). Synchronizes directly with Lynx Services and Safelite SGC clearinghouse networks so customers pay $0 out of pocket.
          </p>
        </div>

        {/* Live EDI API Connection Status */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">Clearinghouse API Connected</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Provider ID: CZ-9481</span>
          </div>
          <div className="text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <Server className="w-3 h-3 text-slate-400" />
              <span>API Gateway: https://www.omegaedi.com/api/v1</span>
            </div>
            <div>Auth Status: <span className="text-emerald-700 font-semibold">TLS 1.3 Certified</span></div>
          </div>
          <div className="pt-1">
            <button
              onClick={handleTestConnection}
              disabled={isPingingApi}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPingingApi ? 'animate-spin' : ''}`} />
              <span>{isPingingApi ? 'Verifying Handshake...' : 'Ping Clearinghouse API'}</span>
            </button>
            {pingSuccess && (
              <div className="mt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Handshake Successful · 200 OK (28ms)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Value Pillars of Direct Electronic Insurance Billing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="text-xs font-mono font-bold text-orange-700">01. WAIVER RULE</div>
          <h3 className="text-base font-bold text-slate-900">Automatic $0 Deductible</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our API applies standard carrier repair waiver rules: major auto insurers waive comprehensive deductibles for rock chip repairs to avoid paying $1,000+ for replacement windshields.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="text-xs font-mono font-bold text-orange-700">02. STANDARD CODES</div>
          <h3 className="text-base font-bold text-slate-900">NAGS & WSR-1 / WSR-2 Codes</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transmits National Auto Glass Specifications standard codes for primary rock chip (WSR-1: $79.00) and secondary chip additions (WSR-2: $25.00) directly to clearinghouse adjudicators.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="text-xs font-mono font-bold text-orange-700">03. DIRECT AUDITING</div>
          <h3 className="text-base font-bold text-slate-900">Instant 835 Remittance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Receives 997 functional acknowledgments and 835 electronic remittance advices in under 60 seconds with digital authorization signatures.
          </p>
        </div>
      </div>

      {/* Main Claim Management Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Electronic Claims Adjudication Log
            </h3>
            <p className="text-xs text-slate-500">
              Live claims transmitted or pending authorization through the direct insurance clearinghouse API
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Gateway:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setActiveNetwork('all')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                  activeNetwork === 'all'
                    ? 'bg-white shadow-xs text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({claims.length})
              </button>
              <button
                onClick={() => setActiveNetwork('lynx')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                  activeNetwork === 'lynx'
                    ? 'bg-white shadow-xs text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lynx Services
              </button>
              <button
                onClick={() => setActiveNetwork('safelite')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                  activeNetwork === 'safelite'
                    ? 'bg-white shadow-xs text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Safelite Solutions
              </button>
            </div>
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order / Claim #</th>
                <th className="py-3 px-4">Insured Customer</th>
                <th className="py-3 px-4">Insurance Carrier</th>
                <th className="py-3 px-4">Service & Code</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.map((claim) => {
                const isSelected = selectedClaim?.id === claim.id;

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
                      <div className="text-[10px] text-orange-600">{claim.networkGateway}</div>
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
                      <div className="text-[10px] text-emerald-600 font-semibold">$0 Deductible</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {claim.status === 'Queued' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Queued for API</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{claim.status}</span>
                        </span>
                      )}
                      {claim.responseAuthCode && (
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Auth: {claim.responseAuthCode}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {claim.status === 'Queued' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTransmitClaim(claim.id);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Transmit API</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadEdiFile(claim);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>837 TXT</span>
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

      {/* Selected Claim Deep Inspection Panel */}
      {selectedClaim && (
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-600/20 text-orange-400">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">
                    EDI-837 Transaction Inspector: {selectedClaim.workOrderNumber}
                  </h4>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-orange-300">
                    Control: {selectedClaim.claimControlNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Carrier: {selectedClaim.carrierName} ({selectedClaim.networkGateway}) · Insured: {selectedClaim.insuredName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRawPayloadModal(true)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Inspect Raw EDI Segments
              </button>
              <button
                onClick={() => handleDownloadEdiFile(selectedClaim)}
                className="px-3 py-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export 837 Claim</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 font-mono text-[10px]">CLAIM STATUS</div>
              <div className="font-extrabold text-white text-sm">{selectedClaim.status}</div>
              <div className="text-emerald-400 text-[11px] font-mono">
                {selectedClaim.responseAuthCode || 'Pending Gateway Dispatch'}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 font-mono text-[10px]">TOTAL BILLED AMOUNT</div>
              <div className="font-extrabold text-white text-sm">${selectedClaim.netBilledAmount.toFixed(2)}</div>
              <div className="text-slate-400 text-[11px]">Deductible: $0.00 (Waived)</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 font-mono text-[10px]">NAGS PROCEDURE</div>
              <div className="font-bold text-white text-sm">{selectedClaim.ediServiceCode}</div>
              <div className="text-slate-400 text-[11px] truncate">{selectedClaim.damageDescription}</div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 font-mono text-[10px]">SUBMISSION TIMESTAMP</div>
              <div className="font-bold text-white text-sm">{selectedClaim.submissionDate}</div>
              <div className="text-orange-400 text-[11px]">API Clearinghouse Gateway</div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">ANSI X12 837 Auto Glass Electronic Payload</span>
              <span className="text-[11px] text-emerald-400">Syntax Verified · HIPAA/EDI Spec Compliant</span>
            </div>
            <pre className="p-4 bg-slate-950 rounded-lg font-mono text-[11px] text-emerald-300/90 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-48">
              {selectedClaim.ediPayloadSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* Raw Payload Modal */}
      {showRawPayloadModal && selectedClaim && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 text-white space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-base">Raw ANSI X12 837 Payload</h4>
                <p className="text-xs text-slate-400">
                  Work Order: {selectedClaim.workOrderNumber} · Control #: {selectedClaim.claimControlNumber}
                </p>
              </div>
              <button
                onClick={() => setShowRawPayloadModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedClaim.ediPayloadSnippet}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Clearinghouse Specification for Lynx Services & Safelite SGC Network
              </div>
              <button
                onClick={() => handleDownloadEdiFile(selectedClaim)}
                className="px-4 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-500 rounded-lg text-white cursor-pointer"
              >
                Download .TXT File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
