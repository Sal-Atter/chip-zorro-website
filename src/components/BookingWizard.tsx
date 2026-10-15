import React, { useState } from 'react';
import { 
  Check, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Wrench,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { BookingAppointment, DamageType, ServiceLocationType, PaymentMethodType, VehicleInfo, PricingConfig } from '../types';
import { POPULAR_VEHICLES } from '../data/mockData';
import logoImg from '../assets/images/chip_zorro_logo.png';
import { InteractiveWindshieldVisualizer } from './InteractiveWindshieldVisualizer';

interface BookingWizardProps {
  initialZip?: string;
  initialDamage?: string;
  pricingConfig?: PricingConfig;
  onBookingComplete: (newBooking: BookingAppointment) => void;
  onCancel: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialZip = '97201',
  initialDamage = 'rock_chip_bullseye',
  pricingConfig,
  onBookingComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Vehicle state
  const [year, setYear] = useState('2024');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('RAV4');
  const [bodyType, setBodyType] = useState('Compact SUV');
  const [glassLocation, setGlassLocation] = useState<VehicleInfo['glassLocation']>('Driver Line of Sight');

  // Damage & Chips
  const [damageType, setDamageType] = useState<DamageType>((initialDamage as DamageType) || 'rock_chip_bullseye');
  const [chipCount, setChipCount] = useState<number>(1);

  // Location & Scheduling
  const [locationType, setLocationType] = useState<ServiceLocationType>('mobile');
  const [address, setAddress] = useState('1428 Maple Ridge Way');
  const [city, setCity] = useState('Portland');
  const [stateCode, setStateCode] = useState('OR');
  const [zipCode, setZipCode] = useState(initialZip || '97201');
  const [parkingType, setParkingType] = useState('Private Driveway');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-13');
  const [timeSlot, setTimeSlot] = useState('08:00 AM - 11:00 AM');

  // Billing
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('insurance');
  const [insuranceCarrier, setInsuranceCarrier] = useState('State Farm');
  const [policyNumber, setPolicyNumber] = useState('SF-883019-X');
  const [deductible, setDeductible] = useState<number>(0);

  // Contact
  const [customerName, setCustomerName] = useState('Alex Morgan');
  const [customerEmail, setCustomerEmail] = useState('alex.morgan@example.com');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('Vehicle in driveway. Rock chip is about the size of a nickel.');
  const [smsOptIn, setSmsOptIn] = useState(true);

  // Cost calculation (Repair only - dynamic from live admin controls!)
  const getBaseCost = () => {
    if (pricingConfig) {
      switch (damageType) {
        case 'rock_chip_bullseye': return pricingConfig.baseBullseye;
        case 'rock_chip_starburst': return pricingConfig.baseStarburst;
        case 'combination_break': return pricingConfig.baseCombination;
        case 'crack_small': return pricingConfig.baseSmallCrack;
        default: return pricingConfig.baseBullseye;
      }
    }
    switch (damageType) {
      case 'rock_chip_bullseye': return 79;
      case 'rock_chip_starburst': return 89;
      case 'combination_break': return 89;
      case 'crack_small': return 99;
      default: return 79;
    }
  };

  const additionalRate = pricingConfig ? pricingConfig.additionalChipRate : 30;
  const additionalChipsCost = Math.max(0, chipCount - 1) * additionalRate;
  const totalCost = getBaseCost() + additionalChipsCost;

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `CZ-${Math.floor(1000 + Math.random() * 9000)}`;

    const vehicle: VehicleInfo = {
      year,
      make,
      model,
      bodyType,
      glassLocation,
    };

    const newAppointment: BookingAppointment = {
      id: `book-${Date.now()}`,
      orderNumber: orderNum,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state: stateCode,
      zipCode,
      damageType,
      chipCount,
      locationType,
      vehicle,
      appointmentDate,
      timeSlot,
      paymentMethod,
      insuranceCarrier: paymentMethod === 'insurance' ? insuranceCarrier : undefined,
      insurancePolicyNumber: paymentMethod === 'insurance' ? policyNumber : undefined,
      insuranceDeductible: paymentMethod === 'insurance' ? deductible : 0,
      estimatedCost: totalCost,
      technicianId: 'tech-1', // Default assign Marcus Zorro
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      repairMethodCode: `WSR-${chipCount} / OPTICAL-RESIN`,
      insuranceClaimStatus: paymentMethod === 'insurance' ? 'queued' : 'not_submitted',
      insuranceClaimRef: paymentMethod === 'insurance' ? `CLM-${orderNum}` : undefined,
      notes,
    };

    onBookingComplete(newAppointment);
  };

  const yearsList = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
  const currentMakeObj = POPULAR_VEHICLES.find((v) => v.make === make) || POPULAR_VEHICLES[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Chip Zorro"
              referrerPolicy="no-referrer"
              className="h-8 w-auto object-contain block shrink-0"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Book Chip Repair & Mobile Dispatch
              </h2>
              <p className="text-xs text-slate-500">
                Step {currentStep} of 5 · 100% Windshield Repair Only (No Replacement)
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Step progress bar */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {[
            { num: 1, label: 'Vehicle', short: 'Vehicle' },
            { num: 2, label: 'Chip Details', short: 'Damage' },
            { num: 3, label: 'Mobile Dispatch', short: 'Dispatch' },
            { num: 4, label: 'Insurance / Pay', short: 'Payment' },
            { num: 5, label: 'Confirmation', short: 'Confirm' },
          ].map((s) => (
            <div key={s.num} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  currentStep >= s.num ? 'bg-orange-600' : 'bg-slate-200'
                }`}
              />
              <span
                className={`text-[10px] sm:text-[11px] block truncate ${
                  currentStep === s.num ? 'font-semibold text-orange-700' : 'text-slate-500'
                }`}
              >
                {s.num}. <span className="hidden sm:inline">{s.label}</span><span className="sm:hidden">{s.short}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* STEP 1: VEHICLE INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Vehicle & Windshield Zone</h3>
              <p className="text-xs text-slate-500">
                Tell us about your vehicle so our mobile tech brings the ideal resin viscosity and curing bridge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Make</label>
                <select
                  value={make}
                  onChange={(e) => {
                    setMake(e.target.value);
                    const found = POPULAR_VEHICLES.find((v) => v.make === e.target.value);
                    if (found && found.models.length > 0) {
                      setModel(found.models[0]);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                >
                  {POPULAR_VEHICLES.map((v) => (
                    <option key={v.make} value={v.make}>{v.make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                >
                  {currentMakeObj.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Windshield Visualizer */}
            <div className="pt-2">
              <InteractiveWindshieldVisualizer
                selectedDamage={damageType}
                onSelectDamage={(dmg, zone) => {
                  setDamageType(dmg);
                  setGlassLocation(zone as VehicleInfo['glassLocation']);
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: CHIP DAMAGE & QUANTITY */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Chip Damage Type & Quantity</h3>
              <p className="text-xs text-slate-500">
                Identify the fracture shape. We specialize strictly in repairs and never push replacements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setDamageType('rock_chip_bullseye')}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  damageType === 'rock_chip_bullseye'
                    ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-orange-700 uppercase">Most Common</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">$79 / $0 Ins</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Bullseye (Smooth Circle)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Dark circular ring caused by round gravel impact. Restores to 95-99% clarity under vacuum injection.
                </p>
              </div>

              <div
                onClick={() => setDamageType('rock_chip_starburst')}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  damageType === 'rock_chip_starburst'
                    ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500">Radiating Legs</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">$89 / $0 Ins</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Starburst Fracture</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Small hairline cracks branching outwards like a star. Pressure injection fills each leg to stop spreading.
                </p>
              </div>

              <div
                onClick={() => setDamageType('combination_break')}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  damageType === 'combination_break'
                    ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500">Pit + Star</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">$89 / $0 Ins</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Combination Break</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Deep center pit surrounded by radiating wings. High-tensile resin stabilizes both inner and outer layers.
                </p>
              </div>

              <div
                onClick={() => setDamageType('crack_small')}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  damageType === 'crack_small'
                    ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500">Under 6 Inches</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">$99 / $0 Ins</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Short Crack Stabilization</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Single linear crack up to 6 inches. Micro-drill stops the run before it reaches the outer edge of the windshield.
                </p>
              </div>
            </div>

            {/* Chip count selector */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                How many rock chips need repair on this vehicle?
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setChipCount(num)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${
                      chipCount === num
                        ? 'border-orange-600 bg-orange-600 text-white shadow-xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num === 1 ? '1 Chip' : `${num} Chips (Save +$30/ea)`}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Additional chips on the same vehicle are heavily discounted at only $30 each.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: MOBILE DISPATCH & SCHEDULING */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mobile Service Scheduling</h3>
              <p className="text-xs text-slate-500">
                Chip Zorro mobile vans are fully self-powered with UV rigs. We come right to your driveway or workplace.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-900">Service Location Address</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 1428 Maple Ridge Way"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">State</label>
                    <input
                      type="text"
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Zip Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-600 mb-1">Parking Clearance</label>
                  <select
                    value={parkingType}
                    onChange={(e) => setParkingType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                  >
                    <option value="Private Driveway">Private Driveway (Recommended)</option>
                    <option value="Office / Corporate Parking Lot">Office / Corporate Parking Lot</option>
                    <option value="Residential Street Parking">Residential Street Parking</option>
                    <option value="Apartment Covered Carport">Apartment Covered Carport</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Arrival Window</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                >
                  <option value="08:00 AM - 11:00 AM">Morning (08:00 AM - 11:00 AM)</option>
                  <option value="11:00 AM - 02:00 PM">Midday (11:00 AM - 02:00 PM)</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BILLING & OMEGA EDI */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Payment & Insurance Verification</h3>
              <p className="text-xs text-slate-500">
                Most insurance companies cover windshield chip repairs 100% with $0 deductible.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('insurance')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  paymentMethod === 'insurance'
                    ? 'border-orange-600 bg-orange-50/50 ring-1 ring-orange-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">Direct Insurance Claim</div>
                <p className="text-[11px] text-slate-500 mt-0.5">$0 Deductible for most drivers</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('self_pay')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  paymentMethod === 'self_pay'
                    ? 'border-orange-600 bg-orange-50/50 ring-1 ring-orange-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">Self-Pay / Card</div>
                <p className="text-[11px] text-slate-500 mt-0.5">${totalCost} Total flat rate</p>
              </button>
            </div>

            {paymentMethod === 'insurance' ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">Insurance Claim Info</span>
                  <span className="text-[11px] font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    We file it for you
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Insurance Carrier</label>
                    <select
                      value={insuranceCarrier}
                      onChange={(e) => setInsuranceCarrier(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    >
                      <option value="State Farm">State Farm</option>
                      <option value="Geico">Geico</option>
                      <option value="Progressive">Progressive</option>
                      <option value="Allstate">Allstate</option>
                      <option value="USAA">USAA</option>
                      <option value="Travelers">Travelers</option>
                      <option value="Liberty Mutual">Liberty Mutual</option>
                      <option value="Farmers">Farmers</option>
                      <option value="Other Carrier">Other Comprehensive Carrier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Policy Number</label>
                    <input
                      type="text"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      placeholder="e.g. SF-883019-X"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>$0 Out-of-Pocket:</strong> Insurance companies automatically waive the deductible on chip repairs because it prevents a $1,000+ windshield replacement claim!
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-semibold text-slate-900">Upfront Price Summary</div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Primary Chip Repair:</span>
                    <span className="font-medium tabular-nums">${getBaseCost().toFixed(2)}</span>
                  </div>
                  {chipCount > 1 && (
                    <div className="flex justify-between">
                      <span>Additional Chips ({chipCount - 1} × $30):</span>
                      <span className="font-medium tabular-nums">${additionalChipsCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Mobile Dispatch & UV Cure:</span>
                    <span className="text-emerald-700 font-medium">FREE ($0.00)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Flat Rate:</span>
                    <span className="tabular-nums">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Zero payment upfront. Pay your technician via credit card, Apple Pay, or cash after inspection.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: CONTACT & AUTOMATED CONFIRMATION */}
        {currentStep === 5 && (
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Contact Details & Confirmation</h3>
              <p className="text-xs text-slate-500">
                You will receive a confirmation with your work order, preparation tips, and technician dispatch link.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email (for your confirmation)</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone (for arrival updates)</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={smsOptIn}
                    onChange={(e) => setSmsOptIn(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <span>Send SMS arrival notification when mobile van is 15 min away</span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gate Code or Access Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Park in private driveway behind blue Subaru, gate code #5521..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Final Booking Overview Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-900">Work Order Overview</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>Vehicle: <span className="text-slate-900 font-medium">{year} {make} {model}</span></div>
                <div>Service: <span className="text-orange-700 font-bold">{chipCount} × Windshield Chip Repair</span></div>
                <div>Date: <span className="text-slate-900 font-medium">{appointmentDate}</span></div>
                <div>Arrival Window: <span className="text-slate-900 font-medium">{timeSlot}</span></div>
                <div>Location: <span className="text-slate-900 font-medium">{address}, {city}</span></div>
                <div>Billing: <span className="text-slate-900 font-medium">{paymentMethod === 'insurance' ? `${insuranceCarrier} ($0 Deductible Direct Claim)` : `$${totalCost} Self-Pay`}</span></div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <span>Confirm Booking</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step Navigation */}
        {currentStep < 5 && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
