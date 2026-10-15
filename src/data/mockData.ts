import { MobileTechnician, CustomerReview, BookingAppointment, EdiClaimRecord } from '../types';

export const INITIAL_TECHNICIANS: MobileTechnician[] = [
  {
    id: 'tech-1',
    name: 'Marcus "Zorro" Vance',
    title: 'Lead Chip Zorro Master Technician',
    vanNumber: 'Zorro Mobile Unit 01',
    phone: '(555) 794-2447',
    photoUrl: '/src/assets/images/hero_windshield_repair_1791783607090.jpg',
    certifications: ['NWRA Certified Master Repairer', 'UltraBond Resin Specialist', 'Delta Kits Certified'],
    currentLocationName: 'Northwest Metro / Westlake Hills',
    activeStatus: 'on_route',
    completedJobsToday: 5,
    rating: 4.99,
    currentOrderId: 'CZ-8012',
  },
  {
    id: 'tech-2',
    name: 'Sarah "Fox" Jenkins',
    title: 'Senior Mobile Repair Specialist',
    vanNumber: 'Zorro Mobile Unit 02',
    phone: '(555) 794-2448',
    photoUrl: '/src/assets/images/mobile_service_van_1791783617819.jpg',
    certifications: ['National Windshield Repair Assoc.', 'GlasWeld Injector Master', 'Factory Seal Preservationist'],
    currentLocationName: 'Downtown Tech District & Offices',
    activeStatus: 'on_site',
    completedJobsToday: 4,
    rating: 4.98,
    currentOrderId: 'CZ-8014',
  },
  {
    id: 'tech-3',
    name: 'David Chen',
    title: 'Precision Micro-Drill & Crack Specialist',
    vanNumber: 'Zorro Mobile Unit 03',
    phone: '(555) 794-2449',
    photoUrl: '/src/assets/images/hero_windshield_repair_1791783607090.jpg',
    certifications: ['Optical Polymer Expert', 'NWRA Master Level II', 'Fleet Glass Restorer'],
    currentLocationName: 'East Valley Residential',
    activeStatus: 'available',
    completedJobsToday: 3,
    rating: 4.97,
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Rachel M. Thornton',
    location: 'Westfield Heights',
    rating: 5,
    date: 'October 10, 2026',
    vehicle: '2024 Subaru Outback XT',
    serviceCategory: 'Bullseye Chip',
    title: 'Chip Zorro saved my factory windshield and kept my EyeSight calibration intact!',
    comment: 'A dealership told me I needed to replace the entire windshield for $1,400 because of my forward ADAS cameras. Chip Zorro came out with Zorro Mobile Unit 01. Marcus pulled vacuum with the bridge and injected optical resin. 20 minutes later, the bullseye chip vanished and the factory glass seal stayed 100% original. Zero out of pocket with State Farm!',
    savedReplacementCost: 1350,
    verifiedRepair: true,
    technicianMentioned: 'Marcus "Zorro" Vance',
  },
  {
    id: 'rev-2',
    author: 'Daniel Gallagher',
    location: 'Pine Crest Meadows',
    rating: 5,
    date: 'October 8, 2026',
    vehicle: '2023 Tesla Model Y',
    serviceCategory: 'Starburst Break',
    title: 'The fox logo caught my eye, and the repair exceeded every expectation.',
    comment: 'Got a nasty starburst chip with radiating legs on the highway. Sarah arrived right in my driveway, set up her vacuum injector bridge, and cured it with UV light. It went from glaring right in my vision to completely clear. The best part? Chip Zorro specializes ONLY in repairs, so no sleazy replacement sales pitch.',
    savedReplacementCost: 1100,
    verifiedRepair: true,
    technicianMentioned: 'Sarah "Fox" Jenkins',
  },
  {
    id: 'rev-3',
    author: 'Elena Rostova',
    location: 'Highland Park',
    rating: 5,
    date: 'October 4, 2026',
    vehicle: '2022 Ford F-150',
    serviceCategory: 'Mobile Driveway Service',
    title: 'Automated email confirmation arrived instantly, tech arrived 10 min early.',
    comment: 'Booked online at 7:15 AM, automated confirmation email was in my inbox with a preparation checklist. Mobile van rolled up at 9:30 AM. Process was super clean, no mess, and they handled the Geico claim electronically with direct insurance billing right on the spot.',
    savedReplacementCost: 850,
    verifiedRepair: true,
    technicianMentioned: 'Marcus "Zorro" Vance',
  },
  {
    id: 'rev-4',
    author: 'Marcus Sterling',
    location: 'Riverdale South',
    rating: 5,
    date: 'September 28, 2026',
    vehicle: '2025 BMW X5',
    serviceCategory: 'Short Crack Fix',
    title: 'Stabilized a 4-inch crack before it ruined my expensive HUD acoustic glass.',
    comment: 'I was afraid the crack would expand in the cold morning. David performed a micro-relief pit and vacuum resin fill. The crack stopped dead in its tracks. Driving away immediately without waiting 24 hours for urethane to cure was a huge relief.',
    savedReplacementCost: 1650,
    verifiedRepair: true,
    technicianMentioned: 'David Chen',
  },
  {
    id: 'rev-5',
    author: 'Sophia Chen',
    location: 'Sunnyvale Commons',
    rating: 5,
    date: 'September 20, 2026',
    vehicle: '2021 Honda CR-V',
    serviceCategory: 'Insurance $0 Deductible',
    title: 'Completely free through my insurance with direct electronic billing!',
    comment: 'Did not pay a single penny. Most insurance policies waive the deductible completely for chip repairs to avoid paying for a full replacement. Chip Zorro transmitted the claim electronically through their direct insurance billing gateway and gave me an instant receipt.',
    savedReplacementCost: 650,
    verifiedRepair: true,
    technicianMentioned: 'Sarah "Fox" Jenkins',
  },
];

export const INITIAL_BOOKINGS: BookingAppointment[] = [
  {
    id: 'book-1',
    orderNumber: 'CZ-8012',
    customerName: 'Marcus Albright',
    customerEmail: 'm.albright@example.com',
    customerPhone: '(555) 741-9923',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zipCode: '97477',
    damageType: 'rock_chip_bullseye',
    chipCount: 1,
    locationType: 'mobile',
    vehicle: {
      year: '2023',
      make: 'Subaru',
      model: 'Outback',
      bodyType: 'SUV',
      vin: '4S4BTANC7P3198421',
      glassLocation: 'Driver Line of Sight',
    },
    appointmentDate: '2026-10-12',
    timeSlot: '08:00 AM - 11:00 AM',
    paymentMethod: 'insurance',
    insuranceCarrier: 'State Farm Insurance',
    insurancePolicyNumber: 'SF-9482104-W',
    insuranceDeductible: 0,
    estimatedCost: 79,
    technicianId: 'tech-1',
    status: 'en_route',
    createdAt: '2026-10-11T19:30:00Z',
    repairMethodCode: 'WSR-1 / VACUUM-RESIN',
    omegaEdiStatus: 'lynx_approved',
    omegaEdiClaimId: 'EDI-CZ8012-SF',
    notes: 'Bullseye chip size of a dime on driver lower quadrant.',
  },
  {
    id: 'book-2',
    orderNumber: 'CZ-8014',
    customerName: 'Helena Berg',
    customerEmail: 'helena.b@example.org',
    customerPhone: '(555) 812-4410',
    address: '1204 Oakmont Boulevard',
    city: 'Cedar Valley',
    state: 'OR',
    zipCode: '97401',
    damageType: 'rock_chip_starburst',
    chipCount: 2,
    locationType: 'mobile',
    vehicle: {
      year: '2024',
      make: 'Toyota',
      model: 'RAV4',
      bodyType: 'Compact SUV',
      glassLocation: 'Center / Mirror Area',
    },
    appointmentDate: '2026-10-12',
    timeSlot: '11:00 AM - 02:00 PM',
    paymentMethod: 'self_pay',
    estimatedCost: 109,
    technicianId: 'tech-2',
    status: 'dispatched',
    createdAt: '2026-10-11T20:15:00Z',
    repairMethodCode: 'WSR-2 / DUAL-CHIP',
    omegaEdiStatus: 'not_submitted',
    notes: '2 rock chips from gravel truck on highway.',
  },
];

export const INITIAL_EDI_CLAIMS: EdiClaimRecord[] = [
  {
    id: 'edi-claim-1',
    workOrderNumber: 'CZ-8012',
    claimControlNumber: 'CLM20261011-CZ012',
    carrierName: 'State Farm Insurance Co.',
    policyNumber: 'SF-9482104-W',
    insuredName: 'Marcus Albright',
    vehicleVin: '4S4BTANC7P3198421',
    ediServiceCode: 'WSR-1',
    damageDescription: 'Windshield Rock Chip Repair - Vacuum Resin Injection (Single Bullseye)',
    totalClaimAmount: 79.00,
    deductiblePaid: 0.00, // Insurers waive 100% deductible on chip repairs!
    netBilledAmount: 79.00,
    submissionDate: '2026-10-11 20:05 UTC',
    networkGateway: 'Lynx Services',
    status: 'Lynx Authorized',
    responseAuthCode: 'LX-AUTH-CZ8012-OK',
    ediPayloadSnippet: `ISA*00*          *00*          *ZZ*CHIPZORRO      *01*LYNXSERV       *261011*2005*U*00401*000000012*0*P*>~
GS*HC*CHIPZORRO*LYNXSERV*20261011*2005*12*X*004010X098A1~
ST*837*0012~
BHT*0019*00*CLM20261011-CZ012*20261011*2005*CH~
NM1*85*2*CHIP ZORRO WINDSHIELD REPAIR*****XX*1948201948~
PER*IC*CHIP ZORRO CLAIMS DESK*TE*8005552447*EM*claims@chipzorro.com~
NM1*PR*2*STATE FARM INSURANCE*****PI*SF-GLASS-01~
NM1*IL*1*ALBRIGHT*MARCUS****MI*SF-9482104-W~
CLM*CZ-8012*79.00***11:B:1*Y*A*Y*Y~
REF*D9*CLAIM-4S4BTANC7P3198421~
SV1*HC:WSR-1:GLASS-REPAIR*79.00*UN*1***1~
CAS*PR*1*0.00~
SE*12*0012~
GE*1*12~
IEA*1*000000012~`,
  },
  {
    id: 'edi-claim-2',
    workOrderNumber: 'CZ-8009',
    claimControlNumber: 'CLM20261010-CZ009',
    carrierName: 'Geico Direct Auto',
    policyNumber: 'GC-440912-PA',
    insuredName: 'Sophia Chen',
    vehicleVin: '2HKRW2H87MH102941',
    ediServiceCode: 'WSR-1',
    damageDescription: 'Windshield Rock Chip Repair - Starburst Fracture Resin Injection',
    totalClaimAmount: 79.00,
    deductiblePaid: 0.00,
    netBilledAmount: 79.00,
    submissionDate: '2026-10-10 16:42 UTC',
    networkGateway: 'Safelite Solutions / SGC',
    status: 'Settled (835)',
    responseAuthCode: 'SGC-AUTH-CZ009-PD',
    ediPayloadSnippet: `ISA*00*          *00*          *ZZ*CHIPZORRO      *01*SAFELITE       *261010*1642*U*00401*000000009*0*P*>~
GS*HC*CHIPZORRO*SAFELITE*20261010*1642*09*X*004010X098A1~
ST*837*0009~
BHT*0019*00*CLM20261010-CZ009*20261010*1642*CH~
NM1*85*2*CHIP ZORRO WINDSHIELD REPAIR*****XX*1948201948~
NM1*PR*2*GEICO CASUALTY*****PI*GC-GLASS-EDI~
NM1*IL*1*CHEN*SOPHIA****MI*GC-440912-PA~
CLM*CZ-8009*79.00***11:B:1*Y*A*Y*Y~
SV1*HC:WSR-1:GLASS-REPAIR*79.00*UN*1***1~
CAS*PR*1*0.00~
SE*11*0009~
GE*1*09~
IEA*1*000000009~`,
  },
];

export const POPULAR_VEHICLES = [
  { make: 'Toyota', models: ['RAV4', 'Camry', 'Corolla', 'Highlander', 'Tacoma', 'Tundra'] },
  { make: 'Honda', models: ['CR-V', 'Civic', 'Accord', 'Pilot', 'HR-V'] },
  { make: 'Ford', models: ['F-150', 'Explorer', 'Escape', 'Edge', 'Mustang', 'Bronco'] },
  { make: 'Chevrolet', models: ['Silverado 1500', 'Equinox', 'Tahoe', 'Suburban', 'Traverse'] },
  { make: 'Subaru', models: ['Outback', 'Forester', 'Crosstrek', 'Ascent', 'Impreza'] },
  { make: 'Tesla', models: ['Model Y', 'Model 3', 'Model X', 'Model S'] },
  { make: 'Jeep', models: ['Grand Cherokee', 'Wrangler', 'Gladiator', 'Compass'] },
  { make: 'BMW', models: ['X3', 'X5', '3 Series', '5 Series'] },
  { make: 'Hyundai', models: ['Tucson', 'Santa Fe', 'Elantra', 'Sonata', 'Palisade'] },
];

export function generateEdiPayload(booking: BookingAppointment): string {
  const dateFormatted = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const timeFormatted = new Date().toTimeString().slice(0, 5).replace(/:/g, '');
  const claimId = booking.orderNumber.replace('CZ-', '');
  const carrier = booking.insuranceCarrier || 'DIRECT INSURER';
  const total = booking.estimatedCost.toFixed(2);
  const vin = booking.vehicle.vin || '1HGCR2F84NA009182';
  const code = booking.chipCount > 1 ? 'WSR-2' : 'WSR-1';

  return `ISA*00*          *00*          *ZZ*CHIPZORRO      *01*OMEGAEDI-GW    *${dateFormatted}*${timeFormatted}*U*00401*00000${claimId}*0*P*>~
GS*HC*CHIPZORRO*OMEGAEDI*20${dateFormatted}*${timeFormatted}*${claimId}*X*004010X098A1~
ST*837*00${claimId}~
BHT*0019*00*CLM-2026-${claimId}*20${dateFormatted}*${timeFormatted}*CH~
NM1*85*2*CHIP ZORRO WINDSHIELD REPAIR*****XX*1948201948~
PER*IC*CHIP ZORRO CLAIMS DESK*TE*8005552447*EM*claims@chipzorro.com~
NM1*PR*2*${carrier.toUpperCase()}*****PI*EDI-CARRIER-992~
NM1*IL*1*${booking.customerName.toUpperCase()}****MI*${booking.insurancePolicyNumber || 'POL-PENDING'}~
N3*${booking.address.toUpperCase()}~
N4*${booking.city.toUpperCase()}*${booking.state}*${booking.zipCode}~
CLM*${booking.orderNumber}*${total}***11:B:1*Y*A*Y*Y~
REF*D9*CLAIM-${vin}~
CAS*PR*1*0.00~
SV1*HC:${code}:WINDSHIELD-CHIP-REPAIR*${total}*UN*${booking.chipCount}***1~
SE*14*00${claimId}~
GE*1*${claimId}~
IEA*1*00000${claimId}~`;
}

export const DEFAULT_SITE_SETTINGS = {
  businessName: 'Chip Zorro Windshield Repair',
  phone: '8005552447',
  phoneDisplay: '(800) 555-2447',
  dispatchEmail: 'dispatch@chipzorro.com',
  serviceRadiusMiles: 45,
  serviceHours: 'Mon - Sat: 7:00 AM - 7:00 PM | Sun: Emergency Fleet Only',
  announcementText: 'Current Dispatch: 35–45 Min · Mobile Van Comes To You',
  announcementActive: true,
  dispatchEtaMinutes: '35–45 Min',
  pricing: {
    baseBullseye: 99,
    baseStarburst: 99,
    baseCombination: 99,
    baseSmallCrack: 99,
    additionalChipRate: 30,
    waiveDeductibleWithInsurance: true,
  },
  adminPassword: 'admin123',
};
