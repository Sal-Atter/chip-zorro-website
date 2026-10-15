import React, { useState } from 'react';
import { 
  Mail, 
  Check, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Copy, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { BookingAppointment, MobileTechnician } from '../types';
import logoImg from '../assets/images/chip_zorro_logo.png';

interface EmailConfirmationModalProps {
  booking: BookingAppointment | null;
  technician?: MobileTechnician;
  onClose: () => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  booking,
  technician,
  onClose,
}) => {
  if (!booking) return null;

  const [activeTemplate, setActiveTemplate] = useState<'confirmation' | 'en_route' | 'receipt'>('confirmation');
  const [testEmailAddress, setTestEmailAddress] = useState(booking.customerEmail || 'salar14666@gmail.com');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSendTestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 5000);
    }, 700);
  };

  const handleCopyText = () => {
    const emailBody = `CHIP ZORRO WINDSHIELD REPAIR - CONFIRMATION
Work Order: ${booking.orderNumber}
Customer: ${booking.customerName}
Vehicle: ${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}
Date: ${booking.appointmentDate}
Time Window: ${booking.timeSlot}
Location: ${booking.address}, ${booking.city}, ${booking.state}
Service: Precision Windshield Chip Repair (${booking.chipCount} chip${booking.chipCount > 1 ? 's' : ''})
Factory Seal: 100% PRESERVED (No Replacement)
Billing: ${booking.paymentMethod === 'insurance' ? `${booking.insuranceCarrier} ($0 Deductible Direct Claim)` : `$${booking.estimatedCost} Self-Pay`}`;

    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 my-auto">
        {/* Top Control Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-1 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
              <img
                src={logoImg}
                alt="Chip Zorro"
                referrerPolicy="no-referrer"
                className="h-8 w-auto object-contain block"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Automated Customer Email Preview
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Order {booking.orderNumber} · Chip Zorro Notification Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Template Selector Segmented Tabs */}
        <div className="px-6 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium mr-2">Email State:</span>
            <button
              onClick={() => setActiveTemplate('confirmation')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTemplate === 'confirmation'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Booking Confirmation
            </button>
            <button
              onClick={() => setActiveTemplate('en_route')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTemplate === 'en_route'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Zorro Van En Route
            </button>
            <button
              onClick={() => setActiveTemplate('receipt')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTemplate === 'receipt'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Lifetime Warranty Certificate
            </button>
          </div>
        </div>

        {/* Simulated Email Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50">
          {/* Header Metadata */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600 font-sans shadow-2xs">
            <div className="flex">
              <span className="w-20 text-slate-400 font-medium">From:</span>
              <span className="text-slate-900 font-semibold">Chip Zorro Dispatch &lt;appointments@chipzorro.com&gt;</span>
            </div>
            <div className="flex">
              <span className="w-20 text-slate-400 font-medium">To:</span>
              <span className="text-slate-900">{booking.customerName} &lt;{booking.customerEmail}&gt;</span>
            </div>
            <div className="flex">
              <span className="w-20 text-slate-400 font-medium">Subject:</span>
              <span className="text-slate-900 font-bold">
                {activeTemplate === 'confirmation' && `Confirmed: Chip Zorro Mobile Repair for ${booking.vehicle.year} ${booking.vehicle.make} [WO #${booking.orderNumber}]`}
                {activeTemplate === 'en_route' && `Zorro Van En Route: Arriving in ~15 minutes [WO #${booking.orderNumber}]`}
                {activeTemplate === 'receipt' && `Chip Repaired! Lifetime No-Spread Warranty [WO #${booking.orderNumber}]`}
              </span>
            </div>
          </div>

          {/* HTML Email Canvas */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6 text-slate-800 text-sm">
            {/* Branded Email Header with Logo */}
            <div className="border-b border-slate-200 pb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="Chip Zorro Logo"
                    referrerPolicy="no-referrer"
                    className="h-12 w-auto object-contain block"
                  />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">
                    Chip <span className="text-orange-600">Zorro</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Windshield Chip Repair · 100% Factory Seal Preservation
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                  WO #{booking.orderNumber}
                </div>
              </div>
            </div>

            {/* Template 1: Confirmation */}
            {activeTemplate === 'confirmation' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Hello {booking.customerName}, your chip repair appointment is confirmed!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Thank you for choosing Chip Zorro. By choosing to repair instead of replacing, you are saving hundreds of dollars and keeping your vehicle's factory robotic seal intact!
                  </p>
                </div>

                {/* Core Appointment Details */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                    Repair Order Summary
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Appointment Date & Window</span>
                      <strong className="text-slate-900">{booking.appointmentDate} · {booking.timeSlot}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Mobile Location</span>
                      <strong className="text-slate-900">{booking.address}, {booking.city}, {booking.state} {booking.zipCode}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Vehicle</span>
                      <strong className="text-slate-900">{booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Service & Scope</span>
                      <strong className="text-emerald-700">
                        {booking.chipCount} × Windshield Chip Repair (100% Factory Seal Intact)
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Billing Channel</span>
                      <strong className="text-slate-900">
                        {booking.paymentMethod === 'insurance' 
                          ? `${booking.insuranceCarrier} ($0 Deductible Direct Claim)`
                          : `$${booking.estimatedCost.toFixed(2)} Self-Pay upon completion`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Electronic Claim Ref</span>
                      <span className="font-mono text-orange-700 font-semibold">{booking.omegaEdiClaimId || 'N/A Self-Pay'}</span>
                    </div>
                  </div>
                </div>

                {/* Pre-Arrival Preparation Tips for Chip Repair */}
                <div className="space-y-2">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                    Pre-Arrival Windshield Preparation
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Keep the Glass Dry:</strong> Please avoid running through a car wash or spraying window cleaner on the chip before our tech arrives.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Avoid Defroster Heat Shock:</strong> Extreme temperature sudden changes can cause cracks to run; keep heater/AC at mild temperatures.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Drive Away Instantly:</strong> Our high-vacuum optical polymer cures in under 25 minutes. You can drive immediately after service!</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Template 2: En Route Alert */}
            {activeTemplate === 'en_route' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Chip Zorro Mobile Unit is En Route!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Your technician Marcus "Zorro" Vance is heading to {booking.address}, {booking.city}. Estimated arrival is in ~15 minutes.
                  </p>
                </div>

                <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Truck className="w-8 h-8 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Zorro Mobile Unit 01 · Marcus Vance</div>
                      <div className="text-slate-600">Direct mobile contact: (555) 794-2447</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  The technician will pull up to your driveway or parking space, inspect the chip under optical magnification, and begin resin injection.
                </p>
              </div>
            )}

            {/* Template 3: Lifetime Warranty */}
            {activeTemplate === 'receipt' && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Lifetime No-Spread Warranty Certificate
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Your rock chip repair has been completed and sealed against future spreading.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Nationwide Lifetime Warranty Enclosed</span>
                  </div>
                  <p className="text-slate-600">
                    Chip Zorro guarantees that this repaired rock chip will never crack or spread from the point of repair for the lifetime of your ownership of this vehicle.
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between text-xs">
                  <span className="text-slate-500">Direct Insurance Billing:</span>
                  <span className="font-bold text-emerald-700">Claim Processed & $0 Deductible Approved</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div>Chip Zorro Windshield Repair · (800) 555-2447 · dispatch@chipzorro.com</div>
              <div>Need to reschedule? Call our mobile dispatch desk or reply directly to this message.</div>
            </div>
          </div>

          {/* Test Email Dispatch Sandbox */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Send Test Email to Inbox</span>
              <span className="text-[11px] text-slate-500">Simulate real transactional delivery</span>
            </div>

            <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="Enter recipient email..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-pulse' : ''}`} />
                <span>{isSending ? 'Sending...' : 'Send Test Email'}</span>
              </button>
            </form>

            {sendSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Confirmation email simulated delivery to {testEmailAddress} successful!</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
