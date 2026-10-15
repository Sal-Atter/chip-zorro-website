import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Calendar,
  Navigation,
  PackageSearch,
} from 'lucide-react';
import { MobileTechnician, BookingAppointment } from '../types';
import logoImg from '../assets/images/chip_zorro_logo.png';

interface TrackMyRepairProps {
  bookings: BookingAppointment[];
  technicians: MobileTechnician[];
  /** When set (e.g. right after booking), show this order immediately. */
  initialBookingId?: string | null;
}

const STAGES = [
  { step: 1, key: 'confirmed', label: 'Confirmed', desc: 'Resin & bridge prepped' },
  { step: 2, key: 'dispatched', label: 'Dispatched', desc: 'Zorro van assigned' },
  { step: 3, key: 'en_route', label: 'En Route', desc: 'ETA ~15–20 min' },
  { step: 4, key: 'in_progress', label: 'Repairing', desc: 'Vacuum, inject & UV cure' },
  { step: 5, key: 'completed', label: 'Done', desc: 'Polished — drive instantly' },
] as const;

const getStatusStepIndex = (status: BookingAppointment['status']) => {
  switch (status) {
    case 'confirmed': return 1;
    case 'dispatched': return 2;
    case 'en_route': return 3;
    case 'in_progress': return 4;
    case 'completed': return 5;
    default: return 1;
  }
};

export const TrackMyRepair: React.FC<TrackMyRepairProps> = ({
  bookings,
  technicians,
  initialBookingId,
}) => {
  const [query, setQuery] = useState('');
  const [searchedId, setSearchedId] = useState<string | null>(initialBookingId ?? null);
  const [notFound, setNotFound] = useState(false);

  // Right after a booking, jump straight to the new order.
  useEffect(() => {
    if (initialBookingId) {
      setSearchedId(initialBookingId);
      setNotFound(false);
      setQuery('');
    }
  }, [initialBookingId]);

  const booking = searchedId ? bookings.find((b) => b.id === searchedId) : undefined;
  const assignedTech = booking
    ? technicians.find((t) => t.id === booking.technicianId)
    : undefined;
  const currentStep = booking ? getStatusStepIndex(booking.status) : 1;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const found = bookings.find(
      (b) =>
        b.orderNumber.toLowerCase() === q ||
        b.orderNumber.toLowerCase().includes(q)
    );
    if (found) {
      setSearchedId(found.id);
      setNotFound(false);
    } else {
      setSearchedId(null);
      setNotFound(true);
    }
  };

  const resetLookup = () => {
    setSearchedId(null);
    setNotFound(false);
    setQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-orange-700">
          Live Repair Tracking
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track My Repair
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Enter your order number to see your repair status and your assigned
          Zorro technician in real time.
        </p>
      </div>

      {!booking && (
        <div className="max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleLookup} className="space-y-4">
            <label
              htmlFor="order-lookup"
              className="block text-sm font-bold text-slate-900"
            >
              Order number
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="order-lookup"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. WO-89231"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 transition-colors cursor-pointer whitespace-nowrap"
              >
                Track Order
              </button>
            </div>
            <p className="text-xs text-slate-500">
              You&apos;ll find your order number in your booking confirmation email.
            </p>
          </form>

          {notFound && (
            <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <PackageSearch className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-amber-900">
                  We couldn&apos;t find that order
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Double-check the order number and try again — or call us at{' '}
                  <a href="tel:8005552447" className="font-bold underline">
                    (800) 555-2447
                  </a>{' '}
                  and we&apos;ll look it up for you.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {booking && (
        <div className="space-y-6">
          {/* Order summary */}
          <div className="bg-slate-900 text-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-orange-400">
                  <img
                    src={logoImg}
                    alt="Chip Zorro"
                    referrerPolicy="no-referrer"
                    className="h-4.5 w-auto object-contain block shrink-0"
                  />
                  <span>Work Order</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{booking.orderNumber}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {booking.vehicle.year} {booking.vehicle.make}{' '}
                  {booking.vehicle.model}
                </h3>
                <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {booking.appointmentDate} · {booking.timeSlot}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {booking.address}, {booking.city}
                  </span>
                </p>
              </div>
              <button
                onClick={resetLookup}
                className="self-start md:self-center px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Track a different order
              </button>
            </div>
          </div>

          {/* Status timeline (read-only) */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="text-xs font-semibold text-slate-700 mb-4">
              Repair progress
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {STAGES.map((s) => {
                const isPassed = currentStep >= s.step;
                const isCurrent = currentStep === s.step;
                return (
                  <div
                    key={s.step}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`p-3 rounded-xl border text-left ${
                      isCurrent
                        ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-600/20'
                        : isPassed
                        ? 'border-emerald-300 bg-emerald-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[11px] font-bold ${
                          isPassed ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {s.step}. {s.label}
                      </span>
                      {isPassed && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">{s.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technician + arrival */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Your Chip Zorro Technician
              </div>
              {assignedTech ? (
                <div className="flex items-start gap-4">
                  <img
                    src={assignedTech.photoUrl}
                    alt={assignedTech.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {assignedTech.name}
                      </span>
                      <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {assignedTech.vanNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {assignedTech.title}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{assignedTech.phone}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Currently in {assignedTech.currentLocationName}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    Technician assignment pending
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Our dispatcher will confirm your technician shortly.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-4">
                Arrival Details
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>
                    Scheduled window:{' '}
                    <strong className="text-slate-800">
                      {booking.timeSlot}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>
                    Service address:{' '}
                    <strong className="text-slate-800">
                      {booking.address}, {booking.city}
                    </strong>
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                  Need to change anything? Call us at{' '}
                  <a
                    href="tel:8005552447"
                    className="font-bold text-orange-700 underline"
                  >
                    (800) 555-2447
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
