import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Wrench, 
  Search, 
  CheckCircle2, 
  Navigation, 
  UserCheck, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { MobileTechnician, BookingAppointment } from '../types';
import logoImg from '../assets/images/chip_zorro_logo.png';

interface MobileDispatchTrackerProps {
  technicians: MobileTechnician[];
  bookings: BookingAppointment[];
  onSelectBooking: (booking: BookingAppointment) => void;
  onUpdateBookingStatus: (bookingId: string, status: BookingAppointment['status']) => void;
  onOpenEmailModal: (booking: BookingAppointment) => void;
}

export const MobileDispatchTracker: React.FC<MobileDispatchTrackerProps> = ({
  technicians,
  bookings,
  onSelectBooking,
  onUpdateBookingStatus,
  onOpenEmailModal,
}) => {
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings.length > 0 ? bookings[0].id : ''
  );

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];
  const assignedTech = technicians.find((t) => t.id === activeBooking?.technicianId) || technicians[0];

  const filteredBookings = bookings.filter((b) =>
    searchOrderNumber
      ? b.orderNumber.toLowerCase().includes(searchOrderNumber.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchOrderNumber.toLowerCase())
      : true
  );

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

  const currentStepIndex = activeBooking ? getStatusStepIndex(activeBooking.status) : 1;

  return (
    <div className="space-y-10">
      {/* Header Info */}
      <div className="max-w-3xl space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-orange-700">
          Mobile Repair Fleet Logistics
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Chip Zorro Mobile Technician Scheduling & Live Dispatch
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Track our self-contained mobile repair units. Each Zorro mobile van is equipped with high-vacuum injector bridges, moisture extractors, optical resins, and UV curing arrays to fix chips right in your driveway.
        </p>
      </div>

      {/* Active Work Order Tracker Card */}
      {activeBooking && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-orange-400">
                <div className="bg-white rounded p-0.5 shrink-0 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="Chip Zorro"
                    referrerPolicy="no-referrer"
                    className="h-4.5 w-auto object-contain block"
                  />
                </div>
                <span>Active Work Order</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{activeBooking.orderNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Mobile Chip Repair</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {activeBooking.vehicle.year} {activeBooking.vehicle.make} {activeBooking.vehicle.model}
              </h3>
              <p className="text-xs text-slate-300">
                Customer: {activeBooking.customerName} · {activeBooking.address}, {activeBooking.city}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEmailModal(activeBooking)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                View Email Confirmation
              </button>
            </div>
          </div>

          {/* Timeline Stages for Rapid 20-Min Chip Repair */}
          <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50/50">
            <div className="text-xs font-semibold text-slate-700 mb-4">
              Real-Time Technician Dispatch & Repair Progress
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { step: 1, key: 'confirmed', label: '1. Confirmed', desc: 'Resin & Bridge Prepped' },
                { step: 2, key: 'dispatched', label: '2. Dispatched', desc: 'Zorro Van Assigned' },
                { step: 3, key: 'en_route', label: '3. En Route', desc: 'ETA ~15-20 min' },
                { step: 4, key: 'in_progress', label: '4. Vacuum & Inject', desc: 'Resin UV Curing' },
                { step: 5, key: 'completed', label: '5. Polished & Done', desc: 'Drive Instantly!' },
              ].map((s) => {
                const isPassed = currentStepIndex >= s.step;
                const isCurrent = currentStepIndex === s.step;

                return (
                  <button
                    key={s.step}
                    onClick={() => onUpdateBookingStatus(activeBooking.id, s.key as BookingAppointment['status'])}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-600/20'
                        : isPassed
                        ? 'border-emerald-300 bg-emerald-50/40 text-slate-800'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold">
                        {s.label}
                      </span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[10px] text-slate-500">{s.desc}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 italic">
              Click any stage above to simulate live technician status updates.
            </div>
          </div>

          {/* Technician & Work Order Details */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Assigned Mobile Technician */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                Assigned Chip Zorro Technician
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-4">
                <img
                  src={assignedTech.photoUrl}
                  alt={assignedTech.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{assignedTech.name}</span>
                    <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {assignedTech.vanNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">{assignedTech.title}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{assignedTech.phone}</span>
                  </div>
                  <div className="pt-1 flex flex-wrap gap-1 text-[10px] text-slate-600">
                    {assignedTech.certifications.map((c, i) => (
                      <span key={i} className="bg-white border border-slate-200 rounded px-1.5 py-0.5">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>GPS Service Sector: <strong className="text-slate-800">{assignedTech.currentLocationName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Scheduled Arrival Window: <strong className="text-slate-800">{activeBooking.timeSlot}</strong></span>
                </div>
              </div>
            </div>

            {/* Repair Order Specifications */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                Repair Specifications & Insurance
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Service Scope:</span>
                  <span className="font-semibold text-emerald-700 uppercase">
                    100% Windshield Repair (Factory Seal Kept)
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Damage Classification:</span>
                  <span className="font-medium text-slate-900 capitalize">
                    {activeBooking.damageType.replace(/_/g, ' ')} ({activeBooking.chipCount} chip{activeBooking.chipCount > 1 ? 's' : ''})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Windshield Location:</span>
                  <span className="font-medium text-slate-900">
                    {activeBooking.vehicle.glassLocation || 'Driver Line of Sight'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Insurance Billing:</span>
                  <span className="font-medium text-slate-900">
                    {activeBooking.paymentMethod === 'insurance' 
                      ? `${activeBooking.insuranceCarrier} ($0 Deductible Waived)`
                      : 'Customer Self-Pay Flat Rate'}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Total Billed Amount:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ${activeBooking.estimatedCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {activeBooking.notes && (
                <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-lg text-xs text-orange-950">
                  <span className="font-semibold">Access Note: </span>
                  {activeBooking.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fleet Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Chip Zorro Fleet On Duty</h3>
            <p className="text-xs text-slate-500">Mobile units equipped specifically for rapid on-site rock chip injection</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={tech.photoUrl}
                  alt={tech.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900">{tech.name}</div>
                  <div className="text-xs text-orange-700 font-medium">{tech.vanNumber}</div>
                  <div className="text-xs font-semibold text-emerald-700">Rating: {tech.rating} / 5.0</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{tech.currentLocationName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Chips Saved Today: <strong className="tabular-nums">{tech.completedJobsToday}</strong></span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Status:</span>
                <span className="font-medium text-orange-700 capitalize">
                  {tech.activeStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Orders Queue */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Scheduled Chip Repairs</h3>
            <p className="text-xs text-slate-500">Select any appointment to view dispatch progress or email confirmation</p>
          </div>

          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              placeholder="Search by order or name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBookingId(b.id)}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                selectedBookingId === b.id ? 'bg-orange-50/50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{b.orderNumber}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-semibold text-slate-700">{b.customerName}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">{b.vehicle.year} {b.vehicle.make} {b.vehicle.model}</span>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span>{b.appointmentDate}</span>
                  <span>({b.timeSlot})</span>
                  <span className="hidden xs:inline">·</span>
                  <span className="truncate">{b.address}, {b.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-orange-800 bg-orange-50 px-2.5 py-1 rounded border border-orange-200 capitalize">
                  {b.status.replace('_', ' ')}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEmailModal(b);
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 underline font-medium cursor-pointer"
                >
                  Email Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
